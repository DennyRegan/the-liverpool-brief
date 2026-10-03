# Second commissioned ten biographies — 3 October 2026

Scope: exactly ten NEW researched manuscripts, unpublished on a dedicated branch. Denny explicitly requested Sol 6.1 for research and writing, overriding project model instructions. No publication, schedule or approval is authorised.

## Inventory inspection

Fetched all current remote branches. Inspected main 03391d3a9a8461688828e0e33551d5ecd82fd036, the previous biography batch 4bc4b97a72fb3620fa3375a5834096277b0a020b, biography migration, automatic-history and active match branches. Previous batch has 40 completed unpublished biographies; Phil Thompson is already published. The ten selected have no completed career biography in those inventories. Focused articles are not career biographies.

Main's later Brief update and publisher activation are reconciled into this branch without dispatching or altering the publisher. This batch does not merge to main.

## Selection before research

1. **alan-hansen** — Ball-playing defender and captain across eight league titles and three European Cups.
2. **terry-mcdermott** — Midfield scorer and major contributor to Liverpool’s first European supremacy.
3. **sami-hyypia** — Transformative defender, captain and foundation of the 2001 and 2005 teams.
4. **rafael-benitez** — Manager of Istanbul and the 2006 FA Cup winners, whose six-year rebuild reshaped Liverpool.
5. **jamie-carragher** — One-club defender, long-serving vice-captain and Liverpool’s second-highest appearance maker.
6. **jan-molby** — Distinctive midfield organiser whose Liverpool story spans the double and difficult later years.
7. **michael-owen** — Home-grown goalscorer, 2001 cup-final match winner and Ballon d’Or recipient.
8. **xabi-alonso** — Midfield architect central to Istanbul and the 2008–09 title challenge.
9. **pepe-reina** — Outstanding goalkeeper and durable contributor under Benítez and his successors.
10. **john-toshack** — Transformative Shankly signing and Keegan’s strike partner in the early 1970s.

Hansen, McDermott and Hyypiä are new production, not recovered originals. Original gap records are preserved verbatim in `biography-not-located-snapshot-2026-10-03.json`; previous migration/recovery reports and recovered research files remain unchanged. The authoritative rows will describe newly completed manuscripts.

Extended treatment: Rafael Benítez, Jamie Carragher and Alan Hansen; other subjects receive length appropriate to their Liverpool stories.

## Storage and boundaries

Manuscripts, new research records and separate factual audits: `docs/editorial/drafts/biographies/<person-id>{,-research-record,-factual-audit}.md`. Existing canonical person IDs, no public content files, no publication dates, null approvals and destinations, `ready_for_review` on completion. `history-calendar.json` remains the sole status authority. Automatic queue compatibility does not dispatch publication.

## First five checkpoint

Completed and separately author-audited: Alan Hansen, Jamie Carragher, Jan Mølby, Pepe Reina and Rafael Benítez. All five pass calendar/schema, canonical identity, unique subject/slug, complete research and audit URL-register, unpublished/null-approval and read-only automatic-queue compatibility checks. Narrative source links are confined to a single bottom Sources section; inline citation markers removed following Denny's explicit request.

Technical compatibility changes: biography authorship enum accepts actual Sol 6.1 alongside earlier Astra records; existing authorship is untouched. Missing-manuscript and publisher-pool tests now use state/fixtures rather than permanently excluding these three newly commissioned subjects. Synthetic Git transport fixture permits a 32 MiB calendar read after inventory growth crossed its default 1 MiB buffer. Publisher implementation/state is unchanged. Initial schema failure from overly long slugs was corrected to existing filename/slug conventions. Full final tests/lint/build and HTTP verification follow after all ten are complete.

Latest concurrent match branch 43250eea4c5fc3a1daf794c53669ef43350cac01 was fetched and its biography rows checked: no selected subject has a completed manuscript there. Its new match work stays on that branch; no other remote refs are moved.

## Completed batch

Exactly ten newly researched biographies complete. All ten were researched and written by actual gpt-6.1-sol workers, with separate post-draft author factual passes and a targeted independent Sol 6.1 review. The independent reviewer read all ten manuscripts and checked selected central claims; this is not a claim of exhaustive second verification of every linked source. Research records preserve retrieved URLs, provider/title, retrieval date, supported claims, confidence, conflicts and excluded UNVERIFIED claims. Each public manuscript has one final Sources section, no inline source URLs or citation markers, and no internal confidence/model labels.

Counts use one consistent whitespace-based prose measure, excluding frontmatter, headings and Sources. They differ slightly from some author tokenisation counts.

