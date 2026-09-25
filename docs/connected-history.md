# Connected history and discovery V1

Before any historical article work, read the latest main `docs/editorial/history-calendar.json` and follow `docs/editorial/README.md`. Claim work before drafting, reuse saved writing, update the shared row after each save and reconcile concurrent changes. If the calendar is unavailable, stop. Requested factual drafts are permitted; no new article publication or factual reclassification is approved by the calendar. Keep British English, text only, retrieved-source checks and source confidence labels in editorial notes. The calendar is the only commissioning queue; canonical metadata below remains binding.

Review branch: `feature/connected-history-v1`. This work must be reviewed before merge or production deployment.

Archive Markdown at `content/archive/liverpool/<slug>.md` remains the only article source. The existing loader, Zod schema, canonical `/archive/<slug>` URLs, combined Articles collection, History Explorer and This Week connections are retained. The entity registry contains labels and identities, never article bodies. Opinion has its own unchanged schema and collection.

## Metadata reference

`ArchiveFeatureSchema` in `lib/content/types.ts` validates article structure. The loader in `lib/content/archive.ts` resolves relationship IDs against `content/history/liverpool/entities.json` and era IDs against `content/history/liverpool/eras.json`.

| Field | Type and purpose |
| --- | --- |
| `title`, `excerpt` | Required strings for the existing article title and summary. |
| `slug` | Stable lowercase kebab-case string matching the filename without `.md`; the loader uses the filename if omitted. Determines the existing canonical URL. |
| `date` | Required valid `YYYY-MM-DD` publication date. Never substitute the historical date. |
| `historicalEventDate` | Optional valid `YYYY-MM-DD` date of the event; used by History and existing This Week associations. |
| `historicalPeriod` | Required editorial display string, such as `2 September 1978` or `1987–88`; not parsed into relationships. |
| `decade` | Required existing display/grouping string, such as `1980s`. |
| `category` | Existing navigation grouping: `match`, `person` or `season`; defaults to `match`. Its meaning has not changed. |
| `articleType` | Optional precise subject: `match`, `player`, `manager`, `transfer`, `season`, `competition`, `club-event` or `other`. A player article can retain `category: person`. |
| `season` | Optional principal season in canonical consecutive `YYYY-YY` form, e.g. `"1987-88"`. Other separators or four-digit ending years are rejected. A structured record need not exist yet. |
| `historyEras` | Optional non-empty array of existing managerial tenure IDs; explicit editorial contexts override automatic placement. |
| `playerIds` | Optional array of central people discussed as players; each entity must have kind `person`. |
| `managerIds` | Optional array of central people discussed as managers; each entity must have kind `person`. |
| `oppositionIds` | Optional array of meaningful opposition clubs; kind `opposition`. |
| `competitionIds` | Optional array of meaningful competitions; kind `competition`. |
| `locationIds` | Optional array of meaningful grounds or places; kind `location`. |
| `themeIds` | Optional array of substantial recurring editorial themes; kind `theme`. |
| `series`, `part` | Existing optional series string and numeric part. |
| `manager`, `leagueFinish`, `european`, `domesticCups`, `topScorer`, `arrivals`, `departures` | Existing optional display strings for the season facts panel. `manager` is display text; `managerIds` supplies validated relationships. |
| `relatedMatches` | Existing optional array of curated match slugs for season articles. References must exist, have `category: match` and not point to the current article. New discovery needs no manually maintained lists. |
| `sources` | Existing optional array of source strings. |
| `body` | Derived from Markdown below the closing frontmatter delimiter; do not add a duplicate body field. |

All relationship and era IDs use lowercase kebab-case. Duplicate IDs within a field are rejected. A person can appear in both player and manager fields when both roles are substantial; this does not create another identity. Unknown entities, wrong entity kinds, invalid article types, malformed dates or seasons, invalid era IDs and filename/slug mismatches stop content validation with an article-specific error.

## Stable entities and editorial judgment

The registry is a small JSON array:

