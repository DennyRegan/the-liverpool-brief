# Prompt for Astra: Klopp timeline, batch 1

Paste everything below the line into Astra. It is self-contained: Astra needs no file access.

---

You are fact-checking the first batch of entries for an interactive timeline of Jürgen Klopp's Liverpool (October 2015 to May 2024) for The Liverpool Brief. Each entry is a short card with a date, a result line (matches only) and a summary. Check every date, score, scorer, minute and statement of fact. Do not rewrite for style.

## Rules
1. Find your own sources on the web and open each page you rely on. Do not use memory, search snippets or anything I give you here as evidence. The entries below are the claims to test, not sources.
2. Prefer primary or near-primary records: the club, UEFA, FIFA, the Premier League, the FA, match reports on the day, and LFChistory's season archives for dates and results. Use at least two independent sources for any date or score you cannot confirm on a primary page.
3. Keep fact and judgement apart. Dates, results, scorers and stated events are fact and are what you check. Which matches count as "main" is editorial and is not yours to rate.
4. Where sources conflict, do not pick one silently. Report both, say which you think is right and why, and mark the claim CONFLICT.
5. Announcement dates and arrival dates for signings are different things. Report the announced date and the effective (arrival or registration) date separately wherever both exist.
6. Never invent a day. If an entry is labelled by month or window ("July 2016", "Summer 2017") and you can find the exact day, give it and the source, but do not assume it.
7. Transfer fees are deliberately left out of the timeline. Do not check or add fees.
8. Attribute quotes and motives. If an entry states something Klopp, a player or a club said, check the wording or the paraphrase against the original and give the date and outlet.
9. Say plainly if you could not confirm something. "Unverified" is a valid verdict.

## Verdicts
- CONFIRMED: two sources or one primary page agree.
- CORRECT: the entry is wrong. Give the fix and the page.
- CONFLICT: reliable sources disagree. Give both.
- UNVERIFIED: nothing reliable found.

## What to return
1. A table, one row per claim: `entry id | claim | verdict | correct value if different | source URL (page you opened) | note`.
2. A short list of CORRECT, CONFLICT and UNVERIFIED items at the top, so they can be actioned first.
3. For the dates marked PRIORITY below, the exact date you found, or a clear statement that none could be found.

Do not edit anything. Report only.

## Priority dates (the series article behind each card does not state them)
- middlesbrough-fourth-place: Liverpool 3–0 Middlesbrough, Premier League. Entry says 21 May 2017.
- summer-2016-wijnaldum: Wijnaldum's move from Newcastle United. Entry says "July 2016" (month only). Find the announcement or completion day.
- summer-2017-robertson: Robertson's move from Hull City. Entry says "July 2017" (month only). Find the announcement or completion day.
- summer-2016-matip: Matip's free transfer from Schalke. Entry says announced 15 February 2016, registered 1 July 2016.
- january-2018-coutinho: Coutinho's move to Barcelona. Entry says 6 January 2018.
- summer-2018-alisson: Alisson from Roma. Entry says announced 19 July 2018. Find the date he was registered or arrived.
- Group windows: summer 2016 (28 June to 31 July 2016), summer 2017 (22 June to 31 July 2017), summer 2018 (28 May to 19 July 2018). Say whether each window is a fair description of the period the entries cover.

## The entries

Format: id, date, result line, then the summary as it will appear. Sub-entries sit under the main entry named.

### Season 2015-16
**klopp-appointed** (moment). 8 October 2015.
Four days after Brendan Rodgers was sacked, Liverpool appointed Jürgen Klopp. At his Anfield press conference the next morning he called himself the Normal One and asked supporters to change from doubters to believers.
- Check: Rodgers sacked Sunday 4 October 2015; appointment announced 8 October; press conference 9 October at Anfield; "the Normal One"; the "doubters to believers" wording.

**west-brom-salute** (match). 13 December 2015. Premier League. Liverpool 2–2 West Bromwich Albion.
Divock Origi equalised in the fifth minute of stoppage time. Klopp then led his players towards the Kop, arms linked. Opponents mocked it; he said he wanted to thank the supporters and show that players and crowd were one unit.
- Check: Origi's goal minute; the salute; the mocking reaction; Klopp's later explanation.

