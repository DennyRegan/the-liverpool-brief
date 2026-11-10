# Klopp timeline, batch 1: check sheet for Astra

Draft of 8 November 2026. Candidate data is in `claude/specs/klopp-timeline-batch-1.json` (same fields as the site schema; it passes the schema, parent, link and sort checks). **Nothing here is in `content/timeline/klopp.json`, so nothing is on the site.**

## What batch 1 is
The first 17 of the 27 confirmed main entries, spec rows 1–17 (8 Oct 2015 to 25 Jun 2020). Each has one or more links to series Parts 1–7, which are live, plus biographies where one exists. Rows 18–27 (2020-21 onward) wait for Parts 8–13.
- 17 main entries and 13 sub-entries (children of the five signing groups, the City tie, and the title entry). 30 rows in all.
- Main-entry text (25–45 words) is written from the linked Part, not from memory. Day, month and window precision follows the spec: no summer or window carries an invented day.
- Dates and results are cross-checked against the shortlist. Importance (which rows are main) is editorial and untouched.
- No fees, no source list, nothing on Heysel or Hillsborough in any entry.

## Please check first: dates the linked Part does not give
| Entry | Field | Where it came from | Needs |
|---|---|---|---|
| middlesbrough-fourth-place | 21 May 2017 | Shortlist only. Part 3 says "final day" with no date | Confirm date |
| summer-2016-wijnaldum | "July 2016" (month) | Shortlist only. Part 3 gives no date | Confirm month, or find the day |
| summer-2017-robertson | "July 2017" (month) | Shortlist only. Part 4 gives no date | Confirm month, or find the day |
| summer-2016-matip | announced 15 Feb 2016 | Part 2: Schalke confirmed "the next day" after 14 Feb; Part 3: "agreed in February" | Confirm the announcement date |
| january-2018-coutinho | 6 Jan 2018 | Part 4: sold "the next day" after the 5 Jan FA Cup match | Confirm the date |
| summer-2018-alisson | announced 19 Jul 2018; no effective date | Part 5 | Find the arrival or registration date, or leave as announcement only |
| summer-2016/2017/2018 group parents | window start/end | Derived from the children (28 Jun–31 Jul 2016; 22 Jun–31 Jul 2017; 28 May–19 Jul 2018) | Confirm they are reasonable, or change to month labels |

## Resolved by the articles (your spec flagged these)
- Salah announced Thursday 22 June 2017, effective 1 July: stated in Part 4.
- Van Dijk agreed 27 Dec 2017, registered from 1 Jan 2018: stated in Part 4.
- Barcelona 7 May 2019: stated in Part 6 (the "19 May" in one Telegraph piece is a typo, as your spec said).

## Claims to verify, entry by entry
1. **klopp-appointed**, 8 Oct 2015: sacked Sun 4 Oct (four days earlier); press conference next morning at Anfield; "the Normal One"; "from doubters to believers".
2. **west-brom-salute**, 13 Dec 2015, 2–2: Origi equalised in the fifth minute of stoppage time; arms linked towards the Kop; Klopp's later explanation.
3. **dortmund-comeback**, 14 Apr 2016, 4–3: Dortmund led 3–1 after 57 minutes; Coutinho 66', Sakho 77', Lovren in the first minute of stoppage time; 5–4 on aggregate. The entry does not mention Hillsborough, although Part 2 does.
4. **basel-europa-league-final**, 18 May 2016, 1–3: Sturridge before half-time; Sevilla equalised 18 seconds into the second half; "second lost final in three months"; Klopp's "lost faith in our style" quote.
5. **summer-2016-signings**: Mané 28 June; Matip free transfer, registered 1 July; Wijnaldum from Newcastle, five-year contract; "sold more than they bought" (Part 3 cites Sky and This Is Anfield estimates, so please check the claim).
6. **middlesbrough-fourth-place**, 21 May 2017, 3–0: scorers Wijnaldum, Coutinho, Lallana; fourth with 76 points; play-off route.
7. **summer-2017-signings**: Salah 22 June / 1 July; Robertson from relegated Hull; Robertson first-choice left-back from December (Moreno's ankle injury 6 Dec); Salah 44 goals in all competitions.
8. **january-2018-van-dijk-coutinho**: Van Dijk agreed 27 Dec, registered 1 Jan, headed the FA Cup winner v Everton on 5 Jan; Coutinho to Barcelona the next day; Klopp's "dream" quote.
9. **city-4-3-anfield**, 14 Jan 2018: City unbeaten in the league until then; scorers Oxlade-Chamberlain, Firmino, Mané, Salah; first league defeat for City; "possible to play without him".
10. **city-champions-league-2018**, 4 and 10 Apr 2018: 3–0 (goals at 12, 21, 31 minutes; Salah, Oxlade-Chamberlain, Mané), then 2–1 away (City scored after two minutes; Salah, Firmino); 5–1 on aggregate.
11. **kyiv-champions-league-final**, 26 May 2018, 1–3: Salah off around 31 minutes; Karius's two errors; Bale's two goals after coming on; Boston hospital concluded Karius had a concussion.
12. **summer-2018-signings**: Fabinho announced 28 May, joined 1 July; Alisson announced 19 July; Karius loan to Beşiktaş 25 Aug; Klopp's "stronger defensively" remark (before Huddersfield, 20 Oct 2018, in Part 5).
13. **barcelona-4-0**, 7 May 2019: aggregate overturned from 3–0; Origi (7', 79'), Wijnaldum (54', 56'); no Salah or Firmino; Alexander-Arnold's corner for the fourth.
14. **wolves-97-points**, 12 May 2019, 2–0: Mané scored both; City won 4–1 at Brighton; 98 v 97; only league defeat was 3 Jan 2019 at the Etihad.
15. **madrid-champions-league-final**, 1 Jun 2019, 2–0: Salah's penalty (club timing 1 min 48 s, "inside two minutes"); Origi 87'; sixth European Cup; first trophy as Liverpool manager; "run of six lost finals" (press count: three with Dortmund, three with Liverpool).
16. **club-world-cup-final**, 21 Dec 2019, 1–0 aet: Mané to Firmino in the 99th minute; first Club World Cup; League Cup quarter-final at Villa lost 5–0 by a young side (17 Dec).
17. **champions-of-england-2020**: Chelsea 2–1 City on 25 June; seven games left; suspension on 13 March; first match back 21 June; trophy presentation 22 July after the 5–3 v Chelsea.

## Decisions for Denny
- **Result strings.** Neutral finals use "Liverpool 2–0 Tottenham Hotspur" (spec order), whereas the shortlist writes "Tottenham 0–2 Liverpool". I used the spec's order and the title and competition show Liverpool as the focus. For the City tie, the result line reads "Aggregate: Liverpool 5–1 Manchester City".
- **Hillsborough inside linked pieces.** Parts 2 and 5 discuss Hillsborough (the April 2016 memorial and verdicts; the 2019 anniversary). No entry mentions it, but entries 3 and 14 link to those Parts. Say if you want a different link target.
- **Season for the summer groups.** Summer 2016, 2017 and 2018 groups sit in the incoming season (2016-17, 2017-18, 2018-19), as the shortlist says. Mané's 28 June 2016 and Fabinho's 28 May 2018 announcement fall before the 1 July season start, so please confirm you are happy with that.
- **Extended rows.** Not yet drafted. The 2015-16 to 2019-20 shortlist rows marked Extended (about 25 matches plus moments) could be batch 2 once this batch is checked.
