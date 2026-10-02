import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import matter from 'gray-matter';
import { createHash } from 'node:crypto';
import { getMatchReportInventory } from '../scripts/match-report-inventory.mjs';
import { validateCalendar, calendarPath } from '../scripts/validate-editorial-calendar.mjs';
const load = () => JSON.parse(fs.readFileSync(calendarPath, 'utf8'));
const digest = s => createHash('sha256').update(s).digest('hex');

test('match stock derives metadata from actual files and deduplicates retained public/draft copies', () => {
  const { reports } = getMatchReportInventory();
  assert.equal(new Set(reports.map(r => r.historicalEventDate)).size, reports.length);
  assert.ok(reports.every(r => !r.publishedPaths.some(p => p.endsWith('/liverpool-sold-their-best-player.md'))));
  for (const r of reports) {
    const a = matter(fs.readFileSync(r.articlePath, 'utf8')).data;
    assert.equal(a.slug, r.slug); assert.equal(a.season, r.season);
    assert.equal(a.historicalEventDate, r.historicalEventDate);
    assert.notEqual(r.published, r.unpublished);
    assert.equal(r.scheduled, false);
  }
});

test('newly recovered stock needs explicit approval without an invented calendar week', () => {
  const c = load(); const index = c.matches.findIndex(r => r.status === 'ready_for_review');
  assert.ok(index >= 0);
  for (const mutate of [
    r => { r.status = 'approved'; }, r => { r.featuredWeek = '2026-10-05'; },
    r => { r.scheduledAt = '2026-10-05'; }, r => { r.matchRecovery.reviewRequired = false; },
    r => { r.historicalEventDate = '2000-01-01'; },
    r => { r.matchRecovery.sourceManuscript.sha256 = '0'.repeat(64); },
  ]) {
    const changed = structuredClone(c); mutate(changed.matches[index]);
    assert.throws(() => validateCalendar(changed));
  }
  const duplicate = structuredClone(c); duplicate.matches.push({ ...duplicate.matches[index], id: 'duplicate-match' });
  assert.throws(() => validateCalendar(duplicate), /duplicate recovered match/);
});

test('migrated manuscript prose is preserved; existing canonical prose has an explicit duplicate resolution', () => {
  const rows = validateCalendar(load()).filter(r => r.matchRecovery);
  assert.ok(rows.length >= 122, 'The complete recovered batch must remain inventoried');
  for (const r of rows) {
    const m = r.matchRecovery;
    const original = fs.readFileSync(m.preservedSourcePath, 'utf8');
    assert.equal(digest(original), m.sourceManuscript.sha256);
    if (r.draftPath?.startsWith('docs/editorial/drafts/match-recovery/') && !r.approval) {
      const body = matter(fs.readFileSync(r.draftPath, 'utf8')).content;
      assert.equal(body.replace(/^\n+/, ''), matter(original).content.replace(/^\n+/, ''), r.id);
      assert.equal(digest(body), m.articleBodySha256, r.id);
    } else assert.ok(m.duplicateResolution.length > 0, r.id);
  }
});

test('the recovered stock is unpublished or explicitly identified as already published', () => {
  const recovered = getMatchReportInventory().reports.filter(r => r.recoveredFromWork);
  assert.ok(recovered.length >= 122);
  for (const r of recovered.filter(r => r.unpublished)) {
    if (!r.approval) {
      assert.equal(r.awaitingDennyReview, true); assert.equal(r.approvedForFuturePublication, false);
    } else assert.equal(r.approval.by, 'Denny');
    assert.ok(r.articlePath.startsWith('docs/editorial/drafts/'));
  }
});
