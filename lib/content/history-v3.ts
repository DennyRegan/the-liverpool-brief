import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { getFactualHistoryArticles } from "./archive.ts";
import { getHistory, eraYears } from "./history.ts";
import { getSeasons, getSeasonEras, seasonLabel } from "./seasons.ts";
import { getHistoryEntities, HistoryIdSchema } from "./entities.ts";
import { deriveExplorations, explorationSeasons } from "./exploration.ts";

export function getV3Context(root = process.cwd()) {
  const articles = getFactualHistoryArticles(root),
    seasons = getSeasons(root),
    eras = getHistory(root).eras,
    entities = getHistoryEntities(root);
  return {
    articles,
    seasons,
    eras,
    entities,
    destinations: deriveExplorations(articles, entities),
  };
}
export type V3Context = ReturnType<typeof getV3Context>;
export type RouteLink = { href: string; label: string };
export type TimelineEntry = {
  id: string;
  kind: "article" | "event" | "era" | "season";
  title: string;
  href: string;
  year: number;
  date?: string;
  season?: string;
  detail?: string;
  links: RouteLink[];
};
export type TimelineSection = { year: number; entries: TimelineEntry[] };
const seasonHref = (id: string) => `/history/seasons/${id}`;
const articleHref = (id: string) => `/archive/${id}`;
const eraHref = (id: string) => `/history/${id}`;
const yearOf = (date: string) => Number(date.slice(0, 4));
const uniqueLinks = (links: RouteLink[], exclude?: string) => [
  ...new Map(
    links.filter((l) => l.href !== exclude).map((l) => [l.href, l]),
  ).values(),
];
export const timelineYearHref = (year: number) =>
  `/history/timeline?decade=${Math.floor(year / 10) * 10}s#year-${year}`;

/** Projection only: no bodies, inferred event dates or publication-date sorting. */
export function deriveTimeline(context: V3Context): TimelineSection[] {
  const { articles, seasons, eras, destinations, entities } = context;
  const labels = new Map(entities.map((e) => [e.id, e.label]));
  const available = new Set(seasons.map((s) => s.season));
  const entityLinks = (ids: string[]) =>
    destinations
      .filter((d) => ids.includes(d.entity.id))
      .map((d) => ({ href: d.href, label: d.entity.label }));
  const entries: TimelineEntry[] = [];
  for (const season of seasons) {
    const trophies = season.trophyIds.map(
      (id) =>
        `${labels.get(id)}${
          season.competitions
            .find((c) => c.competitionId === id)
            ?.result.toLowerCase()
            .includes("shared")
            ? " (shared)"
            : ""
        }`,
    );
    entries.push({
      id: `season-${season.season}`,
      kind: "season",
      title: seasonLabel(season.season),
      href: seasonHref(season.season),
      year: yearOf(season.season),
      season: season.season,
      detail: trophies.length ? `Trophies: ${trophies.join(" · ")}` : undefined,
      links: uniqueLinks([
        ...entityLinks(season.managerIds),
        ...getSeasonEras(season.season, eras).map((e) => ({
          href: eraHref(e.id),
          label: e.manager,
        })),
      ]).slice(0, 2),
    });
    for (const event of season.events)
      entries.push({
        id: `event-${season.season}-${event.id}`,
        kind: "event",
        title: event.title,
        href: `${seasonHref(season.season)}#event-${event.id}`,
        year: yearOf(event.date ?? season.season),
        date: event.date,
        season: season.season,
        links: [
          {
            href: seasonHref(season.season),
            label: seasonLabel(season.season),
          },
          ...entityLinks([
            ...(event.personIds ?? []),
            ...(event.competitionIds ?? []),
          ]).slice(0, 2),
        ],
      });
  }
  for (const article of articles) {
    if (article.editorialMode !== "factual") continue;
    // A career biography's anchor date does not turn its whole life into one event.
    if (
      !article.season &&
      ["player", "manager"].includes(article.articleType ?? "")
    )
      continue;
    if (!article.historicalEventDate && !article.season) continue;
    const href = articleHref(article.slug);
    entries.push({
      id: `article-${article.slug}`,
      kind: "article",
      title: article.title,
      href,
      date: article.historicalEventDate,
      year: yearOf(article.historicalEventDate ?? article.season!),
      season: article.season,
      links: [
        ...(article.season && available.has(article.season)
          ? [
              {
                href: seasonHref(article.season),
                label: seasonLabel(article.season),
              },
            ]
          : []),
        ...entityLinks([
          ...(article.playerIds ?? []),
          ...(article.managerIds ?? []),
          ...(article.competitionIds ?? []),
          ...(article.oppositionIds ?? []),
        ]).slice(0, 2),
      ],
    });
  }
  for (const era of eras)
    entries.push({
      id: `era-${era.id}`,
      kind: "era",
      title: `${era.manager} · ${eraYears(era)}`,
      href: eraHref(era.id),
      year: yearOf(era.startDate),
      date: era.startDate,
      links: destinations
        .filter(
          (d) =>
            d.entity.kind === "person" &&
            era.manager.split(" & ").includes(d.entity.label),
        )
        .map((d) => ({ href: d.href, label: d.entity.label })),
    });
  const unique = [...new Map(entries.map((e) => [e.id, e])).values()];
  return [...new Set(unique.map((e) => e.year))]
    .sort((a, b) => a - b)
    .map((year) => ({
      year,
      entries: unique
        .filter((e) => e.year === year)
        .sort((a, b) => {
          // Season references are period context, displayed separately from dated entries.
          if (a.kind === "season" || b.kind === "season")
            return a.kind === b.kind
              ? a.id.localeCompare(b.id)
              : a.kind === "season"
                ? -1
                : 1;
          return (
            (a.date ?? "9999").localeCompare(b.date ?? "9999") ||
            a.id.localeCompare(b.id)
          );
        }),
    }));
}

