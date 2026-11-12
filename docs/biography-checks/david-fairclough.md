# david-fairclough: checks before publication

Draft by GPT (branch editorial/next-ten-biographies-batch-four-2026-10-03). Checked on 10 November 2026 by three fresh agents: fact-check of the draft, edit, then an independent final check of the edited text.

---

# Fact-check: David Fairclough (draft /home/claude/bios/gpt/david-fairclough.md)

Checked 10 November 2026.

## Sensitive flags

- **Heysel / Hillsborough disaster:** not mentioned.
- **Death / illness / personal matters:** none in the draft. Injuries are mentioned only as football matters (fine).
- **Do not add:** Wikipedia records Fairclough's minor heart attack (3 October 2010) and the death of his wife Jan (9 April 2011). Neither is in the draft. Keep them out.

## 1. Summary

The draft is very reliable. Every number checked matches LFChistory and, where available, a second source: birth date, debut, the 154/92/62 appearance split, 55 goals (37 as a starter, 18 as a substitute), 34 in 98 league games, the 1975–76 and 1977–78 season figures, the Derby brace, the Hamburg goals, the 84th-minute St-Étienne goal from Ray Kennedy's pass, both 1977 finals and the 1978 final start. Its one quotation is word for word. There are no outright factual errors. The issues below are about precision and context, plus some useful omissions.

