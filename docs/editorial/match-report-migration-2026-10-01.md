# Match-report migration — 1 October 2026

Genuine existing Work-project manuscripts were recovered and reconciled without new research, replacement writing, publication or scheduling. Current main was inspected at `1f3a0f54d73059fe8c2ee8a2b094847b7a144beb` and fetched again before checkpointing. The working branch includes the completed biography migration checkpoint `2f2df21`, preserving its architecture and recovered work. It has not been merged to main.

| Recovery result | Count |
| --- | ---: |
| Unique finished Work-project reports retrieved | 122 |
| Already present as canonical repository reports | 41 |
| Newly migrated unpublished canonical drafts | 81 |
| Recovered reports already published before migration | 32 |
| Recovered reports remaining unpublished | 90 |
| Additional repository-only reports in the derived inventory | 211 |
| All unique matches in the derived repository inventory | 333 |

The 41 canonical duplicates comprise 32 published reports and nine unpublished 1994–95 drafts. A further pipeline predecessor exists for Istanbul 2005: its later, documented Work-package revision is one of the 81 newly migrated editorial drafts. Thus 42 recovered events had some repository manuscript before migration, while 41 already had canonical editorial/public article versions. This distinction avoids counting the pipeline predecessor as an existing final editorial article.

The full derived inventory contains 234 distinct already-public matches and 99 unpublished matches. The latter comprise the 90 recovered Work reports plus eight existing 1991–92 drafts and the existing Torres/Goodison 2008 report. These repository-only drafts were retained unchanged. Opinion-led match writing is excluded from this factual match inventory.

| Season | Recovered | New canonical drafts | Already public | Unpublished |
| --- | ---: | ---: | ---: | ---: |
| 1970-71 | 7 | 0 | 7 | 0 |
| 1971-72 | 6 | 0 | 6 | 0 |
| 1972-73 | 3 | 0 | 3 | 0 |
| 1974-75 | 1 | 0 | 1 | 0 |
| 1975-76 | 1 | 0 | 1 | 0 |
| 1991-92 | 1 | 0 | 1 | 0 |
| 1993-94 | 8 | 7 | 1 | 7 |
| 1994-95 | 9 | 0 | 0 | 9 |
| 1995-96 | 11 | 0 | 11 | 0 |
| 1996-97 | 12 | 12 | 0 | 12 |
| 1997-98 | 4 | 4 | 0 | 4 |
| 1998-99 | 5 | 5 | 0 | 5 |
| 1999-00 | 5 | 5 | 0 | 5 |
| 2000-01 | 9 | 9 | 0 | 9 |
| 2001-02 | 6 | 6 | 0 | 6 |
| 2002-03 | 6 | 6 | 0 | 6 |
| 2003-04 | 5 | 5 | 0 | 5 |
| 2004-05 | 9 | 8 | 1 | 8 |
| 2005-06 | 7 | 7 | 0 | 7 |
| 2006-07 | 7 | 7 | 0 | 7 |

## Authoritative inventory and storage

`docs/editorial/history-calendar.json` remains the sole status/approval/provenance source. Existing dated commissioning rows gain `matchRecovery`; 80 additional stock rows are in `matches`, with no fabricated anniversary week. One recovered Manchester City match uses the existing provisional 28 September 2002 row. Its real draft path and ready-for-review status were reconciled without changing its selection or featured week. All other pre-existing dated row fields, weekly selections, claims, approvals and published destinations were preserved. Biography rows were preserved.

Run `node scripts/match-report-inventory.mjs` (or `npm run --silent inventory:matches`) to obtain the machine-readable inventory derived from actual article files and this shared status record. Its output is read-only; do not maintain another JSON status file. Paths, canonical metadata, completed/published/unpublished states, review/approval flags, scheduling absence, duplicate resolution and blockers are exposed. Existing published/draft copies of the same match are grouped once.

New canonical drafts are under `docs/editorial/drafts/match-recovery/<season>/<slug>.md`. Original manuscripts are retained byte-for-byte as `.txt` provenance under `originals`; these are not additional publishable drafts. Research records, source notes, confidence labels and previous checks are retained alongside them. The 1997–2007 upload-support test patch is preserved as evidence but was not applied: unpublished storage does not change the public catalogue.