export type TimelineFilter = { decade?: string; season?: string };
export function filterTimeline(
  sections: TimelineSection[],
  filter: TimelineFilter = {},
) {
  return sections.flatMap((section) => {
    if (
      filter.decade &&
      `${Math.floor(section.year / 10) * 10}s` !== filter.decade
    )
      return [];
    const entries = section.entries.filter(
      (e) => !filter.season || e.season === filter.season,
    );
    return entries.length ? [{ ...section, entries }] : [];
  });
}
export function timelineOptions(sections: TimelineSection[]) {
  return {
    decades: [
      ...new Set(sections.map((s) => `${Math.floor(s.year / 10) * 10}s`)),
    ],
    seasons: [
      ...new Set(
        sections.flatMap((s) =>
          s.entries.flatMap((e) => (e.season ? [e.season] : [])),
        ),
      ),
    ].sort(),
  };
}
export function selectLiverpoolYears(
  sections: TimelineSection[],
  from: number,
) {
  return sections
    .filter((s) => s.year >= from)
    .map((s) => ({
      ...s,
      entries: s.entries.filter((e) => !e.season || yearOf(e.season) >= from),
    }))
    .filter((s) => s.entries.length);
}

export const JourneySchema = z
  .object({
    id: HistoryIdSchema,
    title: z.string().trim().min(1),
    introduction: z.string().trim().min(1),
    steps: z
      .array(
        z
          .object({
            kind: z.enum([
              "article",
              "season",
              "person",
              "opposition",
              "competition",
              "era",
            ]),
            id: HistoryIdSchema,
          })
          .strict(),
      )
      .min(3)
      .max(12),
  })
  .strict()
  .refine(
    (j) =>
      new Set(j.steps.map((s) => `${s.kind}:${s.id}`)).size === j.steps.length,
    "Remove duplicate journey steps",
  );
export type JourneyRef = z.infer<typeof JourneySchema>["steps"][number];
export function resolveJourneyStep(ref: JourneyRef, context: V3Context) {
  const { articles, seasons, eras, destinations } = context;
  if (ref.kind === "article") {
    const a = articles.find(
      (a) => a.slug === ref.id && a.editorialMode === "factual",
    );
    if (a)
      return {
        ...ref,
        href: articleHref(a.slug),
        title: a.title,
        period: a.historicalPeriod,
        description: a.excerpt,
        links: uniqueLinks([
          ...(a.season && seasons.some((s) => s.season === a.season)
            ? [{ href: seasonHref(a.season), label: seasonLabel(a.season) }]
            : []),
          ...destinations
            .filter((d) =>
              [
                ...(a.playerIds ?? []),
                ...(a.managerIds ?? []),
                ...(a.competitionIds ?? []),
              ].includes(d.entity.id),
            )
            .slice(0, 3)
            .map((d) => ({ href: d.href, label: d.entity.label })),
        ]),
      };
  } else if (ref.kind === "season") {
    const s = seasons.find((s) => s.season === ref.id);
    if (s)
      return {
        ...ref,
        href: seasonHref(s.season),
        title: seasonLabel(s.season),
        period: "Season reference",
        description: s.overview[0],
        links: getSeasonEras(s.season, eras).map((e) => ({
          href: eraHref(e.id),
          label: e.manager,
        })),
      };
  } else if (ref.kind === "era") {
    const e = eras.find((e) => e.id === ref.id);
    if (e)
      return {
        ...ref,
        href: eraHref(e.id),
        title: e.manager,
        period: eraYears(e),
        description: e.summary,
        links: [
          {
            href: timelineYearHref(yearOf(e.startDate)),
            label: `Timeline: ${yearOf(e.startDate)}`,
          },
        ],
      };
  } else {
    const d = destinations.find(
      (d) => d.entity.kind === ref.kind && d.entity.id === ref.id,
    );
    if (d)
      return {
        ...ref,
        href: d.href,
        title: d.entity.label,
        period:
          ref.kind === "person"
            ? "People"
            : ref.kind === "opposition"
              ? "Opposition"
              : "Competition",
        description: undefined,
        links: explorationSeasons(d, seasons)
          .slice(0, 2)
          .map((s) => ({
            href: seasonHref(s.season),
            label: seasonLabel(s.season),
          })),
      };
  }
  throw new Error(
    `Journey has an unavailable canonical destination: ${ref.kind}:${ref.id}`,
  );
}
export function getJourneys(
  root = process.cwd(),
  context = getV3Context(root),
) {
  const dir = path.join(root, "content/history/liverpool/journeys");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((file) => {
      const definition = JourneySchema.parse(
        JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")),
      );
      if (file !== `${definition.id}.json`)
        throw new Error("Journey ID must match filename");
      return {
        ...definition,
        steps: definition.steps.map((ref) => resolveJourneyStep(ref, context)),
      };
    });
}
export type Journey = ReturnType<typeof getJourneys>[number];
export type ContinueContext =
  | { season: string }
  | { entityId: string }
  | { eraId: string }
  | { articleSlug: string };
