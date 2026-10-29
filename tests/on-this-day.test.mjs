import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getHistoryLibrary, londonDate, eventsOnDate } from '../lib/content/history-library.ts';
import { calendarDate, calendarLabel, adjacentDate, eventWeek, nextEventDates, eventLinks, briefCopy } from '../lib/content/on-this-day.ts';
import { loadHistoryPrototype } from '../lib/content/history-prototype.ts';
const library = getHistoryLibrary();
const forest = library.events.find(e => e.date === '1988-04-13');
function fixture(run) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'on-this-day-'));
  fs.cpSync('content', path.join(root, 'content'), { recursive: true });
  try { return run(root); } finally { fs.rmSync(root, { recursive: true, force: true }); }
}
test('UK midnight is independent of UTC and correctly follows both DST transitions', () => {
  for (const [instant, date] of [
    ['2026-06-01T22:59:59Z', '2026-06-01'], ['2026-06-01T23:00:00Z', '2026-06-02'],
    ['2026-12-31T23:59:59Z', '2026-12-31'], ['2027-01-01T00:00:00Z', '2027-01-01'],
    ['2026-03-29T00:59:59Z', '2026-03-29'], ['2026-03-29T01:00:00Z', '2026-03-29'],
    ['2026-03-29T23:00:00Z', '2026-03-30'], ['2026-10-24T23:00:00Z', '2026-10-25'],
    ['2026-10-25T01:00:00Z', '2026-10-25'], ['2026-10-25T23:00:00Z', '2026-10-25'],
  ]) assert.equal(londonDate(new Date(instant)), date, instant);
});
test('calendar input recovers from arrays, impossible dates and years outside supported bounds', () => {
  const now = new Date('2026-06-01T23:30:00Z');
  for (const input of ['', ['2026-04-13'], '2026-02-29', '1900-02-29', '0000-01-01', '10000-01-01', '2026-04-13T12:00:00Z'])
    assert.deepEqual(calendarDate(input, now), { date: '2026-06-02', invalid: true });
  assert.deepEqual(calendarDate(undefined, now), { date: '2026-06-02', invalid: false });
  assert.equal(calendarDate('2000-02-29', now).invalid, false);
  assert.equal(adjacentDate('0001-01-01', -1), undefined);
  assert.equal(adjacentDate('9999-12-31', 1), undefined);
  assert.equal(calendarLabel('1892-09-01'), '1 September 1892');
});
test('leap anniversaries are exact, including the eight-year gap across 2100', () => {
  const leap = { ...forest, date: '2000-02-29' };
  assert.equal(eventsOnDate([leap], '2027-02-28').length, 0);
  assert.equal(eventsOnDate([leap], '2027-03-01').length, 0);
  assert.equal(eventsOnDate([leap], '2028-02-29').length, 1);
  assert.equal(nextEventDates([leap], '2096-03-01')[0].date, '2104-02-29');
  assert.deepEqual(nextEventDates([leap], '9999-12-31'), []);
  assert.equal(nextEventDates([{ ...forest, date: '2030-04-13' }], '2026-04-13')[0].date, '2030-04-13');
});
test('seven calendar days cross year, leap and DST boundaries without duplication', () => {
  const events = ['2000-12-31', '2001-01-01', '2000-02-29', '2001-03-01', '2001-03-25', '2001-03-31'].map((date, i) => ({ ...forest, id: `fixture-${i}`, date }));
  assert.deepEqual(eventWeek(events, '2027-01-04').map(x => x.anniversary), ['2026-12-31', '2027-01-01']);
  assert.deepEqual(eventWeek(events, '2028-03-01').map(x => x.anniversary), ['2028-02-29', '2028-03-01']);
  assert.deepEqual(eventWeek(events, '2027-03-01').map(x => x.anniversary), ['2027-03-01']);
  assert.deepEqual(eventWeek(events, '2026-03-31').map(x => x.anniversary), ['2026-03-25', '2026-03-31']);
  assert.equal(eventWeek([forest], '2026-04-19').length, 1);
  assert.equal(eventWeek([forest], '2026-04-20').length, 0);
});
test('the site reuses approved prose, without an on-demand summary layer', () => {
  assert.equal(library.events.length, 9);
  assert.equal(forest.description, library.articles.find(a => a.href === forest.href).excerpt);
  assert.equal(forest.title, library.articles.find(a => a.href === forest.href).title);
});
test('withdrawal and factual-status changes exclude cards, date shortcuts and newsletter drafts', () => fixture(root => {
  const file = path.join(root, 'content/archive/liverpool/liverpool-nottingham-forest-1988-five-at-anfield.md');
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('editorialMode: factual', 'editorialMode: opinion'));
  const events = getHistoryLibrary(root).events;
  assert.equal(events.some(e => e.id === forest.id), false);
  assert.equal(eventWeek(events, '2026-04-19').length, 0);
  assert.equal(nextEventDates(events, '2026-04-01').some(x => x.event.id === forest.id), false);
}));
test('review season does not add events or unavailable person links; public match-season link remains useful', { skip: !fs.existsSync('prototype/history/1987-88.json') && 'Local editorial pack not installed' }, () => {
  const review = getHistoryLibrary(process.cwd(), loadHistoryPrototype().season);
  assert.deepEqual(review.events, library.events);
  const links = eventLinks({ ...forest, personIds: ['bruce-grobbelaar', 'john-barnes'] }, review);
  assert.ok(links.some(l => l.href === '/history/seasons/1987-88'));
  assert.ok(links.some(l => l.href === '/history/people/john-barnes'));
  assert.ok(!links.some(l => l.href.includes('bruce-grobbelaar')));
});
test('Sunday copy includes canonical URL, historical date and verification, without article body', () => {
  const text = briefCopy(forest, '2026-04-13');
  assert.match(text, /On This Day — 13 April 2026/);
  assert.match(text, /Historical date: 13 April 1988/);
  assert.ok(text.includes(`https://theliverpoolbrief.com${forest.href}`));
  assert.ok(text.includes(forest.sourceUrls[0]));
  assert.ok(text.includes(forest.scope));
  assert.doesNotMatch(text, /localhost|127\.0\.0\.1/);
});
