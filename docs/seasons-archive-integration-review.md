# Seasons ↔ Archive integration review

Branch: `feature/seasons-archive-integration` (local feature branch; not pushed).
Base: `2ded3a1c1e18eb3427b6e3c60bc851a124a7b573`.
Review date: 13 September 2026.
This implementation is committed locally for review. Nothing has been merged or deployed; no remote pull request was opened. No merge or production deployment is authorised by this task.

## Existing integration and the gaps

Before this change, `getSeasonArchiveArticles` already selected the original Archive objects by their season metadata, deduplicated them by canonical slug, and omitted the section when empty. Individual Season pages already selected previous/next records from the chronological published collection. Routes and static parameters already came from that collection. No chronological fields or article lists were stored in season JSON.

Discovery already awarded five points for a shared season, excluded the current article and retained meaningful entity/era/theme relationships. History Explorer and This Week already used the same Archive collection. Season people and competitions already referenced the Discovery Engine's entity catalogue, including people on transfers/events and competition IDs on trophies/events. No catalogue, scoring or destination-page changes were necessary.

What was missing: Archive articles had no link to their structured Season page; Archive validation accepted alternate stored season spellings; navigation lacked focused rendering tests for gaps and data additions.

## Implementation

- Export the existing canonical season validation rule as `SeasonIdSchema` from `history.ts`, shared by both schemas.
- Add `getPublishedArchiveSeason` to the existing season module. It selects a matching published record, or returns undefined.
- Render a restrained `Explore 1987–88 →` link after the Archive article and before automatic related reading, only when the destination exists.
- Preserve the Season page's existing conditional article cards; rename the heading **From the Archive**.
- Extract the existing neighbouring-season markup into `SeasonNavigation` without changing its classes, URLs or two-column layout. It selects adjacent published records, skips gaps and omits an empty control for a lone or unknown record.
- Extend the existing Node test suite and HTTP verification scripts. Component tests compile JSX with the already installed TypeScript dependency and render real React/Next links; no new framework or dependency was added.

## Complete Archive metadata audit

All six Markdown articles in `content/archive/liverpool/` were read. Decisions below concern principal-season metadata, not a fresh factual review of their historical claims. No article prose, metadata or source lists were changed.

| Article file | Existing season | Decision and basis in the article |
| --- | --- | --- |
| `john-barnes-1987.md` | `1987-88` | Retain. Barnes's first campaign and Dalglish's rebuilt attack are the principal subject. |
| `liverpool-7-tottenham-0.md` | `1978-79` | Retain. The 2 September 1978 Tottenham match anchors the piece; reflections on Dalglish do not displace it. |
| `liverpool-9-crystal-palace-0.md` | `1989-90` | Retain. The 12 September 1989 match and Aldridge farewell are central; earlier and later seasons provide context. |
| `liverpool-sold-their-best-player.md` | `1977-78` | Retain. Keegan's replacement and the December 1977 Hamburg match supply the principal campaign. |
| `liverpools-manager-scored-after-21-seconds-at-goodison.md` | `1985-86` | Retain. The September 1985 derby and Dalglish's first player-manager campaign anchor the article. |
| `phil-thompson.md` | Omitted | Retain omission. This is a career piece spanning playing, coaching, management and broadcasting. Its opening 1981 event does not justify assigning the whole article to 1980–81. |

Articles receiving or changing `season`: **none**. All five existing assignments are canonical and meaningful; the career omission is intentional.

## Files created

- `app/components/ArchiveSeasonLink.tsx`
- `app/components/SeasonNavigation.tsx`
- `tests/season-integration.test.mjs`
- `docs/seasons-archive-integration-review.md`

## Files modified

- `app/archive/[slug]/page.tsx`
- `app/history/seasons/[season]/page.tsx`
- `lib/content/history.ts`
- `lib/content/seasons.ts`
- `lib/content/types.ts`
- `tests/history-relationships.test.mjs`
- `scripts/verify-connected-history.mjs`
- `scripts/verify-seasons.mjs`
- `docs/connected-history.md`
- `docs/seasons-publishing.md`

No content, entity catalogue, route definition, CSS, package or dependency-lock file was changed. Article and season content are byte-for-byte unchanged against the base commit. Existing Archive, Season, History Explorer, This Week and Opinion URLs remain unchanged.

## Publishing behaviour and validation

Publish an original Archive article once at its existing canonical Markdown location. During metadata review, identify its principal season where appropriate, store the consecutive `YYYY-YY` ID, and reuse meaningful person/manager/theme/competition IDs. Career and multi-season writing may omit `season`. Run the existing checks and review before normal publication.

