# sammy-lee: checks before publication

Draft by GPT (branch editorial/next-ten-biographies-batch-four-2026-10-03). Checked on 10 November 2026 by three fresh agents: fact-check of the draft, edit, then an independent final check of the edited text.

---

# Fact-check: Sammy Lee (draft /home/claude/bios/gpt/sammy-lee.md)

Checked 10 November 2026.

## Sensitive flags

- **Heysel / Hillsborough disaster:** not mentioned in the draft. (Not researched, as instructed. One cited source, Borrell's "I was simply overwhelmed" interview, mentions the Hillsborough Memorial Service in passing. The draft doesn't use that part. Keep it that way.)
- **Death:** none. Lee is alive (see section 2).
- **Illness / medical (minor):** "During Benítez's absence in December 2008". Benítez was in hospital with kidney stones and had a minor operation (Irish Examiner, 15 Dec 2008; Camden New Journal, 23 Dec 2008), and the Guardian URL in the source list says "kidney-operation". The draft only says "absence", which is the right level. Don't add the medical detail.
- **Injuries (routine, not sensitive):** David Johnson's torn knee ligaments on Lee's debut, and Terry McDermott's injury in 1979–80.

## 1. Summary

The draft is very reliable on the playing record. The birth date, debut, 295/19 totals, 197/13 league split, season figures, the 67-start 1983–84 season, the Breitner job, the two European Cup finals, the England record and the Bolton dates all match LFChistory and at least one other source. It contains **no direct quotations**, only paraphrases, and most are fair. The real errors are small: a height figure that sources contradict, one Neal paraphrase that goes beyond what he said, an understatement of Lee's role at the Arsenal match in December 2008, a few weak source links, and front matter that doesn't fit the biography schema.

Errors / issues:
1. **"Lee, who stood around 5ft 4in"**: sources contradict each other. Wikipedia says 5ft 7in (1.70m), Sportskeeda says 1.57m (about 5ft 2in), and LFC and LFChistory give no figure. Cut the number.
2. **"Phil Neal … later recalled their effective partnership"**: LFChistory's Neal quote calls Lee one of the side's "hardworking bees" and recalls Paisley "telling him to mark Paul Breitner". It doesn't describe a partnership. Soften it.
3. **"Lee oversaw preparations for Arsenal"**: this understates his role. Lee took charge of the team for the 1–1 draw at the Emirates on 21 Dec 2008 (Wikipedia; Irish Times 23 Dec 2008; Camden New Journal). The "plan" paraphrase is supported by Lee's words "the game plan is there, it is business as usual" (Irish Times 23 Dec 2008, said after Arsenal and before Bolton). The Guardian 16 Dec piece cited in the draft could not be read (site blocked).
4. **"295 competitive appearances"**: the 295 includes 9 "other" games (3 Charity Shields, 5 Screen Sport Super Cup, 1 World Club Championship). Say "295 appearances", as LFC and LFChistory do.
5. **"A loan spell at Southampton"**: sources disagree. Wikipedia says loan (1989–90). 11v11 lists a spell from 1 Jan to 1 Oct 1990 with no loan flag. LFChistory just says "Southampton (1990)". Use "a short spell at Southampton".
6. **"Tom Culshaw recalled Lee making him captain of the reserves, where he trained alongside established first-team players at Melwood"**: the captaincy is word for word in the source. The Melwood point is Culshaw's general remark ("everyone was on the same site") and isn't tied to Lee. That's acceptable, but it reads more tightly linked than the source is.
7. **"Lee left by mutual consent in June 2011"**: SI reports "by mutual consent", with the club confirming on 30 June/1 July 2011 (Fox Sports 30 June, SI 1 July; the LFC URL in the draft is dated 29 June). That's fine, but "at the end of June 2011" or "in the summer of 2011" is safest.
8. **"Remembering it for Liverpool's website in 2014"**: the LFC article has no visible date. "30 years ago this week" and "now 55" put it at about April 2014. This is acceptable, or say "thirty years later".
9. **Source list problems (not prose errors):** englandstats `player.php?pid=961` is **Kevin Keegan's** profile, not Lee's. `www.englandstats.com/matches.php?mid=572` served a different match when fetched (the non-www URL gives the correct Greece v England page). The Culshaw and Borrell LFC links fail on www.liverpoolfc.com but work on legacy.liverpoolfc.com. Fix or drop them.
10. **Front matter (not a fact error):** the draft uses retired History fields (`historyEras`, `playerIds`, `category: person`, `articleType`, `editorialMode`). It has no `date`, and `historicalPeriod` is a phrase rather than years. The strict `BiographySchema` takes `title`, `slug`, `date`, `historicalPeriod` (e.g. "1959–" or "1975–1986"), `decade`, `excerpt`, optional `role` and body. It also has a "## Sources" section, and biographies have no sources field. The build will reject the file as it stands. The excerpt ("Sammy Lee's Liverpool career.") is a placeholder.

