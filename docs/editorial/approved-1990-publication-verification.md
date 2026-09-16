# Approved 1989–90 publication verification — 16 September 2026

Denny explicitly approved only these three articles in the current task:

- `/archive/coventry-liverpool-1990-barnes-hat-trick`
- `/archive/liverpool-qpr-1990-eighteenth-title`
- `/archive/palace-liverpool-1990-semi-final`

## Observed release state

All three already returned HTTP 200 before this release. The later production deployment `dpl_Gfbs2Q1HWx9Yc9Kamhx8EwzTnPkF`, from main `9cc5e362f642a973e040c15850f7b781867d377e`, includes the content that was unavailable at the previous audit. The calendar's pending-deployment notes were stale. Only these three calendar rows are reconciled to published, with the user's explicit approval recorded. Previous notes are retained as provenance and explicitly superseded.

All three canonical article files remain byte-for-byte unchanged, including publication dates, prose, sources, frontmatter and URLs. Their historical event dates are 5 May, 28 April and 8 April 1990 respectively; each already has `season: "1989-90"`, `articleType: "match"` and `editorialMode: "factual"`.

No content files, routes, loaders or publication membership are changed relative to the observed live main commit. The broader metadata audit and six separate classification edits remain outside this release. The Torres 2008 derby remains solely in `docs/editorial/drafts`; its canonical URL returned 404. All other calendar rows, including Torres, are unchanged.

## Required checks

- Calendar validation: 215 entries passed.
- Full tests: 123 passed, zero failures.
- Lint: passed.
- Production build: passed, including history and Interactive History validation.
- Seasons HTTP verification: 67 pages, 295 internal destinations, previous/next navigation, conditional sections and three invalid routes passed.
- History Explorer: 16 eras, 230 existing routes and two invalid routes passed.
- This Week: nine article cards and canonical links passed.
- Connected History: all 212 Archive articles, Season return links, related reading, factual browser selections, 16 eras, 13 Opinion URLs and existing collections passed.
- Interactive History: the existing public experience, conditional discovery and production draft-route exclusions passed.
- File-boundary check: no changes under content, app or lib; only the approved calendar rows differ. Torres is absent from the public Archive directory.

The existing Connected History verifier was corrected to use the implemented article-only This Week selection, browser ordering, homepage writing section and subject-appropriate return links. These are verification changes only; no reader-facing behaviour was altered. Existing non-fatal module-format notices and expected invalid-route server diagnostics remain.

The normal main-branch Git deployment will carry the reconciled publication records. No additional article is introduced by this release.
