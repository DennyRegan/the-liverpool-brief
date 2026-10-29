# Connected History — local review, 29 October 2026

## Outcome and preview

The six-part History library and its first integrated season review are implemented in the existing `history-prototype` checkout, on `prototype/interactive-history-1987-88`. This is a local development result, not a released feature or an approval of withdrawn writing.

- History: <http://127.0.0.1:3147/history>
- Season: <http://127.0.0.1:3147/history/seasons/1987-88>
- Planned series: <http://127.0.0.1:3147/history/series/klopps-liverpool>
- Verified anniversary example: <http://127.0.0.1:3147/history/on-this-day?date=2026-04-13>
- Historical search: <http://127.0.0.1:3147/search?q=John%20Barnes>
- Local Sunday Brief discovery: <http://127.0.0.1:3147/preview/history/newsletter?end=2026-04-19>

Run `npm run prototype:start` after `npm run prototype:build`, or `npm run prototype` for development. The launcher binds only to 127.0.0.1. The normal production build can be checked separately with `npm start -- --hostname 127.0.0.1 --port 3148`.

## A. What existed and what was inspected

The current retained site had the simplified writing-led homepage, Articles, About, permanent article URLs, validated historical entities and eras, Archive/Article schemas, Sender newsletter integration and social previews. It had two public factual historical reports, two retained Opinion Archive pieces, and no current public History browsing or search routes.

The separate 1987–88 prototype already had a preserved sourced Season record, five report selections, a chronological reading list, a four-ground atlas with one London marker and a dedicated historical reader. Four reports were held outside public content; Forest remained a public article. Its schema, provenance, original prose and map geometry were reusable.

Read the pre-reset connected-history and seasons-publishing documentation from the preserved `writing-first` checkout, plus current loaders, metadata, publishing tests and prototype notes. Reviewed the existing 1987–88 inventory: twelve distinct preserved match reports, five selected in the prototype, one of those retained publicly. No new historical reporting was commissioned or written. The other seven reports and unpublished biography research were not restored.

Latest GitHub main was checked through the connected GitHub tool: `e03e9cbaad34860ac77152d95dcd16230b2aa143`, immediately following the prototype base `56e5b2f`. Its only change was the approved Bradley Opinion article. That exact file was brought into this local checkout, verified against Git blob `9f0ef7258b11dc0c760408333f2d102ccd843fda`. Application code was otherwise current. The checkout’s `origin` points to an older local mirror, so it was not treated as authoritative GitHub main. No merge, rebase, commit or push was made.

## B. Permanent navigation and design

Main navigation now includes History. The main homepage body is unchanged: no large widgets or six category blocks were added. History has its own text-first entrance, compact six-category navigation, a season feature, a short published-reading selection and a restrained planned-series link. Existing serif/sans typography and editorial red remain; History uses warm paper, thin rules and readable vertical lists.

| Destination | What it does | How it connects |
| --- | --- | --- |
| Seasons | Available chronological season editions | Season metadata selects original articles; people and competitions resolve from the same registry |
| People | Players/managers with available material | Distinct player/manager roles, season context, biographies and series chapters |
| Classic Matches | Published factual match reports | Native season/opposition/competition filters; canonical report links |
| Series | Reusable multi-part writing system | Normal articles ordered by existing series/part fields; planned entries stay unlinked |
| On This Day | Verified anniversaries for a chosen date | Exact event dates, source records, article and subject links |
| Explore History | Simple subject-led browsing | Existing person/opposition/competition/location/theme relationships |

A sparse person page explicitly presents connected reading rather than pretending to be a biography. A subject needs at least one actual article, available season or configured series connection; registry membership alone is insufficient. This replaces the old large-library eligibility thresholds and suits the current small collection.

## C. How 1987–88 works

Readers enter through History → Seasons → 1987–88. The page reuses the existing season overview, sourced facts, transfers and people, then the original five-match chronological selection. Each report is labelled either published or withdrawn/local review. Canonical article URLs and bodies are preserved. Return links include a stable match fragment, bringing the reader back to the selected report’s position. Local reader previous/next links follow the five-match selection.

The map is optional and closed initially; London still groups Highbury and the original Wembley, while Anfield shows both selected matches. It uses the existing local geometry and coordinates, without a map service or added dependency.

The Season record itself remains private review material under `prototype/`. The integrated route is guarded by the existing explicit local flag plus loopback Host. In normal mode the review season and four withdrawn reports return 404. Public search, sitemap, anniversaries and newsletter selection exclude them even when local review is enabled. The ordinary History infrastructure remains usable with its two approved factual reports and planned series.

This completes the first season’s navigable structure, **not its editorial coverage or publication approval**. The page explicitly says it is a selected collection. The full twelve-report audit and identified gaps remain in `../../output/1987-88-research/01-existing-material-inventory.md` and its companion research file. In particular, the title-clinching Tottenham match has no existing standalone report in that audit; it was not filled with generated text here.

## D. Reuse, connected reading, series and anniversaries

Reused the pre-reset deterministic lexical search function and related-reading scoring function, with current approved-content selectors. Kept existing entity IDs, season identity/schema, original article loaders, canonical URLs and the prototype atlas/reader. No database, external recommendation service, new dependency or duplicate article store was introduced.

Continue Reading returns at most three relevant approved factual articles, excluding the current article. Subject and season links appear only for available destinations. Opinion series chapters keep their normal schema and classification and can appear in a separately labelled series section, without being silently treated as factual History.

