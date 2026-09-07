import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getArchiveFeatures } from '../lib/content/archive.ts';
import { ArchiveFeatureSchema } from '../lib/content/types.ts';
import { EraSchema, HistorySchema, getHistory, getArticleEraIds, getEraArticles, getEraImage, eraYears } from '../lib/content/history.ts';

const history = getHistory();
const { eras } = history;
const piece = (slug, eventDate, ids) => ({ slug, date: '2026-09-07', historicalEventDate: eventDate, historyEras: ids });
const idsFor = date => getArticleEraIds(piece('match', date), eras);

test('complete chronology distinguishes both Dalglish spells, caretaker and joint management', () => {
  assert.equal(eras.length, 16);
  assert.equal(eras[0].id, 'bill-shankly');
  assert.equal(eras.at(-1).id, 'andoni-iraola');
  assert.equal(eras.at(-1).endDate, null);
  assert.deepEqual(eras.filter(era => era.manager === 'Kenny Dalglish').map(era => era.id), ['kenny-dalglish-1985-1991', 'kenny-dalglish-2011-2012']);
  assert.ok(eras.some(era => era.id === 'evans-houllier-1998'));
  assert.ok(eras.some(era => era.id === 'ronnie-moran-1991'));
  assert.equal(eraYears(eras.at(-1)), '2026–present');
});

test('both existing articles are selected unchanged through the real Archive loader', () => {
  const articles = getArchiveFeatures();
  const spurs = articles.find(article => article.slug === 'liverpool-7-tottenham-0');
  const palace = articles.find(article => article.slug === 'liverpool-9-crystal-palace-0');
  assert.deepEqual(getArticleEraIds(spurs, eras), ['bob-paisley']);
  assert.deepEqual(getArticleEraIds(palace, eras), ['kenny-dalglish-1985-1991']);
  assert.ok(getEraArticles(articles, 'bob-paisley', eras).includes(spurs));
  assert.ok(getEraArticles(articles, 'kenny-dalglish-1985-1991', eras).includes(palace));
  assert.deepEqual(getEraArticles([spurs, palace], 'joe-fagan', eras), []);
});

test('a newly published dated article appears automatically without editing History data', () => {
  const article = piece('new-paisley-match', '1981-05-27');
  const all = [...getArchiveFeatures(), article];
  assert.ok(getEraArticles(all, 'bob-paisley', eras).includes(article));
  assert.ok(getEraArticles(all, 'bob-paisley', eras).length > 1);
});

test('explicit multiple contexts override a biography anchor date and stay canonical', () => {
  const career = piece('career', '1978-09-02', ['bob-paisley', 'kenny-dalglish-1985-1991', 'kenny-dalglish-2011-2012']);
  for (const id of career.historyEras) assert.equal(getEraArticles([career], id, eras)[0], career);
  assert.deepEqual(getEraArticles([career], 'joe-fagan', eras), []);
  assert.deepEqual(getArticleEraIds(piece('override', '1978-09-02', ['joe-fagan']), eras), ['joe-fagan']);
  assert.deepEqual(getArticleEraIds(piece('undated-career', undefined, ['bill-shankly', 'bob-paisley']), eras), ['bill-shankly', 'bob-paisley']);
});

test('date boundaries put matches in the correct tenure, including same-day handovers', () => {
  const cases = {
    '1959-11-30': [], '1959-12-01': ['bill-shankly'],
    '1974-07-12': ['bill-shankly'], '1974-07-20': [], '1974-07-26': ['bob-paisley'],
    '1985-05-29': ['joe-fagan'], '1985-05-30': ['kenny-dalglish-1985-1991'],
    '1991-02-21': ['kenny-dalglish-1985-1991'], '1991-02-22': ['ronnie-moran-1991'],
    '1998-07-15': ['roy-evans'], '1998-07-16': ['evans-houllier-1998'],
    '1998-11-11': ['evans-houllier-1998'], '1998-11-12': ['gerard-houllier'],
    '2011-01-07': ['roy-hodgson'], '2011-01-08': ['kenny-dalglish-2011-2012'],
    '2024-05-19': ['jurgen-klopp'], '2024-06-01': ['arne-slot'],
    '2026-05-30': ['arne-slot'], '2026-06-01': [], '2026-06-04': ['andoni-iraola'],
  };
  for (const [date, ids] of Object.entries(cases)) assert.deepEqual(idsFor(date), ids, date);
});

