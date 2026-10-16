# Methodology and eligibility

## Scope

Direct Bundesliga-to-PL physical arrivals summer 2010 to summer 2026. League matches only. Cutoff 16 October 2026; no result after that date is used.

## Fee threshold

Reported nominal GBP package at least £25m; potential add-ons count when stated. It is an expensive-deal screen, not a guaranteed-cash-spend census. No wages, agent fees or inflation adjustment.

## Fee hierarchy

Prefer contemporary Sky GBP reports; BBC/Guardian/other reputable reporting where needed. Prefer explicit club disclosure when available. Store reported base and maximum separately; blank split means UNVERIFIED, not zero add-ons. Malen is a disputed inclusion.

## Population search

100 highest recorded Bundesliga outgoings across four Transfermarkt pages down to €22.5m, all destinations/positions. Supplement with 2025/2026 all-club transfer lists and user priorities. Screen EUR amounts are not converted at today’s rate or used as GBP fees.

## Coverage limits

A well-documented public-report population, not a club-contract census. Undisclosed contingent fees may change membership. Screen labels and season-age strings can be misleading; inspect transfer route and contemporary role. No artificial sample-size cap.

## Positions

CF, W, SS, AM; attacking CM only with substantial attacking remit/output. Keïta and Manzambi are borderline central midfield inclusions, explicitly flagged. Current database positions do not determine historical roles; Joelinton was recruited in attack.

## Arrival clock

First physical PL arrival. Pulisic’s January purchase with loan-back starts in 2019/20. Tel’s February 2025 loan starts 2024/25, despite June permanent fee. Cunha benchmark follows same principle. Later English-club moves do not restart the clock.

## Baseline

Final completed origin-league season before arrival, plus previous season when available. Winter arrivals use the previous full campaign, not an unfinished half-season. Immediate pre-transfer partial campaign retained separately and tested.

## PL horizons

PL1, PL2 and PL3 are elapsed football campaigns from arrival, not the next three seasons with positive PL minutes. Championship years and exits remain visible. Winter PL1 is only time after arrival in that completed campaign.

## Partial seasons

2026/27 is partial. Manzambi and Touré have no completed PL1 and are excluded from headline averages. Future seasons stay blank. Available recent partial seasons appear only with explicit labels.

## Provider choice

Understat retrieved public league and player JSON covers required major leagues from 2014/15. Use one xG/xA model throughout. Opta Analyst supplies Džeko basic historical counts; no xG is invented. FBref/Opta supplement 2013/14 Firmino/De Bruyne as labelled alternative-provider rows.

## Assists and minutes

Provider goal-assist counts, not fantasy assists or broader Transfermarkt definitions. Understat and Opta minutes can differ. Keep provider attached to every row; do not combine Opta minutes with Understat xG. Own goals are not player goals; assists are event-provider credits.

## Starts

Understat start = recorded position other than Sub. Opta starts = appearances minus substituted-on count. Substitute cameos count as appearances, including any zero-minute rounding cases.

## Missing versus zero

No recorded PL appearances has zero exposure/output but undefined per-90 rates. Future/unavailable fields are blank. A genuine zero goal or assist remains zero. Empty data are not replaced with estimated history.

## Rates

90 × count / provider minutes. GC90=(goals+assists)×90/minutes; NPG90=non-penalty goals×90/minutes. xGC90=(xG+xA)×90/minutes; NPxGC90=(npxG+xA)×90/minutes. xG/shot is total xG divided by all recorded shots, including penalties.

## Change

Absolute change = PL1 rate minus baseline; proportional change = PL1/baseline−1. Undefined if baseline is zero. Headline percent = ratio of unweighted mean player rates−1; distinguish median individual percent and mean individual percent.

## Weights

Primary estimand gives each transfer equal weight. Pooled goals+assists per total minutes is a sensitivity measure, not the same estimand. No minimum exposure imposed on headline; >=900 and >=450 tests supplied.

## Appearance windows

First 10/20/30 EPL appearances after qualifying arrival, ordered by date; may span seasons and later PL clubs. Incomplete windows explicitly labelled. Equal appearance count is not equal minutes, starts, calendar time or opposition.

## Adaptation

Fix entrants through 2023 for three completed elapsed campaigns: 19 players. Report available rates, retention counts and original-cohort contribution totals. Balanced 14-player line is a survivor sensitivity, not proof of recovery for everyone.

## Comparison

