# Connected History V2 — review

Branch: `feature/connected-history-v2`. Base main: `13b4a7d46bd2b0aad088e9e4c1280169ad07ee3a`. Local review only: no push, merge or production deployment.

## Implementation

Build-time, deterministic entity collections use the existing factual Archive loader and canonical registry. No article bodies are copied, no reverse lists are stored, and no service, dependency or client-side index is added. Existing Related Reading remains unchanged. The three route families have static eligible parameters, canonical metadata and 404s for unknown, wrong-kind or thin entities. See the V2 section of [Connected History](../connected-history.md) for the complete implementation contract.

- People detail: `/history/people/[id]`; the sole index remains `/history/players`, now labelled People, with the original biographies retained below the exploration directory.
- Opposition: `/history/opposition` and `/history/opposition/[id]`.
- Competitions: `/history/competitions` and `/history/competitions/[id]`.
- Existing Seasons, era routes, canonical Archive URLs, Matches, This Week and Interactive History remain.

Thresholds are the requested three distinct factual articles for people and five for opposition/competitions. They produce **41 People, 10 Opposition and six Competition destinations** (57 total), from 210 factual articles among 212 public Archive files. Two classified Opinion articles remain outside V2. The saved Torres derby is excluded entirely. Structured Season occurrences do not inflate eligibility.

The original audit counted all canonical writing, including draft-only and unreviewed pieces. These counts instead reflect the approved factual classifications and the public loader, so they intentionally differ: Dalglish has 44 rather than 46, Everton 32 rather than 33, and First Division 101 rather than 102.

## People — top 20 by published factual article count

| Destination | Articles |
| --- | ---: |
| Kenny Dalglish | 44 |
| Ian Rush | 42 |
| John Barnes | 25 |
| Kevin Keegan | 25 |
| John Toshack | 22 |
| Steve Heighway | 19 |
| Graeme Souness | 18 |
| Bob Paisley | 17 |
| Bill Shankly | 15 |
| Jimmy Case | 15 |
| Phil Neal | 15 |
| Ray Kennedy | 15 |
| Terry McDermott | 15 |
| John Aldridge | 14 |
| Bruce Grobbelaar | 12 |
| Peter Beardsley | 12 |
| Craig Johnston | 11 |
| David Fairclough | 11 |
| Steve McMahon | 11 |
| David Johnson | 10 |

## All eligible opposition

| Destination | Articles |
| --- | ---: |
| Everton | 32 |
| Arsenal | 16 |
| Manchester United | 14 |
| Tottenham Hotspur | 10 |
| Manchester City | 8 |
| Nottingham Forest | 8 |
| Leeds United | 7 |
| Newcastle United | 7 |
| West Ham United | 6 |
| Benfica | 5 |

## All eligible competitions

| Destination | Articles |
| --- | ---: |
| First Division | 101 |
| European Cup | 39 |
| FA Cup | 28 |
| League Cup | 18 |
| UEFA Cup | 11 |
| Charity Shield | 7 |

## Presentation and connections

People use one identity across player and manager roles. Player-only, manager-only and dual-role sections are mutually exclusive. Each section follows historical season order and then event date; no-season career pieces remain in a separate wider-history group. Opposition and competition pages use season groups too. Native disclosures prevent the First Division's 101 articles becoming one uninterrupted list. Missing Season records are never linked. People also connect to existing structured seasons and exact matching managerial-era labels, including both Dalglish spells and the joint Evans/Houllier era.

The History landing page adds three concise entry points. Permanent navigation gains no extra tabs: Players is renamed People and Interactive History remains. Factual article pages gain up to five valid entity links while keeping the existing Season control and Related Reading. Opinion pages have no new entity panel.

## Metadata dependency and publication safety

This review branch contains the completed metadata audit, reconciled with newer main registry additions, and Denny's six classification decisions. Four articles become explicitly factual: Barnes 1987, Palace 9–0, Dalglish at Goodison and Phil Thompson. Tottenham 7–0 and the Keegan/Hamburg essay become explicitly Opinion. These were already public articles; no new article is published. The earlier audit report remains a dated record, not current publication status.

All 409 existing Markdown bodies were compared byte-for-byte after frontmatter against the base: unchanged. Canonical slugs, public content membership, calendar rows, Opinion collection, Season records, era records and This Week content remain unchanged. No body is duplicated. The loader continues to exclude editorial drafts, including Torres 2008. A temporary fixture confirms that metadata alone does not expose a draft and normal approved file-placement publication automatically updates entity eligibility.

## Validation

- Calendar validation: 215 entries passed.
- Full suite: 132 tests passed, zero failures. Includes eligibility, unique article counts, roles, chronology, career separation, Season/era links, Opinion exclusion, draft isolation and automatic future publication.
- Lint: passed. Production build: passed.
- V2 HTTP: all 57 detail pages, all 212 article exploration panels, 335 linked routes, canonical tags, exact article order/deduplication and eight unknown/thin/wrong-kind/draft routes passed.
- Seasons: all 67 pages, 298 internal destinations, exact previous/next links, conditional sections and invalid routes passed.
- History Explorer: 16 eras, 234 existing routes and two invalid routes passed.
- Connected History: all Archive articles, factual browsers, biography URLs, recommendations, 16 eras, nine This Week links, 13 Opinion routes and collections passed.
- This Week article-only checks and existing Interactive History public/draft-boundary checks passed.
- Existing non-fatal Node module-format advisories and expected invalid-route diagnostics remain.

## Mobile review

