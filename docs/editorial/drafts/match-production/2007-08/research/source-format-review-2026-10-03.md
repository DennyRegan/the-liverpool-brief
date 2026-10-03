# 2007-08 retained-report source format review

- Review date: 3 October 2026.
- Format reviewer: `/root/sol_factual_review`, actual configured model `gpt-6.1-sol`.
- Scope: 13 retained Astra manuscripts imported from `dfeb00f`; source format, metadata, companion-note coverage and documented review completion.
- Original authorship: `/root/astra_2007_08`; original final factual reviewer: `/root/astra_independent_review`, configured `gpt-6-astra`. Original selection, source notes and `independent-review.md` remain unchanged.

## Review limits and preserved factual completion

This is a format and provenance review, not a new independent factual review. No external historical source was freshly retrieved for these retained manuscripts by this format reviewer. Source labels were assessed against the preserved author retrieval records and original reviewer evidence. Their confidence and retrieval limitations remain those stated by the original researchers. This note does not relabel their work as Sol research or certify unreviewed page content.

The preserved `research/independent-review.md` explicitly records completed factual checking of all 13 finished manuscripts and rereading of requested corrections, with no unresolved material factual blocker in their retained scope. Every selected report has a companion `research/<slug>-notes.md` with retrieved-source records and a completed claim audit. Historical pending statements in preparatory material are superseded by the original final manuscript-review finding; they were preserved rather than rewritten. These records supply the existing factual-completion evidence. This review identified no missing final review or source-note URL coverage gap.

## Changes and final checks

Added `sources` frontmatter arrays to all 13 reports, following each existing footer's exact URL order. Existing descriptive footer labels required no changes. No narrative prose, excerpt, title, source URL or URL order changed. Byte-for-byte narrative and URL-order comparison against `dfeb00f` passed for every report; companion source notes and original independent review also match that commit unchanged.

All 13 final files pass:

- Exactly one terminal `## Sources` section, containing descriptive linked bullets and no internal or editorial text after the list.
- Frontmatter/footer exact URL and order parity, with every public URL recorded in the report's own companion notes as retrieved evidence.
- Published-site format comparison against `content/archive/liverpool/liverpool-leicester-1974-semi-final-replay.md` and `content/archive/liverpool/liverpool-west-ham-1977-tenth-title.md`: source metadata plus one bottom linked list, without a duplicate visible list.
- Filename/slug/season/date parity with the preserved selection; factual match metadata and canonical entity IDs present; tagged players/managers resolve to people. No publication-date field added or present.

## Final reviewed-file hashes

These SHA-256 values cover the entire saved final file, including newly added metadata and any clarified labels. PASS in this table means the format/provenance scope above, not a fresh factual verdict.

| Manuscript | Public URLs | Format / provenance | Full-file SHA-256 |
| --- | ---: | --- | --- |
| `chelsea-liverpool-2008-extra-time-exit.md` | 4 | PASS | `6773fcee2ba5feac7db66915e2bbbba55afd0e907c8c96453c41997de1ecf1c9` |
| `everton-liverpool-2007-kuyt-two-penalties.md` | 3 | PASS | `2868b8503a061f9141c7cc3f899894bcc81c1eac8adcadf9a7a05d7ffd750be1` |
| `inter-liverpool-2008-torres-san-siro.md` | 4 | PASS | `6caef652b7a9b33f017dc8ea46168748c7ea72feddbfae3732353991a0919aea` |
| `liverpool-arsenal-2008-babel-quarter-final.md` | 3 | PASS | `f45e82f39baa80d451bb5f3860eaf02022e0599e6c4f2da8457279fd1f56fb88` |
| `liverpool-barnsley-2008-howard-cup-exit.md` | 4 | PASS | `f248bfec8e3c7804d2a714a09093bb712c94d3dffc5544949f1f59ecd5b5123f` |
| `liverpool-besiktas-2007-eight-goal-record.md` | 4 | PASS | `3eae541b40f0c9b3d47173cd6ba340a6d452da857fb1b801db52a73467a94ef8` |
| `liverpool-chelsea-2007-torres-first-goal.md` | 5 | PASS | `2ce2530da1cd65dd536258509b3d82d8b9391c75af49d32d544ada59653b1282` |
| `liverpool-havant-waterlooville-2008-benayoun-hat-trick.md` | 4 | PASS | `fea596b0634e3a2c7c2b125d65385fb8f3965fa36cae6209001fdc2418f5e275` |
| `liverpool-inter-2008-late-goals.md` | 4 | PASS | `ed92b34a6755b60072c03cd7a88a7b560b150d35b79bfce446046a8c2a825d33` |
| `liverpool-middlesbrough-2008-torres-first-league-hat-trick.md` | 6 | PASS | `6c5a1e26943d5f301f67ba4ffe095c14228e3eaddb2ea61fba37488e24625c1b` |
| `liverpool-west-ham-2008-torres-repeat-hat-trick.md` | 5 | PASS | `1823e8c3a3d6f4dd697bb3a04b2b5e184838ca95f20dce7f094882c83fc99de5` |
| `marseille-liverpool-2007-group-recovery-complete.md` | 4 | PASS | `5734c25f11419621740a84ba4ba535997bde05b895ef54cf2d027e814e3ea036` |
| `tottenham-liverpool-2008-torres-debut-season-record.md` | 5 | PASS | `6118446a89e1832d833c4247ead3f619436f05306a94190273153bcbea824c9a` |

No calendar, registry, Git, approval, publication or scheduling action was performed by this reviewer. The coordinator remains responsible for technical validation and queue eligibility.

## Verdict

PASS

All retained manuscripts in this season meet the requested source format, metadata parity and original-review documentation checks. Factual readiness relies on the preserved completed Astra review, with its stated limitations; this note provides no new external-source truth certification.
