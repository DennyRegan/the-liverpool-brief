# Historical metadata V2 audit and Seasons ↔ Archive completion

Review branch: `feature/historical-metadata-v2-audit`. Base: `da2771617c46f1cd99d791859e7cbdde6af2ec82`. Live checks: 2026-09-15T16:58:38.894272+00:00. This is a review-only change. Nothing has been merged, pushed or deployed by this audit.

## Outcome and actual counts

| Measure | Count |
| --- | --- |
| Canonical historical articles | 213 |
| Currently live | 209 |
| Not currently live | 4 |
| Included by local Archive loader | 212 |
| Draft-only articles | 1 |
| With a principal season | 212 |
| Legitimately without a season | 1 |
| Existing classifications requiring editorial decision | 6 |
| Articles with metadata changes in any copy | 196 |
| Article and draft files changed | 364 |

All 213 canonical articles were read individually by configured GPT-6 Astra workers. The JSON companion contains one decision per canonical slug, every reviewed path, retained/changed fields, rationale and issues. Duplicate editorial copies are not additional articles. All 212 principal seasons were already correct: none was added, removed or changed. Phil Thompson’s full-career biography legitimately remains without a season. Seventeen articles needed no relationship edits in either canonical or saved editorial copies.

Four unavailable pieces remain unavailable: `coventry-liverpool-1990-barnes-hat-trick`, `liverpool-qpr-1990-eighteenth-title`, `palace-liverpool-1990-semi-final`, `torres-goodison-derby-double-2008`. Three are already staged in the Archive loader directory; the Torres 2008 derby exists only in editorial drafts.

Six existing unreviewed classifications remain unset and require Denny’s decision if they are to enter factual History. This is not a new classification recommendation: `john-barnes-1987`, `liverpool-7-tottenham-0`, `liverpool-9-crystal-palace-0`, `liverpool-sold-their-best-player`, `liverpools-manager-scored-after-21-seconds-at-goodison`, `phil-thompson`. New unresolved metadata assignments: 0. Saved editorial counterparts were aligned with the audited canonical metadata, including three player-array differences resolved by the editorial decisions and 50 further retained-field differences, chiefly missing opposition and venue IDs. No apparent factual defect was established; this was a metadata audit, not a fresh article fact-check.

## What constitutes publication here

The implemented boundary is file placement plus deployment. `getArchiveFeatures` reads every Markdown file in `content/archive/liverpool`; it does not consult calendar status, a draft flag or the publication date to gate visibility. `docs/editorial/drafts` is excluded. The build therefore includes 212 Archive files, while current production exposes 209. A file in the loader directory is publication-ready under the current software even when the deployed site is older. Merely having a correct season does not publish a draft.

The production READY deployment observed was `dpl_CdwFyLaE1ivw2feyzxxM8nyV2RAe`, source `28d47b4194970315073b01aaea00232aae02ece5`. All 213 URLs were requested:209 returned 200 and four 404. All 67 live Season pages, 16 era pages, both History browsers, homepage, Articles, This Week and 209 live article recommendation sections were checked. The four unavailable slugs were absent from those discovery surfaces.

The calendar still labels 75 earlier articles approved/pending even though 72 of that group are now live. Those statuses and notes are byte-for-byte preserved. The next build would also expose the final three 1990 articles, independently of this metadata change. Consequently **do not merge this branch into the current main and deploy while those three must remain hidden**. Their existing staging/publication decision needs separate approval or a release plan. This audit does not introduce a new publication mechanism, move content, clear the calendar or publish the saved Torres draft. The earlier publishing automation is paused.

The canonical collection consists of 212 Archive files plus one distinct draft-only article. Saved editorial counterparts are deduplicated by slug. Seven editorial-notes files are evidence, not articles. The 67 structured Season records were checked separately, as were all 12 Opinion routes; neither collection is counted as additional Archive writing. Historical pipeline output files are noncanonical working/prototype material and do not enter any content loader.

## Season coverage

The implemented Season heading is “Related articles”; older documentation and the request call it “From the Archive”. The existing heading is preserved.

Counts use the audited metadata. “Live” includes unreviewed writing; “Live Related articles” correctly includes only factual pieces. “Next build” reflects the existing loader directory, not a publication action performed by this audit. Every live Season’s actual card set matched its expected live factual set, without duplicates. Empty sections were absent.

| Season | All articles | Live | Not live | Live Related articles | Next build factual | Draft only |
| --- | --- | --- | --- | --- | --- | --- |
| 1959-60 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1960-61 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1961-62 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1962-63 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1963-64 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1964-65 | 1 | 1 | 0 | 1 | 1 | 0 |
| 1965-66 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1966-67 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1967-68 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1968-69 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1969-70 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1970-71 | 7 | 7 | 0 | 7 | 7 | 0 |
| 1971-72 | 6 | 6 | 0 | 6 | 6 | 0 |
| 1972-73 | 13 | 13 | 0 | 13 | 13 | 0 |
| 1973-74 | 9 | 9 | 0 | 9 | 9 | 0 |
| 1974-75 | 7 | 7 | 0 | 7 | 7 | 0 |
| 1975-76 | 12 | 12 | 0 | 12 | 12 | 0 |
| 1976-77 | 13 | 13 | 0 | 13 | 13 | 0 |
| 1977-78 | 13 | 13 | 0 | 12 | 12 | 0 |
| 1978-79 | 10 | 10 | 0 | 9 | 9 | 0 |
| 1979-80 | 11 | 11 | 0 | 11 | 11 | 0 |
| 1980-81 | 10 | 10 | 0 | 10 | 10 | 0 |
| 1981-82 | 10 | 10 | 0 | 10 | 10 | 0 |
| 1982-83 | 9 | 9 | 0 | 9 | 9 | 0 |
| 1983-84 | 12 | 12 | 0 | 12 | 12 | 0 |
| 1984-85 | 9 | 9 | 0 | 9 | 9 | 0 |
| 1985-86 | 11 | 11 | 0 | 10 | 10 | 0 |
| 1986-87 | 8 | 8 | 0 | 8 | 8 | 0 |
| 1987-88 | 13 | 13 | 0 | 12 | 12 | 0 |
| 1988-89 | 10 | 10 | 0 | 10 | 10 | 0 |
| 1989-90 | 9 | 6 | 3 | 5 | 8 | 0 |
| 1990-91 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1991-92 | 1 | 1 | 0 | 1 | 1 | 0 |
| 1992-93 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1993-94 | 1 | 1 | 0 | 1 | 1 | 0 |
| 1994-95 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1995-96 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1996-97 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1997-98 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1998-99 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1999-00 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2000-01 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2001-02 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2002-03 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2003-04 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2004-05 | 1 | 1 | 0 | 1 | 1 | 0 |
| 2005-06 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2006-07 | 1 | 1 | 0 | 1 | 1 | 0 |
| 2007-08 | 1 | 1 | 0 | 1 | 1 | 0 |
| 2008-09 | 1 | 0 | 1 | 0 | 0 | 1 |
| 2009-10 | 1 | 1 | 0 | 1 | 1 | 0 |
| 2010-11 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2011-12 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2012-13 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2013-14 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2014-15 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2015-16 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2016-17 | 1 | 1 | 0 | 1 | 1 | 0 |
| 2017-18 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2018-19 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2019-20 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2020-21 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2021-22 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2022-23 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2023-24 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2024-25 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2025-26 | 0 | 0 | 0 | 0 | 0 | 0 |

