import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

// Season-by-season records, restored under Looking Back on 12 November 2026 at
// Denny's request. This is NOT a return of the History section: no eras, entity
// registry or cross-links. Files: content/looking-back/seasons/[season].json.
// People and competitions are stored by ID; their display names come from the plain
// id-to-name list content/looking-back/season-names.json and show as text only.

export const SEASONS_PATH = "/looking-back/seasons";

const Id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase kebab-case ID, e.g. john-barnes");
const Ids = z.array(Id).refine(ids => new Set(ids).size === ids.length, "Remove duplicate relationship IDs");
const Text = z.string().trim().min(1);
const SourceIds = Ids.min(1);
const Sourced = { sourceIds: SourceIds };

/** A consecutive season such as "1987-88" (1999-00 included). */
export const SeasonIdSchema = z.string().refine(value => {
  const match = value.match(/^(\d{4})-(\d{2})$/);
  return !!match && String(Number(match[1]) + 1).slice(-2) === match[2];
}, "Use a consecutive canonical season, e.g. 1987-88");

const Transfer = z.object({
  personId: Id,
  club: Text,
  deal: z.enum(["permanent", "loan", "free", "released", "retired"]),
  fee: Text.optional(),
  note: Text.optional(),
  ...Sourced,
}).strict();

export const SeasonSchema = z.object({
  season: SeasonIdSchema,
  reviewedOn: z.iso.date(),
  managerIds: Ids.min(1),
  managerNote: Text.optional(),
  league: z.object({ competitionId: Id, position: z.number().int().positive(), ...Sourced }).strict(),
  topScorers: z.array(z.object({ personId: Id, goals: z.number().int().nonnegative(), ...Sourced }).strict()).min(1),
  competitions: z.array(z.object({ competitionId: Id, kind: z.enum(["domestic", "europe", "other"]), result: Text, ...Sourced }).strict()),
  trophyIds: Ids,
  keyPlayerIds: Ids.min(1),
  transfers: z.object({ in: z.array(Transfer), out: z.array(Transfer) }).strict(),
  overview: z.array(Text).min(1),
  events: z.array(z.object({
    id: Id, title: Text, date: z.iso.date().optional(), detail: Text,
    personIds: Ids.optional(), competitionIds: Ids.optional(), ...Sourced,
  }).strict()),
  relatedSeasons: z.array(SeasonIdSchema),
  sources: z.array(z.object({
    id: Id, label: Text, url: z.url().refine(url => url.startsWith("https://"), "Use an HTTPS source URL"),
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
  for (const direction of ["in", "out"] as const) unique(season.transfers[direction].map(t => `${t.personId}:${t.club}`), `transfers.${direction}`);
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

export type LookingBackSeason = z.infer<typeof SeasonSchema>;

/** The plain id-to-name list (people and competitions). */
export function getSeasonNames(root = process.cwd()): Record<string, string> {
  const filename = path.join(root, "content/looking-back/season-names.json");
  try {
    return z.record(Id, Text).parse(JSON.parse(fs.readFileSync(filename, "utf8")));
  } catch (error) {
    throw new Error(`Invalid season-names.json: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/** Every season, newest first. A bad file, an unnamed ID or a missing related season fails the build. */
export function getSeasons(root = process.cwd()): LookingBackSeason[] {
  const directory = path.join(root, "content/looking-back/seasons");
  if (!fs.existsSync(directory)) return [];
  const seasons = fs.readdirSync(directory).filter(file => file.endsWith(".json")).map(file => {
    try {
      const season = SeasonSchema.parse(JSON.parse(fs.readFileSync(path.join(directory, file), "utf8")));
      if (file !== `${season.season}.json`) throw new Error("Season ID must match its filename");
      return season;
    } catch (error) {
      throw new Error(`Invalid season ${file}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }).sort((a, b) => b.season.localeCompare(a.season));
  const names = getSeasonNames(root);
  const available = new Set(seasons.map(season => season.season));
  for (const season of seasons) {
    const ids = [
      ...season.managerIds, ...season.keyPlayerIds, season.league.competitionId, ...season.trophyIds,
      ...season.topScorers.map(s => s.personId), ...season.competitions.map(c => c.competitionId),
      ...season.transfers.in.map(t => t.personId), ...season.transfers.out.map(t => t.personId),
      ...season.events.flatMap(e => [...(e.personIds ?? []), ...(e.competitionIds ?? [])]),
    ];
    for (const id of ids) if (!names[id]) throw new Error(`Invalid season ${season.season}.json: "${id}" has no name in season-names.json`);
    for (const id of season.relatedSeasons) if (!available.has(id)) throw new Error(`Invalid season ${season.season}.json: related season "${id}" has no record`);
  }
  return seasons;
}

export function getSeason(season: string, root = process.cwd()) {
  return getSeasons(root).find(item => item.season === season);
}

export function seasonLabel(season: string) { return season.replace("-", "–"); }

/** "Champions", "2nd", "11th". */
export function leagueFinish(position: number): string {
  if (position === 1) return "Champions";
  const lastTwo = position % 100;
  const suffix = lastTwo >= 11 && lastTwo <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[position % 10] ?? "th";
  return `${position}${suffix}`;
}

/** "1959–60 to 2025–26". */
export function leagueSpan(oldest: string, newest: string) { return `${seasonLabel(oldest)} to ${seasonLabel(newest)}`; }

/** The hub line: "67 seasons · 1959–60 to 2025–26" (empty when there are none). */
export function getSeasonsSummary(root = process.cwd()) {
  const seasons = getSeasons(root);
  if (!seasons.length) return undefined;
  return { count: seasons.length, newest: seasons[0].season, oldest: seasons[seasons.length - 1].season };
}
