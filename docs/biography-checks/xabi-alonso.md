# xabi-alonso: checks before publication

Draft by GPT (branch editorial/next-ten-biographies-batch-four-2026-10-03). Checked on 10 November 2026 by three fresh agents: fact-check of the draft, edit, then an independent final check of the edited text.

---

# Fact-check: Xabi Alonso biography (draft: /home/claude/bios/gpt/xabi-alonso.md)

Checked 10 November 2026.

## Sensitive events flag

- **Heysel:** not mentioned.
- **Hillsborough disaster:** not mentioned.
- **Deaths / illness:** none.
- **Personal / family matter:** the closing section names that his son was born in Liverpool in 2008 (the son is not named in the draft). It is sourced from Alonso's own public interview and is harmless, but it concerns a minor family member. Denny's call whether to keep it.

## 1. Summary

The draft is reliable on the match facts. The debut, the Fulham comeback, the Lampard injury, Turin, Istanbul, Luton, Newcastle, the 2006 FA Cup final, Athens, Stamford Bridge 2008, the season figures and the Madrid move all check out against LFChistory, UEFA, the FA and contemporary reports. The weak points are three. One unsourced claim about the 2008 Barry episode. The ending, which stops his coaching story in 2022 and leaves out that he is now a leading manager (Chelsea head coach as of today). And frontmatter that does not match the site's Biography schema. There are no direct quotations in the body. All reported speech was checked against the original interviews.

Errors and issues:
1. **Unsourced:** "He also credited Benítez with honouring the subsequent promise to select him if his performances merited it." No source found. Cut it.
2. **Current status missing / outdated:** the piece ends his post-playing story with Real Sociedad B "by 2022". Today he is Chelsea head coach (appointed May 2026, started 1 July 2026). Before that he managed Bayer Leverkusen (2022–25, Bundesliga champions 2023–24) and Real Madrid (summer 2025 to 12 January 2026).
3. **Imprecise date:** the Real Sociedad B promotion came in his second season, 2020–21 (promotion to the second division, the first since 1962). "By 2022" is not wrong, but "in 2021" is the accurate wording.
4. **Fee wording:** £10.7m is the LFChistory and SI figure. The Irish Times (2005) gave £10.5m. Safer: "a reported £10.7 million".
5. **Source attribution (2008 sale talks):** the draft's source list credits The Anfield Wrap. I could not open that page (the fetch was not permitted). The comments I could verify come from Alonso's 2017 Liverpool Echo interview (reported by Empire of the Kop), from *Ring of Fire* (Guardian extract, 2016) and from a 2011 interview (Fox Sports). The paraphrase itself is supported. Only the attribution is unverified.
6. **Schema (not a fact error, but it will fail or mis-render):** the frontmatter is JSON with retired fields (`category`, `articleType`, `editorialMode`, `historyEras`, `playerIds`). It has no `date`, and `historicalPeriod` reads "Liverpool player, 2004–2009" when the BiographySchema wants years ("2004–2009"). "Liverpool player" belongs in the optional `role`. This needs reformatting to `BiographySchema` before publishing.
7. **Minor:** the first Luton goal is called "a dipping shot". The sources say only "from 40 yards" (FA). This is harmless, but "from 40 yards" is the sourced wording.

## 2. Current status (as of 10 November 2026)

**Alive. Head coach of Chelsea.**
- Chelsea appointed him on a four-year deal, announced on 17 May 2026, starting 1 July 2026 (Al Jazeera, Business Day).
- He is still in charge now. His press conference before the Tottenham game was around 23 October 2026 (chelseafc.com). On 8 November 2026 he spoke as Chelsea manager after the 1–0 defeat at Sunderland in Gameweek 10 (Sports Mole).
- Real Madrid dismissed him on 12 January 2026 after the Supercopa final defeat by Barcelona. Álvaro Arbeloa replaced him (CBS Sports, ESPN).
- At Bayer Leverkusen (2022–25) he won the club's first Bundesliga title in 2023–24 and reached the 2024 Europa League final (CBS Sports).

