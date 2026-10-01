# Next ten biography production — selection record

Selected after checking current main, biography migration, match migration and disabled publisher branches, plus candidate paths across all fetched branches. Existing set: 30 completed unpublished biographies, Phil Thompson published, three NOT LOCATED. Candidate Shankly and Klopp event articles are not career manuscripts. All ten canonical person IDs already exist.

This is a selection/evidence note, not a second status inventory. Current status remains in history-calendar.json. New production, not recovered originals. No publication, schedule or approval.

| Subject | Inclusion reason | Astra worker |
| --- | --- | --- |
| Bill Shankly | The manager whose rebuilding established the foundations of modern Liverpool. | /root/shankly_hunt |
| Roger Hunt | A central scorer in the return to the First Division and the first Shankly honours. | /root/shankly_hunt |
| Jürgen Klopp | The manager who restored European and league success across a defining modern era. | /root/klopp_fagan |
| Joe Fagan | Boot Room continuity, the 1984 treble and a managerial career requiring careful Heysel context. | /root/klopp_fagan |
| Billy Liddell | A major pre-Shankly figure whose career connects post-war success with the Second Division years. | /root/liddell_stjohn |
| Ian St John | A transformative signing and central forward in the first Shankly team. | /root/liddell_stjohn |
| Ron Yeats | The captain and defensive foundation of Liverpool’s rise under Shankly. | /root/yeats_hughes |
| Emlyn Hughes | A major captain linking Shankly’s rebuilding to Paisley’s European champions. | /root/yeats_hughes |
| Tommy Smith | A long-serving defender whose career spans Liverpool’s transformation and first European Cup. | /root/smith_souness |
| Graeme Souness | A central midfielder and captain of the dominant European side, with a contrasting managerial return. | /root/smith_souness |

## First manuscript checkpoint

Completed: Bill Shankly, Billy Liddell, Joe Fagan, Ron Yeats and Tommy Smith. Each has a separate retrieved-source record and post-draft factual audit. Remaining subjects retain writing claims; no partial manuscript is labelled complete. All five are ready_for_review with null approval, null published destination and no publication date. The calendar and derived queue remain authoritative.

Technical checks at this checkpoint: calendar validation passed; full suite 200/200 passed; lint zero errors with the existing unused-variable warning in tests/interactive-history-rendering.test.mjs. Focused new-production queue test also passed. Production build and HTTP checks follow after the complete batch. Independent source spot-checking is ongoing and will be recorded separately.

Concurrency: latest main remains 1a76b302; both match production branches were fetched and their biography sets inspected. Neither introduces any of these ten subjects. Their ongoing match work remains on its own branches; this branch does not overwrite those refs. Direct Git push has no credentials in this environment, so checkpoint commits use the authenticated GitHub Git-data API, with non-forced ref updates and fetched tree verification.

## Completed batch and final validation

Exactly ten new career biographies completed, with retrieved-source research followed by separate statement-level author audits and targeted independent Astra review. The ten use existing canonical person IDs. No NOT LOCATED manuscript was represented as recovered; Alan Hansen, Terry McDermott and Sami Hyypiä remain the three historical recovery gaps.

Approximate counts below exclude frontmatter, headings and Sources. The source of truth for completion and queue readiness remains the shared calendar, not this audit snapshot.

| Subject ID / manuscript filename | Prose words | Linked sources |
| --- | ---: | ---: |
| `bill-shankly.md` | 2,265 | 24 |
| `roger-hunt.md` | 1,307 | 15 |
| `jurgen-klopp.md` | 2,591 | 40 |
| `joe-fagan.md` | 1,389 | 15 |
| `billy-liddell.md` | 1,535 | 16 |
| `ian-st-john.md` | 1,304 | 12 |
| `ron-yeats.md` | 1,163 | 12 |
| `emlyn-hughes.md` | 1,410 | 17 |
| `tommy-smith.md` | 1,327 | 15 |
| `graeme-souness.md` | 1,819 | 21 |

All manuscripts are under `docs/editorial/drafts/biographies/`. Each has adjacent `<person-id>-research-record.md` and `<person-id>-factual-audit.md` files; `next-ten-independent-review.md` holds the independent review. Public copy has one bottom Sources list and no internal confidence/model labels. Research notes identify the actual Astra model/worker and source-specific confidence. These are AI-written reference biographies, not Denny's original writing.