## Duplicates and latest manuscripts

Published articles and existing canonical drafts were retained with their prose and stable URLs unchanged. Specific renamed overlaps include Liverpool/Everton 1970, Barcelona 1976, Fowler/Fulham 1993 and Collymore/Newcastle 1996. Recovered originals remain available for later editorial comparison; differences were not blindly merged or treated as later approval. The separately saved 1993–94 and 1996–97 individual articles agree byte-for-byte with their package counterparts. Combined review copies and packaged article files were retained/reconciled as the same batches. All 62 ten-season package files match the original manifest SHA-256 checksums.

Istanbul 2005 uses the package’s completed revision under its established slug. The original pipeline output remains untouched and is explicitly linked as a predecessor; the package’s existing audit documents its corrections and retained authorship. No earlier manuscript was overwritten.

## Recovery gaps and metadata limits

**NOT LOCATED: 1992–93 batch.** The prior 1993–94 editor notes explicitly state that preceding-season completion could not be established. No finished 1992–93 batch or named selections could be retrieved from the available project folder, relevant global filename/content searches, accessible scratch files, current main, branches or repository history. This is a retrieval limitation, not proof that nothing was ever written. No replacement reports were researched or produced. Planned longlist entries and excluded reserve candidates were not counted as finished manuscripts.

No completed manuscripts are missing from the retrieved 62-file ten-season manifest or the 1993–94/1994–95/1995–96/1996–97 packages. The attached 199-match longlist and old progress record are preserved as provenance, not mistaken for 199 completed articles or used to replace the calendar.

Canonical opposition IDs are unavailable for 17 clubs: Alavés, Basel, Blackburn Rovers, Bolton Wanderers, Bradford, Brann, Burnley, CSKA Moscow, Celtic, Charlton, Marseille, PSV, Paris Saint-Germain, Sheffield Wednesday, Sion, Swindon Town and São Paulo. The inventory retains exact opposition labels and flags the 23 affected reports, including 20 unpublished ones. Optional absent relationships were not fabricated and the registry was not changed. Resolve these identities during later editorial review before adding relationships or clearing blockers. No missing manuscript source-list blocker was found; source coverage and earlier evidence limitations remain in the preserved notes.

## Validation

- Shared calendar and current Archive draft schemas pass for all 370 editorial rows, including 122 recovery records. Every migrated historical date, canonical season, supplied entity kind, slug and required metadata field validates. Dates and seasons were checked against saved package records; this is not new historical verification.
- All 179 tests pass, including recovery byte preservation, date/slug/identity checks, explicit-approval gates, unpublished isolation and duplicate-match rejection.
- Lint: zero errors; one pre-existing unused-variable warning in `tests/interactive-history-rendering.test.mjs`.
- Production build passed. No public content, application components, content loaders, public schemas, entity registry or dependency lockfile changed.
- 224 HTTP checks passed: 219 against a local production build and five against the existing live site. All 90 unpublished canonical URLs and all 90 unpublished draft-file URLs returned 404. All 32 pre-existing recovered public reports returned 200 locally; main public browsing routes and sitemap/robots returned 200. The editorial inventory path returned 404. Live homepage, Matches and three existing report samples returned 200. Results: `docs/editorial/match-migration-route-checks-2026-10-01.json`.
- Preserved manuscript Markdown contains original hard line-break spaces and, in some files, terminal blank lines; these were intentionally kept instead of silently rewriting recovered text.

Working branch: `editorial/match-report-migration-2026-10-01`. Batch checkpoints: `8d1783b`, `6748b37`, `970426c`; final validation/documentation is a subsequent checkpoint. Remote updates use normal fast-forward refs, never force-push. Main was unchanged at final reconciliation.

**Nothing was published, scheduled, approved or merged to main by this migration.** Existing publications remain published. All 81 newly migrated drafts and all 90 unpublished recovered reports await Denny’s review and later explicit publication approval.

Confidence: **high** for retrieved files, repository reconciliation, byte preservation and executed technical checks. Historical correctness was not freshly reassessed. Prior source confidence labels are preserved without upgrading them; unretrievable prior chat work remains NOT LOCATED.
