import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import matter from 'gray-matter';
import { getEditorialReviewQueue } from '../scripts/editorial-review-queue.mjs';
import { validateCalendar } from '../scripts/validate-editorial-calendar.mjs';
import { readCalendar, saveCalendar, discoverCandidates, selectForSlot, promoteSelection } from '../scripts/automatic-history-publisher.mjs';
import { restoreAutomaticStock } from './fixtures/automatic-editorial.mjs';

test('new biographies use the existing queue without invented recovery provenance or approval', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'biography-production-'));
  try {
    for (const dir of ['content', 'docs/editorial', 'pipeline/output/match']) fs.cpSync(dir, path.join(root, dir), { recursive: true });
    restoreAutomaticStock(root);
    const calendar = readCalendar(root);
    // Convert a fixture only: production data and historical recovery records stay untouched.
    const row = calendar.biographies.find(r => r.migration?.completed && r.status === 'ready_for_review');
    const old = row.migration;
    row.biographyProduction = { completed: true, reviewRequired: true,
      editorialReason: 'Synthetic fixture for new-production queue integration.',
      sourceFiles: [old.sourceFiles[0], row.draftPath], model: 'gpt-6-astra',
      workerId: '/test/biography-production', blockers: [] };
    row.researchStatus = 'verified';
    delete row.migration;
    saveCalendar(root, calendar);
    const item = getEditorialReviewQueue('biographies', root).entries.find(e => e.id === row.id);
    assert.equal(item.recoveryStatus, 'NEW PRODUCTION');
    assert.equal(item.newlyResearched, true);
    assert.equal(item.technicallyReady, true);
    assert.equal(item.approval, null);
    assert.ok(discoverCandidates('biographies', root).some(e => e.id === row.id));

    for (const mutation of [
      c => { c.biographies.find(e => e.id === row.id).biographyProduction.completed = false; },
      c => { c.biographies.find(e => e.id === row.id).researchStatus = 'needs_research'; },
      c => { c.biographies.find(e => e.id === row.id).biographyProduction.sourceFiles = []; },
      c => { c.biographies.find(e => e.id === row.id).migration = old; },
      c => { c.biographies.push(structuredClone(c.biographies.find(e => e.id === row.id))); },
    ]) {
      const invalid = structuredClone(calendar);
      mutation(invalid);
      assert.throws(() => validateCalendar(invalid, root));
    }

    const blocked = structuredClone(calendar);
    blocked.biographies.find(e => e.id === row.id).biographyProduction.blockers.push('Unresolved source conflict');
    saveCalendar(root, blocked);
    assert.ok(!discoverCandidates('biographies', root).some(e => e.id === row.id));
    saveCalendar(root, calendar);

    const pool = discoverCandidates('biographies', root);
    const now = new Date('2026-10-06T08:17:00Z');
    const run = selectForSlot(calendar, 'biographies', 'biographies:2026-10-06', pool, root, now,
      () => pool.findIndex(e => e.id === row.id));
    saveCalendar(root, calendar);
    const original = fs.readFileSync(path.join(root, row.draftPath), 'utf8');
    const plan = promoteSelection(root, calendar, run, now);
    assert.equal(matter(plan.publicText).content, matter(original).content);
    assert.equal(plan.calendar.biographies.find(e => e.id === row.id).approval, null);
    assert.equal(plan.calendar.biographies.find(e => e.id === row.id).status, 'publication_pending');
    assert.ok(!discoverCandidates('biographies', root).some(e => e.id === row.id));
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
