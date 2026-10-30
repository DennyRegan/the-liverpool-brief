# Football Observed implementation review — 30 October 2026

Implemented locally on `feature/football-observed-premium`, based on current main `14a5482` in the `football-observed` worktree. The original review was local only; the subsequent release approval is recorded below.

## Audit and approach

Read `CLAUDE.md`, `docs/connected-history.md`, `docs/seasons-publishing.md`, the Article/Archive schemas, current homepage, Articles navigation, column loader/page, article renderer and existing column tests. The referenced feature discussion favoured modern editorial typography, a recognisable column within Articles and homepage placement below the lead journalism.

Football Observed already existed at `/regan-on-football` and in Articles navigation. Its editions are ordinary Opinion articles tagged exactly `regan-on-football`. The implementation extends these existing features; it creates no parallel category schema, manuscript store or replacement URL. Current main has one published edition, the Carrick column dated 23 October 2026. The forthcoming edition is absent and was not added.

## Changes

- Retained the column masthead, fonts, colours and navigation; added a concise introduction, an explicit latest-edition feature and an optional contents column on the existing page.
- Added a prominent homepage column immediately after the unchanged editorial lead selection, followed by More to read. The latest edition is not repeated in More to read. No newsletter behaviour changed.
- Added chronological previous-edition cards on the column page and up to two previous editions on the homepage when available. The current one-edition collection has no invented previous editions.
- Added contents links from existing top-level H2 headings and opening text, with identical Markdown rules for links and rendered targets. Native links support direct navigation, keyboard focus and no-JavaScript reading. Single-subject editions omit contents.
- Added published-only previous/newer edition links and a collection return link. Withdrawal automatically removes an edition from navigation.
- Declared already-locked Markdown parser packages as direct dependencies, without version changes. All new components render on the server; no client interaction service or subscription is required.
- Updated the column publishing guide to reflect current History navigation and approval guidance, replacing obsolete statements that those documents were absent.

All content files, article prose, titles, dates, slugs, entity IDs, schemas, History code, social canonicals, sitemap logic, publishing workflows and approval boundaries are unchanged. The existing public-directory publishing boundary is retained: future dates do not schedule or protect drafts. Interactive analysis is not part of this implementation.

## Verification

| Check | Result |
| --- | --- |
| `npm ci --offline --ignore-scripts` | Passed; lockfile unchanged except direct dependency declarations |
| `npm test`, Node 24.22.2 | 64 passed, zero failures; 13 explicitly skipped private-pack integration tests |
| `npm run lint`, Node 24 | Passed |
| `npm run validate:history`, Node 24 | Passed: 9 approved factual articles, 1 season, 47 subjects, 1 series, 9 verified events |
| `npm run build -- --webpack`, Node 24 | Passed, including TypeScript and static generation; existing Google Fonts required network access |
| `node scripts/verify-football-observed.mjs` against Node 24 production server | Passed: five routes, existing lead, category membership, contents fragments, canonicals and ordinary-article isolation |
| Existing normal-mode `verify:history` | Passed: 94 routes, including History categories, canonical links, season/map isolation, search, sitemap and unavailable pages |
| `verify:history-build`, Node 24 | Passed: 39 traces include approved runtime data and exclude editorial files; clean checkout has no private inventory |
| Content preservation | `git diff origin/main -- content public .github app/history lib/content/history-library.ts lib/content/types.ts app/components/ArticlesNavigation.tsx` empty |
| Browser | Desktop and 390px mobile homepage/category/reader inspected; 320px homepage checked; no horizontal page overflow or console warnings/errors observed |
| Keyboard | Contents link activated with Enter; correct heading received focus and appeared at its 24px scroll offset |
| Regression fixtures | Exact tag/category membership, zero/one/multiple editions, date ties, withdrawal, excluded draft folder, previous/newer neighbours, formatted/duplicate/reserved/accented headings, code fences and quoted headings |

The existing `validate:prototype` and `validate:matches` commands were attempted and cannot complete in this clean checkout because `prototype/history/1987-88.json` and `prototype/match-review/manifest.json` are deliberately absent. The private prototype build was not run. This is not a claim of full private-pack validation.

A supplementary check against the older neighbouring editorial inventory initially flagged the Luton report title: that inventory predates seven reports already published on current main. After excluding those seven by current canonical public-loader membership, a read-only supplemental scan passed against 551 still-unapproved reports across 743 emitted/public files from the first successful build. The existing verifier and private inventory were not modified. Final Node 24 trace verification passed independently; no new historical content was introduced.

## Editorial review and release boundary

Only one live edition is available for visual inspection. Previous-edition ordering and navigation are tested with temporary fixtures, not by putting fake editions into public content. The existing Carrick file has no explicit excerpt; the presentation retains the site's body-derived excerpt fallback. Any new curated excerpt or additional headings need editorial approval. No missing History metadata was inferred or filled.

The original feature review and the next edition require separate publication approval; Denny subsequently approved the feature release as recorded below. Before an approved release, check main for movement, rerun checks against the final source and review the actual forthcoming edition when supplied. During the initial review nothing was pushed because the Git integration could create a deployment.

Screenshots and check logs are in `../output/football-observed-review-2026-10-30/` relative to this worktree. The owned preview server is stopped after verification; restart with `npm run start -- --hostname 127.0.0.1 --port 3159` after building. Public site settings and services were untouched.

## Approved release update — 30 October 2026

Denny requested: “Abouts should be moved right to the bottom of the home page. And football observed added in its place … commit and make live to site.” The shared main navigation now reads Home / Articles / History / Football Observed. About remains at `/about` and is linked from the shared footer. Column pages and editions mark Football Observed active. The Articles category link is retained. Mobile navigation spacing accommodates the longer label. No new edition or other content is included.

Release target verified: `DennyRegan/the-liverpool-brief`, main branch, existing Vercel project `the-liverpool-brief` in Denny’s team, production domain `https://theliverpoolbrief.com`, Node 24. Previous production deployment: `dpl_5GTBm9W6kNjFLyfys3j3GUWEwkuB`, commit `14a54823e9df86eeede9f5354718cd4fd82b3f01`. Final deployment evidence is saved in the companion review-output folder.
