import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import matter from 'gray-matter';
import { filterCandidates, discoverCandidates, selectRandom, selectForSlot, scheduledSlot,
  londonParts, readCalendar, saveCalendar, dryRun, promoteSelection, completeSelection, verifyProduction } from '../scripts/automatic-history-publisher.mjs';
import { allRows, publicationClasses } from '../scripts/automatic-history-state.mjs';
import { validateCalendar, calendarPath } from '../scripts/validate-editorial-calendar.mjs';
import { restoreAutomaticStock } from './fixtures/automatic-editorial.mjs';
import { assertRemoteUnchanged } from '../scripts/run-automatic-history.mjs';

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'automatic-history-'));
  for (const dir of ['content', 'docs/editorial', 'pipeline/output/match']) fs.cpSync(dir, path.join(root, dir), { recursive: true });
  restoreAutomaticStock(root);
  return { root, cleanup: () => fs.rmSync(root, { recursive: true, force: true }) };
}
const tuesday = new Date('2026-10-06T08:17:00Z');
const friday = new Date('2026-10-09T08:17:00Z');

test('explicit eligibility rejects published, blocked, missing, unfinished, claimed and other classes', () => {
  const row = { id: 'bio', publicationClass: publicationClasses.biographies, status: 'ready_for_review', draftPath: 'docs/editorial/drafts/bio.md', publishedDestination: null, claim: null };
  const entry = { id: row.id, canonicalDraftPath: row.draftPath, completed: true, technicallyReady: true, unpublished: true, alreadyPublishedElsewhere: false };
  assert.equal(filterCandidates('biographies', [entry], [row]).length, 1);
  for (const change of [{ status: 'published' }, { status: 'blocked' }, { status: 'planned' }, { status: 'writing' }, { draftPath: null },
    { publicationClass: undefined }, { publicationClass: publicationClasses.matches }, { claim: { token: 'other-owner' } }, { publishedDestination: '/archive/bio' }]) {
    assert.equal(filterCandidates('biographies', [entry], [{ ...row, ...change }]).length, 0);
  }
  for (const change of [{ completed: false }, { technicallyReady: false }, { unpublished: false }, { alreadyPublishedElsewhere: true }, { canonicalDraftPath: null }]) {
    assert.equal(filterCandidates('biographies', [{ ...entry, ...change }], [row]).length, 0);
  }
  assert.equal(filterCandidates('matches', [entry], [row]).length, 0);
  assert.equal(filterCandidates('biographies', [entry], [row], [{ rowId: row.id, state: 'selected' }]).length, 0);
});

test('random source is injected; every pool index has equal access and empty pools need no random call', () => {
  const candidates = [{ id: 'late' }, { id: 'early' }, { id: 'middle' }];
  for (let i = 0; i < candidates.length; i++) assert.equal(selectRandom(candidates, size => { assert.equal(size, candidates.length); return i; }), candidates[i]);
  assert.equal(selectRandom([], () => { throw Error('must not call'); }), null);
  assert.throws(() => selectRandom(candidates, () => candidates.length));
});

test('London schedule handles GMT, BST, both clock changes and delayed cron without crossing days', () => {
  for (const date of ['2026-03-24', '2026-03-31', '2026-10-20', '2026-10-27']) {
    const early = new Date(`${date}T08:17:00Z`), late = new Date(`${date}T09:17:00Z`);
    assert.equal(scheduledSlot('biographies', late), `biographies:${date}`);
    assert.equal(scheduledSlot('biographies', early), londonParts(early).hour >= 9 ? `biographies:${date}` : null);
  }
  for (const date of ['2026-03-27', '2026-04-03', '2026-10-23', '2026-10-30']) assert.equal(scheduledSlot('matches', new Date(`${date}T09:17:00Z`)), `matches:${date}`);
  assert.equal(scheduledSlot('biographies', friday), null);
  assert.equal(scheduledSlot('matches', tuesday), null);
  assert.equal(scheduledSlot('biographies', new Date('2026-10-06T12:00:00Z')), null);
  assert.equal(scheduledSlot('biographies', new Date('2026-10-06T11:59:00Z')), 'biographies:2026-10-06');
});

