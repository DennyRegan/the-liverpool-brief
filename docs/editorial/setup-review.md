# Shared calendar setup review — 14 September 2026

Canonical operational location after review/merge: `docs/editorial/history-calendar.json` on main. Follow `docs/editorial/README.md`. Until it exists on main, the weekly task must stop before commissioning work. This review note is not a calendar or alternate queue.

## Reconciliation

- Retrieved main at `a657fd3`, AGENTS.md, CLAUDE.md, This Week/connected-history/seasons guides, content schemas, published Archive/event collections, pipeline drafts and editorial standards.
- Retrieved the live This Week page on 14 September: eight selected events and only two linked full reports. Source: https://theliverpoolbrief.com/this-week — High confidence for displayed inventory, not a new fact-check of historical detail.
- Retrieved all six completed current-week drafts and their editor notes; copied without rewriting into the recorded review paths. Two further completed drafts, Sheffield United on 23 September 1972 and Leeds on 30 September 1972, are preserved as alternatives, not replacements of existing selections. All eight copied texts compared equal to their retrieved originals apart from terminal whitespace. Original saved-file IDs remain in the calendar.
- Reconciled the classic-match progress file (`libfile_7daf9eb45c848191ad54fc730946ff74`), including overlapping undrafted candidates. High confidence for retrieved inventory only. Prior chat proposals and longlist historical claims remain explicitly UNVERIFIED pending research.
- Total: 31 rows, eight ready for review, three existing published destinations, 20 planned selections/proposals/alternatives. This is not 20 newly commissioned articles. The later weeks need research; no invented draft paths or approvals.
- Existing Goodison article is published but lacks factual editorial classification. Do not rewrite or reclassify without approval. The current-week draft editor notes list unresolved publishing metadata; keep these gates before publication.

## Branch and activation boundaries

Only open PR at inspection: #23, `feat/homepage-articles-history`. Its This Week page/component/loader diff against main is empty. Existing remote branch and commit inventory revealed no shared calendar or competing article-only implementation. The new calendar/workflow PR does not include the site display change; that work is a separate dependent review. No content file is published or altered by this setup. No PR is merged and no production release is requested.

The authoritative calendar belongs on main so editors can discover it through AGENTS.md, CLAUDE.md and the workflow guides. A review-branch copy is not activated. Exact activation step: approve and merge the calendar/workflow PR; confirm the main calendar is accessible. The weekly task then uses that same file. Article publication requires separate specific approval; the display needs its own review and release approval.

## Checks

Calendar validator passed for all 31 rows; the combined review work passed 89 tests, lint, and the production build (`npm run build -- --webpack`, using the available shared dependency directory). Webpack was used to support that local dependency arrangement; no bundler configuration changed. Focused calendar/article-week tests were rerun after the final test adjustment. These checks validate structure/behaviour, not historical truth.

Browser visual verification could not reach the local preview (`ERR_BLOCKED_BY_CLIENT`). Mobile visual inspection remains UNVERIFIED and is a display-review gate, not a claim that the live site is broken. Test coverage includes fixed week boundaries, UK Monday rollover, leap dates, duplicate links, missing/unreviewed/opinion articles and draft exclusion. React review retained server components, native links, labelled date sections and existing styles without adding client state or dependencies.

The local production-route check subsequently passed: two current-week article cards, both canonical destinations returned HTTP 200, and no separate source-only cards or duplicate Further reading list. A concurrent publication arrived on main as `2610485` (January 1971 Arsenal report); its content, entity addition and test update were reconciled into this review work without alteration. Its anniversary is outside this calendar window. This does not grant approval to any other article.
