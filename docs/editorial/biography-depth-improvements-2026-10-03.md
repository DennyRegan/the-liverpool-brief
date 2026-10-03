# Selective biography depth improvements — 3 October 2026

Denny authorised changes following a recommendation to review the original thirty once and expand only meaningful gaps. Actual gpt-6.1-sol workers review, research, revise and audit. No blanket rewrite, word quota, publication, schedule or approval. Project model/workflow instructions are overridden by Denny; existing technical storage/schema conventions are respected.

Base: `ec200c108994aa91aa4d86dc2ab34a236fac6a84`, the completed sixty-biography inventory incorporating current main `02715879866e47b3f5342108e1666f499de9f6a6`. Fresh fetch found no later changes. Dedicated branch: `editorial/biography-depth-review-2026-10-03`. The dated baseline records thirty original paths, counts and hashes; Git retains exact previous manuscripts. It is evidence, not another status inventory.

## Scope selected from full manuscript coverage review, before new research

- Gérard Houllier: strengthen how rebuilding worked and why the championship challenge stalled; retain the existing chronology and useful personal/training detail.
- Ian Rush: strengthen the compressed later Liverpool career, captaincy and contribution alongside Fowler; not an automatic full rewrite.
- Steve Heighway: give the long academy/coaching phase meaningful Liverpool context beyond a list of graduates and trophies.
- Sammy Lee: explain documented coaching contributions, rather than just job titles, where new reliable evidence makes that possible.
- Ray Kennedy: research a dignified Liverpool-connected account of later life and club/supporter support; no invented medical or financial narrative.
- Robbie Fowler: research the later Evans-era role/partnerships and the circumstances of his 2001 departure.
- Roberto Firmino: research the early Liverpool adjustment and development of his role, plus supporter connection without generic sentiment.
- Steve McManaman: clarify the Liverpool context and circumstances of departure with properly attributed primary/contemporary material.

Eight targeted packages, not eight replacement biographies. Retain strong existing prose, canonical metadata and paths. Length follows useful evidence. If a proposed addition is unsupported or redundant, omit it and document why. Twenty-two other original manuscripts and all thirty recently completed manuscripts are to remain unchanged. Paisley and Callaghan in particular already cover their main phases well, despite the earlier broad recommendation to consider them. Later minor suggestions from reviews are not automatic commissions.

## Research, audit and provenance

Each revised canonical draft has one final Sources section with actually retrieved links, no body source URLs/citation markers or confidence/model labels. Fresh evidence at `docs/editorial/drafts/biographies/<id>-depth-research-2026-10-03.md`; separate post-draft audit at `<id>-depth-audit-2026-10-03.md`. Source registers retain URL/provider/title/retrieval date/claims/confidence/conflicts/UNVERIFIED exclusions and actual model/worker. Authors recheck retained factual claims too, rather than treating migration as verification.

Original uppercase recovered records and migration/source manuscript provenance remain intact. On completion the same calendar row receives revision research/audit evidence and an explicit dated Sol 6.1 revision note; no fake new production or recovered-original claim, duplicate subject, new publication date or schema is created. Inventory stays sixty completed unpublished biographies.

Checkpoint completed revision packages in sensible batches, reconcile current remote refs, then validate schemas, identities, duplicate slugs, publication boundaries, tests, lint, production build and private HTTP routes. No force-push or main write.

## First completed checkpoint

Houllier (961 → 1,410 narrative words), Heighway (911 → 1,328), Kennedy (925 → 1,031) and Firmino (981 → 1,299) have fresh research registers, separate post-draft factual audits and an independent targeted retrieval review. Sources sit at the bottom of each manuscript. The current calendar marks these same four rows technically ready/unpublished, with no claim, approval or destination. Four other commissioned revisions remain in progress. `biography-depth-first-checkpoint-2026-10-03.json` records executed schema, identity/metadata, queue, evidence and preservation assertions; full application tests/build/HTTP checks follow the complete batch.

Fresh remote fetch before this checkpoint found main unchanged at `02715879866e47b3f5342108e1666f499de9f6a6` and this dedicated branch at selection checkpoint `530d3db6eb5b4cb93434fa9aafa6a6bf462e15ef`. No concurrent match, migration, publisher, public application or original recovery evidence files were changed. Original calendar recovery provenance is byte-for-byte equivalent as parsed data. The completed unpublished inventory remains sixty; these are amendments, not new biographies.

## Completed selective review