Issues:
1. **154 appearances / 62 as substitute** are LFChistory's figures. Wikipedia gives 153 and 61. The difference is small. Keep 154/62, which is the specialist source and is internally consistent with 37+18 goals, but don't present it as universal.
2. **"With time running out, Paisley replaced Toshack with Fairclough"**: he came on on 73 or 74 minutes (LFChistory gives both) and the LFC/Wikipedia accounts say "the last 20 minutes". About 16 minutes were left, so "time running out" overstates it a little. Soften.
3. **"I had a lot more to offer"** is verbatim, but in the interview it refers specifically to Paisley using him as a sub or leaving him out *after the St-Étienne goal* (when he says he was on Ron Greenwood's radar). The draft places it as a general career verdict. Acceptable, but tighter framing is safer (see Corrections).
4. **1981–82 "as Ian Rush established himself"**: true but incomplete. LFChistory says a knee injury ended his 1980–81 season in February 1981, and he spent 1981–82 in the reserves (14 goals in 29) before returning to the first team in October 1982. Mention the injury so it doesn't read as purely a selection matter.
5. **Front matter (format, not fact):** `historicalPeriod` is "1974–1983" and there is no `date` field. The project archive format uses a publication `date` and the event date in `historicalPeriod`. If a range is kept for bios, "1975–1983" (first-team span) or "1972–1983" (time at club) are both more defensible than 1974, which is only his professional-contract date. Check against the bio schema before build.

Omissions the caller asked about (not errors; add if wanted):
- **Burnley, 27 March 1976:** came on as a substitute and scored twice in a 2–0 league win (LFChistory games list). Draft doesn't mention it.
- **Derby date:** the Everton winner was on **3 April 1976**, Grand National day, a 1–0 win. He came on for Toshack (LFChistory: 64'; LFC says with 25 minutes left) and scored with about two minutes left.
- **"Supersub" name:** no source says who coined it. Wikipedia records ITV commentator Gerald Sinstadt's line at the St-Étienne goal, "Supersub strikes again!" (implying the tag already existed by March 1977). Don't attribute an origin.
- **1976 UEFA Cup final:** he **started** the first leg v Club Brugge (28 April 1976, 3–2) and came on in the second leg (19 May 1976, 1–1). So "started a European Cup final" is true, but he also started a UEFA Cup final leg.
- **Titles and medals:** League 1975–76 (14 league apps) and 1976–77 (20 league apps). Both are listed in his honours by LFChistory and Wikipedia. Also 1979–80 title, UEFA Cup 1976, European Cups 1977 and 1978, Super Cup 1977. The draft mentions only the 1976 title. Note that he was an unused sub in the 1977 European Cup final, so avoid wording that suggests he played in it.
- **Toronto Blizzard:** summer 1982 loan in the NASL "to keep his fitness levels up" (LFChistory). Wikipedia gives 20 apps and 4 goals. Not in the draft.
- **Clubs after Liverpool:** Luzern 1983–85, Manchester City 1985 (no apps), Norwich City 1985, Oldham Athletic 1985–86, Rochdale 1986 (no apps), Beveren 1986–89, Tranmere Rovers 1989–90, Wigan Athletic 1990–91, then non-league Knowsley. The draft's list is accurate for clubs where he played.
- **Media / book:** autobiography *Supersub: The Story of Football's Most Famous Number 12* (2015, with Mark Platt). Wikipedia says he works as a pundit and on the after-dinner circuit. No current named outlet could be confirmed (see section 2).

## 2. Current status (10 November 2026)

**Alive, aged 69** (born 5 January 1957). No report of his death was found. He was quoted by liverpoolfc.com in a tribute to Willie Stevenson (c. May 2025, as a member of the Forever Reds former players' association), and he appeared on a football history podcast reported by Empire of the Kop on 16 April 2025. Wikipedia describes him as a pundit and after-dinner speaker and a partner in JDB Health & Performance Ltd. No 2026 source naming a specific broadcaster or role was found. Safe wording, if needed: "a former Liverpool forward who still speaks regularly about the club". Don't name a broadcaster. (The draft makes no current-status claim, which is fine.)

## 3. Figure list

| Claim | Correct figure | Sources (URLs) | Verdict |
|---|---|---|---|
| Born in Liverpool, 5 January 1957 | 5 January 1957, Liverpool | https://www.lfchistory.net/players/298 ; https://en.wikipedia.org/wiki/David_Fairclough ; https://www.liverpoolfc.com/info/david-fairclough ("Liverpool-born") | Confirmed (2+) |
| Joined club 1972, professional January 1974 | Joined 1972; professional 9 January 1974 | https://www.lfchistory.net/players/298 | Confirmed (single source: LFChistory) |
| Shankly manager when he signed; Paisley gave him his chance | Shankly manager until July 1974; debut Nov 1975 under Paisley | https://www.lfchistory.net/players/298 ; https://www.lfchistory.net/SeasonArchive/Game/909 (Paisley manager) | Confirmed (2+) |
| Debut 1 Nov 1975, started 1–0 win at Middlesbrough | Started, Middlesbrough 0–1 Liverpool, Ayresome Park | https://www.lfchistory.net/players/298/games-per-season/17 ; https://en.wikipedia.org/wiki/David_Fairclough | Confirmed (2+) |
| First goal 4 Nov 1975, as sub, 6–0 v Real Sociedad (UEFA Cup) | Correct | https://www.lfchistory.net/players/298/games-per-season/17 ; https://en.wikipedia.org/wiki/David_Fairclough | Confirmed (2+) |
| Toshack's injury problems created openings | Fairclough: Toshack "was having problems with his achilles tendon" | https://www.lfchistory.net/articles/478 | Confirmed (single source: LFChistory interview) |
| 1975–76 league: 7 goals in 14 apps, 9 as sub | 14 apps (5 starts, 9 sub), 7 goals; 19 apps / 8 goals all comps | https://www.liverpoolfc.com/info/david-fairclough ; https://www.lfchistory.net/players/298/games-per-season/17 | Confirmed (2+) |
| Burnley (not in draft) | 27 Mar 1976, sub, 2 goals, won 2–0 | https://www.lfchistory.net/players/298/games-per-season/17 | Confirmed (single source: LFChistory) |
| Everton derby winner as sub, from about halfway, beat Dai Davies, late, 1–0 | 3 Apr 1976 (Grand National day), 1–0; sub for Toshack; won ball on halfway; scored with about two minutes left; Dai Davies in goal | https://www.lfchistory.net/SeasonArchive/Game/909 ; https://www.liverpoolfc.com/news/anfield-road-end-goals-fairclough-musters-magic-settle-merseyside-derby ; https://www.liverpoolfc.com/info/david-fairclough ; https://www.lfchistory.net/players/298 | Confirmed (2+). Note: the number of defenders beaten varies (four per LFC feature, six per LFC profile). The draft wisely gives no number. |
| Official club profile calls it his own favourite goal | "Fairclough's own favourite goal also came as a substitute at Anfield" | https://www.liverpoolfc.com/info/david-fairclough | Confirmed (single source: official club) |
| St-Étienne 16 Mar 1977: Liverpool 2–1 up, St-Étienne ahead on away goals | First leg 1–0 St-Étienne; Keegan 2', Bathenay 50', Kennedy 59' | https://rsssf.org/ec/ec197677det.html ; https://www.lfchistory.net/articles/1964 | Confirmed (2+) |
| St-Étienne were the French champions | Yes (1975–76 champions, so in the European Cup) | https://www.lfchistory.net/articles/1964 (context); general record | Confirmed |
| Paisley replaced Toshack with Fairclough, "with time running out" | Replaced Toshack on 73'/74' (LFChistory gives both); about 16 minutes left | https://www.lfchistory.net/articles/1964 ; https://www.lfchistory.net/players/298 ; https://www.11v11.com/matches/liverpool-v-saint-etienne-16-march-1977-219393/ | Corrected (substitution confirmed; soften timing) |
| Goal in 84th minute | 84' | https://www.11v11.com/matches/liverpool-v-saint-etienne-16-march-1977-219393/ ; https://rsssf.org/ec/ec197677det.html ; https://www.lfchistory.net/articles/1964 ("six minutes left") | Confirmed (2+) |
| Ray Kennedy played the ball beyond the defence | "Ray Kennedy flicked a ball from midfield beyond the French defence" | https://www.lfchistory.net/articles/1964 ; https://www.lfchistory.net/players/298 ("Ray Kennedy's lob") | Confirmed (single source: LFChistory, two pages) |
| Finished past Ivan Ćurković | "slid it past Curkovic" | https://www.lfchistory.net/articles/1964 | Confirmed (single source: LFChistory) |
| Third goal put Liverpool into semi-finals | 3–1 on the night, 3–2 aggregate | https://rsssf.org/ec/ec197677det.html ; https://www.11v11.com/matches/liverpool-v-saint-etienne-16-march-1977-219393/ | Confirmed (2+) |
| Started both 1977 FA Cup semi-finals v Everton | 23 Apr (2–2) and 27 Apr (3–0 replay), both at Maine Road, started both | https://www.lfchistory.net/players/298/games-per-season/18 ; https://www.lfchistory.net/articles/478 | Confirmed (2+, LFChistory data + his own words) |
| Left out of 1977 FA Cup final | Did not play; says Paisley had told him he would | https://www.lfchistory.net/articles/478 ; https://www.lfchistory.net/players/298/games-per-season/18 | Confirmed (single source: LFChistory) |
| Unused sub in 1977 European Cup final, Rome | "On the bench", unused, 25 May 1977 | https://www.lfchistory.net/players/298/games-per-season/18 ; https://www.lfchistory.net/articles/478 ("Then in Rome I was sub") | Confirmed (single source: LFChistory) |
| 1977–78: 42 apps, 34 starts, 15 goals | 42 apps (34 starts, 8 sub), 15 goals | https://www.lfchistory.net/players/298/games-per-season/19 ; https://www.lfchistory.net/players/298 | Confirmed (single source: LFChistory) |
| Goal in each leg of 1977 Super Cup v Hamburg | 22 Nov 1977 1–1 (scored); 6 Dec 1977 6–0 (scored); started both | https://www.lfchistory.net/players/298/games-per-season/19 | Confirmed (single source: LFChistory) |
| Busiest Liverpool season | 42 apps, his highest (next: 30 in 1976–77) | https://www.lfchistory.net/players/298 | Confirmed (single source: LFChistory) |
| Derby, League Cup, Oct 1977: on with about 20 min left at 0–0, two goals within five minutes | 26 Oct 1977, 2–0; on with 20 minutes left at 0–0, scored twice within five minutes | https://www.liverpoolfc.com/news/first-team/236408-no-1-supersub-fairclough-settles-anfield-tie ; https://www.lfchistory.net/players/298/games-per-season/19 | Confirmed (2+) |
| Started 1978 European Cup final at Wembley; Dalglish only goal v Club Brugge | Started, 10 May 1978, 1–0, Dalglish | https://www.lfchistory.net/players/298/games-per-season/19 ; https://www.liverpoolfc.com/news/first-team/222012-no-3-david-fairclough | Confirmed (2+) |
| 1978–79: Heighway ahead of him; injury v Everton in March | Heighway started at No. 9; injured v Everton, 13 Mar 1979 (came on as sub, 1–1); no further apps that season | https://www.lfchistory.net/articles/478 ; https://www.lfchistory.net/players/298 ; https://www.lfchistory.net/players/298/games-per-season/20 | Confirmed (single source: LFChistory) |
| 1979–80: 13 goals in 26 apps | 26 apps (12 starts, 14 sub), 13 goals | https://www.lfchistory.net/players/298 | Confirmed (single source: LFChistory) |
| Injuries increasingly affected availability | 1980–81: injured, out until mid-January; knee injury ended his season in Feb 1981 | https://www.lfchistory.net/players/298 ; https://www.lfchistory.net/articles/478 ("The injuries hadn't helped me") | Confirmed (single source: LFChistory) |
| No first-team apps 1981–82; Rush established himself | 0 apps; reserves only (14 in 29); Rush 30 goals in 49 | https://www.lfchistory.net/players/298 | Confirmed (single source: LFChistory), but incomplete (injury context) |
| 154 apps: 92 starts, 62 as sub | LFChistory 154/92/62; Wikipedia 153 apps, 61 as sub | https://www.lfchistory.net/players/298 ; https://en.wikipedia.org/wiki/David_Fairclough | Confirmed (single source: LFChistory); sources differ by one |
| 55 goals | 55 | https://www.lfchistory.net/players/298 ; https://www.liverpoolfc.com/info/david-fairclough ; https://en.wikipedia.org/wiki/David_Fairclough | Confirmed (2+) |
| 37 goals as starter, 18 as sub | 37 / 18 | https://www.lfchistory.net/players/298 | Confirmed (single source: LFChistory) |
| 34 goals in 98 league games | 98 / 34 | https://www.lfchistory.net/players/298 ; https://en.wikipedia.org/wiki/David_Fairclough | Confirmed (2+) |
| Left for Luzern in 1983 | Left 4 July 1983; Luzern 1983–85 | https://www.lfchistory.net/players/298 ; https://www.liverpoolfc.com/info/david-fairclough ("Lucerne in 1983") ; https://en.wikipedia.org/wiki/David_Fairclough | Confirmed (2+) |
| Later clubs: Norwich, Oldham, Beveren, Tranmere, Wigan | Correct (also Man City and Rochdale without apps; Knowsley, non-league) | https://www.lfchistory.net/players/298 ; https://en.wikipedia.org/wiki/David_Fairclough | Confirmed (2+) |
| Helped win a league title in his first season | 1975–76 champions, 14 league apps | https://www.lfchistory.net/players/298 ; https://en.wikipedia.org/wiki/David_Fairclough | Confirmed (2+) |

## 4. Corrections

1. "With time running out, Paisley replaced Toshack with Fairclough."
   → "With around a quarter of an hour left, Paisley replaced Toshack with Fairclough."

2. "He made no competitive first-team appearances for Liverpool in 1981–82, as Ian Rush established himself in attack."
   → "A knee injury had ended his 1980–81 season, and he made no competitive first-team appearances in 1981–82 as Ian Rush established himself in attack."

3. "Looking back, Fairclough believed he could have contributed more. 'I had a lot more to offer,' he told LFChistory."
   → Optional tightening, so the quote keeps its context: "Looking back on how he was used after St-Étienne, Fairclough believed he could have contributed more. 'I had a lot more to offer,' he told LFChistory."

4. "Across 154 competitive appearances, Fairclough started 92 times and came off the bench on 62 occasions."
   → Fine as is (LFChistory). If you want to hedge: "By LFChistory's count, Fairclough made 154 appearances, starting 92 and coming off the bench 62 times."

5. Front matter `historicalPeriod: "1974–1983"` → "1975–1983" (first-team span), subject to the bio schema. Add a `date` field if the schema requires it.

## 5. Cut list

None. Every factual claim in the draft could be sourced.

## 6. Quotes

| Quote | Verdict | Source |
|---|---|---|
| "I had a lot more to offer." | Verbatim, confirmed. Context: Paisley playing him as sub or leaving him out after St-Étienne ("I came back to Anfield and Bob Paisley decided to play me as sub or leave me out. I had a lot more to offer.") | https://www.lfchistory.net/articles/478 (2009 interview); also on https://www.lfchistory.net/players/298 |
| Paraphrase: "described his disappointment at those decisions" | Fair. His words: "I was very disappointed. I played in the FA cup semi-finals against Everton, started both games..." and "Then in Rome I was sub." | https://www.lfchistory.net/articles/478 |
| Paraphrase: club profile calls the Everton goal his favourite | Fair: "Fairclough's own favourite goal also came as a substitute at Anfield a year earlier." | https://www.liverpoolfc.com/info/david-fairclough |

Optional verified quotes if the editor wants colour (not in the draft):
- Paisley, after the 1976 derby: "I would have entered him for the Grand National, if it had been possible – and he would have won that as well!" (https://www.liverpoolfc.com/news/anfield-road-end-goals-fairclough-musters-magic-settle-merseyside-derby)
- Gerald Sinstadt (ITV) at the St-Étienne goal: "Supersub strikes again!" (Wikipedia only. Find a second source before using it.)

---

# Editor's note

# Edit note: David Fairclough

Body: about 1,010 words. Frontmatter follows EDIT.md: historicalPeriod "1975–1983", decade "1970s", role "Forward", date 2026-11-10. The draft's extra fields (category, articleType, editorialMode, historyEras, playerIds), its H1 and its Sources list are removed.

Corrections applied from the fact-check
- Saint-Étienne substitution: "With time running out" is now "With around a quarter of an hour left" (he came on at 73 or 74 minutes).
- 1980–81 and 1981–82: the February 1981 knee injury that ended his season is now mentioned alongside Ian Rush, along with his reserve-team season (14 goals in 29) and his return to the first team in October 1982.
- "I had a lot more to offer" now sits under its own heading. It is framed as being about how Paisley used him after Saint-Étienne, as a substitute or left out, which is how the 2009 LFChistory interview puts it.
- 154 appearances and 62 as a substitute are credited to LFChistory, both in the opening and at the end. Wikipedia gives 153 and 61.

Added from the report
- Burnley, 27 March 1976: two goals off the bench in a 2–0 win.
- The Everton winner's date (3 April 1976, Grand National day) and "about two minutes left".
- The 1976 UEFA Cup final: he started the first leg (3–2, 28 April) and came on in the second (1–1, 19 May).
- The 1976–77 title (20 league games, 30 in all competitions) and the 1979–80 title.
- The Saint-Étienne scorers and minutes (Keegan 2', Bathenay 50', Kennedy 59').
- Dates of the 1977 FA Cup semi-finals, the Hamburg Super Cup legs, the Derby League Cup tie (26 October 1977) and the 1978 final.
- His injury against Everton on 13 March 1979.
- The Toronto Blizzard loan in summer 1982, "to keep his fitness up" (LFChistory).
- Leaving date (4 July 1983), Luzern 1983–85, Beveren 1986–89, Knowsley.
- His 2015 autobiography, written with Mark Platt.
- One verified quote: "I was very disappointed" (LFChistory interview), about missing the 1977 finals.

Cut or softened
- "Supersub": the piece says only that he became known by the name. The Gerald Sinstadt "Supersub strikes again!" line is left out because Wikipedia is its only source.
- The draft's essay lines are gone ("It deserves its place", "Together, they give a fuller account…", "rather than proof that a different selection policy…") and so is its closing moral. It now ends on his record.
- Left out: Bathenay's first name, the venues of the UEFA Cup first leg and the Hamburg legs, and Wikipedia's Toronto figures (20 games, 4 goals). The report doesn't give the first two, and the Toronto figures have only one source.
- He is alive, so there is no current-status line and no broadcaster is named. There are no health or family matters (the report flags his 2010 heart attack and his wife's death; both are left out). Heysel and Hillsborough are not mentioned.

Optional: the report verifies Paisley's line after the 1976 derby, "I would have entered him for the Grand National, if it had been possible – and he would have won that as well!" (liverpoolfc.com). I left it out to keep the quotes few. It would fit after the Everton paragraph.

---

# Final check: David Fairclough

Checked 10 November 2026.

## Verdict: PASS WITH FIXES

Every factual claim in the edited biography matches the fact-check figure list, LFChistory (re-checked today) or Wikipedia. I found no factual errors that the editor introduced. I made one small writing fix.

## Changes made

1. Final paragraph: deleted "Of those 154 appearances, 62 were as a substitute." The opening paragraph already gives this, so it was padding. The paragraph now ends "...including 34 goals in 98 league games." No facts changed.

## Checks done today (beyond the fact-check report)

- **Quotes.** Both are word for word in the 2 June 2009 LFChistory interview (lfchistory.net/articles/478).
  - "I had a lot more to offer" follows "I came back to Anfield and Bob Paisley decided to play me as sub or leave me out." The interview question was about the expectations the Saint-Étienne goal raised. The bio's framing ("how Paisley used him after Saint-Étienne... play him as a substitute or leave him out") is accurate.
  - "I was very disappointed" answers a question about both 1977 finals: the bench in Rome and being left out of the FA Cup final. In his answer he says Paisley told him he would play in the FA Cup final, then "Then in Rome I was sub." Placing the quote after the Rome paragraph, in a section about both finals, is accurate.
- **1980–83 (LFChistory player page).**
  - He was out until mid-January 1981, and a knee injury ended his season in early February 1981.
  - He made 0 first-team appearances in 1981–82. He scored 14 goals in 29 games for the reserves, while Rush scored 30 in 49.
  - He was with Toronto Blizzard in summer 1982 "to keep his fitness up". Wikipedia says it was a loan.
  - He did not play for the first team again until October 1982.
  - All confirmed.
- **1975–76 games list (LFChistory).** All confirmed:
  - Burnley, 27 March 1976: came on as a substitute and scored twice in a 2–0 win.
  - Everton, 3 April 1976: came on as a substitute, scored, 1–0 win.
  - UEFA Cup final: started the first leg on 28 April (3–2) and came on in the second leg on 19 May (1–1).
  - Season totals: 19 appearances (7 starts, 12 as substitute) and 8 goals. In the league, 14 appearances (5 starts, 9 as substitute) and 7 goals.
  - "Most of them came in the run-in" is right: 7 of the 8 goals came from 20 March onwards.
- **1976–77 games list.** All confirmed:
  - Saint-Étienne, 16 March: came on as a substitute and scored.
  - FA Cup semi-finals v Everton at Maine Road: started both, 23 April (2–2) and 27 April (3–0).
  - No FA Cup final appearance.
  - Unused substitute v Gladbach in Rome on 25 May.
  - 30 appearances, 20 of them in the league (bench-only rows excluded).
  - The scorers and minutes (Keegan 2', Bathenay 50', Kennedy 59', Fairclough 84') are as in the fact-check report (RSSSF, 11v11, LFChistory).
- **1977–78 games list.** All confirmed:
  - Hamburg: started both legs and scored in both, 22 November 1977 (1–1, Volksparkstadion) and 6 December 1977 (6–0).
  - Derby, 26 October 1977: came on as a substitute and scored twice, 2–0 win.
  - Started the European Cup final on 10 May 1978 (1–0).
  - 34 starts and 8 substitute appearances, so 42 appearances and 15 goals.
- **Titles.** He made 14 league appearances in 1979–80 (LFChistory), which meets the 14-game threshold, so the 1979–80 title stands. Wikipedia lists the league titles for 1975–76, 1976–77 and 1979–80.
- **Autobiography.** 2015, with Mark Platt, *Supersub: The Story of Football's Most Famous Number 12* (Wikipedia; publisher deCoubertin).
- **Career totals.** 154 appearances (92 starts, 62 as substitute) and 55 goals (37 as a starter, 18 as a substitute), with 34 goals in 98 league games. All match LFChistory.
- **Format.**
  - Frontmatter has exactly title, slug, date, historicalPeriod ("1975–1983", year span, en dash), decade, role and excerpt.
  - The body starts directly after the closing ---.
  - Ranges use en dashes.
  - There are no links or sources in the body.
  - The headline is in sentence case.
  - No American spellings.
- **Sensitive.** No mention of Heysel or Hillsborough. The heart attack and his wife's death are correctly left out. He is alive, and the bio makes no claim about what he does now.

## Remaining concerns (minor, no action needed)

- LFChistory also lists a 1982–83 league title and the 1981 European Cup among his honours. He made only 8 league appearances in 1982–83, and Wikipedia does not list either. The bio sensibly names only 1975–76, 1976–77 and 1979–80.
- Wikipedia gives 153 appearances and 61 as a substitute. The bio already says "by LFChistory's count".
- Some light repetition: "14 league appearances" and "playing 14 times" appear in consecutive paragraphs of the 1976 run-in section. It is acceptable, but Denny may want to trim it.