**dortmund-comeback** (match). 14 April 2016. Europa League quarter-final, second leg. Liverpool 4–3 Borussia Dortmund.
Dortmund led 3–1 on the night after 57 minutes. Coutinho and Sakho scored, and Dejan Lovren headed the winner in the first minute of stoppage time, 4–3 on the night and 5–4 on aggregate, against Klopp's old club.
- Check: score at 57 minutes; scorers and minutes for all seven goals; aggregate; first leg 1–1 on 7 April.

**basel-europa-league-final** (match). 18 May 2016. Europa League final. Liverpool 1–3 Sevilla.
Daniel Sturridge put Liverpool ahead before half-time, but Sevilla equalised 18 seconds into the second half and won 3–1. Klopp said his team had lost faith in their style of play. It was his second lost final in three months.
- Check: Sturridge's goal and minute; Gameiro's equaliser at 18 seconds; Sevilla's other goals; the Klopp quote and where he said it; the earlier lost final (League Cup, 28 February 2016).

### Season 2016-17
**summer-2016-signings** (signing group). Summer 2016 (28 June to 31 July 2016).
Sadio Mané arrived from Southampton on 28 June and Georginio Wijnaldum from Newcastle United. Joël Matip, agreed in February, joined from Schalke on a free transfer. Liverpool also sold more than they bought that summer.
- Check: each date below; the claim that Liverpool were net sellers that summer, using a source that states net spend (show your working if you add figures).
  - summer-2016-mane: Mané completed 28 June 2016.
  - summer-2016-matip: announced 15 February 2016, registered 1 July 2016.
  - summer-2016-wijnaldum: July 2016; joined from Newcastle (just relegated) on a five-year contract.

**middlesbrough-fourth-place** (match). 21 May 2017. Premier League. Liverpool 3–0 Middlesbrough.
Goals from Wijnaldum, Coutinho and Lallana beat already relegated Middlesbrough and secured fourth place on 76 points. That earned a Champions League play-off in August, not a place in the group stage.
- Check: date, scorers, order and minutes; Middlesbrough already relegated; final points and position; play-off round, not group stage.

### Season 2017-18
**summer-2017-signings** (signing group). Summer 2017 (22 June to 31 July 2017).
Liverpool announced Mohamed Salah from Roma on 22 June, effective 1 July. Andrew Robertson joined from relegated Hull City. Robertson took the left-back place in December, and Salah scored 44 goals in all competitions that season.
- Check: announced 22 June 2017 (a Thursday) and effective 1 July 2017; Hull relegated; Robertson first-choice left-back from December 2017 after Alberto Moreno's injury; Salah's 44 goals in 2017-18, all competitions.
  - summer-2017-salah: announced 22 June 2017, effective 1 July 2017, five-year contract.
  - summer-2017-robertson: July 2017.

**january-2018-van-dijk-coutinho** (signing group). January 2018.
Liverpool agreed to sign Virgil van Dijk on 27 December and registered him from 1 January. He scored the winner on his FA Cup debut on 5 January. The next day Philippe Coutinho was sold to Barcelona.
- Check: agreement 27 December 2017; registered 1 January 2018; debut and winner v Everton, 5 January 2018 (FA Cup third round, Liverpool 2–1); Coutinho's move confirmed 6 January 2018.
  - january-2018-van-dijk: announced 27 December 2017, effective 1 January 2018; registered in time for the Champions League knockout stage.
  - january-2018-coutinho: 6 January 2018. Klopp said Coutinho had made clear the move was his dream and that nothing was left to change his mind. Check the quote and date.

**city-4-3-anfield** (match). 14 January 2018. Premier League. Liverpool 4–3 Manchester City.
City had not lost a league game all season. Oxlade-Chamberlain, Firmino, Mané and Salah scored for Liverpool, the first side to beat City in the league. Klopp said it showed it was possible to play without Coutinho.
- Check: scorers and minutes for both sides; City's unbeaten league run to that point; the Klopp quote.

**city-champions-league-2018** (match group). April 2018 (4 and 10 April). Champions League quarter-final. Aggregate: Liverpool 5–1 Manchester City.
Salah, Oxlade-Chamberlain and Mané scored inside 31 minutes in the first leg at Anfield. In Manchester, Salah and Firmino scored in a 2–1 win, so Liverpool won the quarter-final 5–1 on aggregate.
- Check: both legs, scorers and minutes; City scored after two minutes in the second leg.
  - city-champions-league-first-leg: 4 April 2018, Liverpool 3–0 Manchester City.
  - city-champions-league-second-leg: 10 April 2018, Manchester City 1–2 Liverpool.

