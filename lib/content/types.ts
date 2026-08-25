import {z} from "zod"
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
    sources: z.array(z.string()).optional(),
    whatMatters: z.array(z.string()).optional(),
    body: z.string(),
});
export const ArchiveFeatureSchema = z.object({
    title: z.string(),
    date: z.string(),
    historicalPeriod: z.string(),
    decade: z.string(),
    excerpt: z.string(),
    slug: z.string(),
    category: z.enum(["match", "person", "season"]).default("match"),
    series: z.string().optional(),
    part: z.number().optional(),
    // Season facts panel — optional so existing (non-season) articles keep parsing.
    season: z.string().optional(),
    manager: z.string().optional(),
    leagueFinish: z.string().optional(),
    european: z.string().optional(),
    domesticCups: z.string().optional(),
    topScorer: z.string().optional(),
    arrivals: z.string().optional(),
    departures: z.string().optional(),
    relatedMatches: z.array(z.string()).optional(),
    sources: z.array(z.string()).optional(),
    body: z.string(),
});
