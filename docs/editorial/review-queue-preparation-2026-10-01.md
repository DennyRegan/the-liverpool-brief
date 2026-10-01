# Biography and historical-match review queue preparation — 1 October 2026

Branch: `editorial/match-report-migration-2026-10-01`. The completed migration remains intact. Latest main inspected at `1a76b3020d856f62227a5b928f64c44f0b956ee0`; its only change since the shared ancestor is the current Brief, outside this task. No main merge or deployment.

## Identity resolution

Added 17 missing opposition entities using existing lowercase kebab-case IDs and concise English registry labels. Checked the entire opposition registry for aliases before adding them. Resolved all 23 recorded blockers: 20 unpublished reports and three already-published reports. Added only `oppositionIds` to their 26 canonical/retained draft or public files. Recorded historical display names and all manuscript prose remain unchanged. Original evidence files remain byte-for-byte intact. `cska-sofia` and `sheffield-united` remain separate identities.

Configured source assessor: `gpt-6-astra`, worker `/root/club_identity_check`. All evidence below is **High confidence for club identity only**, retrieved from official clubs or competition bodies. This is not a new historical fact-check of the reports.

| Recorded name | Canonical ID | Canonical label | Official identity evidence |
| --- | --- | --- | --- |
| Alavés | `alaves` | Alavés | [UEFA: Deportivo Alavés](https://es.uefa.com/uefaeuropaleague/clubs/69619--alaves/) |
| Basel | `basel` | Basel | [UEFA: FC Basel 1893](https://www.uefa.com/uefaconferenceleague/clubs/59856--basel/) |
| Blackburn Rovers | `blackburn-rovers` | Blackburn Rovers | [EFL club names](https://www.efl.com/news/2026/april/14/referee-appointments--/) |
| Bolton Wanderers | `bolton-wanderers` | Bolton Wanderers | [Official club](https://www.bwfc.co.uk/) |
| Bradford | `bradford-city` | Bradford City | [Premier League: the 14 May 2000 fixture](https://www.premierleague.com/en/match/14700) |
| Brann | `brann` | Brann | [UEFA: SK Brann](https://es.uefa.com/uefaeuropaleague/clubs/52770--brann/) |
| Burnley | `burnley` | Burnley | [Official club](https://www.burnleyfootballclub.com/) |
| CSKA Moscow | `cska-moscow` | CSKA Moscow | [Liverpool official Super Cup record](https://www.liverpoolfc.com/history/honours/uefa-super-cup) |
| Celtic | `celtic` | Celtic | [UEFA club directory](https://www.uefa.com/uefachampionsleague/history/seasons/1971/clubs/) |
| Charlton | `charlton-athletic` | Charlton Athletic | [Official club](https://www.cafc.co.uk/) |
| Marseille | `marseille` | Marseille | [UEFA club directory](https://www.uefa.com/uefachampionsleague/history/seasons/1971/clubs/) |
| PSV | `psv-eindhoven` | PSV Eindhoven | [UEFA identities](https://www.uefa.com/uefachampionsleague/news/0292-1c178b043cfe-a27d7e4200c4-1000--paris-saint-germain-vs-psv-eindhoven-facts/) |
| Paris Saint-Germain | `paris-saint-germain` | Paris Saint-Germain | [UEFA identities](https://www.uefa.com/uefachampionsleague/news/0292-1c178b043cfe-a27d7e4200c4-1000--paris-saint-germain-vs-psv-eindhoven-facts/) |
| Sheffield Wednesday | `sheffield-wednesday` | Sheffield Wednesday | [EFL club names](https://www.efl.com/news/2026/april/14/referee-appointments--/) |
| Sion | `sion` | Sion | [UEFA: FC Sion](https://www.uefa.com/uefaconferenceleague/clubs/52824--sion/standings/) |
| Swindon Town | `swindon-town` | Swindon Town | [EFL club names](https://www.efl.com/news/2026/april/14/referee-appointments--/) |
| São Paulo | `sao-paulo` | São Paulo | [Official club identity](https://www.saopaulofc.net/institucional/sobre-o-sao-paulo-fc/) |

Bradford is specifically Bradford City, not Bradford Park Avenue. The original report retains “Bradford”. Alavés/Deportivo Alavés, Basel/FC Basel 1893, Brann/SK Brann, Marseille/Olympique de Marseille, Sion/FC Sion and São Paulo/São Paulo FC each denote one club, with the existing registry's concise reader-facing style. No separate alias entity was introduced. EFL evidence was used for Rovers, Wednesday and Swindon because their homepages returned empty extracted bodies.

## Queue results

- Biographies: 30 recovered unpublished manuscripts technically ready for review; zero blocked recovered manuscripts. Three expected biographies remain blocked and NOT LOCATED: Alan Hansen, Terry McDermott and Sami Hyypiä. The queue contains all 33 unpublished inventory records and excludes the published Phil Thompson biography.
- Matches: 99 unpublished manuscripts technically ready for review, zero blocked. This includes 90 recovered reports and nine repository-only drafts. Published duplicates remain outside the queue. The separate 1992–93 NOT LOCATED batch record is preserved without inventing manuscripts.
- Commands: `npm run --silent queue:biographies` and `npm run --silent queue:matches`. Implementation: `scripts/editorial-review-queue.mjs`. Authoritative state remains `docs/editorial/history-calendar.json` and the article files; match inventory remains `scripts/match-report-inventory.mjs`.
- Proposed biography order: canonical full subject name alphabetically, accent-insensitive code-point comparison; person ID breaks ties. Match order: historical date ascending; slug breaks ties. No existing explicit publication-order override was found. Weekly selections remain intact.
- Both queues currently return `nextApproved: null`. Nothing was approved or scheduled. Source/score information is carried only where the inventory already records it; missing structured scores remain null.

## Validation

- Shared editorial calendar: 370 records validated. Production history validation: 526 canonical entities, 240 Archive articles and 67 structured seasons validated.
- Tests: 185 passed, zero failures; extended queue tests also passed after adding reordered-calendar, duplicate-slug and alternate-public-title cases.
- Lint: zero errors; one pre-existing unused-variable warning in `tests/interactive-history-rendering.test.mjs`. All changed/new scripts and queue tests lint cleanly.
- Production build: passed compilation, TypeScript and all 470 static pages.
- HTTP checks against the local production build: all 270 passed. All 129 unpublished manuscripts returned 404 at their canonical article URLs and draft filesystem URLs. Calendar/report/script URLs also returned 404. Nine existing public/index/sitemap/robots routes returned 200. No unpublished slug was found in the sitemap. Evidence: `docs/editorial/review-queue-route-checks-2026-10-01.json`; repeat with a running local production server using `node scripts/check-editorial-review-routes.mjs http://127.0.0.1:3100`.
- Duplicate checks: canonical IDs and labels validated; queue subjects/slugs and match dates checked; retained published/draft copies reconciled by the existing match inventory. No new duplicate introduced.
- Preservation: compared all pre-existing article bodies and source files with before-task SHA-256 snapshots. All unchanged. Compared the entire calendar with its before-task version: only the 23 resolved identity-blocker messages changed. Approval, status, selection, featured week, provenance, sources and historical dates remained identical. The public Archive path set remained exactly the same 240 articles.

Technical validation is not a fresh historical fact-check. No articles were rewritten, published, approved or scheduled. No automatic scheduler/publisher, main merge or deployment was performed.
