# International breaks and Liverpool — publication verification

Audit date: 24 September 2026. Article: `international-break-liverpool-analysis`.

Denny explicitly authorised verification followed by publication on 24 September 2026. This is a supporting research record, not another article. The supplied title, publication date, excerpt, canonical slug, Analysis category and season are preserved.

## Finding and confidence

**HIGH confidence in the checked descriptive results under the stated inclusion rules. MODERATE confidence in the model-dependent adjusted association. LOW confidence in any causal claim that international breaks or lunchtime starts are harmless: this study does not establish that.**

The principal numbers in the supplied draft were independently reproduced. The original international-break calculation script was not supplied. The audit rebuilt the sample and regressions from raw public match records preserved in the same-day European Hangover research archive. Only raw Premier League records were reused; no European-exposure labels or estimates were used.

The independent reproduction script is [international-break-liverpool-analysis.py](international-break-liverpool-analysis.py). It asserts cross-source match checks and writes the complete match-level comparison, break list, Liverpool first-game register and model estimates.

## Data and inclusion checks

All eleven Football-Data season files contain 380 completed matches. ESPN timestamps were converted to Europe/London before matching. **All 4,180 fixture dates, home/away pairings and full-time scores agree one-to-one**, with zero missing fixtures or score discrepancies. Cross-source agreement is not proof against shared upstream errors. Points are on-field results, not disciplinary deductions.

The draft's claim that every Liverpool and champion total had been checked against official final tables was replaced with the full cross-source check actually performed. The 2025–26 Premier League table was separately retrieved and agrees with Liverpool's reconstructed 60 points and Arsenal's 85. Not every historical official table was opened in this audit.

