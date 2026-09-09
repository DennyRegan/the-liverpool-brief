import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { HistoryIdSchema, HistoryIdsSchema, getHistoryEntities } from "./entities.ts";
import { getHistory, seasonKey, type HistoryEra } from "./history.ts";

const Text = z.string().trim().min(1);
const SourceIds = HistoryIdsSchema.min(1);
const SeasonId = z.string().refine(value => /^\d{4}-\d{2}$/.test(value) && seasonKey(value) === value, "Use a consecutive canonical season, e.g. 1963-64");
const Sourced = { sourceIds: SourceIds };
const Transfer = z.object({
  personId: HistoryIdSchema,
  club: Text,
  deal: z.enum(["permanent", "loan", "free", "released", "retired"]),
  fee: Text.optional(),
  note: Text.optional(),
  ...Sourced,
}).strict();

export const SeasonSchema = z.object({
  season: SeasonId,
  reviewedOn: z.iso.date(),
  managerIds: HistoryIdsSchema.min(1),
  managerNote: Text.optional(),
  league: z.object({ competitionId: HistoryIdSchema, position: z.number().int().positive(), ...Sourced }).strict(),
  topScorers: z.array(z.object({ personId: HistoryIdSchema, goals: z.number().int().nonnegative(), ...Sourced }).strict()).min(1),
  competitions: z.array(z.object({ competitionId: HistoryIdSchema, kind: z.enum(["domestic", "europe", "other"]), result: Text, ...Sourced }).strict()),
  trophyIds: HistoryIdsSchema,
  keyPlayerIds: HistoryIdsSchema.min(1),
  transfers: z.object({ in: z.array(Transfer), out: z.array(Transfer) }).strict(),
  overview: z.array(Text).min(1),
  events: z.array(z.object({
    id: HistoryIdSchema, title: Text, date: z.iso.date().optional(), detail: Text,
    personIds: HistoryIdsSchema.optional(), competitionIds: HistoryIdsSchema.optional(), ...Sourced,
  }).strict()),
  relatedSeasons: z.array(SeasonId),
  sources: z.array(z.object({
    id: HistoryIdSchema, label: Text, url: z.url().refine(url => url.startsWith("https://"), "Use an HTTPS source URL"),
    confidence: z.enum(["high", "medium", "low"]), claims: Text,
  }).strict()).min(1),
  researchNotes: z.array(Text),
}).strict().superRefine((season, ctx) => {
  const unique = (values: string[], field: string) => {
    if (new Set(values).size !== values.length) ctx.addIssue({ code: "custom", path: [field], message: `Remove duplicate ${field} entries` });
  };
  unique(season.sources.map(s => s.id), "sources");
  unique(season.sources.map(s => s.url), "source URLs");
  unique(season.topScorers.map(s => s.personId), "topScorers");
  unique(season.competitions.map(c => c.competitionId), "competitions");
  unique(season.events.map(e => e.id), "events");
  unique(season.relatedSeasons, "relatedSeasons");
  for (const direction of ["in", "out"] as const) unique(season.transfers[direction].map(transfer => `${transfer.personId}:${transfer.club}`), `transfers.${direction}`);
  if (season.trophyIds.includes(season.league.competitionId) !== (season.league.position === 1)) ctx.addIssue({ code: "custom", path: ["trophyIds"], message: "League trophy and first-place finish must agree" });
  const ids = new Set(season.sources.map(source => source.id));
  const records = [season.league, ...season.topScorers, ...season.competitions, ...season.transfers.in, ...season.transfers.out, ...season.events];
  for (const record of records) for (const id of record.sourceIds) {
    if (!ids.has(id)) ctx.addIssue({ code: "custom", path: ["sourceIds"], message: `Unknown source ID "${id}"; add its retrieved source to this season` });
  }
  const entered = new Set([season.league.competitionId, ...season.competitions.map(c => c.competitionId)]);
  for (const id of season.trophyIds) if (!entered.has(id)) ctx.addIssue({ code: "custom", path: ["trophyIds"], message: `Trophy "${id}" must be a competition entered this season` });
  if (season.relatedSeasons.includes(season.season)) ctx.addIssue({ code: "custom", path: ["relatedSeasons"], message: "A season cannot link to itself" });
});

export type HistorySeason = z.infer<typeof SeasonSchema>;

export function getSeasons(root = process.cwd()): HistorySeason[] {
  const directory = path.join(root, "content/history/liverpool/seasons");
  if (!fs.existsSync(directory)) return [];
  const seasons = fs.readdirSync(directory).filter(file => file.endsWith(".json")).map(file => {
    try {
      const season = SeasonSchema.parse(JSON.parse(fs.readFileSync(path.join(directory, file), "utf8")));
      if (file !== `${season.season}.json`) throw new Error("Season ID must match its filename");
      return season;
    } catch (error) {
      throw new Error(`Invalid season ${file}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }).sort((a, b) => a.season.localeCompare(b.season));
  const entities = new Map(getHistoryEntities(root).map(entity => [entity.id, entity]));
  const available = new Set(seasons.map(season => season.season));
  for (const season of seasons) {
    const check = (ids: string[], kind: string) => {
      for (const id of ids) if (entities.get(id)?.kind !== kind) throw new Error(`Invalid season ${season.season}.json: "${id}" must be a canonical ${kind} in entities.json`);
    };
    check([...season.managerIds, ...season.keyPlayerIds, ...season.topScorers.map(s => s.personId), ...season.transfers.in.map(t => t.personId), ...season.transfers.out.map(t => t.personId), ...season.events.flatMap(e => e.personIds ?? [])], "person");
    check([season.league.competitionId, ...season.trophyIds, ...season.competitions.map(c => c.competitionId), ...season.events.flatMap(e => e.competitionIds ?? [])], "competition");
    for (const id of season.relatedSeasons) if (!available.has(id)) throw new Error(`Invalid season ${season.season}.json: related season "${id}" has no published record`);
  }
  return seasons;
}

export function seasonLabel(season: string) { return season.replace("-", "–"); }

export function leagueFinish(position: number): string {
  if (position === 1) return "Champions";
  const lastTwo = position % 100;
  const suffix = lastTwo >= 11 && lastTwo <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[position % 10] ?? "th";
  return `${position}${suffix}`;
}

/** Reuse the existing tenure dates. A season can overlap multiple managerial eras. */
export function getSeasonEras(season: string, eras: HistoryEra[] = getHistory().eras): HistoryEra[] {
  const key = seasonKey(season);
  if (!key) return [];
  const start = `${key.slice(0, 4)}-07-01`;
  const end = `${String(Number(key.slice(0, 4)) + 1).padStart(4, "0")}-06-30`;
  return eras.filter(era => era.startDate <= end && (!era.endDate || era.endDate >= start));
}

/** Archive remains canonical; match the approved season metadata, never copy its body. */
export function getSeasonArchiveArticles<T extends { slug: string; season?: string }>(season: string, articles: T[]): T[] {
  const key = seasonKey(season);
  if (!key) return [];
  const seen = new Set<string>();
  return articles.filter(article => {
    if (seasonKey(article.season) !== key || seen.has(article.slug)) return false;
    seen.add(article.slug);
    return true;
  });
}