```json
[
  { "id": "kenny-dalglish", "label": "Kenny Dalglish", "kind": "person" },
  { "id": "anfield", "label": "Anfield", "kind": "location" }
]
```

Use an existing ID whenever it represents the same entity. To introduce a new one, add a single object with a unique stable `id`, a non-empty reader-facing `label`, and one of `person`, `opposition`, `competition`, `location` or `theme`. Duplicate IDs and duplicate labels within a kind are rejected, including differences only in capitalization or spacing. Validation cannot identify every historical alias; check the existing registry before adding a differently worded label for the same subject.

`kenny-dalglish` always identifies the person. `kenny-dalglish-1985-1991` and `kenny-dalglish-2011-2012` identify distinct tenures in the separate existing era registry. Do not split the person into player and manager identities, or infer a particular tenure from the person ID. Keep IDs stable when changing display labels.

Tag what the article is substantially about, not every name in its prose. The current registry contains only the 14 entities needed by the three existing articles. Rush is included in the Barnes article because replacing his attack is its central argument; players who only appear in individual match incidents are generally omitted. Shared themes should describe an actual editorial connection, not be added to force recommendations.

## Publishing another article

1. Write the original article once in `content/archive/liverpool/<slug>.md`, retaining the existing required frontmatter and canonical slug conventions.
2. Have AI/Codex propose the article type, historical context, principal `season` where meaningful, and relationship IDs. Leave career/multi-season writing without a season when no principal campaign exists; this is editorial review, not automatic prose inference. Denny reviews those editorial choices against the article and its research.
3. Reuse canonical entities; add only missing entities to `entities.json`. Add explicit `historyEras` when the article spans tenures or automatic placement is unsuitable.
4. Run `npm test`, `npm run lint` and `npm run build`. The build already runs `scripts/validate-history.mjs`, including registry, Archive, era and This Week validation.
5. Review the article, related reading and applicable History/This Week links in a preview. Follow the normal branch review and deployment process after approval.

No reverse relationships, recommendation lists, extra article copies, destination pages or application-code edits are required. Connections regenerate from approved metadata when the site is built. Code validates structure; editorial research validates historical truth.

## Migrated article examples

These are the exact added metadata values. Existing frontmatter and all prose are preserved. Existing historical event dates continue to determine era placement, so redundant `historyEras` overrides were omitted.

`john-barnes-1987.md` retains `category: person`, `historicalEventDate: "1987-08-15"` and its existing title and publication date:

```yaml
articleType: "player"
season: "1987-88"
playerIds: [john-barnes, john-aldridge, peter-beardsley, ian-rush]
managerIds: [kenny-dalglish]
competitionIds: [first-division]
themeIds: [attacking-football, changing-attack]
```

`liverpool-7-tottenham-0.md` retains `category: match` and `historicalEventDate: "1978-09-02"`:

```yaml
articleType: "match"
season: "1978-79"
playerIds: [kenny-dalglish, terry-mcdermott]
managerIds: [bob-paisley]
oppositionIds: [tottenham-hotspur]
competitionIds: [first-division]
locationIds: [anfield]
themeIds: [attacking-football]
```

`liverpool-9-crystal-palace-0.md` retains `category: match` and `historicalEventDate: "1989-09-12"`:

```yaml
articleType: "match"
season: "1989-90"
playerIds: [john-aldridge, john-barnes, peter-beardsley, ian-rush]
managerIds: [kenny-dalglish]
oppositionIds: [crystal-palace]
competitionIds: [first-division]
locationIds: [anfield]
themeIds: [attacking-football, changing-attack, player-farewells]
```

## History Explorer placement

`getArticleEraIds()` in `lib/content/history.ts` uses this precedence:

1. Explicit `historyEras` is the complete set of contexts and can contain multiple tenures.
2. Otherwise, an exact `historicalEventDate` selects its tenure. An incoming tenure wins on a shared handover day. Appointment gaps stay unassigned; the presence of a date prevents season fallback.
3. Only without an event date, `season` can place the article when the whole season from 1 July through 30 June fits within one tenure. A handover season needs explicit editorial era IDs.