Shankly and Klopp received extended legendary treatment. Liddell's pre-Shankly importance and Souness's substantial player/manager story also required additional space. No arbitrary common word limit was applied. The existing era catalogue begins with Shankly; Liddell's earlier career is covered in prose without inventing a pre-1959 era or single-season metadata.

**Inventory:** 40 completed unpublished biographies, including these ten; all technically ready in the existing derived queue. Three NOT LOCATED records remain blocked and are not counted as completed. Phil Thompson remains the separately published biography. Each new row is `ready_for_review`, with `biographyProduction.completed: true`, `reviewRequired: true`, `researchStatus: verified`, null claim, null approval and null published destination. All ten have `publicationClass: automatic-history-biography` for compatibility only. `automaticHistory.enabled` remains false and its runs remain empty. No publication date or anniversary/release slot was assigned.

**Factual limits:** source disagreements are recorded per subject and resolved through stronger records, limited attribution or omission. Examples include historical appearance/goal conventions, retirement versus final-match dates, Yeats's transfer fee, Hughes/Smith captaincy chronology and Fagan's compressed official biography chronology. The independent review corrected Smith's material omission of Gayle's testimony and two scope/chronology sentences in Klopp's article. No known material unresolved assertion remains in the included prose. The independent pass is targeted checking, not a claim to have repeated every author's source retrieval. No inaccessible source is represented as retrieved evidence.

**Executed technical checks — High confidence:**

- Shared calendar: 420 records validate; all ten new metadata records, canonical people/eras, unique subjects/slugs and source/audit paths pass. Every bottom source link is present in its research evidence.
- Focused new-production fixture proves completion/research/evidence gates, duplicate rejection, blocker exclusion and existing automatic-queue compatibility without invented recovery provenance or approval.
- Full test suite: 200 passed, zero failed. Lint: zero errors, one pre-existing unused-variable warning in `tests/interactive-history-rendering.test.mjs`.
- Production build: successful compilation, TypeScript and 470 generated static pages. No new public route or article was included.
- Local production HTTP verification: 358 checks passed across 173 unpublished articles and existing public/index/metadata routes; all unpublished article/draft URLs returned 404 and none leaked into sitemap. A further 21 checks confirmed all new research/audit files and the independent review are inaccessible. Total: 379 passed checks.
- The original separately launched local server could not be reached from a later isolated command. Running server and checker together in the same execution successfully completed the real HTTP verification. This was an execution-network issue, not an application repair.
- Public collections, app, libraries and workflow files are byte-unchanged from this batch's starting claim commit. Existing migrated biography manuscripts remain unchanged. No schedule, approval, publication, deployment or main-branch write was performed.

Machine-readable evidence: `docs/editorial/biography-production-validation-2026-10-01.json`, `docs/editorial/biography-production-route-checks-2026-10-01.json`, and `docs/editorial/biography-evidence-route-checks-2026-10-01.json`.

**Remote preservation:** claim/reconciliation commit `50e52b3`; first-five checkpoint `3b7f48d`; second-five and final verification are saved in the commit containing this final section. Branch: `editorial/next-ten-biographies-2026-10-01`. All ref updates are non-forced. Latest relevant remote refs were fetched and their biography records compared again before saving; no competing claim or completed manuscript for these ten exists there. Concurrent match production remains on its own branches and is not overwritten.

Latest inspected refs:
- `origin/main`: `1a76b3020d856f62227a5b928f64c44f0b956ee0`.
- `origin/editorial/biography-migration-2026-10-01`: `2f2df2131c94ed091f0163faeba0ac85e72b31b7`.
- `origin/editorial/match-report-migration-2026-10-01`: `cb1e4a3a1c5fbb378e0917556faffc44e6b649e9`.
- `origin/editorial/matches-through-2024-25-2026-10-01`: `674c6329d63f8ed8c65df0a3c5d7f56abae582af`.
- `origin/feature/automatic-weekly-history`: `486b109e1accf50bb3ee4e039ef0868a1144af01`.

Remaining blockers for this ten-biography commission: **none**. Future merge/activation/publication is outside this task.
