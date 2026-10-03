import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import matter from 'gray-matter';
import { validateCalendar, calendarPath } from '../scripts/validate-editorial-calendar.mjs';
import { getMatchReportInventory } from '../scripts/match-report-inventory.mjs';

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'match-production-'));
  for (const dir of ['content', 'docs/editorial', 'pipeline/output/match']) {
    fs.cpSync(dir, path.join(root, dir), { recursive: true });
  }
  const c = JSON.parse(fs.readFileSync(path.join(root, calendarPath), 'utf8'));
  const draftPath = 'docs/editorial/drafts/production-test-fixture.md';
  const notePath = 'docs/editorial/drafts/production-test-fixture-notes.md';
  const row = {
    id: 'production-test-fixture', event: 'Test match', historicalEventDate: '1900-08-01',
    selection: 'selected', status: 'ready_for_review', owner: 'test fixture', claim: null,
    eventPath: null, draftPath, originalDraftId: null, publishedDestination: null, approval: null,
    notes: 'Synthetic test fixture; no historical assertion.',
    evidence: [{ location: notePath, confidence: 'high', scope: 'Test fixture only.' }],
    researchStatus: 'verified',
    matchProduction: {
      batchId: 'production-test-batch', season: '1900-01', completed: true, reviewRequired: true,
      matchLabel: 'Fixture 1–0 Fixture', opposition: 'Southampton', score: '1–0',
      editorialReason: 'Synthetic fixture to exercise the publication boundary.', sourceFiles: [notePath],
      model: 'gpt-6-astra', workerId: '/test/astra', blockers: [],
    },
  };
  c.matches.push(row);
  c.matchProductionBatches ??= [];
  c.matchProductionBatches.push({
    id: 'production-test-batch', season: '1900-01', stage: 'checkpointed',
    owner: 'test fixture', model: 'gpt-6-astra', workerId: '/test/astra', sourceNote: notePath,
    selectedRowIds: [row.id], reusedPaths: [], notes: 'Test fixture.', nextStage: null,
  });
  fs.writeFileSync(path.join(root, notePath), 'Synthetic test evidence.\n');
  fs.writeFileSync(path.join(root, draftPath), matter.stringify('Synthetic test body.\n', {
    title: 'Test fixture', slug: 'production-test-fixture', excerpt: 'Test fixture.',
    historicalEventDate: row.historicalEventDate, historicalPeriod: '1 August 1900', decade: '1900s',
    category: 'match', articleType: 'match', editorialMode: 'factual', season: '1900-01',
    managerIds: ['bill-shankly'], oppositionIds: ['southampton'], competitionIds: ['second-division'],
  }));
  return { root, c, row, cleanup: () => fs.rmSync(root, { recursive: true, force: true }) };
}

test('new research enters the existing inventory without recovery identities, approval or a schedule', () => {
  const f = fixture();
  try {
    validateCalendar(f.c, f.root);
    fs.writeFileSync(path.join(f.root, calendarPath), JSON.stringify(f.c));
    const r = getMatchReportInventory(f.root).reports.find(r => r.calendarRowId === f.row.id);
    assert.ok(r);
    assert.equal(r.newlyResearched, true);
    assert.equal(r.recoveredFromWork, false);
    assert.equal(r.recovery, null);
    assert.equal(r.completed, true);
    assert.equal(r.unpublished, true);
    assert.equal(r.awaitingDennyReview, true);
    assert.equal(r.approvedForFuturePublication, false);
    assert.equal(r.scheduled, false);
    assert.equal(r.featuredWeek, null);
  } finally { f.cleanup(); }
});

test('explicitly authorised Sol 6.1 production retains its actual worker provenance', () => {
  const f = fixture();
  try {
    f.row.matchProduction.model = 'gpt-6.1-sol';
    f.row.matchProduction.workerId = '/test/sol';
    const batch = f.c.matchProductionBatches.at(-1);
    batch.model = 'gpt-6.1-sol';
    batch.workerId = '/test/sol';
    assert.doesNotThrow(() => validateCalendar(f.c, f.root));
    assert.equal(f.row.matchProduction.model, 'gpt-6.1-sol');
    assert.equal(batch.workerId, '/test/sol');
  } finally { f.cleanup(); }
});

test('new-production stock rejects inferred approval, false completion, duplicate dates and publication dates', () => {
  const f = fixture();
  try {
    const index = f.c.matches.length - 1;
    for (const mutate of [
      r => { r.status = 'approved'; },
      r => { r.matchProduction.reviewRequired = false; },
      r => { r.matchProduction.completed = false; },
      r => { r.matchProduction.model = 'unverified-model'; },
      r => { r.matchProduction.sourceFiles = ['docs/editorial/drafts/absent.md']; },
      r => { r.featuredWeek = '2026-10-05'; },
      r => { r.scheduledAt = '2026-10-05'; },
    ]) {
      const changed = structuredClone(f.c); mutate(changed.matches[index]);
      assert.throws(() => validateCalendar(changed, f.root));
    }
    const duplicate = structuredClone(f.c);
    duplicate.matches.push({ ...duplicate.matches[index], id: 'duplicate-production-fixture' });
    assert.throws(() => validateCalendar(duplicate, f.root), /duplicate recovered match/);
    // A completed production batch must remain valid when a later, real approval is recorded.
    const approved = structuredClone(f.c);
    approved.matches[index].status = 'approved';
    approved.matches[index].approval = { by: 'Denny', recordedAt: '2026-10-01T12:00:00Z', evidence: 'Synthetic test fixture only.' };
    approved.matches[index].matchProduction.reviewRequired = false;
    assert.doesNotThrow(() => validateCalendar(approved, f.root));
    const file = path.join(f.root, f.row.draftPath);
    const a = matter(fs.readFileSync(file, 'utf8'));
    fs.writeFileSync(file, matter.stringify(a.content, { ...a.data, date: '2026-10-01' }));
    assert.throws(() => validateCalendar(f.c, f.root), /draft has publication date/);
  } finally { f.cleanup(); }
});
