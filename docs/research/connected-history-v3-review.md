# Connected History V3 — implementation and review report

17 September 2026. **Technically ready for human product review. Not merged, pushed or deployed.**

## 1. Branch

`feature/connected-history-v3`, in the isolated `connected-v3` worktree. Base: reviewed current main `c0df9d93d5dd0bfbbb67a4fb8cbbc3f74c47674b`, including V2, Match Centre and the approved Newcastle report. The unfinished Season → People work in the separate V2 worktree was not included.

## 2. Commit

This report is included in the V3 implementation commit. Its exact SHA is supplied in the final chat handover and is available with `git log -1 --format=%H` on this branch.

## 3. Architecture

Server-derived projections over canonical factual articles, Seasons, eras and V2 entities. Four small JSON files define editorial journeys by references only. Server components render the views; React render-scoped caching shares loaded data. No new content database, reverse lists, client state, account, search, AI or recommendation service. Architecture details are maintained in [Connected History](../connected-history.md#v3-interactive-exploration).

## 4. Route structure

Existing routes and canonical tags remain intact. Added:

- `/history/timeline`, with `decade`, `season` and `#year-YYYY`.
- `/history/journeys`.
- `/history/journeys/[journey]`.
- `/history/journeys/[journey]/[step]`.
- `/history/my-years?from=YYYY`.

History retains its 16 managerial cards and anchors, while adding nine direct entry choices and four featured journeys. V2 still has 41 People, 10 Opposition and **7** Competition destinations on this main snapshot, derived by unchanged thresholds.

## 5. Timeline behaviour

Vertical calendar years; Season records are period context, followed by writing, dated structured events and era starts. Historical event dates drive ordering, never publication dates. The one undated Season event is clearly labelled rather than assigned a date. Summer events retain their actual date and editorial Season association. Filter values intersect, unknown values recover visibly, year fragments resolve, and native disclosures open without JavaScript. Only available years appear; sparse periods stay sparse.

A career-wide biography without a principal Season is not represented as a single-day event. Phil Thompson therefore remains in V2 but is excluded from timeline chronology. An original article and a separate canonical Season event may concern the same occurrence; these are labelled distinctly. Articles themselves are not duplicated.

## 6. Current timeline size

**69 calendar-year sections, 362 entries:** 208 factual articles, 67 Season references, 71 structured Season events and 16 era starts. The canonical factual Archive contains 209 articles; one career-wide biography is omitted as explained above. The full Archive contains 211 articles, including two classified Opinion pieces excluded from V3.

## 7. Initial journey choices

| Journey | Supporting factual articles on its V2 destination | Stops | Rationale |
| --- | ---: | ---: | --- |
| Kenny Dalglish: player to manager | 44 | 9 | Strong published coverage across his arrival, European success and first managerial seasons. |
| Liverpool and the European Cup | 38 | 8 | Existing early European writing and four final accounts, ending at the canonical 2004–05 Season. |
| Bob Paisley’s Liverpool | 17 | 8 | Published match reports and Season records support the tenure from 1974 to his farewell. |
| Liverpool and Everton | 32 | 7 | Several substantial derby accounts and the Double-season reference support a coherent short route. |

These are curated routes, not algorithmic ranking or new historical articles. Titles and excerpts on each step come from the canonical destination.

## 8. Every journey step

### Bob Paisley’s Liverpool

Route: `/history/journeys/bob-paisleys-liverpool`

| Step | Canonical title | Destination |
| ---: | --- | --- |
| 1 | Bob Paisley | `/history/people/bob-paisley` |
| 2 | Bob Paisley | `/history/bob-paisley` |
| 3 | Liverpool 1–1 Leeds United: a Wembley Shield decided on penalties | `/archive/liverpool-leeds-1974-charity-shield` |
| 4 | 1975–76 | `/history/seasons/1975-76` |
| 5 | Liverpool 3–1 Borussia Mönchengladbach: the first European Cup | `/archive/liverpool-gladbach-1977-first-european-cup` |
| 6 | Liverpool 1–0 Real Madrid: Alan Kennedy wins the third European Cup | `/archive/liverpool-real-madrid-1981-third-european-cup` |
| 7 | 1982–83 | `/history/seasons/1982-83` |
| 8 | Liverpool 1–1 Aston Villa: Johnston rescues Paisley’s Anfield farewell | `/archive/liverpool-aston-villa-1983-paisley-anfield-farewell` |

### Kenny Dalglish: player to manager

Route: `/history/journeys/dalglish-player-to-manager`

| Step | Canonical title | Destination |
| ---: | --- | --- |
| 1 | Kenny Dalglish | `/history/people/kenny-dalglish` |
| 2 | Middlesbrough 1–1 Liverpool: Dalglish scores on his league debut | `/archive/middlesbrough-liverpool-1977-dalglish-league-debut` |
| 3 | Liverpool 1–0 Club Brugge: Dalglish keeps the European Cup at Anfield | `/archive/liverpool-brugge-1978-european-cup-final` |
| 4 | Kenny Dalglish | `/history/kenny-dalglish-1985-1991` |
| 5 | Liverpool 2–0 Arsenal: Dalglish's first competitive match in charge | `/archive/liverpool-arsenal-1985-dalglish-first-competitive-match` |
| 6 | Dalglish scores the goal that brings Liverpool the title | `/archive/chelsea-liverpool-1986-dalglish-title-winner` |
| 7 | 1985–86 | `/history/seasons/1985-86` |
| 8 | John Barnes and the attack Dalglish built without Ian Rush | `/archive/john-barnes-1987` |
| 9 | 1987–88 | `/history/seasons/1987-88` |

### Liverpool and Everton

Route: `/history/journeys/liverpool-and-everton`

| Step | Canonical title | Destination |
| ---: | --- | --- |
| 1 | Everton | `/history/opposition/everton` |
| 2 | Liverpool 3–2 Everton: Heighway starts the comeback | `/archive/liverpool-everton-comeback-1970` |
| 3 | Everton 0–5 Liverpool: Rush scores four at Goodison | `/archive/everton-liverpool-1982-rush-four` |
| 4 | Liverpool 1–0 Everton: Souness secures a fourth League Cup | `/archive/liverpool-everton-1984-souness-replay-winner` |
| 5 | 1985–86 | `/history/seasons/1985-86` |
| 6 | Rush and Mølby lead Liverpool to the Double | `/archive/liverpool-everton-1986-rush-double-wembley` |
| 7 | Liverpool 3–2 Everton: Rush settles the final in extra time | `/archive/liverpool-everton-1989-rush-extra-time-double` |

### Liverpool and the European Cup

Route: `/history/journeys/liverpool-and-the-european-cup`

| Step | Canonical title | Destination |
| ---: | --- | --- |
| 1 | European Cup | `/history/competitions/european-cup` |
| 2 | Six goals on Anfield’s first European night | `/archive/anfield-first-european-match-reykjavik-1964` |
| 3 | Liverpool 3–1 Saint-Étienne: Fairclough finds the goal Anfield needs | `/archive/liverpool-saint-etienne-1977-fairclough-winner` |
| 4 | Liverpool 3–1 Borussia Mönchengladbach: the first European Cup | `/archive/liverpool-gladbach-1977-first-european-cup` |
| 5 | Liverpool 1–0 Club Brugge: Dalglish keeps the European Cup at Anfield | `/archive/liverpool-brugge-1978-european-cup-final` |
| 6 | Liverpool 1–0 Real Madrid: Alan Kennedy wins the third European Cup | `/archive/liverpool-real-madrid-1981-third-european-cup` |
| 7 | Liverpool 1–1 Roma: Kennedy’s penalty completes the treble | `/archive/liverpool-roma-1984-kennedy-penalty` |
| 8 | 2004–05 | `/history/seasons/2004-05` |

## 9. Your Liverpool Years

A labelled starting-year selector, URL state and a “Just let me explore” exit. The main sequence contains calendar years and principal Seasons beginning at or after the selection. Earlier Season material does not leak into that sequence. Optional context may lead to earlier history deliberately. No personal details or storage are collected by this feature.

All requested starts were checked in tests, HTTP verification and the browser: 1965 (62 sections), 1974 (53), 1977 (50), 1985 (42), 1990 (37), 2005 (22), 2015 (12). Each starts at the selected calendar year and retains real data only.

## 10. V2 → V3 integration

History navigation exposes Timeline, Guided Journeys and Your Liverpool Years. A maximum-three-link Continue from here panel appears on People, Opposition, Competition, Season, era and factual Archive destinations. Direct journey membership takes priority. Entity suggestions require at least two shared factual articles; Season suggestions reuse manager/key-player IDs. Existing Related Reading, Explore This History, source disclosures, Season neighbours and article ordering remain unchanged.

## 11. V3 → V2 integration

Timeline articles, Season context, structured-event anchors, People/Competition/Opposition links and era starts use existing routes. Every guided stop opens its canonical destination. Reader next/previous, exits and normal browser history work without saved progress. Some useful routes need an intermediate canonical page: for example, Rome 1977 → 1976–77 → Paisley, because V3 does not invent missing article metadata.

## 12. Files created

- `app/components/history/V3Exploration.tsx`
- `app/history/journeys/[journey]/[step]/page.tsx`
- `app/history/journeys/[journey]/page.tsx`
- `app/history/journeys/page.tsx`
- `app/history/my-years/page.tsx`
- `app/history/timeline/page.tsx`
- `content/history/liverpool/journeys/bob-paisleys-liverpool.json`
- `content/history/liverpool/journeys/dalglish-player-to-manager.json`
- `content/history/liverpool/journeys/liverpool-and-everton.json`
- `content/history/liverpool/journeys/liverpool-and-the-european-cup.json`
- `lib/content/history-v3-view.ts`
- `lib/content/history-v3.ts`
- `scripts/verify-history-v3.mjs`
- `tests/history-v3.test.mjs`
- `docs/research/connected-history-v3-review.md` (this report).

## 13. Files modified

- `app/archive/[slug]/page.tsx`
- `app/components/history/EntityExploration.tsx`
- `app/components/history/HistoryNav.tsx`
- `app/globals.css`
- `app/history/[era]/page.tsx`
- `app/history/history.css`
- `app/history/page.tsx`
- `app/history/seasons/[season]/page.tsx`
- `docs/connected-history.md`
- `scripts/validate-history.mjs`
- `scripts/verify-exploration.mjs`
- `scripts/verify-interactive-history-browser-edges.mjs`
- `scripts/verify-interactive-history-browser.mjs`

The two legacy Interactive History browser scripts only received test-harness corrections. No Interactive History product component changed. Dependencies were installed in `/tmp/v3-browser-tools`; package.json and package-lock.json remain unchanged.

## 14. Tests added

14 V3 unit tests cover canonical projection, factual boundaries, historical sorting independent of publication dates, summer/undated chronology, sparse filters, all seven selected years, deterministic journey resolution, invalid/Opinion/draft/ineligible references, strict schema and duplicate rejection, bounded continuations, direct journey priority and automatic growth without altering editorial steps.

The new HTTP verifier checks every entry/context/continuation/fragment target, all four journey indices and 32 steps, heading hierarchy, seven year views, filter recovery and excluded routes. It makes 403 unique URL checks. Existing V2 verification retains exact article ordering and duplicate suppression assertions.

## 15. Full test result

`npm test`: **158 passed, 0 failed, 0 skipped** after final changes. No article fixtures were written into the live content tree. Existing publishing integration tests use disposable copies.

## 16. Lint

`npm run lint`: **passed**, no errors or warnings.

## 17. Production build

`npm run build`: **passed**, including TypeScript, content validation and 423 generated pages. It validates 506 canonical entities, 16 eras, 67 Seasons, 215 editorial calendar entries, one published interactive experience, 13 Opinion/Analysis articles, the current Match Centre and all four journeys.

Existing non-fatal diagnostics: Node's module-type warning; the 1925 Forshaw article predates the modern managerial guide and has no era association. The invalid-route tests can produce Next's `NoFallbackError` server diagnostic while correctly returning HTTP 404. None was suppressed or turned into a false pass.

## 18. History/Season and browser verifier results

All ran against the final production build, or their own disposable test servers:

| Script | Result |
| --- | --- |
| `verify-seasons.mjs` | PASS: 67 pages, 311 internal destinations, chronology, anchors, conditional sections and 3 invalid routes. |
| `verify-history-explorer.mjs` | PASS: landing, 16 eras, 233 existing routes and 2 invalid routes. |
| `verify-connected-history.mjs` | PASS: factual browsers, canonical Archive, Season connections, Related Reading, Opinion separation and existing collections. |
| `verify-exploration.mjs` | PASS: 58 entities, 211 article panels, 345 linked routes, exact ordering/deduplication and 8 exclusions. |
| `verify-article-week.mjs` | PASS: 9 current cards and canonical destinations. |
| `verify-homepage.mjs` | PASS: lead, Brief, mixed History, weekly feature and destinations. |
| `verify-interactive-history.mjs` | PASS: public experience, preview guard, discovery and 404s. |
| `verify-history-publishing.mjs` | PASS: real Markdown publication in a disposable copy, multi-era placement and separation. |
| `verify-match-centre.mjs` | PASS: real fixture/report/Analysis integration in a disposable copy; draft exclusion. |
| `verify-history-v3.mjs` | PASS: 403 URL checks, all timeline and journey references, seven year starts and publication boundaries. |
| `verify-interactive-history-browser.mjs` | PASS: 14 browser check groups, zero captured application errors, zero scoped Axe A/AA violations. |
| `verify-interactive-history-browser-edges.mjs` | PASS: 12 check groups including passive reading-mode scroll, deep links, clipboard fallback and delayed hydration; zero scoped Axe violations. |

Failures investigated and fixed: journey index cards skipped from h1 to h3 (now h2; landing cards remain h3 beneath their h2); a direct entity's journey could lose priority to incidental article overlap (now direct membership first); legacy V2 verifier printed a stale article count (now derives it). The optional browser harness expected a Vercel-only analytics resource on localhost (now stubs only that exact local platform endpoint), expected passive scroll in moment mode (now explicitly selects existing full-story mode), and asserted the short-viewport state before ResizeObserver applied it (now waits for the actual condition). Application errors remain fatal. No product behaviour was changed to satisfy these old tests.

## 19. Browser QA and ten complete exploration journeys

In-app browser, local production build. Each sequence below was followed through the interface, using links, disclosure controls and keyboard activation, with destination and layout checks. Browser tool batches that timed out were resumed and the affected paths verified; tool timeouts were not treated as application passes.

1. History → People → Kenny Dalglish → 1977–78 → 1978 Brugge final → European Cup → 1977 Rome final.
2. History → People → Ian Rush → 1982–83 → Everton 0–5 Liverpool → Everton.
3. History → Opposition → Everton → 1986 Wembley Double article → Ian Rush → 1983–84.
4. Timeline 1970s/year 1977 → Rome final → 1976–77 → Bob Paisley → 1975–76.
5. Competitions → European Cup → 1980–81 → Real Madrid final → Alan Kennedy.
6. Your Liverpool Years form, 1985 → 1985–86 → Kenny Dalglish → Chelsea title-winning goal article.
7. History Matches → Real Madrid 1981 final → Explore This History/Bob Paisley → First Division.
8. 1987–88 → John Barnes article → Continue from here/1980s timeline at 1987.
9. Bob Paisley era → Continue from here/1974–75 → Bob Paisley People destination → 1974 Charity Shield article.
10. European Cup guided journey, step 6 → original Real Madrid final article → Alan Kennedy → 1980–81, leaving the journey naturally.

All four curated journeys were traversed in order through all 32 numbered pages. Canonical stops and every step's context links were exhaustively HTTP-checked; browser checks also opened canonical stops and returned with Back. Back/forward restores ordinary destinations and native query-filter URLs. No broken-link dead end or draft exposure was found.

## 20. Mobile, tablet and desktop

36 route/width combinations passed overflow checks: nine representative routes at 320, 390, 768 and 1280px. Routes: History, filtered Timeline, Journey index, a Paisley reader step, Your Years 1985, Dalglish, Everton, European Cup and 1987–88. Additional browser traversals covered every journey and all requested year starts. Visual screenshots were inspected for the mobile gateway, narrow Timeline controls, narrow reader, tablet cards and desktop chronology/Season page.

Vertical flow, wrapped navigation, stacked mobile controls and readable card/reader layouts remained usable. The existing masthead and section navigation occupy considerable space on narrow screens; this is a product-review consideration, not clipping or horizontal overflow. No hover/drag-only control was introduced.

## 21. Accessibility

Labelled native selectors, semantic year headings and lists, native details/summary, real links, 44–48px standalone targets and visible focus outlines. Tab traversal and Enter activation were exercised through filters, cards, reader controls and V2 links. The corrected index hierarchy is h1 → h2, while the landing uses h2 → h3 cards. No animation or colour-only selection dependency. Automated Axe results above apply to the existing Interactive History experience, **not a claimed full-site accessibility certification**. V3 received direct DOM, keyboard, target-size and visual checks; assistive-technology user review remains valuable.

## 22. Performance

No added client component, localStorage, runtime API or heavy client-side content graph. Journey readers and existing destinations are static. Timeline and Your Years use server-rendered URL filters. Local unthrottled response observations (not field metrics):

| Route | HTML bytes | Gzip estimate | Local response |
| --- | ---: | ---: | ---: |
| History | 116,662 | 16,510 | 21ms |
| Full Timeline | 697,955 | 57,847 | 90ms |
| Timeline, 1985–86 | 54,399 | 8,687 | 37ms |
| Your Years, 1985 | 232,495 | 22,509 | 44ms |
| Dalglish reader step 2 | 22,800 | 4,266 | 3ms |

Full Timeline includes closed-disclosure content in its HTML, so it has the largest payload. Filters reduce that substantially. These are local measurements without network/CPU throttling and do not predict production Core Web Vitals.

## 23. Publication state

No draft or unapproved content was published, moved or exposed. V3's article links are checked against the canonical factual published set. The actual held routes `heysel-1985-thirty-nine-lives`, `hillsborough-1989-ninety-seven-lives` and `torres-goodison-derby-double-2008` return 404. Invalid journey/entity references also return 404 or fail build validation. Fixtures remain disposable. No publication-state or eligibility-rule changes.

## 24. Article prose

No article prose changed. Git comparison to the base contains no changes to canonical Archive files, Seasons, entity registry or era records. Only journey definitions were added under canonical history content.

## 25. Canonical URLs

All existing canonical URLs and tags remain unchanged. V3 links to them. New journey and exploration routes have their own canonical metadata; query filters are navigational states of their base exploration page.

## 26. Known limitations

- Coverage is concentrated in the 1970s/1980s. Empty historical detail is not fabricated.
- Native year disclosures are not stored as user preferences. Year/decade/Season selection remains in the URL; opening a year is a local browser disclosure state.
- Journey progress is a numbered URL, without saved/resume state. Reordering a journey later changes the meaning of a step number and deserves editorial care.
- The full timeline sends all current entries; evaluate pagination if measured content growth makes this costly.
- Human editorial approval of the four curated sequences and usability review remain outstanding.
- Browser viewport testing is not a physical-device or screen-reader certification.

## 27. Possible V4 work

Consider explicit editorial journey versioning if step reordering becomes frequent; measured pagination for a larger timeline; or clearer mobile section-navigation density after user feedback. More approved writing will enrich the current views automatically. No graph, AI chat, account system or semantic-search infrastructure is needed for this release.

## 28. Exact review steps before merge

1. Open the local production preview at `http://127.0.0.1:3157/history`.
2. Try each entry choice, then inspect the existing era index and cards.
3. Open Timeline, filter to 1985–86 and the 1980s separately, expand a year, open an article, then use Back/Forward. Try an intentionally mismatched decade/Season selection and reset.
4. Open all four Guided Journeys. Review their ordered canonical references above, use previous/next, open an original and return, then leave for a Season or person.
5. Try Your Liverpool Years with 1965, 1974, 1977, 1985, 1990, 2005 and 2015. Confirm the starting point and the honest variation in coverage.
6. Inspect Continue from here on Dalglish, Paisley, Everton, European Cup, 1985–86, an era and an article. Check that the suggestions feel editorially useful.
7. Repeat representative interactions on your phone/tablet and with Tab/Enter. Assess the amount of header navigation and the long-form timeline rhythm.
8. Review the diff and this report. Approve the product and editorial journey order before a separate merge/deployment instruction. This branch has not been merged or deployed.
