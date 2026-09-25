# Paisley guided journey — review handover

25 September 2026. Review only; not approved for merge or production release.

## What changed

- Eight chronological chapters, approximately 1,642 words of chapter narrative,
  plus introduction and conclusion. The overview estimates eight minutes,
  excluding optional reading.
- Complete text on each chapter page. No need to open an article to understand
  the main story. The existing primary destination and two optional references
  give further depth; no original article was rewritten.
- Chapter contents, visible progress, previous/next navigation and bottom-of-page
  source disclosures. Optional reading opens in a clearly labelled new tab,
  retaining the current chapter. No accounts or saved-progress service.
- Stable named chapter URLs with eight explicit old-number redirects.
- Existing Dalglish, Everton and European Cup journeys retain their content and
  numbered pages. Shared presentation now distinguishes chapters from stops.
- Strict schema and tests for sources, migration targets, chapter uniqueness,
  complete narrative coverage and published factual reading references.

## Editorial material

The authoritative calendar row `1974-07-26-bob-paisley-guided-journey` is
`ready_for_review`, with no publication approval. Editorial-only main commit
`f10952bc20b5058cbac9b2d02ea0778c849fba1e` contains the completed drafts and calendar
status, not application or published content changes.

- Reader copy: `docs/editorial/drafts/bob-paisley-guided-journey.md`.
- Structured draft: `docs/editorial/drafts/bob-paisley-guided-journey.json`.
- Evidence: `docs/editorial/drafts/bob-paisley-guided-journey-evidence.md`.

The evidence file records the explicitly selected Astra worker, all 35 retrieved
sources, source-specific confidence and scopes, conflicts and exclusions.
Those notes do not render publicly. Proposed narrative JSON is staged in the
existing journey directory only on the review branch. Existing Archive URLs,
article prose, entity IDs and Season records are untouched.

## Verification

| Check | Result |
| --- | --- |
| Calendar validation | Pass: 239 rows |
| Unit tests | Pass: 172 tests |
| Lint | No errors; one pre-existing unused-variable warning in `tests/interactive-history-rendering.test.mjs` |
| Production build | Pass: 453 generated pages |
| Journey production-response checks | Pass: four journeys, 32 reader pages, eight 308 redirects, 86 URLs |
| Prose and sources | Every chapter paragraph and source link found in server-rendered HTML |
| Reading boundary | Canonical references resolve; linked articles factual; unpublished draft article URL returns 404 |
| Invalid URLs | Unknown chapter/journey, malformed numbers and out-of-range steps return 404 |
| Full existing V3 verifier | Stops at its existing `No competing Seasons entry` assertion; current History gateway already links to Seasons. The gateway was not changed by this work. Do not report this suite as passed. |
| Browser/mobile/keyboard visual check | **Not completed**: browser installer failed (certificate error; alternate installer returned an invalid archive). No screenshot or visual sign-off claimed. |

Reproduce the targeted production checks with `npm run build` then
`node scripts/verify-journey-preview.mjs`. The script starts and stops its own
loopback server, avoiding reliance on a separate long-running terminal. It makes
no deployment or external writes. `scripts/verify-journey-pages.mjs` can also
target a running preview using `BASE_URL`.

Before release, review the eight chapters and inspect the overview, first and
last chapters at 375px and desktop width. Open contents and sources with the
keyboard; follow next/previous and optional reading; confirm the original
chapter stays open. Confirm old `/6` redirects to the Paris chapter, not the
sixth item by coincidence. Production publication still needs Denny's explicit
approval, a fresh main reconciliation and the normal release checks.