Desktop and 390 × 844 mobile review used the available in-app browser because the agent-browser executable is unavailable. People headings and navigation wrap; the checked pages have no horizontal overflow. Native First Division season groups expand on touch, retain readable cards and link to the existing Season page. Article exploration controls are at least 44px high. Browser console inspection found no errors. The original Barnes article → John Barnes exploration → 1987–88 Season journey was completed on mobile. First Division groups were expanded by touch and toggled closed using Space with focus on the native summary. Desktop Dalglish layout was also inspected.

## Compromises and deferred work

- Era records contain manager labels rather than person IDs. V2 uses exact canonical name matches (splitting the existing joint tenure label), never guessed dates. Explicit person references in the existing era schema would make future renames more robust.
- The existing publication boundary is still file placement plus deployment; calendar status is not a content gate. This task does not change that architecture.
- Static collections update at the next build. Eligibility reflects the present writing, not complete historical coverage.
- People stays at the established `/history/players` index URL to avoid competing indexes or broken bookmarks.
- V3 possibilities remain unimplemented: search, theme/location destinations, richer structured identity facts, and explicit era-person references. No graph, generated biography, database, external API or runtime AI was introduced.

## Exact review steps before merge

1. Review this feature branch against base `13b4a7d`, first the audit dependency commit, then the V2 implementation. Check all six classifications against Denny's decisions and confirm the article prose invariant.
2. Run `npm run validate:calendar`, `npm test`, `npm run lint` and `npm run build`.
3. Run `node scripts/verify-seasons.mjs`, `node scripts/verify-history-explorer.mjs`, `node scripts/verify-article-week.mjs` and `node scripts/verify-interactive-history.mjs`.
4. Start `npm start -- --hostname 127.0.0.1 --port 3152`. Run `BASE_URL=http://127.0.0.1:3152 node scripts/verify-exploration.mjs` and `BASE_URL=http://127.0.0.1:3152 node scripts/verify-connected-history.mjs`.
5. Open `/history`, the People index, Dalglish, Rush, Everton, European Cup and First Division pages. Check the two Dalglish era links, exclusive dual-role group, season disclosures and Phil Thompson's career section. Follow an article → person → season → article loop and confirm Related Reading remains.
6. At 390px width, test disclosure toggles, wrapping, article links and keyboard focus. Confirm unknown/thin entities and the Torres derby return 404.
7. Review the existing Matches filters, both original factual biographies, the two Opinion articles, This Week and Interactive History. Refresh against main and rerun affected checks before any later merge.
8. Obtain separate approval to merge and deploy. This task has performed neither.

## Every created or modified file

Includes the audited metadata dependency as well as V2. A = created; M = modified.