Sources:
- https://www.aljazeera.com/sports/2026/5/17/chelsea-appoint-xabi-alonso-as-new-manager-premier-league-club-says
- https://www.businessday.co.za/sport/soccer/2026-05-17-chelsea-appoint-xabi-alonso-as-manager-seeking-stability-after-turbulence/
- https://www.chelseafc.com/en/video/alonso-press-conference-pre-tottenham-h-epl-2026-27
- https://www.sportsmole.co.uk/football/chelsea/news/it-wasnt-the-best-one-alonso-furious-with-chelsea-display-in-sunderland-defeat_608744.html
- https://www.cbssports.com/soccer/news/real-madrid-fire-xabi-alonso-barcelona-defeat-alvaro-arbeloa-head-coach/
- https://global.espn.com/football/story/_/id/47590541/real-madrid-end-coaching-contract-xabi-alonso-mutual-agreement

## 3. Figure list

| Claim | Correct figure | Sources (URLs) | Verdict |
|---|---|---|---|
| Born Tolosa, 25 November 1981 | 25 November 1981, Tolosa | https://www.lfchistory.net/players/900 ; https://socccer-legends.blogspot.com/2010/01/xabier-xabi-alonso-olano-born-25.html (weak) | Confirmed (single source: LFChistory) |
| Son of former Spain international Periko Alonso | Periko played for Spain, including the 1982 World Cup | https://www.skysports.com/football/news/2275969/real-sociedad-one-to-watch-xabi-alonso ; https://www.laliga.com/en-FR/news/world-cup-in-the-blood-periko-and-xabi-alonso | Confirmed (2+) |
| Loan at Eibar, recalled by Toshack, who made him captain | Eibar loan, first half of 2000–01; Toshack recalled him and made him captain (at 19) | https://thesefootballtimes.co/2019/11/25/a-z-of-the-2000s-xabi-alonso/ ; https://www.chelseafc.com/en/news/article/how-real-sociedad-shaped-xabi-alonsos-career | Confirmed (2+) |
| Sociedad second in 2002–03 | Second, two points behind Real Madrid | https://www.chelseafc.com/en/news/article/how-real-sociedad-shaped-xabi-alonsos-career ; https://thesefootballtimes.co/2019/11/25/a-z-of-the-2000s-xabi-alonso/ | Confirmed (2+) |
| Played at Euro 2004 | Started v Portugal (did not play v Greece) | https://www.soccer-spain.com/ssdocs/euro2004/reports/report3.html ; https://www.11v11.com/matches/greece-v-spain-16-june-2004-253201/ | Confirmed |
| Signed from Real Sociedad 20 August 2004, aged 22 | 20 August 2004 (aged 22) | https://www.lfchistory.net/players/900 ; https://www.si.com/soccer/2019/08/20/xabi-alonso-generational-talent-who-inspired-liverpool-champions-league-glory | Confirmed (2+) |
| Fee £10.7m | £10.7m (LFChistory, SI); £10.5m (Irish Times 2005) | as above ; https://www.irishtimes.com/sport/liverpool-signings-the-spanish-influence-1.405927 | Confirmed, sources differ: use "a reported £10.7 million" |
| Luis García joined in the same period | Same window (from Barcelona, about £6m) | https://www.irishtimes.com/sport/liverpool-signings-the-spanish-influence-1.405927 ; UEFA link in draft | Confirmed |
| Wore No.14 | No.14 on debut | https://www.lfchistory.net/games/4868 | Confirmed (single source: LFChistory) |
| Debut: 1–0 defeat at Bolton, 29 August 2004 | Bolton 1–0 Liverpool, Reebok Stadium, 29 August 2004 | https://www.lfchistory.net/games/4868 ; https://www.lfchistory.net/players/900 | Confirmed (single source: LFChistory) |
| Fulham 16 Oct 2004: 2–0 down at half-time, on for Diao at the break, won 4–2, deflected free-kick for first goal after the deficit was wiped out | Boa Morte 24', 30'; Knight og 50', Baroš 71', Alonso 79' (deflected free-kick), Bišćan 90'; Alonso on for Diao 46' | https://www.11v11.com/matches/fulham-v-liverpool-16-october-2004-26013/ ; https://legacy.liverpoolfc.com/news/first-team/172368-how-it-all-began-for-xabi-10-years-ago | Confirmed (2+) |
| Ankle broken by Lampard challenge, New Year's Day 2005; Chelsea won 1–0 | 1 January 2005, Anfield, 0–1 (Joe Cole 80'); Alonso off 27'; first estimate five to six weeks | https://www.lfchistory.net/SeasonArchive/Game/4885 ; https://www.uefa.com/uefachampionsleague/news/01a5-0ea6de1cfa16-cd81cda31eea-1000--alonso-out-for-liverpool/ | Confirmed (2+) |
| First start after injury: 13 April 2005 at Juventus; 2–1 first-leg lead; Gerrard absent; Bišćan partner; 0–0; pass to Baroš | All confirmed (Gerrard out with a groin injury; Baroš shot wide) | https://www.uefa.com/uefachampionsleague/news/01a8-0ea7aa7d47bd-a526d0492e9d-1000--liverpool-topple-turin-giants/ | Confirmed (single source: UEFA) |
| Suspended for the Chelsea semi-final second leg | Booked late in the 0–0 first leg (Gudjohnsen incident), third booking of the competition | https://www.skysports.com/football/news/2333711/alonso-reveals-booking-agony ; https://fourfourtwo.com/news/suspended-alonso-slams-unfair-card-rule | Confirmed (2+) |
| Istanbul: 3–0 at half-time; Hamann on at the interval; Gerrard header, Šmicer long shot; Gerrard won the penalty; Dida saved Alonso's kick; Alonso beat Nesta to the rebound; won on penalties | Maldini 1', Crespo 39', 44'; Gerrard 54', Šmicer 56', Alonso about 59–60'; Hamann on for Finnan 46'; Gattuso fouled Gerrard; 3–2 on penalties | https://www.uefa.com/uefachampionsleague/news/01e8-0e7502f7f2cb-2ca1e01eea38-1000--2004-05-ac-milan-3-3-liverpool-fc-2-3-on-pens-report/ ; https://www.lfchistory.net/SeasonArchive/Game/4928 | Confirmed (2+) |
| 2004–05 apps | 32 apps, 3 goals | https://www.lfchistory.net/players/900 | Confirmed (single source: LFChistory) |
| UEFA Super Cup 2005 | Won (one Super Cup app) | https://www.lfchistory.net/players/900 | Confirmed (single source: LFChistory) |
| 2006 FA Cup final: Alonso cross, Crouch headed down, Gerrard scored Liverpool's second; 3–3; won the shoot-out | 13 May 2006; Gerrard 54' from Crouch's knock-down of Alonso's cross; won 3–1 on penalties | https://www.uefa.com/news-media/news/01b5-0f8488e8fc90-675d6abd574b-1000--liverpool-prevail-in-cup-classic/ | Confirmed (single source: UEFA). Widely corroborated |
| Luton 3–5 Liverpool: 3–1 down, Alonso levels from distance, then a left-footed goal from his own half with the keeper up | 7 January 2006, FA Cup third round: Gerrard 1–0; Howard, Robinson, Nicholls (pen) 3–1; Sinama-Pongolle 3–2; Alonso 40 yds 3–3; Sinama-Pongolle 3–4; Alonso about 70 yds, left foot, Beresford upfield, 3–5 | https://www.thefa.com/news/2016/Jan/04/third-round-classic-goals-xabi-alonso-040116 ; https://hattersheritage.co.uk/matches/luton-town-fc-vs-liverpool-7-jan-2006 | Confirmed (2+) |
| Newcastle at Anfield, September 2006: won ball from N'Zogbia, right foot, Harper slipped, won 2–0 | 20 September 2006 (2006–07 season); Kuyt 29', Alonso 79'; tackle on N'Zogbia and right foot from LFC only (NUFC confirms N'Zogbia was on from 68') | https://legacy.liverpoolfc.com/news/first-team/287586-2-xabi-alonso-v-newcastle-sep-2006 ; https://www.irishtimes.com/sport/wonder-strike-by-alonso-ignites-liverpool-s-season-1.1005461 ; https://www.nufc.com/html/2006-07html/2006-09-20liverpool-a.html | Confirmed (2+). N'Zogbia and right foot: single source, LFC |
| Athens 2007: Milan won 2–1; Alonso's foul on Kaká led to the free-kick for Inzaghi's opener | Pirlo free-kick deflected in off Inzaghi 45'; Inzaghi 82', Kuyt 89' | https://www.uefa.com/uefachampionsleague/news/01c1-0e6e500c2c66-db2412e7ba39-1000--inzaghi-inspires-milan-to-glory/ ; https://en.wikipedia.org/wiki/2007_UEFA_Champions_League_final | Confirmed (2+) |
| 2007–08: 27 appearances | 27 apps, 2 goals (19 league) | https://www.lfchistory.net/players/900 | Confirmed (single source: LFChistory) |
| 2008 CL semi-final defeat by Chelsea | Lost to Chelsea | UEFA link in draft (not re-fetched) | Confirmed (common knowledge, UEFA) |
| 2008: Benítez pursued Barry; Alonso told he might be sold; Barry didn't come | Confirmed | https://www.lfchistory.net/players/900 ; https://www.foxsports.com/stories/soccer/alonso-explains-liverpool-exit ; https://www.football-espana.net/2016/09/03/alonso-rafa-wanted-me-out-but | Confirmed (2+) |
| Benítez honoured a promise to select him if performances merited | Not found in any source | — | Unsourced: cut |
| Chelsea 0–1 Liverpool, 26 October 2008: deflection off Bosingwa, wrong-footed Čech, ended the 86-match unbeaten home league run, free-kick hit the post, three points clear | All confirmed (10th minute; level on points with Hull before, three clear of Chelsea and Hull after) | https://www.uefa.com/news-media/news/01d2-0e70325d4c0a-094526dfd1e9-1000--alonso-and-liverpool-conquer-stamford-bridge/ ; https://www.skysports.com/football/chelsea-vs-liverpool/report/6843 | Confirmed (2+) |
| 2008–09: 47 apps, 5 goals, 33 league apps | 47 apps, 5 goals; 33 league apps, 4 league goals | https://www.lfchistory.net/players/900 | Confirmed (single source: LFChistory) |
| Liverpool second with 86 points, four behind United | United 90, Liverpool 86 | https://www.lfchistory.net/season-archive/league-table/118 | Confirmed (single source: LFChistory) |
| Liverpool totals: 210 apps, 19 goals | 210 apps, 19 goals (PL 143/15, CL 47/2, FAC 12/2) | https://www.lfchistory.net/players/900 | Confirmed (single source: LFChistory) |
| Madrid transfer completed 5 August 2009 | 5 August 2009; fee undisclosed, about €35m (UEFA) / about £30m (LFChistory). The draft gives no fee | https://www.uefa.com/uefachampionsleague/news/01dc-0e728e0bc349-5741e44e3c93-1000--alonso-makes-madrid-move/ ; https://www.lfchistory.net/players/900 | Confirmed (2+) |
| Won La Liga and another Champions League with Madrid | La Liga 2011–12; Champions League 2014 | https://fcbayern.com/en/news/2017/05/gracias-xabi ; https://legacy.liverpoolfc.com/news/announcements/263969-xabi-alonso-plays-final-game-of-his-glittering-career | Confirmed (2+) |
| Joined Bayern in 2014; three Bundesliga titles | Late August 2014; Bundesliga 2015, 2016, 2017 | as above | Confirmed (2+) |
| Spain: Euro 2008, World Cup 2010, Euro 2012 | Confirmed; 114 caps | as above ; https://www.laliga.com/en-FR/news/world-cup-in-the-blood-periko-and-xabi-alonso | Confirmed (2+) |
| Retired from playing, May 2017 | Last game 20 May 2017, Bayern 4–1 Freiburg | as above | Confirmed (2+) |
| Son born in Liverpool in 2008 | Jontxu, born 11 March 2008 in Liverpool | https://legacy.liverpoolfc.com/news/media-watch/257888-xabi-alonso-my-close-bond-with-liverpool-will-never-be-forgotten ; https://www.tunota.com/entretenimiento/xabi-alonso-hijos-quienes-son-cuantos-anos-tienen-a-que-se-dedican-2024-04-12 | Confirmed (2+) |
| Charity appearances at Anfield later | LFC Legends games 2022 (v Man Utd; v Bayern, September 2022) | https://www.liverpoolfc.com/news/announcements/455562-xabi-alonso-joins-lfc-legends-squad-for-man-utd-game ; https://www.90min.com/posts/xabi-alonso-reveals-role-convincing-thiago-join-liverpool | Confirmed (2+) |
| By 2022 coached Real Sociedad B to promotion | Promoted to the second division in 2021 (his second season), the first time since 1962 | https://www.chelseafc.com/en/news/article/how-real-sociedad-shaped-xabi-alonsos-career | Confirmed (single source); better worded "in 2021" |
| Current role | Chelsea head coach since 1 July 2026 | see Current status | Missing from draft |

