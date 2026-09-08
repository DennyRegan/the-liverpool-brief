import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { HistoryEventSchema, getHistoryEvents, getHistoryWindow, getWeekReading } from '../lib/content/this-week.ts';
import { ArchiveFeatureSchema } from '../lib/content/types.ts';

const base = { month: 9, day: 12, year: 1989, title: 'Test event', summary: 'Test summary', source: 'https://example.com/source', slug: 'test-event' };
const fields = { ...base };
delete fields.slug;
const archive = { title: 'Test archive', date: '2026-09-05', historicalPeriod: 'September 1989', decade: '1980s', excerpt: 'Test excerpt', slug: 'test-archive', body: 'One standalone article.' };

test('today plus six days, including both endpoints and multiple events', () => {
  const events = [base, { ...base, slug: 'older', year: 1970 }, { ...base, slug: 'first', day: 6 }, { ...base, slug: 'outside', day: 13 }];
  const days = getHistoryWindow(events, new Date('2026-09-06T12:00:00Z'));
  assert.equal(days.length, 7);
  assert.equal(days[0].iso, '2026-09-06');
  assert.equal(days[6].iso, '2026-09-12');
  assert.equal(days[0].events.length, 1);
  assert.equal(days[1].events.length, 0);
  assert.deepEqual(days[6].events.map(e => e.year), [1970, 1989]);
});
test('events recur by month/day in later years', () => {
  for (const year of [2026, 2027, 2030]) {
    const day = getHistoryWindow([base], new Date(`${year}-09-12T12:00:00Z`))[0];
    assert.equal(day.events[0].year, 1989);
  }
});
test('window moves forward without editing content', () => {
  assert.equal(getHistoryWindow([], new Date('2026-09-07T12:00:00Z'))[6].iso, '2026-09-13');
});
test('month and year boundaries use chronological calendar dates', () => {
  const days = getHistoryWindow([], new Date('2026-12-29T12:00:00Z'));
  assert.deepEqual(days.map(d => d.iso), ['2026-12-29','2026-12-30','2026-12-31','2027-01-01','2027-01-02','2027-01-03','2027-01-04']);
});
test('London midnight and daylight saving are respected', () => {
  assert.equal(getHistoryWindow([], new Date('2026-09-05T23:30:00Z'))[0].iso, '2026-09-06');
  assert.equal(getHistoryWindow([], new Date('2026-01-05T23:30:00Z'))[0].iso, '2026-01-05');
  for (const date of ['2026-03-27T12:00:00Z','2026-10-23T12:00:00Z']) {
    const days = getHistoryWindow([], new Date(date));
    assert.equal(new Set(days.map(d => d.iso)).size, 7);
    assert.equal(Date.parse(days[6].iso) - Date.parse(days[0].iso), 6 * 86400000);
  }
});
test('leap-day event appears only when the displayed year has February 29', () => {
  const leap = { ...base, year: 2000, month: 2, day: 29 };
  assert.equal(getHistoryWindow([leap], new Date('2028-02-27T12:00:00Z')).flatMap(d => d.events).length, 1);
  assert.equal(getHistoryWindow([leap], new Date('2027-02-27T12:00:00Z')).flatMap(d => d.events).length, 0);
});
test('optional image and archive link validate; neither is required', () => {
  assert.ok(HistoryEventSchema.safeParse(fields).success);
  assert.ok(HistoryEventSchema.safeParse({ ...fields, archiveSlug: 'test-archive', image: { src: '/images/test.png', alt: 'Test image', width: 800, height: 500 } }).success);
});
test('approved artwork windows stay inside their source image', () => {
  const image = { src: '/images/history/approved.png', alt: 'Illustration', width: 1024, height: 1536, kind: 'illustration', crop: { x: 220, y: 163, width: 284, height: 314 } };
  assert.ok(HistoryEventSchema.safeParse({ ...fields, image }).success);
  for (const crop of [
    { ...image.crop, x: -1 }, { ...image.crop, width: 0 },
    { ...image.crop, x: 1000 }, { ...image.crop, y: 1500 },
  ]) assert.equal(HistoryEventSchema.safeParse({ ...fields, image: { ...image, crop } }).success, false);
  assert.equal(HistoryEventSchema.safeParse({ ...fields, image: { ...image, kind: 'archive photograph' } }).success, false);
});
test('history remains text-only while preserving recurring events and Archive links', () => {
  const events = getHistoryEvents();
  const week = getHistoryWindow(events, new Date('2026-09-06T12:00:00Z'));
  const selected = week.flatMap(day => day.events);
  assert.deepEqual(selected.map(event => event.day), [6, 7, 9, 10, 11, 12]);
  assert.equal(week[2].events.length, 0);
  assert.equal(selected.find(event => event.day === 12).archiveSlug, 'liverpool-9-crystal-palace-0');
  assert.ok(events.every(event => !event.image && event.source.startsWith('https://')));
});
test('invalid dates, sources, images and article references are rejected', () => {
  for (const data of [
    { ...fields, source: undefined }, { ...fields, source: 'javascript:alert(1)' },
    { ...fields, month: 2, day: 30 }, { ...fields, month: 2, day: 29, year: 1989 },
    { ...fields, month: 13 }, { ...fields, year: 0 }, { ...fields, title: '' },
    { ...fields, archiveSlug: '../../file' },
    { ...fields, image: { src: '/images/../secret.png', alt: '', width: 0, height: 1 } },
  ]) assert.equal(HistoryEventSchema.safeParse(data).success, false);
});
test('Archive publication date and optional historical date stay separate', () => {
  assert.equal(ArchiveFeatureSchema.parse(archive).historicalEventDate, undefined);
  const parsed = ArchiveFeatureSchema.parse({ ...archive, historicalEventDate: '1989-09-12' });
  assert.equal(parsed.date, '2026-09-05');
  assert.equal(parsed.historicalEventDate, '1989-09-12');
  assert.equal(ArchiveFeatureSchema.safeParse({ ...archive, historicalEventDate: '1989-02-30' }).success, false);
});
test('content loader supports empty folders, validates references, and reports filenames', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-history-test-'));
  try {
    assert.deepEqual(getHistoryEvents(root), []);
    const eventsDir = path.join(root, 'content/this-week/liverpool');
    fs.mkdirSync(eventsDir, { recursive: true });
    const file = path.join(eventsDir, 'test.md');
    const write = data => fs.writeFileSync(file, `---\n${JSON.stringify(data)}\n---\n`);
    write(fields);
    assert.equal(getHistoryEvents(root)[0].slug, 'test');
    write({ ...fields, archiveSlug: 'test-archive' });
    assert.throws(() => getHistoryEvents(root), /test.md.*Archive article not found/);
    fs.mkdirSync(path.join(root, 'content/archive/liverpool'), { recursive: true });
    fs.writeFileSync(path.join(root, 'content/archive/liverpool/test-archive.md'), 'Standalone body');
    assert.equal(getHistoryEvents(root)[0].archiveSlug, 'test-archive');
    write({ ...fields, image: { src: '/images/test.png', alt: 'Test image', width: 1, height: 1 } });
    assert.throws(() => getHistoryEvents(root), /test.md.*Image not found/);
    fs.mkdirSync(path.join(root, 'public/images'), { recursive: true });
    fs.writeFileSync(path.join(root, 'public/images/test.png'), 'test image');
    assert.ok(getHistoryEvents(root)[0].image);
    fs.appendFileSync(file, 'Full article body must not be copied here.');
    assert.throws(() => getHistoryEvents(root), /full articles belong in Archive/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});


test('further reading automatically matches historical dates and deduplicates manual links', () => {
  const days = getHistoryWindow([{ ...base, archiveSlug: 'dated' }, { ...base, slug: 'second', archiveSlug: 'dated' }], new Date('2026-09-06T12:00:00Z'));
  const articles = [{ slug: 'dated', historicalEventDate: '1989-09-12' }, { slug: 'outside', historicalEventDate: '1989-09-13' }, { slug: 'legacy' }];
  assert.deepEqual(getWeekReading(articles, days).map(a => a.slug), ['dated']);
  const nextYear = getHistoryWindow([], new Date('2027-09-06T12:00:00Z'));
  assert.deepEqual(getWeekReading(articles, nextYear).map(a => a.slug), ['dated']);
  const rollover = getHistoryWindow([], new Date('2026-12-29T12:00:00Z'));
  assert.equal(getWeekReading([{ slug: 'new-year', historicalEventDate: '2000-01-01' }], rollover).length, 1);
});
