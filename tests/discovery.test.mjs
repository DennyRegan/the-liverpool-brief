import test from 'node:test';
import assert from 'node:assert/strict';
import { getRelatedArchiveArticles } from '../lib/content/discovery.ts';
import { getHistory } from '../lib/content/history.ts';

const { eras } = getHistory();
const entities = [
  { id: 'john-barnes', label: 'John Barnes', kind: 'person' },
  { id: 'kenny-dalglish', label: 'Kenny Dalglish', kind: 'person' },
  { id: 'ian-rush', label: 'Ian Rush', kind: 'person' },
  { id: 'tottenham-hotspur', label: 'Tottenham', kind: 'opposition' },
  { id: 'crystal-palace', label: 'Crystal Palace', kind: 'opposition' },
  { id: 'first-division', label: 'First Division', kind: 'competition' },
  { id: 'european-cup', label: 'European Cup', kind: 'competition' },
  { id: 'anfield', label: 'Anfield', kind: 'location' },
  { id: 'changing-attack', label: 'A changing attack', kind: 'theme' },
  { id: 'farewells', label: 'Farewells', kind: 'theme' },
  { id: 'record-wins', label: 'Record wins', kind: 'theme' },
];
const piece = (slug, fields = {}) => ({
  slug, title: slug, historicalPeriod: '1980s', excerpt: `About ${slug}`,
  date: '2026-09-09', body: `Original writing: ${slug}`, ...fields,
});
const related = (current, articles, limit) => getRelatedArchiveArticles(current, articles, eras, entities, limit);

test('recommendations exclude the current slug and deduplicate canonical articles', () => {
  const current = piece('current', { playerIds: ['john-barnes'] });
  const other = piece('other', { playerIds: ['john-barnes'] });
  const input = [current, { ...current }, other, other, { ...other }];
  const before = structuredClone(input);
  const results = related(current, input);
  assert.equal(results.length, 1);
  assert.equal(results[0].article, other);
  assert.deepEqual(results[0], { article: other, score: 5, reasons: ['John Barnes'] });
  assert.deepEqual(input, before);
});

test('a shared person connects player and manager roles symmetrically and counts once', () => {
  const player = piece('player', { playerIds: ['kenny-dalglish'] });
  const manager = piece('manager', { managerIds: ['kenny-dalglish'] });
  const both = piece('both', { playerIds: ['kenny-dalglish'], managerIds: ['kenny-dalglish'] });
  assert.equal(related(player, [manager])[0].score, 5);
  assert.equal(related(manager, [player])[0].score, 5);
  assert.deepEqual(related(player, [manager])[0].reasons, ['Kenny Dalglish']);
  assert.equal(related(both, [player])[0].score, 5);
  assert.equal(related(both, [both, { ...both, slug: 'another-both' }])[0].score, 5);
});

test('central people and the same season rank above broad contextual relationships', () => {
  const current = piece('current', {
    season: '1987-88', playerIds: ['john-barnes'], managerIds: ['kenny-dalglish'],
    oppositionIds: ['tottenham-hotspur'], historyEras: ['kenny-dalglish-1985-1991'],
    competitionIds: ['first-division'], themeIds: ['changing-attack'],
  });
  const contextual = piece('contextual', { oppositionIds: ['tottenham-hotspur'], historyEras: current.historyEras });
  const player = piece('player', { playerIds: ['john-barnes'], competitionIds: ['first-division'] });
  const strongest = piece('strongest', { season: '1987-88', managerIds: ['kenny-dalglish'] });
  const results = related(current, [contextual, player, strongest]);
  assert.deepEqual(results.map(({ article, score }) => [article.slug, score]), [
    ['strongest', 12], ['player', 6], ['contextual', 5],
  ]);
  assert.deepEqual(results[0].reasons, ['Kenny Dalglish', '1987–88']);
  assert.deepEqual(results[2].reasons, ['Against Tottenham', 'Same era']);
});

test('a season alone is a specific strong connection and publication dates are not seasons', () => {
  const current = piece('current', { season: '1987-88' });
  const same = piece('same', { season: '1987-88' });
  const otherSeason = piece('other-season', { season: '1988-89' });
  const results = getRelatedArchiveArticles(current, [same, otherSeason, piece('same-publication-date')], [], entities);
  assert.deepEqual(results, [{ article: same, score: 5, reasons: ['1987–88'] }]);
});

test('existing season spellings match through one normalized season key', () => {
  const current = piece('current', { season: '1987-88' });
  for (const season of ['1987/88', '1987–88', '1987-1988']) {
    const other = piece('same', { season });
    assert.deepEqual(related(current, [other]), [
      { article: other, score: 7, reasons: ['1987–88', 'Same era'] },
    ]);
  }
  const invalid = piece('invalid', { season: '1987-89' });
  assert.deepEqual(related(invalid, [piece('also-invalid', { season: '1987-89' })]), []);
});

