import assert from 'node:assert/strict';
import { z } from 'zod';

export const queues = ['biographies', 'matches'];
export const publicationClasses = { biographies: 'automatic-history-biography', matches: 'automatic-history-match' };
export const publicationClassSchema = z.enum(Object.values(publicationClasses));
export const isPublicStatus = status => ['publication_pending', 'published'].includes(status);
export const allRows = calendar => [...calendar.entries, ...(calendar.biographies ?? []), ...(calendar.matches ?? [])];
const digest = z.string().regex(/^[a-f0-9]{64}$/);
export const runSchema = z.object({
  slot: z.string().regex(/^(biographies|matches):\d{4}-\d{2}-\d{2}$/), queue: z.enum(queues),
  state: z.enum(['selected', 'publication_pending', 'succeeded', 'empty']),
  selectedAt: z.iso.datetime(), rowId: z.string().nullable(), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).nullable(),
  draftPath: z.string().nullable(), manuscriptSha256: digest.nullable(),
  publishedAt: z.iso.datetime().nullable(), publicSha256: digest.nullable(), verifiedAt: z.iso.datetime().nullable(),
}).strict();
export const automaticHistorySchema = z.object({
  version: z.literal(1), enabled: z.boolean(), pausedQueues: z.array(z.enum(queues)),
  policy: z.literal('denny-automatic-history-2026-10-01'), runs: z.array(runSchema),
}).strict();

// Called by the existing calendar validator. There is no separate status store.
export function validateAutomaticHistory(calendar, rows, articles) {
  if (!calendar.automaticHistory) {
    assert.ok(!rows.some(r => r.publicationClass || r.status === 'publication_pending'), 'Automatic policy is missing');
    return;
  }
  const config = automaticHistorySchema.parse(calendar.automaticHistory);
  assert.equal(new Set(config.pausedQueues).size, config.pausedQueues.length, 'Duplicate paused queue');
  const slots = new Set(), selectedRows = new Set(), activeQueues = new Set();
  for (const run of config.runs) {
    assert.ok(!slots.has(run.slot), 'Duplicate automatic slot'); slots.add(run.slot);
    assert.ok(run.slot.startsWith(`${run.queue}:`), 'Run queue/slot mismatch');
    const date = run.slot.split(':')[1];
    z.iso.date().parse(date);
    assert.equal(new Date(`${date}T12:00:00Z`).getUTCDay(), run.queue === 'biographies' ? 2 : 5, 'Wrong publication weekday');
    if (run.state === 'empty') {
      for (const key of ['rowId', 'slug', 'draftPath', 'manuscriptSha256', 'publishedAt', 'publicSha256', 'verifiedAt']) assert.equal(run[key], null, 'Empty run has article state');
      continue;
    }
    assert.ok(run.rowId && run.slug && run.draftPath && run.manuscriptSha256, 'Selection is incomplete');
    assert.ok(!selectedRows.has(run.rowId), 'Article selected twice'); selectedRows.add(run.rowId);
    const row = rows.find(r => r.id === run.rowId);
    assert.ok(row, 'Selected row missing');
    assert.equal(row.draftPath, run.draftPath, 'Selected path changed');
    assert.ok(run.draftPath.startsWith('docs/editorial/drafts/') && !run.draftPath.split('/').includes('..'), 'Unsafe selected path');
    if (run.state !== 'succeeded') {
      assert.ok(!activeQueues.has(run.queue), 'Multiple active selections in one queue'); activeQueues.add(run.queue);
    }
    if (run.state === 'selected') {
      assert.equal(run.publishedAt, null); assert.equal(run.publicSha256, null); assert.equal(run.verifiedAt, null);
      assert.ok(!row.publishedDestination && !articles.has(`/archive/${run.slug}`), 'Reserved article already public');
    } else {
      assert.ok(run.publishedAt && run.publicSha256, 'Publication evidence missing');
      assert.equal(row.publishedDestination, `/archive/${run.slug}`, 'Publication destination mismatch');
      assert.equal(row.status, run.state === 'succeeded' ? 'published' : 'publication_pending');
      assert.equal(articles.get(row.publishedDestination)?.editorialMode, 'factual');
      assert.equal(row.publicationClass, publicationClasses[run.queue]);
      assert.equal(Boolean(run.verifiedAt), run.state === 'succeeded', 'Verification state mismatch');
    }
  }
  for (const row of rows) {
    if (row.publicationClass === publicationClasses.biographies) assert.ok(row.migration && (row.personId ?? row.migration.personId), 'Biography class requires career identity');
    if (row.publicationClass === publicationClasses.matches) assert.ok(row.historicalEventDate && !row.migration, 'Match class requires a match row');
    if (row.status === 'publication_pending') assert.ok(config.runs.some(r => r.rowId === row.id && r.state === 'publication_pending'), 'Pending publication has no run');
  }
}