- M · `app/archive/[slug]/page.tsx`
- A · `app/components/ArticleExploration.tsx`
- A · `app/components/history/EntityExploration.tsx`
- M · `app/components/history/HistoryBrowse.tsx`
- M · `app/components/history/HistoryNav.tsx`
- A · `app/history/competitions/[id]/page.tsx`
- A · `app/history/competitions/page.tsx`
- M · `app/history/history.css`
- A · `app/history/opposition/[id]/page.tsx`
- A · `app/history/opposition/page.tsx`
- M · `app/history/page.tsx`
- A · `app/history/people/[id]/page.tsx`
- M · `app/history/players/page.tsx`
- M · `content/archive/liverpool/aberdeen-liverpool-1980-mcdermott-chip.md`
- M · `content/archive/liverpool/alonso-own-half-newcastle-2006.md`
- M · `content/archive/liverpool/anfield-first-european-match-reykjavik-1964.md`
- M · `content/archive/liverpool/arsenal-liverpool-1973-first-away-win.md`
- M · `content/archive/liverpool/arsenal-liverpool-1987-barnes-beardsley-debuts.md`
- M · `content/archive/liverpool/athletic-bilbao-liverpool-1983-rush-header.md`
- M · `content/archive/liverpool/bayern-liverpool-1981-ray-kennedy-away-goal.md`
- M · `content/archive/liverpool/benfica-liverpool-1978-hughes-winner.md`
- M · `content/archive/liverpool/benfica-liverpool-1984-dalglish-three-assists.md`
- M · `content/archive/liverpool/benfica-liverpool-1984-quarter-final-survival.md`
- M · `content/archive/liverpool/bill-shankly-testimonial-anfield-1975.md`
- M · `content/archive/liverpool/bristol-city-liverpool-1974-toshack-cup-quarter-final.md`
- M · `content/archive/liverpool/brugge-liverpool-1976-uefa-cup-double.md`
- M · `content/archive/liverpool/chelsea-liverpool-1986-dalglish-title-winner.md`
- M · `content/archive/liverpool/chelsea-liverpool-1989-five-at-stamford-bridge.md`
- M · `content/archive/liverpool/coventry-liverpool-1990-barnes-hat-trick.md`
- M · `content/archive/liverpool/derby-liverpool-1972-mcgovern-title-race.md`
- M · `content/archive/liverpool/derby-liverpool-1976-keegan-comeback-winner.md`
- M · `content/archive/liverpool/dinamo-liverpool-1984-rush-double.md`
- M · `content/archive/liverpool/dinamo-tbilisi-liverpool-1979-european-exit.md`
- M · `content/archive/liverpool/everton-liverpool-1973-alan-waddle.md`
- M · `content/archive/liverpool/everton-liverpool-1973-hughes-double.md`
- M · `content/archive/liverpool/everton-liverpool-1980-goodison-derby.md`
- M · `content/archive/liverpool/everton-liverpool-1982-midfield-goals.md`
- M · `content/archive/liverpool/everton-liverpool-1982-rush-four.md`
- M · `content/archive/liverpool/everton-liverpool-1986-super-cup-rush-hat-trick.md`
- M · `content/archive/liverpool/everton-liverpool-1988-houghton-cup-header.md`
- M · `content/archive/liverpool/everton-liverpool-1988-unbeaten-start-ends.md`
- M · `content/archive/liverpool/everton-liverpool-1989-return-at-goodison.md`
- M · `content/archive/liverpool/everton-liverpool-1989-rush-double-takes-top-spot.md`
- M · `content/archive/liverpool/flamengo-liverpool-1981-tokyo-defeat.md`
- M · `content/archive/liverpool/forshaw-hat-trick-manchester-united-1925.md`
- M · `content/archive/liverpool/fowler-scoring-debut-fulham-1993.md`
- M · `content/archive/liverpool/hamburg-liverpool-1977-fairclough-super-cup.md`
- M · `content/archive/liverpool/henderson-chelsea-winner-2016.md`
- M · `content/archive/liverpool/ipswich-liverpool-1978-dalglish-double.md`
- M · `content/archive/liverpool/john-barnes-1987.md`
- M · `content/archive/liverpool/leeds-liverpool-1971-early-winner.md`
- M · `content/archive/liverpool/leeds-liverpool-1972-phil-boersma.md`
- M · `content/archive/liverpool/leeds-liverpool-1975-callaghan-double.md`
- M · `content/archive/liverpool/leeds-liverpool-1979-record-points.md`
- M · `content/archive/liverpool/liverpool-7-tottenham-0.md`
- M · `content/archive/liverpool/liverpool-9-crystal-palace-0.md`
- M · `content/archive/liverpool/liverpool-aberdeen-1980-quarter-finals.md`
- M · `content/archive/liverpool/liverpool-arsenal-1971-fa-cup-final.md`
- M · `content/archive/liverpool/liverpool-arsenal-1971-ian-ross.md`
- M · `content/archive/liverpool/liverpool-arsenal-1971-toshack-smith.md`
- M · `content/archive/liverpool/liverpool-arsenal-1978-league-cup-semi-final.md`
- M · `content/archive/liverpool/liverpool-arsenal-1979-charity-shield.md`
- M · `content/archive/liverpool/liverpool-arsenal-1980-dalglish-second-replay.md`
- M · `content/archive/liverpool/liverpool-arsenal-1980-hillsborough-stalemate.md`
- M · `content/archive/liverpool/liverpool-arsenal-1980-talbot-third-replay.md`
- M · `content/archive/liverpool/liverpool-arsenal-1985-dalglish-first-competitive-match.md`
- M · `content/archive/liverpool/liverpool-arsenal-1987-nicholas-league-cup-final.md`
- M · `content/archive/liverpool/liverpool-arsenal-1988-aldridge-second-replay.md`
- M · `content/archive/liverpool/liverpool-arsenal-1989-barnes-free-kick.md`
- M · `content/archive/liverpool/liverpool-arsenal-1989-thomas-title-decider.md`
- M · `content/archive/liverpool/liverpool-aston-villa-1979-eleventh-title.md`
- M · `content/archive/liverpool/liverpool-aston-villa-1980-cohen-title.md`
- M · `content/archive/liverpool/liverpool-austria-vienna-1985-walsh-double.md`
- M · `content/archive/liverpool/liverpool-az-1981-hansen-late-winner.md`
- M · `content/archive/liverpool/liverpool-barcelona-1976-thompson-semi-final.md`
- M · `content/archive/liverpool/liverpool-bayern-1981-anfield-draw.md`
- M · `content/archive/liverpool/liverpool-benfica-1978-european-cup-semi-final.md`
- M · `content/archive/liverpool/liverpool-birmingham-1972-comeback.md`
- M · `content/archive/liverpool/liverpool-brighton-1983-case-cup-winner.md`
- M · `content/archive/liverpool/liverpool-brugge-1978-european-cup-final.md`
- M · `content/archive/liverpool/liverpool-coventry-1988-beardsley-new-year-double.md`
- M · `content/archive/liverpool/liverpool-cska-sofia-1981-souness-treble.md`
- M · `content/archive/liverpool/liverpool-derby-1971-jack-whitham.md`
- M · `content/archive/liverpool/liverpool-derby-county-1978-five-goals.md`
- M · `content/archive/liverpool/liverpool-dinamo-1984-lee-header.md`
- M · `content/archive/liverpool/liverpool-dynamo-berlin-1972-uefa-cup.md`
- M · `content/archive/liverpool/liverpool-dynamo-dresden-1977-five-goal-defence.md`
- M · `content/archive/liverpool/liverpool-everton-1972-cormack-winner.md`
- M · `content/archive/liverpool/liverpool-everton-1972-four-goal-derby.md`
- M · `content/archive/liverpool/liverpool-everton-1976-fairclough-derby-winner.md`
- M · `content/archive/liverpool/liverpool-everton-1977-replay-wembley.md`
- M · `content/archive/liverpool/liverpool-everton-1977-semi-final-draw.md`
- M · `content/archive/liverpool/liverpool-everton-1981-dalglish-double.md`
- M · `content/archive/liverpool/liverpool-everton-1983-derby-lead.md`
- M · `content/archive/liverpool/liverpool-everton-1984-sharp-volley.md`
- M · `content/archive/liverpool/liverpool-everton-1984-souness-replay-winner.md`
- M · `content/archive/liverpool/liverpool-everton-1984-wembley-draw.md`
- M · `content/archive/liverpool/liverpool-everton-1986-eight-points-behind.md`
- M · `content/archive/liverpool/liverpool-everton-1986-rush-double-wembley.md`
- M · `content/archive/liverpool/liverpool-everton-1986-shared-charity-shield.md`
- M · `content/archive/liverpool/liverpool-everton-1986-super-cup-first-leg.md`
- M · `content/archive/liverpool/liverpool-everton-1987-barnes-creates-derby-win.md`
- M · `content/archive/liverpool/liverpool-everton-1987-rush-equals-dean.md`
- M · `content/archive/liverpool/liverpool-everton-1989-rush-extra-time-double.md`
- M · `content/archive/liverpool/liverpool-everton-1990-barnes-beardsley-derby-double.md`
- M · `content/archive/liverpool/liverpool-everton-comeback-1970.md`
- M · `content/archive/liverpool/liverpool-gladbach-1977-first-european-cup.md`
- M · `content/archive/liverpool/liverpool-gladbach-1978-semi-final.md`
- M · `content/archive/liverpool/liverpool-hamburg-1977-super-cup.md`
- M · `content/archive/liverpool/liverpool-hibernian-1975-toshack-headers.md`
- M · `content/archive/liverpool/liverpool-ipswich-1975-toshack-double.md`
- M · `content/archive/liverpool/liverpool-ipswich-1976-three-equalisers.md`
- M · `content/archive/liverpool/liverpool-ipswich-1977-kennedy-keegan.md`
- M · `content/archive/liverpool/liverpool-leeds-1973-cormack-keegan.md`
- M · `content/archive/liverpool/liverpool-leeds-1974-charity-shield.md`
- M · `content/archive/liverpool/liverpool-leeds-1977-fairclough-league-victory.md`
- M · `content/archive/liverpool/liverpool-leicester-1974-semi-final-replay.md`
- M · `content/archive/liverpool/liverpool-leicester-1987-rush-hat-trick.md`
- M · `content/archive/liverpool/liverpool-luton-1983-rush-five.md`
- M · `content/archive/liverpool/liverpool-man-united-1988-molby-penalty.md`
- M · `content/archive/liverpool/liverpool-manchester-city-1972-opening-day.md`
- M · `content/archive/liverpool/liverpool-manchester-city-1974-boxing-day.md`
- M · `content/archive/liverpool/liverpool-manchester-city-1981-boxing-day-defeat.md`
- M · `content/archive/liverpool/liverpool-manchester-city-1982-dalglish-hat-trick.md`
- M · `content/archive/liverpool/liverpool-manchester-united-1973-ten-home-wins.md`
- M · `content/archive/liverpool/liverpool-manchester-united-1977-fa-cup-final.md`
- M · `content/archive/liverpool/liverpool-manchester-united-1979-boxing-day.md`
- M · `content/archive/liverpool/liverpool-manchester-united-1985-molby-turnaround.md`
- M · `content/archive/liverpool/liverpool-manchester-united-1985-replay-defeat.md`
- M · `content/archive/liverpool/liverpool-manchester-united-1985-two-late-equalisers.md`
- M · `content/archive/liverpool/liverpool-manchester-united-1988-two-goal-lead-lost.md`
- M · `content/archive/liverpool/liverpool-newcastle-1972-five-goal-win.md`
- M · `content/archive/liverpool/liverpool-newcastle-1972-five-goals.md`
- M · `content/archive/liverpool/liverpool-newcastle-1974-fa-cup-final.md`
- M · `content/archive/liverpool/liverpool-newcastle-1975-toshack-mcdermott.md`
- M · `content/archive/liverpool/liverpool-newcastle-1987-aldridge-double.md`
- M · `content/archive/liverpool/liverpool-norwich-1979-six-goals.md`
- M · `content/archive/liverpool/liverpool-norwich-1986-walsh-hat-trick.md`
- M · `content/archive/liverpool/liverpool-nottingham-forest-1978-european-cup-exit.md`
- M · `content/archive/liverpool/liverpool-nottingham-forest-1978-league-cup-replay.md`
- M · `content/archive/liverpool/liverpool-nottingham-forest-1978-wembley-draw.md`
- M · `content/archive/liverpool/liverpool-nottingham-forest-1982-late-recovery.md`
- M · `content/archive/liverpool/liverpool-nottingham-forest-1988-aldridge-semi-final-double.md`
- M · `content/archive/liverpool/liverpool-nottingham-forest-1988-five-at-anfield.md`
- M · `content/archive/liverpool/liverpool-nottingham-forest-1989-rescheduled-semi-final.md`
- M · `content/archive/liverpool/liverpool-oulu-1980-ten-goals.md`
- M · `content/archive/liverpool/liverpool-oulu-1981-rush-first-goal.md`
- M · `content/archive/liverpool/liverpool-oxford-1986-dalglish-creates-six-goal-win.md`
- M · `content/archive/liverpool/liverpool-panathinaikos-1985-rush-double.md`
- M · `content/archive/liverpool/liverpool-qpr-1986-dalglish-returns.md`
- M · `content/archive/liverpool/liverpool-qpr-1987-barnes-takes-liverpool-top.md`
- M · `content/archive/liverpool/liverpool-qpr-1990-eighteenth-title.md`
- M · `content/archive/liverpool/liverpool-real-madrid-1981-third-european-cup.md`
- M · `content/archive/liverpool/liverpool-saint-etienne-1977-fairclough-winner.md`
- M · `content/archive/liverpool/liverpool-sheffield-united-1972-five-goals.md`
- M · `content/archive/liverpool/liverpool-sold-their-best-player.md`
- M · `content/archive/liverpool/liverpool-southampton-1976-toshack-charity-shield.md`
- M · `content/archive/liverpool/liverpool-southampton-1986-rush-extra-time-double.md`
- M · `content/archive/liverpool/liverpool-stoke-1976-eight-goal-easter.md`
- M · `content/archive/liverpool/liverpool-stromsgodset-record-win-1974.md`
- M · `content/archive/liverpool/liverpool-swansea-1990-rush-replay-hat-trick.md`
- M · `content/archive/liverpool/liverpool-tottenham-1985-molby-two-penalties.md`
- M · `content/archive/liverpool/liverpool-tranmere-1979-second-half.md`
- M · `content/archive/liverpool/liverpool-walsall-1984-semi-final-draw.md`
- M · `content/archive/liverpool/liverpool-west-bromwich-albion-1977-dalglish-third-goal.md`
- M · `content/archive/liverpool/liverpool-west-ham-1977-tenth-title.md`
- M · `content/archive/liverpool/liverpool-west-ham-1980-mcdermott-shield.md`
- M · `content/archive/liverpool/liverpool-west-ham-1981-final-draw.md`
- M · `content/archive/liverpool/liverpool-west-ham-1981-first-league-cup.md`
- M · `content/archive/liverpool/liverpool-west-ham-1984-four-before-half-hour.md`
- M · `content/archive/liverpool/liverpool-west-ham-1989-four-second-half-goals.md`
- M · `content/archive/liverpool/liverpool-widzew-1983-victory-elimination.md`
- M · `content/archive/liverpool/liverpool-wimbledon-1988-aldridge-shield-double.md`
- M · `content/archive/liverpool/liverpool-wimbledon-1988-fa-cup-final-defeat.md`
- M · `content/archive/liverpool/liverpool-zurich-1977-first-european-cup-final.md`
- M · `content/archive/liverpool/liverpools-manager-scored-after-21-seconds-at-goodison.md`
- M · `content/archive/liverpool/man-united-liverpool-1989-seven-minutes.md`
- M · `content/archive/liverpool/manchester-city-liverpool-1976-fairclough-double.md`
- M · `content/archive/liverpool/manchester-city-liverpool-1978-souness-double.md`
- M · `content/archive/liverpool/manchester-city-liverpool-1979-dalglish-double.md`
- M · `content/archive/liverpool/manchester-city-liverpool-1982-five-goals.md`
- M · `content/archive/liverpool/manchester-united-liverpool-1972-thompson-debut.md`
- M · `content/archive/liverpool/manchester-united-liverpool-1978-boxing-day.md`
- M · `content/archive/liverpool/manchester-united-liverpool-1982-johnston-winner.md`
- M · `content/archive/liverpool/mcmahon-four-fulham-ten-goals-1986.md`
- M · `content/archive/liverpool/middlesbrough-liverpool-1977-dalglish-league-debut.md`
- M · `content/archive/liverpool/palace-liverpool-1990-semi-final.md`
- M · `content/archive/liverpool/phil-thompson.md`
- M · `content/archive/liverpool/red-star-liverpool-1973-lawler-away-goal.md`
- M · `content/archive/liverpool/saint-etienne-liverpool-1977-first-leg-deficit.md`
- M · `content/archive/liverpool/saunders-four-kuusysi-european-return-1991.md`
- M · `content/archive/liverpool/torres-babel-six-goals-hull-2009.md`
- M · `content/archive/liverpool/tottenham-liverpool-1971-heighway-clemence.md`
- M · `content/archive/liverpool/tottenham-liverpool-1973-heighway-away-goal.md`
- M · `content/archive/liverpool/tottenham-liverpool-1975-four-scorers.md`
- M · `content/archive/liverpool/tottenham-liverpool-1980-mcdermott-volley.md`
- M · `content/archive/liverpool/tottenham-liverpool-1982-dalglish-recovery.md`
- M · `content/archive/liverpool/watford-liverpool-1986-rush-replay-winner.md`
- M · `content/archive/liverpool/widzew-liverpool-1983-two-goal-deficit.md`
- M · `content/archive/liverpool/zurich-liverpool-1977-neal-first-leg-win.md`
- M · `content/history/liverpool/entities.json`
- M · `docs/connected-history.md`
- M · `docs/editorial/drafts/015-liverpool-sheffield-united-1972-five-goals.md`
- M · `docs/editorial/drafts/016-leeds-liverpool-1972-phil-boersma.md`
- M · `docs/editorial/drafts/017-liverpool-everton-1972-cormack-winner.md`
- M · `docs/editorial/drafts/018-liverpool-newcastle-1972-five-goal-win.md`
- M · `docs/editorial/drafts/019-liverpool-birmingham-1972-comeback.md`
- M · `docs/editorial/drafts/020-liverpool-dynamo-berlin-1972-uefa-cup.md`
- M · `docs/editorial/drafts/021-everton-liverpool-1973-hughes-double.md`
- M · `docs/editorial/drafts/023-liverpool-leeds-1973-cormack-keegan.md`
- M · `docs/editorial/drafts/024-tottenham-liverpool-1973-heighway-away-goal.md`
- M · `docs/editorial/drafts/025-liverpool-gladbach-1973-keegan-toshack-final.md`
- M · `docs/editorial/drafts/026-gladbach-liverpool-1973-first-european-trophy.md`
- M · `docs/editorial/drafts/027-red-star-liverpool-1973-lawler-away-goal.md`
- M · `docs/editorial/drafts/028-arsenal-liverpool-1973-first-away-win.md`
- M · `docs/editorial/drafts/029-liverpool-red-star-1973-european-lesson.md`
- M · `docs/editorial/drafts/030-everton-liverpool-1973-alan-waddle.md`
- M · `docs/editorial/drafts/031-liverpool-manchester-united-1973-ten-home-wins.md`
- M · `docs/editorial/drafts/032-bristol-city-liverpool-1974-toshack-cup-quarter-final.md`
- M · `docs/editorial/drafts/033-liverpool-leicester-1974-semi-final-replay.md`
- M · `docs/editorial/drafts/034-liverpool-newcastle-1974-fa-cup-final.md`
- M · `docs/editorial/drafts/035-tottenham-liverpool-1974-shankly-final-league-match.md`
- M · `docs/editorial/drafts/036-liverpool-leeds-1974-charity-shield.md`
- M · `docs/editorial/drafts/039-liverpool-manchester-city-1974-boxing-day.md`
- M · `docs/editorial/drafts/040-liverpool-ipswich-1975-toshack-double.md`
- M · `docs/editorial/drafts/041-liverpool-newcastle-1975-toshack-mcdermott.md`
- M · `docs/editorial/drafts/042-bill-shankly-testimonial-anfield-1975.md`
- M · `docs/editorial/drafts/043-leeds-liverpool-1975-callaghan-double.md`
- M · `docs/editorial/drafts/044-liverpool-hibernian-1975-toshack-headers.md`
- M · `docs/editorial/drafts/045-tottenham-liverpool-1975-four-scorers.md`
- M · `docs/editorial/drafts/046-liverpool-ipswich-1976-three-equalisers.md`
- M · `docs/editorial/drafts/047-barcelona-liverpool-1976-toshack-advantage.md`
- M · `docs/editorial/drafts/048-liverpool-everton-1976-fairclough-derby-winner.md`
- M · `docs/editorial/drafts/049-liverpool-barcelona-1976-thompson-semi-final.md`
- M · `docs/editorial/drafts/050-liverpool-stoke-1976-eight-goal-easter.md`
- M · `docs/editorial/drafts/051-manchester-city-liverpool-1976-fairclough-double.md`
- M · `docs/editorial/drafts/052-liverpool-brugge-1976-anfield-final-comeback.md`
- M · `docs/editorial/drafts/053-wolves-liverpool-1976-title-at-molineux.md`
- M · `docs/editorial/drafts/054-brugge-liverpool-1976-uefa-cup-double.md`
- M · `docs/editorial/drafts/055-liverpool-southampton-1976-toshack-charity-shield.md`
- M · `docs/editorial/drafts/056-derby-liverpool-1976-keegan-comeback-winner.md`
- M · `docs/editorial/drafts/057-saint-etienne-liverpool-1977-first-leg-deficit.md`
- M · `docs/editorial/drafts/058-liverpool-saint-etienne-1977-fairclough-winner.md`
- M · `docs/editorial/drafts/059-liverpool-leeds-1977-fairclough-league-victory.md`
- M · `docs/editorial/drafts/060-zurich-liverpool-1977-neal-first-leg-win.md`
- M · `docs/editorial/drafts/061-liverpool-zurich-1977-first-european-cup-final.md`
- M · `docs/editorial/drafts/062-liverpool-everton-1977-semi-final-draw.md`
- M · `docs/editorial/drafts/063-liverpool-everton-1977-replay-wembley.md`
- M · `docs/editorial/drafts/064-liverpool-ipswich-1977-kennedy-keegan.md`
- M · `docs/editorial/drafts/065-liverpool-west-ham-1977-tenth-title.md`
- M · `docs/editorial/drafts/066-liverpool-manchester-united-1977-fa-cup-final.md`
- M · `docs/editorial/drafts/067-liverpool-gladbach-1977-first-european-cup.md`
- M · `docs/editorial/drafts/068-middlesbrough-liverpool-1977-dalglish-league-debut.md`
- M · `docs/editorial/drafts/069-liverpool-west-bromwich-albion-1977-dalglish-third-goal.md`
- M · `docs/editorial/drafts/070-liverpool-dynamo-dresden-1977-five-goal-defence.md`
- M · `docs/editorial/drafts/071-hamburg-liverpool-1977-fairclough-super-cup.md`
- M · `docs/editorial/drafts/072-liverpool-hamburg-1977-super-cup.md`
- M · `docs/editorial/drafts/073-liverpool-arsenal-1978-league-cup-semi-final.md`
- M · `docs/editorial/drafts/074-benfica-liverpool-1978-hughes-winner.md`
- M · `docs/editorial/drafts/075-liverpool-benfica-1978-european-cup-semi-final.md`
- M · `docs/editorial/drafts/076-liverpool-nottingham-forest-1978-wembley-draw.md`
- M · `docs/editorial/drafts/077-liverpool-nottingham-forest-1978-league-cup-replay.md`
- M · `docs/editorial/drafts/078-liverpool-gladbach-1978-semi-final.md`
- M · `docs/editorial/drafts/079-liverpool-brugge-1978-european-cup-final.md`
- M · `docs/editorial/drafts/080-ipswich-liverpool-1978-dalglish-double.md`
- M · `docs/editorial/drafts/081-manchester-city-liverpool-1978-souness-double.md`
- M · `docs/editorial/drafts/084-liverpool-nottingham-forest-1978-european-cup-exit.md`
- M · `docs/editorial/drafts/085-liverpool-derby-county-1978-five-goals.md`
- M · `docs/editorial/drafts/086-manchester-united-liverpool-1978-boxing-day.md`
- M · `docs/editorial/drafts/087-liverpool-norwich-1979-six-goals.md`
- M · `docs/editorial/drafts/088-liverpool-aston-villa-1979-eleventh-title.md`
- M · `docs/editorial/drafts/089-leeds-liverpool-1979-record-points.md`
- M · `docs/editorial/drafts/090-liverpool-arsenal-1979-charity-shield.md`
- M · `docs/editorial/drafts/091-liverpool-tranmere-1979-second-half.md`
- M · `docs/editorial/drafts/092-dinamo-tbilisi-liverpool-1979-european-exit.md`
- M · `docs/editorial/drafts/093-manchester-city-liverpool-1979-dalglish-double.md`
- M · `docs/editorial/drafts/094-liverpool-manchester-united-1979-boxing-day.md`
- M · `docs/editorial/drafts/095-everton-liverpool-1980-goodison-derby.md`
- M · `docs/editorial/drafts/096-tottenham-liverpool-1980-mcdermott-volley.md`
- M · `docs/editorial/drafts/097-liverpool-arsenal-1980-hillsborough-stalemate.md`
- M · `docs/editorial/drafts/098-liverpool-arsenal-1980-dalglish-second-replay.md`
- M · `docs/editorial/drafts/099-liverpool-arsenal-1980-talbot-third-replay.md`
- M · `docs/editorial/drafts/100-liverpool-aston-villa-1980-cohen-title.md`
- M · `docs/editorial/drafts/101-liverpool-west-ham-1980-mcdermott-shield.md`
- M · `docs/editorial/drafts/102-liverpool-oulu-1980-ten-goals.md`
- M · `docs/editorial/drafts/103-aberdeen-liverpool-1980-mcdermott-chip.md`
- M · `docs/editorial/drafts/104-liverpool-aberdeen-1980-quarter-finals.md`
- M · `docs/editorial/drafts/105-liverpool-cska-sofia-1981-souness-treble.md`
- M · `docs/editorial/drafts/106-liverpool-west-ham-1981-final-draw.md`
- M · `docs/editorial/drafts/107-liverpool-west-ham-1981-first-league-cup.md`
- M · `docs/editorial/drafts/108-liverpool-bayern-1981-anfield-draw.md`
- M · `docs/editorial/drafts/109-bayern-liverpool-1981-ray-kennedy-away-goal.md`
- M · `docs/editorial/drafts/110-liverpool-real-madrid-1981-third-european-cup.md`
- M · `docs/editorial/drafts/111-liverpool-oulu-1981-rush-first-goal.md`
- M · `docs/editorial/drafts/112-liverpool-az-1981-hansen-late-winner.md`
- M · `docs/editorial/drafts/113-liverpool-everton-1981-dalglish-double.md`
- M · `docs/editorial/drafts/114-flamengo-liverpool-1981-tokyo-defeat.md`
- M · `docs/editorial/drafts/115-liverpool-manchester-city-1981-boxing-day-defeat.md`
- M · `docs/editorial/drafts/117-everton-liverpool-1982-midfield-goals.md`
- M · `docs/editorial/drafts/118-manchester-united-liverpool-1982-johnston-winner.md`
- M · `docs/editorial/drafts/119-manchester-city-liverpool-1982-five-goals.md`
- M · `docs/editorial/drafts/120-tottenham-liverpool-1982-dalglish-recovery.md`
- M · `docs/editorial/drafts/121-liverpool-nottingham-forest-1982-late-recovery.md`
- M · `docs/editorial/drafts/123-everton-liverpool-1982-rush-four.md`
- M · `docs/editorial/drafts/124-liverpool-manchester-city-1982-dalglish-hat-trick.md`
- M · `docs/editorial/drafts/125-liverpool-brighton-1983-case-cup-winner.md`
- M · `docs/editorial/drafts/126-widzew-liverpool-1983-two-goal-deficit.md`
- M · `docs/editorial/drafts/127-liverpool-widzew-1983-victory-elimination.md`
- M · `docs/editorial/drafts/131-liverpool-luton-1983-rush-five.md`
- M · `docs/editorial/drafts/132-athletic-bilbao-liverpool-1983-rush-header.md`
- M · `docs/editorial/drafts/133-liverpool-everton-1983-derby-lead.md`
- M · `docs/editorial/drafts/134-liverpool-walsall-1984-semi-final-draw.md`
- M · `docs/editorial/drafts/135-benfica-liverpool-1984-dalglish-three-assists.md`
- M · `docs/editorial/drafts/136-liverpool-everton-1984-wembley-draw.md`
- M · `docs/editorial/drafts/137-liverpool-everton-1984-souness-replay-winner.md`
- M · `docs/editorial/drafts/138-liverpool-west-ham-1984-four-before-half-hour.md`
- M · `docs/editorial/drafts/139-liverpool-dinamo-1984-lee-header.md`
- M · `docs/editorial/drafts/140-dinamo-liverpool-1984-rush-double.md`
- M · `docs/editorial/drafts/143-liverpool-everton-1984-sharp-volley.md`
- M · `docs/editorial/drafts/145-benfica-liverpool-1984-quarter-final-survival.md`
- M · `docs/editorial/drafts/146-liverpool-austria-vienna-1985-walsh-double.md`
- M · `docs/editorial/drafts/147-liverpool-panathinaikos-1985-rush-double.md`
- M · `docs/editorial/drafts/148-liverpool-manchester-united-1985-two-late-equalisers.md`
- M · `docs/editorial/drafts/149-liverpool-manchester-united-1985-replay-defeat.md`
- M · `docs/editorial/drafts/151-liverpool-arsenal-1985-dalglish-first-competitive-match.md`
- M · `docs/editorial/drafts/153-liverpool-tottenham-1985-molby-two-penalties.md`
- M · `docs/editorial/drafts/154-liverpool-manchester-united-1985-molby-turnaround.md`
- M · `docs/editorial/drafts/155-liverpool-everton-1986-eight-points-behind.md`
- M · `docs/editorial/drafts/156-liverpool-qpr-1986-dalglish-returns.md`
- M · `docs/editorial/drafts/157-watford-liverpool-1986-rush-replay-winner.md`
- M · `docs/editorial/drafts/158-liverpool-oxford-1986-dalglish-creates-six-goal-win.md`
- M · `docs/editorial/drafts/159-liverpool-southampton-1986-rush-extra-time-double.md`
- M · `docs/editorial/drafts/160-chelsea-liverpool-1986-dalglish-title-winner.md`
- M · `docs/editorial/drafts/161-liverpool-everton-1986-rush-double-wembley.md`
- M · `docs/editorial/drafts/162-liverpool-everton-1986-shared-charity-shield.md`
- M · `docs/editorial/drafts/163-liverpool-everton-1986-super-cup-first-leg.md`
- M · `docs/editorial/drafts/165-everton-liverpool-1986-super-cup-rush-hat-trick.md`
- M · `docs/editorial/drafts/166-liverpool-norwich-1986-walsh-hat-trick.md`
- M · `docs/editorial/drafts/167-liverpool-leicester-1987-rush-hat-trick.md`
- M · `docs/editorial/drafts/168-liverpool-arsenal-1987-nicholas-league-cup-final.md`
- M · `docs/editorial/drafts/169-liverpool-everton-1987-rush-equals-dean.md`
- M · `docs/editorial/drafts/170-arsenal-liverpool-1987-barnes-beardsley-debuts.md`
- M · `docs/editorial/drafts/171-liverpool-qpr-1987-barnes-takes-liverpool-top.md`
- M · `docs/editorial/drafts/172-liverpool-everton-1987-barnes-creates-derby-win.md`
- M · `docs/editorial/drafts/173-liverpool-newcastle-1987-aldridge-double.md`
- M · `docs/editorial/drafts/174-liverpool-coventry-1988-beardsley-new-year-double.md`
- M · `docs/editorial/drafts/175-everton-liverpool-1988-houghton-cup-header.md`
- M · `docs/editorial/drafts/176-everton-liverpool-1988-unbeaten-start-ends.md`
- M · `docs/editorial/drafts/177-liverpool-manchester-united-1988-two-goal-lead-lost.md`
- M · `docs/editorial/drafts/178-liverpool-nottingham-forest-1988-aldridge-semi-final-double.md`
- M · `docs/editorial/drafts/179-liverpool-nottingham-forest-1988-five-at-anfield.md`
- M · `docs/editorial/drafts/180-liverpool-wimbledon-1988-fa-cup-final-defeat.md`
- M · `docs/editorial/drafts/181-liverpool-wimbledon-1988-aldridge-shield-double.md`
- M · `docs/editorial/drafts/182-liverpool-man-united-1988-molby-penalty.md`
- M · `docs/editorial/drafts/183-liverpool-arsenal-1988-aldridge-second-replay.md`
- M · `docs/editorial/drafts/184-man-united-liverpool-1989-seven-minutes.md`
- M · `docs/editorial/drafts/186-everton-liverpool-1989-return-at-goodison.md`
- M · `docs/editorial/drafts/187-liverpool-nottingham-forest-1989-rescheduled-semi-final.md`
- M · `docs/editorial/drafts/188-liverpool-everton-1989-rush-extra-time-double.md`
- M · `docs/editorial/drafts/189-liverpool-west-ham-1989-four-second-half-goals.md`
- M · `docs/editorial/drafts/190-liverpool-arsenal-1989-thomas-title-decider.md`
- M · `docs/editorial/drafts/192-everton-liverpool-1989-rush-double-takes-top-spot.md`
- M · `docs/editorial/drafts/193-liverpool-arsenal-1989-barnes-free-kick.md`
- M · `docs/editorial/drafts/194-chelsea-liverpool-1989-five-at-stamford-bridge.md`
- M · `docs/editorial/drafts/195-liverpool-swansea-1990-rush-replay-hat-trick.md`
- M · `docs/editorial/drafts/196-liverpool-everton-1990-barnes-beardsley-derby-double.md`
- M · `docs/editorial/drafts/197-palace-liverpool-1990-semi-final.md`
- M · `docs/editorial/drafts/198-liverpool-qpr-1990-eighteenth-title.md`
- M · `docs/editorial/drafts/199-coventry-liverpool-1990-barnes-hat-trick.md`
- M · `docs/editorial/drafts/anfield-first-european-match-reykjavik-1964.md`
- M · `docs/editorial/drafts/forshaw-hat-trick-manchester-united-1925.md`
- M · `docs/editorial/drafts/fowler-scoring-debut-fulham-1993.md`
- M · `docs/editorial/drafts/henderson-chelsea-winner-2016.md`
- M · `docs/editorial/drafts/liverpool-monaco-champions-league-2004.md`
- M · `docs/editorial/drafts/liverpool-stromsgodset-record-win-1974.md`
- M · `docs/editorial/drafts/mcmahon-four-fulham-ten-goals-1986.md`
- M · `docs/editorial/drafts/saunders-four-kuusysi-european-return-1991.md`
- M · `docs/editorial/drafts/torres-babel-six-goals-hull-2009.md`
- M · `docs/editorial/drafts/torres-first-hat-trick-reading-2007.md`
- M · `docs/editorial/drafts/torres-goodison-derby-double-2008.md`
- A · `docs/research/connected-history-v2-review.md`
- A · `docs/research/historical-metadata-v2-audit.json`
- A · `docs/research/historical-metadata-v2-audit.md`
- A · `lib/content/exploration.ts`
- M · `scripts/validate-editorial-calendar.mjs`
- M · `scripts/verify-connected-history.mjs`
- A · `scripts/verify-exploration.mjs`
- M · `tests/editorial-calendar.test.mjs`
- A · `tests/exploration.test.mjs`
- M · `tests/history-browsing.test.mjs`
- M · `tests/interactive-history-integration.test.mjs`
- M · `tests/season-integration.test.mjs`
