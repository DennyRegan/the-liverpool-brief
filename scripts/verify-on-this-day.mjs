import assert from 'node:assert/strict';
import http from 'node:http';
import { getHistoryLibrary } from '../lib/content/history-library.ts';
const base = process.env.BASE_URL || 'http://127.0.0.1:3157';
const review = process.env.HISTORY_REVIEW === '1';
const library = getHistoryLibrary();
const forest = library.events.find(e => e.date === '1988-04-13');
async function page(route, status = 200, host) {
  const response = await new Promise((resolve, reject) => {
    http.get(new URL(route, base), { headers: host ? { Host: host } : {} }, res => {
      let body = ''; res.setEncoding('utf8'); res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    }).on('error', reject);
  });
  assert.equal(response.status, status, route);
  if (status === 200) {
    assert.doesNotMatch(response.body, /\/archive\/steve-nicol-hat-trick-newcastle-1987|\/archive\/barnes-beardsley-oxford-1987/);
  }
  return response;
}
let response = await page('/history/on-this-day');
assert.match(response.body, /This week in Liverpool history/);
assert.match(response.headers['cache-control'], /no-store/);
for (const input of ['2026-02-29', '2026-04-31', '0000-01-01', 'bad', '2026-04-13&date=2026-04-14']) {
  response = await page(`/history/on-this-day?date=${input}`); assert.match(response.body, /That date is invalid/);
}
for (const date of ['0001-01-01', '9999-12-31', '2028-02-29', '2026-10-29']) await page(`/history/on-this-day?date=${date}`);
response = await page('/history/on-this-day?date=2026-04-13');
assert.ok(response.body.includes(forest.description));
assert.match(response.body, /href="\/history\/seasons\/1987-88"/);
assert.match(response.body, /href="\/history\/people\/john-barnes"/);
response = await page('/history/on-this-day?date=2026-09-21'); assert.match(response.body, /Liverpool’s Manager Scored After 21 Seconds/);
response = await page('/history/on-this-day?date=2026-09-13'); assert.match(response.body, /No verified entry for this date/);
response = await page('/history/on-this-day?date=1987-04-13'); assert.match(response.body, /No verified entry for this date/);
const selected = `/preview/history/newsletter?end=2026-04-19&pick=${forest.id}`;
await page(selected, 404, 'example.com');
if (review) {
  response = await page(selected); assert.match(response.body, /Selected for your draft/); assert.match(response.body, /Copy entry and sources/); assert.ok(response.body.includes(`https://theliverpoolbrief.com${forest.href}`));
  response = await page(`/preview/history/newsletter?end=2026-04-20&pick=${forest.id}`); assert.match(response.body, /That selection is unavailable/); assert.doesNotMatch(response.body, /id="brief-entry"/);
  response = await page('/preview/history/newsletter?end=2026-04-19&pick=withdrawn'); assert.match(response.body, /That selection is unavailable/);
  response = await page('/preview/history/newsletter?end=2026-04-20'); assert.match(response.body, /No verified anniversaries/);
  response = await page('/preview/history/newsletter?end=bad'); assert.match(response.body, /Invalid date/);
} else await page(selected, 404);
for (const day of ['13','14','15','16','17','18','19']) {
  const week = await page(`/history/on-this-day?week=2026-04-${day}`);
  assert.match(week.body, /dateTime="2026-04-13"/); assert.match(week.body, /dateTime="2026-04-19"/);
  assert.ok(week.body.includes(forest.href));
}
response = await page('/history/on-this-day?week=2026-04-20'); assert.match(response.body, /No approved stories for this week/);
response = await page('/history/on-this-day?week=bad'); assert.match(response.body, /That week date is invalid/);
await page('/this-week', 308);
console.log(`PASS: On This Day dates, cache behaviour, verified entries, canonical links, empty states, invalid input and ${review ? 'editorial selection / non-local exclusion' : 'public exclusion'}.`);
