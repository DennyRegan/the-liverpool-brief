# Kenny Dalglish — research register

Research date: 10 November 2026. Scope: playing career, with emphasis on Bob Paisley's Liverpool. The user explicitly commissioned new biographies and separate GitHub uploads in this chat. This file records the writer's research and the separate fresh-agent reviews completed before upload.

## Evidence

| Claims | Sources and decision |
|---|---|
| Career totals, first-season scoring, later honours | [Liverpool profile](https://www.liverpoolfc.com/info/kenny-dalglish). Competitive totals, not league-only. |
| Birth, Celtic chronology, Scottish honours | [Scottish Football Museum](https://www.scottishfootballmuseum.org.uk/exhibitions/hall-of-fame/sir-kenny-dalglish/). Historical details only; do not repeat its stale present-day employment statement. |
| Signing, fee, debut sequence | [LFChistory profile](https://www.lfchistory.net/players/287); [contemporary Liverpool Echo report](https://www.lfchistory.net/articles/2980). Distinguishes Charity Shield from league debut. |
| 1978 final | [UEFA season account](https://www.uefa.com/uefachampionsleague/news/0065-0e6a08688dbf-39a54804ad3c-1000--1977-78-dalglish-keeps-reds-on-top/); [match record](https://lfchistory.net/games/1041). Uses 64th minute. |
| 1979 campaign | [LFChistory](https://www.lfchistory.net/players/287); [season record](https://en.wikipedia.org/wiki/1978%E2%80%9379_Liverpool_F.C._season). Points basis stated explicitly. |
| Tottenham passing move | [LFC analysis](https://www.liverpoolfc.com/news/first-team/121297-analysis-longest-90-minutes). Nine-player sequence leads to Johnson's goal, distinct from the famous later McDermott goal. |
| 1981 League Cup | [LFC final retrospective](https://www.liverpoolfc.com/news/first-team/115971-league-cup-final-memories-1981); [match record](https://www.lfchistory.net/games/1207). |
| Rush partnership | [Rush interview](https://www.liverpoolfc.com/news/first-team/163450-my-telepathic-link-up-with-kenny-explained); [LFC Rush profile](https://www.liverpoolfc.com/past-players/ian-rush). The indexed-only interview paragraph was removed after editorial review because the reader link was unreliable. The remaining tactical description is editorial synthesis supported by the player profiles; no quotation is used. |
| 1983 goals and awards | [Sporting Heroes seasonal table](https://www.sporting-heroes.net/football/liverpool-fc/kenny-dalglish-8038/league-appearances-for-the-reds_a13897/); [11v11 profile](https://www.11v11.com/players/kenny-dalglish-21484/); LFChistory profile corroborates. |
| Chelsea title winner | [LFC match retrospective](https://www.liverpoolfc.com/news/first-team/118981-chelsea-memories-league-title-1986). |
| Double and FA Cup participation | [LFC 2026 retrospective](https://www.liverpoolfc.com/news/forty-years-double-probably-will-never-be-done-again?amp=1); [2026 Dalglish interview](https://www.fourfourtwo.com/person/player/its-nearly-50-years-weve-been-in-liverpool-now-weve-always-been-made-to-feel-welcome-kenny-dalglish-on-his-remarkable-career). |
| Final appearance | [LFChistory match record](https://www.lfchistory.net/games/1740); [contemporary newspaper archive](https://www.lfchistory.net/images/newspapers/riley/19900501vDerby.pdf). Date corroborated by profile; age calculated from birth date. |

## Source conflicts and scope decisions

- One LFC retrospective incorrectly calls him 38 at his final appearance; he had turned 39 in March 1990. A Wikipedia excerpt gives 5 May; the match database gives 1 May. Use the match record.
- Celtic appearance/goal totals differ among sources because competition coverage differs. Omitted entirely.
- No reconstructed career assist total: databases and the club profile do not use a consistent historic definition.
- No current Scotland record claim, health information, private-life anecdote or direct quotation. Career honours are kept separate from later managerial achievements.
- This is explicitly a player-focused biography. It does not attempt his full managerial or civic life and does not discuss Heysel or Hillsborough.
- The ending and descriptions of his contribution are editorial assessment grounded in the matches and partnerships described, rather than attributed statements.

## Review and validation

Two newly spawned reviewers, neither the writer nor the roster researcher, reviewed this biography on 10 November 2026:

- `dalglish_factual_review`: **PASS**. Independently retrieved sources for the birth and Celtic chronology, signing/debut sequence, competitive totals, finals, 1978 Tottenham combination, league statistics, awards, 1986 title-winning finish and 1990 last appearance. Recommended replacing the broken Chelsea citation; applied. Confirmed 1 May 1990 and age 39. Some older club pages were accessible only through indexed text, so reader-link availability cannot be guaranteed.
- `dalglish_editorial_review`: **PASS**, with three worthwhile edits. Removed the unnecessary correction about league versus competitive debut; integrated the 64th-minute attribution into the final narrative; removed the interview paragraph whose source link was broken. All applied. Reviewer found the football explanation substantive, the player-career scope appropriate, British English consistent and no invented quotation or scene.

Additional independent corroboration supplied by the factual reviewer: [1978–79 league table](https://www.lfchistory.net/season-archive/league-table/20), [PFA award history](https://www.thepfa.com/news/2026/8/25/pfa-merit-award-sir-kenny-dalglish), [National Football Museum](https://nationalfootballmuseum.com/halloffame/kenny-dalglish/), [1986 FA Cup final team record](https://www.lfchistory.net/games/1532).

Repository validation: the production biography loader accepts the final frontmatter and 809-word body. Production build passed and generated the biography page. A content-dependent connected-reading test initially expected the older three recommendations; the new Dalglish biography correctly takes the first slot. Updated that expected result and test description, preserving the separate cross-section assertion. **Final checks: `npm test` 129 passed, 0 failed; `npm run lint` passed; `npm run build` passed; `git diff --check` passed.** The generated Dalglish HTML exists in the production output. Build required network access for the site’s existing font dependencies.

No application logic, styling or publishing infrastructure changed. The biography, review register, checklist update and directly affected test expectation form this individual upload.

## Re-review and restoration — 13 November 2026

The biography was removed from the site on 10 November and restored on Denny's instruction of 13 November 2026, after a fresh round of independent review. Two new reviewers who had not seen the piece or this register (and did not read it) checked it:

- Fact-check: **FAIL, corrections applied.** One error: the "nine Liverpool players" passing move in the 7–0 against Tottenham (2 September 1978) could not be supported, and the Souness link in it was wrong; LFChistory credits Jimmy Case with the pass for both Dalglish goals (8' and 20'). Replaced with that sourced line. "Established himself in 1971" was unsupported and was cut. "Lifted pass" at Chelsea changed to "flick" (Beglin). Totals now labelled "all competitions". Confirmed: birth, Celtic chronology and honours, signing date and fee, Charity Shield, first league game (Middlesbrough, 20 August 1977, 7th minute), Anfield debut (23 August 1977), 1978 final, 1978–79 league figures, awards, League Cup replay, titles, Chelsea 3 May 1986, last game 1 May 1990. Several club pages could not be opened by the reviewer, so those facts were confirmed from LFChistory and club mirror pages instead.
- Editorial: **FAIL, edits applied.** Decade tag changed from 1970s to 1980s (career 1977–1990); all inline links removed in line with the published biographies (attribution is now in prose); the unevidenced Ian Rush section was removed rather than padded; the repeated passing-versus-finishing thesis was cut; title, excerpt, section headings and ending rewritten; blank line after the frontmatter removed. The Rush partnership is therefore no longer claimed.

Files moved from `docs/removed-biographies/` to `content/biographies/`.
