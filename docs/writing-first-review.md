# Writing-first publication review — 17 October 2026

Prepared from `origin/main` at `2a3eb55` on `feature/writing-first-publication`. This is a review proposal. No merge, production deployment, live workflow change or article publication is authorised or performed.

## Prepared changes

- Remove the public Premier League table, its component, jump link and styling.
- Remove `.github/workflows/league-table.yml`. Once approved and merged, this ends the five daily table-refresh runs and manual Actions dispatch. The existing live workflow continues until then. History publication workflows are untouched.
- Convert the permanent `/match-centre` page to **Match writing**, removing fixtures/results lists, last/next scorecards, result notices and fixture-only sources. Keep every preview and briefing stored in the current register, with its actual update time and relevant sources. Preserve their prose exactly. Older previews remain readable after kick-off. Keep `#match-preview` on the selected upcoming preview, or the most recent stored writing when none is upcoming, so existing reading links remain useful.
- Keep the existing current-season Opinion, Analysis and factual report links. Remove the Match Centre main-navigation item; retain a compact **Match writing** link on Home. Main navigation is Home, The Brief, Articles, History, About. Search remains beside the masthead byline.
- Update page/share descriptions and the existing HTTP/browser verification scripts to check writing preservation and widget absence.

No source content files, frontmatter, article schemas, slugs, canonical URLs, entity IDs, season relationships or editorial classifications change. The internal fixture/table register, validator and legacy maintenance helpers remain to preserve written material, provenance and the existing homepage coverage selection. They do not render a public table or fixture list. The reading page makes no live data requests.

## Ambiguous items and conservative decisions

| Item | Proposed treatment and reason |
| --- | --- |
| Match Centre fixtures/results | Identified before editing. Their removal is prepared on this review branch; the page address and all stored writing remain. Product approval is still required before merge/publication. |
| Season reference pages | Retain: these mix written season overviews, sourced historical context, events and links to reports/biographies. Deleting them would remove prose and established reading destinations. Any later simplification of their factual panels needs a separate scoped review. |
| Managerial eras, People/Opposition/Competition browsing, This Week and Your Liverpool Years | Retain: they contain prose or help readers reach canonical written history. Search, filters, sharing and previous/next navigation serve the same purpose. |
| Charts and illustrations supporting Analysis/articles | Retain as part of the journalism. No standalone statistics dashboard was found outside Match Centre. |
| Interactive History | No published experience currently exists. The held Istanbul material remains unpublished; no draft is exposed or deleted. |
| Newsletter invitation/signup and About/contact links | Retain as publication support and reader utilities. No subscriber, privacy or delivery setting changes. |

The proposed treatment for the mixed Match Centre feature is to remove its utility presentation while retaining its writing. The mixed History and discovery features remain intact for this review. None of these product decisions is applied to the live site.

## Publishing guidance and content safety

Reviewed current `AGENTS.md`/`CLAUDE.md`, `docs/connected-history.md`, `docs/seasons-publishing.md`, editorial/publisher guidance, homepage and Match Centre guidance, and the current Brief, Article, Archive, fixture and Season schemas. The requested publishing guidance and core content schemas were inspected before application edits. Article prose and canonical Archive paths remain the existing source of truth. No editorial drafting, factual reclassification or calendar claims are part of this change.

The current checkout has two pre-existing case-colliding research-record pairs (`Alan-Hansen`/`alan-hansen` and `Terry-McDermott`/`terry-mcdermott`). On a case-insensitive filesystem, Git reports the uppercase copies as modified after checkout. Neither pair is part of this change; preserve their distinct Git blobs and exclude these checkout artefacts from the review commit.

## Verification

- Calendar validation: passed, 739 entries.
- Content validation: passed, including 242 Archive associations, 67 Season records and 23 Opinion/Analysis articles.
- Full tests: passed, 248/248.
- Lint: passed with no errors; existing unused `getPublishedExperience` warning in `tests/interactive-history-rendering.test.mjs:12`.
- Existing metadata advisory: `forshaw-hat-trick-manchester-united-1925` has no managerial-era association. This predates the change; no tenure is guessed or metadata altered. The current era guide starts in 1959.
- Production build: passed, including TypeScript and 443 static pages.
- Existing HTTP checks: homepage and all its reading destinations; 67 Season pages and 328 internal destinations; 16 managerial-era pages and 274 existing routes; preserved match previews/briefings, canonical reports and Analysis connections across six History contexts; Search queries, pagination, canonical results and server-only tracing all passed.
- Browser checks: passed at 320, 390, 768 and 1280px. No page overflow, no data widgets, keyboard Search submission and focus passed, no-results and JavaScript-disabled Search passed, zero axe violations in Match writing/Search main landmarks, and no browser runtime errors. Desktop and mobile screenshots visually reviewed.
- Content safety: no changes under `content/`, to content loaders/schemas or to the editorial calendar. No source material or editorial manuscripts are included in the review commit.

Production approval remains required. Before any later merge, refresh main, reconcile intervening changes, rerun affected checks and review the proposed Match Centre treatment with Denny.
