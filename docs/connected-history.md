# Connected History — development contract, 29 October 2026

## Approved release adjustment — 29 October 2026

Denny explicitly approved the infrastructure release and the limited public 1987–88 adjustment. This supersedes earlier local-only release/season statements below. The existing season reference is now approved at `content/history/liverpool/seasons/1987-88.json`; its legacy adjacent-season list is empty because navigation is derived. No article prose or metadata was changed.

The public experience uses only approved canonical reports. Its atlas reads the preserved Anfield coordinates and coastline from `content/history/liverpool/atlases/1987-88.json`, and derives cards from public factual articles. It currently contains one Forest report at Anfield. Withdrawing that report removes the map. It never reads local manuscripts. The guarded local experience still shows twelve reports and the original five-match map. All 558 unapproved reports remain excluded from release source and output.

The separate On This Day / This Week workstream is not included. This adjustment adds no season anniversary events and changes none of that workstream's files or behaviour. People pages add only season connections, not biographies.


This branch implements Denny’s Connected History brief for local review only. It supersedes the old navigation restriction for this development work, **not** the October editorial reset’s prohibition on automatic publishing. No feature release, restoration or new historical article publication is authorised. Main navigation becomes Home / Articles / History / About; the homepage body and newsletter sending system are unchanged.

## One canonical library

`lib/content/history-library.ts` is the server-side projection. It reads the existing validated Archive and Article loaders, canonical entities, Season schema and small Series/event verification records. It never scans drafts, old checkouts, Git history or withdrawn prototype reports. Factual History requires the existing `editorialMode: factual` in `content/archive/liverpool`; Opinion remains distinct. File placement in the public content directory plus a deployed build remains the publishing boundary; an old date does not make a withdrawn article public.

The six destinations are `/history/seasons`, `/history/people`, `/history/matches`, `/history/series`, `/history/on-this-day`, `/history/explore`. Person pages use `/history/people/[id]`; other connected subjects use `/history/explore/[id]`. Existing article URLs stay `/archive/[slug]` and `/articles/[slug]`. Legacy Archive collection redirects still lead to Articles; the public Archive label is not restored.

A subject has a destination only when linked by an approved factual article, an available season or a configured series. This deliberately replaces the old three/five-article threshold with a useful, clearly labelled reading page for the small current library. Registry membership alone creates no page. A sparse page says what is available; it never invents a biography. Player and manager roles share one canonical person ID and a dual-role article is listed once.

Season links appear only when the destination exists. Exact metadata derives reading lists, entity connections and up to three Continue Reading suggestions. The pre-reset `discovery.ts` scoring function is reused unchanged: five points and a substantial shared person/season/opposition/theme are required; competition or era alone cannot produce a recommendation. No reverse article lists are stored.

## Article authoring

Keep approved prose, title, publication date and slug unchanged. Use the existing Archive schema for factual historical writing. `articleType: player` or `manager`, `category: person`, the substantial `playerIds`/`managerIds`, and explicit factual approval make a biography discoverable. Reuse entity IDs from `content/history/liverpool/entities.json`. A career-wide profile need not have a principal season. Publication `date` and `historicalEventDate` are separate. Missing manager metadata is an editorial question, not something the application fills from a season.

No article is added or approved by these instructions. Prepare manuscripts outside public content until Denny approves publication.

## Series

Definitions: `content/history/liverpool/series/<id>.json`, strict schema in `history-library.ts`:

- `id`, `title`, `introduction`, `plannedChapters`, canonical `personIds`.
- `chapters`: optional planning entries `{ part, title?, status: planned | draft | review }`. A missing entry displays a neutral numbered planned slot, never an invented title.
- The published article itself carries `series: klopps-liverpool` and positive integer `part: 1` in its normal schema. Archive already had these fields; ordinary Articles now reuses them. Do not reclassify Opinion as factual to put it in a series.

