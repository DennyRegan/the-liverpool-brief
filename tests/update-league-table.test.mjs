import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getMatchCentre } from '../lib/content/match-centre.ts';
import { readLeagueTable } from '../scripts/lib/prepare-league-table.mjs';
import { prepareAutomaticTable, readLiverpoolResults, updateLeagueTable } from '../scripts/lib/update-league-table.mjs';
import { skyTable, skyResult, addedLiverpoolWin, getTestMatchCentre } from './fixtures/league-table.mjs';

const current = getTestMatchCentre(), now = new Date('2026-10-13T12:00:00Z');
const changed = skyTable(addedLiverpoolWin(current));
const resultPages = [{ month: '2026-10', html: skyResult() }];
async function withRoot(fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'table-updater-test-'));
  try { fs.cpSync('content', path.join(root, 'content'), { recursive: true }); fs.writeFileSync(path.join(root, 'content/match-centre/liverpool/current.json'), JSON.stringify({season: current.season})); fs.writeFileSync(path.join(root, `content/match-centre/liverpool/${current.season}.json`), JSON.stringify(current)); await fn(root, path.join(root, `content/match-centre/liverpool/${current.season}.json`)); }
  finally { fs.rmSync(root, { recursive: true, force: true }); }
}

test('complete table plus explicit full-time result preserves fixture identity and strict reconciliation', () => {
  const before = JSON.stringify(current);
  const { proposal, updatedFixtures, changes } = prepareAutomaticTable(changed, resultPages, current, now);
  assert.equal(proposal.table.rows.length, 20); assert.ok(changes.length >= 2);
  const id = '2026-27-premier-league-manchester-city-home';
  assert.deepEqual(updatedFixtures, [id]);
  const original = current.fixtures.find(f => f.id === id), result = proposal.fixtures.find(f => f.id === id);
  assert.equal(result.date, original.date); assert.equal(result.kickoff, original.kickoff); assert.deepEqual(result.score, { home: 2, away: 1 });
  assert.equal(result.status, 'completed'); assert.ok(result.sourceIds.includes('sky-results-2026-10'));
  assert.equal(proposal.sources.find(s => s.id === 'sky-results-2026-10').url, 'https://www.skysports.com/liverpool-scores-fixtures/2026-10-01');
  assert.equal(JSON.stringify(current), before);
});

test('incomplete, duplicate, missing or unknown teams and duplicate positions fail', () => {
  const rows = addedLiverpoolWin(current);
  assert.throws(() => prepareAutomaticTable(skyTable(rows.slice(1)), resultPages, current, now), /20 Premier League/);
  const duplicate = structuredClone(rows); duplicate[1].clubId = duplicate[0].clubId;
  assert.throws(() => prepareAutomaticTable(skyTable(duplicate), resultPages, current, now), /clubs differ|Duplicate/);
  const unknown = structuredClone(rows); unknown[0].clubId = 'unknown-club';
  assert.throws(() => prepareAutomaticTable(skyTable(unknown), resultPages, current, now), /clubs differ/);
  const positions = structuredClone(rows); positions[1].position = positions[0].position;
  assert.throws(() => prepareAutomaticTable(skyTable(positions), resultPages, current, now), /Duplicate/);
});

test('malformed numbers, points adjustments, stale/future snapshots and inconsistent league totals fail', () => {
  assert.throws(() => prepareAutomaticTable(changed.replace('data-live-key="pld"><span>6', 'data-live-key="pld"><span>six'), resultPages, current, now), /missing or invalid/);
  assert.throws(() => readLeagueTable(skyTable(current.table.rows, '20 September, 1:55pm'), current, now), /older/);
  assert.throws(() => readLeagueTable(skyTable(current.table.rows, '14 October, 1:55pm'), current, now), /future/);
  const wrong = structuredClone(current.table.rows); wrong[0].played++; wrong[0].drawn++; wrong[0].points++;
  assert.throws(() => prepareAutomaticTable(skyTable(wrong), [], current, now), /Whole-league/);
  assert.throws(() => prepareAutomaticTable(changed.replace('data-live-key="pts"><span>15', 'data-live-key="pts"><span>14'), resultPages, current, now), /points adjustment/);
});

test('only full-time Premier League results can advance the table; conflicts and changed dates fail', () => {
  for (const html of [skyResult({ status: 'LIVE' }), skyResult({ isResult: false }), skyResult({ isAbandoned: true }), skyResult({ competition: 'EFL Cup' })]) assert.throws(() => prepareAutomaticTable(changed, [{ month: '2026-10', html }], current, now), /recorded league results/);
  assert.throws(() => prepareAutomaticTable(changed, [{ month: '2026-10', html: skyResult({ date: 'Sunday 12th October' }) }], current, now), /unique existing fixture/);
  assert.throws(() => readLiverpoolResults(skyResult() + skyResult(), '2026-10'), /Duplicate/);
  assert.throws(() => readLiverpoolResults(skyResult({ score: { home: -1, away: 0 } }), '2026-10'), /Invalid Sky full-time/);
  assert.throws(() => prepareAutomaticTable(changed, [{ month: '2026-09', html: skyResult({ date: 'Sunday 20th September', home: 'Bournemouth', away: 'Liverpool', score: { home: 9, away: 1 } }) }], current, now), /conflicts/);
});