At build time the article automatically joins that Season's Archive section, contributes its existing same-season Discovery score, and receives a return link if a Season record is available. No Season JSON edit or application-code change is required per article. A later Season record also enables waiting articles' return links and updates neighbouring-season navigation at the next build.

Both schemas reject malformed, non-consecutive and non-canonical IDs, including slashes, en dashes and four-digit ending years. `seasonKey` still normalises legacy values for existing utility callers; this does not permit non-canonical stored metadata. Existing filename/season and filename/slug identity checks, entity-kind checks and explicit `relatedSeasons` destination checks remain in force.

An Archive season reference need not have a published record. It remains valid metadata and can still strengthen Discovery; no missing destination URL is rendered. This is deliberately different from explicit `relatedSeasons`, which must exist. No automatic rule infers whether an article should have a season: that remains publishing metadata review.

## Verification results

- `npm test`: 78 passed, 0 failed. Includes middle/first/latest navigation, missing-season gaps, a real temporary JSON addition changing rendered navigation, conditional Archive return-link rendering, new Markdown metadata-only discovery, unavailable-season loading, career omission and canonical schema checks. Existing tests cover scoring, self-exclusion, filename identity, entity references, History Explorer and This Week.
- `npm run lint`: passed, no lint errors or warnings.
- `npm run build`: passed, including validation of 21 history entries, 360 entities, 16 eras, six Archive associations and 67 Season records, TypeScript checking and production prerendering.
- `node scripts/verify-seasons.mjs`: passed all 67 Season pages, chronological index, exact previous/next destinations, 91 internal destinations, source anchors, conditional Archive/competition sections and three invalid routes.
- `node scripts/verify-history-explorer.mjs`: passed the History landing, 16 era pages, two invalid routes and 29 existing routes.
- `node scripts/verify-connected-history.mjs` against the local production build: passed all six Archive pages and their available Season return links, related-reading behaviour, History Explorer, This Week, all 12 Opinion URLs, ten collection/navigation routes and two missing routes.
- `git diff --check`: passed. Content comparison against the base commit: no changes.

The first enhanced navigation HTTP assertion incorrectly depended on HTML attribute order. The assertion was corrected to identify the anchor by `rel` before reading its `href`; the complete Season verification then passed. The first standalone connected-history check could not reach a server in a separate execution environment; running server and verifier together passed. These were verification-harness issues, not product changes.

Existing Node module-format/npm environment advisories remain. Next logs `NoFallbackError` while the existing scripts deliberately request invalid routes; the expected 404 assertions pass. No unrelated framework/configuration changes were made to suppress these messages.

## Remaining limitations

- Connections update when the site is rebuilt and published, using the existing static publication workflow.
- Correct principal-season selection remains an editorial judgement. Validation verifies identity and structure, not historical truth.
- A valid season without a record intentionally has no clickable destination. Sparse seasons intentionally have no Archive section.
- Browser automation could not start in this execution environment. Mobile visual and keyboard inspection remains a review step; the existing responsive classes were preserved and actual rendered links were tested.
- No player, manager, competition or transfer destination pages were introduced.

## Exact review steps before merge

1. Check out `feature/seasons-archive-integration` and inspect its diff against the base/main. Confirm the file list above and that `git diff main -- content/archive content/history content/articles` is empty (account for any unrelated later main changes).
2. Review the six principal-season decisions above. Confirm that Phil Thompson remains unassigned and that no article prose has changed.
3. Run `npm test`, `npm run lint`, `npm run build`, `node scripts/verify-seasons.mjs` and `node scripts/verify-history-explorer.mjs`.
4. Start the local production build with `npm start -- --hostname 127.0.0.1 --port 3130`. In the same environment, run `BASE_URL=http://127.0.0.1:3130 node scripts/verify-connected-history.mjs`.
5. At `http://127.0.0.1:3130/history/seasons/1987-88`, follow the Barnes card under **From the Archive**, then use **Explore 1987–88** to return. Check that the original writing is still the dominant experience.
6. Inspect `/history/seasons/1959-60` (only next), `/history/seasons/1987-88` (both) and `/history/seasons/2025-26` (only previous). Confirm no empty Archive section on a season without matching writing. Missing/data-addition behaviour is exercised by isolated temporary fixtures in the test suite.
7. Check `/archive/phil-thompson` has no season link, while its related reading remains. Check `/history`, a managerial era, `/this-week`, and an Opinion article.
8. Repeat the changed controls at 375px width and desktop width; check wrapping, horizontal overflow, focus visibility and keyboard navigation. No mobile browser result is claimed by this report.
9. Obtain Denny's approval before merging. Production deployment remains a separate approved action; do not use earlier season-content publication authority for this feature.
