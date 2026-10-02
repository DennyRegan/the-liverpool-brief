# Biography migration checkpoint — 1 October 2026

This is an audit snapshot, not a competing inventory. The authoritative machine-readable records are in `docs/editorial/history-calendar.json`: the three existing career rows in `entries`, and the undated career records in `biographies`. All statuses, paths, evidence and blockers belong there.

| Recovery result | Count |
| --- | ---: |
| Finished Work project manuscripts actually retrieved | 30 |
| Recovered manuscripts already present in repository | 3 |
| New unpublished biography drafts migrated | 27 |
| Recovered manuscripts already published | 0 |
| Recovered manuscripts remaining unpublished | 30 |
| Additional pre-existing published biography inventoried | 1 |
| Requested manuscripts NOT LOCATED | 3 |

The recovered set includes the previously completed Bob Paisley and Gérard Houllier manager biographies: 28 player-focused manuscripts and two manager-focused manuscripts. They were preserved as existing project work, not rewritten as player articles. Phil Thompson is the additional repository-only published biography, observed live before this task; it is not counted as a recovered Work manuscript.

## Duplicates and gaps

Torres, Gerrard and Milner use the existing canonical repository drafts and commissioning rows. Retrieved prose agrees after normalising the existing title headings; meaningful repository metadata is retained. The apparent Milner variant was a heading difference, not a competing manuscript. Exact recovered source digests and file identities remain recorded in the inventory. Barnes's existing published signing article (`john-barnes-1987`) is a distinct event article, not a duplicate of his recovered full career biography.

Alan Hansen and Terry McDermott: research records recovered and preserved, but the actual finished articles from earlier chat could not be retrieved. Sami Hyypiä: no completed article or saved research record located; retrieved prior conversation context reports failed attempts. All three are explicitly blocked/NOT LOCATED with null article paths. No replacement writing or new research was performed. Prior conversation retrieval returns contextual excerpts, not a browsable full project transcript, so these gaps are stated as recovery limitations rather than proof that the first two articles never existed.

No missing research records or canonical identity blockers were found among the 30 recovered manuscripts. All require Denny's later review and specific publication approval; public destination and reference-authorship treatment remain publication gates. Existing source confidence labels and evidence caveats are preserved in the research records. This migration does not repeat their historical fact-checks or upgrade their evidence.

## Preservation and validation

- All 27 newly added manuscript bodies, including headings and source lists, match the retrieved files exactly, byte for byte. Only current-schema frontmatter was prepended. Their supporting records and audits were copied without editing.
- Existing repository drafts were retained, with matching recovered records reused wherever identical. Differing historical handoff notes remain available as provenance.
- Current main was inspected at `1f3a0f54d73059fe8c2ee8a2b094847b7a144beb` and fetched again before final checkpointing. All existing dated commission rows and selections were preserved; only the three career rows gained migration provenance.
- Calendar schema validation and all 175 tests pass. New tests check preserved manuscript hashes, undated inventory rules, canonical identity and approval gates. Lint passes with one pre-existing unused-variable warning in `tests/interactive-history-rendering.test.mjs`. Production build succeeds.
- A local production server passed 61 HTTP route checks: all 30 recovered canonical biography URLs and all 27 new draft paths returned 404; the editorial inventory path returned 404; the homepage, Players and existing Phil Thompson page returned 200.
- The live homepage and pre-existing Phil Thompson article returned HTTP 200. No public content, application components, loaders, schemas or dependency files were changed. No production deployment or main-branch merge was performed.

Branch: `editorial/biography-migration-2026-10-01`. Remote batch checkpoints: `303e896`, `03c5f08`, `8c0576d`; final validation/documentation is a subsequent checkpoint on that branch. No force-push was used. No schedule, publication approval, live date or automatic publisher was added.

Confidence: high for retrieved files, repository comparison, byte-preservation and executed technical checks. Historical correctness is not reassessed by this task. Missing full chat manuscripts remain NOT LOCATED.