## Largest substantial relationships

These are proposed audited relationships, not a claim that the metadata changes are already deployed. “Live cohort” counts articles presently available whose metadata would change only after review/release. People are deduplicated across player and manager roles. Manager counts measure substantial discussion, not the number of fixtures managed.

### People, both roles

| Entity | Substantial articles | Currently live article cohort |
| --- | --- | --- |
| Kenny Dalglish | 46 | 46 |
| Ian Rush | 42 | 40 |
| Kevin Keegan | 26 | 26 |
| John Barnes | 25 | 22 |
| John Toshack | 22 | 22 |
| Steve Heighway | 20 | 20 |
| Bob Paisley | 19 | 19 |
| Graeme Souness | 18 | 18 |
| Terry McDermott | 17 | 17 |
| Ray Kennedy | 16 | 16 |
| Bill Shankly | 15 | 15 |
| Jimmy Case | 15 | 15 |

### Players

| Entity | Substantial articles | Currently live article cohort |
| --- | --- | --- |
| Ian Rush | 42 | 40 |
| Kenny Dalglish | 41 | 41 |
| Kevin Keegan | 26 | 26 |
| John Barnes | 25 | 22 |
| John Toshack | 22 | 22 |
| Steve Heighway | 20 | 20 |
| Terry McDermott | 17 | 17 |
| Graeme Souness | 16 | 16 |
| Ray Kennedy | 16 | 16 |
| Jimmy Case | 15 | 15 |
| Phil Neal | 15 | 15 |
| John Aldridge | 14 | 14 |

### Managers

| Entity | Substantial articles | Currently live article cohort |
| --- | --- | --- |
| Bob Paisley | 19 | 19 |
| Bill Shankly | 15 | 15 |
| Kenny Dalglish | 8 | 8 |
| Joe Fagan | 5 | 5 |
| Graeme Souness | 2 | 2 |
| Rafael Benítez | 2 | 2 |
| Gérard Houllier | 1 | 1 |

### Opposition

| Entity | Substantial articles | Currently live article cohort |
| --- | --- | --- |
| Everton | 33 | 32 |
| Arsenal | 16 | 16 |
| Manchester United | 14 | 14 |
| Tottenham Hotspur | 11 | 11 |
| Manchester City | 8 | 8 |
| Nottingham Forest | 8 | 8 |
| Leeds United | 7 | 7 |
| Newcastle United | 7 | 7 |
| West Ham United | 6 | 6 |
| Benfica | 5 | 5 |
| Borussia Mönchengladbach | 4 | 4 |
| Derby County | 4 | 4 |

### Competitions

| Entity | Substantial articles | Currently live article cohort |
| --- | --- | --- |
| First Division | 102 | 100 |
| European Cup | 39 | 39 |
| FA Cup | 28 | 27 |
| League Cup | 18 | 18 |
| UEFA Cup | 11 | 11 |
| Charity Shield | 7 | 7 |
| Premier League | 5 | 4 |
| European Super Cup | 3 | 3 |
| Football League Super Cup | 2 | 2 |
| European Cup Winners’ Cup | 1 | 1 |
| Inter-Cities Fairs Cup | 1 | 1 |
| Intercontinental Cup | 1 | 1 |

### Themes

| Entity | Substantial articles | Currently live article cohort |
| --- | --- | --- |
| Attacking football | 8 | 8 |
| A changing attack | 5 | 5 |
| Player farewells | 3 | 3 |

## Metadata changes and identities

The main correction removes manager-in-charge and incidental-player tags. Sparse additions identify genuinely central opponents/players, supported venues, substantial themes and two justified explicit era contexts. Article types, factual/opinion classifications, publication dates, historical dates, principal seasons, navigation categories and slugs are unchanged. The Phil Thompson career and 1974 Charity Shield gain explicit era relationships supported by their subjects. Full field-level before/after values for every changed file are in the JSON companion.

| New canonical ID | Kind | Why needed |
| --- | --- | --- |
| dixie-dean | person | Dean’s death while attending this derby and the independently documented recollections of his final visit form a substantial part of the existing article. No canonical identity exists in the registry. |
| chris-woods | person | Goalkeeper is the sustained central subject of the 1978 Wembley final draw; absent from current registry. |
| hull-city | opposition | Principal opponent in the 26 September 2009 match; absent from current registry. |
| tony-coton | person | Goalkeeper’s repeated saves and later account of the decisive penalty occupy much of the Watford replay article; absent from current registry. |

No second identities or registry were introduced. Existing IDs were checked before each addition. No reverse article lists, manual previous/next links or recommendation lists were added. The three existing themes were reused selectively; no speculative theme catalogue was created.

## Validation and integration

