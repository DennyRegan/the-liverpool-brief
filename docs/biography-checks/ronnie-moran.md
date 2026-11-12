# ronnie-moran: checks before publication

Draft by GPT (branch editorial/next-ten-biographies-batch-four-2026-10-03). Checked on 10 November 2026 by three fresh agents: fact-check of the draft, edit, then an independent final check of the edited text.

---

# Fact-check: Ronnie Moran (draft: /home/claude/bios/gpt/ronnie-moran.md)

Checked 10 November 2026.

## Sensitive flags (read first)

- **Heysel / Hillsborough disaster:** NOT mentioned anywhere in the draft. (The four European Cups line does not name 1985; nothing to flag.)
- **Graeme Souness's heart surgery (1992):** mentioned once, neutrally ("while Souness underwent heart surgery"). Factually correct and handled sensitively; keep it to that level. Do not add detail (triple bypass, the post-surgery newspaper controversy, his being watched by a doctor at Wembley) without Denny's say-so.
- **Death:** 22 March 2017, aged 83. The draft gives no cause and does not mention his illness. Several sources (RTÉ, Sky) report vascular dementia and a care-home move; the draft rightly leaves this out. Keep it out unless Denny decides otherwise.
- **Dalglish's 1991 resignation:** mentioned neutrally. Fine.

---

## 1. Summary

The draft is largely reliable. Every key date requested checks out: born 28 February 1934 in Crosby; joined 1949; professional January 1952; debut 22 November 1952 (3–2 defeat at Derby); 16 league games in 1961–62 and 35 in 1963–64; coaching from 1966; caretaker in 1991 (10 games, W4 D1 L5) and 1992; led the team out at the 1992 FA Cup final (2–0 v Sunderland); retired 1998; died 22 March 2017 aged 83. The only direct quotation (Ian Rush) is word for word. The problems are small: one disputed detail, a few lightly sourced paraphrases, and some things that aren't strictly facts.

Errors and weak points:
1. **"His late penalty miss against Swansea"**: LFChistory's match record puts the miss at 63 minutes with Liverpool 1–2 down. Swansea City's own article calls it "late". Drop "late".
2. **"Gerry Byrne moved to the left"**: no source ties Byrne's move to 1964–65. LFChistory dates Byrne's switch to left-back to autumn 1960 and says only that Lawler "became the right-back" and Moran lost his place. Simplify the wording.
3. **"In an extract from the biography *Mr Liverpool*, published by the club in 2018"**: the liverpoolfc.com tribute carries no visible date, so "2018" can't be confirmed. The book itself came out in late February/March 2017. The "correcting them from the touchline" detail was not found in that extract, which describes him massaging players' legs in the dressing room and telling them whom to mark.
4. **"Roy Evans described a coaching staff whose different temperaments complemented one another"**: not found. The source has Evans saying Moran "made sure everyone fell in line" and was called the "sergeant-major" but was "much more than that".
5. **"an interview published by Liverpool in 2017"**: the page shows no date. Its article ID sits among the club's 22–23 March 2017 tribute pieces, so 2017 is very likely but not shown on the page. This is low risk.
6. **Omission, not an error:** the "Bugsy" nickname is confirmed (liverpoolfc.com; tweets from Ronnie Whelan and Jamie Carragher), but the draft never uses it. Add it if wanted.
7. **Not facts, but they will break the build:** the frontmatter is JSON, not YAML. It is missing `date`, and `historicalPeriod` should be the years, e.g. "1949–1998". It carries retired fields (`historyEras`, `playerIds`, `category`, `articleType`, `editorialMode`) that the strict `BiographySchema` will reject. The excerpt is thin. There is also a `## Sources` list in the body, but biographies keep attribution inline.

## 2. Current status (as of 10 November 2026)

He died on 22 March 2017, aged 83. His son Paul announced it that morning (RTÉ, 22 March 2017; LFChistory; Sky Sports). The draft is correct.

## 3. Figure list

