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
async function get(route, status = 200) {
  const key = route.split("#")[0];
  if (!cache.has(key)) {
    const r = await fetch(base + key);
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
// Timeline is the single chronology entry; canonical Season records stay reachable.
const gateway = await get("/history");
assert.ok(!gateway.includes('href="/history/seasons"'), "No competing Seasons entry");
assert.ok(gateway.includes('href="/history/timeline"'));
const seasonPage = await get("/history/seasons/1985-86");
assert.ok(seasonPage.includes('href="/history/timeline?season=1985-86"'));
assert.ok(seasonPage.includes('aria-current="location" href="/history/timeline"'));
const directory = await get("/history/journeys");
assert.equal((directory.match(/<h2\b/g) ?? []).length, journeys.length, "Journey directory uses h2 below h1");
const html = await get("/history/timeline");
for (const s of timeline) {
  assert.ok(html.includes(`id="year-${s.year}"`));
  for (const e of s.entries) {
    await target(e.href);
    for (const l of e.links) await target(l.href);
  }
}
assert.equal((html.match(/data-timeline-id="article-/g) ?? []).length, timeline.flatMap(s => s.entries).filter(e => e.kind === "article").length);
for (const j of journeys) {
  await target("/history/journeys/" + j.id);
  for (const [i, s] of j.steps.entries()) {
    const step = await get(`/history/journeys/${j.id}/${i + 1}`);
    assert.ok(step.includes(`href="${s.href}"`));
    assert.ok(
      step
        .replaceAll(/<!--.*?-->/g, "")
        .includes(`Step ${i + 1} of ${j.steps.length}`),
    );
    if (i) assert.ok(step.includes('rel="prev"'));
    if (i < j.steps.length - 1) assert.ok(step.includes('rel="next"'));
    await target(s.href);
    for (const l of s.links) await target(l.href);
  }
}
for (const from of [1965, 1974, 1977, 1985, 1990, 2005, 2015]) {
  const page = await get("/history/my-years?from=" + from);
  const actual = [...page.matchAll(/class="v3-year" id="year-(\d+)"/g)].map(
    (m) => Number(m[1]),
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
])
  for (const l of continueFrom(c, context, journeys)) await target(l.href);
for (const route of [
  "/history/journeys/not-a-journey",
  "/history/journeys/dalglish-player-to-manager/99",
  "/history/journeys/dalglish-player-to-manager/01",
  "/history/people/not-eligible",
  "/archive/torres-goodison-derby-double-2008",
  "/archive/heysel-1985-thirty-nine-lives",
  "/archive/hillsborough-1989-ninety-seven-lives",
])
  await get(route, 404);
const filtered = await get("/history/timeline?season=1985-86");
assert.ok(filtered.includes("year-1985"));
assert.ok(!filtered.includes('id="year-1984"'));
assert.ok(
  (await get("/history/my-years?from=invalid")).includes(
    "Choose a starting year between",
  ),
);
assert.ok(
  (await get("/history/timeline?decade=invalid")).includes(
    "That period is not available",
  ),
);
const published = new Set(context.articles.map((a) => "/archive/" + a.slug));
for (const route of [
  "/history/timeline",
  ...journeys.flatMap((j) =>
    j.steps.map((_, i) => `/history/journeys/${j.id}/${i + 1}`),
  ),
  ...["1965", "1974", "1977", "1985", "1990", "2005", "2015"].map(
    (y) => "/history/my-years?from=" + y,
  ),
])
  for (const m of (await get(route)).matchAll(/href="(\/archive\/[^"?#]+)"/g))
    assert.ok(published.has(m[1]), `Only factual published reading: ${m[1]}`);
console.log(
  `PASS V3: ${timeline.length} years, ${timeline.reduce((n, s) => n + s.entries.length, 0)} entries; ${journeys.length} journeys / 32 steps; seven starting years; every entry, context, continuation and fragment target; ${cache.size} unique URL checks including 404/publication boundaries.`,
);