Publication date, prose periods, player IDs, manager IDs and manager display names never imply an era. An unassigned article remains valid Archive content and produces an advisory build warning. History selects the original Archive objects once per canonical slug and retains publication-date ordering. This Week continues using its existing event relationships and the same Archive URLs.

## Related reading and scoring

`getRelatedArchiveArticles()` in `lib/content/discovery.ts` selects existing Archive objects for “Continue exploring” at the end of an article. It returns up to three recommendations by default, fewer when connections are weak, and none when no candidate qualifies. The current slug is excluded and each other canonical slug appears at most once. No content is copied or generated.

| Shared relationship | Points | Cap per candidate pair |
| --- | --- | --- |
| Central person, across `playerIds` and `managerIds` together | 5 each | Two unique people, 10 points total; the same person in both roles counts once. |
| Same normalized season | 5 | Once. |
| Opposition | 3 | Once, even if several clubs match. |
| Managerial era, using the placement rules above | 2 | Once, even if several eras match. |
| Theme | 2 each | Two themes, 4 points total. |
| Competition | 1 | Once. |
| Location or decade | 0 | Stored for future discovery; too broad to improve this ranking. |

A candidate needs **at least 5 points and a shared person, season, opposition or theme**. Era and competition alone never qualify. Matching article types and publication dates add no points. One shared person or season is sufficient; other signals need supporting context. For example, one shared opposition plus one shared era qualifies, while an opposition alone does not.

Results sort by descending score, then newest publication date, then slug alphabetically. Scores are unaffected by metadata array order. Displayed person reasons follow the current article’s `playerIds`, then `managerIds` order, so list its most central subjects first. This editorial display order does not alter scores or result ranking. The function accepts a result limit for reuse; the default reader feature uses three. Scores are symmetric and deterministic, derived only from approved metadata.

The reader sees at most two distinct reasons, chosen in this order: shared people, season, opposition, themes, era, competition. Labels come from the registry; season is displayed as `1987–88`, opposition as `Against Tottenham Hotspur`, and era as `Same era`. Technical field names, raw IDs and numerical scores are not reader-facing text. The reason list explains the strongest specific connections without trying to list every factor.

With the migrated metadata, Barnes and Palace score 17: two counted people (10), two themes (4), an era (2) and a competition (1). Either 1980s piece connects to Tottenham through Dalglish across player/manager roles, attacking football and the First Division, scoring 8. These connections come from the approved article subjects; being set at Anfield or in the same decade does not create a recommendation. The caps prevent articles with many tags from overwhelming more focused pieces.

The constants, eligibility check, ordering and reason policy are together in the small discovery function, with comments and unit tests. Adjust them there if editorial review later demonstrates a better ranking; publishing additional articles only requires metadata.

## Deliberate scope and future use

V1 adds metadata and automatic related reading to existing historical articles. It does not add another article system, database, CMS, runtime AI, embeddings, semantic search, graph visualization, accounts, personalization or saved-history features. There are no new public entity indexes or player, manager, season, competition or decade hubs: those need enough original writing to justify a useful destination.

Future destinations can query the same validated `playerIds`, `managerIds`, `competitionIds`, normalized `season` and other relationship fields, using registry labels and existing `/archive/<slug>` links. A person page can combine player and manager references by the same ID. Article bodies, URLs and authoring format do not need restructuring. Expand the registry only as approved articles require it; do not create a speculative historical dataset.

## Seasons integration

The existing Season system and Archive now share `SeasonIdSchema` in `lib/content/history.ts`. `getSeasonArchiveArticles` selects canonical Archive objects by season metadata for the conditional **From the Archive** section. `ArchiveSeasonLink` uses published `getSeasons()` records to show **Explore 1987–88** after the article body. Missing records suppress the link, not the article or its valid metadata. Publishing a corresponding record later enables it at the next build.

