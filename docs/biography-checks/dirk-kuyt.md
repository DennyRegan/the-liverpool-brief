# dirk-kuyt: checks before publication

Draft by GPT (branch editorial/next-ten-biographies-batch-four-2026-10-03). Checked on 10 November 2026 by three fresh agents: fact-check of the draft, edit, then an independent final check of the edited text.

---

# Fact-check: Dirk Kuyt biography (draft: /home/claude/bios/gpt/dirk-kuyt.md)

Checked 10 November 2026.

## Sensitive events flag

- **Heysel:** not mentioned.
- **Hillsborough disaster:** not mentioned.
- **Death in the family (flag):** the draft says "Kuyt's father died in 2007" and links the following months to a dip in form (paragraph beginning "It was also a difficult period personally"). The brief I was given says his father died in 2008, but **2007 is correct**. Dirk Kuyt senior died of oesophageal cancer on 29 June 2007. Kuyt won his 100th cap on 29 June 2014, the anniversary of the death. In his own LFC column (late November 2021) Kuyt said his father "had passed away a couple of months before" the October 2007 derby. 2008 is impossible on that evidence. **Recommendation:** keep it brief, one sentence: the year, and that Kuyt himself linked it to a hard spell. The draft's extra editorial sentence ("The career should allow room for that difficulty without reducing every performance to an explanation supplied from outside") can go. Do not add the cause of death.
- No other illness or sensitive personal matter.

## 1. Summary

The match narrative is strong. Almost every match fact checks out against LFChistory, UEFA, Sky and liverpoolfc.com: the debut, first goal, the 2007 Chelsea semi and Athens final, both Goodison derbies, Inter, Arsenal, Chelsea 2008, Standard Liège, Man City, the United hat-trick, the 2012 League Cup final and shoot-out, the last game at Swansea and the Fenerbahçe move. The season figures (285 appearances, 71 goals, 14 / 15 / 13 etc.) are right. The big problem is the ending. It stops at his 2017 retirement and says nothing of his coaching career. **As of today he is at Fenerbahçe: he was interim head coach and beat Liverpool 3–2 in the Champions League six days ago.** A Liverpool site cannot run this piece without that. There are no direct quotations (in quotation marks) in the body. All reported speech was checked against the original interviews and is fair.