Availability is derived from public articles, never from planning status. Unknown series, duplicate/out-of-range parts, missing parts and invalid person IDs fail validation. Canonical chapter links are shown only for available articles. Previous/next links follow published chapter order and explicitly say “available chapter” when gaps may exist. Removing a chapter removes its link; no duplicate manuscripts or new chapter URL hierarchy are created. Subject/season pages expose relevant normal-series articles in a separate related-chapters section.

Klopp’s Liverpool currently has 21 planned slots, zero approved titles and zero chapters. This is infrastructure, not a written series. New series use the same definition and article fields.

## Search

`/search?q=` is the single historical search route. The pre-reset lexical/prefix search function is reused unchanged. Server-rendered results index canonical approved factual articles, available published series chapters, approved Season records and series with published chapters. Metadata labels support player, manager, opposition, competition and season queries; diacritics and hyphen/en-dash variation normalise consistently. Drafts, withdrawn reports, local review seasons and empty planned series do not enter the index. No external search service, new dependency or separate client index is added.

## On This Day

Event records derive factual descriptions from approved content; they never use publication dates. A retained factual match/club-event/transfer can qualify through `content/history/liverpool/event-verifications.json`, containing its canonical slug, exact historical date, actual review date, HTTPS sources present in the article, and precise verification scope. The identity/date/result verification does not certify every detail of an article’s narrative. Date/source drift fails validation. Withdrawing the article removes its event automatically.

Approved structured season events also qualify if they have an exact date and all supporting source records have high confidence. This relies on an editor’s source assessment, not automatic fact checking. A same-season dated article event takes priority over a coincident season event to avoid duplicate discovery. Review-only season events are excluded.

The seed is the existing 13 April 1988 Forest report, whose match date/result were checked in the earlier inventory. No new match narrative was written. Other dates show an honest empty state. Today uses Europe/London; exact dates are validated, February 29 appears on February 29 only, and future events are not backfilled into earlier years. Native GET forms preserve selected dates in URLs.

## Sunday Brief

The local-only `/preview/history/newsletter?end=YYYY-MM-DD` shows verified anniversaries in the seven calendar days ending on the chosen date, published biographies, newly published series chapters, classic matches and approved seasons. Editors choose the strongest item; the site does not invent an importance score or mandatory running order. Links and source records can be copied into a draft. It excludes the local review season and withdrawn reports. Existing Sender configuration, signup forms, subscriptions and sending arrangements are untouched. No scheduling, email or publishing job was added.

## Private 1987–88 review boundary

See `seasons-publishing.md`. `/history/seasons/1987-88` uses the preserved prototype record only when the existing environment flag and loopback Host guard both pass. Its twelve-report reading list distinguishes the retained Forest report from eleven withdrawn reports; the optional atlas keeps the original five-match selection. Withdrawn files stay under `prototype/`, outside public loaders/search/events/sitemap. Normal builds show only the approved Forest report on the match-only Season URL and return 404 for withdrawn readers; the immersive season reference remains private. Future publication requires explicit approval and deliberate approved-record placement; enabling History infrastructure does not restore the season automatically.

## Verification

Run `npm run validate:history`, `npm run validate:prototype`, `npm test`, `npm run lint`, `npm run build -- --webpack`, and `npm run prototype:build`. Against the corresponding running local servers:

- `npm run verify:history` (review at port 3147).
- `BASE_URL=http://127.0.0.1:3148 HISTORY_REVIEW=0 npm run verify:history` (normal production build).

The HTTP verifier checks all six categories, derived subjects, links/fragments, canonical reports, unavailable routes, date/filter recovery, search exclusion, sitemap, homepage and non-local Host rejection. Unit fixtures cover publication/withdrawal, exact dates/leap years, week windows and series ordering/gaps. The former massive History verifier suite was coupled to the retired library and is not blindly restored. Browser checks remain necessary for keyboard, map, mobile reading and visual review.