No article lists belong in season JSON. Same-season recommendations retain their existing five-point weight, self-exclusion and metadata-driven ranking. Season managers, players, trophies, transfers and events already share the entity registry used by Archive. No additional entity catalogue or destination pages are needed. The existing Season navigation selects adjacent published records, skipping gaps; it never calculates a URL for an unwritten season.

See `seasons-archive-integration-review.md` for the complete current article audit and review checklist. This integration branch is for review only; earlier authorisation to publish season reference content does not authorise merging or deploying this change.


## Factual History browsing — 14 September 2026

`/history/matches` and `/history/players` are browsing views of the existing Archive Markdown collection. Canonical article URLs stay `/archive/<slug>`. No second content store, entity registry or individual player profiles are created.

Optional `editorialMode: factual | opinion` records an explicit editorial decision. An omitted value is unreviewed, not implicitly factual. Only `factual` content enters History reading selections and leaves the combined Articles/homepage writing collection. Existing opinion and unreviewed Archive pieces remain in Articles. Subject selection uses existing `articleType: match | player`; person IDs alone never turn a match report into a player article. Existing entity relationships and seasons continue to validate and drive discovery.

Denny approved only `alonso-own-half-newcastle-2006` and `steve-nicol-hat-trick-newcastle-1987` for this initial move. All other articles retain their metadata and prose pending his review. Players initially shows an honest empty state, with no speculative names or profile links. Future approved biographies need only the existing player metadata plus `editorialMode: factual`.

History era and Season reading panels select approved factual Archive content. Factual article recommendations also stay within factual content; factual articles link back to the relevant History browser and highlight History in the header. The established era records and season reference records remain unchanged. Legacy Archive collection URLs remain available for compatibility. This Week and canonical article bodies are preserved.

The four History navigation links wrap on narrow screens. Both browsing routes are static server components, use original excerpts and historical periods, and list each qualifying article once in the existing publication order. This feature introduces no client state, filter framework, database or dependency.

Matches browsing offers decade and season filters from approved articles' existing `decade` and `season` fields. Keep season IDs in `YYYY-YY` form (e.g. `1976-77`); the interface displays an en dash. Only populated options appear. Changing decade clears the season selection, and Reset filters restores all reports. Publication dates never determine these filters.

Players browsing sorts alphabetically by first name using the full canonical label of the first `playerIds` entry. For a biography, put its main subject first, followed by any other referenced players. Equal full names sort by article slug. Legacy entries without a player ID fall back to their title; new biographies should always identify their subject. No player profiles are generated.

## Connected History V2 — entity exploration (review branch, September 2026)

This section supersedes V1's deferred entity destinations and the original empty Players state. V1 recommendations, article URLs, seasons and managerial eras remain intact. The feature is not approved for merge or production deployment.

### Metadata baseline and publication

V2 includes the completed metadata audit as a dependency and Denny's six explicit classification decisions: Barnes 1987, Palace 9–0, Dalglish at Goodison and Phil Thompson are factual; Tottenham 7–0 and the Keegan/Hamburg essay are Opinion. Article prose, titles, dates and slugs are unchanged. The earlier audit report is a dated snapshot; current counts below use the reviewed factual classification and all 212 already-public Archive files, including the three subsequently verified 1990 reports. Its old 209-live count is not the current publication boundary.

`getExplorations()` uses only `getFactualHistoryArticles()`, which reads the existing public Archive directory. It does not read editorial drafts or trust calendar status to load articles. The Torres 2008 derby remains draft-only. The existing directory-plus-deployment publication boundary is preserved: metadata in an editorial draft cannot publish it, but putting a file in the public Archive directory includes it on the next deployed build. No new publication mechanism is introduced.

### Destinations and thresholds

| Type | Detail route | Minimum distinct factual articles | Eligible at review |
| --- | --- | --- | --- |
| Person | `/history/people/[id]` | 3 | 41 |
| Opposition | `/history/opposition/[id]` | 5 | 10 |
| Competition | `/history/competitions/[id]` | 5 | 6 |