test('current repository pool is derived, opt-in only, and both dry runs are read only', () => {
  const before = fs.readFileSync(calendarPath);
  for (const queue of ['biographies', 'matches']) {
    const pool = discoverCandidates(queue);
    const result = dryRun(queue, process.cwd(), queue === 'biographies' ? tuesday : friday, () => 0);
    assert.equal(result.eligibleCount, pool.length);
    assert.equal(result.writes, 0);
    assert.equal(result.published, false);
    if (result.selected) assert.ok(!fs.existsSync(`content/archive/liverpool/${result.selected.slug}.md`));
    else assert.equal(pool.length, 0);
    for (const e of pool) assert.ok(e.completed && e.technicallyReady && e.unpublished);
  }
  assert.deepEqual(fs.readFileSync(calendarPath), before);
  const excludedIds = new Set(allRows(readCalendar(process.cwd())).filter(e => e.claim || !e.draftPath
    || !['ready_for_review', 'approved'].includes(e.status)).map(e => e.id));
  assert.ok(discoverCandidates('biographies').every(e => !excludedIds.has(e.id)));
});

test('durable selection survives process reload, duplicate slots, failure and subsequent weeks without rerolling', () => {
  const f = fixture();
  try {
    const calendar = readCalendar(f.root), pool = discoverCandidates('biographies', f.root);
    const run = selectForSlot(calendar, 'biographies', 'biographies:2026-10-06', pool, f.root, tuesday, () => 0);
    saveCalendar(f.root, calendar);
    const loaded = readCalendar(f.root);
    assert.deepEqual(selectForSlot(loaded, run.queue, run.slot, pool, f.root, tuesday, () => { throw Error('reroll'); }), run);
    assert.ok(!discoverCandidates(run.queue, f.root).some(e => e.id === run.rowId));
    assert.throws(() => selectForSlot(loaded, run.queue, 'biographies:2026-10-13', pool, f.root), /Outstanding failed selection/);
    assert.doesNotThrow(() => selectForSlot(loaded, 'matches', 'matches:2026-10-09', discoverCandidates('matches', f.root), f.root, friday, () => 0));
    fs.appendFileSync(path.join(f.root, run.draftPath), '\nChanged after selection.\n');
    assert.throws(() => promoteSelection(f.root, loaded, run), /manuscript changed/);
    assert.ok(!fs.existsSync(path.join(f.root, `content/archive/liverpool/${run.slug}.md`)));
    assert.deepEqual(readCalendar(f.root).automaticHistory.runs[0], run);
  } finally { f.cleanup(); }
});

