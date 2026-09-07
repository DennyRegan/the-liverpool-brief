# History Explorer factual audit

Checked 7 September 2026. Production facts live in [eras.json](../content/history/liverpool/eras.json), separately from presentation code. Each era also exposes its sources and date notes on the website.

The primary references are Liverpool FC's [past managers](https://www.liverpoolfc.com/info/past-managers), individual manager profiles, [club honours](https://www.liverpoolfc.com/info/honours), and dated club announcements. [LFChistory's managerial register](https://www.lfchistory.net/managers) supplies exact dates and detailed tenure context. Every linked production source was retrieved during the audit. Official player profiles and contemporary team reports supplement the manager profiles for player associations.

Confidence is high for honours and the reported managerial years. Exact boundaries with conflicting source conventions are explicitly qualified below and in the era data. Key-player selections and concise descriptions of playing character are editorial judgements grounded in the sources, not exhaustive or statistically ranked claims.

## Tenure audit

These ISO dates drive automatic article placement. The interface shows years. The last entry is open as of the audit date, not a forecast.

| Permanent era ID | Manager | Start | End | Tenure references |
| --- | --- | --- | --- | --- |
| `bill-shankly` | Bill Shankly | 1959-12-01 | 1974-07-12 | [Liverpool FC · Bill Shankly](https://www.liverpoolfc.com/info/bill-shankly); [LFChistory · Bill Shankly](https://www.lfchistory.net/managers/9) |
| `bob-paisley` | Bob Paisley | 1974-07-26 | 1983-07-01 | [Liverpool FC · Bob Paisley](https://www.liverpoolfc.com/info/bob-paisley-0); [LFChistory · Bob Paisley](https://www.lfchistory.net/managers/10) |
| `joe-fagan` | Joe Fagan | 1983-07-01 | 1985-05-29 | [Liverpool FC · Joe Fagan](https://www.liverpoolfc.com/info/joe-fagan); [LFChistory · Joe Fagan](https://www.lfchistory.net/managers/11) |
| `kenny-dalglish-1985-1991` | Kenny Dalglish | 1985-05-30 | 1991-02-22 | [Liverpool FC · Kenny Dalglish](https://www.liverpoolfc.com/info/kenny-dalglish-first-spell); [LFChistory · Kenny Dalglish](https://www.lfchistory.net/managers/12) |
| `ronnie-moran-1991` | Ronnie Moran | 1991-02-22 | 1991-04-15 | [Liverpool FC · Ronnie Moran](https://www.liverpoolfc.com/info/ronnie-moran-0); [LFChistory · Ronnie Moran](https://www.lfchistory.net/managers/17) |
| `graeme-souness` | Graeme Souness | 1991-04-16 | 1994-01-28 | [Liverpool FC · Graeme Souness](https://www.liverpoolfc.com/info/graeme-souness-0); [LFChistory · Graeme Souness](https://www.lfchistory.net/managers/13) |
| `roy-evans` | Roy Evans | 1994-01-31 | 1998-07-16 | [Liverpool FC · Roy Evans](https://www.liverpoolfc.com/info/roy-evans-0); [LFChistory · Roy Evans](https://www.lfchistory.net/managers/14) |
| `evans-houllier-1998` | Roy Evans & Gérard Houllier | 1998-07-16 | 1998-11-12 | [Liverpool FC · Roy Evans & Gérard Houllier](https://www.liverpoolfc.com/info/gerard-houllier); [LFChistory · Roy Evans & Gérard Houllier](https://www.lfchistory.net/managers/15) |
| `gerard-houllier` | Gérard Houllier | 1998-11-12 | 2004-05-24 | [Liverpool FC · Gérard Houllier](https://www.liverpoolfc.com/info/gerard-houllier); [LFChistory · Gérard Houllier](https://www.lfchistory.net/managers/16) |
| `rafael-benitez` | Rafael Benítez | 2004-06-16 | 2010-06-03 | [Liverpool FC · Rafael Benítez](https://www.liverpoolfc.com/info/rafael-benitez); [LFChistory · Rafael Benítez](https://www.lfchistory.net/managers/20) |
| `roy-hodgson` | Roy Hodgson | 2010-07-01 | 2011-01-08 | [Liverpool FC · Roy Hodgson](https://www.liverpoolfc.com/info/roy-hodgson); [LFChistory · Roy Hodgson](https://www.lfchistory.net/managers/22) |
| `kenny-dalglish-2011-2012` | Kenny Dalglish | 2011-01-08 | 2012-05-16 | [Liverpool FC · Kenny Dalglish](https://www.liverpoolfc.com/info/kenny-dalglish-second-spell); [LFChistory · Kenny Dalglish](https://www.lfchistory.net/managers/24) |
| `brendan-rodgers` | Brendan Rodgers | 2012-06-01 | 2015-10-04 | [Liverpool FC · Brendan Rodgers](https://www.liverpoolfc.com/info/brendan-rodgers); [LFChistory · Brendan Rodgers](https://www.lfchistory.net/managers/25) |
| `jurgen-klopp` | Jürgen Klopp | 2015-10-08 | 2024-05-19 | [Liverpool FC · Jürgen Klopp](https://www.liverpoolfc.com/info/jurgen-klopp); [LFChistory · Jürgen Klopp](https://www.lfchistory.net/managers/28) |
| `arne-slot` | Arne Slot | 2024-06-01 | 2026-05-30 | [Liverpool FC · Arne Slot](https://www.liverpoolfc.com/info/arne-slot); [LFChistory · Arne Slot](https://www.lfchistory.net/managers/29) |
| `andoni-iraola` | Andoni Iraola | 2026-06-04 | Current at review | [Liverpool FC · Andoni Iraola](https://www.liverpoolfc.com/team/mens/staff/andoni-iraola); [LFChistory · Andoni Iraola](https://www.lfchistory.net/managers/30) |

## Counting honours consistently

The production arrays record the actual winning years/seasons; the UI derives counts, eliminating a separate manually maintained total. They were cross-checked between each manager's record and the [official club honours list](https://www.liverpoolfc.com/info/honours).

Major honours include the top division, FA Cup, League Cup, European Cup/Champions League, UEFA Cup, UEFA Super Cup and FIFA Club World Cup. Charity/Community Shields are excluded consistently. Shankly's 1961–62 Second Division title and Dalglish's 1986 Football League Super Cup are acknowledged separately. This scope is stated on the landing page and detail pages.

This avoids treating differing headline trophy totals as equivalent. For example, Paisley's profile headline omits the 1977 UEFA Super Cup from its familiar league/European/League Cup/UEFA Cup count; the official honours list confirms it and the feature includes it. Dalglish's first-spell profile calls his second season empty-handed, while the club honours list records the 1986 Football League Super Cup. The latter is shown as a separate additional honour, not silently discarded or counted as an FA/League Cup. No claim that all Liverpool trophies are represented is made.

## Date discrepancies and boundary decisions

- **Paisley, 1974:** the [club's dated appointment retrospective](https://www.liverpoolfc.com/news/first-team/189674-in-quotes-paisley-s-words-of-wisdom) says 26 July; [LFChistory](https://www.lfchistory.net/managers/10) records 13 August. The guide uses the club's 26 July appointment. Both sources and the discrepancy are retained. Confidence in the chosen convention: medium; managerial years and honours: high.
- **Dalglish, 1991:** the [club's David Speedie profile](https://www.liverpoolfc.com/info/david-speedie) records the resignation announcement on 22 February, while [LFChistory](https://www.lfchistory.net/managers/12) lists contract expiry on 21 February. The guide records the announcement on 22 February and incoming caretaker Moran on the same day. Automatic placement assigns shared handover dates to the incoming era. Confidence in the convention: medium; resignation month/year: high.
- **Klopp/Slot, 2024:** Klopp's final match was 19 May according to his [official profile](https://www.liverpoolfc.com/info/jurgen-klopp). [LFChistory](https://www.lfchistory.net/managers/28) lists a later contract expiry, while the [official Slot appointment](https://www.liverpoolfc.com/news/arne-slot-become-liverpool-fcs-new-head-coach) explicitly starts his role on 1 June. The guide uses Klopp's final match as the end of the match era, labels that decision, and uses Slot's formal start date. It does not represent the final-match date as a legal contract expiry. The late-May gap needs explicit metadata for a broad transition piece. Confidence in these reported events: high; the matching boundary is an editorial convention.
- **Shankly, 1974:** the [club's retirement account](https://www.liverpoolfc.com/news/50-years-ago-today-when-bill-shankly-shocked-football-world-0) confirms 12 July. The gap before Paisley's appointment is preserved.
- **Joint management, 1998:** Evans's sole tenure ends and the [joint tenure](https://www.lfchistory.net/managers/15) begins on 16 July. It ends when Houllier takes sole charge on 12 November. The distinct entry avoids overlapping whole-manager ranges. Houllier's [official profile](https://www.liverpoolfc.com/info/gerard-houllier) also supports the joint appointment and Phil Thompson's subsequent deputy period during his illness.

## Current-era verification

The launch data does not assume Slot is still in charge. The [club's 30 May 2026 statement](https://www.liverpoolfc.com/news/liverpool-fc-statement-13) records his immediate departure. The [4 June 2026 appointment announcement](https://www.liverpoolfc.com/news/liverpool-fc-appoint-andoni-iraola-new-head-coach) and [current staff profile](https://www.liverpoolfc.com/team/mens/staff/andoni-iraola) establish Andoni Iraola as the new head coach. Slot's 2024–25 title is confirmed by his [official profile](https://www.liverpoolfc.com/info/arne-slot) and club honours list. These facts have high confidence at the recorded review date.

Iraola's player list is labelled an early squad. Van Dijk, Mac Allister, Wirtz and Isak appear in the club's [4 September 2026 Ipswich team announcement](https://www.liverpoolfc.com/news/confirmed-liverpool-line-v-ipswich-town-1). Their selection does not claim they will define the completed era. Current records must be reviewed again when management or honours change.

## Context and player checks

Manager profiles support each concise overview: Shankly's promotion and first FA Cup; Paisley's six league titles and three European Cups; Fagan's 1984 treble and Heysel context; Dalglish's double and 1987–88 team; Souness's 1992 FA Cup; Evans's 1995 League Cup; Houllier's 2001 treble; Benítez's Istanbul recovery and subsequent finals; Hodgson's brief tenure; Dalglish's 2012 League Cup; Rodgers's 2013–14 challenge; Klopp's European, world and league honours; and the verified recent succession.

Heysel's 39 deaths and Fagan's prior retirement decision were checked against his [official biography](https://www.liverpoolfc.com/info/joe-fagan). Hillsborough is acknowledged with restraint in the [first Dalglish era](https://www.liverpoolfc.com/info/kenny-dalglish-first-spell); no invented quotation or outdated death toll is introduced.

Supplementary player evidence is attached to the relevant eras: [Moran's Leeds match](https://www.liverpoolfc.com/news/first-team/216020-april-13-on-this-day-in-lfc-history-5), [the 1984 European final](https://www.liverpoolfc.com/news/classic-match-i-dont-know-what-it-i-love-it-story-rome-1984), [McManaman's record](https://www.lfchistory.net/players/371), [McAllister](https://www.liverpoolfc.com/info/gary-mcallister), [Carragher](https://www.liverpoolfc.com/info/jamie-carragher), [Alonso and Reina in 2006](https://www.liverpoolfc.com/news/day-story-how-liverpool-overcame-steven-gerrard-red-card-beat-everton), [Kuyt and Henderson in 2012](https://www.liverpoolfc.com/news/first-team/118704-i-ve-never-known-anything-like-it), [Sterling](https://www.liverpoolfc.com/info/raheem-sterling), and [Slot's February 2025 squad](https://www.liverpoolfc.com/news/manchester-city-v-liverpool-team-news-3). Membership is factual; the small selection remains editorial.

No source photographs were downloaded. No original Archive articles were generated, rewritten or duplicated. The two existing articles retain their original files and URLs.
