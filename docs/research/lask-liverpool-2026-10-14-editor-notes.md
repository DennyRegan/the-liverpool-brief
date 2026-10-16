# LASK 3–6 Liverpool: publication update, 16 October 2026

## Scope and authority

Denny supplied the report and explicitly requested: “Add to the post-match LASK game on the Liverpool Brief website. Check it first, remove the source list, polish it up and add to site”. This authorises updating the existing published report at `/archive/lask-liverpool-2026-10-14`, retaining its original publication date and event date. It also overrides the general Sources-footer convention for this report. Evidence is retained here, outside the public article. This is current coverage, not a new historical-calendar commission or an automatic History release.

Match Centre previously still listed the fixture as scheduled. Record the verified 3–6 result and link its existing canonical report, without changing any other fixtures or the league-table snapshot.

## Retrieved sources and confidence

All successful retrievals below were made on 16 October 2026. Confidence describes support for the specified claims.

- **High — Liverpool FC, official match report:** https://www.liverpoolfc.com/news/bradley-barcola-hat-trick-lask-liverpool-champions-league-match-report — result; scorers and assists; four starting changes; Tsimikas as captain; third-youngest Champions League XI; offside goals before Barcola's second and before LASK's first; substitutions; Koumas's first Champions League goal; six points; Villarreal next in Europe.
- **High — Liverpool FC, post-match press conference:** https://www.liverpoolfc.com/news/andoni-iraola-post-match-reaction-lask-liverpool-champions-league — Barcola and Wirtz; first Champions League starts for Nyoni and Koumas; attacking assessment; reason for resting the centre-backs; admission that replacing both together made the game harder; Brentford and Villarreal schedule. The short direct quotation is checked against this transcript; other remarks are paraphrased.
- **High — ORF, contemporary match report and reaction:** https://sport.orf.at/stories/3163593/ — independent result and scoring sequence; absent attackers; Flecker's two goals from Dibango deliveries; LASK's opening loss at AEK; Jungwirth's assessment. German remarks are paraphrased in English, without implying an exact English quotation.
- **High — Sky Sport Austria, post-match reactions:** https://www.skysportaustria.at/grossteils-sehr-ueberfordert-lask-reaktionen-zum-liverpool-duell/ — Kühbauer's and Flecker's assessments, reported via Canal+. English renderings are paraphrases, not verbatim translated quotations.
- **High — Associated Press via ABC News:** https://abcnews.com/Sports/wireStory/barcolas-hat-trick-helps-liverpool-rout-lask-feyenoord-137267347 — independent result, Barcola's first goals since arriving from PSG in the summer, goals at 24/51/66/72 minutes, Flecker's diving header on 74 minutes and Koumas's age. AP's claim that this was Koumas's first Liverpool goal is not used; the official club's narrower first-Champions-League-goal description is retained.

## Corrections and exclusions

- Put both Koumas offside incidents in their proper sequence. Neither happened after his legitimate goal.
- Removed the 26–12 shots statistic: the supplied FotMob URL failed retrieval in this run, and the count is unnecessary to tell the story.
- Removed the unsupported description of the absentees as Liverpool's three leading scorers.
- Removed the calf-knock and pre-match underdogs details rather than relying on an unavailable preview for them.
- Sources disagree on the convention for Barcola's second-goal minute (37/38). No minute is stated in the public copy.
- The double centre-back substitution is recorded at 62 minutes; LASK's goal is reported at 63 minutes by AP/ORF. The prose says “around the time” and does not assert an exact event order or causation.
- Retained “woodwork” for Gravenberch rather than choosing between the conflicting supplied post/crossbar descriptions.
- No injury diagnosis, transfer fee, table position, disputed Koumas record, referee or attendance is added.

## Metadata and review

Keep `season: 2026-27`, `historicalEventDate: 2026-10-14`, publication date `2026-10-15`, factual match classification, canonical slug, `lask` and `european-cup`. Existing canonical people IDs for Frimpong and Wirtz are reused. Barcola, Iraola, Koumas and Nyoni have no matching canonical entries in the current registry; their missing optional tags are left for editorial review rather than guessed or aliased. The event date places the report in its current managerial era automatically. No Season record, reverse article list or duplicate report is created.

## Verification before release

- Calendar and content validation passed, including the Match Centre/report relationship.
- All 240 tests passed. The source-list test now records Denny's explicit exception for this single report and retains its requirement for every other match report.
- Full lint passed with one pre-existing unused-variable warning in `tests/interactive-history-rendering.test.mjs`; the changed source-list test also passed a focused lint check.
- TypeScript checking and the production build passed.
- A production server preview returned 200 for the report, Match Centre, History matches and homepage. Checks confirmed the polished heading/body, absence of public source lists/research notes, unchanged canonical URL, History discovery link, latest completed LASK score/report, and next Brentford fixture.
- `git diff --check` passed. Live deployment verification follows publication.
