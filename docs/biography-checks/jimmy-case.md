# jimmy-case: checks before publication

Draft by GPT (branch editorial/next-ten-biographies-batch-four-2026-10-03). Checked on 10 November 2026 by three fresh agents: fact-check of the draft, edit, then an independent final check of the edited text.

---

# Fact-check: Jimmy Case (draft /home/claude/bios/gpt/jimmy-case.md)

Checked 10 November 2026.

## Sensitive flags

- **Heysel / Hillsborough disaster:** not mentioned.
- **Death / illness:** none in the draft.
- **Sensitive personal matter (minor):** paragraph 9 says "his behaviour away from football had counted against him at Liverpool". This is supported by Case's own interview (drinking and socialising, "We let our hair down a bit"), but it is a personal-conduct point. Keep it in his framing and don't expand on it.

## 1. Summary

The draft is very reliable. Every number checked (birth date, debut, 269/46 totals, the 186/23 league split, season figures, final line-ups, minutes and honours) matches LFChistory, and most are backed by a second source. It has no direct quotations, only paraphrases of Case's LFChistory interview, and those are fair. Problems are minor: one unsourced detail (Blue Union), one goal-minute range that sources disagree on, and one paraphrase that is slightly stronger than Case's words. Several facts the commissioning brief raised are **not in the draft at all**: the £500 fee, the Lawrenson deal, the Dresden goals and the later clubs after Southampton. The results for those are given below in case the editor wants to add them.

Errors / issues:
1. "He played for Blue Union and then South Liverpool": **Blue Union is unsourced.** LFChistory, the LFC Boot Room, Wikipedia and the 1977 Liverpool Echo-style profile all name only South Liverpool. Cut it.
2. "Liverpool had scored three times between the 59th and 64th minutes": sources disagree on Keegan's penalty (64' per liverpoolfc.com/Wikipedia, 65' per 11v11). Use softer wording.
3. "his misplaced pass had allowed Allan Simonsen to score the equaliser": slightly stronger than Case's own words ("I know I gave the ball away to Allan Simonsen for their goal"). Soften it a little.
4. Front matter (not a fact error): the JSON front matter has no `date` field, and `historicalPeriod` is an era range. The project's archive format uses a publication `date` and the event date in `historicalPeriod`. The editor should check this against the bio schema before build.

