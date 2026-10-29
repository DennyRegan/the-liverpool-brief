import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { ArchiveFeatureSchema, type ArchiveFeature } from "./types.ts";
import { SeasonSchema } from "./season-schema.ts";
import { getHistoryEntities } from "./entities.ts";
import { getHistory, getArticleEraIds } from "./history.ts";
import { getArchiveFeatures } from "./archive.ts";
import { groupMatchesByVenue, projectBritain, type AtlasMatch, type AtlasVenue } from "../history-atlas.ts";

export const PROTOTYPE_SEASON_URL = "/preview/history/1987-88";

// The existing public loaders and sitemap never read prototype/.
export function prototypeEnabled(env = process.env): boolean {
  return env.LIVERPOOL_HISTORY_PROTOTYPE === "1" && !env.VERCEL && !env.CI;
}

export function isLoopbackHost(host: string | null): boolean {
  return host !== null && /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(host);
}

// An editorial selection, not a reverse article list in the Season record.
// Dates, prose, people, competitions and venues resolve from each canonical article.
const selection = [
  { slug: "arsenal-liverpool-1987-barnes-beardsley-debuts", home: "Arsenal", away: "Liverpool", score: "1–2" },
  { slug: "steve-nicol-hat-trick-newcastle-1987", home: "Newcastle", away: "Liverpool", score: "1–4" },
  { slug: "liverpool-qpr-1987-barnes-takes-liverpool-top", home: "Liverpool", away: "QPR", score: "4–0" },
  { slug: "liverpool-nottingham-forest-1988-five-at-anfield", home: "Liverpool", away: "Nottingham Forest", score: "5–0" },
  { slug: "liverpool-wimbledon-1988-fa-cup-final-defeat", home: "Liverpool", away: "Wimbledon", score: "0–1" },
] as const;

// Reuse the existing fixture identity without loading private manuscripts or season data.
export function prototypeMatchIdentity(slug: string) {
  return selection.find(match => match.slug === slug);
}

export function isPrototypeSlug(slug: string): boolean {
  return selection.some(match => match.slug === slug);
}

const VenueSchema = z.object({
  id: z.string(), city: z.string().min(1), latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180), note: z.string().min(1),
  source: z.url(), retrievedOn: z.iso.date(),
}).strict();

/** Public atlas data comes exclusively from approved articles and geographic assets. */
export function loadPublishedHistoryAtlas(root = process.cwd()) {
  const articles = getArchiveFeatures(root).filter(article => article.editorialMode === "factual" && article.articleType === "match" && article.season === "1987-88");
  const atlasPath = path.join(root, "content/history/liverpool/atlases/1987-88.json");
  if (!articles.length || !fs.existsSync(atlasPath)) return undefined;
  const data = z.object({ venues: z.array(VenueSchema), coastline: z.array(z.object({ name: z.string().min(1), d: z.string().min(1) }).strict()) }).strict().parse(JSON.parse(fs.readFileSync(atlasPath, "utf8")));
  const entities = new Map(getHistoryEntities(root).map(entity => [entity.id, entity]));
  const venues: AtlasVenue[] = data.venues.map(venue => {
    const entity = entities.get(venue.id);
    if (entity?.kind !== "location") throw new Error(`Unknown atlas location: ${venue.id}`);
    return { ...venue, label: entity.label };
  });
  const matches: AtlasMatch[] = articles.flatMap(article => {
    const identity = prototypeMatchIdentity(article.slug);
    const locationId = article.locationIds?.length === 1 ? article.locationIds[0] : undefined;
    if (!identity || !article.historicalEventDate || !locationId || !venues.some(venue => venue.id === locationId)) return [];
    return [{ ...identity, href: `/archive/${article.slug}`, title: article.title, excerpt: article.excerpt,
      historicalEventDate: article.historicalEventDate, season: "1987-88", number: 1, locationId,
      competition: (article.competitionIds ?? []).map(id => entities.get(id)!.label).join(" · "),
      playerIds: article.playerIds ?? [], managerIds: article.managerIds ?? [] }];
  }).sort((a, b) => a.historicalEventDate.localeCompare(b.historicalEventDate));
  if (!matches.length) return undefined;
  return { groups: groupMatchesByVenue(matches, venues), coastline: data.coastline };
}

