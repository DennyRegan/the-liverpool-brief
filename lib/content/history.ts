import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { BiographySchema, SeriesDefinitionSchema, SeriesPartSchema } from "./types.ts";
import { onlyLive, withGoLive } from "./go-live.ts";

export const HISTORY_PATH = "/history";
export const BIOGRAPHIES_PATH = "/history/biographies";
export const SERIES_PATH = "/history/series";
// Same publication byline as Looking Back.
export const HISTORY_BYLINE = "The Liverpool Brief";

type Env = Record<string, string | undefined>;

function readMarkdown<T>(directory: string, parse: (data: unknown) => T) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter(name => name.endsWith(".md")).map(filename => {
    try {
      const slug = filename.slice(0, -3);
      const { data, content } = matter(fs.readFileSync(path.join(directory, filename), "utf8"));
      if (data.slug !== slug) throw new Error(`slug "${data.slug}" must match filename "${slug}"`);
      return parse({ ...data, body: content.trim() });
    } catch (error) {
      throw new Error(`Invalid History file ${path.basename(directory)}/${filename}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}

// ---- Biographies ----------------------------------------------------------

/** First four-digit year of "1938–1961", used to order people within a decade. */
function startYear(period: string) {
  return Number(period.match(/\d{4}/)?.[0] ?? 0);
}

/** Every biography: oldest decade first, then by first year at the club, then title. */
export function getBiographies(root = process.cwd()) {
  const all = readMarkdown(path.join(root, "content/biographies"), data => BiographySchema.parse(data));
  const slugs = new Set<string>();
  for (const item of all) { if (slugs.has(item.slug)) throw new Error(`Duplicate biography slug "${item.slug}"`); slugs.add(item.slug); }
  return all.sort((a, b) => a.decade.localeCompare(b.decade) || startYear(a.historicalPeriod) - startYear(b.historicalPeriod) || a.title.localeCompare(b.title));
}

export function getVisibleBiographies(now = new Date(), env: Env = process.env, root = process.cwd()) {
  return withGoLive(getBiographies(root), now, env);
}

export function getLiveBiographies(now = new Date(), root = process.cwd()) {
  return onlyLive(getBiographies(root), now);
}

export function getVisibleBiography(slug: string, now = new Date(), env: Env = process.env, root = process.cwd()) {
  return getVisibleBiographies(now, env, root).find(item => item.slug === slug);
}

/** Groups biographies by decade, oldest decade first (items keep their order). */
export function groupByDecade<T extends { decade: string }>(items: readonly T[]) {
  const decades = new Map<string, T[]>();
  for (const item of items) decades.set(item.decade, [...(decades.get(item.decade) ?? []), item]);
  return [...decades.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([decade, entries]) => ({ decade, entries }));
}

/** Header dateline: "Forward · 1938–1961", or just the years when no role is given. */
export function biographyDateline(item: { historicalPeriod: string; role?: string }) {
  return item.role ? `${item.role} · ${item.historicalPeriod}` : item.historicalPeriod;
}

// ---- Series ---------------------------------------------------------------

export function getSeriesDefinitions(root = process.cwd()) {
  const file = path.join(root, "content/series/series.json");
  if (!fs.existsSync(file)) return [];
  let raw: unknown;
  try { raw = JSON.parse(fs.readFileSync(file, "utf8")); } catch (error) { throw new Error(`Invalid content/series/series.json: ${error instanceof Error ? error.message : String(error)}`); }
  const definitions = SeriesDefinitionSchema.array().parse(raw);
  if (new Set(definitions.map(d => d.slug)).size !== definitions.length) throw new Error("Duplicate series slug in content/series/series.json");
  return definitions;
}

/** Every part of every series, in series then part order. Bad files fail the build. */
export function getSeriesParts(root = process.cwd()) {
  const definitions = getSeriesDefinitions(root);
  const base = path.join(root, "content/series");
  const parts = fs.existsSync(base)
    ? fs.readdirSync(base, { withFileTypes: true }).filter(entry => entry.isDirectory()).flatMap(entry => {
        const parts = readMarkdown(path.join(base, entry.name), data => SeriesPartSchema.parse(data));
        for (const part of parts) if (part.seriesSlug !== entry.name) throw new Error(`Series part "${part.slug}" has seriesSlug "${part.seriesSlug}" but sits in the "${entry.name}" folder`);
        return parts;
      })
    : [];
  const seen = new Set<string>(), slugs = new Set<string>();
  for (const part of parts) {
    const definition = definitions.find(d => d.slug === part.seriesSlug);
    if (!definition) throw new Error(`Series part "${part.slug}" belongs to unknown series "${part.seriesSlug}" (add it to content/series/series.json)`);
    if (part.partNumber > definition.totalParts) throw new Error(`Series part "${part.slug}" is part ${part.partNumber} but "${definition.slug}" has ${definition.totalParts} parts`);
    const key = `${part.seriesSlug}:${part.partNumber}`;
    if (seen.has(key)) throw new Error(`Duplicate part ${part.partNumber} in series "${part.seriesSlug}"`);
    seen.add(key);
    if (slugs.has(part.slug)) throw new Error(`Duplicate series part slug "${part.slug}"`);
    slugs.add(part.slug);
  }
  return parts.sort((a, b) => a.seriesSlug.localeCompare(b.seriesSlug) || a.partNumber - b.partNumber);
}

export function getVisibleSeriesParts(now = new Date(), env: Env = process.env, root = process.cwd()) {
  return withGoLive(getSeriesParts(root), now, env);
}

export function getLiveSeriesParts(now = new Date(), root = process.cwd()) {
  return onlyLive(getSeriesParts(root), now);
}

/** Series that have at least one part this deployment may show, with those parts in order. */
export function getVisibleSeries(now = new Date(), env: Env = process.env, root = process.cwd()) {
  const parts = getVisibleSeriesParts(now, env, root);
  return getSeriesDefinitions(root)
    .map(definition => ({ ...definition, parts: parts.filter(part => part.seriesSlug === definition.slug) }))
    .filter(series => series.parts.length > 0);
}

export function getVisibleSeriesBySlug(seriesSlug: string, now = new Date(), env: Env = process.env, root = process.cwd()) {
  return getVisibleSeries(now, env, root).find(series => series.slug === seriesSlug);
}

/** A part with its neighbours among the parts this deployment may show. */
export function getVisibleSeriesPart(seriesSlug: string, slug: string, now = new Date(), env: Env = process.env, root = process.cwd()) {
  const series = getVisibleSeriesBySlug(seriesSlug, now, env, root);
  const index = series?.parts.findIndex(part => part.slug === slug) ?? -1;
  if (!series || index < 0) return undefined;
  return { series, part: series.parts[index], previous: series.parts[index - 1], next: series.parts[index + 1] };
}

// ---- Latest History (homepage and hub) -------------------------------------

export type LatestHistoryItem = { kind: "Biography" | "Series"; label: string; title: string; excerpt: string; href: string; date: string };

/** The newest live biography and the newest live series part, newest first. Live pieces only, on every environment, so a future piece never shows on the homepage. */
export function getLatestHistory(now = new Date(), root = process.cwd()): LatestHistoryItem[] {
  const newest = <T extends { date: string }>(items: T[], tiebreak: (item: T) => number = () => 0) =>
    [...items].sort((a, b) => b.date.localeCompare(a.date) || tiebreak(b) - tiebreak(a))[0];
  const person = newest(getLiveBiographies(now, root));
  const part = newest(getLiveSeriesParts(now, root), item => item.partNumber);
  const series = part ? getSeriesDefinitions(root).find(d => d.slug === part.seriesSlug) : undefined;
  return [
    ...(person ? [{ kind: "Biography" as const, label: "Biography", title: person.title, excerpt: person.excerpt, href: `${BIOGRAPHIES_PATH}/${person.slug}`, date: person.date }] : []),
    ...(part && series ? [{ kind: "Series" as const, label: `${series.title} · Part ${part.partNumber} of ${series.totalParts}`, title: part.title, excerpt: part.excerpt, href: `${SERIES_PATH}/${part.seriesSlug}/${part.slug}`, date: part.date }] : []),
  ].sort((a, b) => b.date.localeCompare(a.date));
}
