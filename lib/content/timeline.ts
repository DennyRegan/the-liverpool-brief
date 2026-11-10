import fs from "node:fs";
import path from "node:path";
import { TimelineEntrySchema, type TimelineEntry, type TimelineLink } from "./types.ts";
import { getArticles } from "./articles.ts";
import { BIOGRAPHIES_PATH, getBiographies, getSeriesDefinitions, getSeriesParts, getVisibleBiographies, getVisibleSeriesParts, SERIES_PATH } from "./history.ts";

// Klopp's Liverpool timeline. Data lives in one JSON file (the same pattern as
// content/series/series.json), validated by TimelineEntrySchema. Cross-entry
// rules and link resolution are checked here, so a bad file fails the build.
export const TIMELINE_PATH = "/looking-back/timeline";
export const TIMELINE_FILE = "content/timeline/klopp.json";

type Env = Record<string, string | undefined>;

export const byDate = (a: TimelineEntry, b: TimelineEntry) => a.dateStart.localeCompare(b.dateStart) || (a.dateEnd ?? a.dateStart).localeCompare(b.dateEnd ?? b.dateStart) || a.id.localeCompare(b.id);

/** Every entry, sorted by date. Anything invalid, or any link that does not resolve to existing content, throws. */
export function getTimeline(root = process.cwd()): TimelineEntry[] {
  const file = path.join(root, TIMELINE_FILE);
  if (!fs.existsSync(file)) return [];
  let raw: unknown;
  try { raw = JSON.parse(fs.readFileSync(file, "utf8")); } catch (error) { throw new Error(`Invalid ${TIMELINE_FILE}: ${error instanceof Error ? error.message : String(error)}`); }
  if (!Array.isArray(raw)) throw new Error(`Invalid ${TIMELINE_FILE}: expected a list of entries`);
  const entries = raw.map((item, index) => {
    const parsed = TimelineEntrySchema.safeParse(item);
    if (!parsed.success) throw new Error(`Invalid timeline entry ${index + 1} ("${(item as { id?: string })?.id ?? "no id"}"): ${parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
    return parsed.data;
  });
  const byId = new Map<string, TimelineEntry>();
  for (const entry of entries) {
    if (byId.has(entry.id)) throw new Error(`Duplicate timeline id "${entry.id}"`);
    byId.set(entry.id, entry);
  }
  for (const entry of entries) {
    if (entry.parent) {
      const parent = byId.get(entry.parent);
      if (!parent) throw new Error(`Timeline entry "${entry.id}" has parent "${entry.parent}", which does not exist`);
      if (parent.parent) throw new Error(`Timeline entry "${entry.id}": a parent cannot itself be a sub-entry ("${parent.id}")`);
      if (parent.season !== entry.season) throw new Error(`Timeline entry "${entry.id}" is in ${entry.season} but its parent "${parent.id}" is in ${parent.season}`);
    }
    if (entry.priority === "main" && entry.links.length === 0) throw new Error(`Timeline main entry "${entry.id}" needs at least one link`);
  }
  const parts = getSeriesParts(root), people = getBiographies(root), articles = getArticles(root);
  for (const entry of entries) for (const link of entry.links) {
    const found = link.type === "series-part" ? parts.some(p => p.seriesSlug === link.seriesSlug && p.partNumber === link.partNumber)
      : link.type === "biography" ? people.some(p => p.slug === link.slug)
      : articles.some(a => a.slug === link.slug);
    if (!found) throw new Error(`Timeline entry "${entry.id}" links to ${JSON.stringify(link)}, which does not exist`);
  }
  return entries.sort(byDate);
}

export type ResolvedLink = { label: string; href: string };
export type TimelineCard = TimelineEntry & {
  resolvedLinks: ResolvedLink[];
  announcedLabel?: string; effectiveLabel?: string;
  children: TimelineCard[];
};

/** "1 July 2017", independent of the server time zone. */
export function formatPlainDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));
}

/** "2015-16" -> "2015–16". */
export const seasonLabel = (season: string) => `${season.slice(0, 4)}–${season.slice(5)}`;

/**
 * Entries this deployment may show, with their links resolved to pages that
 * deployment can open. On production a link to a piece that is not live yet is
 * dropped, and a main entry left with no link (and its sub-entries) is hidden,
 * so the timeline grows as the pieces go live. Previews and local show all.
 */
export function getVisibleTimeline(now = new Date(), env: Env = process.env, root = process.cwd()): TimelineCard[] {
  const entries = getTimeline(root);
  if (!entries.length) return [];
  const parts = getVisibleSeriesParts(now, env, root), people = getVisibleBiographies(now, env, root);
  const seriesTitles = new Map(getSeriesDefinitions(root).map(d => [d.slug, d.title]));
  const articles = new Map(getArticles(root).map(a => [a.slug, a]));
  const resolve = (link: TimelineLink): ResolvedLink | undefined => {
    if (link.type === "series-part") {
      const part = parts.find(p => p.seriesSlug === link.seriesSlug && p.partNumber === link.partNumber);
      return part && { label: `${seriesTitles.get(part.seriesSlug) ?? "Series"}, Part ${part.partNumber}: ${part.title}`, href: `${SERIES_PATH}/${part.seriesSlug}/${part.slug}` };
    }
    if (link.type === "biography") {
      const person = people.find(p => p.slug === link.slug);
      return person && { label: `Biography: ${person.title}`, href: `${BIOGRAPHIES_PATH}/${person.slug}` };
    }
    const article = articles.get(link.slug);
    return article && { label: article.title, href: `/articles/${article.slug}` };
  };
  const toCard = (entry: TimelineEntry): TimelineCard => ({
    ...entry,
    resolvedLinks: entry.links.map(resolve).filter((l): l is ResolvedLink => Boolean(l)),
    announcedLabel: entry.announced && formatPlainDate(entry.announced),
    effectiveLabel: entry.effective && formatPlainDate(entry.effective),
    children: entries.filter(child => child.parent === entry.id).map(toCard),
  });
  const production = env.VERCEL_ENV === "production";
  return entries.filter(entry => !entry.parent).map(toCard)
    .filter(card => !production || card.priority === "extended" || card.resolvedLinks.length > 0);
}