| Claim | Correct figure | Sources (URLs) | Verdict |
|---|---|---|---|
| Born Crosby, 28 February 1934 | 28 Feb 1934, Crosby | https://www.lfchistory.net/players/383 ; https://www.11v11.com/players/ronnie-moran-32285/ ; https://www.rte.ie/sport/soccer/2017/0322/861651-ronnie-moran/ | Confirmed (2+) |
| Joined 1949 while an apprentice electrician | 1949, part-timer and apprentice electrician, played for 'C' team | https://www.lfchistory.net/players/383 ; https://www.rte.ie/sport/soccer/2017/0322/861651-ronnie-moran/ ; https://www.liverpoolfc.com/news/first-team/257561-ronnie-moran-the-remarkable-life-of-mr-liverpool | Confirmed (2+) |
| Signed professional January 1952 | 7 January 1952 | https://www.lfchistory.net/players/383 ; https://www.rte.ie/sport/soccer/2017/0322/861651-ronnie-moran/ | Confirmed (2+) |
| Debut 22 November 1952, 3–2 defeat at Derby County | 22 Nov 1952, Baseball Ground, lost 3–2 | https://liverpoolfc.com/news/day-ronnie-moran-makes-liverpool-debut ; https://www.liverpoolfc.com/news/first-team/257561-ronnie-moran-the-remarkable-life-of-mr-liverpool ; https://www.lfchistory.net/players/383 (date and venue) | Confirmed (2+) |
| Liverpool relegated 1954 | Relegated at end of 1953–54 | https://www.lfchistory.net/players/383 | Confirmed (single source: LFChistory) |
| Regular at left-back in Second Division years | Established at left-back from 1954–55/1955–56 | https://www.lfchistory.net/players/383 ; https://www.liverpoolfc.com/news/liverpools-greatest-no77-ronnie-moran/ | Confirmed (2+) |
| Club captain by the time Shankly took over in 1959 | Club captain when Shankly arrived (Dec 1959); 47 games as captain | https://www.lfchistory.net/players/383 ; https://www.liverpoolfc.com/news/liverpools-greatest-no77-ronnie-moran/ ; https://lfchistory.net/articles/2424 | Confirmed (2+) |
| Ron Yeats: strong, good in the air, used the ball well | Yeats: "A 100 per cent lad", strong, good in the air, used the ball well | https://www.liverpoolfc.com/news/liverpools-greatest-no77-ronnie-moran/ | Confirmed (single source: liverpoolfc.com) |
| Injury interrupted early Shankly years | Injured 1 Oct 1960, out about 14 months | https://www.lfchistory.net/players/383 ; https://www.liverpoolfc.com/news/liverpools-greatest-no77-ronnie-moran/ | Confirmed (2+) |
| 16 league apps in 1961–62 Second Division title | 16 league (19 all comps) | https://www.lfchistory.net/players/383 ; https://en.wikipedia.org/wiki/Ronnie_Moran | Confirmed (2+) |
| 35 apps in 42-match 1963–64 title season | 35 league; missed seven | https://www.lfchistory.net/players/383 ; https://www.liverpoolfc.com/news/first-team/161393-heroes-of-shankly-s-first-league-title | Confirmed (2+) |
| Aged 30 in the title season | Born Feb 1934; title won April 1964, so 30 | Arithmetic from birth date | Confirmed |
| First league title since 1947 | Yes | https://www.liverpoolfc.com/news/first-team/161393-heroes-of-shankly-s-first-league-title | Confirmed (single source: liverpoolfc.com) |
| Penalty miss v Swansea, 1964 FA Cup quarter-final | 29 Feb 1964, Liverpool 1–2 Swansea Town; Moran missed at 63' with Liverpool 1–2 down. Swansea's site says "late" | https://lfchistory.net/games/220 ; https://www.swanseacity.com/news/snapshot-dwyer-stars-anfield ; https://www.lfchistory.net/players/383 | Corrected (drop "late") |
| Lawler took right-back 1964–65; Byrne moved left | Lawler became right-back and Moran lost his place: confirmed. Byrne "moved to the left" in 1964–65: not sourced (LFChistory dates Byrne's switch to left-back to 1960) | https://www.lfchistory.net/players/383 ; https://www.lfchistory.net/players/273 | Corrected (simplify) |
| Missed 1965 FA Cup final; played both legs v Inter | Yes | https://www.lfchistory.net/players/383 ; https://www.liverpoolfc.com/news/liverpools-greatest-no77-ronnie-moran/ | Confirmed (2+) |
| Last competitive first-team game 12 May 1965 in Milan | Last appearance 12 May 1965 (2nd leg, San Siro) | https://www.lfchistory.net/players/383 ; https://en.wikipedia.org/wiki/Ronnie_Moran | Confirmed (2+) |
| 379 apps, 17 goals all competitions | 379 (342 League, 32 FA Cup, 4 European Cup, 1 Charity Shield); 17 goals | https://www.lfchistory.net/players/383 ; https://www.rte.ie/sport/soccer/2017/0322/861651-ronnie-moran/ ; https://www.liverpoolfc.com/news/liverpools-greatest-no77-ronnie-moran/ | Confirmed (2+) |
| Shankly offered coaching role in 1966 | 1966–67 pre-season (Sky says 1965) | https://www.lfchistory.net/players/383 ; https://www.liverpoolfc.com/info/ronnie-moran-0 ; https://www.inkl.com/news/ronnie-moran-liverpool-player-coach-and-assistant-manager-dies-aged-83 | Confirmed (2+) |
| Worked with younger players while still playing for reserves | Youth teams from 1966; played on in reserves about two more years; formally retired as player 1968–69 | https://legacy.liverpoolfc.com/news/first-team/257603-a-tribute-to-ronnie-moran-without-him-lfc-wouldn-t-be-what-it-is-today ; https://www.pressreader.com/uk/the-independent-1029/20170323/282827895971232 ; https://www.rte.ie/sport/soccer/2017/0322/861651-ronnie-moran/ | Confirmed (2+) |
| Reserve-team manager 1971 | 1971 | https://legacy.liverpoolfc.com/news/first-team/257603-a-tribute-to-ronnie-moran-without-him-lfc-wouldn-t-be-what-it-is-today ; https://en.wikipedia.org/wiki/Ronnie_Moran | Confirmed (2+) |
| Consecutive Central League titles 1973 and 1974 | Clemente (LFC): 1973 and 1974. RTÉ and Wikipedia mention only 1972–73 (they don't contradict) | https://legacy.liverpoolfc.com/news/first-team/257603-a-tribute-to-ronnie-moran-without-him-lfc-wouldn-t-be-what-it-is-today ; https://www.rte.ie/sport/soccer/2017/0322/861651-ronnie-moran/ | 1973: Confirmed (2+); 1974: Confirmed (single source: liverpoolfc.com) |
| Paisley appointed him first-team trainer in 1974, with physio duties | July 1974, first-team trainer plus physio duties | https://legacy.liverpoolfc.com/news/first-team/257603-a-tribute-to-ronnie-moran-without-him-lfc-wouldn-t-be-what-it-is-today ; https://www.liverpoolfc.com/news/announcements/292328-ronnie-moran-lfc-tribute (first-team trainer before 1979; physio) | Confirmed (single source for date: liverpoolfc.com) |
| Chief coach 1979 | Summer 1979, promoted from first-team trainer; Roy Evans took his old duties | https://www.liverpoolfc.com/news/announcements/292328-ronnie-moran-lfc-tribute | Confirmed (single source: liverpoolfc.com) |
| Kept detailed diaries (training, matches, injuries) | Yes | https://www.liverpoolfc.com/news/first-team/257561-ronnie-moran-the-remarkable-life-of-mr-liverpool | Confirmed (single source: liverpoolfc.com) |
| Served under Paisley, Fagan, Dalglish, Souness, Evans | Yes (and Shankly) | https://www.liverpoolfc.com/info/ronnie-moran-0 ; https://www.skysports.com/football/news/11669/10810358/liverpool-great-ronnie-moran-has-died-at-the-age-of-83 | Confirmed (2+) |
| Four European Cups while with first team | 1977, 1978, 1981, 1984, all after he became first-team trainer in 1974 | https://www.liverpoolfc.com/news/first-team/257561-ronnie-moran-the-remarkable-life-of-mr-liverpool ; https://liverpoolfc.com/news/day-ronnie-moran-makes-liverpool-debut | Confirmed (2+) |
| Took charge when Dalglish resigned Feb 1991 | Caretaker 22 Feb to 13 Apr 1991 | https://www.lfchistory.net/managers/17 ; https://www.liverpoolfc.com/info/ronnie-moran-0 ; https://en.wikipedia.org/wiki/Ronnie_Moran | Confirmed (2+) |
| 10 games: W4 D1 L5 | 10 games, 4–1–5 (9 league, 1 FA Cup) | https://www.lfchistory.net/managers/17 ; https://www.liverpoolfc.com/info/ronnie-moran-0 (10 matches) ; https://lfchistory.net/articles/2424 (4 wins, 5 losses) | Confirmed (2+ for 10 games; W/D/L single source: LFChistory) |
| Lost first three games | Luton 3–1 (a), Everton FA Cup 2nd replay (L), Arsenal (L) | https://www.lfchistory.net/managers/17 ; https://en.wikipedia.org/wiki/Ronnie_Moran (Luton) | Confirmed (single source: LFChistory) |
| 7–1 at Derby, 5–4 at Leeds | Derby 1–7 Liverpool (Baseball Ground); Leeds 4–5 Liverpool, 13 Apr 1991 | https://www.lfchistory.net/managers/17 | Confirmed (single source: LFChistory) |
| Spell ended when Souness became manager | Yes, April 1991 | https://www.lfchistory.net/managers/17 ; https://en.wikipedia.org/wiki/Ronnie_Moran | Confirmed (2+) |
| Deputised 1992 during Souness's heart surgery | April 1992 | https://www.lfchistory.net/managers/17 ; https://www.rte.ie/sport/soccer/2017/0322/861651-ronnie-moran/ ; https://www.liverpoolfc.com/info/ronnie-moran-0 | Confirmed (2+) |
| Oversaw closing league fixtures and FA Cup semi-final replay v Portsmouth | Final seven league games and the semi-final replay | https://www.lfchistory.net/managers/17 ; https://www.liverpoolfc.com/info/ronnie-moran-0 ("closing weeks") | Confirmed (2+) |
| Souness asked Moran to lead team out at Wembley v Sunderland; won 2–0 | Yes | https://www.skysports.com/football/news/11669/10810358/liverpool-great-ronnie-moran-has-died-at-the-age-of-83 ; https://www.liverpoolfc.com/news/first-team/257561-ronnie-moran-the-remarkable-life-of-mr-liverpool ; https://www.lfchistory.net/managers/17 | Confirmed (2+) |
| Retired 1998 after 49 years | 1998, 49 years (Sky: "just short of 50"; Independent: 46 years counting from 1952) | https://www.lfchistory.net/players/383 ; https://www.skysports.com/football/news/11669/10810358/liverpool-great-ronnie-moran-has-died-at-the-age-of-83 | Confirmed (2+) |
| Continued visiting Melwood | Tuesdays and Fridays at Melwood after retiring, at Sammy Lee's invitation | https://www.pressreader.com/uk/the-independent-1029/20170323/282827895971232 ; https://www.inkl.com/news/ronnie-moran-liverpool-player-coach-and-assistant-manager-dies-aged-83 | Confirmed (2+) |
| Died 22 March 2017, aged 83 | Yes | https://www.rte.ie/sport/soccer/2017/0322/861651-ronnie-moran/ ; https://www.lfchistory.net/players/383 ; https://www.skysports.com/football/news/11669/10810358/liverpool-great-ronnie-moran-has-died-at-the-age-of-83 | Confirmed (2+) |
| "Bugsy" nickname (requested check; not in draft) | Known at Anfield as "Bugsy" | https://liverpoolfc.com/news/day-ronnie-moran-makes-liverpool-debut ; https://www.rte.ie/sport/soccer/2017/0322/861651-ronnie-moran/ (Whelan tweet) ; https://www.inkl.com/news/ronnie-moran-liverpool-player-coach-and-assistant-manager-dies-aged-83 (Carragher tweet) | Confirmed (2+), not used in the draft |
| Rush interview published by club in 2017 | Page undated; article ID among the 22–23 March 2017 tribute pieces | https://legacy.liverpoolfc.com/news/first-team/257666-rush-ronnie-made-me-the-player-i-was-it-s-as-simple-as-that | Confirmed (single source: liverpoolfc.com), year inferred |
| *Mr Liverpool* extract "published by the club in 2018" | Page undated. Book released weeks before his death (Feb/Mar 2017) | https://www.liverpoolfc.com/news/announcements/292328-ronnie-moran-lfc-tribute | Unsourced (year) |
| Hansen: brief, pointed reminders not long speeches | "never gave long speeches, just sharp reminders of what we had to do" | https://www.liverpoolfc.com/news/announcements/292328-ronnie-moran-lfc-tribute | Confirmed (single source: liverpoolfc.com) |
| Evans: staff's different temperaments complemented each other | Not found. Evans: Moran "made sure everyone fell in line", called "sergeant-major" but "much more than that" | https://www.liverpoolfc.com/news/announcements/292328-ronnie-moran-lfc-tribute | Corrected |
| Marking instructions before matches; correcting from touchline | Marking instructions while massaging players' legs in dressing room: confirmed. Touchline: not in this extract | https://www.liverpoolfc.com/news/announcements/292328-ronnie-moran-lfc-tribute | Corrected (part) |
| Ian St John on continuity | St John: "He stayed within the club ... he just led his whole life that way" | https://www.liverpoolfc.com/news/first-team/257711-st-john-ronnie-moran-s-lfc-journey-is-unique | Confirmed (single source: liverpoolfc.com) |
| Rush paraphrases (mistakes; pass/shoot; consistency; Dalglish/Souness; reassurance) | Rush: Moran focused on "the bad things I did"; "I was shooting and he'd say pass, I was passing and he'd say shoot"; "five out of six good games ... three out of six good games is not good enough"; treated everyone the same "from me as a teenager to Kenny Dalglish and Graeme Souness"; took shy players aside to tell them "all the good things" | https://legacy.liverpoolfc.com/news/first-team/257666-rush-ronnie-made-me-the-player-i-was-it-s-as-simple-as-that | Confirmed (single source: liverpoolfc.com) |

Note on sources that disagree: Wikipedia's infobox gives 343 apps and 16 goals (league only, and slightly off LFChistory's 342/15). RTÉ says he won "two league titles and the FA Cup as a player", which is wrong: he did not play in the 1965 final. The draft follows LFChistory, the right call.

## 4. Corrections

1. "His late penalty miss against Swansea in the 1964 FA Cup quarter-final cost Liverpool an opportunity to draw level."
   **Replace with:** "His missed penalty against Swansea Town in the 1964 FA Cup quarter-final, with Liverpool 2–1 down, cost them a chance to draw level."

2. "The following season, Chris Lawler established himself at right-back and Gerry Byrne moved to the left, leaving Moran outside the preferred defence."
   **Replace with:** "The following season, Chris Lawler established himself at right-back and Moran lost his place in the side."

3. "In an extract from the biography *Mr Liverpool*, published by the club in 2018, Moran is shown giving players their marking instructions before matches and correcting them from the touchline."
   **Replace with:** "In an extract from the biography *Mr Liverpool*, published by the club, Moran is shown in the dressing room before matches, massaging players' legs while telling them whom to mark."

4. "Roy Evans described a coaching staff whose different temperaments complemented one another."
   **Replace with:** "Roy Evans recalled a man who made sure everyone fell in line, and who was much more than the 'sergeant-major' of his reputation."

5. (Optional, low risk) "Looking back in an interview published by Liverpool in 2017, Rush said:"
   **Safer:** "In a tribute published by Liverpool after Moran's death, Rush said:"

6. (Optional addition, if wanted) The "Bugsy" nickname is confirmed: "known at Anfield as 'Bugsy'".

7. (Build, not fact) Rebuild the frontmatter as YAML to `BiographySchema`, for example `historicalPeriod: "1949–1998"`, `decade: "1950s"`, add `date` and an optional `role` (e.g. "Player, coach and caretaker manager"). Remove `historyEras`, `playerIds`, `category`, `articleType` and `editorialMode`. Remove the `## Sources` list from the body.

## 5. Cut list

- "published by the club in 2018" (year unverified; covered by correction 3).
- "and correcting them from the touchline" (not in the cited extract; covered by correction 3). His touchline shouting is widely described elsewhere, but not in this source.
- "whose different temperaments complemented one another" (not found; covered by correction 4).

Nothing else needs cutting.

## 6. Quotes

| Quotation | Verdict | Source |
|---|---|---|
| Ian Rush: "He made me the player I was, it's as simple as that." | Confirmed word for word | https://legacy.liverpoolfc.com/news/first-team/257666-rush-ronnie-made-me-the-player-i-was-it-s-as-simple-as-that |

That is the draft's only direct quotation. Its other attributed views (Yeats, Rush, Hansen, Evans, St John) are paraphrases. Each is assessed in the figure list: the Evans one needs correction 4; the rest are fair.

---

# Editor's note

# Edit note: Ronnie Moran

Body: about 930 words. Frontmatter rebuilt as YAML to BiographySchema (slug ronnie-moran, date 2026-11-10, historicalPeriod "1949–1998", decade "1960s", role "Defender, coach and caretaker manager"). Retired fields and the Sources list removed.

Corrections applied:
- Swansea: "late" dropped. The penalty is now the 63rd minute with Liverpool 2–1 down, credited to LFChistory's match record (29 February 1964, lost 2–1 at Anfield).
- Lawler: "Chris Lawler took right-back and Moran lost his place". Byrne removed.
- *Mr Liverpool*: no year, no touchline. Only what the extract shows: dressing room before matches, massaging legs, telling players whom to mark.
- Roy Evans: now his verified words only: "made sure everyone fell in line", called the "sergeant-major" but "much more than that".
- Rush quote: kept (verified word for word), now introduced as "a tribute published by Liverpool after Moran's death" with no year.
- "Bugsy" added in the opening paragraph.

Sensitive points: Souness's 1992 heart surgery kept to one neutral mention. No cause of death or illness. No Heysel or Hillsborough.

Cut or softened: the draft's essay lines ("That description matters", "His career connects…", "The continuity … had a working method behind it", the "record belongs to the managers…" paragraph and the closing moral). The diaries line is now the bare fact, without the draft's claim about knowledge being passed on. The St John "continuity" line is reduced to his confirmed point that Moran stayed within the club all his life (paraphrased, as the fact-check gives it only with an ellipsis).

Added from the fact-check figure list: professional date (7 January 1952), 47 games as captain, the 14-month injury from 1 October 1960, the 379 appearance breakdown, retiring as a player in 1968–69, Evans taking his trainer's job in 1979, the years of the four European Cups, the caretaker dates and first three opponents, the final seven league games in 1992, Melwood visits at Sammy Lee's invitation, and his son Paul announcing his death.

---

# Final check: Ronnie Moran

Checked 10 November 2026.

## Verdict: PASS WITH FIXES

## Changes made (in /home/claude/bios/work/ronnie-moran/bio.md)

1. Swansea penalty minute removed.
   - Old: "Moran missed a penalty in the 63rd minute with Liverpool 2–1 down, according to LFChistory's match record, and with it went their chance to draw level."
   - New: "Moran missed a penalty with Liverpool 2–1 down, and with it went their chance to draw level."
   - Why: LFChistory disagrees with itself. The match record (lfchistory.net/games/220) lists the miss after a "63'" marker that seems to belong to Peter Thompson's goal, and gives no minute for the miss. The player profile (lfchistory.net/players/383) says Swansea "were leading 2-1 when Moran squandered his spot-kick in the eightieth minute". Swansea's own site calls it "late". The 63rd minute can't be stood up. The score when he missed (Liverpool 2–1 down) and the date (29 February 1964, lost 2–1 at Anfield) are confirmed.

2. Caretaker sequence corrected.
   - Old: "Liverpool then won 7–1 at Derby County and 5–4 at Leeds United, the second of those on 13 April, his last game."
   - New: "Later in the spell Liverpool won 7–1 at Derby County, and his last game, on 13 April, was a 5–4 win at Leeds United."
   - Why: "then" made Derby follow straight on from the three defeats. LFChistory (lfchistory.net/managers/17) gives the order as: Luton (L 1–3), Everton FA Cup second replay (L), Arsenal (L), two league wins, Derby (W 7–1), QPR (L), Southampton (L), Coventry (D 1–1), Leeds (W 5–4, 13 April).

## Editor's additions checked

- Signed professional 7 January 1952: confirmed (LFChistory infobox; RTÉ gives January 1952).
- Captained the team 47 times: confirmed (LFChistory "Total games as captain"). Club captain when Shankly arrived in 1959: confirmed (LFChistory; liverpoolfc.com).
- Injured 1 October 1960 and out about 14 months: confirmed (LFChistory profile, which also notes one unsuccessful comeback game in January 1961; the bio's "about 14 months" is fair).
- 379 appearances (342 league, 32 FA Cup, 4 European Cup, 1 Charity Shield) and 17 goals: confirmed (LFChistory).
- Retired as a player in 1968–69, after a last first-team game on 12 May 1965: confirmed (RTÉ: "formally retiring from playing during the 1968-69 season"; the Independent: two more years in the reserves). The wording is consistent: "last first-team appearance" for 1965, then "played on in the reserves… formally retiring as a player in 1968–69".
- Evans took his trainer's job in 1979: confirmed ("promoted from first-team trainer to chief coach, with Roy Evans taking over his prior duties", liverpoolfc.com tribute).
- Caretaker 22 February to 13 April 1991; first three games Luton (3–1 away defeat), Everton FA Cup second replay, Arsenal; 10 games (9 league, 1 FA Cup), won 4, drawn 1, lost 5: confirmed (LFChistory managers/17). The sequence wording is fixed (change 2).
- 1992: final seven league games plus the FA Cup semi-final replay with Portsmouth, and led the team out at Wembley at Souness's request; 2–0 v Sunderland: confirmed (LFChistory managers/17; Sky; liverpoolfc.com).
- Melwood on Tuesdays and Fridays, at first at Sammy Lee's invitation: confirmed (the Independent, 23 March 2017).
- Son Paul announced his death that morning: confirmed (RTÉ quotes Paul Moran's tweet: "my dad passed away this morning").
- Central League titles 1973 and 1974; reserve-team manager 1971; first-team trainer with physio duties from July 1974: confirmed (Carl Clemente, liverpoolfc.com).

## Quotes (word for word)

- Rush: "He made me the player I was, it's as simple as that." Confirmed (legacy.liverpoolfc.com/…/257666).
- Evans: "made sure everyone fell in line" and "much more than that". Confirmed. The source reads: "He made sure everyone fell in line and gets called the 'sergeant-major', but he was much more than that." (liverpoolfc.com/…/292328).
- The Rush paraphrases (pass/shoot, five out of six games, treating everyone the same, taking shy players aside), Hansen's "never gave long speeches" and the massaging-legs and marking passage all match their sources.

## Sensitive

- Souness's heart surgery: one neutral mention ("while Souness had heart surgery"), with no detail. Fine.
- No Heysel, no Hillsborough, no cause of death and no illness. Fine.

## Format and writing

- The frontmatter has exactly title, slug, date, historicalPeriod ("1949–1998", a year span, en dash), decade, role and excerpt. The body starts directly after the closing ---. There are no links and no sources list. The headline is in sentence case. Ranges use en dashes.
- British spelling throughout. I found no AI-sounding phrasing or essay lines.

## Remaining concerns (minor, no action required)

- decade is "1960s". The fact-check suggested "1950s" (most of his playing years). Either is defensible, but Denny may want to choose.
- 35 league games in 1963–64 is stated twice (the opening paragraph and the title section). The repetition is harmless.
