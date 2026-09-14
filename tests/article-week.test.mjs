import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getArticleWeek, getHistoryWindow } from '../lib/content/this-week.ts';
import { getArchiveFeatures } from '../lib/content/archive.ts';
const article = (slug, date, extra = {}) => ({ slug, historicalEventDate: date, editorialMode: 'factual', ...extra });
const event = (slug, date, archiveSlug) => ({ slug, year: Number(date.slice(0,4)), month: Number(date.slice(5,7)), day: Number(date.slice(8)), archiveSlug });
const selected = days => days.flatMap(d => d.articles).map(a => a.slug);

test('article-only week excludes unreviewed and opinion content and dates outside the week', () => {
  const days = getHistoryWindow([], new Date('2026-09-14T12:00:00Z'));
  assert.deepEqual(selected(getArticleWeek([
    article('factual', '1964-09-14'), article('unreviewed', '1964-09-14', { editorialMode: undefined }),
    article('opinion', '1964-09-14', { editorialMode: 'opinion' }), article('outside', '1985-09-21'),
  ], days)), ['factual']);
});
test('dated articles attach without a manual event link, deduplicate links and retain both Sunday reports', () => {
  const a = article('first', '1987-09-20'), b = article('second', '2006-09-20');
  const events = [event('one', '1987-09-20', 'first'), event('two', '1987-09-20', 'first')];
  for (let day = 14; day <= 20; day++) {
    const days = getArticleWeek([b, a, a], getHistoryWindow(events, new Date(`2026-09-${day}T12:00:00Z`)));
    assert.deepEqual(selected(days), ['first', 'second']);
    assert.equal(days.filter(d => d.articles.length).length, 1);
  }
  assert.deepEqual(selected(getArticleWeek([a,b], getHistoryWindow(events, new Date('2026-09-20T23:00:00Z')))), []);
});
test('legacy explicit link works, but a contradictory event date cannot move a dated article', () => {
  const days = getHistoryWindow([event('wrong', '2000-09-14', 'dated'), event('legacy', '1980-09-15', 'legacy')], new Date('2026-09-14T12:00:00Z'));
  assert.deepEqual(selected(getArticleWeek([article('dated', '2000-09-21'), article('legacy', undefined)], days)), ['legacy']);
});
test('article-only empty weeks, leap days and year boundaries retain the shared date rules', () => {
  assert.deepEqual(selected(getArticleWeek([], getHistoryWindow([], new Date('2026-09-14T12:00:00Z')))), []);
  const leap = article('leap', '2000-02-29');
  assert.deepEqual(selected(getArticleWeek([leap], getHistoryWindow([], new Date('2028-02-29T12:00:00Z')))), ['leap']);
  assert.deepEqual(selected(getArticleWeek([leap], getHistoryWindow([], new Date('2027-02-28T12:00:00Z')))), []);
  assert.deepEqual(selected(getArticleWeek([article('new-year', '2000-01-01')], getHistoryWindow([], new Date('2026-12-31T12:00:00Z')))), ['new-year']);
});
test('editorial draft directory never enters the published Archive loader', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-review-only-'));
  try {
    fs.mkdirSync(path.join(root, 'docs/editorial/drafts'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs/editorial/drafts/review-only.md'), 'Unpublished review fixture');
    assert.deepEqual(getArchiveFeatures(root), []);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
