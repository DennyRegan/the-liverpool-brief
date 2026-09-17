# Match Centre + Analysis — review report

Branch: `feature/match-centre-analysis`, based on main `a4f0578`.
Status: implemented locally for review; no commit, push, merge or deployment performed for this task.

## Delivered

- Top-level Match Centre: snapshot, last/next competitive match, optional sourced briefing/report links, 48 fixtures, full 20-club Premier League table, current-season reading and section navigation.
- Opinion/Analysis views within Articles; canonical URLs and homepage latest-writing behaviour preserved.
- Analysis connections to existing Seasons, eligible People/Opposition/Competition destinations, managerial eras and related match reports. No eligibility changes or new People destinations.
- Eleven current-season Opinion articles gain only `season: 2026-27`. A direct comparison against HEAD confirms unchanged prose and all other metadata. No factual Archive file was changed or added.
- Ten missing opposition IDs added to the existing registry, with no alternative ID taxonomy.
- Publishing/maintenance guidance and dated source audit in `docs/match-centre.md`.

## Changed files

- New page/styles: `app/match-centre/page.tsx`, `app/match-centre/match-centre.css`.
- Data/model: `content/match-centre/liverpool/{current,2026-27}.json`, `lib/content/match-centre.ts`, `lib/content/analysis.ts`, `lib/content/articles.ts`, `lib/content/types.ts`, `lib/content/writing.ts`, canonical `entities.json`.
- Presentation: Articles index/detail, ArticleCollection, homepage category labels, SiteHeader, HistoryNav, global styles, new AnalysisReading and its Season/entity/era/Archive integrations.
- Metadata only: the eleven current-season Articles listed by the branch diff.
- Verification: `tests/match-centre-analysis.test.mjs`, updated `tests/unified-articles.test.mjs`, `scripts/verify-match-centre.mjs`, extended `scripts/validate-history.mjs`.
- Documentation: this report, `docs/match-centre.md`, connected-history and seasons-publishing guidance.

## Validation results — 17 September 2026

| Check | Result |
| --- | --- |
| Content validation | Pass: 48 fixtures, 20 table rows, 13 Articles, 212 Archive articles, 67 Seasons, 506 canonical entities, 16 eras, editorial calendar and published interactive content |
| Unit/regression tests | 144/144 pass |
| ESLint | Pass |
| Production build | Pass, including TypeScript |
| Match Centre integration | Pass: populated/absent briefing and report, exact canonical report links, current reading, both Article filters, reciprocal Analysis in six historical contexts, draft rejection |
| Season verification | Pass: all 67 pages, chronological index, 299 internal destinations, conditional sections and invalid routes |
| History Explorer | Pass: 16 eras, 234 existing routes, invalid routes |
| V2 exploration | Pass: 57 destinations (41 People, 10 Opposition, 6 Competition), 212 article panels, 336 linked routes, ordering/deduplication/canonical/404 checks |
| Connected History | Pass: existing Opinion URLs, canonical navigation, factual lists, related reading and missing routes |
| Homepage / This Week | Pass: existing destinations and nine weekly article cards |
| History publishing integration | Pass in disposable copy: real Markdown discovery, era associations, canonical URLs and factual separation |
| Interactive History | Pass: public content, guarded production preview, draft/unknown 404s |
| Diff/content safety | Pass: whitespace check; no Archive changes; eleven article bodies and existing fields preserved |

Invalid static History routes produce Next's `NoFallbackError` diagnostic in server stderr while the verification asserts and receives the correct HTTP 404. No runtime errors were observed on the browser-tested pages.

## Browser QA

Local production preview: `http://127.0.0.1:3155/match-centre`.

- Inspected Match Centre at 320, 390, 768 and 1280px widths. No horizontal page overflow; the five-column table remains within the viewport at 320px.
- Checked snapshot, both match cards, fixture chronology, unconfirmed Chelsea cup date, full table, Liverpool highlighting, current reading and missing optional content.
- Mobile top navigation measured 45.5px high; Article controls 44px. Keyboard activation/focus works; section anchors scroll correctly and subsequent Tab continues from the target section.
- Articles → Analysis empty state → back → All → forward → Analysis works normally. Opinion activation works with Enter.
- Match Centre → current Nyoni Opinion → Match Centre completed successfully on mobile. Existing article layout remains within the viewport.
- Desktop fixture hierarchy and tablet two-column match cards inspected visually.
- Browser warning/error log empty on the inspected production pages.
- Populated Analysis/report/briefing cases were verified through the disposable HTTP integration test; no fabricated article was added to the real collection for screenshots.

## Remaining limitations / review decisions

- This is editorially updated data, not live scores. Future fixture details can change; late results and the table require maintenance and a normal deployment. Sources and timestamps are visible. Refresh them before any eventual production release.
- The Chelsea fourth-round tie has a known week but no exact date/time; later cup rounds await their draws.
- No actual Analysis article, current-season factual report or Match Briefing was authored. The architecture is ready for approved content; those real-data optional sections remain absent until supplied.
- Existing broader ownership and multi-era retrospective Opinions are not automatically assigned to 2026–27.
- The separate unfinished Season → People follow-up remains untouched in the `connected-v2` worktree.

Technically ready for human product review. No remaining implementation blocker identified.
