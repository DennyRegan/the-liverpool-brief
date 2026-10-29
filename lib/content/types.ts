import {z} from "zod";
import { HistoryIdSchema, HistoryIdsSchema } from "./entities.ts";
import { SeasonIdSchema } from "./history.ts";
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
    // Explicit editorial approval for factual History browsing; absent means unreviewed.
    editorialMode: z.enum(["factual", "opinion"]).optional(),
    playerIds: HistoryIdsSchema.optional(),
    managerIds: HistoryIdsSchema.optional(),
    oppositionIds: HistoryIdsSchema.optional(),
    competitionIds: HistoryIdsSchema.optional(),
    locationIds: HistoryIdsSchema.optional(),
    themeIds: HistoryIdsSchema.optional(),
    category: z.enum(["match", "person", "season"]).default("match"),
    series: HistoryIdSchema.optional(),
    part: z.number().int().positive().optional(),
    // Season facts panel — optional so existing (non-season) articles keep parsing.
    season: SeasonIdSchema.optional(),
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

// Analysis reuses the existing canonical History relationships, not a second taxonomy.
export const ArticleSchema = ArchiveFeatureSchema.pick({
    season: true, historicalEventDate: true, historyEras: true, series: true, part: true,
    playerIds: true, managerIds: true, oppositionIds: true, competitionIds: true,
    locationIds: true, themeIds: true, relatedMatches: true,
}).extend({
    title: z.string(), date: z.iso.date(), slug: HistoryIdSchema,
    category: z.enum(["Opinion", "Analysis", "Team News"]).default("Opinion"),
    seoTitle: z.string().min(1).optional(),
    tags: z.array(z.string().min(1)).optional(),
    researchCutoff: z.iso.date().optional(),
    excerpt: z.string().optional(), sources: z.array(z.string()).optional(),
    whatMatters: z.array(z.string()).optional(), body: z.string(),
});
export type Article = z.infer<typeof ArticleSchema>;
