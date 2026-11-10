import {z} from "zod";

const SlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase kebab-case slug");

// Connection tags, used by "Continue reading" (lib/content/related.ts) to link a
// piece to related pieces automatically. players: slugs from content/players.json;
// opponents: slugs from content/opponents.json (unknown slugs fail the build);
// season: "1985-86". All optional.
const PlayersSchema = z.array(SlugSchema).optional();
const OpponentsSchema = z.array(SlugSchema).optional();
const SeasonSchema = z.string().regex(/^\d{4}-\d{2}$/, 'Use a season such as "1985-86"').optional();

// Unknown frontmatter keys (including retired History relationship fields such as
// playerIds or relatedMatches) are ignored, so existing files parse unchanged.
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
    players: PlayersSchema,
    season: SeasonSchema,
    opponents: OpponentsSchema,
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
    players: PlayersSchema,
    opponents: OpponentsSchema,
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
    // Connection tags; the season comes from eventDate automatically.
    players: PlayersSchema,
    opponents: OpponentsSchema,
    excerpt: z.string().trim().min(1)
        .refine(text => /[.!?]$/.test(text) && !/[.!?]["”’]?\s+\S/.test(text), "The excerpt must be one sentence"),
    body: z.string().trim().min(1),
}).strict().refine(piece => piece.eventDate <= piece.date, { message: "eventDate cannot be after the publication date", path: ["eventDate"] });
export type LookingBack = z.infer<typeof LookingBackSchema>;


// Match Revisited: one long-form write-up of a classic Liverpool match, weekly.
// Strict, like the other Looking Back types. Field names follow Looking Back
// (eventDate, scoreline, excerpt) and Biographies (decade), and it uses the
// shared connection tags (players, opponents). The retired History taxonomy
// (entities, eras, relatedMatches) is deliberately not part of it.
export const MatchRevisitedSchema = z.object({
    title: z.string().trim().min(1),
    // The big display headline on the piece's own page; title stays for lists and search.
    headline: z.string().trim().min(1).optional(),
    slug: SlugSchema,
    // Publication date; the piece goes live on the Monday of its week (go-live.ts).
    date: z.iso.date(),
    // The day the match was played.
    eventDate: z.iso.date(),
    opponent: z.string().trim().min(1),
    scoreline: z.string().trim().min(1),
    competition: z.string().trim().min(1),
    decade: z.string().regex(/^\d{3}0s$/, 'Use a decade such as "1980s"'),
    excerpt: z.string().trim().min(1),
    // Connection tags for "Continue reading"; the season comes from eventDate.
    players: PlayersSchema,
    opponents: OpponentsSchema,
    body: z.string().trim().min(1),
}).strict().refine(piece => piece.eventDate <= piece.date, { message: "eventDate cannot be after the publication date", path: ["eventDate"] });
export type MatchRevisited = z.infer<typeof MatchRevisitedSchema>;

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
    // Others the biography is mainly about. Its own subject counts automatically
    // when the biography's slug is in content/players.json.
    players: PlayersSchema,
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
    players: PlayersSchema,
    season: SeasonSchema,
    opponents: OpponentsSchema,
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


// Klopp's Liverpool timeline (content/timeline/klopp.json). Strict: unknown keys
// fail the build. Links point at existing content only; lib/content/timeline.ts
// checks each one resolves. `image` is reserved and not rendered in version 1.
export const TIMELINE_TYPES = ["match", "signing", "moment"] as const;
export const TimelineLinkSchema = z.discriminatedUnion("type", [
    z.object({ type: z.literal("series-part"), seriesSlug: SlugSchema, partNumber: z.number().int().positive() }).strict(),
    z.object({ type: z.literal("biography"), slug: SlugSchema }).strict(),
    z.object({ type: z.literal("article"), slug: SlugSchema }).strict(),
]);
export type TimelineLink = z.infer<typeof TimelineLinkSchema>;

const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
const oneSentence = (text: string) => /[.!?]["”’]?$/.test(text) && !/[.!?]["”’]?\s+\S/.test(text);

export const TimelineEntrySchema = z.object({
    id: SlugSchema,
    type: z.enum(TIMELINE_TYPES),
    priority: z.enum(["main", "extended"]),
    season: z.string().regex(/^\d{4}-\d{2}$/, 'Use a season such as "2015-16"').refine(value => (Number(value.slice(0, 4)) + 1) % 100 === Number(value.slice(5)), "The season's second year must follow its first"),
    dateStart: z.iso.date(),
    dateEnd: z.iso.date().optional(),
    precision: z.enum(["day", "month", "window"]),
    dateLabel: z.string().trim().min(1),
    announced: z.iso.date().optional(),
    effective: z.iso.date().optional(),
    parent: SlugSchema.optional(),
    title: z.string().trim().min(1).refine(title => wordCount(title) <= 8, "The title must be 8 words or fewer"),
    competition: z.string().trim().min(1).optional(),
    result: z.string().trim().min(1).optional(),
    summary: z.string().trim().min(1),
    links: z.array(TimelineLinkSchema).default([]),
    image: z.string().trim().min(1).optional(),
}).strict().superRefine((entry, ctx) => {
    const fail = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });
    if (entry.dateEnd && entry.dateEnd < entry.dateStart) fail("dateEnd", "dateEnd cannot be before dateStart");
    // Never invent a day: only day-precision entries may lead with a day of the month.
    if (entry.precision !== "day" && /^\d{1,2}\b/.test(entry.dateLabel)) fail("dateLabel", "A month or window entry's label must not name a day of the month");
    if (entry.precision === "day" && entry.dateEnd) fail("dateEnd", "A day-precision entry has no dateEnd");
    if ((entry.announced || entry.effective) && entry.type !== "signing") fail("announced", "announced and effective are for signings only");
    if ((entry.competition || entry.result) && entry.type !== "match") fail("competition", "competition and result are for matches only");
    if (entry.priority === "main") {
        const words = wordCount(entry.summary);
        if (words < 25 || words > 45) fail("summary", `A main entry's summary must be 25 to 45 words (this has ${words})`);
        if (entry.parent) fail("parent", "A sub-entry must be extended");
    } else if (!oneSentence(entry.summary) || wordCount(entry.summary) > 30) {
        fail("summary", "An extended entry's summary must be one short sentence (30 words or fewer)");
    }
});
export type TimelineEntry = z.infer<typeof TimelineEntrySchema>;