**kyiv-champions-league-final** (match). 26 May 2018. Champions League final. Liverpool 1–3 Real Madrid.
Salah went off injured after about half an hour. Loris Karius made two errors and Gareth Bale scored twice after coming on, so Real Madrid won 3–1. A hospital later concluded Karius had suffered a concussion in the match.
- Check: Salah's exit time; Karius's two errors; Bale's two goals and his substitution; Mané's goal; final score; the Massachusetts General Hospital statement (4 June 2018), its authors, and its wording ("sustained a concussion during the match").

### Season 2018-19
**summer-2018-signings** (signing group). Summer 2018 (28 May to 19 July 2018).
Fabinho was announced on 28 May, two days after Kyiv, and joined from Monaco on 1 July. Alisson Becker signed from Roma on 19 July. Klopp later said Liverpool had chosen to become stronger defensively.
- Check: Fabinho announced 28 May 2018, joined 1 July 2018; Alisson announced 19 July 2018; the Klopp remark about becoming stronger defensively (said before the Huddersfield match on 20 October 2018): find the original and check the wording.
  - summer-2018-fabinho: announced 28 May 2018, effective 1 July 2018.
  - summer-2018-alisson: announced 19 July 2018; Loris Karius left on loan to Beşiktaş on 25 August 2018.

**barcelona-4-0** (match). 7 May 2019. Champions League semi-final, second leg. Liverpool 4–0 Barcelona.
Trailing 3–0 from the first leg, and without Salah and Firmino, Liverpool won 4–0. Origi scored twice, Wijnaldum twice in two minutes, and Alexander-Arnold's quickly taken corner led to the fourth goal.
- Check: date (a Telegraph piece says 19 May, which looks like a typo); first leg 3–0 on 1 May; scorers and minutes (Origi 7' and 79', Wijnaldum 54' and 56'); Salah and Firmino absent; the corner sequence.

**wolves-97-points** (match). 12 May 2019. Premier League. Liverpool 2–0 Wolverhampton Wanderers.
Mané scored twice to beat Wolves, but Manchester City won 4–1 at Brighton and took the title with 98 points to Liverpool's 97. Liverpool lost only one league match all season, at the Etihad on 3 January.
- Check: scorers; City's score at Brighton; final points; the single league defeat and its date and score (City 2–1 Liverpool, 3 January 2019).

**madrid-champions-league-final** (match). 1 June 2019. Champions League final. Liverpool 2–0 Tottenham Hotspur.
Salah scored from a penalty inside two minutes and Origi added a second in the 87th. It was Liverpool's sixth European Cup and Klopp's first trophy with the club, ending a run of six lost finals.
- Check: date and venue; penalty timing (the club gives 1 minute 48 seconds); Origi's minute; "sixth European Cup"; "first trophy as Liverpool manager"; the count of six lost finals (three with Dortmund, three with Liverpool) and which finals they were.

### Season 2019-20
**club-world-cup-final** (match). 21 December 2019. FIFA Club World Cup final. Liverpool 1–0 Flamengo (after extra time).
Mané set up Firmino for the only goal in the 99th minute, and Liverpool won the Club World Cup for the first time. With the first team in Qatar, a young side had lost 5–0 at Aston Villa in the League Cup.
- Check: date; minute of the goal and the assist; "first time"; the League Cup quarter-final date and score at Villa Park (the night before the 18 December semi-final).

**champions-of-england-2020** (moment). 25 June 2020.
Chelsea's 2–1 win over Manchester City on 25 June confirmed the title with seven games left. The season had been suspended on 13 March and restarted behind closed doors; the trophy was lifted before an empty Kop on 22 July.
- Check: Chelsea 2–1 City on 25 June 2020 and that it confirmed Liverpool's title with seven games left; suspension date 13 March 2020; the trophy presentation on 22 July 2020.
  - pandemic-suspension-2020: March to June 2020. The Premier League suspended its season on 13 March; Liverpool's first match back was on 21 June, behind closed doors. Check both dates.
  - trophy-presentation-2020: 22 July 2020. After a 5–3 win over Chelsea, Kenny Dalglish handed the trophy to Jordan Henderson, who lifted it on a stage built on the Kop. Check the score, and who handed over and lifted the trophy.

## Out of scope
Do not research or comment on anything about Heysel or Hillsborough, transfer fees, or the editorial choice of which matches are included.
