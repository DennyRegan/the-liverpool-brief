import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateCalendar, calendarPath } from '../scripts/validate-editorial-calendar.mjs';
const load = () => JSON.parse(fs.readFileSync(calendarPath, 'utf8'));

test('repository calendar validates without imposing a fixed writing or approval count', () => {
  const rows = validateCalendar(load());
  assert.ok(rows.length > 0);
  assert.ok(rows.every(e => e.featuredWeek && e.historicalEventDate));
});
test('review drafts are kept outside published article collection', () => {
  for (const row of validateCalendar(load()).filter(e => e.draftPath)) {
    assert.ok(row.draftPath.startsWith('docs/editorial/drafts/'));
  }
});
test('calendar rejects wrong weeks, invented paths, missing claims and inferred approval', () => {
  for (const mutate of [
    e => { e.featuredWeek = '2026-09-15'; },
    e => { e.historicalEventDate = '1964-10-14'; },
    e => { e.draftPath = 'docs/editorial/drafts/missing.md'; },
    e => { e.status = 'writing'; e.claim = null; },
    e => { e.status = 'approved'; e.approval = null; },
    e => { e.publishedDestination = '/archive/does-not-exist'; },
  ]) { const c = load(); mutate(c.entries[0]); assert.throws(() => validateCalendar(c)); }
  const c = load(); c.entries.push(c.entries[0]); assert.throws(() => validateCalendar(c), /Duplicate/);
});