Thresholds count substantial reviewed relationships, not every mention or structured-season occurrence. A person in both roles counts once per canonical article. Unknown IDs, wrong entity kinds and below-threshold entities receive 404, with `dynamicParams = false` and static parameters generated only from eligible entities. All new detail pages have canonical metadata, titles and descriptions. Registry membership alone never creates a destination.

`/history/players` remains the sole People index: it now offers eligible people alphabetically, followed by the original factual biographies/player features and their existing URLs. The navigation label becomes People. There is no second `/history/people` index. `/history/opposition` and `/history/competitions` are concise indexes reached from the History landing page; they do not add permanent main-navigation tabs. The existing Interactive History link is retained.

### Derivation, chronology and roles

`lib/content/exploration.ts` derives collections from canonical Archive objects and the existing registry. It stores no articles or reverse lists. Counts exclude Opinion, unreviewed material and all draft-only writing. Related Reading retains its original scoring and selection implementation.

People combine `playerIds` and `managerIds` under one identity. Exclusive sections are **As a player**, **As manager**, and **As player and manager**; a dual-role article appears only in the third section. Each section groups writing by principal season, oldest first. Within a group, exact `historicalEventDate` takes precedence, then known season chronology, then publication date only as a fallback. Slugs break ties. No exact historical dates are invented. Articles without a principal season have a separate **Career and wider history** group even if they have an anchor event date.

Opposition and Competition pages use the same chronological groups. Larger collections use native expandable season sections with the first group open; collections/role sections of 12 or fewer articles show all groups open. This keeps the 101-article First Division collection navigable without a flat wall of cards. No generated biographies, club histories or missing fixtures are supplied.

### Seasons and managerial eras

Every article retains its existing `Explore [season]` link. Entity groups link only to Season records that exist. People also link to existing Seasons where the canonical person appears in structured manager, key-player, scorer, transfer or event relationships. This is derived, never maintained as a reverse list. Season pages retain their existing Related articles section and automatic previous/next navigation.

People pages link to existing managerial eras through exact canonical display-name equality with the era's `manager` label (including the two labels separated by ` & ` in the existing joint tenure). Dalglish's two eras remain two periods under one person. This is a deliberate compatibility compromise: era records do not yet contain person IDs. No date inference or duplicated tenure registry is used; tests cover Dalglish's two spells and the Evans/Houllier joint era. If canonical labels diverge in future, omit the unmatched link rather than guess; adding explicit person references to the existing era schema is a possible later refinement.

### Article exploration and mobile use

Factual article pages add **Explore this history** after the existing Season link and before Related Reading. Up to five eligible entity links are selected in editorial order: the first player and first manager (deduplicated), a principal opposition and competition, then remaining people/opposition/competitions to fill available slots. Ineligible candidates are omitted, never rendered as dead links. Season navigation remains its existing separate control. Opinion articles receive no V2 exploration panel and do not enter V2 collections.

Native links and disclosures support keyboard and touch use without new client-side code, services or dependencies. Entity indexes become one column on small screens, controls wrap, and article exploration links have a 44px minimum height. Existing Matches filters, biographies, This Week and Interactive History remain available.

### Publishing and checking

Once separately approved, publish a correctly tagged article through the established Archive workflow. The next build recalculates all eligibility, counts and links; crossing a threshold creates the destination automatically. Removing sufficient published relationships removes the destination and all derived links. No application change or reverse list is needed.

Run the existing calendar validation, full tests, lint, build, Season, History Explorer, This Week, Connected History and Interactive History checks. With a local production server at port 3152, also run `BASE_URL=http://127.0.0.1:3152 node scripts/verify-exploration.mjs`. This uses the existing Node/assert and HTTP-verifier approach and checks every eligible page, every Archive exploration panel, all linked destinations, deduplication/order and unknown/thin/draft 404s.

Search, theme/location destinations, graph visualisation, generated biographies, databases, external APIs and runtime AI remain deliberately deferred. This version makes existing writing explorable; it does not claim complete coverage of any person, opponent or competition.

### Analysis in Articles

