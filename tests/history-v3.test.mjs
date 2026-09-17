import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  getV3Context,
  deriveTimeline,
  filterTimeline,
  selectLiverpoolYears,
  getJourneys,
  resolveJourneyStep,
  continueFrom,
  JourneySchema,
  timelineOptions,
} from "../lib/content/history-v3.ts";
const context = getV3Context();
const timeline = deriveTimeline(context);
const entries = timeline.flatMap((s) => s.entries);
const journeys = getJourneys(process.cwd(), context);

test("V3 projects canonical factual content without copying article bodies or publication dates", () => {
  const articles = entries.filter((e) => e.kind === "article");
  assert.ok(articles.length > 0);
  for (const match of context.articles.filter(a => a.articleType === "match" && a.historicalEventDate)) {
    assert.ok(articles.some(e => e.href === `/archive/${match.slug}`), `Published match included: ${match.slug}`);
  }
  for (const e of articles) {
    const a = context.articles.find((a) => `article-${a.slug}` === e.id);
    assert.ok(a);
    assert.equal(a.editorialMode, "factual");
    assert.equal(e.date, a.historicalEventDate);
    assert.equal(e.href, `/archive/${a.slug}`);
    assert.ok(!("body" in e));
  }
  assert.equal(new Set(entries.map((e) => e.id)).size, entries.length);
  assert.equal(
    entries.filter((e) => e.kind === "season").length,
    context.seasons.length,
  );
  assert.equal(
    entries.filter((e) => e.kind === "event").length,
    context.seasons.reduce((n, s) => n + s.events.length, 0),
  );
  assert.equal(
    entries.filter((e) => e.kind === "era").length,
    context.eras.length,
  );
  assert.ok(
    !JSON.stringify(timeline).includes("torres-goodison-derby-double-2008"),
  );
});

test("calendar chronology preserves summer dates, period context and undated events honestly", () => {
  assert.deepEqual(
    timeline.map((s) => s.year),
    timeline.map((s) => s.year).sort((a, b) => a - b),
  );
  for (const section of timeline) {
    const dates = section.entries.filter((e) => e.date).map((e) => e.date);
    assert.deepEqual(dates, [...dates].sort());
  }
  const summer = entries.find((e) => e.id === "event-1960-61-lewis-arrives");
  assert.equal(summer.date, "1960-06-16");
  assert.equal(summer.year, 1960);
  assert.equal(summer.season, "1960-61");
  const undated = entries.find(
    (e) => e.id === "event-1967-68-hunt-overall-scoring-record-1967",
  );
  assert.equal(undated.date, undefined);
  assert.equal(undated.year, 1967);
  const perturbed = {
    ...context,
    articles: context.articles.map((a, i) => ({
      ...a,
      date: `${2020 + i}-01-01`,
    })),
  };
  assert.deepEqual(deriveTimeline(perturbed), timeline);
  assert.ok(!entries.some((e) => e.id === "article-phil-thompson"));
});

test("timeline filters intersect and sparse periods do not fabricate entries", () => {
  const filtered = filterTimeline(timeline, {
    decade: "1980s",
    season: "1985-86",
  });
  assert.ok(filtered.length);
  assert.ok(
    filtered.every(
      (s) =>
        s.year >= 1980 &&
        s.year < 1990 &&
        s.entries.every((e) => e.season === "1985-86"),
    ),
  );
  assert.deepEqual(filterTimeline(timeline, { season: "not-a-season" }), []);
  assert.deepEqual(
    deriveTimeline({ ...context, articles: [], seasons: [], eras: [] }),
    [],
  );
  assert.ok(timelineOptions(timeline).seasons.includes("1985-86"));
});
for (const from of [1965, 1974, 1977, 1985, 1990, 2005, 2015])
  test(`Your Liverpool Years respects ${from} and canonical season boundaries`, () => {
    const selected = selectLiverpoolYears(timeline, from);
    assert.ok(selected.length);
    assert.ok(selected.every((s) => s.year >= from));
    assert.ok(
      selected
        .flatMap((s) => s.entries)
        .every((e) => !e.season || Number(e.season.slice(0, 4)) >= from),
    );
    assert.deepEqual(
      selected
        .flatMap((s) => s.entries.filter((e) => e.kind === "season"))
        .map((e) => e.season),
      context.seasons
        .map((s) => s.season)
        .filter((s) => Number(s.slice(0, 4)) >= from)
        .sort(),
    );
    for (const e of selected.flatMap((s) => s.entries))
      assert.ok(entries.includes(e));
  });

