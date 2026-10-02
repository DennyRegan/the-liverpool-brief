import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import matter from 'gray-matter';
import { getEditorialReviewQueue, nextApprovedUnpublished, orderingKey } from '../scripts/editorial-review-queue.mjs';
import { getMatchReportInventory } from '../scripts/match-report-inventory.mjs';
import { restoreAutomaticStock } from './fixtures/automatic-editorial.mjs';
import { getHistoryEntities } from '../lib/content/entities.ts';

test('queues derive titles and paths without changing authoritative status or approval', () => {
  const calendarBefore = fs.readFileSync('docs/editorial/history-calendar.json', 'utf8');
  for (const kind of ['biographies', 'matches']) {
    const q = getEditorialReviewQueue(kind);
    assert.deepEqual(getEditorialReviewQueue(kind), q, 'Repeated reads must be reproducible');
    assert.equal(new Set(q.entries.map(e => e.id)).size, q.entries.length);
    for (const e of q.entries.filter(e => e.canonicalDraftPath)) {
      const { data } = matter(fs.readFileSync(e.canonicalDraftPath, 'utf8'));
      assert.equal(e.title, data.title);
      assert.equal(e.slug, data.slug);
      assert.ok(e.canonicalDraftPath.startsWith('docs/editorial/drafts/'));
      assert.equal(Object.hasOwn(e, 'scheduledAt'), false);
      if (e.status !== 'approved') assert.notEqual(q.nextApproved?.id, e.id);
    }
  }
  assert.equal(fs.readFileSync('docs/editorial/history-calendar.json', 'utf8'), calendarBefore);
});

test('missing biographies remain blocked without fabricated titles, paths or ordering ranks', () => {
  const q = getEditorialReviewQueue('biographies');
  const expected = ['alan-hansen', 'terry-mcdermott', 'sami-hyypia'];
  for (const personId of expected) {
    const e = q.entries.find(e => e.personId === personId);
    assert.equal(e.recoveryStatus, 'NOT LOCATED');
    assert.equal(e.technicallyReady, false);
    assert.equal(e.canonicalDraftPath, null);
    assert.equal(e.proposedOrder, null);
    assert.equal(e.approval, null);
  }
  assert.ok(!q.entries.some(e => e.personId === 'phil-thompson'));
  // The focused 1987 Barnes article is not a duplicate of his career manuscript.
  assert.equal(q.entries.find(e => e.personId === 'john-barnes').alreadyPublishedElsewhere, false);
});

test('proposed orders use stable subject labels and actual match dates, including repository-only stock', () => {
  assert.equal(orderingKey('Gérard Houllier'), 'gerard houllier');
  const b = getEditorialReviewQueue('biographies').entries.filter(e => e.proposedOrder);
  assert.deepEqual(b.map(e => e.proposedOrder), b.map((_, i) => i + 1));
  const m = getEditorialReviewQueue('matches').entries;
  assert.deepEqual(m.map(e => e.historicalEventDate), [...m.map(e => e.historicalEventDate)].sort());
  const expected = getMatchReportInventory().reports.filter(r => r.unpublished);
  assert.deepEqual(new Set(m.map(e => e.id)), new Set(expected.map(e => e.id)));
  assert.ok(m.some(e => !e.recoveredFromWork));
});

test('read-only next selection requires explicit Denny approval and skips blocked, duplicate and public stock', () => {
  const eligible = { id: 'eligible', proposedOrder: 7, technicallyReady: true, unpublished: true,
    alreadyPublishedElsewhere: false, status: 'approved', approval: { by: 'Denny', recordedAt: '2026-10-01T12:00:00Z', evidence: 'Synthetic fixture approval only' } };
  const entries = [
    { ...eligible, id: 'not-approved', proposedOrder: 1, status: 'ready_for_review', approval: null },
    { ...eligible, id: 'blocked', proposedOrder: 2, technicallyReady: false },
    { ...eligible, id: 'published', proposedOrder: 3, unpublished: false },
    { ...eligible, id: 'duplicate', proposedOrder: 4, alreadyPublishedElsewhere: true },
    { ...eligible, id: 'wrong-person', proposedOrder: 5, approval: { ...eligible.approval, by: 'AI' } },
    { ...eligible, id: 'no-evidence', proposedOrder: 6, approval: { ...eligible.approval, evidence: '' } },
    eligible, { ...eligible, id: 'later', proposedOrder: 8 },
  ];
  const before = structuredClone(entries);
  assert.equal(nextApprovedUnpublished([...entries].reverse()).id, 'eligible');
  assert.equal(nextApprovedUnpublished(entries.slice(0, 6)), null);
  assert.deepEqual(entries, before);
});

