# EDITOR NOTES — This Week, 14–20 September 2026

Prepared 14 September 2026. Six finished factual match-report drafts; awaiting Denny’s reading and publication approval. Nothing has been committed, published or attached to the live site.

## Coverage and publishing handover

The [live This Week page](https://theliverpoolbrief.com/this-week) was retrieved and showed eight events. Confidence: high for the inspected page state. Nicol (1987) and Alonso (2006) already had supporting articles, so neither was rewritten. The remaining six were missing standalone articles in the default-branch Archive inventory inspected at commit 9d0b268cebfac6976aec4de7bfd55dfc5ee45341.

The earlier Reykjavík writing mentioned in the conversation was not found in that published inventory or the draft searches. This file is a new factual treatment, not a replacement of any earlier user-written draft. If the earlier draft is subsequently located, compare before publishing a second treatment.

| This Week event file (under content/this-week/liverpool/) | Proposed archiveSlug | Historical date | Season |
|---|---|---|---|
| 1964-09-14-first-european-night-anfield.md | anfield-first-european-match-reykjavik-1964 | 1964-09-14 | 1964-65 |
| 2004-09-15-monaco-champions-league.md | liverpool-monaco-champions-league-2004 | 2004-09-15 | 2004-05 |
| 2016-09-16-henderson-chelsea.md | henderson-chelsea-winner-2016 | 2016-09-16 | 2016-17 |
| 1974-09-17-stromsgodset-record-win.md | liverpool-stromsgodset-record-win-1974 | 1974-09-17 | 1974-75 |
| 1991-09-18-saunders-european-return.md | saunders-four-kuusysi-european-return-1991 | 1991-09-18 | 1991-92 |
| 1925-09-19-forshaw-manchester-united.md | forshaw-hat-trick-manchester-united-1925 | 1925-09-19 | 1925-26 |

After approval, place each individual article in content/archive/liverpool/ under its existing draft filename. Its canonical destination is /archive/<slug>. Add the corresponding archiveSlug to the existing event, preserving its historical month/day/year. Do not copy article bodies into the event files. Recheck the current This Week implementation, which Denny says is changing, and confirm each card opens its own report. Historical dates support recurring associations; saving these drafts alone does not activate links.

The draft date field is a proposed publication date of 2026-09-14, not the match date. Set it to the actual first-publication date when approved. Preserve historicalEventDate and canonical season values.

## Metadata and validation

Read the current ArchiveFeatureSchema, entity registry, docs/connected-history.md, docs/seasons-publishing.md and docs/this-week.md. Confidence: high for retrieved repository requirements; they may change before publication. Sources: [connected history](https://github.com/DennyRegan/the-liverpool-brief/blob/main/docs/connected-history.md), [season publishing](https://github.com/DennyRegan/the-liverpool-brief/blob/main/docs/seasons-publishing.md), [This Week](https://github.com/DennyRegan/the-liverpool-brief/blob/main/docs/this-week.md), [schema](https://github.com/DennyRegan/the-liverpool-brief/blob/main/lib/content/types.ts), [registry](https://github.com/DennyRegan/the-liverpool-brief/blob/main/content/history/liverpool/entities.json).

Included relationship IDs were checked against the retrieved registry for both identity and kind. Dates and season pairs were checked programmatically. All six are September events and belong to the season beginning in their historical year. The existing European Cup identity is used for the 2004 Champions League, consistent with the repository’s 2004-05 season record.

Metadata deliberately contains only existing IDs. Before publication, resolve/register the missing opposition labels: KR Reykjavík, AS Monaco, Chelsea, Strømsgodset, Kuusysi Lahti and Manchester United. Add Stamford Bridge for the Chelsea report. The 1925 report also needs its central person Dick Forshaw and manager Matt McQueen resolved/registered; those IDs were absent from the inspected registry and were not guessed in the draft. Reuse any identities added by other work in the meantime.

editorialMode: factual describes the intended History classification. These are still unpublished review files; that field is not a publication approval.

No repository test, lint, full content-validator, build or browser gate was run, because this task produced draft files outside the repository and did not publish. The publishing agent must run the existing validation, npm test, npm run lint and npm run build and inspect the resulting article and This Week links before deployment. Do not present the local metadata check as those gates passing.

Each individual Markdown file contains a Sources list at its end and source URLs in frontmatter. Keep sources at the bottom in the published presentation; ensure the renderer does not show a duplicate list. The combined reading copy is only for review and must never be imported as another article.

## Research limitations and final-copy checks

No match footage was watched. No article claims eyewitness access, and no direct quotation is used. Core dates, scores and scorer totals were compared across independently published sources where available. Two LFChistory pages are not counted as independent evidence. Reproductions of the same newspaper report are also one underlying source.

### 14 September — Reykjavík

- Club retrospective: high confidence for the first home European match, date, result, attendance, aggregate and Liverpool scorers.
- LFChistory match record: high confidence for the basic record and lineup; medium for exact historic goal minutes without a primary match sheet.
- Sigfus Guttormsson’s LFChistory article: medium confidence for detailed reconstruction and the Graham/A’Court selection context. This is a later account referring to Icelandic newspapers; their original pages were not retrieved.
- Final-copy audit: opening/occasion/result checked against club report and match record; scoring order against match record and the later narrative; Graham’s debut explicitly recorded in the match database. Selection context and A’Court’s last appearance rely on the later narrative.
- Felixson’s goal is at 30 minutes in the narrative and 36 in the database. The copy says only before the interval. Omitted exact shot distances, crowd chants, anthems, the guard of honour and goalkeeper judgements, since the original evidence was not independently reviewed.

### 15 September — Monaco

- Jonathan Caswell’s contemporary UEFA report: high confidence for the match development and result.
- Press Association’s contemporary report reproduced by Anfield Online: high confidence for the reported action; hosted reproduction, not the original wire page.
- LFChistory Monaco record: high confidence for fixture/result cross-check. The detailed match record was also retrieved via the live This Week source link.
- Final-copy audit: midfield selection and the opening-goal passing sequence are supported by PA and UEFA; Cissé/Baroš times and substitution are consistent with the match record. The second-half formation change is explicitly reported by UEFA. Dudek’s Adebayor save and the late winner appear in both reports.
- UEFA identifies Squillaci as the defender Baroš turned; PA identifies Rodriguez. The draft names neither. UEFA and PA also differ over the provider of a later Cissé chance; that assist is omitted. No claim that this was Benítez’s first European fixture: the text specifies first Champions League group match as Liverpool manager.

### 16 September — Chelsea

- Sky Sports report by Lewis Jones: high confidence for match events and immediate consequences. Its displayed update is 20 September 2016; the match was 16 September.
- Liverpool FC post-match interview: high confidence as a contemporaneous player interview; used for the goal, previous Leicester result and immediate reaction, not as an independent neutral assessment of superiority.
- Liverpool FC photo-report text: high confidence for the Lovren/Coutinho opening goal and first-half scoring.
- LFChistory match record: high confidence for date, venue, lineup, goals, substitutions and table.
- Final-copy audit: 17/36/61-minute goals checked against Sky and LFChistory; Lovren’s finish and Henderson’s long-range goal independently described by the club. Firmino’s absence, Origi’s chance, London results and Conte’s first defeat are supported by Sky. No exact shooting distance is claimed.

### 17 September — Strømsgodset

- Liverpool FC’s 2024 retrospective: high confidence for the score and scorer totals. Thompson’s interview is a recollection fifty years later.
- Play Up, Liverpool match record/Echo extract: medium confidence as an archival transcription; not the original newspaper scan.
- 11v11 match record: high confidence for score, competition, venue, attendance and scorer totals.
- This Is Anfield retrospective: medium confidence; used for corroborating match progression and the 1–0 return result. It reuses some of the same Echo material.
- Final-copy audit: record win and nine scorers cross-checked against the club and 11v11; half-time score and scoring sequence against Play Up and This Is Anfield. Thompson’s first goal is explicitly attributed in the draft to the contemporary Charters account reproduced by the club, rather than presented as footage observed.
- Sources disagree about several exact minutes. The copy omits them. No Paisley quotation, cat anecdote or unsupported embarrassment claim is used. The 12–0 aggregate is arithmetic from 11–0 and 1–0.

### 18 September — Kuusysi

- LFChistory match record: high confidence for the result and lineup; medium for minute-level chronology.
- Liverpool FC’s European hat-tricks retrospective: high confidence for Saunders’s four goals and the late three-goal burst.
- LFChistory’s Resurgence Years account: medium confidence for narrative context, the extended 2–1 phase and return-leg result.
- Reuters’ 2025 Heysel memorial report: high confidence for the disaster context, 39 deaths and subsequent English-club ban.
- Final-copy audit: date/result/six Liverpool goals checked against the match record and club retrospective. The late burst is independently described by the club. Starting personnel come from the match record. English readmission in 1990 and Liverpool’s additional year are recorded in the Resurgence Years account. Quarter-final exit is also confirmed in the club retrospective.
- UEFA’s indexed legacy event listing conflicts with LFChistory over goal allocations/timings and the Finnish scorer. The [UEFA event page](https://www.uefa.com/uefaeuropaleague/match/4550--liverpool-vs-lahti/events/) was opened but its detailed timeline was not available in extracted text. Confidence: low for that indexed timeline; do not use it as verified chronology.
- The article omits the Finnish scorer’s identity and all exact goal minutes. Its broad first-half lead and late Saunders burst follow agreement between the club retrospective and specialist account. No transfer fee, foreign-player rule or individual goal technique is asserted. The 6–2 aggregate is arithmetic from the two recorded results.

### 19 September — Manchester United

- LFChistory match record: high confidence for the basic result, scorer totals, date and lineup; medium for exact goal timings.
- Play Up, Liverpool’s contemporary Echo extracts: medium confidence as a transcription rather than a retrieved newspaper page.
- Final-copy audit: 5–0, Forshaw’s three, Chambers and Rawlings, 1–0 at half-time and attendance agree across both records. The contrast between United’s play and Liverpool’s finishing is expressly attributed to the contemporary report. Opening-five-match totals come from the match record’s league table; “more than half” is arithmetic (five of nine goals).
- Chambers’s goal is given as 51 minutes by Play Up and 55 by LFChistory. No minute is stated. An excerpt also refers to Bullens Road, inconsistent with Anfield; the crowd/chant passage is omitted entirely. No individual goal technique, tactical explanation or claim of modern rivalry intensity is invented.

## Read-through outcome

Removed repeated conclusions from the shorter reports. Kept the 1925 piece brief because the retrieved reliable match narrative is limited. No invented opinion, atmospheric filler, tactical change without attribution/evidence, or inferred player motive was added. Confidence labels and these notes are internal review material, not article-body content.
