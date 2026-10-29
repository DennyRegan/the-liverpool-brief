// Preserved Season schema from the pre-reset repository; no public Season loader.
import { z } from "zod";
import { HistoryIdSchema, HistoryIdsSchema } from "./entities.ts";
import { SeasonIdSchema } from "./history.ts";

const Text = z.string().trim().min(1);
const SourceIds = HistoryIdsSchema.min(1);
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
  season: SeasonIdSchema,
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
  relatedSeasons: z.array(SeasonIdSchema),
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