- Shared calendar validation passed; statuses were not edited. Its existing validator now checks draft relationships with the shared Archive schema, canonical entity kinds and era rules, without adding publication dates or loading drafts publicly.
- Full test suite: 96 passed, 0 failed. Two added tests cover draft isolation/metadata enrichment/future normal publication and invalid draft metadata. Existing tests cover optional career seasons, missing destinations, related reading, entities, browser classification, URL identity, This Week, Opinion and automatic navigation.
- Lint: passed. Production build: passed after retrying with network access for the existing Google Fonts; the restricted attempt could not fetch fonts. Local HTTP verification likewise required permission to bind preview ports. Existing non-fatal module-format and Forshaw 1925/no-era notices remain. The 1925 article predates the available managerial-era guide and has not been forced into it. No application component, route, schema, recommendation algorithm or loader was changed.
- HTTP checks passed: all 67 Season pages and 293 internal destinations; 16 eras and 229 existing History routes; nine article-only This Week cards; and all 212 local Archive articles, 12 Opinion routes and 10 collections. Desktop and 390-pixel mobile checks confirmed readable Season cards, the 1977–78 article return link and related reading. Existing verification scripts were updated for the implemented homepage, article-only This Week, player ordering and club-event back links; obsolete expectations had failed before correction. No site changes were made to satisfy those stale assertions.
- Article bodies/headlines/sources and protected metadata are compared to the base commit. Calendar, Opinion, Season records, eras and file membership are also checked unchanged.

## V2 destinations supported by the writing

- **Everton opposition collection: 33 substantial articles** (32 currently live). The deepest opponent collection, spanning league derbies and cup ties.
- **Ian Rush player exploration: 42 substantial articles** (40 currently live). Repeated central scoring and attacking contributions across multiple seasons.
- **Kenny Dalglish exploration: 46 substantial articles** (46 currently live). One canonical person identity connects his playing and substantial managerial coverage.
- **European Cup collection: 39 substantial articles** (39 currently live). A coherent route through ties, finals and successive campaigns.
- **First Division collection: 102 substantial articles** (100 currently live). The broadest competition collection, naturally narrowed by existing seasons.

Theme depth is reported above and is deliberately sparse. No V2 destination has been built.

## Exact review steps before merge

1. Check out `feature/historical-metadata-v2-audit`; compare against base `da2771617c46f1cd99d791859e7cbdde6af2ec82` and current main, preserving newer work. Review the JSON’s 213 decisions and field changes, especially removals, the four new identities and two era overrides.
2. Confirm the original bodies, headlines, source lists, slugs, editorialMode, dates and calendar statuses are unchanged. The six unreviewed classifications stay unset.
3. Review the actual 209-live/four-unavailable distinction and the stale calendar. Decide separately how to handle the three already-staged1990 articles before any deployment; merging this audit is not publication approval for them. Keep the Torres draft outside the loader.
4. Run `npm run validate:calendar`, `npm test`, `npm run lint`, `npm run build`, `node scripts/verify-seasons.mjs`, `node scripts/verify-history-explorer.mjs` and `node scripts/verify-article-week.mjs`. Start the local production server and run `BASE_URL=http://127.0.0.1:3147 node scripts/verify-connected-history.mjs`.
5. Review the 1977-78/1987-88 Season cards and their return links, Phil Thompson’s career omission, History Matches/Players, both club events, This Week and an Opinion article. Check desktop/mobile layouts. Current local preview includes the three already-staged articles; that is existing file-placement behaviour.
6. Obtain Denny’s approval of this audit and a separate safe publication plan before merge or production release. Nothing in this audit resumes the paused publishing automation.

## Every modified or added file