## 4. Corrections

1. "He also credited Benítez with honouring the subsequent promise to select him if his performances merited it."
   → **Cut.** If a bridge is needed: "He accepted the decision as the manager's to make, and when Barry did not arrive he stayed and played."

2. "By 2022 he had also coached Real Sociedad's reserve side to promotion, reflecting on the different demands of preparing young players rather than taking the field himself."
   → "In 2021 he led Real Sociedad's reserve side to promotion to Spain's second division. He went on to manage Bayer Leverkusen, winning the club's first Bundesliga title in 2023–24, had a brief spell in charge of Real Madrid, and in July 2026 became Chelsea's head coach." (Drop "reflecting on the different demands…" unless the LFC interview is re-checked; that page would not load.)

3. "Liverpool paid £10.7 million for him."
   → "Liverpool paid a reported £10.7 million for him."

4. "His first goal levelled the scores with a dipping shot from distance."
   → "His first goal levelled the scores with a shot from 40 yards."

5. The source list entry "The Anfield Wrap — Alonso on the 2008 sale discussions…" could not be verified. Replace it, or add the Liverpool Echo 2017 interview, *Ring of Fire* (Guardian extract) or the Fox Sports 2011 interview, which support the paraphrase.

6. Frontmatter: rebuild it to `BiographySchema`: `title`, `slug`, `date`, `historicalPeriod: "2004–2009"`, `decade: "2000s"`, `excerpt`, optional `role: "Liverpool midfielder"`. Remove `category`, `articleType`, `editorialMode`, `historyEras`, `playerIds`.

