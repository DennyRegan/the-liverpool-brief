import assert from 'node:assert/strict';
import http from 'node:http';
import { getMatchCollection, matchSeasons, paginate, seasonMatchHref } from '../lib/content/match-collection.ts';
const base = process.env.BASE_URL || 'http://127.0.0.1:3147';
const review = process.env.HISTORY_REVIEW !== '0';
const all = getMatchCollection(process.cwd(), true);
const visible = getMatchCollection(process.cwd(), review);
let checked = 0;
async function page(route, status = 200, host) {
 const response = host && ['localhost', '127.0.0.1', '[::1]'].includes(new URL(base).hostname) ? await new Promise((resolve, reject) => {
  http.get(new URL(route, base), { headers: { Host: host } }, res => { let body = ''; res.setEncoding('utf8'); res.on('data', chunk => body += chunk); res.on('end', () => resolve({ status: res.statusCode, text: async () => body })); }).on('error', reject);
 }) : await fetch(new URL(route, base), { redirect: 'manual' });
 assert.equal(response.status, status, `${route}: HTTP ${response.status}`);
 checked++;
 return (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replaceAll('<!-- -->', '').replaceAll('&amp;', '&');
}
async function batches(items, fn) {
 for (let i = 0; i < items.length; i += 4) await Promise.all(items.slice(i, i + 4).map(fn));
}
const seenClassic = new Set(); const seenSeasons = new Set();
for (const season of matchSeasons(visible)) {
 const reports = visible.filter(a => a.season === season.season);
 for (let p = 1; p <= paginate(reports).pages; p++) {
  const expected = paginate(reports, String(p)).items;
  for (const [route, seen] of [[`/history/matches?season=${season.season}&page=${p}`, seenClassic], [`/history/seasons/${season.season}?page=${p}`, seenSeasons]]) {
   const html = await page(route);
   assert.ok((html.match(/id="article-/g) || []).length <= 12, `${route}: page too long`);
   for (const a of expected) {
    assert.ok(html.includes(`href="${a.href}"`), `${route}: missing ${a.href}`);
    assert.ok(html.includes(`id="article-${a.slug}"`), `${route}: missing return anchor`);
    seen.add(a.slug);
   }
  }
 }
}
assert.equal(seenClassic.size, visible.length); assert.equal(seenSeasons.size, visible.length);
await batches(all, async article => {
 const publicArticle = article.publication === 'published';
 const html = await page(article.href, review || publicArticle ? 200 : 404);
 if (review || publicArticle) assert.ok(html.includes(`rel="canonical" href="https://theliverpoolbrief.com${article.href}"`), `Canonical drift: ${article.slug}`);
 if (review && !publicArticle) { assert.match(html, /noindex/); assert.match(html, /Local review only|Local editorial review only/); }
 if (review) { const target = new URL(seasonMatchHref(article, visible), base); assert.ok(target.pathname.endsWith(article.season)); }
});
// The unfiltered landing page is a paginated story library, never a season directory.
const librarySeen = new Set();
for (let p = 1; p <= paginate(visible).pages; p++) {
 const html = await page(`/history/matches?page=${p}`);
 assert.doesNotMatch(html, /class="hl-season-grid"/);
 assert.equal((html.match(/id="article-/g) || []).length, paginate(visible, String(p)).items.length);
 for (const a of paginate(visible, String(p)).items) {
  assert.ok(html.includes(`id="article-${a.slug}"`)); librarySeen.add(a.slug);
 }
}
assert.equal(librarySeen.size, visible.length);
const experiences = await page('/history/seasons');
assert.match(experiences, /Developed season experiences/);
assert.doesNotMatch(experiences, /class="hl-season-grid"|available season collections/);
assert.equal((experiences.match(/class="hl-feature hl-season-experience"/g) || []).length, 1);
if (review) {
 assert.ok(experiences.includes('href="/history/seasons/1987-88"'));
 assert.doesNotMatch(experiences, /href="\/history\/seasons\/1960-61"/);
 const decade = await page('/history/matches?decade=1990&competition=first-division&opposition=everton');
 const expected = visible.filter(a => a.historicalEventDate?.startsWith('199') && a.competitionIds?.includes('first-division') && a.oppositionIds?.includes('everton'));
 assert.equal((decade.match(/id="article-/g) || []).length, paginate(expected).items.length);
 for (const a of paginate(expected).items) assert.ok(decade.includes(`id="article-${a.slug}"`));
 const next = await page('/history/matches?decade=1980&page=2');
 assert.match(next, /decade=1980&page=3#collection/);
 const boundary = await page('/history/matches?decade=1990&season=1989-90');
 assert.ok(boundary.includes('article-liverpool-everton-1990-barnes-beardsley-derby-double'));
 assert.doesNotMatch(await page('/history/matches?decade=invalid'), /id="article-/);
}
const landing = await page('/history/matches');
const feature = landing.match(/<section class="hl-featured-matches"[\s\S]*?<\/section>/)?.[0];
assert.ok(feature, 'Approved, verified feature missing');
assert.equal((feature.match(/<li>/g) || []).length, 1);
assert.ok(feature.includes('href="/archive/liverpool-nottingham-forest-1988-five-at-anfield"'));
assert.match(feature, /1988-04-13/);
if (paginate(visible).pages > 1) assert.doesNotMatch(await page('/history/matches?page=2'), /class="hl-featured-matches"/);
const activeFilters = await page('/history/matches?season=1987-88&decade=1980');
assert.doesNotMatch(activeFilters, /class="hl-featured-matches"/);
assert.match(activeFilters, /aria-label="Active match filters"/);
assert.match(activeFilters, /href="\/history\/matches\?decade=1980#match-filters"/);
assert.match(activeFilters, /href="\/history\/matches\?season=1987-88#match-filters"/);
assert.match(activeFilters, /Clear all/);
assert.match(landing, /aria-controls="match-filter-form"/);
assert.match(landing, /for="filter-season"/);
if (!review) assert.doesNotMatch(landing, /name="status"/);
const draft = all.find(a => a.publication === 'draft');
const withdrawn = all.find(a => a.publication === 'withdrawn');
await page(draft.href, 404, 'example.com'); await page(withdrawn.href, 404, 'example.com');
const foreign = await page('/history/matches', 200, 'example.com'); assert.doesNotMatch(foreign, /560 reports|Local approval preview/);
const sitemap = await page('/sitemap.xml'); const feed = await page('/articles'); const home = await page('/');
for (const a of all.filter(a => a.publication !== 'published')) {
 for (const html of [sitemap, feed, home]) assert.ok(!html.includes(a.href), `Private report leaked: ${a.slug}`);
}
const search = await page(`/search?q=${encodeURIComponent(draft.title)}`); assert.ok(!search.includes(`href="${draft.href}"`));
if (review) { const newsletter = await page('/preview/history/newsletter?end=2026-10-29'); assert.ok(!newsletter.includes(withdrawn.href) && !newsletter.includes(draft.href)); }
console.log(`PASS: ${checked} HTTP checks; ${visible.length} reports reachable through both Classic Matches and Seasons; canonical URLs, pagination, private readers, public feeds, search and host isolation. ${review ? 'Local-review' : 'Normal'} mode.`);
