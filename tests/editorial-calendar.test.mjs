import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import matter from 'gray-matter';
import { createHash } from 'node:crypto';
import { validateCalendar, calendarPath } from '../scripts/validate-editorial-calendar.mjs';
const load = () => JSON.parse(fs.readFileSync(calendarPath, 'utf8'));

test('repository calendar validates without imposing a fixed writing or approval count', () => {
  const rows = validateCalendar(load());
  assert.ok(rows.length > 0);
  assert.ok(rows.every(e => e.personId || ((e.matchRecovery || e.matchProduction) && e.historicalEventDate) || (e.featuredWeek && e.historicalEventDate)));
});

const revisionPath = 'docs/editorial/biography-depth-revision-hashes-2026-10-03.json';
const sha256 = value => createHash('sha256').update(value).digest('hex');
function auditedRevisions(record, calendar) {
  assert.equal(record.version, 1);
  assert.equal(record.model, 'gpt-6.1-sol');
  assert.equal(record.authorizationRecord, 'docs/editorial/biography-depth-improvements-2026-10-03.md');
  assert.ok(fs.readFileSync(record.authorizationRecord, 'utf8').includes('Denny authorised changes'));
  assert.equal(record.rows.length, 8);
  const revisions = new Map();
  for (const revision of record.rows) {
    assert.ok(!revisions.has(revision.id), 'Duplicate revision identity');
    const row = calendar.biographies.find(e => e.id === revision.id);
    assert.ok(row?.migration?.sourceManuscript, 'Revision must reference recovered inventory');
    assert.equal(revision.personId, row.personId);
    assert.equal(revision.path, row.draftPath);
    assert.equal(revision.originalRecoveredSha256, row.migration.sourceManuscript.sha256, 'Original recovery hash must not be replaced');
    const manuscript = matter(fs.readFileSync(row.draftPath, 'utf8'));
    assert.equal(sha256(manuscript.content.slice(1)), revision.revisedBodySha256, 'Unrecorded revised body change');
    assert.equal(sha256(JSON.stringify(manuscript.data)), revision.metadataSha256, 'Unrecorded revised metadata change');
    for (const kind of ['research', 'audit']) {
      assert.equal(revision[kind], `docs/editorial/drafts/biographies/${row.personId}-depth-${kind}-2026-10-03.md`);
      assert.ok(row.evidence.some(e => e.location === revision[kind]), 'Revision evidence must be discoverable from inventory');
      assert.ok(fs.readFileSync(revision[kind], 'utf8').includes('gpt-6.1-sol'));
    }
    revisions.set(revision.id, revision);
  }
  return revisions;
}

test('recovered manuscripts retain exact bytes except explicitly recorded audited amendments', () => {
  const calendar = load();
  const revisions = auditedRevisions(JSON.parse(fs.readFileSync(revisionPath, 'utf8')), calendar);
  for (const row of calendar.biographies ?? []) {
    if (!row.migration?.sourceManuscript || !row.draftPath) continue;
    const body = matter(fs.readFileSync(row.draftPath, 'utf8')).content;
    const expected = revisions.get(row.id)?.revisedBodySha256 ?? row.migration.sourceManuscript.sha256;
    assert.equal(sha256(body.slice(1)), expected, row.id);
  }
});

test('audited amendment records reject altered provenance, body, metadata and missing evidence', () => {
  const original = JSON.parse(fs.readFileSync(revisionPath, 'utf8'));
  for (const mutate of [
    r => { r.rows[0].originalRecoveredSha256 = '0'.repeat(64); },
    r => { r.rows[0].revisedBodySha256 = '0'.repeat(64); },
    r => { r.rows[0].metadataSha256 = '0'.repeat(64); },
    r => { r.rows[0].audit = r.rows[0].research; },
    r => { r.rows[1] = r.rows[0]; },
  ]) {
    const record = structuredClone(original); mutate(record);
    assert.throws(() => auditedRevisions(record, load()));
  }
  const calendar = load();
  const row = calendar.biographies.find(e => e.id === original.rows[0].id);
  row.evidence = row.evidence.filter(e => e.location !== original.rows[0].audit);
  assert.throws(() => auditedRevisions(original, calendar));
});

test('career inventory needs neither an anniversary nor a schedule and rejects inferred approval', () => {
  const original = load();
  const index = original.biographies.findIndex(e => e.draftPath);
  assert.ok(index >= 0);
  for (const mutate of [
    e => { e.status = 'approved'; },
    e => { e.personId = 'anfield'; },
    e => { e.id = 'invented-biography'; },
    e => { e.featuredWeek = '2026-10-05'; },
    e => { e.scheduledAt = '2026-10-05'; },
    e => { e.migration.sourceFiles = ['docs/editorial/drafts/missing.md']; },
  ]) {
    const c = structuredClone(original); mutate(c.biographies[index]);
    assert.throws(() => validateCalendar(c));
  }
});
test('review drafts are kept outside published article collection', () => {
  for (const row of validateCalendar(load()).filter(e => e.draftPath)) {
    assert.ok(row.draftPath.startsWith('docs/editorial/drafts/'));
  }
});
test('career biographies outside the era registry remain undated unpublished inventory', () => {
  const calendar = load();
  const early = calendar.biographies.filter(row => row.draftPath
    && !matter(fs.readFileSync(row.draftPath, 'utf8')).data.historyEras?.length);
  assert.ok(early.length > 0);
  for (const row of early) {
    const { data } = matter(fs.readFileSync(row.draftPath, 'utf8'));
    assert.equal(data.category, 'person');
    assert.equal(data.historicalEventDate, undefined);
    assert.equal(data.date, undefined);
    assert.equal(row.eventPath, null);
    assert.equal(row.approval, null);
    assert.equal(row.publishedDestination, null);
  }
  assert.doesNotThrow(() => validateCalendar(calendar));
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
    fs.cpSync('pipeline/output/match', path.join(root, 'pipeline/output/match'), { recursive: true });
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
      { historicalEventDate: undefined, historyEras: undefined },
    ]) {
      const metadata = Object.fromEntries(Object.entries({ ...original.data, ...changes }).filter(([, value]) => value !== undefined));
      fs.writeFileSync(file, matter.stringify(original.content, metadata));
      assert.throws(() => validateCalendar(calendar, root), JSON.stringify(changes));
    }
    fs.writeFileSync(file, matter.stringify(original.content, original.data));
    assert.equal(validateCalendar(calendar, root).length, calendar.entries.length + (calendar.biographies?.length ?? 0) + (calendar.matches?.length ?? 0));
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
