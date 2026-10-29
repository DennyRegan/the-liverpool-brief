# Classic Matches final refinements

Local approval preview only. No commit, merge, deployment or publication.

[Open Classic Matches](http://127.0.0.1:3147/history/matches).

## Changes

- Reduced the title, introduction and results-summary spacing specifically on Classic Matches. Other History categories and Seasons are unchanged.
- Desktop filters share one compact row at wide widths; mobile has a labelled Filter matches toggle, with a two-column form when expanded. Native labels, keyboard controls, 44-pixel targets, visible active-filter links and Clear all are retained. Clearing one filter preserves the others and returns to the first results page. A no-JavaScript fallback exposes the form on mobile.
- Added a small Featured Classic Matches row using only the approved, event-verified Forest 5–0 article. No new summaries, invented fixture facts or private candidates. Existing canonical article text/URL supplies the card. The chronological collection remains complete.
- Editorial selection is an ordered list of up to three unique slugs in the existing content/history directory. Resolution requires both current factual publication and matching event verification. No automated promotion, data service or dependency was added. Empty or ineligible selections render no feature.
- Features are omitted while filters are active or readers move beyond page one. The existing 560 reports, 58 seasons, twelve-item pagination and 1987–88 experience remain intact. All 558 unapproved reports remain behind the local flag/loopback guard.

## Verification

Final results and desktop/mobile screenshots are recorded below after the browser checks. Automated tests cover removal of approval or verification, absent/private selections, the three-item limit and duplicate rejection, alongside all existing collection protections.

### Final results

- 55 tests passed. Lint, History validation, prototype validation, full match-collection validation, normal production build and local-preview production build passed.
- Review-mode HTTP verification: 761 match checks and 143 History routes passed. Normal mode: 575 match checks and 38 History routes passed. Every canonical report reader, collection pagination, active-filter removal URLs, verified featured link, feed exclusion and foreign-host guard were checked. All 558 unapproved readers returned 404 in normal mode.
- Browser: desktop 1280px, mobile 390px and 320px; no horizontal overflow. Enter opens the mobile filters; Tab then focuses Season. Combined season/decade filtering, removing one filter while retaining another, pagination with retained filters, Clear all and clicking the featured canonical article all worked. The mobile disclosure collapses again after applying filters while active filters remain visible. No browser console errors were recorded.
- The first chronological entry begins approximately 755px from the document top at 1280px desktop, below a compact featured story. No other category layout was changed.
- Five local response samples: review 39–70ms (123,907 HTML bytes), normal 12–16ms (23,725 HTML bytes). These are local server-response checks, not production/Core Web Vitals measurements. Only the filter toggle is newly hydrated; features and stories remain server-rendered. No new dependencies or network services.
- Existing non-blocking Node module-type warning remains. No commit, merge, deployment or publication.

[Desktop screenshot](../../output/classic-matches-final-review-2026-10-29/desktop.jpg) · [Mobile screenshot](../../output/classic-matches-final-review-2026-10-29/mobile.jpg) · [Expanded mobile controls](../../output/classic-matches-final-review-2026-10-29/mobile-filters-expanded.jpg). Logs are saved alongside these previews. The approval server remains on port 3147; the normal verification server was stopped.