test('both publication classes preserve body bytes, stay pending until verification, and never re-enter the queue', () => {
  const f = fixture();
  try {
    for (const [queue, now, slot] of [['biographies', tuesday, 'biographies:2026-10-06'], ['matches', friday, 'matches:2026-10-09']]) {
      const calendar = readCalendar(f.root), pool = discoverCandidates(queue, f.root);
      // Include a new-production report to exercise the existing batch and review architecture.
      const index = queue === 'matches' ? Math.max(0, pool.findIndex(e => e.newlyResearched)) : 0;
      const run = selectForSlot(calendar, queue, slot, pool, f.root, now, () => index);
      saveCalendar(f.root, calendar);
      const before = fs.readFileSync(path.join(f.root, run.draftPath), 'utf8');
      const plan = promoteSelection(f.root, calendar, run, now);
      const row = allRows(plan.calendar).find(r => r.id === run.rowId);
      assert.equal(row.status, 'publication_pending');
      assert.equal(row.approval, null, 'Narrow queue authority must not fabricate individual approval');
      assert.equal(plan.run.verifiedAt, null);
      assert.equal(matter(plan.publicText).content, matter(before).content);
      assert.equal(fs.readFileSync(path.join(f.root, run.draftPath), 'utf8'), before);
      assert.equal(matter(plan.publicText).data.editorialMode, 'factual');
      assert.equal(matter(plan.publicText).data.date, londonParts(now).date);
      assert.ok(!discoverCandidates(queue, f.root).some(e => e.slug === run.slug));
      assert.throws(() => promoteSelection(f.root, plan.calendar, plan.run), /recorded selection/);
      const completed = completeSelection(f.root, plan.calendar, plan.run, now);
      saveCalendar(f.root, completed);
      assert.equal(allRows(completed).find(r => r.id === run.rowId).status, 'published');
      assert.equal(discoverCandidates(queue, f.root).length, pool.length - 1);
      assert.equal(selectForSlot(completed, queue, slot, pool, f.root).state, 'succeeded');
      validateCalendar(completed, f.root);
    }
  } finally { f.cleanup(); }
});

test('empty slots persist safely and cannot refill or select on a rerun', () => {
  const c = { automaticHistory: { runs: [] } };
  const run = selectForSlot(c, 'matches', 'matches:2026-10-09', [], process.cwd(), friday);
  assert.equal(run.state, 'empty');
  assert.equal(run.slug, null);
  assert.equal(selectForSlot(c, 'matches', run.slot, [{ id: 'unexpected' }], process.cwd(), friday, () => { throw Error('reroll'); }), run);
});

test('historical matches without explicit factual flag gain it without prose edits', () => {
  const f = fixture();
  try {
    const c = readCalendar(f.root), pool = discoverCandidates('matches', f.root);
    const index = pool.findIndex(e => !matter(fs.readFileSync(path.join(f.root, e.canonicalDraftPath), 'utf8')).data.editorialMode);
    assert.ok(index >= 0);
    const run = selectForSlot(c, 'matches', 'matches:2026-10-09', pool, f.root, friday, () => index);
    saveCalendar(f.root, c);
    const p = promoteSelection(f.root, c, run, friday);
    assert.equal(matter(p.publicText).data.editorialMode, 'factual');
    assert.equal(matter(p.publicText).content, matter(fs.readFileSync(path.join(f.root, run.draftPath), 'utf8')).content);
  } finally { f.cleanup(); }
});

test('live verifier bounds retries, requires exact URL and sitemap, and never declares a failure successful', async () => {
  const run = { state: 'publication_pending', slug: 'synthetic-test' };
  let calls = 0, sleeps = 0;
  const fetcher = async url => {
    calls++;
    const article = 'https://theliverpoolbrief.com/archive/synthetic-test';
    return { status: calls <= 4 ? 404 : 200, text: async () => url.endsWith('/sitemap.xml') ? `<loc>${article}</loc>` : article };
  };
  const result = await verifyProduction(run, { fetcher, attempts: 3, sleep: async () => { sleeps++; }, intervalMs: 1 });
  assert.equal(result.attempts, 2); assert.equal(sleeps, 1);
  await assert.rejects(verifyProduction(run, { attempts: 2, sleep: async () => {}, fetcher: async () => ({ status: 200, text: async () => 'wrong sitemap/canonical' }) }), /timed out/);
  assert.equal(run.state, 'publication_pending');
});

test('concurrent remote writes fail closed without force push or overwriting editorial work', () => {
  assert.doesNotThrow(() => assertRemoteUnchanged('same-sha', 'same-sha'));
  assert.throws(() => assertRemoteUnchanged('tested-sha', 'new-editorial-sha'), /Main changed concurrently/);
});

test('publication date is London calendar date even when UTC date differs', () => {
  assert.equal(londonParts(new Date('2026-07-06T23:30:00Z')).date, '2026-07-07');
});