export function continueFrom(
  context: ContinueContext,
  data: V3Context,
  journeys: Journey[],
): RouteLink[] {
  const { seasons, articles, destinations, eras } = data;
  let refs: JourneyRef[] = [];
  let year: number | undefined;
  let options: RouteLink[] = [];
  if ("season" in context) {
    const s = seasons.find((s) => s.season === context.season);
    if (!s) return [];
    year = yearOf(s.season);
    refs = [{ kind: "season", id: s.season }];
    const ids = [...s.managerIds, ...s.keyPlayerIds];
    options = ids.flatMap((id) => {
      const d = destinations.find((d) => d.entity.id === id);
      return d ? [{ href: d.href, label: `Explore ${d.entity.label}` }] : [];
    });
  } else if ("entityId" in context) {
    const d = destinations.find((d) => d.entity.id === context.entityId);
    if (!d) return [];
    refs = [
      { kind: d.entity.kind as JourneyRef["kind"], id: d.entity.id },
      ...d.articles.map((a) => ({ kind: "article" as const, id: a.slug })),
    ];
    const dated = d.articles
      .map((a) => a.historicalEventDate ?? a.season)
      .filter((d): d is string => !!d)
      .sort();
    if (dated[0]) year = yearOf(dated[0]);
    const shared = destinations
      .filter((other) => other.entity.id !== d.entity.id)
      .map((other) => ({
        other,
        count: other.articles.filter((a) =>
          d.articles.some((b) => a.slug === b.slug),
        ).length,
      }))
      .filter((x) => x.count >= 2)
      .sort(
        (a, b) =>
          b.count - a.count ||
          a.other.entity.id.localeCompare(b.other.entity.id),
      );
    options = shared.map(({ other }) => ({
      href: other.href,
      label: `Explore ${other.entity.label}`,
    }));
  } else if ("eraId" in context) {
    const e = eras.find((e) => e.id === context.eraId);
    if (!e) return [];
    year = yearOf(e.startDate);
    refs = [{ kind: "era", id: e.id }];
    options = seasons
      .filter((s) =>
        getSeasonEras(s.season, eras).some((era) => era.id === e.id),
      )
      .slice(0, 1)
      .map((s) => ({
        href: seasonHref(s.season),
        label: `Explore ${seasonLabel(s.season)}`,
      }));
  } else {
    const a = articles.find(
      (a) => a.slug === context.articleSlug && a.editorialMode === "factual",
    );
    if (!a) return [];
    if (a.season || a.historicalEventDate)
      year = yearOf(a.historicalEventDate ?? a.season!);
    refs = [{ kind: "article", id: a.slug }];
  }
  const matches = (j: Journey, r: JourneyRef) =>
    j.steps.some((s) => r.kind === s.kind && r.id === s.id);
  const journey =
    journeys.find((j) => refs[0] && matches(j, refs[0])) ??
    journeys.find((j) => refs.some((r) => matches(j, r)));
  return uniqueLinks([
    ...(journey
      ? [{ href: `/history/journeys/${journey.id}`, label: journey.title }]
      : []),
    ...options.slice(0, 1),
    ...(year !== undefined
      ? [
          {
            href: timelineYearHref(year),
            label: `Continue through ${Math.floor(year / 10) * 10}s history`,
          },
        ]
      : []),
  ]).slice(0, 3);
}
