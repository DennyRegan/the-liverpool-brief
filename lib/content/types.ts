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
    // The decade of the event ("1980s"), shown as the Features kicker.
    decade: z.string().regex(/^\d{3}0s$/, 'Use a decade such as "1980s"').optional(),
    excerpt: z.string(),
    slug: SlugSchema,
    editorialMode: z.enum(["factual", "opinion"]).optional(),
    sources: z.array(z.string()).optional(),
    // Liverpool players the piece is mainly about (slugs from content/players.json).
    players: z.array(SlugSchema).optional(),
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

// A prediction quoted word for word from the article, and how it turned out.
export const CallSchema = z.object({
    claim: z.string().trim().min(1),
    status: z.enum(["open", "right", "wrong"]),
    note: z.string().trim().min(1).optional(),
}).strict();
export type Call = z.infer<typeof CallSchema>;

export const ArticleSchema = z.object({
    title: z.string(), date: z.iso.date(), slug: SlugSchema,
    category: z.enum(["Opinion", "Analysis", "Matchday"]).default("Opinion"),
    matchType: z.enum(MATCH_TYPES).optional(),
    fixture: FixtureSchema.optional(),
    seoTitle: z.string().min(1).optional(),
    tags: z.array(z.string().min(1)).optional(),
    researchCutoff: z.iso.date().optional(),
    excerpt: z.string().optional(), sources: z.array(z.string()).optional(),
    whatMatters: z.array(z.string()).optional(),
    // Liverpool players the piece is mainly about (slugs from content/players.json).
    players: z.array(SlugSchema).optional(),
    calls: z.array(CallSchema).optional(),
    body: z.string(),
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


// History: a small hub with Biographies and Series (Looking Back is separate).
// Strict, so unknown keys (a sources list, retired History taxonomy fields) fail the
// build; attribution stays inline in the prose. `role` (for the header dateline,
// for example "Forward") is optional.
export const BiographySchema = z.object({
    title: z.string().trim().min(1),
    slug: SlugSchema,
    date: z.iso.date(),
    historicalPeriod: z.string().trim().min(1),
    decade: z.string().regex(/^\d{3}0s$/, 'Use a decade such as "1950s"'),
    excerpt: z.string().trim().min(1),
    role: z.string().trim().min(1).optional(),
    body: z.string().trim().min(1),
}).strict();
export type Biography = z.infer<typeof BiographySchema>;

export const SeriesPartSchema = z.object({
    seriesSlug: SlugSchema,
    partNumber: z.number().int().positive(),
    title: z.string().trim().min(1),
    slug: SlugSchema,
    date: z.iso.date(),
    excerpt: z.string().trim().min(1),
    body: z.string().trim().min(1),
}).strict();
export type SeriesPart = z.infer<typeof SeriesPartSchema>;

// content/series/series.json: one entry per series (its name and length). Parts
// are separate files, so a new part needs only a new file; a new series needs one
// entry here.
export const SeriesDefinitionSchema = z.object({
    slug: SlugSchema,
    title: z.string().trim().min(1),
    totalParts: z.number().int().positive(),
}).strict();
export type SeriesDefinition = z.infer<typeof SeriesDefinitionSchema>;