Errors and issues:
1. **Current status missing (serious):** the piece ends with retirement in 2017. Kuyt has coached since 2018. He was appointed Fenerbahçe interim head coach on 30 October 2026 and beat Liverpool 3–2 in Istanbul on 4 November 2026 (see section 2).
2. **Unsourced detail:** "his late, deflected shot" (Inter, 19 February 2008). UEFA gives Kuyt 85' but says nothing of a deflection. Say "his late shot" or "his 85th-minute goal".
3. **Unverified detail:** "Gerrard drove past opponents down the left" (Arsenal, 2 April 2008). UEFA says Gerrard got past Eboué and Touré and crossed low. It does not say "down the left". Drop "down the left".
4. **Single-source claim:** "scoring against Feyenoord in the 2003 final" (Utrecht's 4–1 KNVB Cup final win, 1 June 2003). Only Wikipedia confirmed it. The KNVB page cited in the draft could not be opened (see note at the end). Keep only if Denny is content with that, or soften to "At Utrecht he won the Dutch Cup in 2003, against Feyenoord".
5. **Omissions the brief asked about (not errors, but the piece is silent):** birth date and place (22 July 1980, Katwijk), transfer fee (£9m per LFChistory), Netherlands career (104 caps, 24 goals, started the 2010 World Cup final), the 2009–10 Europa League semi-final, and his coaching career. No "Goodison penalty in 2008" appears in the draft. His Goodison penalties were both in the October 2007 derby. The later Goodison goal in the draft (November 2009) is correct but was not a penalty. I found no Kuyt penalty at Goodison in 2008.
6. **Schema (will fail or mis-render):** the frontmatter is JSON with retired History fields (`category`, `articleType`, `editorialMode`, `historyEras`, `playerIds`) and has no `date`. The body repeats the headline as an `#` heading and ends with a `## Sources` list. BiographySchema has no sources field (attribution goes inline). It needs reformatting to `title`, `slug`, `date`, `historicalPeriod`, `decade`, `excerpt`, optional `role`. The headline is already sentence case.
7. **Minor wording:** "scored in the 118th minute". UEFA says only that the tie was goalless "after 118 minutes". 118' is the widely used minute, so keep it or write "two minutes from the end of extra time".

## 2. Current status (as of 10 November 2026)

**Alive (aged 46). On the coaching staff at Fenerbahçe. He was the club's interim head coach until Emre Belözoğlu took over for the 8 November league game. His exact role since then is not confirmed.**

- June 2026: left FC Dordrecht, where he had been head coach since summer 2025 and had agreed an extension in April 2026, to become assistant to İsmail Kartal at Fenerbahçe (reports dated 18–22 June 2026).
- 27 October 2026: Kartal resigned after a 2–1 derby defeat to Galatasaray. On 30 October Fenerbahçe named Kuyt interim head coach "until the next international break" (Reuters via The Star; liverpoolfc.com).
- His first game was a 2–1 home defeat by Göztepe. On 4 November 2026 his side beat Liverpool 3–2 in Istanbul in the Champions League league phase (Matchday 4). Liverpool led twice (Nyoni, Isak); Greenwood, Archie Brown and Muriqi scored for Fenerbahçe (Al Jazeera).
- Before that match Fenerbahçe announced Emre Belözoğlu as permanent head coach, to take over after the Liverpool game. Belözoğlu's first match was at Çorum FK on 8 November. Kuyt said he would stay as long as the president wanted and Belözoğlu was comfortable (Fanatik, 5 November). I found no confirmation of his role after 8 November. Safest wording: "now on the coaching staff at Fenerbahçe, where in November 2026, as interim coach, he beat Liverpool".
- Earlier coaching: Feyenoord Under-19s (2018–20); ADO Den Haag head coach (June–November 2022, dismissed); Beerschot (December 2023 – June 2025: promotion in 2024, then relegation and dismissal in 2025); FC Dordrecht (2025–26).

Sources:
- https://www.thestar.com.my/sport/football/2026/10/30/soccer-fenerbahce-appoint-dutchman-kuyt-as-interim-coach
- https://www.liverpoolfc.com/news/dirk-kuyt-takes-interim-charge-of-fenerbahce-ahead-of-clash-with-liverpool
- https://karlobag.eu/en/sports/fenerbahce-retain-dirk-kuyt-as-interim-coach-until-november-break-ahead-of-champ-zbpwe/ (weak; corroborates dates)
- https://www.aljazeera.com/sports/2026/11/5/champions-league-liverpool-suffer-3-2-loss-at-fenerbahce-como-thump-lens
- https://www.flashscore.co.uk/news/football-super-lig-former-newcastle-midfielder-belozoglu-named-manager-of-fenerbahce/CvYsf9L5/
- https://beninwebtv.bj/en/fenerbahce-appoints-emre-belozoglu-kuyt-remains-on-the-bench-against-liverpool/
- https://www.fanatik.com.tr/en/dirk-kuyt-a-miracle-in-istanbul-emre-belozoglus-comments-following-the-fenerbahce-liverpool-match-2643467
- https://ground.news/article/the-dirk-kuyt-crisis-at-fenerbahce-has-been-resolved-he-said-goodbye-and-is-coming_83650d (June 2026 move from Dordrecht)
- https://www.fcupdate.nl/voetbalnieuws/2026/06/paul-nuijten-verlaat-ajax-per-direct-en-volgt-dirk-kuijt-op-bij-dordrecht
- https://www.flashscore.com/news/soccer-jupiler-pro-league-dirk-kuyt-dismissed-as-beerschot-boss-after-disastrous-pro-league-season/vJkaxXFa (Beerschot, from search listing)
- https://global.espn.com/football/story/_/id/37550223/ex-liverpool-striker-dirk-kuyt-coach-feynoord-19s (search listing)
- https://en.wikipedia.org/wiki/Dirk_Kuyt (corroboration of the coaching timeline only)

## 3. Figure list

| Claim | Correct figure | Sources (URLs) | Verdict |
|---|---|---|---|
| Born in Katwijk (not in draft) | 22 July 1980, Katwijk (aan Zee) | https://lfchistory.net/players/1162 ; https://en.wikipedia.org/wiki/Dirk_Kuyt | Confirmed (2+); omitted from draft |
| Began at Quick Boys, Katwijk; then Utrecht; Feyenoord 2003 | Quick Boys youth; Utrecht 1998–2003; Feyenoord 2003–06 | https://en.wikipedia.org/wiki/Dirk_Kuyt ; https://lfchistory.net/players/1162 | Confirmed |
| Won Dutch Cup with Utrecht, scoring v Feyenoord in 2003 final | Utrecht 4–1 Feyenoord, 1 June 2003, Kuyt scored | https://en.wikipedia.org/wiki/Dirk_Kuyt (KNVB link in draft not opened) | Single source (Wikipedia only); soften or verify |
| Prolific forward and captain at Feyenoord | Captain from 2005; 2004–05 Eredivisie top scorer (29) | https://en.wikipedia.org/wiki/Dirk_Kuyt | Single source (Wikipedia); low risk |
| Signed from Feyenoord 18 August 2006 | 18 August 2006; fee £9m (LFChistory); Wikipedia lead says £10m, body "undisclosed" | https://lfchistory.net/players/1162 | Confirmed (single source: LFChistory). Fee not in draft; if added, "a reported £9 million" |
| Crouch, Bellamy, Fowler in the attack | All at the club in August 2006 | general record | Low risk, not separately sourced |
| Debut 8 days later, replaced Crouch, 2–1 v West Ham | 26 August 2006, on for Crouch at half-time, Liverpool 2–1 | https://lfchistory.net/games/bydate/2006-08-26 | Confirmed (single source: LFChistory) |
| Later recalled applause at debut, confidence | "received massive applause from the stands"; "gave me a big boost" (Anfield Wrap, 30 August 2016) | https://lfchistory.net/articles/3996 | Confirmed (paraphrase fair) |
| First goal 20 Sept 2006 v Newcastle, Finnan delivery, 2–0 | Kuyt 29' (assist Finnan), Alonso 79', 2–0 | https://lfchistory.net/games/4998 | Confirmed (single source: LFChistory) |
| 14 goals in first season | 14 (12 league) | https://www.liverpoolfc.com/news/liverpools-greatest-no81-dirk-kuyt ; https://en.wikipedia.org/wiki/Dirk_Kuyt | Confirmed (2+) |
| 1 May 2007: Agger levels tie; Kuyt hits bar, follow-up offside | Agger 22'; Kuyt header off bar after break; extra-time follow-up ruled offside | https://www.uefa.com/uefachampionsleague/news/01c1-0ea8b419fc5b-52c2536a29d5-1000--penalty-joy-as-liverpool-reach-final/ | Confirmed (single source: UEFA) |
| Reina saved two; Kuyt took 4th kick and won it | Reina saved Robben and Geremi; Kuyt 4th taker, 4–1 | same UEFA ; https://www.liverpoolfc.com/news/liverpools-greatest-no81-dirk-kuyt | Confirmed (2+) |
| Athens 23 May 2007: Kuyt lone forward, Gerrard behind, Pennant and Zenden wide; Inzaghi 2; Kuyt header from Agger flick-on; 2–1 | Inzaghi 45' (Pirlo free-kick deflected), about 82'; Kuyt 89' header from Agger flick-on from a corner | https://www.uefa.com/uefachampionsleague/news/01c1-0e6e500c2c66-db2412e7ba39-1000--inzaghi-inspires-milan-to-glory/ ; https://www.liverpoolfc.com/news/liverpools-greatest-no81-dirk-kuyt | Confirmed (2+) |
| Moved right after Torres arrived (2007); had played wide at Utrecht | Kuyt: "In my second season at Liverpool, Fernando came and Stevie played as No.10 and Rafa started to put me on the right wing"; Utrecht manager had put him on the right | https://www.liverpoolfc.com/news/dirk-kuyt-column-salah-and-trents-threat-gerrard-villa-and-more | Confirmed (Kuyt's own account) |
| Father died in 2007 | 29 June 2007 (oesophageal cancer) | https://en.wikipedia.org/wiki/Dirk_Kuyt ; https://www.sportskeeda.com/football/dirk-kuyt-100th-netherlands-cap-father-death-anniversary ; https://thescore.com/worldcup/news/530001 ; LFC derby column ("a couple of months before" Oct 2007) | Confirmed (2+). Draft right; the 2008 in the brief is wrong |
| Linked the death to a dip in form | LFChistory profile; Kuyt column: "It was a tough period for me around that time" | https://lfchistory.net/players/1162 ; https://www.liverpoolfc.com/news/dirk-kuyt-column-merseyside-derby-memories-thiago-form-and-mailbag | Confirmed (2+) |
| Derby memories column, November 2021 | Undated; it refers to "Wednesday's Merseyside derby at Goodison" and Thiago v Southampton "on Saturday", which fits 27 Nov / 1 Dec 2021 | same column | Confirmed by inference |
| 20 Oct 2007 Goodison: Hyypiä og; Kuyt pen equaliser; stoppage-time pen after Neville handball; 2–1 | Hyypiä og 37'; Kuyt pen 52' (Hibbert foul on Gerrard); Kuyt pen 90+1' (Neville handball); Hibbert and Neville sent off | https://www.lfchistory.net/SeasonArchive/Game/5058 ; https://www.liverpoolfc.com/news/liverpools-greatest-no81-dirk-kuyt | Confirmed (2+) |
| Voronin handed him the first penalty; lucky to stay on after lunge at Neville | Voronin: "I'm not feeling comfortable. You take it."; Kuyt: "I was so lucky to not touch him" | LFC derby column (above) | Confirmed (Kuyt's own account) |
| Three league goals in 2007–08 | 3 league (11 all comps) | https://en.wikipedia.org/wiki/Dirk_Kuyt ; LFChistory league total (51) consistent | Confirmed (single source: Wikipedia, consistent with LFChistory totals) |
| Inter, Anfield: Kuyt late "deflected" shot, Gerrard 2nd; Torres in Milan | 19 Feb 2008, 2–0 (Kuyt 85', Gerrard 90'); 11 Mar 2008, 1–0 (Torres 64') | https://www.uefa.com/uefachampionsleague/news/0273-14956f3a9509-82e3507a6622-1000--liverpool-vs-inter-facts/ | Confirmed, except "deflected": Unsourced |
| Arsenal 2 April 2008: Adebayor header, Kuyt equalises 3 min later from Gerrard low cross; 1–1 | Adebayor 23', Kuyt about 26'; Gerrard beat Eboué and Touré, crossed low | https://www.uefa.com/uefachampionsleague/news/01cc-0e6f31ef94a8-ec9d9f6b99cf-1000--kuyt-strike-gives-liverpool-advantage/ | Confirmed (single source: UEFA); "down the left" unverified |
| Chelsea 22 April 2008, Kop end; Riise late og; 1–1; Chelsea won return | Kuyt 43' "at the Kop end"; Riise og deep in added time | https://www.uefa.com/uefachampionsleague/news/01cc-0e6f4e0e991a-84dc0dea79da-1000--chelsea-profit-from-riise-intervention/ | Confirmed (single source: UEFA) |
| Standard Liège 27 Aug 2008: 0–0 in Belgium; Kuyt 118' from Babel cross; 100th appearance; Benítez praise for Kuyt and Reina | Goalless after 118 min, Babel cross, 100th Liverpool appearance; Benítez: "His effort is amazing every game"; Reina "the key player in the first game" | https://www.uefa.com/uefachampionsleague/news/01d0-0e6fbac0c23f-3dcbb4bb9e88-1000--kuyt-leaves-it-late-for-liverpool/ ; https://www.uefa.com/uefachampionsleague/news/01d0-0e6fbd18322a-a2ab2c33069c-1000--reds-duo-earn-benitez-praise/ | Confirmed (2 UEFA reports) |
| 2008–09: all 38 league games, 12 league goals, 15 total | 38 league apps (51 total); 12 league, 15 total | https://lfchistory.net/players/1162 ; https://en.wikipedia.org/wiki/Dirk_Kuyt ; https://www.liverpoolfc.com/news/liverpools-greatest-no81-dirk-kuyt | Confirmed (2+) |
| Man City Oct 2008: 2–0 down at HT, Torres 2, Kuyt stoppage-time winner, 3–2 | 5 Oct 2008: Ireland 19', Garrido 41'; Torres 55', 73'; Kuyt 90'+ | https://sportsmole.co.uk/football/liverpool/on-this-day/feature/otd-torres-stars-as-liverpool-beat-city_249073.html | Confirmed (single source: Sports Mole) |
| Liverpool 2nd, 86 points, division-leading 77 goals | 77 goals confirmed; "four points off the top" (United 90). 86 points and "division-leading" not opened in this check (United, Chelsea and Arsenal all scored fewer, to my knowledge) | https://www.liverpoolfc.com/news/first-team/159513-reds-target-2008-09-record-goal-haul | 77 Confirmed (single source: LFC); 86 and "division-leading" need a one-line table check |
| 2009–10: 53 appearances | 53 (37 league) | https://lfchistory.net/players/1162 | Confirmed (single source: LFChistory) |
| Goodison Nov 2009: Kuyt followed Howard save, 2–0 | 29 Nov 2009: Yobo og 12', Kuyt 80' after Howard failed to hold Riera's shot | https://lfchistory.net/games/5176 ; https://www.skysports.com/football/everton-vs-liverpool/121526 | Confirmed (2+) |
| Anfield Feb 2010: header from Gerrard corner, only goal, Liverpool down to ten | 6 Feb 2010, 1–0, Kuyt 55' header from Gerrard corner; Kyrgiakos sent off 34' | https://www.lfchistory.net/games/5187 ; https://www.aljazeera.com/sports/2010/2/6/kuyt-shines-for-10-man-reds | Confirmed (2+) |
| Benítez left 2010; Hodgson; Dalglish back Jan 2011; Torres out, Suárez and Carroll in | All correct | general record | Low risk, not separately sourced |
| Hat-trick v Man Utd, 6 March 2011, 3–1 (Suárez run; Nani's misdirected header; Van der Sar spill from free-kick) | 34', 39', 65'; Hernández 90+2' | https://www.skysports.com/football/liverpool-vs-manchester-united/231336 ; https://www.liverpoolfc.com/news/liverpools-greatest-no81-dirk-kuyt | Confirmed (2+) |
| 13 league goals 2010–11, his best league return | 13 league (15 total); other seasons 12, 3, 12, 9, 2 | https://en.wikipedia.org/wiki/Dirk_Kuyt ; https://www.liverpoolfc.com/news/liverpools-greatest-no81-dirk-kuyt (15 total) | Confirmed |
| FA Cup 28 Jan 2012: sub, 88th-minute winner v United, 2–1, Reina kick / Carroll flick | Super-sub late winner, 2–1 confirmed in headlines; build-up (Reina, Carroll, low past De Gea) not opened | search listings: https://legacy.liverpoolfc.com/news/first-team/114894-late-kuyt-strike-seals-cup-win ; https://naharnet.com/stories/en/28201-super-sub-kuyt-sends-united-crashing-out | Result and sub role Confirmed; build-up detail unverified (low risk) |
| League Cup final 26 Feb 2012: Mason, Škrtel; Kuyt on for Carroll 103'; scores 108' on second attempt; Turner 118'; shoot-out | Mason 19', Škrtel 58/60', Kuyt 108', Turner 118'; shoot-out: Gerrard miss, Adam miss, Kuyt, Downing, Johnson scored; Anthony Gerrard missed; 3–2 | https://www.lfchistory.net/SeasonArchive/Game/5322 ; https://www.uefa.com/news-media/news/01fa-0e7c25cf0384-d61fa0883c7d-1000--liverpool-lift-league-cup-after-penalty-shoot-out/ | Confirmed (2+) |
| Last appearance: sub at Swansea, 13 May 2012, 0–1 | On for Maxi 73'; Graham 88' | https://lfchistory.net/games/5311 ; https://lfchistory.net/players/1162 | Confirmed (single source: LFChistory) |
| 3 June 2012: agreed Fenerbahçe move, completion expected in days | LFC statement: "expected to be completed in the next few days"; three-year contract | https://legacy.liverpoolfc.com/news/first-team/120383-kuyt-agrees-fenerbahce-deal ; https://www.foxsports.com/stories/soccer/kuyt-leaves-liverpool-for-fenerbahce | Confirmed (2+) |
| 285 apps, 71 goals, one major honour | 285 / 71; 2012 League Cup | https://lfchistory.net/players/1162 ; https://www.foxsports.com/stories/soccer/kuyt-leaves-liverpool-for-fenerbahce | Confirmed (2+) |
| Returned to Feyenoord; 2017 hat-trick won first title since 1999; retired | Back in 2015; hat-trick v Heracles 14 May 2017; title first in 18 years; retirement announced 17 May 2017 | https://en.wikipedia.org/wiki/Dirk_Kuyt ; headlines: https://www.liverpoolfc.com/news/first-team/263287-dirk-kuyt-hat-trick-secures-title-for-feyenoord ; https://thescore.com/uefa/news/1300733 | Confirmed (2+) |
| Netherlands (not in draft) | 104 caps, 24 goals (2004–14); started 2010 World Cup final | https://lfchistory.net/players/1162 ; https://en.wikipedia.org/wiki/Dirk_Kuyt | Confirmed (2+); omitted |

## 4. Corrections

1. "Against Internazionale at Anfield, his late, deflected shot opened a last-16 tie..."
   → "Against Internazionale at Anfield, his 85th-minute goal opened a last-16 tie..."
2. "Three minutes later Gerrard drove past opponents down the left and crossed low for Kuyt to equalise."
   → "Three minutes later Gerrard drove past Emmanuel Eboué and Kolo Touré and crossed low for Kuyt to equalise."
3. "At Utrecht he helped win the Dutch Cup, scoring against Feyenoord in the 2003 final." (single source)
   → keep if accepted on Wikipedia alone, or: "At Utrecht he won the Dutch Cup in 2003, beating Feyenoord in the final."
4. "It was also a difficult period personally. Kuyt's father died in 2007, and he later linked the following months with a decline in his form. The career should allow room for that difficulty without reducing every performance to an explanation supplied from outside."
   → "It was also a difficult period personally: his father died in the summer of 2007, and Kuyt later said he was struggling for form in the months that followed." (brief handling; the date is correct as 2007)
5. Closing section (paragraph beginning "He subsequently returned to Feyenoord..."): add current status after the retirement sentence, e.g. "He moved into coaching, with Feyenoord's youth side, ADO Den Haag, Beerschot and Dordrecht, before joining Fenerbahçe's staff in 2026. In November 2026, as their interim coach, he beat Liverpool 3–2 in the Champions League." Re-check his role the week it publishes.
6. "The season ended with Liverpool second on 86 points, having scored a division-leading 77 goals." Correct to my knowledge, but only the 77 goals was verified in this pass. Run a one-line check of the 2008–09 table before publishing.

## 5. Cut list

- "deflected" (Inter goal). Unsourced. Cut (see correction 1).
- "down the left" (Arsenal). Unsourced. Cut (see correction 2).
- "The career should allow room for that difficulty without reducing every performance to an explanation supplied from outside." Not a fact claim, but cut for brief handling of the father's death.
- The `## Sources` list at the foot of the body. The schema has no sources field, so attribution must stay inline.

## 6. Quotes

There are no direct quotations in quotation marks in the body. All reported speech was checked against the originals:

| Reported speech in draft | Original | Source | Verdict |
|---|---|---|---|
| Recalled the debut applause and the confidence it gave him | "received massive applause from the stands"; "gave me a big boost" | The Anfield Wrap, 30 Aug 2016, via https://lfchistory.net/articles/3996 | Fair paraphrase |
| Told UEFA he felt calm, needed to take responsibility and choose his corner; credited Reina, crowd, Benítez's tactics | "Actually I had no nerves at all"; "I just had to take my responsibility"; "I just chose a corner"; "Pepe Reina did his the job for us but so did the crowd"; Benítez "has made us tactically very strong" | https://www.uefa.com/uefachampionsleague/news/025a-0eaa42d3f04d-1be200faac8b-1000--cool-headed-kuyt-bound-for-athens/ | Fair paraphrase |
| Preferred central role but making the team work brought satisfaction | "always believed that it was the position I wanted to play"; "to make a team shape, to make a team work – that's the best feeling you can get from football" | https://www.liverpoolfc.com/news/dirk-kuyt-column-salah-and-trents-threat-gerrard-villa-and-more | Fair paraphrase |
| Voronin asked him to take the first penalty; lucky to stay on after lunge at Neville | "I'm not feeling comfortable. You take it."; "I was so lucky to not touch him. I was just an inch away." | https://www.liverpoolfc.com/news/dirk-kuyt-column-merseyside-derby-memories-thiago-form-and-mailbag | Fair paraphrase |
| Benítez praised his effort and acknowledged Reina | "His effort is amazing every game"; "Pepe was the key player in the first game" | https://www.uefa.com/uefachampionsleague/news/01d0-0e6fbd18322a-a2ab2c33069c-1000--reds-duo-earn-benitez-praise/ | Fair paraphrase |
| After six years wanted a new country and experience; moved by supporters' messages | "after six years, I just had a feeling I needed to change something in my career"; "a new experience, a new country, new people around me"; "the text messages, the phone calls, the e-mails, all the tweets ... it's also a bit emotional" | https://www.skysports.com/football/news/7796389/kuyt-humbled-by-support ; https://legacy.liverpoolfc.com/news/first-team/120412-dirk-thanks-for-your-support | Fair paraphrase |

## Note on method

The KNVB page (knvb.nl) triggered a permission request that nobody answered, so I made no further page fetches after that point. Items affected: the 2003 Dutch Cup final goal (Wikipedia only), the 2008–09 points total and "division-leading" goals (search listings only), and the build-up to the January 2012 FA Cup winner (headlines only). All are low risk, but each is marked above.

---

# Editor's note

# Edit note: Dirk Kuyt

Body: 1,254 words. Frontmatter rebuilt to the biography schema (JSON and retired History fields removed, `date` and `role` added). The repeated `#` headline and the `## Sources` list are gone.

## Cut or changed
- "deflected" (Inter) cut; now "his 85th-minute goal".
- "down the left" (Arsenal) cut; now "got past Emmanuel Eboué and Kolo Touré".
- 2003 Dutch Cup final: the goal is gone (Wikipedia only). Now just "won the Dutch Cup in 2003, beating Feyenoord in the final".
- 2008–09: kept 77 league goals and "second, four points behind Manchester United" (both confirmed). Dropped "86 points" and "division-leading" (not checked).
- Father's death: one sentence. It gives June 2007 and says he later struggled for form. No cause is given, and the draft's editorial line is gone.
- FA Cup winner v United (Jan 2012): the 88th minute and the Reina–Carroll build-up are dropped (headlines only). Now "a late winner in a 2–1 win".
- Essay lines and the closing "legacy" paragraph are cut. The piece ends on facts.

## Added (all from the fact-check)
- Born 22 July 1980, Katwijk. Fee: £9 million, per LFChistory.
- 104 caps and 24 goals (2004–14). Started the 2010 World Cup final.
- 2010 Europa League semi-final: one bare sentence (the team reached it). The fact-check gives no opponent or detail, so nothing more is added.
- Coaching: Feyenoord youth, ADO Den Haag, Beerschot, FC Dordrecht, then joined Fenerbahçe's coaching staff in June 2026. No current role and no November 2026 interim spell, as instructed.

## Quotes
Three short quotes, each verified word for word in the fact-check: Kuyt to UEFA after the Chelsea shoot-out, Voronin's words from Kuyt's column, and Benítez after Standard Liège. One more phrase comes from Kuyt's column ("the best feeling you can get from football").

## Still to check before publishing
- Arsenal is described as the quarter-final, and Standard Liège as the qualifying round. Both are general record, not separately sourced in the fact-check.

---

# Final check: Dirk Kuyt biography

Checked 10 November 2026. File: /home/claude/bios/work/dirk-kuyt/bio.md

## Verdict: PASS WITH FIXES

## Changes made

1. Intro: "won a Champions League semi-final shoot-out" → "took the winning kick in a Champions League semi-final shoot-out". The old wording gave him credit for winning the whole shoot-out. In fact Reina made the saves and Kuyt scored the deciding fourth kick (UEFA, "Penalty joy as Liverpool reach final"; liverpoolfc.com "Liverpool's greatest No.81"). I used "took" rather than "scored" so the sentence doesn't repeat "scored" three times.
2. 2009–10: "Liverpool also reached the semi-finals of the Europa League that season." → "...that season, where Atlético Madrid knocked them out." Source: Sky Sports match page "Liverpool vs Atletico Madrid; UEFA Europa League Semi-Final"; LFChistory games 5217 and 5219; Planet Football ("the Liverpool team that lost to Atletico in the 2010 Europa League semi-final").

## Items checked as requested

- Arsenal, 2 April 2008: Champions League quarter-final first leg. Correct (UEFA, "Kuyt strike gives Liverpool advantage"). The details are right: Adebayor scored, Gerrard got past Eboué and Touré, and it finished 1–1.
- Standard Liège, 2008: third qualifying round. Correct ("this third qualifying round tie at Anfield", legacy.liverpoolfc.com "2008-09: Standard Liege"). Correct too: 0–0 in Belgium, the 118-minute goal from Babel's cross, his 100th appearance.
- Fenerbahçe: the move is confirmed for June 2026. Kartal was appointed on 18 June 2026 (Turkish Minute, Sabah) and Kuyt joined as his assistant (aspor.com.tr, 24 June 2026, "Dirk Kuyt yeniden Fenerbahçe'de"; nieuws.nl "Fenerbahçe meldt komst Kuyt als assistent"; liverpoolfc.com: "hired as assistant manager to Ismail Kartal ... during the past summer"). "In June 2026 he joined the coaching staff at Fenerbahçe" stands.
- Earlier coaching: Feyenoord youth (Under-19s, ESPN), ADO Den Haag (appointed May 2022, sacked November 2022; FCUpdate, SPORTbible, Planet Sport), Beerschot (from December 2023/January 2024, dismissed 2025; Goal, Flashscore) and FC Dordrecht (appointed days after leaving Beerschot; Flashscore/Soccerway). Correct.
- Quotes, word for word:
  - Kuyt to UEFA: "Actually I had no nerves at all." / "I just had to take my responsibility." Both appear verbatim. The original reads "They had missed two penalties so I just had to take my responsibility." The quoted part is an exact substring and is set as a separate quotation, so it's acceptable (UEFA, "Cool-headed Kuyt bound for Athens").
  - Voronin, from Kuyt's LFC column: "I'm not feeling comfortable. You take it." Matches the fact-check's transcription of the column.
  - "the best feeling you can get from football": matches the column ("that's the best feeling you can get from football").
  - Benítez: "His effort is amazing every game." Matches UEFA, "Reds duo earn Benítez praise".
- Father's death: one neutral sentence, June 2007, no cause given. Correct (29 June 2007).
- 2007 derby penalties: Hyypiä own goal; the first penalty after Hibbert fouled Gerrard; the stoppage-time penalty after Neville handled; both men sent off; 2–1. Correct.
- Athens: lone forward, the 89th-minute header from Agger's flick-on, 2–1 loss, Inzaghi's two goals. Correct.
- United hat-trick, 6 March 2011, 3–1, with the three goals as described. Correct.
- 2012 League Cup final: Mason, Škrtel, Kuyt on for Carroll at 103', his goal at 108' from a rebound, Turner at 118', the shoot-out order, 3–2. Correct.
- £9m (LFChistory, given in the piece as "according to LFChistory"), 285 appearances and 71 goals, 104 caps and 24 goals, started the 2010 World Cup final. Correct.
- 2008–09: 77 league goals, second, four points behind United (86 v 90). Correct.
- historicalPeriod "2006–2012": fine as a year span, as instructed.

## Writing and format

- Frontmatter has exactly title, slug, date, historicalPeriod, decade, role and excerpt. The body starts straight after the closing ---. Ranges and scores use en dashes. There is no sources list and there are no links. The headline is in sentence case. Spelling is British throughout.
- No AI-sounding phrases or padding found. The prose is plain and factual.
- Sensitive: there is no Heysel or Hillsborough reference. The father's death is handled briefly.

## Remaining concerns

1. **Current status is incomplete (editorial decision for Denny).** The piece ends with "In June 2026 he joined the coaching staff at Fenerbahçe". It leaves out that he was Fenerbahçe's interim head coach from 30 October 2026 and that his side beat Liverpool 3–2 in the Champions League on 4 November (liverpoolfc.com; Al Jazeera). The original fact-check called that a serious omission for a Liverpool site. I haven't added it, because the brief doesn't allow new facts. Emre Belözoğlu took over as head coach for the 8 November game, and I couldn't confirm Kuyt's exact role since then. If Denny wants it in, safe wording: "where in November 2026, as interim coach, he beat Liverpool 3–2 in the Champions League." Re-check his role in the week the piece publishes.
2. The 2003 Dutch Cup final (Utrecht beat Feyenoord) is still sourced to Wikipedia alone. It's low risk and widely recorded.
3. A small point of style: the piece says he "joined" Fenerbahçe's coaching staff but never says he played there from 2012 to 2015 beyond agreeing the move. That's acceptable as written.
Coordinator addition: interim spell and the 4 November 2026 3–2 win over Liverpool, verified by the coordinator against AFP, Reuters (Flashscore) and Opta Analyst reports.
