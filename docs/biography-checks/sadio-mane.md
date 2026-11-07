# sadio-mane: fact-check and final review

Two independent checks made on 6 November 2026 before publication. The first checked the archived draft; the second checked the edited text that went to the site.

---

# Fact-check: Sadio Mané biography draft

Draft checked: `/home/claude/bios/sadio-mane.md`. Checked 6 November 2026. The earlier research record was used only for pointers. Every claim below was checked again here.

## Summary

The draft is very reliable on Liverpool facts. Every total, date, score and match detail I checked holds up: 120 goals in 269 games, 90 in 196 league games, the season totals, the six honours, and the key matches. I found no outright factual error. The problems are:

1. **It is out of date.** It stops at "September 2026". It leaves out Senegal's January 2026 Africa Cup of Nations (AFCON) final win over Morocco, which CAF later reversed and which is now waiting on a Court of Arbitration for Sport (CAS) ruling expected at the end of November 2026. It also leaves out Al Nassr's 2025–26 Saudi Pro League title.
2. **One sentence gets the order wrong.** It says the Club World Cup "completed" 2019–20. It was won in December 2019. The league title came last.
3. **A few paraphrases go slightly beyond the source:** the Krawietz playing-style paragraph, and "attempted pass" for the ball that hit Sissoko.
4. **Not a fact issue, but it will block publishing:** the frontmatter uses the retired Archive/History fields (`category`, `articleType`, `editorialMode`, `historyEras`, `playerIds`) and has no `date`. The strict `BiographySchema` described in CLAUDE.md will reject this. The body also ends with a "Sources" list and a research cut-off line, and biographies have no sources field.

## Current status (as of 6 November 2026)

- **Club:** Al Nassr (Saudi Pro League), his club since August 2023. His contract runs to 30 June 2027 (beIN Sports, FotMob). He is still playing regularly. FotMob logs him playing 76 minutes against Pakhtakor on 2 November 2026 and scoring against Al Kholood on 29 October 2026.
  - https://www.beinsports.com/en-us/soccer/fifa-world-cup-2026/articles/is-sadio-mane-retiring-from-the-senegal-national-team-2026-07-10
  - https://www.fotmob.com/en-GB/players/303339
- **Saudi Pro League champion 2025–26** with Al Nassr. He scored 10 goals and made 6 assists that season (Saudi Pro League, 10 September 2026; Wikipedia).
  - https://www.spl.com.sa/en/news/mane-hails-incredible-ballon-d-or-nod-and-says-more-rsl-stars-could-make-list
- **2026 Ballon d'Or:** he made the 30-man shortlist (Saudi Pro League, 10 September 2026). Some reports say he finished 29th. Those come only from minor outlets, so treat the ranking as unconfirmed.
- **Senegal:** he played at the 2026 World Cup. Senegal went out 3–2 after extra time to Belgium in the round of 32 (beIN Sports). Reports in July that he had retired from international football were based on a fake, AI-generated letter. L'Équipe retracted its report (beIN Sports). Patrick Vieira left him out of his first Senegal squad in September 2026 because of a "physical issue" and said he would return for the next squad (CAF, 18 September 2026; africasoccer.com, 19 September 2026). He has not retired from international football.
  - https://www.cafonline.com/afcon2025/news/vieira-names-first-senegal-squad-without-mane-as-new-era-begins/
  - https://africasoccer.com/injured-sadio-mane-will-return-for-senegals-next-camp-patrick-vieira/
