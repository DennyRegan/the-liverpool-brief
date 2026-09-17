import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import matter from 'gray-matter';
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

test('unpublished draft relationship metadata receives the existing Archive structural checks', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'editorial-metadata-'));
  try {
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    fs.cpSync('docs/editorial', path.join(root, 'docs/editorial'), { recursive: true });
    const calendar = load();
    const row = calendar.entries.find(e => e.draftPath);
    const file = path.join(root, row.draftPath);
    const original = matter(fs.readFileSync(file, 'utf8'));
    for (const changes of [
      { season: '1987-89' },
      { playerIds: ['unknown-person'] },
      { playerIds: ['anfield'] },
      { competitionIds: ['fa-cup', 'fa-cup'] },
      { articleType: 'invented-type' },
      { historyEras: ['invented-era'] },
    ]) {
      fs.writeFileSync(file, matter.stringify(original.content, { ...original.data, ...changes }));
      assert.throws(() => validateCalendar(calendar, root), JSON.stringify(changes));
    }
    fs.writeFileSync(file, matter.stringify(original.content, original.data));
    assert.equal(validateCalendar(calendar, root).length, calendar.entries.length);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
