import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readCalendar, saveCalendar, discoverCandidates, selectForSlot, promoteSelection, completeSelection } from '../scripts/automatic-history-publisher.mjs';
import { allRows } from '../scripts/automatic-history-state.mjs';
import { validateCalendar, calendarPath } from '../scripts/validate-editorial-calendar.mjs';
import { planTakeOffline, applyTakeOffline } from '../scripts/take-offline.mjs';
import { restoreAutomaticStock } from './fixtures/automatic-editorial.mjs';

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'take-offline-'));
  for (const dir of ['content', 'docs/editorial', 'pipeline/output/match']) fs.cpSync(dir, path.join(root, dir), { recursive: true });
  restoreAutomaticStock(root);
  return { root, cleanup: () => fs.rmSync(root, { recursive: true, force: true }) };
}
const tuesday = new Date('2026-10-06T08:17:00Z'), friday = new Date('2026-10-09T08:17:00Z');
const publicFile = (root, slug) => path.join(root, `content/archive/liverpool/${slug}.md`);
// Release one piece exactly as the publisher does (reserve, promote, verify).
function release(root, queue, now, slot, index = 0) {
  const calendar = readCalendar(root);
  const run = selectForSlot(calendar, queue, slot, discoverCandidates(queue, root), root, now, () => index);
  saveCalendar(root, calendar);
  const plan = promoteSelection(root, calendar, run, now);
  saveCalendar(root, completeSelection(root, plan.calendar, plan.run, now));
  return run;
}

for (const [queue, label, now, slot] of [['biographies', 'biography', tuesday, 'biographies:2026-10-06'], ['matches', 'match report', friday, 'matches:2026-10-09']]) {
  test(`take-offline removes a released ${label}, keeps the draft, keeps the slot used and stays out of the pool`, () => {
    const f = fixture();
    try {
      const run = release(f.root, queue, now, slot, 2);
      assert.ok(fs.existsSync(publicFile(f.root, run.slug)));
      const draft = fs.readFileSync(path.join(f.root, run.draftPath));
      let checked = 0;
      const result = applyTakeOffline(f.root, run.slug, 'Needs a second look', { now, check: root => { checked++; validateCalendar(readCalendar(root), root); } });
      assert.equal(checked, 1);
      assert.equal(result.written, true);
      assert.ok(!fs.existsSync(publicFile(f.root, run.slug)), 'Public file should be gone');
      assert.deepEqual(fs.readFileSync(path.join(f.root, run.draftPath)), draft, 'Draft must be left alone');
      const calendar = readCalendar(f.root);
      const after = calendar.automaticHistory.runs.find(r => r.slot === slot);
      assert.equal(after.state, 'empty');
      for (const key of ['rowId', 'slug', 'draftPath', 'manuscriptSha256', 'publishedAt', 'publicSha256', 'verifiedAt']) assert.equal(after[key], null);
      assert.equal(after.queue, queue);
      const row = allRows(calendar).find(r => r.id === run.rowId);
      assert.equal(row.publishedDestination, null);
      assert.equal(row.status, 'ready_for_review');
      assert.ok(!('publicationClass' in row), 'Row must leave the automatic queue');
      assert.match(row.notes, /Taken offline 2026-10-0\d: Needs a second look\./);
      validateCalendar(calendar, f.root);
      assert.ok(!discoverCandidates(queue, f.root).some(e => e.slug === run.slug), 'Taken-offline piece re-entered the pool');
      // The slot stays used: a rerun on the same day cannot pick a different piece.
      assert.equal(selectForSlot(calendar, queue, slot, discoverCandidates(queue, f.root), f.root, now, () => { throw Error('reroll'); }).state, 'empty');
    } finally { f.cleanup(); }
  });
}

test('take-offline puts everything back exactly as it was when a check fails', () => {
  const f = fixture();
  try {
    const run = release(f.root, 'biographies', tuesday, 'biographies:2026-10-06');
    const calendarBefore = fs.readFileSync(path.join(f.root, calendarPath)), articleBefore = fs.readFileSync(publicFile(f.root, run.slug));
    assert.throws(() => applyTakeOffline(f.root, run.slug, 'Test', { now: tuesday, check: () => { throw new Error('build failed'); } }), /build failed[\s\S]*Nothing was changed/);
    assert.deepEqual(fs.readFileSync(path.join(f.root, calendarPath)), calendarBefore);
    assert.deepEqual(fs.readFileSync(publicFile(f.root, run.slug)), articleBefore);
    validateCalendar(readCalendar(f.root), f.root);
  } finally { f.cleanup(); }
});

test('take-offline dry run writes nothing', () => {
  const f = fixture();
  try {
    const run = release(f.root, 'matches', friday, 'matches:2026-10-09');
    const before = fs.readFileSync(path.join(f.root, calendarPath));
    const result = applyTakeOffline(f.root, run.slug, 'Preview only', { now: friday, dryRun: true, check: () => { throw new Error('must not run'); } });
    assert.equal(result.written, false);
    assert.equal(result.changes.length, 3);
    assert.deepEqual(fs.readFileSync(path.join(f.root, calendarPath)), before);
    assert.ok(fs.existsSync(publicFile(f.root, run.slug)));
  } finally { f.cleanup(); }
});

test('take-offline refuses unreleased, unknown, reasonless and badly named requests', () => {
  const f = fixture();
  try {
    const calendar = readCalendar(f.root);
    const run = selectForSlot(calendar, 'biographies', 'biographies:2026-10-06', discoverCandidates('biographies', f.root), f.root, tuesday, () => 0);
    saveCalendar(f.root, calendar);
    const before = fs.readFileSync(path.join(f.root, calendarPath));
    assert.throws(() => planTakeOffline(f.root, run.slug, 'Reserved only'), /nothing is public/);
    assert.throws(() => planTakeOffline(f.root, 'not-an-automatic-release', 'Reason'), /no automatic release/);
    assert.throws(() => planTakeOffline(f.root, run.slug, ''), /reason/);
    assert.throws(() => planTakeOffline(f.root, 'Bad Slug!', 'Reason'), /slug/);
    assert.throws(() => planTakeOffline(f.root, undefined, 'Reason'), /slug/);
    assert.deepEqual(fs.readFileSync(path.join(f.root, calendarPath)), before);
  } finally { f.cleanup(); }
});

test('the command can look and edit but never commit, push or switch branches', () => {
  const source = fs.readFileSync('scripts/take-offline.mjs', 'utf8');
  const gitVerbs = [...source.matchAll(/\bgit\(root,\s*'([a-z-]+)'/g)].map(m => m[1]);
  assert.ok(gitVerbs.length > 0);
  for (const verb of gitVerbs) assert.ok(['rev-parse', 'status'].includes(verb), `Unexpected git ${verb}`);
  // Git is reached only through the read-only helper; every other command is npm or node.
  assert.equal([...source.matchAll(/execFileSync\('git'/g)].length, 1);
  for (const [, command] of source.matchAll(/\brun\('([a-z]+)'/g)) assert.ok(['npm', 'node'].includes(command), `Unexpected command ${command}`);
});