Evidence-led Analysis remains canonical in `content/articles/liverpool` at `/articles/<slug>`, using the same optional entity/season/era/match metadata schemas. It can appear in separately labelled Analysis reading on existing Season, entity, era and match destinations. It never changes factual V2 eligibility or article counts. See [Match Centre and Analysis](match-centre.md) for publication and verification details.

## V3: interactive exploration

V3 adds navigation over the existing published factual library. It does not create a second article, Season or entity collection. The implementation lives in `lib/content/history-v3.ts`; the render-scoped React cache in `history-v3-view.ts` shares its projections between server components. V2 eligibility remains in `deriveExplorations`, unchanged.

### Routes and chronology

Timeline is the single chronology entry in the History navigation and gateway. Season detail pages remain canonical and return to their selected Season in Timeline. The existing `/history/seasons` directory remains available for old links and bookmarks, beneath Timeline rather than as a separate top-level category.

- `/history`: eight ways into the library, four guided journeys, and the existing managerial chronology and anchors.
- `/history/timeline?decade=1980s&season=1985-86#year-1985`: native GET filters; supplied valid filters intersect. Invalid filters produce a visible recovery message. Year sections have stable fragment IDs.
- `/history/journeys`: editorial journey directory.
- `/history/journeys/[journey]`: ordered contents and starting link.
- `/history/journeys/[journey]/[step]`: static, numbered reader steps with previous/next links, canonical destination and context links. Unknown journeys/steps return 404.
- `/history/my-years?from=1985`: native GET starting-year selection. No account, personal information or storage is needed. “Just let me explore” leads to the timeline.

The timeline groups by calendar year. Existing Season records appear as **period context**, including their canonical trophies. Factual article entries use `historicalEventDate`, never publication date; dated Season events and managerial-era starts retain their actual dates. If a Season contains a summer arrival assigned to the incoming campaign, its actual calendar date and its canonical Season association are both preserved. Undated Season events follow dated entries in their Season's starting year and explicitly say the exact date is not recorded. No dates are parsed from prose. Career-wide player/manager articles without a principal Season remain discoverable through V2 rather than being represented as a single event on their anchor date.

Each article appears once in the timeline. A structured Season event and an original article can concern the same occurrence: they are labelled as different source types and retain their own canonical destination. Event links use derived `#event-[event.id]` anchors on the existing Season page. Sparse years are not filled with invented material. New qualifying published articles and canonical records enter the projection automatically.

Your Liverpool Years includes calendar sections at or after the selected year and excludes entries assigned to a Season beginning before that year. Earlier records can remain optional context links outside the main sequence. This is an interest-based starting point, not a birthday or anniversary model. The selector spans the earliest and latest supported timeline year. Invalid input leaves the selector available with an explanation. No unpublished Season page is invented for an article with a Season value but no published Season record.

### Curated journey format

`content/history/liverpool/journeys/*.json` contains strict definitions with `id`, `title`, a short `introduction`, and ordered `steps` containing only `{kind, id}`. Supported kinds are article, season, person, opposition, competition and era. Titles, excerpts, dates and Season overviews resolve from canonical loaders. Article bodies are never copied. Duplicate steps, unknown fields, missing or ineligible destinations fail validation and the production build. Definitions must contain 3–12 steps and match their filenames.

Initial routes are Dalglish: player to manager; Liverpool and the European Cup; Bob Paisley's Liverpool; and Liverpool and Everton. They have intentionally curated order, not a recommendation score. Refer to the V3 review report for the exact approved-content references. If an article is withdrawn or an entity falls below V2 eligibility, update the editorial journey deliberately; never silently skip a broken step or publish a draft to repair it.

Reader progress is the numbered URL. Opening an original and using browser Back returns to the step. There is no localStorage dependency, account, custom router or duplicate article renderer. Journey additions do not change existing step references; editorial reordering changes what a step number means and should therefore be considered deliberately.

### Continuation and editorial boundaries