| Canonical person / filename | Prose words | Source links | Treatment |
| --- | ---: | ---: | --- |
| `alan-hansen.md` | 2,382 | 27 | Extended |
| `terry-mcdermott.md` | 1,916 | 23 | Substantial career biography |
| `sami-hyypia.md` | 2,167 | 28 | Substantial career biography |
| `rafael-benitez.md` | 3,279 | 39 | Extended |
| `jamie-carragher.md` | 2,455 | 32 | Extended |
| `jan-molby.md` | 2,026 | 18 | Substantial career biography |
| `michael-owen.md` | 2,036 | 29 | Substantial career biography |
| `xabi-alonso.md` | 1,969 | 26 | Substantial career biography |
| `pepe-reina.md` | 1,885 | 24 | Substantial career biography |
| `john-toshack.md` | 2,077 | 27 | Substantial career biography |

All manuscript and adjacent research/audit paths are under `docs/editorial/drafts/biographies/`. `second-ten-independent-review.md` records the targeted independent checks and observed final presentation closure. `history-calendar.json` is the status authority. The historical NOT LOCATED snapshot and original recovered research records remain intact; Hansen, McDermott and Hyypiä are newly written manuscripts, not recovered originals.

## Inventory and boundaries

The branch now holds **50 completed unpublished biographies**, including this ten; all are technically ready in the existing derived queue. Phil Thompson remains the separately published biography. Each new row is `ready_for_review`, completed new-production evidence, research verified, null claim, null approval and null published destination. No publication date, anniversary slot or release week exists for this batch. Queue-class compatibility is explicit without scheduling any item. No public content file was created. Existing manuscript bytes, public collections, application/library/workflow files and the publisher configuration/runs are unchanged from the reconciled selection checkpoint.

Current main already has an enabled publisher from a separate earlier activation. This job preserves that state, does not dispatch it, and saves only to the dedicated editorial branch. No main merge, publication, deployment, scheduling or Denny approval has been performed. Concurrent match work remains on its own refs.

## Factual limitations

Conflicting source figures are recorded and resolved by stronger records, careful attribution or omission. Examples: Hansen's League Cup total; McDermott's original semi-final versus replay, seasonal goal totals and 1976 personal medal distinction; Hyypiä's disputed exact signing day and captaincy chronology; Mølby's unresolved fee and personal medal scope; Reina's 394 versus erroneous 395 announcement and wrongly attributed 2010 Golden Glove; Owen's corrupted database honours and match-minute labels. No unresolved assertion was promoted from notes into prose. Medical announcements and personal injury recollections are dated/attributed, with no guessed current-health or causal claim. No invented or unretrieved quotation. Remaining blockers for delivering this ten: **none**.

## Executed validation

- Calendar/current history and all ten Archive-compatible metadata records pass; canonical people/eras, unique subjects/slugs and complete research/audit paths pass. Every linked source URL occurs in the subject's research evidence. All ten remain unpublished, with null approval, and are discoverable through the read-only automatic-history candidate query.
- Full tests: **200 passed, zero failed**. Existing missing-manuscript/eligibility tests were made resilient to these three historical gaps being filled; the Git transport fixture's buffer was enlarged for inventory growth. Sol 6.1 authorship is recorded truthfully without relabelling previous Astra work.
- Lint: **zero errors**, one existing unused-variable warning in `tests/interactive-history-rendering.test.mjs`.
- Production build: compiled/TypeScript passed, **470 static pages**. Final history/calendar validation was repeated after the completed inventory update; public build inputs are byte-unchanged.
- Local production HTTP: **409 passed checks** (378 queue/draft/public/sitemap checks plus 31 evidence/person-hub checks). All ten new article and draft routes return 404; all research/audit files and independent review return 404; no unpublished slug leaks into the sitemap. Four already existing person hubs remain public and six absent hubs remain 404, as dictated by existing published associations; no new manuscript/link is exposed there. An initial extra-check assumption that every canonical ID had an existing 200 hub was corrected against the prerender manifest and unchanged application rule. No application fix was needed.

Evidence: `biography-production-validation-2026-10-03.json`, `biography-production-route-checks-2026-10-03.json`, `biography-evidence-route-checks-2026-10-03.json` and `biography-production-concurrency-2026-10-03.json`. These are audit snapshots, not additional status inventories.

## GitHub preservation

Branch: `editorial/next-ten-biographies-2026-10-03`. Selection/reconciliation checkpoint: `20c872b84ca6a9df1c43cb7f7d36ecbe5aff8fa7`; first five: `23893ef3f0430264bf2b5e8d2d758679ff7eaac0`; second five and final evidence are preserved in the commit containing this section. Git-data trees are checked against the staged local tree and fetched back after each non-forced branch update. Latest relevant remote refs were fetched and biography identities compared again before this final checkpoint; no competing completed manuscript for these ten appears outside this batch. Other remote refs are untouched.
