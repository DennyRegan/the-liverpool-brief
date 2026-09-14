import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import matter from 'gray-matter';
import { z } from 'zod';
import { getHistoryEvents } from '../lib/content/this-week.ts';
import { getArchiveFeatures } from '../lib/content/archive.ts';

export const calendarPath = 'docs/editorial/history-calendar.json';
const text = z.string().min(1);
const entrySchema = z.object({
  id: text, event: text, historicalEventDate: z.iso.date(), featuredWeek: z.iso.date(),
  selection: z.enum(['selected', 'provisional', 'alternative']),
  status: z.enum(['planned', 'writing', 'ready_for_review', 'approved', 'published', 'blocked']),
  owner: text.nullable(),
  claim: z.object({ token: text, claimedAt: z.iso.datetime(), baseCommit: text }).strict().nullable(),
  eventPath: text.nullable(), draftPath: text.nullable(), originalDraftId: text.nullable(),
  publishedDestination: z.string().regex(/^\/archive\/[a-z0-9]+(?:-[a-z0-9]+)*$/).nullable(),
  approval: z.object({ by: z.literal('Denny'), recordedAt: z.iso.datetime(), evidence: text }).strict().nullable(),
  notes: text,
  evidence: z.array(z.object({ location: text, confidence: z.enum(['high', 'medium', 'low', 'unverified']), scope: text }).strict()).min(1),
  researchStatus: z.enum(['not_rechecked', 'needs_research', 'verified']),
}).strict();

export function validateCalendar(calendar, root = process.cwd()) {
  assert.equal(calendar.version, 1);
  assert.equal(calendar.timezone, 'Europe/London');
  assert.equal(calendar.canonicalLocation, `https://github.com/DennyRegan/the-liverpool-brief/blob/main/${calendarPath}`);
  const entries = z.array(entrySchema).min(1).parse(calendar.entries);
  const ids = new Set(), dates = new Set(), drafts = new Set();
  const articles = new Map(getArchiveFeatures(root).map(a => [`/archive/${a.slug}`, a]));
  const events = new Map(getHistoryEvents(root).map(e => [`content/this-week/liverpool/${e.slug}.md`, e]));
  const readFile = (relative, prefix) => {
    assert.ok(relative.startsWith(prefix) && !relative.split('/').includes('..'), `Unsafe path: ${relative}`);
    return matter(fs.readFileSync(path.join(root, relative), 'utf8')).data;
  };
  for (const e of entries) {
    assert.ok(!ids.has(e.id), `Duplicate row ${e.id}`); ids.add(e.id);
    const identity = `${e.featuredWeek}:${e.historicalEventDate}:${e.event}`;
    assert.ok(!dates.has(identity), `Duplicate event ${identity}`); dates.add(identity);
    const monday = new Date(`${e.featuredWeek}T12:00:00Z`);
    assert.equal(monday.getUTCDay(), 1, `${e.id}: featuredWeek must be Monday`);
    const weekDates = Array.from({ length: 7 }, (_, i) => new Date(+monday + i * 86400000).toISOString().slice(5, 10));
    assert.ok(weekDates.includes(e.historicalEventDate.slice(5)), `${e.id}: anniversary outside featured week`);
    if (e.eventPath) {
      const event = events.get(e.eventPath);
      assert.ok(event, `${e.id}: missing event file`);
      assert.equal(`${event.year}-${String(event.month).padStart(2, '0')}-${String(event.day).padStart(2, '0')}`, e.historicalEventDate, `${e.id}: event date mismatch`);
    }
    if (e.draftPath) {
      assert.ok(!drafts.has(e.draftPath), `Draft reused by duplicate row: ${e.draftPath}`); drafts.add(e.draftPath);
      const draft = readFile(e.draftPath, 'docs/editorial/drafts/');
      assert.equal(draft.historicalEventDate, e.historicalEventDate, `${e.id}: draft date mismatch`);
      if (draft.season) assert.match(draft.season, /^\d{4}-\d{2}$/, `${e.id}: noncanonical season`);
      if (draft.season) assert.equal(Number(draft.season.slice(5)), (Number(draft.season.slice(0, 4)) + 1) % 100, `${e.id}: nonconsecutive season`);
    }
    if (['ready_for_review', 'approved'].includes(e.status)) assert.ok(e.draftPath && e.owner, `${e.id}: completed draft requires path and owner`);
    if (e.status === 'writing') assert.ok(e.claim && e.owner, `${e.id}: writing requires a claim and owner`);
    else assert.equal(e.claim, null, `${e.id}: only writing rows may hold a claim`);
    if (e.status === 'approved') assert.ok(e.approval, `${e.id}: explicit approval missing`);
    if (e.status === 'published') assert.ok(e.publishedDestination, `${e.id}: publication destination missing`);
    if (e.publishedDestination) {
      const article = articles.get(e.publishedDestination);
      assert.ok(article, `${e.id}: published destination missing from canonical collection`);
      assert.equal(article.historicalEventDate, e.historicalEventDate, `${e.id}: published date mismatch`);
    }
  }
  return entries;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const entries = validateCalendar(JSON.parse(fs.readFileSync(calendarPath, 'utf8')));
  console.log(`Validated ${entries.length} shared calendar entries. Historical truth and approval evidence require editorial review.`);
}