All thirty originals were reviewed in full by actual Sol 6.1 coverage reviewers. Eight targeted revisions were independently researched before writing, then subjected to a separate writer factual pass over retained and added claims and an independent targeted retrieval review of meaningful additions. The independent pass is not represented as a second exhaustive check of every retained claim. No further subjects were commissioned merely to raise word counts.

| Biography | Before narrative words | After narrative words | Meaningful added coverage |
| --- | ---: | ---: | --- |
| Gérard Houllier | 961 | 1,410 | Rebuilding, tactical trade-offs, leadership rationale and limits of the title challenge |
| Ian Rush | 920 | 1,225 | Later selection, Fowler partnership, Evans-era contribution and departure choice |
| Steve Heighway | 911 | 1,328 | Academy responsibilities, development methods, shared work and balanced departure context |
| Sammy Lee | 885 | 1,042 | Documented coaching preparation, development and academy connections |
| Ray Kennedy | 925 | 1,031 | Dignified later Liverpool relationships and dated Anfield remembrance |
| Robbie Fowler | 976 | 1,247 | Evans-era supply/partnerships/title context and attributed 2001 departure accounts |
| Roberto Firmino | 981 | 1,299 | Early role learning, 2016–17 attacking development and documented supporter connection |
| Steve McManaman | 851 | 1,037 | 1997–99 public contract/departure context and continued final-season contribution |

Counts exclude front matter, headings and Sources. Twenty-two other original manuscripts and all thirty recently produced biographies remain unchanged. No blanket doubling or new extended/legendary replacement was undertaken. Each revised article has exactly one final bottom Sources section. The canonical paths remain `docs/editorial/drafts/biographies/<person-id>.md`, with fresh `<person-id>-depth-research-2026-10-03.md` and `<person-id>-depth-audit-2026-10-03.md` beside them. The authoritative calendar retains all original migration hashes and provenance, adding revision evidence only. This report and the hash/validation snapshots are evidence, not alternative inventories.

Limitations are explicit in the research registers: public contract discussions do not establish private offers or motives; reported fees remain reported; retrospective coaching testimony is attributed and does not imply sole credit; source-level numerical/date mistakes are recorded and not copied. Kennedy's unconfirmed 2009 appeal was not added. Lee's inherited ground-end memory remains expressly attributed, with its archive discrepancy recorded. No unresolved factual blocker remains for the bounded revisions; excluded claims were not guessed.

## Final technical and publication boundary checks

- Calendar/history/content schemas, canonical identities and duplicate subject/slug checks pass. All eight same rows are technically ready/unpublished; claim, approval and published destination are null. Total completed unpublished biographies remains **60**.
- Full test suite: **202 passed, 0 failed**. The first run exposed the old assumption that recovered canonical prose could never be amended. A narrowly scoped test now verifies exact revised body/metadata hashes alongside unchanged original recovery hashes and discoverable research/audit records, with negative mutation cases. No original hash was rewritten to disguise an amendment. All other tests, application code, schemas and publisher code remain unchanged.
- Lint: exit 0, no errors; one pre-existing unused `getPublishedExperience` warning in `tests/interactive-history-rendering.test.mjs`.
- Production build: exit 0; TypeScript passed and 470 static pages generated. The initial attempt encountered `ENOTEMPTY` in generated `.next` cache. After confirming no running build, the old generated cache was moved to a scratch backup and a fresh build succeeded. Pre-existing Forshaw era-association and Node module-type notices remain; they are unrelated to these revisions.
- Local production HTTP checks: **559 passed** (526 existing queue/public/sitemap boundaries plus 33 evidence/entity checks). All unpublished article/draft/evidence routes return 404, the sitemap excludes unpublished slugs and canonical entity hubs expose neither the manuscript nor its article link. Existing public pages remain accessible. This is local production verification, not deployment.

Selection/review checkpoint: `530d3db6eb5b4cb93434fa9aafa6a6bf462e15ef`. First four completed package checkpoint: `1ed3a81a6659843df0665451b7786383e5296fc7`. The final package/validation checkpoint is this report's commit on the same dedicated branch. Fresh fetch before saving found current main and concurrent migration/publisher refs unchanged; no main merge or ref update is authorised by this job.

Nothing was published, deployed, scheduled or approved on Denny's behalf. The previously configured automatic publisher state was preserved exactly; no publisher run was invoked. All changes are unpublished editorial inventory amendments on `editorial/biography-depth-review-2026-10-03`.