Qualifying gaps are consecutive league-wide match dates at least 12 days apart, with the pre-gap date in August, September, October, November or March. Exclusions: 9 March–17 June 2020 (Covid), 4–16 September 2022 (postponements after the Queen's death), and 13 November–26 December 2022 (World Cup). The genuine September 2022 international gap, 18 September–1 October, remains included.

There are 40 qualifying breaks. Each club's first league fixture must be on or after the league restart and before restart plus seven days. All 20 clubs qualify for all 40 breaks: **800 club-results from 400 distinct matches**. This is the first league game, not necessarily the first match in all competitions. Windows outside this rule, including before a season begins, are outside the study.

The Klopp sample runs from his October 2015 appointment to the final league match in May 2024. Rodgers' September 2015 return is excluded. Early means before 13:00 UK local time, not UTC. The published lunchtime comparison is restricted to Klopp's tenure.

## Reproduced descriptive results

| Sample | Games | W | D | L | Points | PPG |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Liverpool first games back | 40 | 25 | 9 | 6 | 84 | 2.100000 |
| Liverpool other league games | 378 | 229 | 90 | 59 | 777 | 2.055556 |
| Klopp first games back | 31 | 20 | 9 | 2 | 69 | 2.225806 |
| Klopp other league games | 303 | 189 | 69 | 45 | 636 | 2.099010 |
| Klopp early returns | 14 | 8 | 4 | 2 | 28 | 2.000000 |
| Klopp later returns | 17 | 12 | 5 | 0 | 41 | 2.411765 |
| Big six v rest, first games back | 168 | 115 | 25 | 28 | 370 | 2.202381 |
| Big six v rest, other games | 1680 | 1048 | 327 | 305 | 3471 | 2.066071 |

Early starts are 14/31 (45.16%) of Klopp's returns and 34/303 (11.22%) of his other league matches. Early opponents' other-37-match PPG averages 1.621622, versus 1.456280 for later opponents. Away fixtures: 9/14 early, 8/17 later. The two early defeats were City away, 0–5 on 9 September 2017 and 1–4 on 1 April 2023.

Liverpool won all four returns in 2018–19 and 2021–22. In 2022–23 they drew 3–3 at home to Brighton and lost 1–4 at City. Across Slot's two seasons there were five wins and three defeats in eight returns. The two 2025–26 home defeats were United on 19 October and Forest on 22 November.

The descriptive baseline pools the other league matches across the included seasons. The adjusted model enforces the within-season comparison; seasons have different numbers of qualifying breaks.

## Models and uncertainty

Opponent strength is the opponent's on-field points in its other 37 league fixtures divided by 37, excluding the measured fixture. This is retrospective season strength, not current form, injury status or international workload.

Liverpool OLS, 418 observations:

`points ~ post_break + home + opponent_other37_ppg + season_fixed_effects`

The after-break estimate is **+0.1180875 PPG**. HC1 robust 95% interval: **−0.2088791 to +0.4450541**, reproducing the draft's approximate range. HC3 interval: **−0.2204576 to +0.4566326**. Season-clustered t interval: **−0.1912051 to +0.4273801**; eleven season groups is a small cluster count. None establishes an advantage or a penalty. The intervals depend on model and sampling assumptions and are not hard limits.

Klopp's 334-match model uses separate early-return and later-return indicators, season effects, home/away and opponent strength. Early against ordinary matches: **+0.1252939**, HC3 interval **−0.3233877 to +0.5739754**. Restricting the comparison to the 31 returns gives early versus later **−0.1294683**, HC3 interval **−1.0183709 to +0.7594344**. That comparison is extremely imprecise; absence of a significant penalty is not equivalence.

The big-six model uses 1,848 observations, only games against the rest, with club-season effects, home/away and opponent strength. Post-break estimate **+0.1337596**, HC3 interval **−0.0560996 to +0.3236188**; club-season clustered interval **−0.0569467 to +0.3244659**. Big six means Arsenal, Chelsea, Liverpool, Manchester City, Manchester United and Tottenham. It is a proxy comparison, not identical matched fixtures or counted call-ups.

Paired league-wide points and goal difference cannot establish whether both sides performed worse in an absolute sense. The article does not use them for that purpose. Injuries, fatigue, travel, player minutes and any total season-wide cost are unmeasured. Fixture selection is not random. Adaptation to travel remains part of the observed result, not separately estimated.

## Retrieved sources and confidence

- **Football-Data — HIGH for the results independently matched to ESPN.** Archived raw CSVs `pl_2015.csv` through `pl_2025.csv`, from `https://www.football-data.co.uk/mmz4281/1516/E0.csv` through `https://www.football-data.co.uk/mmz4281/2526/E0.csv`. The raw response files were parsed during this audit, not just an earlier derived table.
- **ESPN — HIGH for cross-checked results; MEDIUM-HIGH for historical times, with selected primary checks.** Archived calendar scoreboards `espn_cal_2015_eng.1.json` through `espn_cal_2026_eng.1.json`; endpoint pattern `https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=2015&limit=1000`. Only completed events in the eleven specified seasons were used.
- **Liverpool FC — HIGH for what Klopp said, not independent proof of the estimated call-up count.** [12 November 2023 press conference](https://www.liverpoolfc.com/news/jurgen-klopp-press-conference-liverpool-3-0-brentford): one training session, approximately 30 internationals and a planned shared South American flight.
- **PA / Carl Markham — HIGH for contemporary quotation corroboration.** [12 November 2023 report, reproduced by This Is Anfield](https://www.thisisanfield.com/2023/11/they-cannot-feel-football-jurgen-klopp-hits-out-at-man-city-early-kick-off-decision-makers/). Confirms the short direct quotation. The unverified GOAL attribution was removed.
- **Liverpool FC — HIGH for scheduled starts.** [Wolves, 16 September 2023 at 12.30](https://www.liverpoolfc.com/news/five-premier-league-fixture-changes-lfc-august-and-september); [Everton, 21 October 2023 at 12.30](https://www.liverpoolfc.com/news/three-premier-league-fixture-changes-liverpool-october); November's City start is also supported by the press conference above.
- **Liverpool FC — HIGH for the City defeats.** [9 September 2017](https://www.liverpoolfc.com/news/first-team/274708-report-10-man-reds-suffer-heavy-defeat-at-man-city); [1 April 2023](https://www.liverpoolfc.com/news/liverpool-beaten-away-manchester-city-premier-league).
- **Liverpool FC — HIGH for selected recent results.** [2025–26 results](https://www.liverpoolfc.com/matches/mens-team/results/2025); [Forest defeat, 22 November 2025](https://www.liverpoolfc.com/news/liverpool-suffer-premier-league-defeat-nottingham-forest-anfield); [international-return statistics, 16 October 2025](https://www.liverpoolfc.com/news/13-opta-stats-know-ahead-liverpool-v-manchester-united).
- **Premier League — HIGH, competition authority.** [2025–26 final table](https://www.premierleague.com/en/tables/premier-league/2025-26), for the selective season-total check described above.
- **Liverpool FC — HIGH for the fixture as scheduled at audit time; later changes remain possible.** [17 August 2026 fixture update](https://www.liverpoolfc.com/news/fixture-updates-new-dates-anfield-games-against-man-city-and-arsenal): City at Anfield, Sunday 11 October 2026, 16:30 BST.

The draft originally named OpenFootball. A 2025–26 OpenFootball file was inspected, but the full independent verification rests on Football-Data and ESPN. The published methods now describe that audit rather than claiming an unperformed eleven-file OpenFootball audit.

## Limited publication corrections

Removed unverified GOAL attribution; identified the international-player count as Klopp's estimate; removed an untested explanation of broadcaster motives; replaced wording suggesting the raw early/later gap was intrinsically small with the verified uncertainty finding; described the big-six comparison accurately; used past tense for Slot's completed period; and replaced unsupported methodological verification claims with the checks actually performed. Principal figures and the central conclusion were retained.

Sources are retained here rather than in an article sources section. No unrelated content or application code is changed. The current Article schema, loader and publishing instructions were read. Local YAML/frontmatter checks passed. Full repository tests/lint/build were not run locally because a checkout was unavailable; deployment validation must be reported separately from actual Vercel output.

## Reproduction and retained outputs

Use Python with pandas, numpy and statsmodels. Put the raw response files named above in one directory:

```sh
python docs/research/international-break-liverpool-analysis.py --raw /path/to/raw --out /path/to/audit-output
```

The script produces `identified-breaks.csv`, `liverpool-first-games.csv`, `all-club-matches.csv` and `model-results.csv`. The audited raw snapshots and resulting outputs were retained with the research work. They contain public match records, not private credentials. Later upstream corrections can change a fresh download.

Publication Markdown SHA-256: `43358eee4d064b6092a223649b40c4598effd3ce3fd65cfb1555152ffd59f9a3`.
