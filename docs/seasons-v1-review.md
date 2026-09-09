# Seasons V1 — editorial and implementation review

Ready for review on branch `feature/history-seasons-v1`, based on main commit `2e3bfd8`. Nothing has been merged, pushed or deployed. The local preview is at [History → Seasons](http://127.0.0.1:3140/history/seasons).

Seasons adds a chronological index and ten permanent reference pages, from 1959–60 to 1968–69. History Explorer remains available through its existing URL and all sixteen era pages. Both areas now share a clear History navigation switch. Each season has structured facts, its own narrative, significant transfers, relevant people and events, related seasons, and expandable sources and historical notes. The pages identify the work as historical reference material and distinguish it from the editor’s original Archive writing.

## Routes

The landing page is `/history/seasons`. Individual pages follow `/history/seasons/{season}`:

| Season | Permanent route | League finish | Leading competitive scorer |
| --- | --- | --- | --- |
| 1959–60 | `/history/seasons/1959-60` | Second Division, 3rd | Roger Hunt, 23 |
| 1960–61 | `/history/seasons/1960-61` | Second Division, 3rd | Kevin Lewis, 22 |
| 1961–62 | `/history/seasons/1961-62` | Second Division champions | Roger Hunt, 42 |
| 1962–63 | `/history/seasons/1962-63` | First Division, 8th | Roger Hunt, 26 |
| 1963–64 | `/history/seasons/1963-64` | First Division champions | Roger Hunt, 33 |
| 1964–65 | `/history/seasons/1964-65` | First Division, 7th | Roger Hunt, 37 |
| 1965–66 | `/history/seasons/1965-66` | First Division champions | Roger Hunt, 32 |
| 1966–67 | `/history/seasons/1966-67` | First Division, 5th | Roger Hunt, 19 |
| 1967–68 | `/history/seasons/1967-68` | First Division, 3rd | Roger Hunt, 30 |
| 1968–69 | `/history/seasons/1968-69` | First Division, 2nd | Roger Hunt, 17 |

Each row is supported by that season’s retrieved sources and the separate research audits below. Unpublished and malformed season URLs return 404. Existing `/archive/seasons` remains the Archive’s original article category; it is not replaced by this reference collection.

## Architecture and decisions for review

There is one JSON record per season in the existing History content tree. A strict Zod schema validates required facts, consecutive season IDs, dates, source references, canonical entity kinds, duplicates, related-season targets and agreement between a league title and first place. The normal build runs this validation before rendering.

The existing entity registry now contains 72 identities: its original fourteen are preserved, with 58 necessary people and competitions added. No separate person or competition registry was introduced. Manager IDs, league position, top scorers, transfers, key players, trophies and event relationships are queryable fields. Narrative paragraphs remain separate from those fields. Source confidence and claim scope are recorded internally alongside each retrieved URL.

The pages are server-rendered components, generated statically at build time. Adding a researched JSON record makes it appear automatically in the index and neighbouring-season navigation. No database, API, dependency or client-side state was added. The tests preserve the initial ten-season baseline while allowing subsequent seasons and Archive articles.

Please review these editorial conventions before publication:

- Top-scorer totals include every competitive first-team match, including the Charity Shield when entered. Shared Shields are explicitly labelled shared and appear in the trophy list.
- Preparatory summer moves belong with the coming campaign. St John’s 2 May 1961 signing is allocated to 1961–62 despite one previous-season fixture remaining; his competitive Liverpool debut was in August. The publishing guide explains this and other boundary decisions.
- Key-player and transfer lists use season-specific importance, not a quota or a complete youth/reserve register. Historically significant external recruits can appear as arrivals before making a first-team appearance.
- Links to Explorer eras reuse their existing tenure dates with July–June overlap. Explicit manager IDs remain authoritative for who managed the season; this avoids deriving a manager from a player’s name. Future handover seasons can link to more than one era.
- Related Archive is selected automatically by normalised `season` metadata and links to the original article URL. No existing Archive article covers these first ten seasons, so their reading blocks are omitted. Fixture tests verify matching, deduplication and preservation of the original article object; a real existing 1978–79 Archive article verifies the same selector. No article body is copied.
- The existing History source disclosure design is reused. Internal confidence grades remain in the data and QA records; published readers see the references, claim scopes and uncertainty notes.

See [the publishing guide](seasons-publishing.md) for the full data and review workflow.

## Research and uncertainties

All ten seasons were researched individually using retrieved official club material, LFChistory, RSSSF, 11v11, Football Club History Database and relevant contemporary newspaper transcriptions. Each batch was then independently reviewed by another researcher. League outcomes, scorer totals and definitions, competition entry and exits, trophies, transfers, player involvement, important dates and chronology were checked. No season relies on model memory or Wikipedia alone.

The independent pass corrected three venue errors in early drafts and several overly broad or incorrect source references. Those corrections are incorporated in the final files. It also corrected a newspaper attribution from Daily Mirror to Daily Express for the Furnell report. Each correction is traceable in the cross-review records.

Meaningful remaining uncertainties are explicitly preserved:

| Issue | Published treatment |
| --- | --- |
| 1959 caretaker between Taylor and Shankly | The interval is explained; no unverified individual is assigned as caretaker. Appointment announcement, arrival and first match remain distinct dates. |
| Sammy Reid’s fee: Free, £6,000 or £8,000 | Fee omitted; historically significant first-signing status retained. |
| Kevin Lewis’s incoming fee: £13,000 or about £15,000 | Fee omitted. |
| Jim Furnell’s Burnley fee: £18,000 or £15,000; later Arsenal fee: £15,000 or £16,000 | Both disputed amounts omitted from the respective transfers. |
| John Ogston’s September 1965 move: date and £10,000/£12,000 fee differ | Month, clubs and permanent transfer retained; exact day and fee omitted. |
| Ray Clemence’s June 1967 arrival: 12, 21 or 24 June in different accounts | Summer 1967 and the corroborated £18,000 fee retained; exact day omitted. |
| Hunt’s 1965–66 goal attribution and later scoring milestones | Corrected 29 league/32 competitive goals used. The 1967 overall-record event says November rather than selecting a disputed match; the independently supported February 1969 league-record event is dated. |
| Other peripheral transfer fees, exact signing days and formal retirement dates | Unestablished details are omitted or qualified in the relevant season’s notes; known moves and playing contributions remain. |

The underlying [Hunt correction](https://www.lfchistory.net/articles/3453) explains the historical goal reattribution; [Liverpool FC’s 30-goal record](https://www.liverpoolfc.com/news/announcements/290697-lfc-s-30-goal-club-roger-hunt) independently supports the published totals for the relevant high-scoring seasons.

Source quality is strong for every season’s main outcomes. Evidence is less precise for some 1959–63 peripheral fees and formal retirement dates, Ogston’s 1965 arrival, and Clemence’s 1967 signing day. These limits do not affect the published league finishes or leading-scorer totals. A consistent specialist register is sometimes the best available evidence for a minor fee; the audit does not claim two independent fee documents exist for every move.

The final source-link audit checked 162 distinct published URLs: 157 returned HTTP 200 with relevant pages, and five restricted direct automated access (Falkirk and four 11v11 tables). Their contents were retrieved successfully during research through the web tool; the access restriction is recorded rather than described as a missing page. Obsolete Liverpool subdomain links that redirected to the homepage were replaced or removed. No known homepage redirect remains in the published source set.

## Verification results

- **69 automated tests passed**, including the existing 61 tests and eight new season/data/Archive integration tests.
- **Lint passed.** TypeScript passed separately during implementation and in the final build.
- **Final production build passed:** ten season records, 72 entities, sixteen managerial eras and three existing Archive associations validated; all ten season pages generated.
- **Season HTTP checks passed:** chronological landing page, all ten permanent pages, fourteen internal destinations, canonical URLs, source anchors, relevant-only competition sections, neighbouring links and three invalid routes.
- **Existing-site regression passed:** all sixteen Explorer era pages and 25 existing site routes; no homepage content-layout regression.
- **Connected History regression passed:** all three Archive articles and their six recommendations, all eleven Opinion URLs, This Week’s current Archive connection and existing collection/navigation routes.
- **Browser checks passed:** all ten season pages at 390px, additional 320px and 1280px checks, seventeen layout checks in total. No horizontal overflow, missing images, blank pages or error overlays. Transfer lists, long summaries, source disclosure and Explorer/Seasons switching were exercised. At 320px the final season’s 24 source links remained within the viewport, with a minimum 44px source-link target height. No browser errors were recorded on valid pages.
- **Existing content preservation checked against the branch base:** Archive and Opinion Markdown, Brief content, History eras/events, shared article loaders, discovery logic and package files were not changed. Only the shared entity registry was extended within existing content files.

The test logs include the repository’s existing Node module-type warning. Deliberate unknown static routes also produce Next.js `NoFallbackError` server diagnostics while correctly returning HTTP 404; the same behaviour appears in the unchanged Explorer checks. Neither affected valid pages or the successful build.

## Files

Created implementation and checks:

- `app/components/history/HistoryNav.tsx`
- `app/history/seasons/page.tsx`
- `app/history/seasons/[season]/page.tsx`
- `lib/content/seasons.ts`
- `tests/seasons.test.mjs`
- `scripts/verify-seasons.mjs`

Created season data under `content/history/liverpool/seasons/`:

- `1959-60.json`, `1960-61.json`, `1961-62.json`, `1962-63.json`, `1963-64.json`
- `1964-65.json`, `1965-66.json`, `1966-67.json`, `1967-68.json`, `1968-69.json`

Created documentation and research:

- `docs/seasons-publishing.md`
- `docs/seasons-v1-review.md` (this report)
- `docs/research/seasons-1959-1962.md`
- `docs/research/seasons-1963-1965.md`
- `docs/research/seasons-1966-1968.md`
- `docs/research/seasons-cross-review-1959-1962.md`
- `docs/research/seasons-cross-review-1963-1965.md`
- `docs/research/seasons-cross-review-1966-1968.md`

Modified existing files:

- `app/history/page.tsx` — adds the shared History switch.
- `app/history/[era]/page.tsx` — adds the same switch to era pages.
- `app/history/history.css` — adds responsive Seasons styles using existing colours, fonts and source patterns.
- `content/history/liverpool/entities.json` — extends the canonical registry.
- `scripts/validate-history.mjs` — validates seasons during the existing build process.

## Local review

Open [the Seasons preview](http://127.0.0.1:3140/history/seasons). Start with [1959–60](http://127.0.0.1:3140/history/seasons/1959-60), [1964–65](http://127.0.0.1:3140/history/seasons/1964-65) and [1968–69](http://127.0.0.1:3140/history/seasons/1968-69). Expand Sources & historical notes, follow neighbouring seasons, and switch back to History Explorer. The feature has no public preview deployment.

If the local server has stopped, open this repository on `feature/history-seasons-v1`, run `npm run build`, then `npm start -- --hostname 127.0.0.1 --port 3140`. This starts a local review server and does not deploy anything.

Screenshots, source-link status and test/build/browser logs are saved in the enclosing project’s `output/seasons-v1/` folder. The repository retains the publishing guide and six source/review audits for future maintenance. Editorial approval is still required before merge or deployment.
