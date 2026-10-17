# Writing-first publication review — 17 October 2026

Prepared from `origin/main` at `2a3eb55` on `feature/writing-first-publication`, for draft PR #74. The review now incorporates Denny's headline-first match-writing recommendation and his explicit choices to preserve all writing and retain supporting History/search/newsletter/chart features. No merge, production deployment, live workflow change or article publication has been performed.

## Final prepared behaviour

- Remove the public Premier League table, its component, jump link and styling. Remove `.github/workflows/league-table.yml`; once approved and merged this ends the five daily refreshes and manual Actions dispatch. The live workflow continues until then. History publication workflows are untouched.
- Remove fixture/result lists, last/next scorecards, result notices and fixture-only sources. No bare match or scoreboard appears without writing.
- Put current match coverage in **Articles**, alongside Opinion and Analysis, with All / Opinion / Analysis / Previews / Match reports views. Lead with the editorial headline; show the category, publication date and smaller fixture/result context beneath it. Match facts come from an explicit stable fixture reference, not parsed prose or a second score store.
- Add ordinary Preview and Match report categories to the existing Articles schema and Markdown loader. They require season plus fixtureId. Opinion/Analysis may use the same reference without reclassification. Reject unknown fixtures, mismatched dates/entities and reports of unfinished matches. Per-season register loading keeps article references valid after a season rollover. See [the publishing guide](match-writing.md).
- Preserve the saved preview/briefing prose in its original register and at `/match-centre#…`. Project that already-public writing into Articles without copying its body or inventing a new article address. Its date is explicitly labelled Updated. Older previews remain readable after kick-off and keep preview context, not a retrospective final score.
- Include current factual reports explicitly linked by the current register in Articles at their existing `/archive/<slug>` URLs. Historical reports/biographies remain in History; factual classification, Article/Archive separation, canonical URLs and entity/Season discovery are unchanged.
- Keep a concise homepage, with the headline followed by explicit fixture/result context. Prefer ordinary article previews/reports for timely coverage, retain legacy destinations as fallbacks, preserve the existing time windows, and suppress a coverage item when it is already the editorial lead. No written coverage means no match block.
- Keep five main-navigation items: Home, The Brief, Articles, History, About. Remove the permanent Match writing link from Home's Explore line. The old address remains for existing writing and links, rather than becoming a separate section.
- Keep Search. Ordinary match articles use their existing canonical search destinations; legacy preview/briefing writing is indexed once at `/match-centre`. Drafts and bare fixture data remain excluded.

## Content safety and editorial review

The only changed public manuscript field is the explicit fixtureId added to `isak-delivers-when-liverpool-need-him-brentford.md`. Its headline, Opinion category, publication/event dates, excerpt, sources, body and URL are unchanged. Its body was compared exactly with main; SHA-256 `c65031e5dfff06f28fd3d1a7a4a2038ce9741212214f497d925e9de556a50efe`.

No article body, fixture/table register, Archive schema, entity ID, season relationship, editorial calendar, draft, source or canonical URL is deleted, rewritten, moved or duplicated. No new journalism is authored. Earlier articles without explicit fixture metadata retain their existing presentation; no associations are guessed from headlines. New current reporting uses the existing Article source, while the legacy preview is a projection of its original source.

## Conservative retention decisions

| Item | Treatment and reason |
| --- | --- |
| Match Centre fixtures/results | Remove the utility presentation; retain all writing and old addresses. Current coverage is discoverable through Articles. |
| Season reference pages | Retain written overviews, sourced historical context, events and links to reports/biographies. Any later simplification of their factual panels needs a separate scoped review. |
| Managerial eras, People/Opposition/Competition browsing, This Week and Your Liverpool Years | Retain as prose and reading discovery. Search, filters, sharing and previous/next navigation remain. |
| Charts and illustrations supporting Analysis/articles | Retain as part of the journalism. No standalone statistics dashboard was found outside Match Centre. |
| Interactive History | No published experience currently exists. The held Istanbul material remains unpublished; no draft is exposed or deleted. |
| Newsletter invitation/signup and About/contact links | Retain as publication support. No subscriber, privacy or delivery setting changes. |

The sourced internal register, validators and legacy maintenance helpers remain for provenance, written preview storage, stable match references and timed homepage selection. Public pages do not fetch or render league standings. There is no new external API, database, client-side content corpus or publication mechanism.

## Guidance and verification

Reviewed the current project instructions, `docs/connected-history.md`, `docs/seasons-publishing.md`, editorial/publishing guidance, homepage and Match Centre guidance, and content schemas before implementation. The React quality review keeps projections server-side, uses stable canonical keys and native links, preserves heading hierarchy and touch targets, and introduces no client state.

- Calendar/content validation passed: 739 calendar entries, 242 Archive associations, 67 Season records and 23 ordinary Articles files.
- Full tests: 254/254 passed, including match-reference validation, publication boundaries, season rollover, score ordering, preview/update semantics, article deduplication and homepage expiry.
- Lint: no errors; one existing unused `getPublishedExperience` warning in `tests/interactive-history-rendering.test.mjs:12`.
- Production build: passed, including TypeScript.
- Updated rendered-page checks passed: Articles filters, typed preview/report details, ordinary and legacy canonical links, duplicate exclusion, expired/absent writing states, homepage destinations, Search with 419 canonical destinations, 67 Season pages, 16 managerial-era pages and existing History links.
- Browser checks passed at 320/390/768/1280px: headline before match context, all five type filters, legacy preview access, no match widgets, no page overflow, keyboard Search, no-results and JavaScript-disabled Search, zero main-landmark accessibility violations and no runtime errors. Desktop/mobile screenshots visually reviewed. An existing pale decorative article number was darkened to meet contrast requirements.
- Existing metadata advisory: `forshaw-hat-trick-manchester-united-1925` has no managerial-era association. It predates this change; no tenure is guessed. The current era guide begins in 1959.

The checkout has two pre-existing case-colliding research-record pairs (`Alan-Hansen`/`alan-hansen` and `Terry-McDermott`/`terry-mcdermott`). On this case-insensitive filesystem Git reports the uppercase copies as modified after checkout. Neither pair is part of the change; their distinct Git blobs are preserved and excluded from the review commit.

Before any later production release, refresh main, reconcile intervening changes and follow the user's approval boundary. This draft is not a live release.
