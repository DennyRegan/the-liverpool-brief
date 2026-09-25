// Run against a production preview. No external writes.
import assert from "node:assert/strict";
import { getJourneys, getV3Context, journeyStepHref } from "../lib/content/history-v3.ts";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3157";
const context = getV3Context();
const journeys = getJourneys(process.cwd(), context);
const factual = new Set(context.articles.map((a) => `/archive/${a.slug}`));
const pages = new Map();
const escaped = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
async function get(path, status = 200) {
  if (!pages.has(path)) {
    const response = await fetch(base + path);
    pages.set(path, { status: response.status, text: await response.text() });
  }
  const page = pages.get(path);
  assert.equal(page.status, status, path);
  return page.text.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? page.text;
}
await get("/");
await get("/history/journeys");
let redirects = 0;
for (const journey of journeys) {
  const overview = await get(`/history/journeys/${journey.id}`);
  for (const [index, step] of journey.steps.entries()) {
    const url = journeyStepHref(journey, index);
    assert.ok(overview.includes(`href="${url}"`), `Contents links to ${url}`);
    const page = await get(url);
    const plain = page.replaceAll(/<!--.*?-->/g, "");
    assert.ok(plain.includes(`${step.chapter ? "Chapter" : "Step"} ${index + 1} of ${journey.steps.length}`));
    if (index) assert.ok(page.includes(`rel="prev"`) && page.includes(`href="${journeyStepHref(journey, index - 1)}"`));
    if (index < journey.steps.length - 1) assert.ok(page.includes(`rel="next"`) && page.includes(`href="${journeyStepHref(journey, index + 1)}"`));
    assert.ok(page.includes(`href="${step.href}"`));
    await get(step.href);
    for (const ref of step.reading ?? []) {
      assert.ok(page.includes(`href="${ref.href}"`));
      await get(ref.href);
    }
    if (step.chapter) {
      for (const paragraph of step.chapter.paragraphs) assert.ok(page.includes(escaped(paragraph)), `Full prose: ${step.chapter.slug}`);
      assert.ok(page.includes('aria-current="step"'));
      assert.ok(page.includes("Sources for this chapter"));
      assert.ok(page.includes('target="_blank"'));
      assert.ok(!page.includes("use Back"));
      assert.ok(!page.includes("confidence") && !page.includes("claim token"), "Editorial evidence stays private to review files");
      for (const id of step.chapter.sourceIds) {
        const source = journey.sources.find((s) => s.id === id);
        assert.ok(page.includes(`href="${escaped(source.url)}"`));
      }
      for (const [i] of journey.steps.entries()) assert.ok(page.includes(`href="${journeyStepHref(journey, i)}"`));
      if (index === journey.steps.length - 1) {
        assert.ok(page.includes("Journey complete"));
        if (journey.closing) assert.ok(page.includes(escaped(journey.closing)));
      }
    }
    for (const match of page.matchAll(/href="(\/archive\/[^"?#]+)"/g)) assert.ok(factual.has(match[1]), `Only published factual optional reading: ${match[1]}`);
  }
  for (const [index, slug] of (journey.legacySteps ?? []).entries()) {
    const response = await fetch(`${base}/history/journeys/${journey.id}/${index + 1}`, { redirect: "manual" });
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), `/history/journeys/${journey.id}/${slug}`);
    redirects++;
  }
}
for (const path of [
  "/history/journeys/missing-journey",
  "/history/journeys/bob-paisleys-liverpool/01",
  "/history/journeys/bob-paisleys-liverpool/9",
  "/history/journeys/bob-paisleys-liverpool/missing-chapter",
  "/history/journeys/dalglish-player-to-manager/01",
  "/history/journeys/dalglish-player-to-manager/99",
  "/archive/bob-paisley-guided-journey",
]) await get(path, 404);
console.log(`PASS: ${journeys.length} journeys, ${journeys.reduce((n, j) => n + j.steps.length, 0)} reader pages; ${redirects} legacy redirects; full chapter prose, navigation, sources, canonical factual links and 404 boundaries; ${pages.size} URL checks.`);