test('all resolved club labels link to one canonical opposition identity', () => {
  const identities = getHistoryEntities();
  const mapping = { 'Alavés': 'alaves', Basel: 'basel', 'Blackburn Rovers': 'blackburn-rovers',
    'Bolton Wanderers': 'bolton-wanderers', Bradford: 'bradford-city', Brann: 'brann', Burnley: 'burnley',
    'CSKA Moscow': 'cska-moscow', Celtic: 'celtic', Charlton: 'charlton-athletic', Marseille: 'marseille',
    PSV: 'psv-eindhoven', 'Paris Saint-Germain': 'paris-saint-germain', 'Sheffield Wednesday': 'sheffield-wednesday',
    Sion: 'sion', 'Swindon Town': 'swindon-town', 'São Paulo': 'sao-paulo' };
  for (const [label, id] of Object.entries(mapping)) {
    assert.equal(identities.filter(e => e.id === id && e.kind === 'opposition').length, 1);
    const reports = getMatchReportInventory().reports.filter(r => r.recoveredFromWork && r.opposition === label);
    assert.ok(reports.length);
    for (const r of reports) {
      assert.ok(r.oppositionIds.includes(id));
      assert.ok(!r.blockers.some(b => b.includes('Canonical opposition entity not available')));
      for (const file of [...r.draftPaths, ...r.publishedPaths]) {
        assert.ok(matter(fs.readFileSync(file, 'utf8')).data.oppositionIds.includes(id));
      }
    }
  }
});

test('missing opposition metadata blocks a recovered report even if the old blocker text is absent', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'review-queue-'));
  try {
    for (const dir of ['content', 'docs/editorial', 'pipeline/output/match']) fs.cpSync(dir, path.join(root, dir), { recursive: true });
    restoreAutomaticStock(root);
    const q = getEditorialReviewQueue('matches', root);
    const calendarFile = path.join(root, 'docs/editorial/history-calendar.json');
    const calendar = JSON.parse(fs.readFileSync(calendarFile, 'utf8'));
    calendar.entries.reverse(); calendar.biographies.reverse(); calendar.matches.reverse();
    fs.writeFileSync(calendarFile, JSON.stringify(calendar));
    assert.deepEqual(getEditorialReviewQueue('matches', root), q, 'Calendar storage order cannot choose the next article');
    const e = q.entries.find(e => e.recoveredFromWork && e.technicallyReady);
    const file = path.join(root, e.canonicalDraftPath);
    const original = fs.readFileSync(file, 'utf8');
    const a = matter(original);
    fs.writeFileSync(file, matter.stringify(a.content, { ...a.data, oppositionIds: [] }));
    const changed = getEditorialReviewQueue('matches', root).entries.find(x => x.id === e.id);
    assert.equal(changed.technicallyReady, false);
    assert.ok(changed.blockers.includes('Canonical opposition is missing.'));
    fs.writeFileSync(file, original);
    const legacy = q.entries.find(e => !e.recoveredFromWork && !e.newlyResearched);
    assert.ok(legacy, 'Use untracked legacy stock for the duplicate-slug fixture');
    const legacyFile = path.join(root, legacy.canonicalDraftPath);
    const legacyArticle = matter(fs.readFileSync(legacyFile, 'utf8'));
    fs.writeFileSync(legacyFile, matter.stringify(legacyArticle.content, { ...legacyArticle.data, slug: e.slug }));
    const duplicates = getEditorialReviewQueue('matches', root).entries.filter(x => x.slug === e.slug);
    assert.equal(duplicates.length, 2);
    assert.ok(duplicates.every(x => !x.technicallyReady && x.blockers.includes('Duplicate unpublished slug.')));
    const barnesFile = path.join(root, 'content/archive/liverpool/john-barnes-1987.md');
    const barnes = matter(fs.readFileSync(barnesFile, 'utf8'));
    fs.writeFileSync(barnesFile, matter.stringify(barnes.content, { ...barnes.data, title: 'John Barnes' }));
    const conflict = getEditorialReviewQueue('biographies', root).entries.find(x => x.personId === 'john-barnes');
    assert.equal(conflict.alreadyPublishedElsewhere, true);
    assert.equal(conflict.technicallyReady, false);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