Purposive 12-player benchmark, four from each of La Liga, Serie A and Ligue 1, arriving 2015–2023. Same fees, attacking-role and measurement rules. Not random, exhaustive, propensity-matched or a validated top-four-fee census. Prior PL experience flagged and sensitivity supplied.

## Uncertainty

20,000 player-level bootstrap resamples, seed 20261016; percentile 95% intervals. Conditional on selected transfers, not population-sampling guarantees. No causal league inference from overlapping intervals or non-significance.

## Model

Exploratory OLS change in GC90 on Bundesliga indicator, baseline rate, age−24, log reported fee, change in team goals/match, CF indicator; 18 Bundesliga + 12 controls. HC3 standard errors and approximate normal intervals. Too small for a full injury/tactical/year-adjusted causal model.

## Team context

Full-season team goals, xG and points per match from same provider; multi-team rows not given synthetic team averages. A player helps determine team goals, so this is an endogenous contextual proxy, not an independent measure of teammate quality.

## Unmeasured factors

No harmonised injury-days, possession, transition opportunities, pressing, salary, manager-quality or tracking data. Position tags indicate listed role, not exact movement or responsibilities. Causal tactical explanations require further video/medical evidence.

## Reproducibility

CSV files retain raw counts, rates, paired changes, match logs, model inputs, source IDs and retrieval dates. Workbook formulas recompute rate/change fields; frozen statistical resampling/model outputs are supplied with their exact specifications. Round only presentation, never intermediate calculations.

## Explicit exclusions

