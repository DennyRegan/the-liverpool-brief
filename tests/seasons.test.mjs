import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { SeasonSchema, getSeasons, getSeasonEras, getSeasonArchiveArticles, leagueFinish } from '../lib/content/seasons.ts';
import { getArchiveFeatures } from '../lib/content/archive.ts';

const seasons = () => getSeasons();
const example = () => structuredClone(seasons()[0]);
function withRoot(run) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'liverpool-seasons-'));
  try {
    fs.cpSync('content/history/liverpool', path.join(root, 'content/history/liverpool'), { recursive: true });
    return run(root);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
}
function write(root, data, filename = `${data.season}.json`) {
  fs.writeFileSync(path.join(root, 'content/history/liverpool/seasons', filename), JSON.stringify(data));
}

test('the first ten researched seasons are complete and chronologically ordered', () => {
  const available = seasons();
  assert.deepEqual(available.map(s => s.season), available.map(s => s.season).toSorted());
  const all = available.filter(s => s.season >= '1959-60' && s.season <= '1968-69');
  assert.deepEqual(all.map(s => s.season), Array.from({ length: 10 }, (_, i) => `${1959 + i}-${60 + i}`));
  assert.deepEqual(all.map(s => s.league.position), [3, 3, 1, 8, 1, 7, 1, 5, 3, 2]);
  assert.deepEqual(all.map(s => s.topScorers.map(p => [p.personId, p.goals])), [
    [['roger-hunt', 23]], [['kevin-lewis', 22]], [['roger-hunt', 42]], [['roger-hunt', 26]], [['roger-hunt', 33]],
    [['roger-hunt', 37]], [['roger-hunt', 32]], [['roger-hunt', 19]], [['roger-hunt', 30]], [['roger-hunt', 17]],
  ]);
  assert.deepEqual(all[0].managerIds, ['phil-taylor', 'bill-shankly']);
  for (const season of all) {
    assert.ok(season.overview.length > 0);
    assert.ok(season.events.length > 0);
    assert.ok(season.sources.some(source => source.confidence === 'high'));
  }
});

test('competition participation is historical rather than a fixed display template', () => {
  const entered = id => seasons().find(s => s.season === id).competitions.map(c => c.competitionId);
  assert.deepEqual(entered('1959-60'), ['fa-cup']);
  assert.ok(entered('1960-61').includes('league-cup'));
  for (const id of ['1961-62', '1962-63', '1963-64', '1964-65', '1965-66', '1966-67']) assert.ok(!entered(id).includes('league-cup'), id);
  assert.ok(entered('1967-68').includes('league-cup'));
  assert.ok(entered('1968-69').includes('league-cup'));
  assert.ok(!entered('1963-64').includes('charity-shield'));
  assert.ok(entered('1964-65').includes('european-cup'));
});

test('strict records reject unknown sources, duplicates, fabricated trophies and malformed dates', () => {
  const invalid = [
    s => { s.league.sourceIds = ['missing-source']; },
    s => { s.sources.push(s.sources[0]); },
    s => { s.events.push(s.events[0]); },
    s => { s.topScorers.push(s.topScorers[0]); },
    s => { s.trophyIds = ['european-cup']; },
    s => { s.managerIds.push(s.managerIds[0]); },
    s => { s.league.position = 1; s.trophyIds = []; },
    s => { s.transfers.in.push(s.transfers.in[0]); },
    s => { s.relatedSeasons = [s.season]; },
    s => { s.reviewedOn = '2026-02-30'; },
    s => { s.season = '1959-61'; },
    s => { s.sources[0].url = 'http://example.com'; },
    s => { s.overview = [' ']; },
    s => { s.unrecognisedField = 'lost editorial data'; },
  ];
  for (const mutate of invalid) { const value = example(); mutate(value); assert.equal(SeasonSchema.safeParse(value).success, false, mutate.toString()); }
});

test('file, canonical entity kind and missing related season failures identify the season', () => withRoot(root => {
  for (const mutate of [
    s => { s.managerIds = ['unregistered-manager']; },
    s => { s.keyPlayerIds = ['first-division']; },
    s => { s.league.competitionId = 'bill-shankly'; },
    s => { s.transfers.in[0].personId = 'first-division'; },
    s => { s.events[0].personIds = ['unregistered-person']; },
    s => { s.relatedSeasons = ['2026-27']; },
  ]) {
    const value = example(); mutate(value); write(root, value);
    assert.throws(() => getSeasons(root), /Invalid season 1959-60\.json/);
  }
  write(root, example());
  write(root, example(), 'wrong-filename.json');
  assert.throws(() => getSeasons(root), /wrong-filename\.json.*filename/);
}));

test('future seasons need only data and shared entities, with no hard-coded upper year', () => withRoot(root => {
  const future = { ...example(), season: '2026-27', relatedSeasons: ['1959-60'] };
  write(root, future);
  assert.equal(getSeasons(root).at(-1).season, '2026-27');
}));

test('season-to-era links reuse tenure dates and retain both sides of a managerial change', () => {
  assert.deepEqual(getSeasonEras('1964-65').map(e => e.id), ['bill-shankly']);
  assert.deepEqual(getSeasonEras('1990-91').map(e => e.id), ['kenny-dalglish-1985-1991', 'ronnie-moran-1991', 'graeme-souness']);
  assert.deepEqual(getSeasonEras('not-a-season'), []);
});

test('Archive links use exact normalised metadata, preserve originals and deduplicate by canonical slug', () => {
  const original = { slug: 'promotion-fixture', season: '1961/62', title: 'Original promotion essay', body: 'Editor’s unchanged prose.' };
  const other = { slug: 'unrelated', season: '1962-63' };
  const actual = getSeasonArchiveArticles('1961-62', [original, other, { ...original }, { slug: 'missing-season' }]);
  assert.deepEqual(actual, [original]);
  assert.equal(actual[0], original);
  assert.deepEqual(getSeasonArchiveArticles('invalid', [original]), []);
  const archive = getArchiveFeatures();
  assert.equal(getSeasonArchiveArticles('1978-79', archive)[0].slug, 'liverpool-7-tottenham-0');
  assert.deepEqual(getSeasonArchiveArticles('1959-60', [original, other]), [], 'No unrelated filler when metadata does not match');
});

test('league positions retain correct ordinal labels across divisions', () => {
  for (const [position, expected] of [[1,'Champions'], [2,'2nd'], [3,'3rd'], [8,'8th'], [11,'11th'], [12,'12th'], [13,'13th'], [21,'21st'], [22,'22nd']]) assert.equal(leagueFinish(position), expected);
});
