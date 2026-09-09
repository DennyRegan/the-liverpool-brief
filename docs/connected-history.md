# Connected history and discovery V1

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
| `season` | Optional consecutive football season. Prefer quoted `"1987-88"`; slash or en-dash separators and four-digit ending years are also accepted and normalized for matching. |
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
2. Have AI/Codex propose the article type, historical context and meaningful relationship IDs. Denny reviews those editorial choices against the article and its research.
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
