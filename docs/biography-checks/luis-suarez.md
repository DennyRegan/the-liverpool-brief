# luis-suarez: checks before publication

Draft by GPT (branch editorial/next-ten-biographies-batch-four-2026-10-03). Checked on 10 November 2026 by three fresh agents: fact-check of the draft, edit, then an independent final check of the edited text.

---

# Fact-check: Luis Suárez biography (draft: /home/claude/bios/gpt/luis-suarez.md)

Checked 10 November 2026.

## Sensitive events flag

- **Heysel:** not mentioned.
- **Hillsborough disaster:** not mentioned. (Heads-up only, not researched: if an editor adds that Liverpool fined Suárez after the Ivanović bite and where that money went, the piece would then touch Hillsborough. That needs Denny's approval by name. The draft as written does not raise it.)
- **Racial abuse finding (sensitive, central to the piece):** the 2011 Evra case. The draft's account matches the official findings well. Two small date/wording fixes are below (items 2 and 3). The recommended neutral wording uses the FA's own words.
- **Biting offences (sensitive conduct):** Bakkal (2010), Ivanović (2013), Chiellini (2014). All three are reported accurately.
- No deaths, illnesses or other sensitive personal matters. His wife is mentioned only as the reason he gave for moving to Spain.

## 1. Summary

The draft is reliable. Nearly every figure checks out against LFChistory, liverpoolfc.com, the FA findings as reported by Sky, Al Jazeera, UEFA, the Premier League and FC Barcelona. That covers the totals (133 appearances, 82 goals), the season splits, the Ajax fee, the debut, the Norwich, Spurs and Cardiff matches, the three disciplinary cases and the 2014 awards. The disciplinary sections are careful and close to the official wording. The main gaps are things the brief asked for that the piece leaves out: current status, the Barcelona fee and Uruguay caps. There are also two small factual slips in the Evra section. The piece has **no direct quotations** in quotation marks. All reported speech was checked against the original statements.

Errors and issues:
1. **Current status missing:** the piece never says what Suárez does now. As of today he is still playing, for Inter Miami, aged 39, on a contract for the 2026 MLS season (see section 2).
2. **Wrong date:** "On 5 January he apologised…". The qualified apology was published on **4 January 2012** (Fox Sports/AP and The Columbian, both dated 4 January). Irish print coverage ran on 5 January.
3. **Slightly misquoted:** "Ayre described his behaviour as unacceptable". Ayre's actual words were that Suárez's behaviour "was not acceptable". Use those words, or paraphrase without the word "unacceptable". In 2013 it was Rodgers, about the bite, who said "unacceptable".
4. **Barcelona fee not given (the brief asked for it).** Neither club disclosed it at the time. It was widely reported as **£75m** (SI, FourFourTwo). Barcelona's vice-president later said **€81m** (19 August 2014). LFChistory lists **£65m**. Safest wording: "a fee widely reported at £75m".
5. **Uruguay caps not given (the brief asked for them).** Suárez won **143 caps and scored 69 goals**, a national record. His last game was the 0–0 draw with Paraguay on 6 September 2024, after which he retired from international football. LFChistory still shows 142, the count before that farewell game.
6. **Detail to soften:** Groningen's "unsuccessful attempt to escape his contract through arbitration". UEFA (9 August 2007) says only that the Dutch FA (KNVB) ruled his Groningen contract binding. A Dutch report headline of July 2007 says Suárez *dropped* his arbitration case. Safer: "after the Dutch FA ruled his Groningen contract binding".
7. **Schema (will fail or mis-render):** the frontmatter is JSON and carries retired History fields (`category`, `articleType`, `editorialMode`, `historyEras`, `playerIds`). It has no `date`. The body repeats the headline as an `#` heading and ends with a `## Sources` list. BiographySchema has no sources field, so attribution must go inline. The frontmatter needs reformatting to `title`, `slug`, `date`, `historicalPeriod`, `decade`, `excerpt` and optional `role`. The headline is already sentence case.
8. **Minor, optional:** "Ajax … He became captain". This is well known but I did not independently confirm it in this check. Low risk.

## 2. Current status (as of 10 November 2026)

**Alive, aged 39. Still playing, as a forward for Inter Miami CF in MLS.**

- On 17 December 2025 Inter Miami, the reigning MLS champions, announced a contract for the **2026 season**. Terms were not disclosed (AP via NBC Philadelphia, WTOP and CBS Miami; ESPN).
- He was still playing in mid-2026. He scored twice, one a penalty, in a 3–2 win over Chicago Fire played after the 2026 World Cup final (WTOP/AP, July 2026). He also scored against Cincinnati in MLS 2026 (Outlook India).
- He retired from international football in September 2024 (MLS, ESPN, Reuters via The Star).
- I found no report of a retirement or a contract decision beyond 2026. His deal runs to the end of the 2026 MLS season, so this is worth rechecking just before publication.
- Safest wording: "now in the closing stage of his career with Inter Miami, alongside Lionel Messi."

Sources:
- https://www.nbcphiladelphia.com/news/sports/soccer/luis-suarez-inter-miami-2026/4319208/
- https://www.espn.com/soccer/story/_/id/47334693/luis-suarez-extends-inter-miami-deal-2026-mls-season
- https://wtop.com/sports/2026/07/preston-plambeck-luis-suarez-help-inter-miami-beat-fire-3-2-without-lionel-messi/
- https://www.outlookindia.com/sports/football/inter-miami-vs-fc-cincinnati-mls-2026-nu-stadium-in-pics
- https://www.mlssoccer.com/news/luis-suarez-retires-from-uruguay-national-team

## 3. Figure list

| Claim | Correct figure | Sources (URLs) | Verdict |
|---|---|---|---|
| Born Salto, Uruguay, 24 January 1987 | Correct | https://lfchistory.net/players/1224 | Confirmed (single source: LFChistory) |
| Senior career began at Nacional, Montevideo | Correct | https://www.uefa.com/uefaeuropaleague/news/newsid=435773.html ; LFChistory | Confirmed (2+) |
| Groningen signed him in 2006 | Correct (UEFA report 11 July 2006) | https://www.uefa.com/uefaeuropaleague/news/newsid=435773.html | Confirmed (single source: UEFA) |
| 10 goals in 29 league games in first Dutch season | Correct | https://www.uefa.com/uefachampionsleague/news/01c4-0e6e5fa4d109-10693f342bfd-1000--ajax-made-to-pay-for-suarez/ | Confirmed (single source: UEFA) |
| Ajax agreed €7.5m transfer, August 2007, aged 20 | Correct (9 August 2007) | UEFA as above | Confirmed (single source: UEFA) |
| Groningen insisted on a fee after "unsuccessful attempt to escape his contract through arbitration" | KNVB ruled the contract binding. A Dutch report says he dropped the arbitration case | UEFA as above; https://www.fcupdate.nl/voetbalnieuws/2007/07/suarez-ziet-af-van-arbitragezaak (headline only) | Corrected (soften, see section 4) |
| 35 Eredivisie goals in 2009–10 | Correct (35 in 33 league games, top scorer) | https://www.uefa.com/news-media/news/01e5-0e7496b8b3c4-2979c8a8d3d4-1000--season-review-netherlands | Confirmed (single source: UEFA) |
| Became Ajax captain | Widely reported; not confirmed in this check | — | Unsourced (low risk) |
| Passed 100 Ajax goals in July 2010 | Correct: 100th goal v PAOK, 28 July 2010 | https://english.ajax.nl/articles/100-goals-tadic-serb-in-noteworthy-list/ | Confirmed (single source: Ajax) |
| Bit PSV's Otman Bakkal, November 2010; seven-match domestic ban | Correct | https://www.uefa.com/news-media/news/01eb-0e765523ec2d-2b949b0f96a9-1000--ajax-s-suarez-banned-for-seven-matches ; https://www.dutchnews.nl/2010/11/suarez_suspended_for_seven_lea/ ; https://www.fourfourtwo.com/news/suarez-handed-seven-match-ban-biting | Confirmed (2+) |
| 2010 World Cup: three goals; Uruguay reached semi-finals; sent off for goal-line handball v Ghana; Gyan missed the penalty; Uruguay won the shoot-out; Suárez missed the semi | Correct (goals: two v South Korea, one v Mexico) | https://www.si.com/soccer/2010/07/03/suarez-handball ; https://africa.espn.com/espn/story/_/id/48823605/fifa-world-cup-classic-clashes-ghana-vs-uruguay-2010-south-africa | Confirmed (2+); goal count well established |
| Dalglish returned as manager January 2011 | 8 January 2011 | https://bootroom.liverpoolfc.com/history/timeline/1996-present/hodgson-leaves-dalglish-returns ; https://www.aljazeera.com/amp/sports/2011/1/8/dalglish-steps-in-at-liverpool | Confirmed (2+) |
| Deal worth up to £22.8m; joined on deadline day (31 January 2011), the day Torres left and Carroll arrived | Correct | https://lfchistory.net/players/1224 ; https://www.irishexaminer.com/sport/soccer/arid-30491642.html ; https://www.rte.ie/sport/soccer/2011/0131/275796-liverpool_newcastle_carrolla | Confirmed (2+) |
| No.7 shirt | Correct | Irish Examiner, RTÉ as above | Confirmed (2+) |
| Debut 2 February 2011 v Stoke: on for Aurelio at 63', scored 16 minutes later (79'), rounded keeper, Wilkinson's clearance attempt, 2–0, Kop end, Liverpool 1–0 up (Meireles) | All correct | https://www.skysports.com/football/news/11669/6718950/suarez-shows-life-after-torres ; https://www.aljazeera.com/sports/2011/2/2/suarez-enjoys-dream-debut | Confirmed (2+) |
| 3–1 v Manchester United, March 2011; Kuyt hat-trick; Suárez central to the goals | 6 March 2011. Suárez was involved in all three goals: dribble and pass for the 1st, cross for the 2nd, free-kick spilled for the 3rd | https://www.foxsports.com/stories/soccer/liverpool-3-1-manchester-united | Confirmed (single source: Fox/AP); safe |
| 2010–11: 13 league appearances, 4 goals | Correct (13 apps / 4 goals; all were in the league) | https://lfchistory.net/players/1224 | Confirmed (single source: LFChistory) |
| Copa América 2011: winner and best player; both goals in the semi v Peru; opened scoring in the 3–0 final v Paraguay | Correct (semi 2–0; final goal 12') | https://globalnews.ca/news/138970/suarez-forlan-lead-uruguay-to-3-0-victory-over-paraguay-for-record-15th-title ; https://www.aljazeera.com/amp/sports/2011/7/20/uruguay-reach-copa-america-final | Confirmed (2+) |
| League Cup at Stoke, October 2011: both goals in 2–1 win from behind; curler, then late header | Correct (26 October 2011) | https://www.irishtimes.com/sport/suarez-shows-sheer-class-1.632513 ; https://nesn.com/?p=23771 | Confirmed (2+) |
| League Cup final v Cardiff, February 2012: 2–2, penalties, Škrtel and Kuyt scored, Suárez played | Correct (26 February 2012; first trophy since the 2006 FA Cup) | https://www.aljazeera.com/amp/sports/2012/2/26/liverpool-win-league-cup-thriller ; https://lfchistory.net/players/1224 | Confirmed (2+) |
| Only major team honour at the club | Correct | LFChistory | Confirmed (single source: LFChistory) |
| FA Cup semi v Everton: Suárez equalised, Carroll headed winner, 2–1 | Correct (14 April 2012; 62', 87') | https://www.aljazeera.com/sports/2012/4/14/carroll-heads-liverpool-to-fa-cup-final ; https://www.si.com/soccer/2012/04/14/liverpool-everton | Confirmed (2+) |
| Created two of Gerrard's three goals in 3–0 derby | Correct (13 March 2012; 2nd and 3rd goals) | https://legacy.liverpoolfc.com/news/first-team/116850-stevie-luis-put-them-on-a-plate | Confirmed (single source: LFC) |
| FA Cup final lost to Chelsea | Correct (2012) | well established | Confirmed |
| 2011–12: 17 goals in 39 appearances | Correct | https://lfchistory.net/players/1224 | Confirmed (single source: LFChistory) |
| Evra incident, 1–1 at Anfield, 15 October 2011 | Correct | https://www.aljazeera.com/sports/2011/12/31/luis-suarez-gave-unreliable-evidence | Confirmed (2+ with Sky) |
| 20 December 2011: FA commission found he used insulting words including a reference to Evra's colour; eight matches; £40,000 | Correct. FA wording: "used insulting words towards Mr Evra … contrary to FA Rule E3(1)"; "the insulting words used by Mr Suarez included a reference to Mr Evra's colour within the meaning of Rule E3(2)"; "suspended for eight matches covering all first team competitive matches"; "£40,000"; also warned about future conduct | https://www.skysports.com/football/news/11669/7389270/Suarez-handed-eight-match-ban ; https://www.aljazeera.com/amp/sports/2011/12/20/suarez-hit-with-eight-game-ban | Confirmed (2+) |
| Written reasons: Evra credible; Suárez's account unreliable; experts found the language racially offensive, including in Uruguay | Correct: "Mr Evra was a credible witness"; Suárez's evidence "unreliable in relation to matters of critical importance"; experts said the language "would be considered racially offensive"; panel called the claim that it was inoffensive in Uruguay "unsustainable". Context: the FA "did not contend that Mr Suarez acted as he did because he is a racist" | https://www.aljazeera.com/sports/2011/12/31/luis-suarez-gave-unreliable-evidence ; https://www.fourfourtwo.com/news/fa-report-suarez-evidence-unreliable ; https://www.foxsports.com/stories/soccer/fa-report-suarez-kept-using-negro | Confirmed (2+) |
| 3 January 2012: Liverpool would not appeal, while disputing the findings; Suárez kept up his denial | Correct | https://www.skysports.com/football/news/11669/7409622/Reds-accept-Suarez-sanction ; https://www.aljazeera.com/sports/2012/1/3/liverpool-will-not-appeal-against-suarez-ban | Confirmed (2+) |
| Apology "for offence" on **5 January**, still saying the term was not derogatory | Substance correct; **date was 4 January 2012** | https://www.foxsports.com/stories/soccer/luis-suarez-issues-partial-apology ; https://www.columbian.com/news/2012/jan/04/suarez-apologizes-if-racial-slur-caused-offense/ ; https://legacy.liverpoolfc.com/news/first-team/114203-luis-suarez-i-apologise | Corrected (date) |
| Old Trafford handshake refusal, February 2012; apology 12 February; Ayre said the player had told the club he would shake hands | Correct (match 11 February, statements 12 February) | https://legacy.liverpoolfc.com/news/first-team/115343-ian-ayre-luis-was-wrong ; https://www.foxsports.com/stories/soccer/suarez-apologizes-for-snubbing-evra-handshake | Confirmed (2+) |
| Ayre "described his behaviour as unacceptable" | Ayre: his behaviour "was not acceptable" | LFC and Fox as above | Corrected (wording) |
| Rodgers became manager in 2012; Suárez signed a new contract that summer | Correct (new deal 7–8 August 2012) | https://www.aljazeera.com/sports/2012/8/7/luiz-suarez-signs-new-contract-with-liverpool ; https://uefa.com/uefaeuropaleague/news/0200-0e9d2eb27ac4-c03781f9971e-1000--suarez-signs-on-for-more-with-liverpool | Confirmed (2+) |
| Hearts, August 2012: late goal for a 2–1 aggregate win, Hearts one goal from extra time, tight-angle finish | Correct (30 August 2012, 88', 1–1 on the night) | https://www.irishexaminer.com/sport/soccer/arid-30565060.html ; https://www.scotsman.com/sport/football/hearts/latest-hearts-news/liverpool-1-1-hearts-agg-2-1-hearts-european-adventure-ends-despite-reina-blooper-1610535 | Confirmed (2+) |
| Newcastle, November 2012: controlled José Enrique's long ball, rounded Krul, equalised, 1–1 | Correct (4 November 2012, 67'). Chest control not stated in the report I read but widely described | https://www.aljazeera.com/sports/2012/11/4/superb-suarez-goal-earns-liverpool-draw ; https://legacy.liverpoolfc.com/news/first-team/125779-luis-strike-not-enough-for-reds | Confirmed (2+); "on his chest" single source |
| Sturridge and Coutinho arrived January 2013 | Correct | https://the42.ie/liverpool-complete-coutinho-signing-from-inter-milan-776143-Jan2013 ; https://www.empireofthekop.com/2026/01/13/liverpool-january-2013-transfers-sturridge-coutinho/ | Confirmed (2+) |
| 2012–13: 30 goals in 44 appearances, 23 in the league | 30 in 44 correct. 23 league is consistent with LFChistory's 69 league total (4 + 11 + 23 + 31) | https://lfchistory.net/players/1224 | Confirmed (single source: LFChistory) |
| Second to Bale in 2013 PFA vote; in Team of the Year | Correct | https://legacy.liverpoolfc.com/news/first-team/132991-suarez-finishes-second-in-pfa-vote ; https://nesn.com/2013/04/luis-suarez-finishes-second-behind-gareth-bale-in-2012-13-pfa-player-of-the-year-voting | Confirmed (2+) |
| Liverpool 7th in 2012–13 | Correct | well established | Confirmed |
| Bit Ivanović, 2–2 v Chelsea, Anfield, 21 April 2013; officials did not see it; Suárez scored the late equaliser | Correct (referee Kevin Friend; header in the 7th minute of stoppage time) | https://www.aljazeera.com/amp/sports/2013/4/22/liverpools-suarez-bites-chelsea-opponent ; https://www.washingtontimes.com/news/2013/apr/21/suarez-bites-opponents-arm-apologizes/ | Confirmed (2+) |
| Same-day apology; statements from Ayre and Rodgers condemning the behaviour | Correct. Rodgers: "his behaviour is unacceptable"; Ayre: behaviour not befitting a Liverpool player | https://legacy.liverpoolfc.com/news/first-team/132676-luis-suarez-i-m-sorry-1 ; https://www.sportsmole.co.uk/football/liverpool/news/ayre-criticises-suarez-behaviour_80778.html | Confirmed (2+) |
| 24 April 2013: ten-match ban; he admitted violent conduct but argued the standard three matches was enough; commission called three "clearly insufficient"; no appeal | Correct (no-appeal announced 26 April) | https://www.aljazeera.com/sports/2013/4/24/suarez-banned-for-10-matches-by-fa ; https://www.si.com/soccer/2013/04/26/luis-suarez-biting-ban-liverpool-appeal | Confirmed (2+) |
| Ban covered the last four games of 2012–13 and the first six of 2013–14 (five PL, one League Cup) | Consistent: 33 of 38 PL games played in 2013–14; return at Man Utd in the League Cup, 25 September 2013 | https://www.premierleague.com:443/news/4261107 ; https://www.foxsports.com/stories/soccer/suarez-makes-return-from-10-game-ban-for-biting | Confirmed (2+, by arithmetic) |
| Arsenal's £40m + £1 bid rejected | Correct (£40,000,001, 23 July 2013) | https://www.rte.ie/sport/soccer/2013/0723/464266-liverpool-reject-improved-arsenal-bid-for-suarez ; https://www.football365.com/news/wenger-reveals-all-on-arsenals-40000001-suarez-bid | Confirmed (2+) |
| Rodgers made him train separately | Correct (from about 8 August 2013; back in first-team training by about 16 August) | https://www.newstalk.com/sport/luis-suarez-ordered-to-train-alone-723381 ; https://www.rte.ie/sport/soccer/2013/0816/468579-suarez-returns-to-training | Confirmed (2+) |
| Returned to competitive football in September 2013 | Correct (25 September) | Fox as above; https://the42.ie/luis-suarez-ban-return-manchester-united-liverpool-capital-one-cup-1098716-Sep2013 | Confirmed (2+) |
| New long-term contract 20 December 2013 | Correct | https://www.thestar.com.my/sport/football/2013/12/20/suarez-signs-longterm-contract-with-liverpool--club ; https://worldsoccertalk.com/2013/12/20/luis-suarez-signs-new-long-term-contract-with-liverpool/ | Confirmed (2+) |
| 2013–14: 31 PL goals in 33 apps, no penalties; equalled the then 38-game record; missed the first five league games | Correct (record shared with Shearer and Ronaldo; since beaten) | https://www.premierleague.com:443/news/4261107 ; https://lfchistory.net/players/1224 | Confirmed (2+) |
| 2013–14 all competitions | 37 apps, 31 goals (not stated in the draft) | LFChistory | Confirmed (single source: LFChistory) |
| Norwich 5–1, 4 December 2013: four goals (long-range first-time strike, close-range volley, flick over Fer then half-volley, free-kick); set up Sterling; third league hat-trick v Norwich | All correct (15', 29', 35', 74'; Sterling 88'). First player to score three PL hat-tricks against one club | https://www.irishtimes.com/sport/soccer/english-soccer/liverpool-s-luis-suarez-tortures-norwich-again-1.1617224 ; https://lfchistory.net/games/5394 ; https://www.sportsmole.co.uk/football/liverpool/match-analysis/liverpool-5-1-norwich_122195.html | Confirmed (2+) |
| Two earlier hat-tricks were at Carrow Road in 2012 | Two earlier hat-tricks confirmed; venue (both away, April and September 2012) not separately confirmed | Irish Times as above | Confirmed (2+) for count; venue single |
| Spurs 0–5, 15 December 2013: captain with Gerrard out; two goals; Henderson, Flanagan, Sterling also scored | Correct | https://nesn.com/2013/12/luis-suarez-flourishes-as-captain-leads-liverpools-rout-of-tottenham-with-two-goals-three-assists ; https://www.sportsmole.co.uk/football/spurs/result/liverpool-thrash-spurs_124573.html | Confirmed (2+) |
| Cardiff 3–6, March 2014: came from behind twice; Suárez 3, Sturridge 1; each created one for the other; Sturridge back-heel | Correct (22 March 2014; Škrtel scored the other two) | https://www.cardiffcityfc.co.uk/news/2014/march/city-3-6-liverpool ; https://www.nbcsports.com/soccer/news/cardiff-3-6-liverpool-stunning-comeback-for-reds-as-suarez-bags-another-hat-trick | Confirmed (2+) |
| Eleven-match winning league run including Arsenal 5–1, United 3–0 away, City 3–2 | Correct (run began with the Arsenal game) | https://www.premierleague.com/en/news/59027 | Confirmed (single source: Premier League) |
| Lost 0–2 v Chelsea; drew 3–3 at Palace from 3–0 up; finished second, two points behind City | Correct (City 86, Liverpool 84) | Premier League as above; https://rsssf.org/tablese/eng2014.html | Confirmed (2+) |
| Golden Boot; PFA Players' Player; FWA Footballer of the Year; PL Player of the Season | All correct (PFA 27 April; FWA 5 May 2014) | https://legacy.liverpoolfc.com/news/first-team/162847-suarez-scoops-double-premier-league-prize ; https://footballwriters.co.uk/news/suarez-named-fwa-footballer-of-the-year-2014/ ; https://legacy.liverpoolfc.com/news/first-team/162025-suarez-voted-as-pfa-player-of-the-year | Confirmed (2+) |
| Shared European Golden Shoe with Ronaldo | Correct (31 each) | https://www.liverpoolfc.com/news/first-team/163224-suarez-jointly-wins-golden-shoe-prize ; https://laliga.com/en-ES/news/luis-suarez-receives-the-golden-shoe | Confirmed (2+) |
| Liverpool career totals: 82 goals in 133 appearances | Correct (PL 110/69, FA Cup 9/5, League Cup 6/4, Europa League 8/4) | https://lfchistory.net/players/1224 | Confirmed (single source: LFChistory) |
| Chiellini bite 24 June 2014; FIFA: nine international matches and four months from all football activity; CAS (August 2014) upheld the bans but allowed training and other football activity | Correct (CAS announced 14 August 2014). FIFA also fined him CHF 100,000; not needed | https://www.rte.ie/news/2014/0814/637129-luis-suarez ; https://thescore.com/worldcup/news/527378 ; https://csmonitor.com/layout/set/amphtml/World/Latest-News-Wires/2014/0814/Luis-Suarez-4-month-ban-for-biting-upheld-by-CAS | Confirmed (2+) |
| Transfer agreement with Barcelona announced 11 July 2014 | Correct (LFChistory lists departure as 16 July 2014) | https://www.si.com/soccer/2014/07/11/liverpool-luis-suarez-barcelona ; LFChistory | Confirmed (2+) |
| Barcelona fee (not in draft) | Undisclosed; widely reported £75m; Barcelona later said €81m; LFChistory £65m | SI as above; https://fourfourtwo.com/news/on-this-day-in-2014-liverpool-accept-barcelonas-pound75m-offer-for-luis-suarez-1625914809000 ; https://www.thescore.com/liga/news/558452-barcelona-claim-they-only-paid-81-million-for-luis-suarez ; LFChistory | Sources disagree: use "widely reported £75m" |
| Rodgers: club reluctantly agreed to his wish to move to Spain | Correct | https://gulfnews.com/sport/football/brendan-rodgers-well-be-stronger-without-luis-suarez-1.1358851 | Confirmed (single source: Gulf News quoting LFC statement) |
| Suárez cited long-held ambition and his wife's family in Spain | Correct | SI as above | Confirmed (single source: SI quoting LFC statement) |
| Helped restore Champions League qualification; left before playing in it for Liverpool | Correct | SI (club statement) | Confirmed |
| Barcelona: won the 2015 Champions League, scored in the final v Juventus; four Spanish titles with Barcelona; one with Atlético | Correct (Berlin, 3–1; Atlético title 2020–21, with Suárez scoring the decisive goal at Valladolid) | https://www.fcbarcelona.com/en/football/first-team/news/1837738/agreement-with-atletico-madrid-for-the-transfer-of-luis-suarez ; https://nbcsports.com/soccer/news/juventus-1-3-barcelona-luis-suarezs-late-winner-seals-another-champions-league-triumph ; https://cyprus-mail.com/2021/05/22/atletico-madrid-clinch-la-liga-title-thanks-to-suarez-winner | Confirmed (2+) |
| Uruguay caps (not in draft) | 143 caps, 69 goals (record); last game 6 September 2024 | https://thestar.com.my/sport/football/2024/09/07/soccer-uruguay039s-suarez-bids-farewell-in-goalless-draw-with-paraguay ; https://www.mlssoccer.com/news/luis-suarez-retires-from-uruguay-national-team (142 before the farewell) | Confirmed (2+) |
| "Three and a half years" at Liverpool | Correct (January 2011 – July 2014) | LFChistory | Confirmed |

## 4. Corrections

1. **Draft:** "On 5 January he apologised for offence caused while still insisting that his use of the term had not been derogatory."
   **Replace with:** "On 4 January he apologised for any offence caused, while still insisting that he had never used the word in a derogatory way."

2. **Draft:** "Ayre described his behaviour as unacceptable."
   **Replace with:** "Ayre said it had been made clear to Suárez that his behaviour was not acceptable."

3. **Draft:** "Groningen's insistence on an agreed fee, following an unsuccessful attempt to escape his contract through arbitration, meant this was already a career shaped by ambition and contested moves."
   **Replace with:** "The Dutch FA ruled that his Groningen contract was binding, so Ajax had to pay a substantial fee. This was already a career shaped by ambition and contested moves."

4. **Draft (Evra section, neutral-wording check):** "He also received major suspensions for racially abusing Patrice Evra and biting Branislav Ivanović."
   This is acceptable and matches common usage. For maximum precision, tie it to the finding: "He was also banned for eight matches after an FA commission found he had racially abused Patrice Evra, and for ten matches for biting Branislav Ivanović."
   Similarly, "This was a disciplinary finding of racial abuse…" can stay. Optionally, add the FA's own words: the commission found he had used "insulting words" that "included a reference to Mr Evra's colour".

5. **Optional (fairness and context, recommended):** after "Its written reasons found Evra credible…", consider adding: "The FA did not allege, and the commission did not find, that Suárez was a racist; the charge concerned the words he used." The commission's reasons record that the FA "did not contend that Mr Suarez acted as he did because he is a racist". This keeps the piece precise without softening the finding.

6. **Transfer to Barcelona (missing fee, the brief asked for it):** after "Liverpool announced a transfer agreement with Barcelona on 11 July," add "for a fee widely reported at £75m".

7. **Ending (missing current status):** add a closing line such as: "He played on into his late thirties, winning 143 caps and scoring a record 69 goals for Uruguay before retiring from international football in 2024, and is now in the closing stage of his career at Inter Miami." Recheck the Inter Miami status just before publication: his contract runs to the end of the 2026 MLS season.

8. **Schema:** reformat the frontmatter to BiographySchema (`title`, `slug`, `date`, `historicalPeriod: "2011–2014"`, `decade: "2010s"`, `excerpt`, optional `role`, e.g. "Forward"). Remove the retired fields, the `# ` headline in the body and the `## Sources` section.

## 5. Cut list

- Nothing needs cutting outright.
- Soften: "following an unsuccessful attempt to escape his contract through arbitration" (see correction 3).
- Low risk, keep unless Denny wants it airtight: "He became captain" (Ajax). This is widely reported but was not independently sourced in this check.
- Single-source detail, keep: "controlled José Enrique's long pass on his chest". The ball, the pass and the rounding of Krul are confirmed; "chest" is not in the report I read.

## 6. Quotes

There are **no direct quotations** (text in quotation marks) in the body of the draft.

Reported speech checked against the originals:
- Suárez's 4 January 2012 apology: he said he "never, ever used this word in a derogatory way" and "if it offends anyone then I want to apologise for that" (LFC; Fox/AP). The draft's paraphrase is fair; only the date is wrong.
- Ayre, 12 February 2012: "The player had told us beforehand that he would, but then chose not to do so" and "It has been made absolutely clear to Luis Suarez that his behaviour was not acceptable" (LFC). The paraphrase is fair except for the word "unacceptable" (correction 2).
- Rodgers, 21 April 2013: "Having reviewed the video footage and spoken to Luis, his behaviour is unacceptable and I have made him aware of this" (LFC). The draft's paraphrase ("condemning the behaviour") is fair.
- Rodgers, 11 July 2014: "with great reluctance and following lengthy discussions that we have eventually agreed to his wishes … to move to Spain for new experiences and challenges" (Gulf News, quoting the LFC statement). The paraphrase is fair.
- Suárez, 11 July 2014: "playing and living in Spain, where my wife's family live, is a lifelong dream and ambition" (SI, quoting the LFC statement). The paraphrase is fair.

If any of these are turned into direct quotes, use the wording above exactly.

---

# Editor's note

# Edit note: Luis Suárez

Body: about 1,300 words. Frontmatter rebuilt to the biography format (title, slug, date, historicalPeriod, decade, role, excerpt). The retired History fields, the repeated `#` headline and the Sources list are removed.

Corrections applied from the fact-check:
- Suárez's apology is dated 4 January 2012, not 5 January.
- Ayre: written as "it had been made clear to Suárez that his behaviour was not acceptable". It is paraphrased, not in quotation marks, so the word "unacceptable" is gone.
- Groningen: softened to the Dutch FA ruling that his contract was binding. The arbitration claim is cut.
- The Evra case is tied to the commission's findings ("banned for eight matches after an FA commission found he had racially abused Patrice Evra"). The only direct quote is the FA's own wording, "included a reference to Mr Evra's colour". Added the line that the FA did not allege, and the commission did not find, that he was a racist.
- Barcelona: "a fee widely reported at £75m".
- Added 143 Uruguay caps, a record 69 goals and his international retirement in 2024.

Cut:
- Low-risk items from the cut list: Ajax captaincy, and "on his chest" (I cut the whole Newcastle 2012 goal).
- Details the fact-check never confirmed: John Ruddy, his distress after the Palace match, the Wembley venue for the 2012 League Cup final.
- For length: the Ajax 100th goal, the Copa América semi-final, the Hearts and Spurs supporting detail, Škrtel's two goals at Cardiff, the referee's name, and Suárez's own reason for leaving.
- Essay passages from the draft (the "responsibilities" and "legacy" paragraphs) are gone. The piece ends on his Uruguay record.

Deliberately left out:
- No current club is stated. The Inter Miami line was not used.
- There is no mention of the club fine after the Ivanović bite, or of where any fine went, so the piece does not touch Hillsborough. Heysel is not mentioned.
- The FA's £40,000 fine in the Evra case is given as an amount only.

---

# Final check: Luis Suárez biography

Checked 10 November 2026. File: /home/claude/bios/work/luis-suarez/bio.md

## Verdict: PASS WITH FIXES

## Changes made

1. "It was the club's first trophy since the 2006 FA Cup" → "It was the club's first major trophy since the 2006 FA Cup". Liverpool also won the 2006 Community Shield (August 2006), so the unqualified claim was strictly wrong. The fact-check report's source (Al Jazeera, 26 February 2012) supports the 2006 FA Cup as the last major trophy.

No other edits.

## Disciplinary passages, checked word by word

- **Evra:** 1–1 at Anfield, 15 October 2011; independent FA regulatory commission, 20 December 2011; insulting words that "included a reference to Mr Evra's colour" (the FA's own wording, Sky/Al Jazeera); eight matches; £40,000. All match. The written reasons say "Mr Evra was a credible witness" and that Suárez's evidence was "unreliable in relation to matters of critical importance" (I rechecked Al Jazeera, 31 December 2011). Linguistic experts said the language "would be considered racially offensive" (I rechecked Fox/AP). The FA "did not contend that Mr Suarez acted as he did because he is a racist" (Al Jazeera). The commission ruled only on the words, so "the commission did not find" that he was a racist is accurate. The lead's "found he had racially abused Patrice Evra" is the fact-check's recommended wording and is fair to the finding.
- **No appeal, 3 January 2012; qualified apology, 4 January 2012:** correct, with fair paraphrase ("never, ever used this word in a derogatory way").
- **Handshake, 11 February 2012; apology the next day; Ayre:** the paraphrase "it had been made clear to Suárez that his behaviour was not acceptable" matches Ayre's words ("It has been made absolutely clear to Luis Suarez that his behaviour was not acceptable"). The piece does not use the word "unacceptable" for Ayre. Ayre was managing director at the time (LFC).
- **Bakkal:** PSV, November 2010, seven-match ban while at Ajax. Correct (UEFA, DutchNews, FourFourTwo).
- **Ivanović:** 21 April 2013, 2–2 v Chelsea at Anfield, bite on the arm, not seen by officials, equaliser in the seventh minute of stoppage time, same-day apology. Ten-match ban on 24 April. He admitted violent conduct but argued three matches was enough; the commission called three "clearly insufficient"; no appeal. The 4 + 6 split (five Premier League games, one League Cup game) checks out against his 25 September 2013 return.
- **Chiellini:** 24 June 2014 World Cup; FIFA ban of nine internationals and four months from all football activity; CAS in August 2014 upheld the bans but allowed training. Correct.

## Other facts confirmed

- Signing on 31 January 2011, up to £22.8m, No. 7.
- Debut v Stoke on 2 February 2011: on at 63 minutes, scored 16 minutes later, 2–0.
- 133 appearances, 82 goals (LFChistory).
- League Cup 2012: Cardiff, 2–2, won on penalties, Škrtel and Kuyt scored.
- 2013–14: 31 league goals in 33 games, no penalties, equalling the then record shared by Shearer and Ronaldo. Golden Boot, PFA, FWA and Premier League Player of the Season; shared the European Golden Shoe.
- Arsenal bid of £40,000,001.
- Barcelona fee "widely reported at £75m"; announced 11 July 2014.
- 143 caps and a record 69 goals for Uruguay; retired from international football in 2024.
- Groningen and Dutch FA wording: I rechecked UEFA (9 August 2007): €7.5m, aged 20, 10 goals in 29 league games, "The Royal Netherlands Football Association had ruled that Suárez's contract" was binding. The piece's wording matches.
- Every other figure and date matches the fact-check figure list.

## Exclusions

- No current club is named (Inter Miami and Messi are not mentioned).
- Nothing on where any fine went.
- No Heysel or Hillsborough references.
- historicalPeriod "2011–2014" is correct as a year span.

## Format

- Frontmatter has exactly title, slug, date, historicalPeriod, decade ("2010s"), role and excerpt.
- The body starts directly after the closing ---.
- Ranges and scores use en dashes.
- No sources list or links.
- The headline is sentence case.
- British spellings throughout.

## Remaining concerns (minor, no action required)

- "Suárez played." (League Cup final paragraph) is abrupt. The editor may want to fold it into the previous sentence.
- The Evra section steps back in time (October 2011) after the League Cup section runs to April 2012. The opening sentence of the Evra section makes the date clear, so this reads fine.
- Single-source items carried over from the fact-check: birth details, the season splits and the 133/82 totals all come from LFChistory alone. These are standard and low risk.
Coordinator tidy: smoothed 'Suárez played.'