## Complete match collection approval preview — 29 October 2026

The subsequent restoration-preparation brief extends these same routes with a guarded match collection adapter (`match-collection.ts`). It adds all 560 deduplicated historical manuscripts to local Classic Matches and Season browsing, with distinct published/withdrawn/draft labels, season grouping, bounded pages and per-report source/review disclosures. It does not add them to `getHistoryLibrary()` or any public feed. See `match-restoration-review.md` for counts, sources, limits and approval candidates.

A Season URL can now be derived from approved match metadata even without a full Season record: it shows a clearly labelled match collection, not invented season facts. Public sitemap entries for 1985–86 and 1987–88 refer to those approved match-only collections. In local review, 1987–88 still uses the guarded rich reference and optional five-match atlas, with all twelve reports in the chronological list. Publication and source-verification gates remain separate.

## Distinct discovery pages — 29 October 2026 refinement

Seasons now showcases developed Season records as story-led experiences. The guarded 1987–88 experience is the first local example; normal mode has no published experience yet and says so. Report-only years are secondary, explicitly labelled, and link into Classic Matches from a collapsed disclosure. Their existing canonical Season reading pages and article connections remain available.

Classic Matches opens directly into individual reports, with 12 stories per page in historical date order. Season, event-date decade, opponent and competition filters combine and persist through pagination; review mode additionally has publication status. A decade follows the match date, not the opening year of a season spanning two decades. Fixture/result text reuses the five existing prototype identities or an explicit score-bearing title; otherwise only known opponent labels are shown without inventing home/away order or a result. Full titles, excerpts, competition labels and event dates come from the existing canonical manuscripts and registry. No prose, entity IDs or publication boundaries changed.

Verification for this refinement is recorded in `docs/history-discovery-refinement.md`.

## Compact Classic Matches and editorial features

Classic Matches has a shorter heading, compact desktop filters and a mobile disclosure. Active filter removal links preserve the other selections and reset pagination; Clear all returns to the full collection. Native GET forms remain usable without JavaScript (the mobile form is exposed by a noscript fallback). Only the small filter toggle is a client component; article and featured content stay server-rendered.

Editors control the featured order through `content/history/liverpool/featured-matches.json`, a list of at most three unique existing canonical slugs. This is selection only, never publication or factual approval. A selection is shown only if it resolves to an approved factual match in the public library AND has matching existing event-verification evidence. Withdrawn, missing and unverified selections fail closed and disappear; zero eligible matches omits the section. The file may be empty. Changing this selection does not authorise deployment.

The initial selection is the already approved 13 April 1988 Forest report. Its recorded verification covers match identity, date and result, not a fresh certification of every narrative detail. No unpublished candidates were promoted or added to the feature. Public and local feature rows therefore show the same approved article. The compact row uses existing fixture/title/date text and canonical links, with no new summaries or images. It appears only on the first unfiltered collection page, so filtered and paginated browsing remains focused on its results. The chronological list remains complete, including the featured article at its normal position; there is still only one manuscript and URL.

See `docs/classic-matches-final-review.md` for final verification and screenshots.

## Final release preparation

`docs/history-release-review.md` defines the exact infrastructure-only release proposal. Approved file-based content is explicitly included in deployment traces. `prototype/`, local editorial files and prototype build outputs are excluded from production traces; `prototype/` is Git-ignored and excluded from the proposed public-repository patch. `.vercelignore` also excludes the local editorial pack from uploads.

The local full suite still exercises all private manuscripts. A clean public-source checkout runs all independent tests and explicitly skips twelve integration tests requiring that absent local pack. Those skips do not grant publication approval. Run full private inventory/prototype verification from the editorial checkout, pointing its HTTP verifier at the clean public server for the withdrawal checks. `npm run verify:history-build` checks the normal build traces and, when the local pack is present, scans emitted assets against all 558 unapproved narrative sentinels. No workflows were enabled and no credentials/settings were changed.
