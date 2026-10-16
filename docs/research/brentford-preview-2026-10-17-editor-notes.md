# Brentford v Liverpool preview: checked 16 October 2026

Denny supplied the preview and explicitly authorised checking, polishing, matching the LASK report's presentation, removing sources/notes and publishing it. This is current match coverage. The existing preview system stores the prose once on the Brentford fixture and renders it at `/match-centre#match-preview`, using the site's existing reading typography. No new Archive article, route or historical-calendar commission is required. Keep the fixture scheduled, preserve its identity/kick-off, and use the verified current venue name, Gtech Community Stadium.

## Retrieved sources and confidence

All sources below were retrieved on 16 October 2026. Confidence applies to the stated claim scope, not unannounced future availability.

- **High — Liverpool FC fitness update:** https://www.liverpoolfc.com/news/fitness-update-andoni-iraola-gakpo-isak-szoboszlai-changes-brentford — Thursday's assessment of Isak, Gakpo and Szoboszlai; Friday training still ahead; one short exact quote; short turnaround and intended rotation before Villarreal.
- **High — BBC Sport reporting by Millie Sian, syndicated by AOL:** https://www.aol.com/articles/iraola-injured-trio-ngumoha-versatility-123721000.html — Thursday press-conference summary: Leoni's delayed training target, Koumas, Ngumoha, Barcola and Iraola's assessment of Brentford. Paraphrased, without inventing direct quotations.
- **High — Liverpool FC suspension announcement:** https://www.liverpoolfc.com/news/ryan-gravenberch-suspended-for-brentford-v-liverpool-premier-league — Gravenberch serves a one-match league ban following his dismissal against City.
- **High — Liverpool FC availability list, explicitly last updated 12 October:** https://www.liverpoolfc.com/news/liverpools-injury-list-suspensions-and-availability — long-term Bradley/Ekitike absences and suspension context. Thursday's newer press conference supersedes its older recovery target for Leoni and assessment of the injured trio.
- **High — Brentford FC match preview:** https://www.brentfordfc.com/en/news/match-previews-brentford-v-liverpool-premier-league-17-10-2026 — venue, Saturday 15:00 BST, unbeaten all-competitions record, 14.5 opposition shots per game and under-7% conversion, Kelleher, Isak's three league goals and October 2025 meeting. This page is labelled 14 October but already includes Wednesday's LASK result; its displayed label is not used as an exact update time.
- **High — Brentford FC Villa match report:** https://www.brentfordfc.com/en/news/match-reports-aston-villa-2-brentford-2-premier-league-10-10-2026 — 2–2 result, Yarmoliuk/Ajer goals, Jensen's substitute appearance, Van den Berg's unused-substitute status, six-game unbeaten league start and prior 3–0 Chelsea result.
- **High — Brentford FC post-Villa injury update, 10 October:** https://www.brentfordfc.com/en/news/first-team-keith-andrews-kevin-schade-jannik-schuster-injury-update-brentford — Schade's shoulder and Schuster's ankle issues. Does not confirm their Liverpool availability or announce fitness tests.
- **High for dated status, not Saturday availability — Brentford FC pre-Villa team news, 9 October:** https://www.brentfordfc.com/en/news/first-team-news-aston-villa-v-brentford-premier-league-10-10-2026 — Collins nearing a return, Milambo/Dasilva ruled out of Villa, Furo recovering from metatarsal surgery; also independently confirms the 3–0 Chelsea win. Jensen/Van den Berg status is superseded by the Villa match report.
- **High — Brentford FC May 2026 meeting:** https://www.brentfordfc.com/en/news/match-reports-liverpool-1-brentford-1-kevin-schade-premier-league-24-05-2026 — final-day 1–1 at Anfield. Retrieved through the supplied `/en/news/article/` URL, which redirects here.
- **High for result, not exact match date — Brentford FC opening-day Spurs report:** https://www.brentfordfc.com/en/news/match-reports-brentford-3-tottenham-hotspur-0-premier-league-22-08-2026 — 3–0 home win. The displayed publication label differs by one day from the supplied URL; the preview says only August.
- **High for the stored snapshot — current repository Match Centre register:** `content/match-centre/liverpool/2026-27.json`, table as of `2026-10-12T19:44:00.000Z` — Liverpool ninth with nine points, 2W/3D/1L and seven goals; Brentford fourth with 10 points, 2W/4D/0L and six conceded; City 18 points; City/Brentford/Everton unbeaten. These are existing sourced values, not a freshly fetched table; preserve its timestamp.
- **High — already checked canonical LASK report:** `/archive/lask-liverpool-2026-10-14` and its retrieved-source notes — 6–3, Barcola hat-trick, Koumas goal and three late concessions. The prior publication already completed the LASK fixture and linked the report; the supplied manuscript's warning about an unrecorded result is obsolete.

