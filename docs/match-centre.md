# Match Centre and Analysis

## Architecture

- `/match-centre` is the current Liverpool men's competitive season utility. No live API, subscription or table client state. The reviewed league-table updater below refreshes stored sourced data through GitHub Actions and the existing Vercel Git integration.
- `content/match-centre/liverpool/current.json` selects a canonical `YYYY-YY.json` register. Keep the previous register when rolling the current pointer forward.
- Each fixture has one stable ID, canonical opposition/competition IDs, home/away/neutral, status, source references and optional date, UK-offset kick-off, venue, score, briefing and report slug. Keep its ID when rescheduling; do not create another record.
- Result scores use home–away order. At neutral venues Liverpool is listed first; record the score in that order. Penalties are separate from the final score and extra time is explicit.
- A report is the existing factual `content/archive/liverpool/<slug>.md` match article at `/archive/<slug>`. The register references it; it never stores another copy of the prose. The validator requires published factual match type, exact season/event date, opposition and competition. Report and Analysis publication are independent.
- The snapshot is derived from Liverpool's table row. Validation reconciles Liverpool's recorded league results with that row at the table's timestamp. The full table has separate source/update provenance.
- The dynamic server page selects the last recorded completed fixture and the next dated scheduled fixture. An elapsed kick-off without a recorded result is labelled awaiting an editorial update, never live or completed by inference. Postponed/cancelled/undated entries remain in the list but cannot become Next Match.
- Undated draws require a meaningful date note. Dates without times show Kick-off TBC. All times use Europe/London, including BST/GMT transitions.

## Editorial maintenance

1. Verify club/competition announcements and record the source's URL and check date.
2. Update the original fixture's date/time/status, or add a newly drawn fixture with a stable ID and canonical registry IDs. Do not guess cup dates or add friendlies.
3. Before a match, optionally add `briefing: { updatedAt, points: [...], sourceIds: [...] }`. Use one to six concise, verified points. Sources use the site's external-link convention. No filler is required when a briefing is absent.
4. After the match, set `status: completed` and record the score (and penalties/extra time where applicable). Publish an approved factual match report through the existing workflow, then set `reportSlug` to its canonical slug.
5. Refresh the complete league table with the validated command below, or maintain it editorially when automation stops for a source discrepancy. Preserve its source `asOf` time. Overall `updatedAt` records the latest verified change; individual source check dates remain separate.
6. Run validation, tests, lint and build. Recheck late fixture changes before release. Publication approval remains required.

For a new season, create the sourced fixture/table register, update `current.json`, and use the same season ID on appropriate canonical articles. Completed-season History records continue through the established Season workflow; do not invent an incomplete historical Season record just to obtain a link.

## Analysis

### Approved next-match previews

A fixture may have `preview: { title, body, updatedAt, sourceIds }`, with Markdown prose stored once on its existing stable fixture record. It is a preview, never a completed match report or an Archive article. The Next Match card links to the full-width `#match-preview` article on this page. Only the selected upcoming fixture's preview is rendered; it disappears from this position when that fixture is no longer next. Stored preview evidence IDs must resolve and its timestamp cannot exceed the register update. Source and confidence notes remain editorial, not part of the preview prose. Publication still requires Denny's approval.

On 18 September 2026, Denny approved the Bournemouth preview with its penultimate tactical paragraph removed. No other prose changes were authorised.

Articles supports `category: Opinion | Analysis`; legacy files without a category remain Opinion. All views preserve existing `/articles/<slug>` and legacy `/archive/<slug>` URLs. `/articles?type=analysis` and `?type=opinion` filter the same collection. No Analysis destination is added to the top-level navigation. Home's existing latest-writing selection supports both types.

Analysis can reuse the existing optional relationship fields: `season`, `historicalEventDate`, `historyEras`, `playerIds`, `managerIds`, `oppositionIds`, `competitionIds`, `locationIds`, `themeIds`, and `relatedMatches`. Their schemas and canonical IDs are shared with Archive. Invalid entity kinds, unknown IDs and draft/non-match `relatedMatches` fail validation.

Published Analysis is separately labelled on matching Season, eligible People/Opposition/Competition, managerial-era and explicitly related match pages. Article context links use existing published destinations; meaningful factual recommendations reuse the existing discovery rules. Analysis does not count towards V2 eligibility, enter factual History lists, or duplicate its prose in Archive. No new theme/location routes are created. No Analysis articles were written for this implementation.