- **AFCON 2025 (played January 2026):** Senegal beat hosts Morocco 1–0 after extra time on 18 January 2026 in Rabat. Mané was captain on the night and was named player of the tournament. When the team walked off in protest at a late penalty, he persuaded them to come back (AP via Ahram Online). In March 2026 CAF's Appeal Board ruled that Senegal had forfeited the match, gave Morocco a 3–0 win and named Morocco champions. Senegal appealed to CAS on 25 March. The hearing was on 8 October, and CAS says its ruling is "expected at the end of November 2026" (Al Jazeera, 17 March and 19 October 2026). **This is unresolved. The biography should not state who won until CAS rules.**
  - https://english.ahram.org.eg/NewsAFCON2025/2025/560748.aspx
  - https://www.aljazeera.com/sports/2026/3/17/caf-strips-senegal-of-afcon-title-morocco-declared-african-champions
  - https://www.aljazeera.com/sports/2026/10/19/decision-on-senegals-afcon-final-appeal-to-be-made-by-end-of-november
- **Senegal caps and goals:** the sources disagree (130/54 in beIN, 132/55 in Wikipedia, 100/53 in FotMob). The draft gives no figure, which is right. Do not add one without an official federation figure.

## Figure list

| Claim | Correct figure | Sources (URLs) | Verdict |
|---|---|---|---|
| Born in Senegal, 10 April 1992 | 10 April 1992, Sédhiou | https://www.lfchistory.net/players/1303 ; https://www.11v11.com/players/0-242743/ | Confirmed |
| Metz, then Red Bull Salzburg | Metz 2011–12; Salzburg from August 2012 | https://en.wikipedia.org/wiki/Sadio_Man%C3%A9 ; LFChistory | Confirmed |
| Austrian league and cup double, 2013–14 | Yes | Wikipedia; https://www.salzburg24.at/sport/fussball/mane-wechselte-von-red-bull-salzburg-nach-southampton-art-57225 | Confirmed (Wikipedia; Salzburg24 seen in search results only) |
| Southampton signed him in 2014 | 1 September 2014 | Wikipedia; https://www.fantasyfootballscout.co.uk/2014/09/07/scout-report-sadio-mane | Confirmed |
| Hat-trick v Aston Villa, 16 May 2015, in 2 min 56 sec, a Premier League record | 16 May 2015, 6–1, 2:56 | https://www.premierleague.com/en/news/1157009 ; https://www.skysports.com/football/news/9852411/southampton-6-1-aston-villa-sadio-mane-scores-fastest-premier-league-hat-trick (dated 17 May 2015, the day after); https://www.guinnessworldrecords.com/news/2015/5/sadio-mane-beats-robbie-fowler%E2%80%99s-fastest-premier-league-hat-trick-record-379040 | Confirmed. LFChistory's "18 May" is wrong; the draft rightly does not follow it. |
| Two goals as Southampton came from 2–0 down to beat Liverpool 3–2, March 2016 | 20 March 2016 | Premier League (above); https://www.si.com/soccer/2016/03/20/ap-soc-epl-liverpool-southampton | Confirmed |
| Joined Liverpool 28 June 2016 | 28 June 2016 | LFChistory; https://www.liverpoolfc.com/news/first-team/436991-five-years-of-sadio-mane-liverpool-s-quiet-leader | Confirmed |
| Ahead of Klopp's first full season | Yes | https://www.liverpoolfc.com/news/sadio-mane-completes-transfer-bayern-munich | Confirmed (single source: liverpoolfc.com; self-evident from dates) |
| Scored on competitive debut, 4–3 win at Arsenal | 14 August 2016 | LFChistory; https://www.liverpoolfc.com/news/liverpools-greatest-no19-sadio-mane | Confirmed |
| Stoppage-time derby winner at Goodison, December | 19 December 2016, 0–1, 94th minute | https://www.liverpoolfc.com/news/sadio-manes-top-10-moments-liverpool ; https://www.skysports.com/football/news/11661/10702618/everton-0-1-liverpool-sadio-mane-strikes-late-to-sink-toffees | Confirmed |
| Injury ended 2016–17 early; 13 league goals | 13 league (13 total) | LFChistory; Liverpool's Greatest | Confirmed |
| Liverpool Player of the Season 2016–17 | Yes (also Players' Player) | https://www.liverpoolfc.com/news/first-team/262799-sadio-mane-takes-top-prizes-at-lfc-players-awards ; https://www.goal.com/en-gb/news/sadio-mane-back-in-the-spotlight-to-win-big-at-liverpools-awards-/1t2azaaefqxf61mdtztz391r7c | Confirmed |
| Liverpool finished fourth | 4th | liverpoolfc.com (Bayern transfer article) | Confirmed (single source: liverpoolfc.com; uncontroversial) |
| Played on the right, moved left after Salah arrived in 2017 | Yes | https://www.liverpoolfc.com/news/first-team/281240-sadio-mane-there-s-more-to-come-from-incredible-mohamed-salah ; Liverpool's Greatest | Confirmed (liverpoolfc.com only; same organisation) |
| Red card at Man City, three-match ban, early 2017–18 | 9 September 2017; FA rejected the appeal | LFChistory; https://www.eurosport.co.uk/football/premier-league/2017-2018/sadio-mane-ban-upheld-after-fa-review-will-serve-three-match-ban_sto6331506/story.shtml | Confirmed |
| 10 Champions League goals in 2017–18 | 10 (20 in all competitions) | liverpoolfc.com Bayern transfer article; LFChistory season table (20 total minus 10 league) | Confirmed |
| Hat-trick in 5–0 win at Porto | 14 February 2018, last-16 first leg | https://www.si.com/soccer/2018/02/14/porto-0-5-liverpool-sadio-manes-hat-trick-inspires-reds-impressive-champions-league-win ; liverpoolfc.com top 10 moments | Confirmed |
| Scored in 3–1 Kyiv final defeat by Real Madrid | 26 May 2018 | LFChistory; liverpoolfc.com Bayern transfer article | Confirmed |
| 22 league goals 2018–19, shared Golden Boot with Salah and Aubameyang | 22 | https://www.premierleague.com/en/news/1215671 ; LFChistory | Confirmed |
| His most productive league season | 22 is his best Liverpool league total | LFChistory season table | Confirmed |
| None of his 2018–19 league goals were penalties | 0 penalties | LFChistory; https://www.nbcsports.com/soccer/news/pl-golden-boot-mane-salah-aubameyang-all-win-with-22-goals (search result only, not opened) | Confirmed (single source: LFChistory) |
| Munich, March 2019: Van Dijk long pass, beat Neuer, opener; later headed in Salah's cross; 3–1; quarter-final reached | 13 March 2019 | https://www.liverpoolfc.com/news/first-team/341445-match-report-liverpool-bayern-munich-champions-league ; https://www.uefa.com/uefachampionsleague/news/024f-0e99858103ec-4fa90ac54daa-1000--bayern-1-3-liverpool-champions-league-at-a-glance/ | Confirmed. The club report says Neuer was "drawn out of position" and Mané's left-footed finish beat Rafinha on the line. "Wrong-footed Neuer" is fair; "clipped" is loose. |
| UEFA named him man of the match | Yes | UEFA at a glance | Confirmed (single source: UEFA, the organiser) |
| Krawietz praised his defending and dribbling in the 4–0 against Barcelona; Mané did not score | Yes | https://www.liverpoolfc.com/news/first-team/436991-five-years-of-sadio-mane-liverpool-s-quiet-leader | Confirmed (single source: liverpoolfc.com interview, 28 June 2021) |
| 2019 final: Mané's ball hit Sissoko's arm, early penalty, Salah scored | Penalty given about 23 seconds in | https://www.cbssports.com/soccer/news/liverpool-vs-tottenham-penalty-awarded-23-seconds-in-on-handball-and-mo-salah-makes-spurs-pay ; LFChistory | Confirmed. Most reports call it a cross or chipped ball, not an "attempted pass" (see Corrections). |
| Both goals in 2–2 Super Cup v Chelsea, won on penalties | 14 August 2019, Istanbul; 5–4 on penalties | liverpoolfc.com top 10 moments; https://legacy.liverpoolfc.com/news/first-team/360634-liverpool-chelsea-uefa-super-cup-talking-points ; https://amp.si.com/soccer/2019/08/14/liverpool-chelsea-uefa-super-cup-video-highlights-salah-pulisic | Confirmed |
| Stoppage-time header for 2–1 comeback win at Villa, November 2019 | 2 November 2019 | liverpoolfc.com top 10 moments; https://www.si.com/soccer/2019/11/02/sadio-mane-liverpool-aston-villa-premier-league-late-win-top | Confirmed |
| 18 league goals 2019–20; 30-year wait ended | 18 (22 in all competitions); last title before was 1989–90 | LFChistory | Confirmed |
| Club World Cup "completed" a three-trophy season | Three trophies is right (Super Cup, Club World Cup, Premier League), but the Club World Cup came in December 2019, before the title | LFChistory honours | Corrected (order of events) |
| 2020–21: 11 league goals | 11 (16 in all competitions) | LFChistory | Confirmed |
| Both goals in final-day win over Crystal Palace; third place | 23 May 2021, 2–0 | https://www.skysports.com/football/news/11661/12314671/liverpool-2-0-crystal-palace-sadio-mane-doubel-seals-champions-league-qualification ; liverpoolfc.com Bayern transfer article | Confirmed |
| Moved to a central role in 2021–22 | Yes | Liverpool's Greatest; liverpoolfc.com Bayern transfer article | Confirmed (liverpoolfc.com only) |
| FA Cup semi v City: pressured Steffen and scored; then a volley before half-time; won 3–2 | 16 April 2022; goals about 17' and 45'; 3–0 at half-time | https://www.liverpoolfc.com/news/liverpool-reach-fa-cup-final-3-2-win-over-man-city-wembley ; https://www.skysports.com/football/news/33694/12589928/manchester-city-2-3-liverpool-sadio-mane-scores-twice-as-reds-edge-title-rivals-to-reach-fa-cup-final | Confirmed |
| 23 goals in all competitions in 2021–22; League Cup and FA Cup | 23 (16 league) | LFChistory; Liverpool's Greatest | Confirmed |
| Reached the Champions League final and narrowly missed the league title | Lost the final 1–0; finished second by one point | LFChistory; common record | Confirmed |
| Last appearance: European final v Real Madrid, 28 May 2022 | 28 May 2022 | LFChistory | Confirmed (single source: LFChistory; date of the final is beyond dispute) |
| Transfer to Bayern completed 22 June 2022 | 22 June 2022 | LFChistory; https://www.liverpoolfc.com/news/sadio-mane-completes-transfer-bayern-munich | Confirmed |
| AFCON final v Egypt, February 2022: penalty saved, then scored the winning shoot-out kick; Senegal's first title | 6 February 2022; 0–0, 4–2 on penalties | https://www.fourfourtwo.com/news/senegal-win-africa-cup-of-nations-as-sadio-mane-shrugs-off-early-penalty-miss-1644186345000 ; https://thenationalnews.com/sport/football/2022/02/06/sadio-mane-spot-on-as-senegal-win-afcon-title-after-epic-final-against-egypt ; CAF (draft source) | Confirmed. "First time" is still true. Do not write "only" title while the 2025 final is before CAS. |
| Bayern: 12 goals in 38 competitive games; Bundesliga and German Super Cup | 12 in 38 | https://fcbayern.com/de/news/2023/08/sadio-mane-wechselt-vom-fc-bayern-zu-al-nassr | Confirmed (single source: FC Bayern) |
| Injury ruled him out of the 2022 World Cup | Fibula injury, November 2022 | FC Bayern; https://www.aljazeera.com/sports/2022/11/17/senegal-star-sadio-mane-ruled-out-of-world-cup-with-leg-injury | Confirmed |
| Joined Al Nassr, August 2023 | Announced 1 August 2023 | FC Bayern; https://extratime.com/articles/31550/sadio-mané-shifts-to-al-nassr-after-a-brief-spell-bayern | Confirmed |
| Still with Al Nassr | Yes, as of November 2026; contract to June 2027 | FotMob; beIN Sports; Saudi Pro League | Confirmed. The draft's wording needs updating. |
| 120 goals in 269 games; 90 in 196 league games | 120/269; 90/196 | LFChistory; liverpoolfc.com Bayern transfer article (269/120) | Confirmed |
| Six major honours | Premier League, Champions League, Super Cup, Club World Cup, FA Cup, League Cup | LFChistory; liverpoolfc.com | Confirmed |

## Corrections

1. **Order of events in 2019–20.** The draft says: "The Club World Cup completed a season in which they won three trophies." The Club World Cup was won in December 2019. The Premier League title was clinched in June 2020 and was the last of the three. The count of three is right; the word "completed" is wrong.
2. **The ball that hit Sissoko.** The draft says "Mané's attempted pass struck Moussa Sissoko's arm". Reports describe it as a cross or chipped ball into the box (CBS Sports, LFChistory). This is minor, but "cross" is the standard description.
3. **The Krawietz playing-style paragraph overstates the source.** The draft attributes to Krawietz "ability to combine speed with strength" and finishing "with either foot". His recorded words are "his speed, left or right, his finishing" and "he is of course not the tallest player but he is one of the strongest in the air". "Left or right" may mean either flank rather than either foot. He did not say "combine speed with strength". Bring the paraphrase back to what he said (see Quotes).
4. **Current-status line is out of date.** The draft says "remained with the Saudi club at this biography's research cut-off in September 2026". It is still true, but it should be updated to November 2026. It also leaves out his 2025–26 Saudi Pro League title.
5. **Wrong frontmatter for a biography (publishing blocker, not a fact error).** The draft uses `category`, `articleType`, `editorialMode`, `historyEras` and `playerIds`, and has no `date`. Under CLAUDE.md, biographies need `title`, `slug`, `date`, `historicalPeriod`, `decade`, `excerpt` and an optional `role`. The body's "Sources" list and research cut-off line also do not fit this format, because attribution stays inline. `decade: "2010s"` is a fair choice for 2016–2022. The excerpt ("Sadio Mané's Liverpool career.") is a placeholder.

## Cut list

- "His work also helped Liverpool recover possession, allowing the attack to begin again before opponents could settle." No source says this about Mané specifically. The earlier record admits it is an editorial inference. Keep it only as clearly labelled opinion, or cut it.
- "It was a coach's assessment, grounded in the work around the goals scored by others." This is commentary, not fact. It is harmless, but it is unsourced.
- Source list entry "Liverpool's Greatest ... 28 June 2026": the article exists, but I could not confirm its publication date (the page shows only "4 months ago"). Drop the date, or check it on the live site.

## Quotes

The draft has no direct quotations. It has two attributed paraphrases:

- **Mané, November 2017** (draft: offering a passing option, attacking directly, defending, moving the ball quickly). Verified wording on liverpoolfc.com: "It doesn't matter to me which position I have to be in because I have played in all the attacking roles" and "My job is the same wherever I am on the pitch - I have to always be an option, to be aggressive and direct". The defending and quick-passing parts are in the article's summary of his comments, but I could not retrieve them word for word. The page gives no date or original publisher; the earlier record says the remarks came from Goal.com. Verdict: paraphrase acceptable for "an option, aggressive and direct". Soften or confirm the defending and ball-movement parts. Do not present any of it as a direct quote without the original Goal interview.
  - https://www.liverpoolfc.com/news/first-team/281240-sadio-mane-there-s-more-to-come-from-incredible-mohamed-salah
- **Peter Krawietz, 28 June 2021.** Verified wording: "Positioning, readiness, attitude: there are no numbers where you can measure this"; "whatever you want from him he is able to learn very, very, very quick"; "his speed, left or right, his finishing"; "he is one of the strongest in the air". On Barcelona: "in our famous 4-0 win against Barcelona in the Champions League semi-final Sadio didn't score"; "the most unbelievable player on the pitch was Sadio Mane"; "He defended everything and he was dribbling with the ball, he was the value of two players in one." The Barcelona paraphrase is accurate. The playing-style paraphrase needs tightening (Correction 3). Any of these lines could be quoted directly.
  - https://www.liverpoolfc.com/news/first-team/436991-five-years-of-sadio-mane-liverpool-s-quiet-leader

## Useful facts the draft is missing

1. **AFCON 2025 (January 2026):** Mané captained Senegal to a 1–0 extra-time win over Morocco, persuaded his team-mates to return after their walk-off, and was named player of the tournament. CAF later gave the title to Morocco, and a CAS ruling is due at the end of November 2026. Only mention it with the dispute clearly stated. (AP via Ahram Online; Al Jazeera, both linked above.)
2. **Saudi Pro League champion with Al Nassr, 2025–26** (Saudi Pro League; Wikipedia).
3. **On the 30-man 2026 Ballon d'Or shortlist** (Saudi Pro League, 10 September 2026).
4. **Signing fee:** LFChistory gives £30m. Wikipedia gives £34m, possibly rising to £36m. The draft is right to leave it out unless a firm figure is wanted.
   - https://www.lfchistory.net/players/1303
5. **Individual honours:** African Footballer of the Year 2019 and PFA Team of the Year four times: 2017, 2019, 2020 and 2022 (LFChistory).

## Heysel/Hillsborough

None.

---

# Final review: Sadio Mané biography

File reviewed: `/home/claude/the-liverpool-brief/content/biographies/sadio-mane.md`. Reviewed 6 November 2026.

**Verdict: Publish with these fixes.**

The Liverpool facts hold up. The earlier report's corrections have all been made: the Club World Cup order, "cross" for the Sissoko handball, the Krawietz paraphrase, the up-to-date status and the frontmatter. I re-checked the single-source items and the details the editor added: the AFCON 2025 final and CAS timing, the Ballon d'Or shortlist, the Al Nassr title, Bayern's 12 in 38, the 10 European goals in 2017–18, UEFA's man of the match in Munich, and the Krawietz quotes. All of them are confirmed. There is one real error, the start of the 2019–20 season, and one date I could not confirm.

## Errors

1. **"The next season began with both of Liverpool's goals in the 2–2 draw with Chelsea in the Super Cup in Istanbul, which Liverpool won on penalties."**
   This is wrong. Liverpool's 2019–20 season began with the Community Shield against Manchester City on 4 August 2019 (1–1, lost on penalties). The league opener against Norwich followed on 9 August. The Super Cup was played on 14 August. The sentence also reads as though the season itself scored the goals.
   Fix: "In August 2019 he scored both of Liverpool's goals in the 2–2 draw with Chelsea in the Super Cup in Istanbul, which Liverpool won on penalties."
   Sources: https://www.eurosport.com/football/community-shield/2019-2020/football-news-manchester-city-lift-community-shield-for-successive-seasons-with-shoot-out-victory_sto7396369/story.shtml ; https://wikipedia.com/wiki/2019%E2%80%9320_Liverpool_F.C._season

## Unverifiable claims

1. **"He said in November 2017 that his job was the same wherever he played..."** The words are confirmed on liverpoolfc.com: "My job is the same wherever I am on the pitch - I have to always be an option, to be aggressive and direct". But the page has no date, and its internal clue ("16 months at the club") points only to late 2017. I could not find the original Goal interview to fix the month.
   Suggest: "He said during his second season that his job was the same wherever he played..."
   (https://www.liverpoolfc.com/news/first-team/281240-sadio-mane-there-s-more-to-come-from-incredible-mohamed-salah)
2. **"Jürgen Klopp's staff talked as much about what he did without the ball."** Also in the excerpt: "Klopp's staff valued him just as much for the work he did without the ball." The only source is one member of staff, Krawietz, in one interview. "Klopp's staff" and "as much" both go beyond that.
   Suggest for the body: "Peter Krawietz, Klopp's assistant, rated what he did without the ball just as highly." For the excerpt: "Klopp's assistant rated him just as highly for his work without the ball."
3. **"...and his role never shrank."** This is an opinion with no source behind it, and it is vague. Cut it (see Reading fixes).

Confirmed details the editor added (no action needed): St Mary's as the venue on 20 March 2016. The AFCON 2025 final in Rabat on 18 January 2026: 1–0 after extra time, Mané led the side while the captain Koulibaly was suspended, he called the team back after the walk-off over a stoppage-time penalty, and he was named best player (AP via Ahram Online, Fox Sports/AP, Irish Times). The CAF Appeal Board forfeit in March and the CAS award "expected at the end of November 2026" (Al Jazeera, 19 October 2026). The 30-man Ballon d'Or shortlist and the 2025–26 title (spl.com.sa). The Bayern record of 12 in 38 (theScore, FC Bayern). The ten Champions League goals in 2017–18 (UEFA). UEFA's man of the match in Munich (UEFA). The Krawietz quotes, word for word (liverpoolfc.com, 2021).

Heysel/Hillsborough: none.

## Reading fixes

1. "Liverpool found out about him first-hand on 20 March 2016." → "On 20 March 2016 he hurt Liverpool directly." The original suggests a first meeting. He had already played against them, and he scored the opening goal in Southampton's 6–1 League Cup defeat by Liverpool in December 2015.
2. "Injury ended his season early, but he had 13 league goals by then, and he won the club's Player of the Season award as Liverpool finished fourth." → "Injury ended his season early, but he had already scored 13 league goals. He was voted the club's Player of the Season, and Liverpool finished fourth." This splits one long sentence into two shorter ones.
3. "But in Europe he scored ten goals, including a hat-trick in the 5–0 win at Porto in February, and he scored Liverpool's goal in the 3–1 defeat by Real Madrid in the final in Kyiv." → "In the Champions League he scored ten goals, including a hat-trick in the 5–0 win at Porto in February and Liverpool's goal in the 3–1 defeat by Real Madrid in the final in Kyiv." This names the competition and removes the repeated "he scored".
4. "The night in Munich on 13 March 2019 showed what he could do." → "In Munich on 13 March 2019 he scored twice." The original is a stock phrase.
5. "Liverpool had been losing until the 87th minute." → "Liverpool had been behind until Andy Robertson equalised in the 87th minute." This is clearer, and it credits the scorer.
6. "Krawietz listed the qualities that made him so useful: his positioning, readiness and attitude, his speed, his finishing, and the speed with which he learned." → "Krawietz listed his positioning, readiness and attitude, his pace, his finishing and how quickly he learned." This avoids "speed... speed" and drops "so useful".
7. "The title defence of 2020–21 was disrupted by injuries, and Mané's league total fell to 11." → "Injuries across the squad disrupted the 2020–21 title defence, and Mané's league total fell to 11." The original could be read as Mané's own injuries.
8. "The FA Cup semi-final against Manchester City at Wembley on 16 April showed both sides of his game." → "The FA Cup semi-final against Manchester City at Wembley on 16 April showed both sides of his game: the pressing and the finishing." This makes the vague "both sides" concrete, or the sentence can be cut.
9. "He captained Senegal in the final of the next tournament, against the hosts, Morocco, in Rabat on 18 January 2026." → "He captained Senegal in the next final, against the hosts, Morocco, in Rabat on 18 January 2026, with Kalidou Koulibaly suspended." This is tighter and explains why he had the armband.
10. "At Liverpool he played on the right, on the left and through the middle, and his role never shrank. He was a goalscorer who also won the ball back." → "At Liverpool he played on the right, on the left and through the middle. Wherever he played, he scored goals and won the ball back." This cuts the unsupported claim and ends on the headline's idea.

Headline is sentence case and fine. Attribution is inline, and there is no sources list.