test("all four editorial journeys resolve deterministically to canonical destinations", () => {
  assert.equal(journeys.length, 4);
  assert.equal(
    journeys.reduce((n, j) => n + j.steps.length, 0),
    32,
  );
  assert.deepEqual(
    getJourneys(process.cwd(), {
      ...context,
      articles: [...context.articles].reverse(),
    }),
    journeys,
  );
  for (const j of journeys) {
    const raw = JSON.parse(
      fs.readFileSync(`content/history/liverpool/journeys/${j.id}.json`),
    );
    assert.deepEqual(
      raw.steps.map((s) => Object.keys(s).sort()),
      raw.steps.map(() => ["id", "kind"]),
    );
    for (const s of j.steps) {
      assert.ok(s.href.startsWith("/"));
      assert.ok(!("body" in s));
      assert.deepEqual(
        resolveJourneyStep({ kind: s.kind, id: s.id }, context),
        s,
      );
    }
  }
});

test("journeys fail closed for unavailable articles, thin entities, missing Seasons and duplicated steps", () => {
  for (const ref of [
    { kind: "article", id: "torres-goodison-derby-double-2008" },
    { kind: "article", id: "not-published" },
    { kind: "person", id: "not-eligible" },
    { kind: "season", id: "1800-01" },
  ])
    assert.throws(() => resolveJourneyStep(ref, context), /unavailable/);
  const opinion = {
    ...context.articles[0],
    slug: "opinion",
    editorialMode: "opinion",
  };
  assert.throws(
    () =>
      resolveJourneyStep(
        { kind: "article", id: "opinion" },
        { ...context, articles: [opinion] },
      ),
    /unavailable/,
  );
  assert.equal(
    JourneySchema.safeParse({
      id: "bad",
      title: "Bad",
      introduction: "Bad",
      steps: Array(3).fill({ kind: "season", id: "1985-86" }),
    }).success,
    false,
  );
});

test("Continue routes reuse eligible destinations, prefer direct journeys and bound suggestions", () => {
  const dalglish = continueFrom(
    { entityId: "kenny-dalglish" },
    context,
    journeys,
  );
  assert.equal(
    dalglish[0].href,
    "/history/journeys/dalglish-player-to-manager",
  );
  for (const c of [
    ...context.destinations.map((d) => ({ entityId: d.entity.id })),
    ...context.seasons.map((s) => ({ season: s.season })),
    ...context.eras.map((e) => ({ eraId: e.id })),
    ...context.articles.map((a) => ({ articleSlug: a.slug })),
  ]) {
    const links = continueFrom(c, context, journeys);
    assert.ok(links.length <= 3);
    assert.equal(new Set(links.map((l) => l.href)).size, links.length);
    for (const l of links) {
      if (l.href.startsWith("/history/people/"))
        assert.ok(context.destinations.some((d) => d.href === l.href));
      if (l.href.includes("#year-"))
        assert.ok(
          timeline.some((s) => s.year === Number(l.href.split("#year-")[1])),
        );
    }
  }
  assert.deepEqual(
    continueFrom({ articleSlug: "not-published" }, context, journeys),
    [],
  );
});

test("new published metadata enriches timeline without rewriting curated steps", () => {
  const added = {
    ...context.articles[0],
    slug: "additional-approved-story",
    historicalEventDate: "1985-08-01",
    season: "1985-86",
  };
  const richer = { ...context, articles: [...context.articles, added] };
  assert.equal(
    deriveTimeline(richer).flatMap((s) => s.entries).length,
    entries.length + 1,
  );
  assert.deepEqual(getJourneys(process.cwd(), richer), journeys);
});