test('era, competition, location and decade cannot create filler without a specific connection', () => {
  const broad = {
    historyEras: ['bob-paisley'], competitionIds: ['first-division', 'european-cup'],
    locationIds: ['anfield'], decade: '1970s',
  };
  const current = piece('current', broad);
  assert.deepEqual(related(current, [piece('broad-overlap', broad)]), []);
  assert.deepEqual(related(piece('empty'), [piece('also-empty')]), []);
  assert.deepEqual(related(current, []), []);
  assert.deepEqual(related(current, [current]), []);
});

test('weak specific connections are omitted unless their total reaches the quality threshold', () => {
  const current = piece('current', {
    oppositionIds: ['tottenham-hotspur'], themeIds: ['record-wins'],
    historyEras: ['bob-paisley'], competitionIds: ['first-division'],
  });
  const sameOpponent = piece('only-opponent', { oppositionIds: ['tottenham-hotspur'] });
  const sameTheme = piece('theme-era', { themeIds: ['record-wins'], historyEras: ['bob-paisley'] });
  const themeContext = piece('theme-era-league', {
    themeIds: ['record-wins'], historyEras: ['bob-paisley'], competitionIds: ['first-division'],
  });
  assert.deepEqual(related(current, [sameOpponent, sameTheme, themeContext]), [
    { article: themeContext, score: 5, reasons: ['Record wins', 'Same era'] },
  ]);
});

test('repeated and broad array metadata cannot inflate a relationship score', () => {
  const metadata = {
    playerIds: ['kenny-dalglish', 'john-barnes', 'ian-rush', 'john-barnes'],
    managerIds: ['kenny-dalglish'], season: '1987-88',
    oppositionIds: ['tottenham-hotspur', 'crystal-palace', 'tottenham-hotspur'],
    competitionIds: ['first-division', 'european-cup', 'first-division'],
    historyEras: ['bob-paisley', 'kenny-dalglish-1985-1991'],
    themeIds: ['farewells', 'changing-attack', 'record-wins', 'record-wins'],
  };
  const result = related(piece('current', metadata), [piece('other', metadata)])[0];
  assert.equal(result.score, 25); // 10 people + 5 season + 3 opposition + 2 era + 1 competition + 4 themes.
  assert.deepEqual(result.reasons, ['Kenny Dalglish', 'John Barnes']);
  assert.equal(result.reasons.length, 2);
});

test('person reasons follow the current editorial order without changing scores or symmetry', () => {
  const current = piece('current', { playerIds: ['john-barnes', 'ian-rush'], managerIds: ['kenny-dalglish'] });
  const other = piece('other', { playerIds: ['ian-rush', 'john-barnes'], managerIds: ['kenny-dalglish'] });
  const forward = related(current, [other])[0];
  const reverse = related(other, [current])[0];
  const reordered = related({ ...current, playerIds: ['ian-rush', 'john-barnes'] }, [other])[0];
  assert.deepEqual(forward.reasons, ['John Barnes', 'Ian Rush']);
  assert.deepEqual(reverse.reasons, ['Ian Rush', 'John Barnes']);
  assert.deepEqual(reordered.reasons, ['Ian Rush', 'John Barnes']);
  assert.equal(forward.score, 10);
  assert.equal(reverse.score, forward.score);
  assert.equal(reordered.score, forward.score);
});

test('tie order uses publication date then slug and stays stable when input order changes', () => {
  const current = piece('current', { playerIds: ['john-barnes'] });
  const a = piece('a', { playerIds: ['john-barnes'] });
  const b = piece('b', { playerIds: ['john-barnes'] });
  const old = piece('old', { date: '2026-09-01', playerIds: ['john-barnes'] });
  const oldest = piece('oldest', { date: '2026-08-01', playerIds: ['john-barnes'] });
  assert.deepEqual(related(current, [oldest, old, b, a]).map(r => r.article), [a, b, old]);
  assert.deepEqual(related(current, [b, old, a, oldest]).map(r => r.article), [a, b, old]);
  assert.deepEqual(related(current, [old, b, a], 1).map(r => r.article), [a]);
  assert.deepEqual(related(current, [a], 0), []);
  assert.deepEqual(related(current, [a], -1), []);
});

test('era support reuses historical event placement and respects explicit multi-era context', () => {
  const current = piece('current', { historicalEventDate: '1978-09-02', oppositionIds: ['tottenham-hotspur'] });
  const dated = piece('dated', { historicalEventDate: '1981-05-27', oppositionIds: ['tottenham-hotspur'] });
  const explicit = piece('career', {
    historicalEventDate: '1998-01-01', historyEras: ['bob-paisley', 'kenny-dalglish-1985-1991'],
    oppositionIds: ['tottenham-hotspur'],
  });
  const publicationOnly = piece('published-during-era', { date: '1981-05-27', oppositionIds: ['tottenham-hotspur'] });
  assert.deepEqual(related(current, [dated, explicit, publicationOnly]).map(r => [r.article.slug, r.score]), [
    ['career', 5], ['dated', 5],
  ]);
});

test('legacy display names and prose mentions never become implicit relationships', () => {
  const current = piece('current', { manager: 'Kenny Dalglish', body: 'John Barnes at Anfield in 1987–88.' });
  const legacy = piece('legacy', { manager: 'Kenny Dalglish', body: 'John Barnes at Anfield in 1987–88.' });
  assert.deepEqual(related(current, [legacy]), []);
});