test('publication dates, manager names and free-form historicalPeriod never guess an era', () => {
  assert.deepEqual(getArticleEraIds({ slug: 'biography', date: '1981-05-27', manager: 'Kenny Dalglish', historicalPeriod: '1970s–1980s' }, eras), []);
});

test('unknown era IDs fail with the offending article, without silently dropping writing', () => {
  assert.throws(() => getArticleEraIds(piece('new-piece', undefined, ['kenny-dalglish']), eras), /new-piece.*unknown historyEras ID "kenny-dalglish"/);
});

test('selection sorts by publication date, breaks ties and deduplicates without mutating input', () => {
  const a = piece('a', '1978-09-02');
  const b = piece('b', '1978-09-02');
  const old = { ...piece('old', '1981-05-27'), date: '2026-09-01' };
  const items = [b, old, a, a];
  const before = [...items];
  assert.deepEqual(getEraArticles(items, 'bob-paisley', eras), [a, b, old]);
  assert.deepEqual(items, before);
});

test('invalid frontmatter and history data are rejected', () => {
  const base = getArchiveFeatures()[0];
  for (const historyEras of ['bob-paisley', [], ['bob-paisley', 'bob-paisley']]) {
    assert.equal(ArchiveFeatureSchema.safeParse({ ...base, historyEras }).success, false);
  }
  assert.equal(ArchiveFeatureSchema.safeParse({ ...base, historicalEventDate: '1981-02-30' }).success, false);
  assert.equal(EraSchema.safeParse({ ...eras[0], endDate: '1950-01-01' }).success, false);
  assert.equal(HistorySchema.safeParse({ ...history, eras: [eras[0], eras[0]] }).success, false);
  assert.equal(HistorySchema.safeParse({ ...history, eras: [...eras].reverse() }).success, false);
  assert.equal(HistorySchema.safeParse({ ...history, eras: [{ ...eras[0], endDate: null }, ...eras.slice(1)] }).success, false);
});

test('artwork is optional; missing files fall back, local files work and unsafe paths fail', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lfc-portraits-'));
  try {
    assert.equal(getEraImage(eras[0], root), undefined);
    const image = { src: '/images/history/shankly.webp', alt: 'Editorial illustration of Bill Shankly', width: 600, height: 750 };
    const era = EraSchema.parse({ ...eras[0], image });
    assert.equal(getEraImage(era, root), undefined);
    fs.mkdirSync(path.join(root, 'public/images/history'), { recursive: true });
    fs.writeFileSync(path.join(root, 'public/images/history/shankly.webp'), 'fixture');
    assert.deepEqual(getEraImage(era, root), image);
    for (const src of ['https://example.com/photo.jpg', '/images/history/../../secret.png']) {
      assert.equal(EraSchema.safeParse({ ...era, image: { ...image, src } }).success, false);
    }
    assert.equal(EraSchema.safeParse({ ...era, image: { ...image, alt: '' } }).success, false);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('honour counts are derived from verified winning seasons, not a separate total', () => {
  const paisley = eras.find(era => era.id === 'bob-paisley');
  assert.equal(paisley.honours.find(h => h.name === 'European Cup').years.length, 3);
  assert.equal(paisley.honours.find(h => h.name === 'First Division').years.length, 6);
  const klopp = eras.find(era => era.id === 'jurgen-klopp');
  assert.equal(klopp.honours.find(h => h.name === 'League Cup').years.length, 2);
  assert.equal(eras.find(era => era.id === 'kenny-dalglish-2011-2012').honours[0].years[0], '2012');
});