- `content/archive/liverpool/aberdeen-liverpool-1980-mcdermott-chip.md`
- `content/archive/liverpool/alonso-own-half-newcastle-2006.md`
- `content/archive/liverpool/anfield-first-european-match-reykjavik-1964.md`
- `content/archive/liverpool/arsenal-liverpool-1973-first-away-win.md`
- `content/archive/liverpool/arsenal-liverpool-1987-barnes-beardsley-debuts.md`
- `content/archive/liverpool/athletic-bilbao-liverpool-1983-rush-header.md`
- `content/archive/liverpool/bayern-liverpool-1981-ray-kennedy-away-goal.md`
- `content/archive/liverpool/benfica-liverpool-1978-hughes-winner.md`
- `content/archive/liverpool/benfica-liverpool-1984-dalglish-three-assists.md`
- `content/archive/liverpool/benfica-liverpool-1984-quarter-final-survival.md`
- `content/archive/liverpool/bill-shankly-testimonial-anfield-1975.md`
- `content/archive/liverpool/bristol-city-liverpool-1974-toshack-cup-quarter-final.md`
- `content/archive/liverpool/brugge-liverpool-1976-uefa-cup-double.md`
- `content/archive/liverpool/chelsea-liverpool-1986-dalglish-title-winner.md`
- `content/archive/liverpool/chelsea-liverpool-1989-five-at-stamford-bridge.md`
- `content/archive/liverpool/coventry-liverpool-1990-barnes-hat-trick.md`
- `content/archive/liverpool/derby-liverpool-1972-mcgovern-title-race.md`
- `content/archive/liverpool/derby-liverpool-1976-keegan-comeback-winner.md`
- `content/archive/liverpool/dinamo-liverpool-1984-rush-double.md`
- `content/archive/liverpool/dinamo-tbilisi-liverpool-1979-european-exit.md`
- `content/archive/liverpool/everton-liverpool-1973-alan-waddle.md`
- `content/archive/liverpool/everton-liverpool-1973-hughes-double.md`
- `content/archive/liverpool/everton-liverpool-1980-goodison-derby.md`
- `content/archive/liverpool/everton-liverpool-1982-midfield-goals.md`
- `content/archive/liverpool/everton-liverpool-1982-rush-four.md`
- `content/archive/liverpool/everton-liverpool-1986-super-cup-rush-hat-trick.md`
- `content/archive/liverpool/everton-liverpool-1988-houghton-cup-header.md`
- `content/archive/liverpool/everton-liverpool-1988-unbeaten-start-ends.md`
- `content/archive/liverpool/everton-liverpool-1989-return-at-goodison.md`
- `content/archive/liverpool/everton-liverpool-1989-rush-double-takes-top-spot.md`
- `content/archive/liverpool/flamengo-liverpool-1981-tokyo-defeat.md`
- `content/archive/liverpool/forshaw-hat-trick-manchester-united-1925.md`
- `content/archive/liverpool/fowler-scoring-debut-fulham-1993.md`
- `content/archive/liverpool/hamburg-liverpool-1977-fairclough-super-cup.md`
- `content/archive/liverpool/henderson-chelsea-winner-2016.md`
- `content/archive/liverpool/ipswich-liverpool-1978-dalglish-double.md`
- `content/archive/liverpool/john-barnes-1987.md`
- `content/archive/liverpool/leeds-liverpool-1971-early-winner.md`
- `content/archive/liverpool/leeds-liverpool-1972-phil-boersma.md`
- `content/archive/liverpool/leeds-liverpool-1975-callaghan-double.md`
- `content/archive/liverpool/leeds-liverpool-1979-record-points.md`
- `content/archive/liverpool/liverpool-7-tottenham-0.md`
- `content/archive/liverpool/liverpool-aberdeen-1980-quarter-finals.md`
- `content/archive/liverpool/liverpool-arsenal-1971-fa-cup-final.md`
- `content/archive/liverpool/liverpool-arsenal-1971-ian-ross.md`
- `content/archive/liverpool/liverpool-arsenal-1971-toshack-smith.md`
- `content/archive/liverpool/liverpool-arsenal-1978-league-cup-semi-final.md`
- `content/archive/liverpool/liverpool-arsenal-1979-charity-shield.md`
- `content/archive/liverpool/liverpool-arsenal-1980-dalglish-second-replay.md`
- `content/archive/liverpool/liverpool-arsenal-1980-hillsborough-stalemate.md`
- `content/archive/liverpool/liverpool-arsenal-1980-talbot-third-replay.md`
- `content/archive/liverpool/liverpool-arsenal-1985-dalglish-first-competitive-match.md`
- `content/archive/liverpool/liverpool-arsenal-1987-nicholas-league-cup-final.md`
- `content/archive/liverpool/liverpool-arsenal-1988-aldridge-second-replay.md`
- `content/archive/liverpool/liverpool-arsenal-1989-barnes-free-kick.md`
- `content/archive/liverpool/liverpool-arsenal-1989-thomas-title-decider.md`
- `content/archive/liverpool/liverpool-aston-villa-1979-eleventh-title.md`
- `content/archive/liverpool/liverpool-aston-villa-1980-cohen-title.md`
- `content/archive/liverpool/liverpool-austria-vienna-1985-walsh-double.md`
- `content/archive/liverpool/liverpool-az-1981-hansen-late-winner.md`
- `content/archive/liverpool/liverpool-barcelona-1976-thompson-semi-final.md`
- `content/archive/liverpool/liverpool-bayern-1981-anfield-draw.md`
- `content/archive/liverpool/liverpool-benfica-1978-european-cup-semi-final.md`
- `content/archive/liverpool/liverpool-birmingham-1972-comeback.md`
- `content/archive/liverpool/liverpool-brighton-1983-case-cup-winner.md`
- `content/archive/liverpool/liverpool-brugge-1978-european-cup-final.md`
- `content/archive/liverpool/liverpool-coventry-1988-beardsley-new-year-double.md`
- `content/archive/liverpool/liverpool-cska-sofia-1981-souness-treble.md`
- `content/archive/liverpool/liverpool-derby-1971-jack-whitham.md`
- `content/archive/liverpool/liverpool-derby-county-1978-five-goals.md`
- `content/archive/liverpool/liverpool-dinamo-1984-lee-header.md`
- `content/archive/liverpool/liverpool-dynamo-berlin-1972-uefa-cup.md`
- `content/archive/liverpool/liverpool-dynamo-dresden-1977-five-goal-defence.md`
- `content/archive/liverpool/liverpool-everton-1972-cormack-winner.md`
- `content/archive/liverpool/liverpool-everton-1972-four-goal-derby.md`
- `content/archive/liverpool/liverpool-everton-1976-fairclough-derby-winner.md`
- `content/archive/liverpool/liverpool-everton-1977-replay-wembley.md`
- `content/archive/liverpool/liverpool-everton-1977-semi-final-draw.md`
- `content/archive/liverpool/liverpool-everton-1981-dalglish-double.md`
- `content/archive/liverpool/liverpool-everton-1983-derby-lead.md`
- `content/archive/liverpool/liverpool-everton-1984-sharp-volley.md`
- `content/archive/liverpool/liverpool-everton-1984-souness-replay-winner.md`
- `content/archive/liverpool/liverpool-everton-1984-wembley-draw.md`
- `content/archive/liverpool/liverpool-everton-1986-eight-points-behind.md`
- `content/archive/liverpool/liverpool-everton-1986-rush-double-wembley.md`
- `content/archive/liverpool/liverpool-everton-1986-shared-charity-shield.md`
- `content/archive/liverpool/liverpool-everton-1986-super-cup-first-leg.md`
- `content/archive/liverpool/liverpool-everton-1987-barnes-creates-derby-win.md`
- `content/archive/liverpool/liverpool-everton-1987-rush-equals-dean.md`
- `content/archive/liverpool/liverpool-everton-1989-rush-extra-time-double.md`
- `content/archive/liverpool/liverpool-everton-1990-barnes-beardsley-derby-double.md`
- `content/archive/liverpool/liverpool-everton-comeback-1970.md`
- `content/archive/liverpool/liverpool-gladbach-1977-first-european-cup.md`
- `content/archive/liverpool/liverpool-gladbach-1978-semi-final.md`
- `content/archive/liverpool/liverpool-hamburg-1977-super-cup.md`
- `content/archive/liverpool/liverpool-hibernian-1975-toshack-headers.md`
- `content/archive/liverpool/liverpool-ipswich-1975-toshack-double.md`
- `content/archive/liverpool/liverpool-ipswich-1976-three-equalisers.md`
- `content/archive/liverpool/liverpool-ipswich-1977-kennedy-keegan.md`
- `content/archive/liverpool/liverpool-leeds-1973-cormack-keegan.md`
- `content/archive/liverpool/liverpool-leeds-1974-charity-shield.md`
- `content/archive/liverpool/liverpool-leeds-1977-fairclough-league-victory.md`
- `content/archive/liverpool/liverpool-leicester-1974-semi-final-replay.md`
- `content/archive/liverpool/liverpool-leicester-1987-rush-hat-trick.md`
- `content/archive/liverpool/liverpool-luton-1983-rush-five.md`
- `content/archive/liverpool/liverpool-man-united-1988-molby-penalty.md`
- `content/archive/liverpool/liverpool-manchester-city-1972-opening-day.md`
- `content/archive/liverpool/liverpool-manchester-city-1974-boxing-day.md`
- `content/archive/liverpool/liverpool-manchester-city-1981-boxing-day-defeat.md`
- `content/archive/liverpool/liverpool-manchester-city-1982-dalglish-hat-trick.md`
- `content/archive/liverpool/liverpool-manchester-united-1973-ten-home-wins.md`
- `content/archive/liverpool/liverpool-manchester-united-1977-fa-cup-final.md`
- `content/archive/liverpool/liverpool-manchester-united-1979-boxing-day.md`
- `content/archive/liverpool/liverpool-manchester-united-1985-molby-turnaround.md`
- `content/archive/liverpool/liverpool-manchester-united-1985-replay-defeat.md`
- `content/archive/liverpool/liverpool-manchester-united-1985-two-late-equalisers.md`
- `content/archive/liverpool/liverpool-manchester-united-1988-two-goal-lead-lost.md`
- `content/archive/liverpool/liverpool-newcastle-1972-five-goal-win.md`
- `content/archive/liverpool/liverpool-newcastle-1972-five-goals.md`
- `content/archive/liverpool/liverpool-newcastle-1974-fa-cup-final.md`
- `content/archive/liverpool/liverpool-newcastle-1975-toshack-mcdermott.md`
- `content/archive/liverpool/liverpool-newcastle-1987-aldridge-double.md`
- `content/archive/liverpool/liverpool-norwich-1979-six-goals.md`
- `content/archive/liverpool/liverpool-norwich-1986-walsh-hat-trick.md`
- `content/archive/liverpool/liverpool-nottingham-forest-1978-european-cup-exit.md`
- `content/archive/liverpool/liverpool-nottingham-forest-1978-league-cup-replay.md`
- `content/archive/liverpool/liverpool-nottingham-forest-1978-wembley-draw.md`
- `content/archive/liverpool/liverpool-nottingham-forest-1982-late-recovery.md`
- `content/archive/liverpool/liverpool-nottingham-forest-1988-aldridge-semi-final-double.md`
- `content/archive/liverpool/liverpool-nottingham-forest-1988-five-at-anfield.md`
- `content/archive/liverpool/liverpool-nottingham-forest-1989-rescheduled-semi-final.md`
- `content/archive/liverpool/liverpool-oulu-1980-ten-goals.md`
- `content/archive/liverpool/liverpool-oulu-1981-rush-first-goal.md`
- `content/archive/liverpool/liverpool-oxford-1986-dalglish-creates-six-goal-win.md`
- `content/archive/liverpool/liverpool-panathinaikos-1985-rush-double.md`
- `content/archive/liverpool/liverpool-qpr-1986-dalglish-returns.md`
- `content/archive/liverpool/liverpool-qpr-1987-barnes-takes-liverpool-top.md`
- `content/archive/liverpool/liverpool-qpr-1990-eighteenth-title.md`
- `content/archive/liverpool/liverpool-real-madrid-1981-third-european-cup.md`
- `content/archive/liverpool/liverpool-saint-etienne-1977-fairclough-winner.md`
- `content/archive/liverpool/liverpool-sheffield-united-1972-five-goals.md`
- `content/archive/liverpool/liverpool-sold-their-best-player.md`
- `content/archive/liverpool/liverpool-southampton-1976-toshack-charity-shield.md`
- `content/archive/liverpool/liverpool-southampton-1986-rush-extra-time-double.md`
- `content/archive/liverpool/liverpool-stoke-1976-eight-goal-easter.md`
- `content/archive/liverpool/liverpool-stromsgodset-record-win-1974.md`
- `content/archive/liverpool/liverpool-swansea-1990-rush-replay-hat-trick.md`
- `content/archive/liverpool/liverpool-tottenham-1985-molby-two-penalties.md`
- `content/archive/liverpool/liverpool-tranmere-1979-second-half.md`
- `content/archive/liverpool/liverpool-walsall-1984-semi-final-draw.md`
- `content/archive/liverpool/liverpool-west-bromwich-albion-1977-dalglish-third-goal.md`
- `content/archive/liverpool/liverpool-west-ham-1977-tenth-title.md`
- `content/archive/liverpool/liverpool-west-ham-1980-mcdermott-shield.md`
- `content/archive/liverpool/liverpool-west-ham-1981-final-draw.md`
- `content/archive/liverpool/liverpool-west-ham-1981-first-league-cup.md`
- `content/archive/liverpool/liverpool-west-ham-1984-four-before-half-hour.md`
- `content/archive/liverpool/liverpool-west-ham-1989-four-second-half-goals.md`
- `content/archive/liverpool/liverpool-widzew-1983-victory-elimination.md`
- `content/archive/liverpool/liverpool-wimbledon-1988-aldridge-shield-double.md`
- `content/archive/liverpool/liverpool-wimbledon-1988-fa-cup-final-defeat.md`
- `content/archive/liverpool/liverpool-zurich-1977-first-european-cup-final.md`
- `content/archive/liverpool/liverpools-manager-scored-after-21-seconds-at-goodison.md`
- `content/archive/liverpool/man-united-liverpool-1989-seven-minutes.md`
- `content/archive/liverpool/manchester-city-liverpool-1976-fairclough-double.md`
- `content/archive/liverpool/manchester-city-liverpool-1978-souness-double.md`
- `content/archive/liverpool/manchester-city-liverpool-1979-dalglish-double.md`
- `content/archive/liverpool/manchester-city-liverpool-1982-five-goals.md`
- `content/archive/liverpool/manchester-united-liverpool-1972-thompson-debut.md`
- `content/archive/liverpool/manchester-united-liverpool-1978-boxing-day.md`
- `content/archive/liverpool/manchester-united-liverpool-1982-johnston-winner.md`
- `content/archive/liverpool/mcmahon-four-fulham-ten-goals-1986.md`
- `content/archive/liverpool/middlesbrough-liverpool-1977-dalglish-league-debut.md`
- `content/archive/liverpool/palace-liverpool-1990-semi-final.md`
- `content/archive/liverpool/phil-thompson.md`
- `content/archive/liverpool/red-star-liverpool-1973-lawler-away-goal.md`
- `content/archive/liverpool/saint-etienne-liverpool-1977-first-leg-deficit.md`
- `content/archive/liverpool/saunders-four-kuusysi-european-return-1991.md`
- `content/archive/liverpool/torres-babel-six-goals-hull-2009.md`
- `content/archive/liverpool/tottenham-liverpool-1971-heighway-clemence.md`
- `content/archive/liverpool/tottenham-liverpool-1973-heighway-away-goal.md`
- `content/archive/liverpool/tottenham-liverpool-1975-four-scorers.md`
- `content/archive/liverpool/tottenham-liverpool-1980-mcdermott-volley.md`
- `content/archive/liverpool/tottenham-liverpool-1982-dalglish-recovery.md`
- `content/archive/liverpool/watford-liverpool-1986-rush-replay-winner.md`
- `content/archive/liverpool/widzew-liverpool-1983-two-goal-deficit.md`
- `content/archive/liverpool/zurich-liverpool-1977-neal-first-leg-win.md`
- `content/history/liverpool/entities.json`
- `docs/editorial/drafts/015-liverpool-sheffield-united-1972-five-goals.md`
- `docs/editorial/drafts/016-leeds-liverpool-1972-phil-boersma.md`
- `docs/editorial/drafts/017-liverpool-everton-1972-cormack-winner.md`
- `docs/editorial/drafts/018-liverpool-newcastle-1972-five-goal-win.md`
- `docs/editorial/drafts/019-liverpool-birmingham-1972-comeback.md`
- `docs/editorial/drafts/020-liverpool-dynamo-berlin-1972-uefa-cup.md`
- `docs/editorial/drafts/021-everton-liverpool-1973-hughes-double.md`
- `docs/editorial/drafts/023-liverpool-leeds-1973-cormack-keegan.md`
- `docs/editorial/drafts/024-tottenham-liverpool-1973-heighway-away-goal.md`
- `docs/editorial/drafts/025-liverpool-gladbach-1973-keegan-toshack-final.md`
- `docs/editorial/drafts/026-gladbach-liverpool-1973-first-european-trophy.md`
- `docs/editorial/drafts/027-red-star-liverpool-1973-lawler-away-goal.md`
- `docs/editorial/drafts/028-arsenal-liverpool-1973-first-away-win.md`
- `docs/editorial/drafts/029-liverpool-red-star-1973-european-lesson.md`
- `docs/editorial/drafts/030-everton-liverpool-1973-alan-waddle.md`
- `docs/editorial/drafts/031-liverpool-manchester-united-1973-ten-home-wins.md`
- `docs/editorial/drafts/032-bristol-city-liverpool-1974-toshack-cup-quarter-final.md`
- `docs/editorial/drafts/033-liverpool-leicester-1974-semi-final-replay.md`
- `docs/editorial/drafts/034-liverpool-newcastle-1974-fa-cup-final.md`
- `docs/editorial/drafts/035-tottenham-liverpool-1974-shankly-final-league-match.md`
- `docs/editorial/drafts/036-liverpool-leeds-1974-charity-shield.md`
- `docs/editorial/drafts/039-liverpool-manchester-city-1974-boxing-day.md`
- `docs/editorial/drafts/040-liverpool-ipswich-1975-toshack-double.md`
- `docs/editorial/drafts/041-liverpool-newcastle-1975-toshack-mcdermott.md`
- `docs/editorial/drafts/042-bill-shankly-testimonial-anfield-1975.md`
- `docs/editorial/drafts/043-leeds-liverpool-1975-callaghan-double.md`
- `docs/editorial/drafts/044-liverpool-hibernian-1975-toshack-headers.md`
- `docs/editorial/drafts/045-tottenham-liverpool-1975-four-scorers.md`
- `docs/editorial/drafts/046-liverpool-ipswich-1976-three-equalisers.md`
- `docs/editorial/drafts/047-barcelona-liverpool-1976-toshack-advantage.md`
- `docs/editorial/drafts/048-liverpool-everton-1976-fairclough-derby-winner.md`
- `docs/editorial/drafts/049-liverpool-barcelona-1976-thompson-semi-final.md`
- `docs/editorial/drafts/050-liverpool-stoke-1976-eight-goal-easter.md`
- `docs/editorial/drafts/051-manchester-city-liverpool-1976-fairclough-double.md`
- `docs/editorial/drafts/052-liverpool-brugge-1976-anfield-final-comeback.md`
- `docs/editorial/drafts/053-wolves-liverpool-1976-title-at-molineux.md`
- `docs/editorial/drafts/054-brugge-liverpool-1976-uefa-cup-double.md`
- `docs/editorial/drafts/055-liverpool-southampton-1976-toshack-charity-shield.md`
- `docs/editorial/drafts/056-derby-liverpool-1976-keegan-comeback-winner.md`
- `docs/editorial/drafts/057-saint-etienne-liverpool-1977-first-leg-deficit.md`
- `docs/editorial/drafts/058-liverpool-saint-etienne-1977-fairclough-winner.md`
- `docs/editorial/drafts/059-liverpool-leeds-1977-fairclough-league-victory.md`
- `docs/editorial/drafts/060-zurich-liverpool-1977-neal-first-leg-win.md`
- `docs/editorial/drafts/061-liverpool-zurich-1977-first-european-cup-final.md`
- `docs/editorial/drafts/062-liverpool-everton-1977-semi-final-draw.md`
- `docs/editorial/drafts/063-liverpool-everton-1977-replay-wembley.md`
- `docs/editorial/drafts/064-liverpool-ipswich-1977-kennedy-keegan.md`
- `docs/editorial/drafts/065-liverpool-west-ham-1977-tenth-title.md`
- `docs/editorial/drafts/066-liverpool-manchester-united-1977-fa-cup-final.md`
- `docs/editorial/drafts/067-liverpool-gladbach-1977-first-european-cup.md`
- `docs/editorial/drafts/068-middlesbrough-liverpool-1977-dalglish-league-debut.md`
- `docs/editorial/drafts/069-liverpool-west-bromwich-albion-1977-dalglish-third-goal.md`
- `docs/editorial/drafts/070-liverpool-dynamo-dresden-1977-five-goal-defence.md`
- `docs/editorial/drafts/071-hamburg-liverpool-1977-fairclough-super-cup.md`
- `docs/editorial/drafts/072-liverpool-hamburg-1977-super-cup.md`
- `docs/editorial/drafts/073-liverpool-arsenal-1978-league-cup-semi-final.md`
- `docs/editorial/drafts/074-benfica-liverpool-1978-hughes-winner.md`
- `docs/editorial/drafts/075-liverpool-benfica-1978-european-cup-semi-final.md`
- `docs/editorial/drafts/076-liverpool-nottingham-forest-1978-wembley-draw.md`
- `docs/editorial/drafts/077-liverpool-nottingham-forest-1978-league-cup-replay.md`
- `docs/editorial/drafts/078-liverpool-gladbach-1978-semi-final.md`
- `docs/editorial/drafts/079-liverpool-brugge-1978-european-cup-final.md`
- `docs/editorial/drafts/080-ipswich-liverpool-1978-dalglish-double.md`
- `docs/editorial/drafts/081-manchester-city-liverpool-1978-souness-double.md`
- `docs/editorial/drafts/084-liverpool-nottingham-forest-1978-european-cup-exit.md`
- `docs/editorial/drafts/085-liverpool-derby-county-1978-five-goals.md`
- `docs/editorial/drafts/086-manchester-united-liverpool-1978-boxing-day.md`
- `docs/editorial/drafts/087-liverpool-norwich-1979-six-goals.md`
- `docs/editorial/drafts/088-liverpool-aston-villa-1979-eleventh-title.md`
- `docs/editorial/drafts/089-leeds-liverpool-1979-record-points.md`
- `docs/editorial/drafts/090-liverpool-arsenal-1979-charity-shield.md`
- `docs/editorial/drafts/091-liverpool-tranmere-1979-second-half.md`
- `docs/editorial/drafts/092-dinamo-tbilisi-liverpool-1979-european-exit.md`
- `docs/editorial/drafts/093-manchester-city-liverpool-1979-dalglish-double.md`
- `docs/editorial/drafts/094-liverpool-manchester-united-1979-boxing-day.md`
- `docs/editorial/drafts/095-everton-liverpool-1980-goodison-derby.md`
- `docs/editorial/drafts/096-tottenham-liverpool-1980-mcdermott-volley.md`
- `docs/editorial/drafts/097-liverpool-arsenal-1980-hillsborough-stalemate.md`
- `docs/editorial/drafts/098-liverpool-arsenal-1980-dalglish-second-replay.md`
- `docs/editorial/drafts/099-liverpool-arsenal-1980-talbot-third-replay.md`
- `docs/editorial/drafts/100-liverpool-aston-villa-1980-cohen-title.md`
- `docs/editorial/drafts/101-liverpool-west-ham-1980-mcdermott-shield.md`
- `docs/editorial/drafts/102-liverpool-oulu-1980-ten-goals.md`
- `docs/editorial/drafts/103-aberdeen-liverpool-1980-mcdermott-chip.md`
- `docs/editorial/drafts/104-liverpool-aberdeen-1980-quarter-finals.md`
- `docs/editorial/drafts/105-liverpool-cska-sofia-1981-souness-treble.md`
- `docs/editorial/drafts/106-liverpool-west-ham-1981-final-draw.md`
- `docs/editorial/drafts/107-liverpool-west-ham-1981-first-league-cup.md`
- `docs/editorial/drafts/108-liverpool-bayern-1981-anfield-draw.md`
- `docs/editorial/drafts/109-bayern-liverpool-1981-ray-kennedy-away-goal.md`
- `docs/editorial/drafts/110-liverpool-real-madrid-1981-third-european-cup.md`
- `docs/editorial/drafts/111-liverpool-oulu-1981-rush-first-goal.md`
- `docs/editorial/drafts/112-liverpool-az-1981-hansen-late-winner.md`
- `docs/editorial/drafts/113-liverpool-everton-1981-dalglish-double.md`
- `docs/editorial/drafts/114-flamengo-liverpool-1981-tokyo-defeat.md`
- `docs/editorial/drafts/115-liverpool-manchester-city-1981-boxing-day-defeat.md`
- `docs/editorial/drafts/117-everton-liverpool-1982-midfield-goals.md`
- `docs/editorial/drafts/118-manchester-united-liverpool-1982-johnston-winner.md`
- `docs/editorial/drafts/119-manchester-city-liverpool-1982-five-goals.md`
- `docs/editorial/drafts/120-tottenham-liverpool-1982-dalglish-recovery.md`
- `docs/editorial/drafts/121-liverpool-nottingham-forest-1982-late-recovery.md`
- `docs/editorial/drafts/123-everton-liverpool-1982-rush-four.md`
- `docs/editorial/drafts/124-liverpool-manchester-city-1982-dalglish-hat-trick.md`
- `docs/editorial/drafts/125-liverpool-brighton-1983-case-cup-winner.md`
- `docs/editorial/drafts/126-widzew-liverpool-1983-two-goal-deficit.md`
- `docs/editorial/drafts/127-liverpool-widzew-1983-victory-elimination.md`
- `docs/editorial/drafts/131-liverpool-luton-1983-rush-five.md`
- `docs/editorial/drafts/132-athletic-bilbao-liverpool-1983-rush-header.md`
- `docs/editorial/drafts/133-liverpool-everton-1983-derby-lead.md`
- `docs/editorial/drafts/134-liverpool-walsall-1984-semi-final-draw.md`
- `docs/editorial/drafts/135-benfica-liverpool-1984-dalglish-three-assists.md`
- `docs/editorial/drafts/136-liverpool-everton-1984-wembley-draw.md`
- `docs/editorial/drafts/137-liverpool-everton-1984-souness-replay-winner.md`
- `docs/editorial/drafts/138-liverpool-west-ham-1984-four-before-half-hour.md`
- `docs/editorial/drafts/139-liverpool-dinamo-1984-lee-header.md`
- `docs/editorial/drafts/140-dinamo-liverpool-1984-rush-double.md`
- `docs/editorial/drafts/143-liverpool-everton-1984-sharp-volley.md`
- `docs/editorial/drafts/145-benfica-liverpool-1984-quarter-final-survival.md`
- `docs/editorial/drafts/146-liverpool-austria-vienna-1985-walsh-double.md`
- `docs/editorial/drafts/147-liverpool-panathinaikos-1985-rush-double.md`
- `docs/editorial/drafts/148-liverpool-manchester-united-1985-two-late-equalisers.md`
- `docs/editorial/drafts/149-liverpool-manchester-united-1985-replay-defeat.md`
- `docs/editorial/drafts/151-liverpool-arsenal-1985-dalglish-first-competitive-match.md`
- `docs/editorial/drafts/153-liverpool-tottenham-1985-molby-two-penalties.md`
- `docs/editorial/drafts/154-liverpool-manchester-united-1985-molby-turnaround.md`
- `docs/editorial/drafts/155-liverpool-everton-1986-eight-points-behind.md`
- `docs/editorial/drafts/156-liverpool-qpr-1986-dalglish-returns.md`
- `docs/editorial/drafts/157-watford-liverpool-1986-rush-replay-winner.md`
- `docs/editorial/drafts/158-liverpool-oxford-1986-dalglish-creates-six-goal-win.md`
- `docs/editorial/drafts/159-liverpool-southampton-1986-rush-extra-time-double.md`
- `docs/editorial/drafts/160-chelsea-liverpool-1986-dalglish-title-winner.md`
- `docs/editorial/drafts/161-liverpool-everton-1986-rush-double-wembley.md`
- `docs/editorial/drafts/162-liverpool-everton-1986-shared-charity-shield.md`
- `docs/editorial/drafts/163-liverpool-everton-1986-super-cup-first-leg.md`
- `docs/editorial/drafts/165-everton-liverpool-1986-super-cup-rush-hat-trick.md`
- `docs/editorial/drafts/166-liverpool-norwich-1986-walsh-hat-trick.md`
- `docs/editorial/drafts/167-liverpool-leicester-1987-rush-hat-trick.md`
- `docs/editorial/drafts/168-liverpool-arsenal-1987-nicholas-league-cup-final.md`
- `docs/editorial/drafts/169-liverpool-everton-1987-rush-equals-dean.md`
- `docs/editorial/drafts/170-arsenal-liverpool-1987-barnes-beardsley-debuts.md`
- `docs/editorial/drafts/171-liverpool-qpr-1987-barnes-takes-liverpool-top.md`
- `docs/editorial/drafts/172-liverpool-everton-1987-barnes-creates-derby-win.md`
- `docs/editorial/drafts/173-liverpool-newcastle-1987-aldridge-double.md`
- `docs/editorial/drafts/174-liverpool-coventry-1988-beardsley-new-year-double.md`
- `docs/editorial/drafts/175-everton-liverpool-1988-houghton-cup-header.md`
- `docs/editorial/drafts/176-everton-liverpool-1988-unbeaten-start-ends.md`
- `docs/editorial/drafts/177-liverpool-manchester-united-1988-two-goal-lead-lost.md`
- `docs/editorial/drafts/178-liverpool-nottingham-forest-1988-aldridge-semi-final-double.md`
- `docs/editorial/drafts/179-liverpool-nottingham-forest-1988-five-at-anfield.md`
- `docs/editorial/drafts/180-liverpool-wimbledon-1988-fa-cup-final-defeat.md`
- `docs/editorial/drafts/181-liverpool-wimbledon-1988-aldridge-shield-double.md`
- `docs/editorial/drafts/182-liverpool-man-united-1988-molby-penalty.md`
- `docs/editorial/drafts/183-liverpool-arsenal-1988-aldridge-second-replay.md`
- `docs/editorial/drafts/184-man-united-liverpool-1989-seven-minutes.md`
- `docs/editorial/drafts/186-everton-liverpool-1989-return-at-goodison.md`
- `docs/editorial/drafts/187-liverpool-nottingham-forest-1989-rescheduled-semi-final.md`
- `docs/editorial/drafts/188-liverpool-everton-1989-rush-extra-time-double.md`
- `docs/editorial/drafts/189-liverpool-west-ham-1989-four-second-half-goals.md`
- `docs/editorial/drafts/190-liverpool-arsenal-1989-thomas-title-decider.md`
- `docs/editorial/drafts/192-everton-liverpool-1989-rush-double-takes-top-spot.md`
- `docs/editorial/drafts/193-liverpool-arsenal-1989-barnes-free-kick.md`
- `docs/editorial/drafts/194-chelsea-liverpool-1989-five-at-stamford-bridge.md`
- `docs/editorial/drafts/195-liverpool-swansea-1990-rush-replay-hat-trick.md`
- `docs/editorial/drafts/196-liverpool-everton-1990-barnes-beardsley-derby-double.md`
- `docs/editorial/drafts/197-palace-liverpool-1990-semi-final.md`
- `docs/editorial/drafts/198-liverpool-qpr-1990-eighteenth-title.md`
- `docs/editorial/drafts/199-coventry-liverpool-1990-barnes-hat-trick.md`
- `docs/editorial/drafts/anfield-first-european-match-reykjavik-1964.md`
- `docs/editorial/drafts/forshaw-hat-trick-manchester-united-1925.md`
- `docs/editorial/drafts/fowler-scoring-debut-fulham-1993.md`
- `docs/editorial/drafts/henderson-chelsea-winner-2016.md`
- `docs/editorial/drafts/liverpool-monaco-champions-league-2004.md`
- `docs/editorial/drafts/liverpool-stromsgodset-record-win-1974.md`
- `docs/editorial/drafts/mcmahon-four-fulham-ten-goals-1986.md`
- `docs/editorial/drafts/saunders-four-kuusysi-european-return-1991.md`
- `docs/editorial/drafts/torres-babel-six-goals-hull-2009.md`
- `docs/editorial/drafts/torres-first-hat-trick-reading-2007.md`
- `docs/editorial/drafts/torres-goodison-derby-double-2008.md`
- `docs/research/historical-metadata-v2-audit.json`
- `docs/research/historical-metadata-v2-audit.md`
- `scripts/validate-editorial-calendar.mjs`
- `scripts/verify-connected-history.mjs`
- `scripts/verify-history-explorer.mjs`
- `tests/editorial-calendar.test.mjs`
- `tests/season-integration.test.mjs`