| Player(s) | Decision | Reason | Evidence |
|---|---|---|---|
| Son Heung-min | Below £25m | Reported £22m. Excluded regardless of success; not quietly counted as a qualifying example. | [E_SON: Son transfer reporting](https://www.theguardian.com/football/2015/aug/26/tottenham-son-heung-min-bayer-leverkusen) |
| André Schürrle | Below £25m | Chelsea move reported £18m. Later Wolfsburg-to-Dortmund move is not a PL transfer. | [E_SCHURRLE: Schurrle Chelsea fee](https://www.bbc.co.uk/sport/football/22434908) |
| Kevin Schade | Below £25m | Reported £22m permanent fee after initial loan. | [E_SCHADE: BBC Schade permanent transfer](https://www.bbc.co.uk/sport/football/65878352) |
| Merlin Röhl | Below £25m | Reported £17.3m obligation; clock would begin at loan arrival. | [E_ROHL: Rohl Everton loan obligation](https://www.bbc.co.uk/sport/football/articles/cj0y50dmmg8o) |
| Ilyas Ansah | Below £25m | Retrieved report €17m; other quoted £21m also below threshold. | [E_ANSAH: Ansah Hull fee](https://www.sofascore.com/news/hull-city-sign-ilyas-ansah-from-union-berlin-in-e17m-deal) |
| Ryan Gravenberch | Role criterion | Central midfield recruit with limited Bayern starting exposure, not a substantial Bundesliga attacking role; not excluded on subsequent Liverpool performance. | [E_GRAV: Opta Gravenberch career](https://theanalyst.com/players/4099/ryan-gravenberch/career) |
| Granit Xhaka | Role criterion | Deep midfield role; outside attacking population. | [P_TM2: Transfermarkt Bundesliga outgoing record transfers, page 2](https://www.transfermarkt.com/bundesliga/transferrekorde/wettbewerb/L1/plus/1/zuab/ab/page/2) |
| İlkay Gündoğan | Below £25m | Sky reported £21m; below threshold irrespective of later attacking development. | [E_GUNDO: Sky Gundogan signing profile](https://www.skysports.com/football/news/10170764/what-would-ilkay-gundogan-bring-to-the-premier-league) |
| Shinji Kagawa | Below £25m | Reported £12m plus £5m potential add-ons; below threshold. | [E_KAGAWA: Kagawa transfer history](https://en.wikipedia.org/wiki/Shinji_Kagawa) |
| Lukas Podolski | Below £25m | Reported £11m; below threshold. | [E_PODOLSKI: BBC Podolski transfer history](https://www.bbc.co.uk/sport/football/33393899) |
| Exequiel Palacios | Role/fee screen | Central/deeper midfield; €22.5m screening figure does not meet GBP rule. | [P_TM4: Transfermarkt Bundesliga outgoing record transfers, page 4](https://www.transfermarkt.com/bundesliga/transferrekorde/wettbewerb/L1/plus/1/zuab/ab/page/4) |
| Gvardiol, de Ligt, Hincapié, Frimpong, van de Ven, Konaté | Defenders | Excluded even when their clubs use them in advanced areas. | [P_TM1: Transfermarkt Bundesliga outgoing record transfers, page 1](https://www.transfermarkt.com/bundesliga/transferrekorde/wettbewerb/L1/plus/1/zuab/ab) |
| Baba, Gbamin, Vestergaard, Leno | Defender/defensive midfielder/goalkeeper | Position exclusions in screened transfers. | [P_TM4: Transfermarkt Bundesliga outgoing record transfers, page 4](https://www.transfermarkt.com/bundesliga/transferrekorde/wettbewerb/L1/plus/1/zuab/ab/page/4) |
| Bellingham, Dembélé, Kolo Muani, Jović, Olmo, Lewandowski, Openda | Non-PL destination | Direct Bundesliga sale went to another league, not the PL. | [P_TM1: Transfermarkt Bundesliga outgoing record transfers, page 1](https://www.transfermarkt.com/bundesliga/transferrekorde/wettbewerb/L1/plus/1/zuab/ab) |
| Matheus Cunha | Intervening club | Hertha to Atlético before Wolves. Included only in La Liga benchmark. | [C11: Matheus Cunha transfer fee](https://www.theguardian.com/football/2022/dec/25/wolves-confirm-matheus-cunha-signing-from-atletico-madrid-in-44m-deal) |
| Alexander Isak | Intervening club | Real Sociedad to Newcastle is the relevant direct move. Included only in La Liga benchmark. | [C09: Alexander Isak transfer fee](https://www.theguardian.com/football/2022/aug/24/newcastle-alexander-isak-real-sociedad-record-59m) |
| Jesper Lindstrøm, Joshua Zirkzee | Intervening club | Napoli and Bologna respectively intervened before England. | [P_TM3: Transfermarkt Bundesliga outgoing record transfers, page 3](https://www.transfermarkt.com/bundesliga/transferrekorde/wettbewerb/L1/plus/1/zuab/ab/page/3) |
| Rasmus Højlund | Origin league | Atalanta to Manchester United; not a German Bundesliga export. Included in Serie A benchmark. | [C02: Rasmus Højlund transfer fee](https://www.bbc.co.uk/sport/football/66319320) |
| Pre-2010 moves including Owen Hargreaves | Outside dates | Transfer window predates summer 2010. | [P_TM4: Transfermarkt Bundesliga outgoing record transfers, page 4](https://www.transfermarkt.com/bundesliga/transferrekorde/wettbewerb/L1/plus/1/zuab/ab/page/4) |

## Reconciled source conflicts

| Item | Adopted | Alternative | Decision |
|---|---|---|---|
| Malen fee / eligibility | £27.7m reported maximum, £21m initial (Sky) | £19m + £2.5m (BBC) | Include under preferred Sky package rule; repeat excluding him. Decline is 29.2% with him, 31.5% without. |
| Firmino fee | £29m maximum; £21.3m secondary reported base | Initial Sky news rounded £21m to £28m maximum | Later Sky report supports £29m; historical table supports £21.3m. Guaranteed-only sensitivity excludes him either way. |
| Salah fee | £36.9m initial + £7m = £43.9m maximum | Liverpool-side and Sky reports lower; £30.8m/£34.3m not retained | Prefer selling club €42m + €8m declaration, with contemporary ESPN GBP conversion. Membership unchanged. |
| Lacazette fee | £46.5m initial, £52.6m maximum | £52.7m in other contemporary reporting | BBC contemporary package used; difference is rounding/conversion, no membership effect. |
| Füllkrug fee | £27.5m package, split unresolved | €27m in Transfermarkt, £27m in other reporting | GBP Sky report governs; no fabricated guaranteed/add-on split. |
| Manzambi fee / role | £52m reported, split unresolved; borderline CM | Other amounts circulate; screen labels AM, match positions mostly DMC | Fee safely over threshold but not settled contract amount. Keep role caveat explicit; partial first season excluded from headline. |
| Wirtz minutes | Understat for rates; Opta counts separately | 2024/25 2365 vs 2355; 2025/26 2426 vs 2389; 2026/27 472 vs 470 | Do not blend denominator conventions; observed goals/assists/apps agree. Reasons for all minute differences are not independently established. |
| Bailey age | 23 at signing | Retrospective transfer table displays 24 | Contemporary signing report preferred. Other ages are reported whole-year transfer ages, not exact decimal ages. |

The full 100-record discovery screen is preserved in `data/population_screen.csv`. An EUR rank list is a discovery tool, not proof that every contractual bonus is public. Malen demonstrates why cross-source eligibility sensitivity is necessary.
