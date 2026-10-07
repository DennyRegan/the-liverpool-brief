// Run against a production preview: BASE_URL=http://127.0.0.1:3157 node scripts/verify-history-v3.mjs
import assert from "node:assert/strict";
import {
  getV3Context,
  deriveTimeline,
  getJourneys,
  continueFrom,
  selectLiverpoolYears,
} from "../lib/content/history-v3.ts";
const base = process.env.BASE_URL ?? "http://127.0.0.1:3157";
const context = getV3Context(),
  timeline = deriveTimeline(context),
  journeys = getJourneys(process.cwd(), context);
const cache = new Map();
let redirectChecks = 0;
async function get(route, status = 200) {
  const key = route.split("#")[0];
  if (!cache.has(key)) {
    const r = await fetch(base + key, { redirect: "manual", signal: AbortSignal.timeout(15000) });
    cache.set(key, { status: r.status, html: await r.text() });
  }
  const r = cache.get(key);
  assert.equal(r.status, status, route);
  return r.html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? r.html;
}
async function target(href) {
  const html = await get(href);
  const anchor = href.split("#")[1];
  if (anchor) assert.ok(html.includes(`id="${anchor}"`), href);
}
// Removed public routes must redirect, including old filters and deep journey URLs.
const removedRoute = href => /^\/history\/(timeline|journeys)(?:[/?#]|$)/.test(href);
function noRemovedLinks(html, route) {
  for (const [, href] of html.matchAll(/href="([^"]+)"/g))
    assert.ok(!removedRoute(href), `${route}: removed navigation ${href}`);
}
async function redirect(route) {
  const response = await fetch(base + route, { redirect: "manual", signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 308, `${route}: permanent redirect`);
  redirectChecks++;
  const location = response.headers.get("location");
  assert.ok(location, `${route}: Location header`);
  const destination = new URL(location, base);
  assert.equal(destination.origin, new URL(base).origin);
  assert.equal(destination.pathname, "/history", route);
  for (const [key, value] of new URL(route, base).searchParams)
    assert.equal(destination.searchParams.get(key), value, `${route}: preserve query`);
  assert.ok((await get(destination.pathname + destination.search)).includes("Liverpool History Explorer"));
}
for (const route of [
  "/history/timeline", "/history/timeline?season=1985-86",
  "/history/timeline?decade=invalid", "/history/journeys",
  "/history/journeys/not-a-journey",
  "/history/journeys/dalglish-player-to-manager/99",
  "/history/journeys/dalglish-player-to-manager/01",
  ...journeys.flatMap(j => [
    `/history/journeys/${j.id}`,
    ...j.steps.map((_, i) => `/history/journeys/${j.id}/${i + 1}`),
  ]),
]) await redirect(route);
const gateway = await get("/history");
noRemovedLinks(gateway, "/history");
const tiles = gateway.match(/<nav[^>]*aria-label="Ways into Liverpool history"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
assert.ok(tiles, "History entry tiles");
assert.equal((tiles.match(/<a\b/g) ?? []).length, 6);
assert.ok(tiles.includes('href="/history/my-years"'));
assert.ok(!gateway.includes("Guided Journeys"));
assert.ok(!gateway.includes('id="guided-journeys"'));
assert.ok(!gateway.includes('class="v3-journey-cards"'));
assert.ok(gateway.includes('href="/history/seasons"'), "Seasons remains in History navigation");
const sitemap = await get("/sitemap.xml");
for (const [, location] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g))
  assert.ok(!removedRoute(new URL(location).pathname), `Sitemap: ${location}`);
const seasonPage = await get("/history/seasons/1985-86");
assert.match(seasonPage, /<a\b(?=[^>]*class="hx-back")(?=[^>]*href="\/history\/seasons")[^>]*>/);
assert.ok(seasonPage.includes('aria-current="page" href="/history/seasons"'));
// My Years retains the full chronology; no standalone Timeline page is needed.
const html = await get(`/history/my-years?from=${timeline[0].year}`);
for (const s of timeline) {
  assert.ok(html.includes(`id="year-${s.year}"`));
  for (const e of s.entries) {
    await target(e.href);
    for (const l of e.links) await target(l.href);
  }
}
assert.equal((html.match(/data-timeline-id="article-/g) ?? []).length, timeline.flatMap(s => s.entries).filter(e => e.kind === "article").length);
for (const from of [1965, 1974, 1977, 1985, 1990, 2005, 2015]) {
  const page = await get("/history/my-years?from=" + from);
  noRemovedLinks(page, `My Years ${from}`);
  assert.ok(page.includes('href="/history">Just let me explore</a>'));
  const actual = [...page.matchAll(/class="v3-year" id="year-(\d+)"/g)].map(
    (m) => Number(m[1]),
  );
  const selected = selectLiverpoolYears(timeline, from);
  assert.deepEqual(
    [...page.matchAll(/data-timeline-id="([^"]+)"/g)].map(m => m[1]),
    selected.flatMap(s => s.entries.filter(e => e.kind !== "season").map(e => e.id)),
    `My Years ${from}: exact entries`,
  );
  assert.deepEqual(
    actual,
    selectLiverpoolYears(timeline, from).map((s) => s.year),
  );
}
for (const c of [
  ...context.destinations.map((d) => ({ entityId: d.entity.id })),
  ...context.seasons.map((s) => ({ season: s.season })),
  ...context.eras.map((e) => ({ eraId: e.id })),
  ...context.articles.map((a) => ({ articleSlug: a.slug })),
]) {
  const route = "season" in c ? `/history/seasons/${c.season}`
    : "entityId" in c ? context.destinations.find(d => d.entity.id === c.entityId).href
    : "eraId" in c ? `/history/${c.eraId}` : `/archive/${c.articleSlug}`;
  noRemovedLinks(await get(route), route);
  for (const l of continueFrom(c, context)) {
    assert.ok(!removedRoute(l.href), `Continuation: ${l.href}`);
    await target(l.href);
  }
}
for (const route of [
  "/history/people/not-eligible",
  "/archive/torres-goodison-derby-double-2008",
  "/archive/heysel-1985-thirty-nine-lives",
  "/archive/hillsborough-1989-ninety-seven-lives",
])
  await get(route, 404);
assert.ok(
  (await get("/history/my-years?from=invalid")).includes(
    "Choose a starting year between",
  ),
);
const published = new Set(context.articles.map((a) => "/archive/" + a.slug));
for (const route of [
  `/history/my-years?from=${timeline[0].year}`,
  ...["1965", "1974", "1977", "1985", "1990", "2005", "2015"].map(
    (y) => "/history/my-years?from=" + y,
  ),
])
  for (const m of (await get(route)).matchAll(/href="(\/archive\/[^"?#]+)"/g))
    assert.ok(published.has(m[1]), `Only factual published reading: ${m[1]}`);
console.log(
  `PASS V3: ${timeline.length} years, ${timeline.reduce((n, s) => n + s.entries.length, 0)} entries; ${redirectChecks} permanent redirects across ${journeys.length} legacy journeys; seven starting years; every entry, context, continuation and fragment target; ${cache.size} unique URL checks including 404/publication boundaries.`,
);