/** Read-only validation also used by the local validation command and tests. */
export function loadHistoryPrototype(root = process.cwd()) {
  const directory = path.join(root, "prototype/history");
  const entities = new Map(getHistoryEntities(root).map(entity => [entity.id, entity]));
  const { eras } = getHistory(root);
  const season = SeasonSchema.parse(JSON.parse(fs.readFileSync(path.join(directory, "1987-88.json"), "utf8")));
  if (season.season !== "1987-88") throw new Error("Prototype season must be 1987-88");
  const check = (ids: string[], kind: string) => {
    for (const id of ids) if (entities.get(id)?.kind !== kind) throw new Error(`Expected canonical ${kind}: ${id}`);
  };
  check([...season.managerIds, ...season.keyPlayerIds, ...season.topScorers.map(s => s.personId), ...season.transfers.in.map(t => t.personId), ...season.transfers.out.map(t => t.personId)], "person");
  check([season.league.competitionId, ...season.trophyIds, ...season.competitions.map(c => c.competitionId)], "competition");
  const venues: AtlasVenue[] = z.array(VenueSchema).parse(JSON.parse(fs.readFileSync(path.join(directory, "venues.json"), "utf8"))).map(venue => {
    check([venue.id], "location");
    return { ...venue, label: entities.get(venue.id)!.label };
  });
  if (new Set(venues.map(venue => venue.id)).size !== venues.length) throw new Error("Duplicate atlas venue");
  const articles: ArchiveFeature[] = [];
  const matches: AtlasMatch[] = selection.map((item, index) => {
    const publicPath = path.join(root, "content/archive/liverpool", `${item.slug}.md`);
    const previewPath = path.join(directory, "reports", `${item.slug}.md`);
    if (fs.existsSync(publicPath) && fs.existsSync(previewPath)) throw new Error(`Duplicate article: ${item.slug}`);
    const { data, content } = matter(fs.readFileSync(fs.existsSync(publicPath) ? publicPath : previewPath, "utf8"));
    const article = ArchiveFeatureSchema.parse({ ...data, body: content.trim() });
    if (article.slug !== item.slug || article.season !== season.season || article.articleType !== "match" || !article.historicalEventDate) throw new Error(`Invalid selected match: ${item.slug}`);
    const relationships = { playerIds: "person", managerIds: "person", oppositionIds: "opposition", competitionIds: "competition", locationIds: "location", themeIds: "theme" } as const;
    for (const [field, kind] of Object.entries(relationships)) check(article[field as keyof typeof relationships] ?? [], kind);
    getArticleEraIds(article, eras);
    if (article.locationIds?.length !== 1 || !article.competitionIds?.length) throw new Error(`Match needs one venue and a competition: ${item.slug}`);
    articles.push(article);
    return { ...item, href: `/archive/${article.slug}`, title: article.title, excerpt: article.excerpt,
      historicalEventDate: article.historicalEventDate, season: article.season, number: index + 1,
      locationId: article.locationIds[0], competition: article.competitionIds.map(id => entities.get(id)!.label).join(" · "),
      playerIds: article.playerIds ?? [], managerIds: article.managerIds ?? [] };
  });
  if (matches.some((match, i) => i > 0 && match.historicalEventDate <= matches[i - 1].historicalEventDate)) throw new Error("Prototype matches must be chronological");
  const groups = groupMatchesByVenue(matches, venues);
  const geo = JSON.parse(fs.readFileSync(path.join(directory, "britain-ireland.geo.json"), "utf8"));
  const coastline: { name: string; d: string }[] = geo.features.map((feature: { name: string; geometry: { coordinates: number[][][][] } }) => ({
    name: feature.name,
    d: feature.geometry.coordinates.map(polygon => polygon.map(ring => ring.map(([lon, lat], i) => {
      const [x, y] = projectBritain(lon, lat);
      return `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(" ") + "Z").join(" ")).join(" "),
  }));
  return { season, matches, articles, groups, coastline, venues,
    manager: season.managerIds.map(id => entities.get(id)!.label).join(" / "),
    topScorer: season.topScorers.map(s => `${entities.get(s.personId)!.label} · ${s.goals}`).join(" / ") };
}