Brief-specific checks the caller raised:
- **Birth:** 18 May 1954, Allerton, Liverpool. Confirmed (Allerton is LFChistory only; others say "Liverpool").
- **Signing from South Liverpool for £500, May 1973:** Confirmed (LFChistory; 1977 profile on playupliverpool.com: "Liverpool paid South Liverpool for £500 for him"). The draft gives no fee, so this can be added safely.
- **Apprentice electrician:** Confirmed (LFChistory interview, LFChistory book review, Wikipedia).
- **Hat-trick v Dynamo Dresden: NO.** His hat-trick was against **Śląsk Wrocław** (UEFA Cup 3rd round 2nd leg, 10 Dec 1975, 3–0, goals 22', 30', 46'). Against Dresden he scored **once** on 17 Mar 1976 (UEFA Cup QF) and **twice** on 19 Oct 1977 (European Cup, 5–1 at Anfield). The draft correctly says Śląsk Wrocław and never mentions a Dresden hat-trick. Do not add one.
- **Brighton move in the Lawrenson deal:** Mostly supported but not watertight. Wikipedia calls Case a "makeweight" in the deal that took Lawrenson to Liverpool (£900,000), and Case himself is quoted (inparallellines.blog) saying "That's where I got asked to make weight, but I didn't know it was a makeweight at the time." The Brighton & Hove Independent hedges ("perhaps a hidden part of the Lawrenson deal? Who knows"). Reported fees for Case differ (£450,000 per Wikipedia; others vary). If added, use: "He joined Brighton in August 1981, the same summer Mark Lawrenson moved from Brighton to Liverpool; Case later said he had been the makeweight in that deal." Give no fee.
- **FA Cup 1983:** Confirmed: winner at Anfield, 20 Feb 1983, Brighton won 2–1 (71'), fifth round. He also scored in the semi-final v Sheffield Wednesday at Highbury (2–1) and in the quarter-final (not in the draft).

## 2. Current status (10 Nov 2026)

Retired. No report of his death was found. Wikipedia lists him as a living retired footballer (age 71 at last edit; he would be 72 now). No current club or coaching role was found. His last listed managerial post is Bashley (1997–99), and SaintsPlayers mentions punditry for Southampton's radio station and BBC Radio Merseyside, both undated. Safe wording: say nothing about his current activity, or "now retired". (A 2021 Brighton & Hove News headline mentions him and a Covid ward. It wasn't read or verified, and it's health-related, so don't use it.)

## 3. Figure list

| Claim | Correct figure | Sources (URLs) | Verdict |
|---|---|---|---|
| Born 18 May 1954 | 18 May 1954 | https://www.lfchistory.net/players/278 ; https://www.11v11.com/players/jimmy-case-32301/ ; https://www.saintsplayers.co.uk/player/jimmy-case/ | Confirmed (2+) |
| Born in Allerton | Allerton, Liverpool | https://www.lfchistory.net/players/278 (others say "Liverpool") | Confirmed (single source: LFChistory) |
| Played for Blue Union | Not found anywhere | none | Unsourced |
| Joined from South Liverpool, May 1973 | May 1973 (11v11: 1 May 1973) | https://www.lfchistory.net/players/278 ; https://www.11v11.com/players/jimmy-case-32301/ ; https://en.wikipedia.org/wiki/Jimmy_Case | Confirmed (2+) |
| Fee £500 (not in draft) | £500 | https://www.lfchistory.net/players/278 ; https://playupliverpool.com/1977/07/30/star-profile-jimmy-case | Confirmed (2+) |
| Electrician's apprenticeship; declined full-time deal; semi-pro | Yes; "I actually turned them down because I had done two years of my electrician's apprenticeship" | https://lfchistory.net/articles/3008 ; https://lfchistory.net/articles/3723 | Confirmed (2+) |
| Debut 26 Apr 1975, 3–1 home v QPR | Liverpool 3–1 QPR, Anfield, last day of 1974–75 | https://www.lfchistory.net/games/858 ; https://bootroom.liverpoolfc.com/history/past-players/jimmy-case | Confirmed (2+) |
| Still 20 at debut | 20 (turned 21 on 18 May 1975) | derived from birth date | Confirmed |
| Debut side included Keegan, Toshack, Callaghan | All three started | https://www.lfchistory.net/games/858 | Confirmed (single source: LFChistory) |
| 1975–76: 39 apps, 12 goals, 5 in UEFA Cup | 39/12; Europe 9/5 | https://www.lfchistory.net/Players/Player/Profile/278 ; https://bootroom.liverpoolfc.com/history/past-players/jimmy-case (12 goals) | Confirmed (2+) |
| Three v Śląsk Wrocław | Hat-trick, 10 Dec 1975, 3–0 | https://lfchistory.net/games/887 ; https://bootroom.liverpoolfc.com/history/past-players/jimmy-case | Confirmed (2+) |
| 1975–76 league champions and UEFA Cup winners | Yes | https://www.lfchistory.net/players/278 ; https://en.wikipedia.org/wiki/1976_UEFA_Cup_final | Confirmed (2+) |
| 28 Apr 1976: Brugge 2–0 up at HT; Case on for Toshack | Yes, at half-time | https://legacy.liverpoolfc.com/news/first-team/221759-april-28-1976-anfield-liverpool-3-2-club-brugge-kv ; https://www.11v11.com/matches/liverpool-v-club-brugge-28-april-1976-217573/ | Confirmed (2+) |
| Kennedy, Case, Keegan pen; 59th to 64th min | Kennedy 59', Case 61', Keegan pen 64' (11v11: 65') | as above + https://en.wikipedia.org/wiki/1976_UEFA_Cup_final | Corrected (minor disagreement; soften) |
| 1977 FA Cup final: Case equaliser v Man Utd, lost 2–1 | Pearson 51', Case 52', Greenhoff 55'; 21 May 1977 | https://www.lfchistory.net/games/978 ; https://www.liverpoolfc.com/info/jimmy-case | Confirmed (2+) |
| Controlled, turned and struck past Stepney | Goal confirmed (assist Joey Jones); technique description not verified in detail | https://www.lfchistory.net/games/978 | Confirmed for goal; description low-risk but unverified |
| League title already secured | Yes (1976–77 champions) | https://www.lfchistory.net/players/278 ; https://www.liverpoolfc.com/info/jimmy-case | Confirmed (2+) |
| Four days later started European Cup final, Rome, won 3–1 | 25 May 1977; Case started (No. 8) | https://www.lfchistory.net/games/979 ; https://en.wikipedia.org/wiki/Jimmy_Case | Confirmed (2+) |
| Simonsen equaliser; Smith header; Neal penalty | McDermott 27', Simonsen 51', Smith 64', Neal pen 82' | https://www.lfchistory.net/games/979 | Confirmed (single source: LFChistory) |
| Case's mistake led to Simonsen goal | Case: "I know I gave the ball away to Allan Simonsen for their goal." | https://lfchistory.net/articles/3008 | Confirmed (single source: LFChistory), soften wording |
| 1978 SF: scored in 3–0 home win over Gladbach after 2–1 first-leg loss | 12 Apr 1978, 3–0 (Kennedy, Case, Dalglish); first leg 2–1 in Düsseldorf | https://lfchistory.net/players/278/goals-per-season/19 ; https://www.uefa.com/uefachampionsleague/news/0065-0e6a08688dbf-39a54804ad3c-1000/ | Confirmed (2+) |
| Started 1978 final v Brugge at Wembley, Dalglish only goal | Started; replaced by Heighway 60'; Dalglish 64' | https://www.lfchistory.net/games/1041 ; https://www.uefa.com/uefachampionsleague/news/0065-0e6a08688dbf-39a54804ad3c-1000/ | Confirmed (2+) |
| 1978–79 and 1979–80: 37 league apps each | 37 and 37 | https://www.lfchistory.net/Players/Player/Profile/278 ; https://www.11v11.com/players/jimmy-case-32301/ | Confirmed (2+) |
| All-comps goals 9 then 5 | 1978–79: 9; 1979–80: 5 | https://www.lfchistory.net/Players/Player/Profile/278 | Confirmed (single source: LFChistory) |
| Started 1981 League Cup final replay v West Ham | Started (No. 11), assisted Hansen; 1 Apr 1981, Villa Park, 2–1 | https://lfchistory.net/games/1207 ; https://www.liverpoolfc.com/info/jimmy-case | Confirmed (2+) |
| 27 May 1981, Paris: replaced Dalglish 86', A. Kennedy goal, 1–0 | Case for Dalglish 86'; Alan Kennedy 81' | https://www.lfchistory.net/games/1218 ; https://www.liverpoolfc.com/info/jimmy-case ("late substitute") | Confirmed (2+) for late sub; minute single source: LFChistory |
| Last competitive appearance 27 May 1981 | Yes | https://www.lfchistory.net/players/278 | Confirmed (single source: LFChistory) |
| Moved to Brighton summer 1981, aged 27 | August 1981; aged 27 | https://www.lfchistory.net/players/278 (left 17 Aug 1981) ; https://www.11v11.com/players/jimmy-case-32301/ ; https://en.wikipedia.org/wiki/Jimmy_Case | Confirmed (2+) |
| Feb 1983 FA Cup 5th round winner at Anfield, 2–1 | 20 Feb 1983, 2–1, Case 71' | https://inparallellines.blog/tag/hard-case ; https://en.wikipedia.org/wiki/Jimmy_Case ; https://www.lfchistory.net/players/278 | Confirmed (2+) |
| Long-range goal v Sheffield Wednesday in semi | Scored opener from about 30 yards (described as free kick); Brighton won 2–1 | https://inparallellines.blog/tag/hard-case ; https://en.wikipedia.org/wiki/Jimmy_Case | Confirmed (2+) |
| Brighton lost final to Man Utd after replay | 2–2, replay 0–4 | https://en.wikipedia.org/wiki/Jimmy_Case | Confirmed (widely known; Wikipedia fetched) |
| Joined Southampton March 1985, captain, until 1991 | March 1985; captain under Chris Nicholl; released 1991 (last game 11 May 1991) | https://www.saintsplayers.co.uk/player/jimmy-case/ ; https://en.wikipedia.org/wiki/Jimmy_Case ; https://www.11v11.com/players/jimmy-case-32301/ | Confirmed (2+) |
| Later returned to Brighton as player, then managed club | Returned Dec 1993 as player-coach; manager from Nov 1995 to 1996 | https://www.saintsplayers.co.uk/player/jimmy-case/ ; https://en.wikipedia.org/wiki/Jimmy_Case | Confirmed (2+) |
| 269 apps, 46 goals; 186 league apps, 23 league goals | 269/46; league 186/23 | https://www.lfchistory.net/players/278 ; https://www.liverpoolfc.com/info/jimmy-case ; https://bootroom.liverpoolfc.com/history/past-players/jimmy-case | Confirmed (2+) |
| Honours: 4 titles, 3 European Cups, UEFA Cup, League Cup, Super Cup | 1975–76, 1976–77, 1978–79, 1979–80; EC 1977, 1978, 1981; UEFA 1976; LC 1981; ESC 1977 | https://www.lfchistory.net/players/278 ; https://www.liverpoolfc.com/info/jimmy-case | Confirmed (2+) |