## Changes and exclusions

- Headline uses three fitness doubts rather than calling Szoboszlai a forward.
- Corrected stale Jensen/Van den Berg recovery descriptions using their actual Villa squad involvement.
- Kept the remaining Brentford injury information explicitly dated/uncertain. No newer pre-Liverpool availability update was found in the official-source search at this morning's cutoff; do not turn the older injury updates into confirmed match absences.
- Removed claims that Schade/Schuster are expected to undergo fitness tests because that detail was not confirmed in the retrieved club update.
- Removed the unnecessary £123m fee and specific Nyoni press-conference claim. The supplied Yahoo/All Out Soccer page failed retrieval; no claim relies on it. Nyoni remains a possible football selection, but the preview does not say Iraola singled him out.
- Avoided saying the shot-conversion figure alone proves opponents rarely get good chances. Kept the actual sourced figures with attribution.
- Reframed the closing 'defensive' question as carrying attacking fluency into the league. This is editorial framing, not a quoted tactical prediction.
- No source list, confidence labels, editorial notes or handover instructions are included in the public preview body. Structured evidence IDs stay in the existing source registry for validation.

## Verification

Calendar/content validation passed, including the existing preview schema and source references. All 240 tests passed. Full lint passed with the existing unused-variable warning in `tests/interactive-history-rendering.test.mjs`; production build and its TypeScript check passed.

A production server preview confirmed the full article, italic fixture line, section headings, existing reading layout, no article source list/research notes, Next Match anchor, homepage preview link and preserved LASK report. A focused raw-data comparison confirmed the table snapshot and every other fixture remain unchanged, LASK stays completed and linked, and Brentford stays scheduled with no result. `git diff --check` passed. Publication is authorised by Denny's message in this task; live status is checked after deployment.

## Evening factual refresh — 16 October 2026

- **High — Brentford FC match preview (same canonical URL above), retrieved again this evening:** the team-news section now includes Andrews' pre-Liverpool press conference. Schade and Schuster have been on grass this week, but their availability remains unconfirmed. Andrews describes Van den Berg, Damsgaard and Collins as closer to returning. Furo (metatarsal surgery) remains sidelined and Dasilva (hamstring) has not featured. Updated only the two opposition injury paragraphs; did not infer full team training or clearance to play. The page's displayed 14 October label is not treated as an exact update time.
- **High — Liverpool FC fitness update (same canonical URL above), retrieved again:** still reports Thursday's uncertainty over Gakpo, Isak and Szoboszlai. No verified clearance to play; existing wording retained.
- **High — both clubs' current fixture listings/previews:** Brentford v Liverpool remains scheduled for Saturday 17 October, 15:00 BST at Gtech Community Stadium. No retrieved announcement of postponement.
- Preserved Denny's approved preview, stable fixture ID, canonical destination, source IDs and all unrelated content. Older pre-Villa Milambo information was removed rather than presented as current team news.
- UNVERIFIED: final availability of the doubtful players; omit any assertion that they have passed fitness tests or will start.

### Match Centre checks and correction

- **High — Liverpool FC:** https://www.liverpoolfc.com/news/liverpool-v-chelsea-carabao-cup-fixture-details-confirmed — explicitly confirms Wednesday 28 October 2026, 20:00 GMT, at Anfield. Retrieved 16 October. Cross-checked **High — Chelsea FC:** https://www.chelseafc.com/en/news/article/date-and-kick-off-time-for-liverpool-carabao-cup-tie-confirmed — same date, venue and 20:00 kick-off. Replaced the stale week-commencing/TBC on the existing League Cup fixture; retained its stable ID and original draw source.
- **High — Liverpool FC official LASK report, re-read:** existing 3–6 away result, report link and scorers agree; no change.
- **High — Sky Sports full table, retrieved by curl and passed through the unchanged updateLeagueTable parser/guards:** all 20 clubs unchanged, no result imports needed. Retained actual table asOf 12 October 2026 19:44 UTC and source checkedOn; no timestamp-only table update. Node direct fetch initially failed; using the retrieved HTML through the parser's existing fetcher interface succeeded without bypassing any checks.

Evening verification: all 248 tests passed; lint passed with the existing unused-variable warning; production build and Match Centre integration route checks passed. The full table parser reported no changes. Homepage production-route checks passed, including the canonical preview destination. Initial restricted-process Git test failures were resolved by rerunning with the process permissions the test fixtures require; no test or publication guards were changed.