Brief-specific checks the caller raised:
- **Birth date:** 7 February 1959, Liverpool. Confirmed (LFChistory, Wikipedia).
- **Local apprentice:** the draft doesn't say "apprentice". LFChistory lists him as "Local", joined 1972, professional April 1976. Wikipedia says he joined on an apprenticeship in September 1975. Don't add a date for the apprenticeship (1972 and 1975 conflict). "Signed professional terms in April 1976" is safe (LFChistory, single source).
- **Debut and first goal v Leicester, 8 Apr 1978:** Confirmed. He came on in the 6th minute for David Johnson (torn knee ligaments) and scored. Liverpool won 3–2: Billy Hughes pen 0–1, Smith 1–1, White 1–2, Lee 2–2, Smith 3–2. The goal order comes from LFChistory only, and 11v11 confirms the scorers. Wikipedia puts Lee's goal at 56', while LFChistory gives 56' to Smith's winner, so don't give a minute.
- **Totals:** 295 apps / 19 goals overall, 197 / 13 league. Confirmed (LFChistory, liverpoolfc.com, Wikipedia).
- **Breitner, 1981 semi-final:** Confirmed. LFC "Barney Rubble" article: "Sammy Lee was given the job of man-marking Bayern playmaker Paul Breitner". Neal's recollection is on LFChistory. Bayern 1–1 Liverpool, 22 Apr 1981, Munich (Olympiastadion). Liverpool went through on away goals after 0–0 at Anfield.
- **1981 and 1984 European Cups:** started both. 1981: 1–0 v Real Madrid, Paris. 1984: 1–1 aet v Roma, 4–2 pens. Lee played all 120 minutes and was not substituted (LFChistory).
- **1982/1983/1984 titles:** Confirmed. He also has 1985–86, and LFC/LFChistory list 1979–80 as well.
- **England:** 14 caps, 2 goals, 17 Nov 1982 (Greece 0–3 England, Thessaloniki, Euro 84 qualifier, Lee 68' for the third goal, Bobby Robson manager) to 17 Jun 1984 (Chile). Every cap came while he was at Liverpool. Confirmed.
- **QPR then Osasuna:** Confirmed. He left Liverpool on 26 Aug 1986 (LFChistory), spent one season at QPR, then Osasuna 1987–89/90. No fee is in the draft. Don't add one.
- **Return as reserve coach in 1993:** sources disagree on the year. 1993 per the LFChistory 2008 article, the LFC Bootroom farewell piece and Wikipedia. 1992 per the LFChistory player profile ("replacing Phil Thompson"). The draft gives no year. If you add one, use "in the early 1990s, under Graeme Souness" or 1993 (the majority).
- **Assistant to Houllier?** **No.** Under Houllier, Lee was promoted to first-team coach (LFChistory: "first-team trainer", 1998; Bootroom: "head coach of the first team", 1999). Phil Thompson was Houllier's assistant. The draft correctly says "first-team coach". Don't call him Houllier's assistant.
- **Assistant to Benítez:** **Yes.** Appointed 16 May 2008 (LFChistory article 2252, Sky Sports, Wikipedia).
- **England coaching:** part-time from about 2001 under Eriksson, full-time from July 2004 (Wikipedia; LFC Bootroom farewell piece: "part-time member of the England set-up" for "the past few years", then a full-time FA role). He was on England staff again under Allardyce, July–Dec 2016 (not in the draft).
- **Bolton manager: 2007, not 2008.** He was assistant to Allardyce from September 2005 (BWFC; LFChistory says June 2005) and manager from April 2007 to October 2007, 14 games (BWFC, Wikipedia, worldsoccertalk 17 Oct 2007). The draft has this right.

## 2. Current status (10 November 2026)

Alive. He is quoted on Liverpool in June 2026 ("club legend Sammy Lee", speaking to Redmen TV; thekopiteview.com, 12 Jun 2026; readliverpoolfc.com). No current club or coaching role was found. The last confirmed post is assistant head coach to Allardyce at West Bromwich Albion, appointed 16 Dec 2020 (Wikipedia). Allardyce left WBA in 2021. Earlier posts after Liverpool: Bolton head of academy coaching (Feb 2012), Southampton assistant to Koeman (2014–16), England (2016), Crystal Palace (2017) and Everton (Dec 2017–May 2018). The draft ends his story in 2011, which is fine for a Liverpool-focused piece. If a closing line is wanted, the safe wording is "he went on to coach at several other clubs and with England".

## 3. Figure list

| Claim | Correct figure | Sources (URLs) | Verdict |
|---|---|---|---|
| Born in Liverpool, 7 Feb 1959 | 7 Feb 1959, Liverpool | https://lfchistory.net/players/355 ; https://en.wikipedia.org/wiki/Sammy_Lee_(footballer) | Confirmed (2+) |
| Signed professional April 1976 | April 1976 | https://lfchistory.net/players/355 | Confirmed (single source: LFChistory) |
| Debut v Leicester, Anfield, 8 Apr 1978 | Same | https://lfchistory.net/games/1032 ; https://www.11v11.com/matches/liverpool-v-leicester-city-08-april-1978-84337/ ; https://www.liverpoolfc.com/info/sammy-lee | Confirmed (2+) |
| Replaced injured David Johnson after six minutes | 6th-minute sub for Johnson (torn knee ligaments) | https://www.lfchistory.net/Players/Player/Profile/355 ; https://en.wikipedia.org/wiki/Sammy_Lee_(footballer) ; https://www.11v11.com/matches/liverpool-v-leicester-city-08-april-1978-84337/ (sub, no minute) | Confirmed (2+) |
| Liverpool twice fell behind; Lee second equaliser; Smith winner; 3–2 | Hughes pen, Smith, White, Lee, Smith | https://lfchistory.net/games/1032 (order) ; https://www.11v11.com/matches/liverpool-v-leicester-city-08-april-1978-84337/ (scorers) | Confirmed (order single source: LFChistory) |
| 2 apps in 1977–78, 2 in 1978–79 | 2 and 2 | https://lfchistory.net/players/355 | Confirmed (single source: LFChistory) |
| McDermott injury opened a place late in 1979–80 | Yes (11 apps that season) | https://www.lfchistory.net/Players/Player/Profile/355 | Confirmed (single source: LFChistory) |
| Established 1980–81, taking over from Jimmy Case on the right | Yes, from nine games in | https://www.lfchistory.net/Players/Player/Profile/355 ; https://www.liverpoolfc.com/info/sammy-lee | Confirmed (2+) |
| Marked Breitner in Munich, 1981 SF 2nd leg | Yes | https://www.liverpoolfc.com/news/barney-rubble-sinks-real-madrid-paris ; https://www.lfchistory.net/Players/Player/Profile/355 (Neal) | Confirmed (2+) |
| Bayern 1–1 Liverpool, through on away goals | 22 Apr 1981, 1–1, agg 1–1 | https://www.lfchistory.net/games/1213 ; https://www.liverpoolway.co.uk/index.php/articles.html/_/fe/magic-moments/the-heroes-of-munich-1980-81-by-kurt-henriksen-r400 | Confirmed (2+) |
| Started 1981 final, Paris, won 1–0 | Yes | https://www.liverpoolfc.com/news/barney-rubble-sinks-real-madrid-paris ; https://lfchistory.net/players/355 | Confirmed (2+) |
| Club's first League Cup, beat West Ham after replay | 1–1 Wembley 14 Mar 1981; 2–1 Villa Park 1 Apr 1981; Lee played both | https://lfchistory.net/games/1207 ; https://en.wikipedia.org/wiki/1981_Football_League_Cup_final ; https://www.liverpoolfc.com/news/first-team/208124-a-history-of-lfc-s-league-cup-finals-1978-and-1981 | Confirmed (2+) |
| Three consecutive titles and three more League Cups | Titles 1982, 83, 84; League Cups 1982, 83, 84 | https://www.liverpoolfc.com/info/sammy-lee ; https://lfchistory.net/players/355 | Confirmed (2+) |
| England debut 17 Nov 1982, Greece away, Euro qualifier, Robson | Greece 0–3 England, Thessaloniki | https://englandstats.com/matches.php?mid=572 ; https://national-football-teams.com/player/18680.html | Confirmed (2+) |
| Scored on debut, completing 3–0 | Lee 68', third goal | https://englandstats.com/matches.php?mid=572 ; https://www.liverpoolfc.com/news/england-debut-coincidence-linking-curtis-jones-and-sammy-lee | Confirmed (2+) |
| 14 caps, 2 goals, all as a Liverpool player | 14/2, last cap 17 Jun 1984 | https://lfchistory.net/players/355 ; https://national-football-teams.com/player/18680.html ; Wikipedia | Confirmed (2+) |
| 1983–84: started all 67 games (42 league, every cup tie, Charity Shield) | 67 (42 L, 13 LC, 9 EC, 2 FA, 1 CS) | https://liverpoolfc.com/news/most-games-liverpool-have-played-single-season ; https://lfchistory.net/players/355 ; https://lfchistory.net/season-archive/statistics/25 | Confirmed (2+). Note: LFC's 2014 Dinamo article says "66 games", without the Charity Shield |
| Dinamo Bucharest, 11 Apr 1984, 1–0, SF 1st leg, header from Alan Kennedy cross | Lee 25', assist A. Kennedy; header per Lee | https://lfchistory.net/games/1396 ; https://www.liverpoolfc.com/news/first-team/163465-i-ll-never-forget-dinamo-header | Confirmed (2+) (Kennedy assist single source: LFChistory) |
| Height "around 5ft 4in" | Sources conflict: 5ft 7in (Wikipedia), 1.57m (Sportskeeda) | https://en.wikipedia.org/wiki/Sammy_Lee_(footballer) ; https://sportskeeda.com/football/5-shortest-footballers-of-all-time-sammy-lee-marcin-garuch | Wrong / unsafe: cut |
| Return leg won 2–1 | 25 Apr 1984, 2–1 | https://lfchistory.net/games/1396 | Confirmed (single source: LFChistory) |
| Roma final: full 120 minutes, 1–1, 4–2 pens | Yes, not substituted | https://www.lfchistory.net/games/1406 | Confirmed (single source: LFChistory) |
| 25 apps 1984–85, 26 in 1985–86; contributed to double | 25 and 26 | https://lfchistory.net/players/355 ; https://www.liverpoolfc.com/info/sammy-lee | Confirmed (2+) |
| Left for QPR August 1986 | 26 Aug 1986 | https://lfchistory.net/players/355 ; https://en.wikipedia.org/wiki/Sammy_Lee_(footballer) | Confirmed (2+) |
| League record 197 apps, 13 goals | 197 / 13 | https://lfchistory.net/players/355 ; Wikipedia | Confirmed (2+) |
| 295 "competitive" apps, 19 goals | 295 / 19 (includes 9 "other" games) | https://lfchistory.net/players/355 ; https://www.liverpoolfc.com/info/sammy-lee | Corrected: drop "competitive" |
| One season at QPR, then Osasuna | QPR 1986–87; Osasuna 1987–89/90 | https://lfchistory.net/players/355 ; Wikipedia | Confirmed (2+) |
| Loan at Southampton, then Bolton | Southampton 1990 (loan per Wikipedia; 11v11 no loan flag); Bolton 1990–91 | https://en.wikipedia.org/wiki/Sammy_Lee_(footballer) ; https://www.11v11.com/players/sammy-lee-32329/team/southampton/ ; https://www.bwfc.co.uk/news/2020/may/from-player-to-manager-sammy-lee | Corrected: say "spell" |
| Coaching return under Souness, reserves first | 1993 (1992 per LFChistory profile) | https://www.lfchistory.net/articles/2252 ; https://bootroom.liverpoolfc.com/news/latest-news/farewell-and-good-luck-to-true-red-sammy | Confirmed (2+) |
| Through Evans, first-team coach under Houllier | Promoted 1998/99 | https://www.lfchistory.net/Players/Player/Profile/355 ; https://bootroom.liverpoolfc.com/news/latest-news/farewell-and-good-luck-to-true-red-sammy | Confirmed (2+) |
| On staff for 2001 cup treble | Yes | https://www.liverpoolfc.com/news/features/395716-quite-astonishing-the-inside-story-of-liverpool-s-2001-cup-treble (cited, not re-read) ; https://thisisanfield.com/2024/06/legendary-player-coach-supporter-sammy-lees-liverpool-life (coach in Houllier era) | Confirmed (2+) |
| Part-time England coach, full-time 2004 | Part-time ~2001; full-time July 2004 | https://en.wikipedia.org/wiki/Sammy_Lee_(footballer) ; https://bootroom.liverpoolfc.com/news/latest-news/farewell-and-good-luck-to-true-red-sammy ; https://www.lfchistory.net/articles/2252 | Confirmed (2+) |
| Bolton assistant to Allardyce | From Sept 2005 (LFChistory: June 2005) | https://www.bwfc.co.uk/news/2020/may/from-player-to-manager-sammy-lee ; Wikipedia | Confirmed (2+) |
| Bolton manager April–October 2007 | Apr 2007 – Oct 2007, 14 games | https://www.bwfc.co.uk/news/2020/may/from-player-to-manager-sammy-lee ; https://worldsoccertalk.com/news/sammy-lee-sacked-by-bolton-wanderers-20071017-CMS-1040.html ; Wikipedia | Confirmed (2+) |
| Benítez's assistant manager, May 2008 | 16 May 2008 | https://www.lfchistory.net/articles/2252 ; https://www.skysports.com/football/news/3574223/benitez-delight-at-lee-arrival | Confirmed (2+) |
| Dec 2008: Lee oversaw preparations for Arsenal | Lee took charge, Arsenal 1–1 Liverpool, 21 Dec 2008 | https://www.irishtimes.com/sport/soccer/liverpool-await-return-of-spanish-duo-1.1225097 ; https://www.thecnj.com/camden/2008/122308/sports122308_01.html ; Wikipedia | Corrected: understated |
| Achterberg called up for Hodgson's 2010 pre-season | Summer 2010, from the reserves | https://www.liverpoolfc.com/news/first-team/436419-every-day-is-enjoyable-john-achterberg-s-decade-with-lfc-first-team | Confirmed (single source: LFC) |
| Borrell: Lee and Clarke at the academy under Dalglish | 2011 | https://legacy.liverpoolfc.com/news/first-team/96524-i-was-simply-overwhelmed | Confirmed (single source: LFC) |
| Left by mutual consent, June 2011 | Confirmed 30 Jun/1 Jul 2011, mutual consent | https://www.si.com/soccer/2011/07/01/liverpool-lee ; https://amp.foxsports.com/stories/soccer/liverpool-confirm-lee-departure | Confirmed (2+) |
| Served under Benítez, Hodgson and Dalglish in final spell | Yes | Sources above | Confirmed (2+) |

## 4. Corrections

1. "Lee, who stood around 5ft 4in, was an unlikely scorer with his head."
   → "Lee, one of the smallest players in the side, was an unlikely scorer with his head."
2. "His first-team career at Anfield produced 295 competitive appearances and 19 goals."
   → "His first-team career at Anfield produced 295 appearances and 19 goals."
3. "Phil Neal, who played behind him, later recalled their effective partnership and singled out Lee's marking of Paul Breitner in Munich."
   → "Phil Neal, who played behind him, later remembered Paisley telling Lee to mark Paul Breitner in Munich."
4. "During Benítez's absence in December 2008, Lee oversaw preparations for Arsenal, explaining that the staff were implementing their already agreed plan."
   → "When Benítez was absent in December 2008, Lee took charge of the side for a 1–1 draw at Arsenal, saying the game plan was already in place and it was business as usual."
5. "A loan spell at Southampton and a move to Bolton Wanderers followed before his playing career ended."
   → "A short spell at Southampton and a move to Bolton Wanderers followed before his playing career ended."
6. (Optional) "Tom Culshaw recalled Lee making him captain of the reserves, where he trained alongside established first-team players at Melwood."
   → "Tom Culshaw recalled Lee, his reserve-team coach, making him captain."
7. (Optional) "Lee left by mutual consent in June 2011" → "Lee left by mutual consent in the summer of 2011".
8. Front matter: rebuild it to `BiographySchema` (`title`, `slug`, `date`, `historicalPeriod`, `decade`, `excerpt`, optional `role`). Remove the retired History fields and the "## Sources" section, and replace the placeholder excerpt.

## 5. Cut list

- The height figure "around 5ft 4in" (sources conflict).
- Nothing else needs cutting. Every other claim was sourced.

## 6. Quotes

The draft contains **no direct quotations**. All voices are paraphrased. Verdicts on the paraphrases:

| Paraphrase | Source wording | Verdict |
|---|---|---|
| Neal "recalled their effective partnership and singled out Lee's marking of Paul Breitner" | "I remember Bob Paisley telling him to mark Paul Breitner when we played in the Munich Stadium"; "every side needs its hardworking bees. And Sammy was one of those bees" (https://www.lfchistory.net/Players/Player/Profile/355) | Breitner part fair; "partnership" overstated: soften (correction 3) |
| Lee on the Dinamo header: rarely scored that way; Kop end meant a lot | "I didn't score many goals and certainly didn't score many with my head." / "To score it at the Kop end is something I'll never forget" (https://www.liverpoolfc.com/news/first-team/163465-i-ll-never-forget-dinamo-header) | Fair |
| Culshaw: Lee made him reserve captain | "Then when I progressed to the Reserves where Sammy Lee was my coach, he made me captain" (https://legacy.liverpoolfc.com/news/behind-the-badge/289911-tom-culshaw-steven-gerrard-liverpool-u18s) | Fair (Melwood link looser: correction 6) |
| Gerrard: Lee among senior staff (with Houllier, Thompson) who shaped him after youth coaches | "They pass you on to the first-team staff, which was Gerard Houllier, Phil Thompson and Sammy Lee" (https://www.liverpoolfc.com/news/announcements/420049-former-players-pay-tribute-to-gerard-houllier) | Fair |
| Benítez emphasised experience, standing and knowledge of the club | "someone who knows the club really well"; "a very experienced and very well respected coach in his own right" (https://www.skysports.com/football/news/3574223/benitez-delight-at-lee-arrival ; https://www.lfchistory.net/articles/2252) | Fair |
| Lee: staff implementing their agreed plan (Dec 2008) | "We know what we have to do, the game plan is there, it is business as usual." (https://www.irishtimes.com/sport/soccer/liverpool-await-return-of-spanish-duo-1.1225097; said before the Bolton game, after Arsenal; the Guardian 16 Dec piece could not be read) | Fair in substance; reword with correction 4 |
| Achterberg: Lee called him up to cover 2010 pre-season | "Sammy Lee rang us and said, 'You need to start the pre-season with us because we have no goalie coach.'" (https://www.liverpoolfc.com/news/first-team/436419-every-day-is-enjoyable-john-achterberg-s-decade-with-lfc-first-team) | Fair |
| Borrell: Lee and Clarke regularly at the academy, helping the club work together | "They are always coming to the Academy and watching games and training sessions."; "one club pulling in the same direction" (https://legacy.liverpoolfc.com/news/first-team/96524-i-was-simply-overwhelmed) | Fair |

---

# Editor's note

# Edit note: Sammy Lee

Body: about 910 words, not counting subheadings. The draft was about 1,500.

## Corrections applied
- **Height:** cut. The Dinamo header is now introduced through Lee's own verified words ("didn't score many with my head"), with no size claim.
- **Appearances:** "295 appearances and 19 goals" ("competitive" removed).
- **Phil Neal:** "partnership" is gone. Neal now only remembers Paisley telling Lee to mark Breitner, plus his verified "hardworking bees" line.
- **December 2008:** Lee "took charge of the side for a 1–1 draw with Arsenal on 21 December". Benítez is described only as "absent". Nothing about the reason.
- **Southampton:** "a short spell".
- **The two softenings:** Culshaw now reads "recalled Lee, his reserve-team coach, making him captain" (the Melwood link is cut). The departure is "by mutual consent in the summer of 2011".
- **Dinamo interview:** "thirty years later", not "in 2014".

## Dates handled as instructed
- No apprenticeship date. Only "signed professional terms in April 1976".
- No year for the reserve-coach return. It reads "In the early 1990s he returned to Liverpool under Graeme Souness".
- He is alive. No current role is given. The piece ends with the fact-check's safe line: "He went on to coach at several other clubs and with England."

## Quotes (all verified word for word in the fact-check)
- Lee on the Dinamo header (two short lines)
- Neal: "hardworking bees"
- Benítez: "a very experienced and very well respected coach in his own right"
- Achterberg's phone-call line
- Borrell: "always coming to the Academy and watching games and training sessions."

## Cut
- The draft's essay lines: "Lee's energy was valuable because it came with the discipline…", "His selection … is evidence of how much Fagan relied on him", "It was a shared process…", "His contribution also included keeping the coaching operation connected…", the "another treble" flourish and the closing summary paragraph.
- "brief and unsuccessful" on the Bolton managership. It now says plainly that he was in charge from April to October 2007.
- The JSON frontmatter with the retired History fields, the H1 and the Sources section. These were replaced with BiographySchema YAML: historicalPeriod "1976–1986", decade "1980s", role "Midfielder".
- I did not add fact-check-only details that weren't in the draft, such as Thessaloniki, the goalless first leg against Bayern, the Emirates, the 14 Bolton games or his later clubs.

Heysel and Hillsborough are not mentioned.

---

# Final check: Sammy Lee

Checked 10 November 2026.

## Verdict: PASS WITH FIXES

## Changes made (in place in bio.md)

1. Dinamo quote: the quotation closed mid-sentence with a full stop.
   - Old: "To score it at the Kop end is something I'll never forget."
   - New: "To score it at the Kop end is something I'll never forget and I never want to forget it."
   - Source: liverpoolfc.com, "I'll never forget Dinamo header" (/news/first-team/163465). This is the full sentence as published.
2. 1983–84 line: the old wording was inaccurate because Liverpool also played in the FA Cup (2 ties, both started by Lee) and the Charity Shield, so they "played for" more than three trophies.
   - Old: "Liverpool played for three trophies that season and did not leave him out once."
   - New: "Liverpool won three trophies that season, and he was not left out once."
   - Source: fact-check figure list (67 = 42 L, 13 LC, 9 EC, 2 FA, 1 CS).
3. Borrell's role: the source article calls Borrell the "newly installed reserve team boss". It does not call him "the academy's" coach.
   - Old: "the academy's Rodolfo Borrell said"
   - New: "the reserve-team coach Rodolfo Borrell said"
   - Source: legacy.liverpoolfc.com /news/first-team/96524-i-was-simply-overwhelmed

## Quotations checked word for word (all now exact)

- Lee on the Dinamo header: "I didn't score many goals and certainly didn't score many with my head." Exact. The Kop line is now the full sentence (see fix 1).
- Neal: "hardworking bees" appears verbatim ("every side needs its hardworking bees. And Sammy was one of those bees"). The Paisley/Breitner recollection is also on the page ("I remember Bob Paisley telling him to mark Paul Breitner…"). Source: LFChistory profile 355. The paraphrase "one of the side's" is fair.
- Benítez: "a very experienced and very well respected coach in his own right". Exact (Sky Sports, 16 May 2008). "knew the club well" is a fair paraphrase of "knows the club really well".
- Achterberg: exact (liverpoolfc.com 436419). He joined in 2009 to work with the younger age groups, so "then working with the younger teams" is supported.
- Borrell: "always coming to the Academy and watching games and training sessions." Exact. The article puts Dalglish as manager.
- Culshaw (paraphrase): source says "Then when I progressed to the Reserves where Sammy Lee was my coach, he made me captain". The bio line is fair.
- "Game plan… business as usual" (paraphrase): Irish Times, 23 Dec 2008, "the game plan is there, it is business as usual". The remark is about Benítez's absence and isn't tied to Arsenal in particular. The bio's placement is acceptable.

## Other brief checks

- "Thirty years later": the LFC article says the treble was "30 years ago this week" and calls Lee "the now 55-year-old", so it dates to spring 2014. Fair.
- Dinamo, 11 April 1984, Anfield, 1–0, Lee 25', assist Alan Kennedy (LFChistory game 1396). The LFC article doesn't name the crosser, so the Kennedy cross rests on LFChistory alone. The return leg was won 2–1.
- Headline "ever-present in the treble season": fair. He started all 67 matches, and League, League Cup and European Cup is the 1983–84 treble.
- Everything else matches the fact-check figure list:
  - debut and goal v Leicester, 8 April 1978, 6-minute sub for Johnson, 3–2, Smith winner
  - 295 apps / 19 goals; 197 / 13 league
  - 2 + 2 apps, then McDermott's injury, then Case's place in 1980–81
  - Breitner, Munich, 1–1, away goals
  - Paris 1–0; League Cup replay v West Ham
  - titles 1982–84 plus three League Cups
  - England 14 caps, 2 goals, debut goal v Greece 17 Nov 1982 (3–0, third goal)
  - Roma: 120 minutes, 4–2 penalties
  - 25 and 26 apps; QPR August 1986, then Osasuna, then a short spell at Southampton, then Bolton
  - early 1990s return under Souness; first-team coach under Houllier (not called his assistant); 2001 cups
  - England part-time, then full-time 2004; Bolton manager April–October 2007
  - Benítez's assistant May 2008; Arsenal 1–1 on 21 Dec 2008 with Lee in charge
  - left by mutual consent in summer 2011
- Current status: alive, no current role given. The closing line is the safe one from the fact-check.
- historicalPeriod "1976–1986" and decade "1980s" are fine.

## Writing and format

- Frontmatter has exactly title, slug, date, historicalPeriod, decade, role, excerpt. The body starts directly after the closing ---. Ranges use en dashes. There are no links or sources list.
- The headline is in sentence case and spellings are British. No AI-sounding phrases or padding of note.
- Minor, left as is: "He also scored one of the season's important goals" and "Players coming through the club remembered him" are slightly flat but accurate.

## Sensitive

No Heysel or Hillsborough reference. Benítez's absence is not explained medically, which is correct.

## Remaining concerns

- Minor: the Kennedy assist is single-source (LFChistory).