Klopp’s Liverpool has a landing page, introduction and 21 numbered planned slots, with zero chapter manuscripts or fabricated titles. Publication status is derived from canonical public article availability. Previous/next skips unavailable slots and is labelled “available chapter”; first/last chapters have no invalid boundary link. The ordering and withdrawal behaviour are tested with temporary fixtures rather than publishing sample chapters.

On This Day currently has **one** verified entry: the existing Forest match on 13 April 1988. Its factual title/excerpt are reused, with a dated match-identity/result verification and two existing source links. Other calendar dates show a clear empty state. Article publication dates never determine anniversaries. Approved dated Season events with high-confidence supporting sources can join automatically; local review seasons cannot. Review scope is explicit: it does not certify every narrative detail of an article. London calendar dates, invalid dates, leap days and seven-day newsletter windows are covered by tests.

## E. Search and The Sunday Brief

Historical search reuses the earlier lexical/prefix engine at `/search`, server-rendered over approved material. Names and labels from metadata make player, manager, season, opposition and competition queries work without parsing relationships out of prose. Results preserve canonical article URLs. Empty planned series and all private/withdrawn material are excluded. No competing search backend was created.

The local editorial discovery page selects the seven calendar days ending on a chosen date, with verified anniversaries, published biographies, newly published chapters and other approved historical reading. It exposes sources and links for copying into an editorial draft. Selection is curated by the editor; nothing is automatically ranked as mandatory, published or emailed. Sender configuration, signup, subscription and sending code remain unchanged.

## Adding approved work

Full authoring contracts are in `connected-history.md` and `seasons-publishing.md`.

- Biographies: use the existing Archive schema, appropriate article type, substantial canonical player/manager IDs and explicit factual approval. Use a principal season only when justified. Keep draft manuscripts outside public content until approved. The next approved build derives the people/season/search/reading connections.
- Series chapters: use a normal approved Archive or Article file, with `series: klopps-liverpool`, positive `part`, and existing relevant entity/season metadata. Do not create a duplicate series copy. A different series needs one definition, not another rendering system. The loader rejects unknown series, duplicate parts and invalid ordering.
- Seasons: only after explicit editorial approval, place the approved canonical record in the standard Season directory. Relationships and adjacent season links are derived; do not maintain reverse article lists or previous/next fields.
- Anniversaries: supply an actual historical date and a verification record whose sources support the stated event, or a reviewed sourced Season event. Never create entries just to fill the calendar.

## Remaining editorial work and limitations

There are no published biographies or series chapters to populate those collections yet. Only two factual historical reports are currently public. Four selected 1987–88 reports and the Season reference still need republication approval; the other seven preserved reports have not been restored. A substantial library requires approved writing, not more placeholder pages.

The earlier audit’s historical cautions remain: empty article-level manager IDs, the QPR clipping inside a differently named PDF, disputed Nicol/Forest assists and match-detail source conflicts. None were silently repaired or presented as newly fact-checked. The event verification covers the Forest match identity, date and result only.

Audio, interviews, paywalls, membership, statistics dashboards, current Match Centre, automated writing and all publishing schedules remain outside scope. There is no new newsletter sender or email automation.

No files in the synced `sources/` directory were modified. Existing article prose and approved content files are unchanged; the only new journalism file is the exact already-live Bradley article from latest GitHub main. All changes remain local and uncommitted. No deployment, merge, restoration into public historical content or new historical article publication took place.

## Verification evidence

See the final logs and screenshots in `../../output/connected-history-review-2026-10-29/` (relative to the project workspace). Validation checks public content, series/source metadata and preserved prototype hashes. Tests cover publication boundaries, automatic connections, search, dates, recommendations and chapter navigation. HTTP checks walk the six destinations and their internal links/fragments in both normal and local-review modes.

Browser review covers desktop plus 390- and 320-pixel mobile layouts, the season/report/return journey, player-name search, native anniversary form, keyboard map activation, the Anfield pair and London grouping. All six category links have 48-pixel height at 320 pixels; map marker targets remain 44 × 44. No horizontal overflow was observed in the tested narrow views. This is focused keyboard/responsive checking, not a complete assistive-technology accessibility audit.


### Final results — 29 October 2026

| Check | Result |
| --- | --- |
| Connected History validation | Passed: 2 approved factual articles, 0 public seasons, 12 connected subjects, 1 planned series, 1 verified event |
| Existing prototype validation | Passed: preserved season/report hashes, canonical links and four venue records |
| Repository tests | 47 passed, 0 failed |
| ESLint | Passed |
| Normal production build | Passed, including TypeScript checking |
| Local-review production build | Passed, including TypeScript checking |
| Production HTTP verification, local review | Passed: 55 successful routes, links/fragments and exclusion checks |
| Production HTTP verification, normal mode | Passed: 35 successful routes; private season/reports/editorial tools unavailable |
| Final browser console | No warnings or errors captured on the reviewed production pages |
| Diff whitespace check | Passed |

The existing Node module-type warning in validation scripts is non-blocking; lint and both builds pass. No tests, dependencies or deployment configuration were added to suppress it.

[History desktop screenshot](../../output/connected-history-review-2026-10-29/history-desktop.jpg) · [Season desktop screenshot](../../output/connected-history-review-2026-10-29/season-desktop.jpg) · [Season mobile screenshot](../../output/connected-history-review-2026-10-29/season-mobile.jpg)

Review server: http://127.0.0.1:3147/history (local to this Mac). The separate normal-mode test server was stopped after verification.