## 5. Cut list

- The Benítez "promise to select him if his performances merited it" claim (no source found).
- "reflecting on the different demands of preparing young players rather than taking the field himself" (couldn't verify; the LFC page would not load).

## 6. Quotes

The body contains **no direct quotations**. Reported speech checked:

| Reported claim | Verdict | Source |
|---|---|---|
| 2017: Liverpool was his first experience of living away from his parents and outside his familiar surroundings; linked with becoming an adult | Supported. Alonso, Sky Sports, 10 March 2017: "it was my first experience of living on my own and of living somewhere which wasn't my home town… Until that moment I was living with my parents…"; "It was when I became an adult…" | https://www.skysports.com/football/news/11095/10797110/xabi-alonso-playing-for-liverpool-was-so-special-to-me ; https://www.sportsmole.co.uk/football/liverpool/news/alonso-liverpool-made-me-into-a-man_293529.html |
| 2008: told he might be sold; reassessed his position; respected the manager's decision | Supported. "I wasn't expecting the manager to say I could be sold"; "my position in the team changed, a little bit that summer"; "Of course, Rafa, I accept this. You are the one that has made the decision." (Liverpool Echo 2017 via Empire of the Kop); "Rafa came to me and was very clear…" (*Ring of Fire*) | https://www.empireofthekop.com/2017/03/24/alonsos-comments-now-on-benitezs-gareth-barry-blunder-are-so-impressive/ ; https://www.football-espana.net/2016/09/03/alonso-rafa-wanted-me-out-but |
| Benítez honoured a promise to pick him | **Not found.** Cut | — |
| 2009 contemporary explanation: a fresh challenge | Supported. "I thought it was the right moment to find a fresh challenge." (UEFA, 5 August 2009) | https://www.uefa.com/uefachampionsleague/news/01dc-0e728e0bc349-5741e44e3c93-1000--alonso-makes-madrid-move/ |
| Gerrard's retirement tribute: the pleasure of playing alongside him and the loss when he left | Supported in substance. "The best passer of a ball I've ever played with." "I couldn't ask for a better midfield partner." "When you left, it broke my heart." | https://legacy.liverpoolfc.com/news/announcements/263969-xabi-alonso-plays-final-game-of-his-glittering-career |
| 2017: friends in the city; returning with his son, born there in 2008 | Supported. "I stay in contact with friends I have in Liverpool." "He's Liverpool born…" (Liverpool Echo, spring 2017, reproduced by LFC) | https://legacy.liverpoolfc.com/news/media-watch/257888-xabi-alonso-my-close-bond-with-liverpool-will-never-be-forgotten |

---

# Editor's note

# Edit note: Xabi Alonso

Body: about 1,100 words. Frontmatter rebuilt to BiographySchema: title, slug, date 2026-11-10, historicalPeriod "2004–2009", decade "2000s", role "Midfielder", excerpt. The retired fields (category, articleType, editorialMode, historyEras, playerIds) and the sources list are gone.

Applied as instructed:
- Cut the Benítez "promise to select him" claim. Replaced it with the fact-check's bridge: he accepted the decision as the manager's, Barry did not arrive, and he stayed.
- Fee now reads "a reported £10.7 million".
- Real Sociedad B promotion is now "in 2021", to Spain's second division.
- The 2008 sale talks are credited to the Liverpool Echo (2017), *Ring of Fire* and Fox Sports (2011). The Anfield Wrap is not mentioned.
- "Dipping" is cut. The Luton equaliser is "a shot from 40 yards".
- Cut the line about his son born in Liverpool.
- Replaced the ending with a plain management line: Real Sociedad B (promotion 2021), Bayer Leverkusen 2022–25 (Bundesliga 2023–24, the club's first), Real Madrid (2025, left January 2026), "was appointed Chelsea head coach in 2026".

Other cuts and changes:
- Cut the draft's essay passages: the "intelligence" and "window into his ability" commentary, the closing moral, and "reflecting on the different demands…" (it was on the cut list).
- Added only figures from the fact-check: scorers and minutes in Istanbul and Athens, the Luton sequence, the 10th-minute goal at Chelsea, 2008–09 league goals, 114 caps, his last game in 2017.
- Two quotes, both checked word for word: his "fresh challenge" line to UEFA (2009), and Gerrard's "the best passer of a ball I've ever played with."
- Mascherano's joining date is left out because the fact-check didn't give it. Players' first names that weren't in the fact-check (Maldini, Crespo, Gattuso, Pirlo, Kuyt and others) are left as surnames only.
- The Newcastle goal is described as long-range, not "from his own half", because the fact-check only confirms the distance for Luton.

No Heysel or Hillsborough content.

---

# Final check: Xabi Alonso biography

Checked 10 November 2026. File: /home/claude/bios/work/xabi-alonso/bio.md

## Verdict: PASS WITH FIXES

## Fresh verification (this check)

- **Management:** Real Sociedad B promoted to the second division in 2021, the first time in about 60 years (RFEF "regresa a Segunda sesenta años después"; ESPN). Leverkusen 2022–25: first Bundesliga title in 2023–24, unbeaten (Al Jazeera, ESPN, Bundesliga.com). He confirmed his Leverkusen exit in May 2025 and Real Madrid appointed him on 25 May 2025 (Bundesliga.com, The Star). He left Real Madrid on 12/13 January 2026 "by mutual agreement" and Arbeloa replaced him (CBS Sports, Al Jazeera, Irish News). Chelsea appointed him head coach on a four-year deal on 17 May 2026 (Sky Sports, Al Jazeera, RTÉ, Bloomberg). The fact-check report confirms he is still in charge in November 2026. The body's wording ("appointed Chelsea head coach in 2026") is correct.
- **Quote, UEFA 2009:** UEFA (5 August 2009): "...I thought it was the right moment to find a fresh challenge". Word for word, and the transfer date of 5 August 2009 is confirmed.
- **Quote, Gerrard:** the LFC retirement article reads: "The best passer of a ball I've ever played with." Word for word. The same article confirms the last game was Bayern 4–1 Freiburg.
- **Luton, 7 January 2006** (FA): Luton 3–5 Liverpool, third round. The first goal was "from 40 yards to make it 3–3". The second came after he "collected the ball midway in his own half", went past "Luton keeper Marlon Beresford, who had joined their attack", "with his left-foot from 70 yards". Hatters Heritage: "lob from halfway after Marlon Beresford is stranded upfield".
- **Newcastle, 20 September 2006** (Irish Times, 21 September 2006): the shot came from the edge of the centre circle, looped over Harper, who slipped going back, in the 79th minute. Liverpool won 2–0.
- **2008 Barry episode attribution:** the Liverpool Echo 2017 interview (James Pearce, via Empire of the Kop) contains "I wasn't expecting the manager to say I could be sold", "my position in the team changed, a little bit that summer" and "I accept this. You are the one that has made the decision." Fox Sports, 25 May 2011: Benítez's interest in Barry came about 12 months before Alonso left. *Ring of Fire* is per the fact-check report (Guardian/Football España extract). The paraphrase and attribution are supported.
- **Fee, signing date, Lampard injury, Istanbul rebound, 2006 FA Cup final cross, 86 points second, 114 caps, Euro 2008 / World Cup 2010 / Euro 2012, 210 apps 19 goals:** all confirmed in the fact-check figure list with URLs. My searches found nothing contradicting them. The fee is rightly "a reported £10.7 million".

## Changes made (old → new)

1. "played in a second European Cup final" → "played in a second Champions League final". This keeps the competition name consistent with the previous clause. Athens 2007 was a Champions League final (UEFA).
2. "with Luton's goalkeeper Beresford up for a set-piece" → "with Luton's goalkeeper Marlon Beresford up in attack". No source says it was a set-piece. The FA says he "had joined their attack", and Hatters Heritage says he was "stranded upfield".
3. First names added where helpful: Paolo Maldini, Hernán Crespo, Gennaro Gattuso, Florent Sinama-Pongolle, Andrea Pirlo, Dirk Kuyt.

## Writing and format

- Headline is in sentence case. British spelling throughout. No AI phrasing or padding found; the prose is plain and factual.
- Frontmatter has exactly title, slug, date, historicalPeriod ("2004–2009", the year span is correct), decade "2000s", role, excerpt. The body starts directly after the closing ---. En dashes are used in scores and ranges. No sources list or links in the body.
- The son-born-in-Liverpool detail flagged in the fact-check has been removed from the edited piece. No issue.

## Sensitive

No Heysel or Hillsborough-disaster reference.

## Remaining concerns (minor, no action needed)

- "Gerrard could play further forward behind Torres" is a widely accepted tactical summary rather than a sourced figure.
- The Alonso Luton winner: "near the end" is consistent with it being the final goal, but no minute is given. That is fine.
- 114 caps rests on the fact-check source (LaLiga). It is consistent with all reporting and was not re-fetched.