People, Competition, Opposition, Season, era and factual Archive pages have a restrained Continue from here panel, with at most three links. It can offer a journey containing the exact current destination (preferred over article-overlap fallback), an eligible connected entity or Season, and a relevant timeline decade/year. Entity-to-entity suggestions require at least two shared factual articles. Season suggestions use their existing manager/key-player IDs. Existing Related Reading and Explore This History logic and ordering are unchanged. Timeline sections also expose canonical context and a link into the next available year.

All V3 article inputs come from `getFactualHistoryArticles`. Opinion never silently enters V3. Draft visibility follows the canonical loader; journeys fail closed when a referenced article is unavailable. There is no new publication flag, eligibility threshold, reverse article list, canonical URL or article metadata field. Previously withdrawn content and the Torres Goodison draft remain unavailable.

### Rendering and verification

All new UI is server-rendered. Journey routes and existing destinations remain statically generated. Timeline and Your Liverpool Years render on the server for readable query-state URLs, using a few hundred local records; there is no database or remote recommendation call. The full timeline still sends its entries in HTML even when native disclosures are closed. Decade/Season filters reduce the response. Revisit pagination only if measured growth warrants it.

Native labelled forms, links and details/summary provide keyboard and no-JavaScript behaviour. New standalone controls have 44–48px minimum heights, focus uses the site's visible outline, and the layout is vertical. There is no required animation, hover, canvas or client state. No AI, semantic search, graph, saved profile or new historical writing is included.

Run `npm test`, `npm run lint`, `npm run build`, the existing verification scripts, and `BASE_URL=http://127.0.0.1:3157 node scripts/verify-history-v3.mjs` against a production preview. The V3 verifier checks every timeline entry/context/fragment, every journey step, continuation targets, seven starting years, invalid input, unavailable routes and factual publication boundaries. Browser review remains necessary for responsive behaviour, keyboard focus and complete reading journeys.

## Narrative journey pilot — Paisley (unpublished review)

This review extends the existing journey format; it does not add another article
collection. The three unconverted journeys retain their definitions and numbered
routes. A narrative journey gives every step a `chapter` with a stable `slug`,
`title`, display `period`, original connective `paragraphs`, `sourceIds`, and up
to two `furtherReading` canonical references. The step's existing `{kind,id}` is
its primary optional destination, not the chapter title. All references still
resolve against published factual content and eligible canonical destinations.
No original article body is copied or changed.

Narrative definitions also carry `sources` (`id`, `label`, HTTPS `url`), an
optional `closing`, and an explicit `legacySteps` migration array. Validation
rejects partially narrated journeys, duplicate chapter slugs/sources, unknown
source IDs, numeric chapter slugs, invalid migration targets and unavailable
reading. Reader sources are disclosed at the bottom of each chapter; source
confidence, claim scopes and research conflicts remain in editorial evidence
notes outside public rendering. No single principal season is forced onto the
nine-season Paisley story.

Chapter URLs use `/history/journeys/[journey]/[chapter-slug]`. Paisley's former
numeric routes issue permanent 308 redirects: 1–3 to `taking-over`; 4 to
`making-the-team-his-own`; 5 to `the-road-to-rome`; 6 to
`paris-amid-the-uncertainty`; 7–8 to `leaving-a-team-not-a-monument`. The last
slug is stable despite the reader title being “The final season”. The contents
URL and every original article/Season URL stay unchanged. New chapter ordering
therefore cannot silently reinterpret an old numbered bookmark.

The interface remains server-rendered, with no new dependencies, database,
runtime AI or browser storage. Chapter contents, progress links and previous/next
navigation are ordinary links; sources/contents are native disclosures. Optional
reading explicitly opens in a new tab to keep the chapter in place. The contents
page estimates reading time from the narrative word count at 220 words/minute;
optional reading is excluded. No automatic cross-device or return-visit resume
is claimed.

Draft provenance is `docs/editorial/drafts/bob-paisley-guided-journey.json`, its
Markdown review copy and companion evidence notes. The main calendar records
this commission as ready for review, not approved. The proposed journey JSON
and application changes belong only on `review/paisley-guided-story` until Denny
approves release; do not merge them as routine editorial maintenance.
