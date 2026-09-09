import {z} from "zod";
import { HistoryIdSchema, HistoryIdsSchema } from "./entities.ts";
import { seasonKey } from "./history.ts";
export const SourceSchema = z.object({
    name: z.string(),
    platform: z.string(),
    url: z.url(),
});
export const StorySchema = z.object({
headline: z.string(),
category: z.string(),
summary: z.string(),
sources: z.array(SourceSchema),
});
export const BriefSchema = z.object({
lastUpdated: z.string(),
title: z.string(),
status :z.string(),
editorsNote: z.string().optional(),
stories: z.array(StorySchema) ,
});

export const ArticleSchema = z.object({
    title: z.string(),
    date: z.string(),
    slug: z.string(),
    category: z.string().default("Opinion"),
    excerpt: z.string().optional(),
    sources: z.array(z.string()).optional(),
    whatMatters: z.array(z.string()).optional(),
    body: z.string(),
});
export const ArchiveFeatureSchema = z.object({
    // The date of the historical event; date below remains the publication date.
    historicalEventDate: z.iso.date().optional(),
    // Explicit tenure IDs for career/season pieces; when set, overrides date placement.
    historyEras: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).min(1)
        .refine(ids => new Set(ids).size === ids.length, "Remove duplicate History era IDs")
        .optional(),
    title: z.string(),
    date: z.iso.date(),
    historicalPeriod: z.string(),
    decade: z.string(),
    excerpt: z.string(),
    slug: HistoryIdSchema,
    // Navigation category is intentionally independent of the subject of the article.
    articleType: z.enum(["match", "player", "manager", "transfer", "season", "competition", "club-event", "other"]).optional(),
    playerIds: HistoryIdsSchema.optional(),
    managerIds: HistoryIdsSchema.optional(),
    oppositionIds: HistoryIdsSchema.optional(),
    competitionIds: HistoryIdsSchema.optional(),
    locationIds: HistoryIdsSchema.optional(),
    themeIds: HistoryIdsSchema.optional(),
    category: z.enum(["match", "person", "season"]).default("match"),
    series: z.string().optional(),
    part: z.number().optional(),
    // Season facts panel — optional so existing (non-season) articles keep parsing.
    season: z.string().refine(value => seasonKey(value) !== undefined, "Use consecutive season years, e.g. 1987-88 (1987/88 also accepted)").optional(),
    manager: z.string().optional(),
    leagueFinish: z.string().optional(),
    european: z.string().optional(),
    domesticCups: z.string().optional(),
    topScorer: z.string().optional(),
    arrivals: z.string().optional(),
    departures: z.string().optional(),
    relatedMatches: HistoryIdsSchema.optional(),
    sources: z.array(z.string()).optional(),
    body: z.string(),
});

export type ArchiveFeature = z.infer<typeof ArchiveFeatureSchema>;