test('failed fetch and bad source preserve the original file byte for byte without temp artifacts', async () => {
  await withRoot(async (root, file) => {
    const original = fs.readFileSync(file, 'utf8');
    for (const fetcher of [async () => { throw new Error('offline'); }, async () => ({ ok: false, status: 503 }), async () => ({ ok: true, text: async () => '<html>broken</html>'.repeat(10) }), async () => ({ ok: true, text: async () => skyTable(current.table.rows.slice(1)) })]) {
      await assert.rejects(updateLeagueTable(root, { fetcher, now, write: true }));
      assert.equal(fs.readFileSync(file, 'utf8'), original);
    }
    assert.ok(!fs.readdirSync(root).some(n => n.startsWith('.table-check')));
    assert.ok(!fs.readdirSync(path.dirname(file)).some(n => n.endsWith('.tmp')));
  });
});

test('unchanged table makes one request, no write and no timestamp churn', async () => {
  await withRoot(async (root, file) => {
    const original = fs.readFileSync(file, 'utf8'); let calls = 0;
    const result = await updateLeagueTable(root, { now, write: true, fetcher: async () => { calls++; return { ok: true, text: async () => skyTable(current.table.rows) }; } });
    assert.equal(result.changed, false); assert.equal(calls, 1); assert.equal(fs.readFileSync(file, 'utf8'), original);
  });
});

test('older identical standings report a no-op without relabelling freshness; older changed standings still fail', async () => {
  await withRoot(async (root, file) => {
    const original = fs.readFileSync(file, 'utf8');
    const fetcher = rows => async () => ({ ok: true, text: async () => skyTable(rows, '20 September, 5:15pm') });
    const result = await updateLeagueTable(root, { now, write: true, fetcher: fetcher(current.table.rows) });
    assert.equal(result.changed, false); assert.match(result.note, /older but all 20 clubs match exactly/);
    assert.match(result.note, /freshness is not confirmed/);
    assert.equal(result.proposal.table.asOf, current.table.asOf);
    assert.deepEqual(result.proposal.sources, current.sources);
    assert.equal(fs.readFileSync(file, 'utf8'), original);
    for (const rows of [addedLiverpoolWin(current), current.table.rows.slice(1)]) {
      await assert.rejects(updateLeagueTable(root, { now, write: true, fetcher: fetcher(rows) }), /older|20 Premier League/);
      assert.equal(fs.readFileSync(file, 'utf8'), original);
    }
    const positions = structuredClone(current.table.rows);
    [positions[0].position, positions[1].position] = [positions[1].position, positions[0].position];
    await assert.rejects(updateLeagueTable(root, { now, write: true, fetcher: fetcher(positions) }), /older/);
    assert.equal(fs.readFileSync(file, 'utf8'), original);
  });
});

test('write applies all 20 teams and verified result atomically; full existing loader still passes', async () => {
  await withRoot(async (root, file) => {
    const urls = [];
    const result = await updateLeagueTable(root, { now, write: true, fetcher: async url => { urls.push(url); return { ok: true, text: async () => url.endsWith('table') ? changed : skyResult() }; } });
    assert.equal(result.changed, true); assert.equal(urls.length, 2);
    assert.equal(getMatchCentre(root).table.rows.find(r => r.clubId === 'liverpool').played, current.table.rows.find(r => r.clubId === 'liverpool').played + 1);
    assert.equal(JSON.parse(fs.readFileSync(file)).fixtures.find(f => f.id.endsWith('manchester-city-home')).status, 'completed');
    assert.ok(!fs.readdirSync(path.dirname(file)).some(n => n.endsWith('.tmp')));
  });
});

test('failed result fetch and missing finished result retain good data', async () => {
  await withRoot(async (root, file) => {
    const original = fs.readFileSync(file, 'utf8');
    await assert.rejects(updateLeagueTable(root, { now, write: true, fetcher: async url => url.endsWith('table') ? { ok: true, text: async () => changed } : { ok: false, status: 503 } }), /503/);
    await assert.rejects(updateLeagueTable(root, { now, write: true, fetcher: async url => ({ ok: true, text: async () => url.endsWith('table') ? changed : skyResult({ status: 'LIVE' }) }) }), /recorded league results/);
    assert.equal(fs.readFileSync(file, 'utf8'), original);
  });
});