## 4. Corrections

1. "He played for Blue Union and then South Liverpool before joining the Anfield club in May 1973."
   → "He played for South Liverpool before joining the Anfield club in May 1973, for a reported fee of £500."
2. "Liverpool had scored three times between the 59th and 64th minutes."
   → "Liverpool had scored three times in about five minutes after the hour."
3. "It was a victory that also contained a mistake he later acknowledged: his misplaced pass had allowed Allan Simonsen to score the equaliser."
   → "It was a victory that also contained a mistake he later acknowledged: he gave the ball away before Allan Simonsen's equaliser."
4. (Optional precision) "Case controlled the ball, turned and struck the equaliser past Alex Stepney."
   The goal and Stepney are fine. If the editor wants zero risk: "Case turned and drove the equaliser past Alex Stepney."

## 5. Cut list

- "Blue Union" (no source found).
- Do not add: any Dynamo Dresden hat-trick (it didn't happen), a Brighton transfer fee (sources differ), or current activities (none verified).

## 6. Quotes

The draft has **no direct quotations**. Its three paraphrases of Case were checked against the LFChistory interview (https://lfchistory.net/articles/3008):

| Paraphrase in draft | Case's words found | Verdict |
|---|---|---|
| Declined a full-time contract to finish his training; taken on as semi-professional | "I actually turned them down because I had done two years of my electrician's apprenticeship"; "Liverpool took over my semi-professional contract at South Liverpool and I did that for two years until I was twenty" | Fair paraphrase, keep |
| Role built around serving creative players and exploiting space left by defenders watching the forwards | "You get the ball and you're looking to play the gifted players in like Kenny Dalglish or Kevin Keegan."; "If they paid a lot of attention to them there should be a more scope for other players." | Fair paraphrase, keep |
| Misplaced pass allowed Simonsen to score | "I know I gave the ball away to Allan Simonsen for their goal." | Slightly overstated, soften (Correction 3) |
| Behaviour away from football counted against him; wanted to stay and compete with Lee | "We let our hair down a bit and that's exactly what we did."; "The club in them days didn't like that type of things."; "I didn't want to go anyway, to be honest"; "Even though Sammy Lee is a really good friend of mine, I reckon I would have given a good go for the position" | Fair paraphrase, keep |

If any of these are turned into direct quotes, use the exact wording above. The text is transcribed speech, so keep the grammar as it is ("in them days", "a more scope").

---

# Editor's note

# Edit note: Jimmy Case

The body is about 925 words, inside the 900–1,300 range. The frontmatter uses decade "1970s", role "Midfielder" and period "1973–1981", as briefed. The JSON frontmatter was replaced with the house YAML fields. As in Matip's file, there is no blank line after the frontmatter.

Corrections applied:
- "Blue Union" cut. The bio now names South Liverpool only.
- Brugge 1976: the goals are now "three times in about five minutes after the hour". No exact goal minutes.
- Simonsen: the bio now uses Case's own words, quoted exactly from the LFChistory interview: "I know I gave the ball away to Allan Simonsen for their goal." Nothing beyond that.
- 1977 FA Cup goal: now "turned and drove the equaliser past Alex Stepney", the fact-check's low-risk wording. The draft's "controlled the ball" detail was unverified, so it's gone.

Added (all confirmed in the fact-check):
- The £500 fee from South Liverpool, May 1973.
- The 1983 FA Cup fifth-round winner at Anfield: 20 February, 71st minute, Brighton won 2–1.
- The Lawrenson deal, in the fact-check's safe wording, with no fee.
- Confirmed details: the goal minutes in the 1977 finals (Pearson, Greenhoff, McDermott), Düsseldorf for the 1978 semi-final first leg, Heighway replacing Case in the 1978 final, Villa Park for the 1981 League Cup final replay, and the 81st-minute Kennedy goal in Paris.

Behaviour away from football: this stays in Case's own framing, using his two verified quotes ("We let our hair down a bit…", "The club in them days didn't like that type of things"). It is not expanded, and drinking is not named. His grammar is kept as transcribed.

Cut:
- The Sources list and all links (house style).
- Unverified adjectives such as "tackling and powerful shooting".
- The draft's essay lines ("The substitute had helped change both the match…", "His account adds context…", and the summing-up final paragraph).

Not included: no current role or activity (he is alive and the fact-check found none), no Brighton fee, no Dresden hat-trick, and no undated punditry. The 2021 Covid headline was left out.

---

# Final check: Jimmy Case

Checked 10 November 2026.

## Verdict: PASS WITH FIXES

## Changes made (old → new, with source)

1. "Liverpool had scored three times in about five minutes after the hour" → "...in about five minutes around the hour". Kennedy scored in the 59th minute, before the hour (Kennedy 59', Case 61', Keegan pen 64'/65'). Sources: 11v11 match page, legacy.liverpoolfc.com match report, Wikipedia 1976 UEFA Cup final (via the fact-check figure list).
2. "If defenders paid a lot of attention to them [Dalglish or Keegan]" → "...to the forwards". In the LFChistory interview, "them" means Toshack and Keegan ("The emphasis was on Toshack and Keegan. If they paid a lot of attention to them..."). Dalglish and Keegan were never Liverpool team-mates, so the old wording put words in Case's mouth. Source: https://lfchistory.net/articles/3008
3. Closing line "For Liverpool he played 186 league games and scored 23 league goals, within his totals of 269 appearances and 46 goals." → "In all, 186 of his 269 Liverpool appearances, and 23 of his 46 goals, came in the league." The old line was clunky. The figures are unchanged and confirmed (LFChistory, liverpoolfc.com).

## Items verified

- Quotations, checked word for word against the LFChistory interview with Case (https://lfchistory.net/articles/3008, interviewer Arnie). All exact and correctly attributed:
  - "I know I gave the ball away to Allan Simonsen for their goal."
  - "We let our hair down a bit and that's exactly what we did."
  - "The club in them days didn't like that type of things."
  - "I didn't want to go anyway, to be honest" (the full line goes on "...but when you're asked twice")
  - Lee paraphrase: Case said "Even though Sammy Lee is a really good friend of mine, I reckon I would have given a good go for the position". Fair.
  - Context note: the "hair down" and "them days" lines come from Case's account of being arrested with Ray Kennedy. The bio's framing ("the players' life away from the pitch had counted against him") is fair and doesn't expand on it.
- Lawrenson deal: Case said "They were looking to get Mark Lawrenson in and that's where I got asked to make weight... I didn't know it was a make weight at the time" (same interview). The bio's wording ("Case later said he had been the makeweight in that deal") is faithful, and no fee is given. OK.
- Electrician apprenticeship and two years done: confirmed in the same interview.
- £500 from South Liverpool, May 1973: confirmed (LFChistory, playupliverpool 1977 profile, 11v11), per the fact-check.
- 1983 FA Cup: 20 February 1983, fifth round, winner in the 71st minute, Brighton won 2–1 at Anfield. Confirmed (fact-check, 2+ sources).
- 1977 FA Cup final: Pearson 51', Case 52' past Stepney, Greenhoff 55', lost 2–1, 21 May 1977. Confirmed. "Turned and drove" is the fact-check's low-risk wording.
- 1977 European Cup final sequence (McDermott, Simonsen, Smith, Neal pen, 3–1): confirmed.
- 1978 semi-final: first leg lost 2–1 in Düsseldorf; 3–0 at Anfield on 12 April 1978 (Kennedy, Case, Dalglish). Confirmed (LFChistory, UEFA).
- 1978 final: Heighway replaced Case on the hour, and Dalglish scored in the 64th minute. Confirmed (LFChistory, UEFA).
- League Cup final replay at Villa Park, 1 April 1981, 2–1, Case started. Confirmed.
- Paris 1981: Alan Kennedy 81', Case on for Dalglish 86', 1–0. Confirmed (LFChistory; liverpoolfc.com "late substitute").
- 269 appearances and 46 goals (186 and 23 in the league): confirmed.
- Southampton from March 1985, captain, until 1991. Back to Brighton as a player (December 1993), then manager from November 1995 to 1996. Confirmed. The bio gives no manager dates, which is fine.
- Headline: three European Cups as a Liverpool player (1977, 1978, 1981). Confirmed by the honours lists on LFChistory and liverpoolfc.com. He started and won in 1977 and 1978 and came on as a substitute in 1981.
- "Right of midfield": confirmed by liverpoolfc.com "Liverpool's Greatest No.49", which says he was "patrolling Liverpool's right flank" and quotes him on filling "the spaces on the right-hand side" (https://www.liverpoolfc.com/news/liverpools-greatest-no49-jimmy-case).
- Current status: alive. The bio states no current role, which is correct.

## Format

- Frontmatter has exactly title, slug, date, historicalPeriod ("1973–1981", a year span as instructed), decade, role and excerpt. The body starts directly after the closing ---.
- The headline is in sentence case. Ranges use en dashes. There are no links or sources list in the body, and no American spellings were found.

## Sensitive

- No Heysel or Hillsborough reference.
- The arrest context behind the "hair down" quote isn't stated in the bio. Keep it that way.

## Remaining concerns (minor, no action required)

- The phrase "Turned and drove" describing the 1977 goal: the goal and the keeper are confirmed, but the technique isn't verified in detail. Low risk.
- "Allerton" as his birthplace comes from a single source (LFChistory).