Current-season reading selects exact `season` metadata across Opinion, Analysis and factual match reports. Eleven existing Opinion pieces about the current campaign/pre-season have `season: 2026-27` added; their prose, dates, categories and URLs are unchanged. The wider ownership article and multi-era retrospective are deliberately untagged. Dates alone never establish a season connection.

## Navigation

Match Centre takes the former top-level This Week slot. `/this-week` remains unchanged and is reachable from History navigation and the homepage. Top level: Home, The Brief, Articles, Match Centre, History, About. Native links, 44px mobile navigation/filter targets, keyboard focus and section anchors are retained.

## Seed data and limitations — checked 17 September 2026

The initial register contains 38 Premier League fixtures, eight Champions League league-phase fixtures and two League Cup ties. Six results have been recorded. Liverpool's table position is eighth after four league games (one win, three draws, six points); the table is explicitly as of 16 September, 17:30 BST.

- Initial dates/times/venues: [Anfield Online fixture list](https://www.anfield-online.co.uk/fixtures/2026-27/), cross-checked with [Liverpool results](https://www.liverpoolfc.com/matches/mens-team/results/2026/premier-league) and [Sky results](https://www.skysports.com/liverpool-scores-fixtures).
- [Liverpool's August/September changes](https://www.liverpoolfc.com/news/three-premier-league-fixture-changes-liverpool-august-and-september) confirm the Bournemouth kick-off.
- [Official European schedule](https://www.liverpoolfc.com/news/champions-league-fixture-details-liverpools-eight-league-phase-matches) supplies the eight European fixtures. The existing canonical `european-cup` ID is reused; Match Centre displays Champions League.
- The secondary list's Tottenham date is stale. [Club ticket details](https://www.liverpoolfc.com/news/liverpool-v-tottenham-hotspur-carabao-cup-ticket-details?amp=1) and the [club report](https://lfcbeta.liverpoolfc.com/news/liverpool-beat-spurs-secure-carabao-cup-progress-anfield) establish 15 September, 20:00 BST, Liverpool 3–1 Tottenham.
- [Official festive changes](https://www.liverpoolfc.com/news/festive-fixtures-updates-three-liverpools-premier-league-games) override the secondary schedule for Hull, Villa and Sunderland. Coventry remains 2 January at 15:00 GMT.
- [Chelsea fourth-round draw](https://www.liverpoolfc.com/news/liverpool-face-chelsea-carabao-cup-fourth-round?amp=1) gives the week commencing 26 October; exact date/time remain unconfirmed. It appears in the separate undated group.
- [Sky's table](https://www.skysports.com/premier-league-table) supplies all 20 rows. Cached official/secondary tables inspected during research were older and were not substituted for this timestamped table.

Future fixtures can change, later cup draws are not yet known, and results/table/briefings require editorial updates and a normal content deployment. No free/paid API is silently used. There are currently no published 2026–27 factual match reports or Analysis pieces in the repository, so those optional displays are absent in the real collection. Disposable integration fixtures verify them without publishing test content.

## Verified automatic league table — October 2026

This section supersedes the table-maintenance limitation above once the feature is reviewed and merged. The seed-data section is a dated implementation record, not a current inventory.

The table shows all 20 clubs in source position order with Pos, Team, P, W, D, L, GF, GA, GD and Pts. GD is calculated from the source GF/GA after verifying that it agrees with Sky's published GD. Liverpool uses the existing restrained highlight. On mobile the labelled, keyboard-focusable table region scrolls horizontally, with position and team retained at the left. No badges or new team registry are needed.

### Source and cost

Reuse the existing [Sky Sports Premier League table](https://www.skysports.com/premier-league-table) and its parser in `scripts/lib/prepare-league-table.mjs`. It exposes all 20 rows in public HTML without an API key or paid subscription. This is a public web page, not a contracted API: markup changes or access restrictions stop refreshes. No new service, source credentials, database or server is introduced. Existing GitHub Actions/Vercel account usage and limits still apply.

The official Premier League table did not expose usable table rows in the retrieved server HTML. Sky already has the site's canonical team mappings and complete sourced columns, so it avoids a parallel provider integration. No fallback invents standings from fixtures.

The existing Liverpool-result reconciliation remains unchanged. When Sky's Liverpool row includes additional games, the updater fetches the relevant monthly [Liverpool scores/fixtures](https://www.skysports.com/liverpool-scores-fixtures) pages. Only explicit `FT`, completed Premier League results can fill existing scheduled fixture records matched uniquely by date, home/away and canonical opposition. IDs, dates, kick-offs, reports, previews and cup fixtures are preserved. Newly recorded scores get the exact monthly source URL and check date. A conflicting score, changed schedule, ambiguous fixture or postponed/cancelled fixture requires editorial review and stops the whole candidate. This limited score import is necessary to keep the existing strict table validator working; it is not fixture scheduling automation or live score coverage.

### Schedule and deployment

`.github/workflows/league-table.yml` runs at **14:23, 16:23, 18:23, 20:23 and 22:23 UTC daily**. During BST these are **15:23, 17:23, 19:23, 21:23 and 23:23 UK time**; during GMT they are the UTC times. This covers afternoon, evening and midweek games for every club, not only Liverpool. GitHub's scheduled jobs can be delayed. The updater fetches one table per run; monthly Liverpool results are requested only if its played count increases. Unchanged standings create no timestamp-only commits, build or deployment.

After a valid changed candidate, the job runs validation, focused updater tests, the full tests, lint and production build. It commits only the current Match Centre JSON and normally pushes to main, which uses the same Vercel Git integration as the existing History publisher. The built-in short-lived GITHUB_TOKEN is sufficient for repository writes; no additional token or deploy hook is added. Actual first automated main push/deployment must be verified after review and activation; local checks do not prove an Actions-generated production deployment.

The job shares the existing History publisher's repository-writer concurrency group. It checks that main has not changed while it worked and uses a normal push. A race is rejected rather than rebased/force-pushed; the next scheduled run starts from current main. Scheduled publishing remains inactive on this review branch. Manual workflow dispatch defaults to a dry run; uncheck `dry_run` on reviewed main to force a validated update.

### Failure behaviour and provenance

Every candidate requires exactly 20 existing clubs and unique positions 1–20; valid integer values and P=W+D+L; GD=GF−GA; Pts=3W+D; whole-league wins/losses, draws and goal totals; position ordering; and no regression in games played or snapshot time. A points adjustment is held for human review. Source times outside the current season or in the future are rejected. The unchanged full content loader validates entity/report references and reconciles Liverpool's complete scores before replacement.

The source's displayed last-update time becomes table `asOf`, interpreted in Europe/London within the selected canonical season. Retrieval time updates source `checkedOn`; it does not masquerade as the standings date. The fixture schedule's check date is displayed separately, so a table fetch cannot relabel the schedule as freshly verified.

Timeouts, HTTP errors, missing columns, incomplete responses, stale tables or inconsistent rows fail without changing the stored JSON. Replacement is atomic after full candidate validation. A source might be briefly inconsistent while games finish; the next scheduled run retries. A failed validation/build never reaches the commit step. The Actions summary records the reason; existing good data remains public with its original as-of time.

During implementation on **8 October**, the actual Sky response displayed **20 September, 17:15 BST**, older than the stored **21 September, 13:55 BST** snapshot. The live check correctly rejected it. No table values or source timestamps were guessed or changed to bypass that guard. Source freshness is a current external limitation; the schedule cannot make stale upstream data current.

### Manual refresh and verification

```sh
npm run table:refresh -- --check # fetch/validate only (also the default)
npm run table:refresh -- --write # atomically update the local register if valid and changed
node scripts/validate-history.mjs
node scripts/verify-table-updater.mjs
npm test
npm run lint
npm run build
node scripts/verify-match-centre.mjs
```

The local command does not commit, push or deploy. Review the JSON diff and follow the normal approval process. `npm run table:prepare` remains the original proposal-only editorial command. The deterministic updater verification uses temporary copied content and synthetic provider responses; it never changes published files or needs network access.

## Verification commands

```sh
node scripts/validate-history.mjs
npm test
npm run lint
npm run build
node scripts/verify-match-centre.mjs
node scripts/verify-seasons.mjs
node scripts/verify-history-explorer.mjs
node scripts/verify-homepage.mjs
node scripts/verify-article-week.mjs
node scripts/verify-interactive-history.mjs
BASE_URL=http://127.0.0.1:3155 node scripts/verify-connected-history.mjs
BASE_URL=http://127.0.0.1:3155 node scripts/verify-exploration.mjs
```

The first integration script uses a disposable project and removes it on exit. It checks report/briefing presence and absence, current reading, both Article filters, reciprocal Analysis connections in six historical contexts and draft rejection. It never writes fixtures into the working published folders.
