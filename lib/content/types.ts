import {z} from "zod";

const SlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase kebab-case slug");

// Unknown frontmatter keys (including retired History relationship fields such as
// playerIds, season or relatedMatches) are ignored, so existing files parse unchanged.
export const ArchiveFeatureSchema = z.object({
    // The date of the historical event; date below remains the publication date.
    historicalEventDate: z.iso.date().optional(),
    title: z.string(),
    date: z.iso.date(),
    historicalPeriod: z.string(),
    excerpt: z.string(),
    slug: SlugSchema,
    editorialMode: z.enum(["factual", "opinion"]).optional(),
    sources: z.array(z.string()).optional(),
    body: z.string(),
});

export type ArchiveFeature = z.infer<typeof ArchiveFeatureSchema>;

// Matchday pieces are tied to one fixture. Both fields are optional so a piece
// without them still parses and displays (it just isn't grouped under a fixture).
export const MATCH_TYPES = ["Preview", "Report", "Opinion on a match"] as const;
export const FixtureSchema = z.object({
    opponent: z.string().trim().min(1),
    date: z.iso.date(),
    competition: z.string().trim().min(1),
    venue: z.enum(["Home", "Away"]),
});

export const ArticleSchema = z.object({
    title: z.string(), date: z.iso.date(), slug: SlugSchema,
    category: z.enum(["Opinion", "Analysis", "Team News", "Matchday"]).default("Opinion"),
    matchType: z.enum(MATCH_TYPES).optional(),
    fixture: FixtureSchema.optional(),
    seoTitle: z.string().min(1).optional(),
    tags: z.array(z.string().min(1)).optional(),
    researchCutoff: z.iso.date().optional(),
    excerpt: z.string().optional(), sources: z.array(z.string()).optional(),
    whatMatters: z.array(z.string()).optional(), body: z.string(),
});
export type Article = z.infer<typeof ArticleSchema>;

// Looking Back: one short keepsake a week. Strict, so unknown keys (such as a
// sources list) fail the build; attribution belongs in the prose.
export const LookingBackSchema = z.object({
    title: z.string().trim().min(1),
    slug: SlugSchema,
    date: z.iso.date(),
    eventDate: z.iso.date(),
    dateline: z.string().trim().min(1),
    scoreline: z.string().trim().min(1).optional(),
    excerpt: z.string().trim().min(1)
        .refine(text => /[.!?]$/.test(text) && !/[.!?]["”’]?\s+\S/.test(text), "The excerpt must be one sentence"),
    body: z.string().trim().min(1),
}).strict().refine(piece => piece.eventDate <= piece.date, { message: "eventDate cannot be after the publication date", path: ["eventDate"] });
export type LookingBack = z.infer<typeof LookingBackSchema>;

