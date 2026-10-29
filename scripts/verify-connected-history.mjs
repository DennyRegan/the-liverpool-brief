import assert from 'node:assert/strict';
import http from 'node:http';
import { getHistoryLibrary, HISTORY_NAV, availableEntities, entityHref } from '../lib/content/history-library.ts';
const base = process.env.BASE_URL || 'http://127.0.0.1:3147';
const preview = process.env.HISTORY_REVIEW !== '0';
const library = getHistoryLibrary();
const seen = new Map();
async function page(route, status = 200, headers) {
 const result = headers && ['localhost', '127.0.0.1', '[::1]'].includes(new URL(base).hostname) ? await new Promise((resolve, reject) => {
  http.get(new URL(route, base), { headers }, response => { let body = ''; response.setEncoding('utf8'); response.on('data', data => body += data); response.on('end', () => resolve({ status: response.statusCode, text: async () => body })); }).on('error', reject);
 }) : await fetch(new URL(route, base), { redirect: 'manual' });
 assert.equal(result.status, status, `${route}: expected ${status}, received ${result.status}`);
 const html = (await result.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, ''); if (status === 200 && !headers) seen.set(route, html); return html;
}
for (const route of ['/history', ...HISTORY_NAV.map(n => n.href), ...availableEntities(library).map(entityHref), ...library.series.map(s => `/history/series/${s.id}`)]) await page(route);
const season = await page('/history/seasons/1987-88');
if (preview) {
 assert.match(season, /Local editorial review/); assert.match(season.replaceAll('<!-- -->', ''), /1 published article/); assert.match(season, /Withdrawn/); assert.match(season, /noindex/);
 await page('/preview/history/newsletter?end=2026-04-19');
 const publicSeason = await page('/history/seasons/1987-88', 200, { Host: 'example.com' }); assert.doesNotMatch(publicSeason, /Withdrawn|From Highbury to Wembley/);
} else {
 await page('/preview/history/newsletter', 404);
 assert.match(season, /The season in context/);
 assert.match(season, /Explore the interactive map/);
 assert.match(season.replaceAll('<!-- -->', ''), /1 ground. 1 story./);
 assert.doesNotMatch(season, /Withdrawn|Local editorial review|href="[^"]*nicol-hat-trick|href="[^"]*arsenal-liverpool-1987/);
 const seasonSearch = await page('/search?q=1987-88');
 assert.match(seasonSearch, /href="\/history\/seasons\/1987-88"/);
}
const forest = '/archive/liverpool-nottingham-forest-1988-five-at-anfield';
await page(forest);
const old = '/archive/steve-nicol-hat-trick-newcastle-1987';
await page(old, preview ? 200 : 404);
await page(old, 404, { Host: 'example.com' });
const search = await page('/search?q=John%20Barnes');
assert.match(search, new RegExp(`href="${forest}"`)); assert.doesNotMatch(search, /href="[^" ]*nicol-hat-trick/);
const date = await page('/history/on-this-day?date=2026-04-13'); assert.match(date, /1988-04-13/); assert.match(date, /Event verification/);
const empty = await page('/history/on-this-day?date=2026-09-15'); assert.match(empty, /No verified entry for this date/);
const invalid = await page('/history/on-this-day?date=2026-02-29'); assert.match(invalid, /That date is invalid/);
const filter = await page('/history/matches?season=1987-88'); assert.match(filter, new RegExp(`href="${forest}"`));
assert.doesNotMatch(filter, /href="\/archive\/liverpools-manager/);
const unknownFilter = await page('/history/matches?season=9999-00'); assert.match(unknownFilter, /That filter is unavailable/);
await page('/history/people/not-a-person', 404); await page('/history/people/anfield', 404); await page('/history/explore/jurgen-klopp', 404); await page('/history/series/missing', 404); await page('/history/seasons/1986-87', preview ? 200 : 404);
const series = seen.get('/history/series/klopps-liverpool'); assert.match(series, /0<!-- --> chapters published/);
assert.equal((series.match(/hl-chapter-number/g) || []).length, 21);
const sitemap = await page('/sitemap.xml'); assert.ok(!sitemap.includes(old)); assert.ok(!sitemap.includes('/preview/')); assert.ok(sitemap.includes('/history/seasons/1987-88')); assert.ok(!sitemap.includes('/history/seasons/1986-87'));
const home = await page('/'); assert.match(home, /href="\/history"/); assert.doesNotMatch(home, /hl-navigation|The stories|hl-feature/);
// Walk all internal content links and fragments from the primary History pages.
const targets = new Set();
for (const [route, html] of seen) if (route.startsWith('/history') && !route.includes('?')) {
 for (const match of html.matchAll(/href="([^"<>]+)"/g)) {
  const href = match[1].replaceAll('&amp;', '&');
  if (href.startsWith('/') && !href.startsWith('/_next/')) targets.add(href);
 }
}
for (const href of targets) {
 const url = new URL(href, base); const route = url.pathname + url.search;
 const html = seen.get(route) || await page(route);
 if (url.hash) assert.ok(html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Missing fragment ${href}`);
}
console.log(`PASS: ${seen.size} successful routes; six categories, canonical links/fragments, season isolation, chapter empty state, anniversary dates, search, filters, sitemap and homepage. ${preview ? 'Local-review' : 'Normal'} mode.`);
