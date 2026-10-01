# Classic match drafts — progress index

Updated 14 September 2026. Fifteen new articles (longlist 002–016) are saved for review. None of these drafts has been published. Entry 001 was handled previously; the separate Barcelona 1976 draft is also awaiting review.

## Saved drafts

| ID | Match date | Season | Markdown draft |
|---|---|---|---|
| 002 | 1971-01-30 | 1970-71 | [002-liverpool-arsenal-1971-toshack-smith.md](sandbox:/workspace/scratch/ac94f85add39/archive-drafts/002-liverpool-arsenal-1971-toshack-smith.md) |
| 003 | 1971-02-06 | 1970-71 | [003-leeds-liverpool-1971-early-winner.md](sandbox:/workspace/scratch/ac94f85add39/archive-drafts/003-leeds-liverpool-1971-early-winner.md) |
| 004 | 1971-03-10 | 1970-71 | [004-liverpool-bayern-1971-alun-evans.md](sandbox:/workspace/scratch/ac94f85add39/archive-drafts/004-liverpool-bayern-1971-alun-evans.md) |
| 005 | 1971-03-16 | 1970-71 | [005-tottenham-liverpool-1971-heighway-clemence.md](sandbox:/workspace/scratch/ac94f85add39/archive-drafts/005-tottenham-liverpool-1971-heighway-clemence.md) |
| 006 | 1971-03-27 | 1970-71 | [006-liverpool-everton-1971-brian-hall.md](sandbox:/workspace/scratch/ac94f85add39/archive-drafts/006-liverpool-everton-1971-brian-hall.md) |
| 007 | 1971-05-08 | 1970-71 | [007-liverpool-arsenal-1971-fa-cup-final.md](sandbox:/workspace/scratch/ac94f85add39/archive-drafts/007-liverpool-arsenal-1971-fa-cup-final.md) |
| 008 | 1971-11-06 | 1971-72 | [008-liverpool-arsenal-1971-ian-ross.md](sandbox:/workspace/scratch/ac94f85add39/archive-drafts/008-liverpool-arsenal-1971-ian-ross.md) |
| 009 | 1971-12-11 | 1971-72 | [009-liverpool-derby-1971-jack-whitham.md](sandbox:/workspace/scratch/ac94f85add39/archive-drafts/009-liverpool-derby-1971-jack-whitham.md) |
| 010 | 1972-03-04 | 1971-72 | [010-liverpool-everton-1972-four-goal-derby.md](sandbox:/workspace/scratch/ac94f85add39/archive-drafts/010-liverpool-everton-1972-four-goal-derby.md) |
| 011 | 1972-03-18 | 1971-72 | [011-liverpool-newcastle-1972-five-goals.md](sandbox:/workspace/scratch/ac94f85add39/archive-drafts/011-liverpool-newcastle-1972-five-goals.md) |
| 012 | 1972-04-03 | 1971-72 | [012-manchester-united-liverpool-1972-thompson-debut.md](sandbox:/workspace/scratch/ac94f85add39/archive-drafts/012-manchester-united-liverpool-1972-thompson-debut.md) |
| 013 | 1972-05-01 | 1971-72 | [013-derby-liverpool-1972-mcgovern-title-race.md](sandbox:/workspace/scratch/ac94f85add39/archive-drafts/013-derby-liverpool-1972-mcgovern-title-race.md) |
| 014 | 1972-08-12 | 1972-73 | [014-liverpool-manchester-city-1972-opening-day.md](sandbox:/workspace/scratch/ac94f85add39/archive-drafts/014-liverpool-manchester-city-1972-opening-day.md) |
| 015 | 1972-09-23 | 1972-73 | [015-liverpool-sheffield-united-1972-five-goals.md](sandbox:/workspace/scratch/ac94f85add39/archive-drafts/015-liverpool-sheffield-united-1972-five-goals.md) |
| 016 | 1972-09-30 | 1972-73 | [016-leeds-liverpool-1972-phil-boersma.md](sandbox:/workspace/scratch/ac94f85add39/archive-drafts/016-leeds-liverpool-1972-phil-boersma.md) |

## Checks completed

All fifteen historical dates match the longlist and independently researched match records. Season, article type, unique slug, relationship ID format and existing relationship kinds passed the site schema checks. Each article was selected by the actual This Week logic in its matching anniversary week and excluded in an unrelated week. Prepared daily event entries also passed the event schema and linked to the intended article slug.

The validation supplied a temporary publication date in memory only. Draft files intentionally have no publication date or factual approval flag. These are added after approval. Research disagreements and source-confidence notes are private editor material at the bottom of each file.

## Publication and anniversary handover

After approval, use content/archive/liverpool/<slug>.md, add the actual publication date as date, and set editorialMode: factual. Keep articleType: match and the verified historicalEventDate and season. Remove the private editor notes and duplicate H1 before importing. Approved match articles belong in History → Matches.

The historicalEventDate already selects the article under This Week → Further reading during the matching Monday–Sunday week. It does not create a daily event card. Import or update the corresponding event using the prepared metadata below, with archiveSlug pointing to the approved article. Add article and event together; the site rejects an event that links to a missing article. Check existing events before adding a duplicate.

New reference entries needed at publication (validated together with the existing registry):

~~~json
[
  {
    "id": "arsenal",
    "kind": "opposition",
    "label": "Arsenal"
  },
  {
    "id": "leeds-united",
    "kind": "opposition",
    "label": "Leeds United"
  },
  {
    "id": "elland-road",
    "kind": "location",
    "label": "Elland Road"
  },
  {
    "id": "bayern-munich",
    "kind": "opposition",
    "label": "Bayern Munich"
  },
  {
    "id": "white-hart-lane",
    "kind": "location",
    "label": "White Hart Lane"
  },
  {
    "id": "old-trafford",
    "kind": "location",
    "label": "Old Trafford"
  },
  {
    "id": "derby-county",
    "kind": "opposition",
    "label": "Derby County"
  },
  {
    "id": "manchester-united",
    "kind": "opposition",
    "label": "Manchester United"
  },
  {
    "id": "baseball-ground",
    "kind": "location",
    "label": "Baseball Ground"
  },
  {
    "id": "manchester-city",
    "kind": "opposition",
    "label": "Manchester City"
  },
  {
    "id": "sheffield-united",
    "kind": "opposition",
    "label": "Sheffield United"
  }
]
~~~

Prepared daily event metadata — drafts only, not imported:

### 002 — 1971-01-30

No existing event on this historical date found in the checked checkout.

Suggested event file: content/this-week/liverpool/1971-01-30-liverpool-arsenal-1971-toshack-smith.md

~~~yaml
---
month: 1
day: 30
year: 1971
title: "Liverpool 2–0 Arsenal: a win against the coming Double winners"
summary: "Liverpool scored near the beginning of each half. Arsenal left Anfield without a reply."
source: "https://www.lfchistory.net/games/601"
archiveSlug: "liverpool-arsenal-1971-toshack-smith"
---
~~~

### 003 — 1971-02-06

No existing event on this historical date found in the checked checkout.

Suggested event file: content/this-week/liverpool/1971-02-06-leeds-liverpool-1971-early-winner.md

~~~yaml
---
month: 2
day: 6
year: 1971
title: "Leeds United 0–1 Liverpool: an early lead, a long defence"
summary: "Liverpool had beaten Arsenal. Seven days later, they beat the league leaders too."
source: "https://www.lfchistory.net/games/602"
archiveSlug: "leeds-liverpool-1971-early-winner"
---
~~~

### 004 — 1971-03-10

No existing event on this historical date found in the checked checkout.

Suggested event file: content/this-week/liverpool/1971-03-10-liverpool-bayern-1971-alun-evans.md

~~~yaml
---
month: 3
day: 10
year: 1971
title: "Liverpool 3–0 Bayern Munich: Alun Evans returns with a hat-trick"
summary: "Alun Evans had been out for four months. In his first start back, he scored three times against Bayern Munich."
source: "https://www.lfchistory.net/games/608"
archiveSlug: "liverpool-bayern-1971-alun-evans"
---
~~~

### 005 — 1971-03-16

No existing event on this historical date found in the checked checkout.

Suggested event file: content/this-week/liverpool/1971-03-16-tottenham-liverpool-1971-heighway-clemence.md

~~~yaml
---
month: 3
day: 16
year: 1971
title: "Tottenham Hotspur 0–1 Liverpool: Heighway scores, Clemence keeps Spurs out"
summary: "Steve Heighway scored the goal that took Liverpool into the 1971 FA Cup semi-final. At the other end, Ray Clemence made sure it was enough."
source: "https://www.lfchistory.net/games/610"
archiveSlug: "tottenham-liverpool-1971-heighway-clemence"
---
~~~

### 006 — 1971-03-27

No existing event on this historical date found in the checked checkout.

Suggested event file: content/this-week/liverpool/1971-03-27-liverpool-everton-1971-brian-hall.md

~~~yaml
---
month: 3
day: 27
year: 1971
title: "Liverpool 2–1 Everton: Brian Hall’s first goal sends Liverpool to Wembley"
summary: "Brian Hall’s first Liverpool goal was the winner in an FA Cup semi-final against Everton. For a player who had originally come to the city to study mathematics, Old Trafford provided an extraordinary place to make his mark."
source: "https://www.lfchistory.net/games/613"
archiveSlug: "liverpool-everton-1971-brian-hall"
---
~~~

### 007 — 1971-05-08

No existing event on this historical date found in the checked checkout.

Suggested event file: content/this-week/liverpool/1971-05-08-liverpool-arsenal-1971-fa-cup-final.md

~~~yaml
---
month: 5
day: 8
year: 1971
title: "Liverpool 1–2 Arsenal: the final lost after Heighway’s breakthrough"
summary: "For a few minutes at Wembley, Steve Heighway had Liverpool on course to win the FA Cup. His goal early in extra time broke a ninety-minute deadlock. By the end of the afternoon, Arsenal had recovered to complete the Double."
source: "https://www.lfchistory.net/games/626"
archiveSlug: "liverpool-arsenal-1971-fa-cup-final"
---
~~~

### 008 — 1971-11-06

No existing event on this historical date found in the checked checkout.

Suggested event file: content/this-week/liverpool/1971-11-06-liverpool-arsenal-1971-ian-ross.md

~~~yaml
---
month: 11
day: 6
year: 1971
title: "Liverpool 3–2 Arsenal: Ian Ross finds the late winner"
summary: "Ian Ross scored only four goals for Liverpool. His last arrived three minutes from the end against Arsenal, turning a 2–2 draw into victory over the reigning league and FA Cup champions."
source: "https://www.lfchistory.net/games/649"
archiveSlug: "liverpool-arsenal-1971-ian-ross"
---
~~~

### 009 — 1971-12-11

No existing event on this historical date found in the checked checkout.

Suggested event file: content/this-week/liverpool/1971-12-11-liverpool-derby-1971-jack-whitham.md

~~~yaml
---
month: 12
day: 11
year: 1971
title: "Liverpool 3–2 Derby County: Jack Whitham’s afternoon"
summary: "Jack Whitham scored seven goals in his Liverpool career. Three came in one afternoon against Derby County, and Liverpool needed every one of them."
source: "https://www.lfchistory.net/games/654"
archiveSlug: "liverpool-derby-1971-jack-whitham"
---
~~~

### 010 — 1972-03-04

No existing event on this historical date found in the checked checkout.

Suggested event file: content/this-week/liverpool/1972-03-04-liverpool-everton-1972-four-goal-derby.md

~~~yaml
---
month: 3
day: 4
year: 1972
title: "Liverpool 4–0 Everton: a derby won from the first minute"
summary: "Liverpool were ahead before the first minute was over. By the end of the derby at Anfield on 4 March 1972, Everton had conceded four without reply."
source: "https://www.lfchistory.net/games/667"
archiveSlug: "liverpool-everton-1972-four-goal-derby"
---
~~~

### 011 — 1972-03-18

No existing event on this historical date found in the checked checkout.

Suggested event file: content/this-week/liverpool/1972-03-18-liverpool-newcastle-1972-five-goals.md

~~~yaml
---
month: 3
day: 18
year: 1972
title: "Liverpool 5–0 Newcastle United: five scorers and a warning in the tunnel"
summary: "Five Liverpool players scored against Newcastle at Anfield on 18 March 1972. The goalkeeper’s contribution also mattered."
source: "https://www.lfchistory.net/games/669"
archiveSlug: "liverpool-newcastle-1972-five-goals"
---
~~~

### 012 — 1972-04-03

No existing event on this historical date found in the checked checkout.

Suggested event file: content/this-week/liverpool/1972-04-03-manchester-united-liverpool-1972-thompson-debut.md

~~~yaml
---
month: 4
day: 3
year: 1972
title: "Manchester United 0–3 Liverpool: two quick goals and a debut for Phil Thompson"
summary: "Liverpool scored twice in two minutes at Old Trafford on Easter Monday 1972. By the end of the afternoon they had a third goal, another clean sheet and a new first-team player."
source: "https://www.lfchistory.net/games/673"
archiveSlug: "manchester-united-liverpool-1972-thompson-debut"
---
~~~

### 013 — 1972-05-01

No existing event on this historical date found in the checked checkout.

Suggested event file: content/this-week/liverpool/1972-05-01-derby-liverpool-1972-mcgovern-title-race.md

~~~yaml
---
month: 5
day: 1
year: 1972
title: "Derby County 1–0 Liverpool: the goal that left the title hanging"
summary: "John McGovern’s goal ended Derby County’s league season with a win over Liverpool. It did not settle the championship that evening, but it gave Brian Clough’s side the total that would eventually be enough."
source: "https://www.lfchistory.net/games/677"
archiveSlug: "derby-liverpool-1972-mcgovern-title-race"
---
~~~

### 014 — 1972-08-12

No existing event on this historical date found in the checked checkout.

Suggested event file: content/this-week/liverpool/1972-08-12-liverpool-manchester-city-1972-opening-day.md

~~~yaml
---
month: 8
day: 12
year: 1972
title: "Liverpool 2–0 Manchester City: Hall starts a new title challenge"
summary: "Brian Hall needed only three minutes to score Liverpool’s first league goal of 1972–73. Ian Callaghan supplied the second near the end, as a season that would bring the championship began with a 2–0 win against Manchester City."
source: "https://www.lfchistory.net/games/679"
archiveSlug: "liverpool-manchester-city-1972-opening-day"
---
~~~

### 015 — 1972-09-23

No existing event on this historical date found in the checked checkout.

Suggested event file: content/this-week/liverpool/1972-09-23-liverpool-sheffield-united-1972-five-goals.md

~~~yaml
---
month: 9
day: 23
year: 1972
title: "Liverpool 5–0 Sheffield United: three quick goals take Liverpool towards the top"
summary: "Liverpool scored three times in five minutes against Sheffield United, turning a goalless match into a commanding lead. Two further goals after half-time completed a 5–0 win which put them top of the First Division."
source: "https://www.lfchistory.net/games/691"
archiveSlug: "liverpool-sheffield-united-1972-five-goals"
---
~~~

### 016 — 1972-09-30

No existing event on this historical date found in the checked checkout.

Suggested event file: content/this-week/liverpool/1972-09-30-leeds-liverpool-1972-phil-boersma.md

~~~yaml
---
month: 9
day: 30
year: 1972
title: "Leeds United 1–2 Liverpool: Phil Boersma completes the comeback"
summary: "Liverpool came from behind at Elland Road to remain top of the First Division. Phil Boersma supplied the winning goal, having already helped create the equaliser."
source: "https://www.lfchistory.net/games/693"
archiveSlug: "leeds-liverpool-1972-phil-boersma"
---
~~~

## Remaining queue

Next unwritten entry in order: 017 — Liverpool 1–0 Everton, 7 October 1972. Continue in ID order and recheck existing articles before drafting. The longlist contains 199 candidates; this index does not imply that the remainder are written.

| ID | Date | Match | Status |
|---|---|---|---|
| 001 | 21 Nov 1970 | Liverpool 3–2 Everton | Previously published |
| 002 | 30 Jan 1971 | Liverpool 2–0 Arsenal | Draft saved; awaiting approval |
| 003 | 6 Feb 1971 | Leeds United 0–1 Liverpool | Draft saved; awaiting approval |
| 004 | 10 Mar 1971 | Liverpool 3–0 Bayern Munich | Draft saved; awaiting approval |
| 005 | 16 Mar 1971 | Tottenham Hotspur 0–1 Liverpool | Draft saved; awaiting approval |
| 006 | 27 Mar 1971 | Liverpool 2–1 Everton | Draft saved; awaiting approval |
| 007 | 8 May 1971 | Liverpool 1–2 Arsenal, after extra time | Draft saved; awaiting approval |
| 008 | 6 Nov 1971 | Liverpool 3–2 Arsenal | Draft saved; awaiting approval |
| 009 | 11 Dec 1971 | Liverpool 3–2 Derby County | Draft saved; awaiting approval |
| 010 | 4 Mar 1972 | Liverpool 4–0 Everton | Draft saved; awaiting approval |
| 011 | 18 Mar 1972 | Liverpool 5–0 Newcastle United | Draft saved; awaiting approval |
| 012 | 3 Apr 1972 | Manchester United 0–3 Liverpool | Draft saved; awaiting approval |
| 013 | 1 May 1972 | Derby County 1–0 Liverpool | Draft saved; awaiting approval |
| 014 | 12 Aug 1972 | Liverpool 2–0 Manchester City | Draft saved; awaiting approval |
| 015 | 23 Sep 1972 | Liverpool 5–0 Sheffield United | Draft saved; awaiting approval |
| 016 | 30 Sep 1972 | Leeds United 1–2 Liverpool | Draft saved; awaiting approval |
| 017 | 7 Oct 1972 | Liverpool 1–0 Everton | Not drafted in this run |
| 018 | 18 Nov 1972 | Liverpool 3–2 Newcastle United | Not drafted in this run |
| 019 | 2 Dec 1972 | Liverpool 4–3 Birmingham City | Not drafted in this run |
| 020 | 13 Dec 1972 | Liverpool 3–1 Dynamo Berlin | Not drafted in this run |
| 021 | 3 Mar 1973 | Everton 0–2 Liverpool | Not drafted in this run |
| 022 | 10 Apr 1973 | Liverpool 1–0 Tottenham Hotspur | Not drafted in this run |
| 023 | 23 Apr 1973 | Liverpool 2–0 Leeds United | Not drafted in this run |
| 024 | 25 Apr 1973 | Tottenham Hotspur 2–1 Liverpool | Not drafted in this run |
| 025 | 10 May 1973 | Liverpool 3–0 Borussia Mönchengladbach | Not drafted in this run |
| 026 | 23 May 1973 | Borussia Mönchengladbach 2–0 Liverpool | Not drafted in this run |
| 027 | 24 Oct 1973 | Red Star Belgrade 2–1 Liverpool | Not drafted in this run |
| 028 | 3 Nov 1973 | Arsenal 0–2 Liverpool | Not drafted in this run |
| 029 | 6 Nov 1973 | Liverpool 1–2 Red Star Belgrade | Not drafted in this run |
| 030 | 8 Dec 1973 | Everton 0–1 Liverpool | Not drafted in this run |
| 031 | 22 Dec 1973 | Liverpool 2–0 Manchester United | Not drafted in this run |
| 032 | 9 Mar 1974 | Bristol City 0–1 Liverpool | Not drafted in this run |
| 033 | 3 Apr 1974 | Liverpool 3–1 Leicester City | Not drafted in this run |
| 034 | 4 May 1974 | Liverpool 3–0 Newcastle United | Not drafted in this run |
| 035 | 8 May 1974 | Tottenham Hotspur 1–1 Liverpool | Not drafted in this run |
| 036 | 10 Aug 1974 | Liverpool 1–1 Leeds United | Not drafted in this run |
| 037 | 7 Sep 1974 | Liverpool 5–2 Tottenham Hotspur | Not drafted in this run |
| 038 | 17 Sep 1974 | Liverpool 11–0 Strømsgodset | Not drafted in this run |
| 039 | 26 Dec 1974 | Liverpool 4–1 Manchester City | Not drafted in this run |
| 040 | 8 Feb 1975 | Liverpool 5–2 Ipswich Town | Not drafted in this run |
| 041 | 25 Mar 1975 | Liverpool 4–0 Newcastle United | Not drafted in this run |
| 042 | 29 Apr 1975 | Liverpool 6–2 Don Revie Select XI | Not drafted in this run |
| 043 | 26 Aug 1975 | Leeds United 0–3 Liverpool | Not drafted in this run |
| 044 | 30 Sep 1975 | Liverpool 3–1 Hibernian | Not drafted in this run |
| 045 | 13 Dec 1975 | Tottenham Hotspur 0–4 Liverpool | Not drafted in this run |
| 046 | 10 Jan 1976 | Liverpool 3–3 Ipswich Town | Not drafted in this run |
| 047 | 30 Mar 1976 | Barcelona 0–1 Liverpool | Earlier Barcelona draft saved; awaiting approval |
| 048 | 3 Apr 1976 | Liverpool 1–0 Everton | Not drafted in this run |
| 049 | 14 Apr 1976 | Liverpool 1–1 Barcelona | Not drafted in this run |
| 050 | 17 Apr 1976 | Liverpool 5–3 Stoke City | Not drafted in this run |
| 051 | 19 Apr 1976 | Manchester City 0–3 Liverpool | Not drafted in this run |
| 052 | 28 Apr 1976 | Liverpool 3–2 Club Brugge | Not drafted in this run |
| 053 | 4 May 1976 | Wolverhampton Wanderers 1–3 Liverpool | Not drafted in this run |
| 054 | 19 May 1976 | Club Brugge 1–1 Liverpool | Not drafted in this run |
| 055 | 14 Aug 1976 | Liverpool 1–0 Southampton | Not drafted in this run |
| 056 | 11 Sep 1976 | Derby County 2–3 Liverpool | Not drafted in this run |
| 057 | 2 Mar 1977 | Saint-Étienne 1–0 Liverpool | Not drafted in this run |
| 058 | 16 Mar 1977 | Liverpool 3–1 Saint-Étienne | Not drafted in this run |
| 059 | 2 Apr 1977 | Liverpool 3–1 Leeds United | Not drafted in this run |
| 060 | 6 Apr 1977 | Zürich 1–3 Liverpool | Not drafted in this run |
| 061 | 20 Apr 1977 | Liverpool 3–0 Zürich | Not drafted in this run |
| 062 | 23 Apr 1977 | Liverpool 2–2 Everton | Not drafted in this run |
| 063 | 27 Apr 1977 | Liverpool 3–0 Everton | Not drafted in this run |
| 064 | 30 Apr 1977 | Liverpool 2–1 Ipswich Town | Not drafted in this run |
| 065 | 14 May 1977 | Liverpool 0–0 West Ham United | Not drafted in this run |
| 066 | 21 May 1977 | Liverpool 1–2 Manchester United | Not drafted in this run |
| 067 | 25 May 1977 | Liverpool 3–1 Borussia Mönchengladbach | Not drafted in this run |
| 068 | 20 Aug 1977 | Middlesbrough 1–1 Liverpool | Not drafted in this run |
| 069 | 27 Aug 1977 | Liverpool 3–0 West Bromwich Albion | Not drafted in this run |
| 070 | 19 Oct 1977 | Liverpool 5–1 Dynamo Dresden | Not drafted in this run |
| 071 | 22 Nov 1977 | Hamburg 1–1 Liverpool | Not drafted in this run |
| 072 | 6 Dec 1977 | Liverpool 6–0 Hamburg | Existing archive item — check coverage before drafting |
| 073 | 7 Feb 1978 | Liverpool 2–1 Arsenal | Not drafted in this run |
| 074 | 1 Mar 1978 | Benfica 1–2 Liverpool | Not drafted in this run |
| 075 | 15 Mar 1978 | Liverpool 4–1 Benfica | Not drafted in this run |
| 076 | 18 Mar 1978 | Liverpool 0–0 Nottingham Forest | Not drafted in this run |
| 077 | 22 Mar 1978 | Liverpool 0–1 Nottingham Forest | Not drafted in this run |
| 078 | 12 Apr 1978 | Liverpool 3–0 Borussia Mönchengladbach | Not drafted in this run |
| 079 | 10 May 1978 | Liverpool 1–0 Club Brugge | Not drafted in this run |
| 080 | 22 Aug 1978 | Ipswich Town 0–3 Liverpool | Not drafted in this run |
| 081 | 26 Aug 1978 | Manchester City 1–4 Liverpool | Not drafted in this run |
| 082 | 2 Sep 1978 | Liverpool 7–0 Tottenham Hotspur | Existing archive item — check coverage before drafting |
| 083 | 13 Sep 1978 | Nottingham Forest 2–0 Liverpool | Not drafted in this run |
| 084 | 27 Sep 1978 | Liverpool 0–0 Nottingham Forest | Not drafted in this run |
| 085 | 14 Oct 1978 | Liverpool 5–0 Derby County | Not drafted in this run |
| 086 | 26 Dec 1978 | Manchester United 0–3 Liverpool | Not drafted in this run |
| 087 | 21 Feb 1979 | Liverpool 6–0 Norwich City | Not drafted in this run |
| 088 | 8 May 1979 | Liverpool 3–0 Aston Villa | Not drafted in this run |
| 089 | 17 May 1979 | Leeds United 0–3 Liverpool | Not drafted in this run |
| 090 | 11 Aug 1979 | Liverpool 3–1 Arsenal | Not drafted in this run |
| 091 | 4 Sep 1979 | Liverpool 4–0 Tranmere Rovers | Not drafted in this run |
| 092 | 3 Oct 1979 | Dinamo Tbilisi 3–0 Liverpool | Not drafted in this run |
| 093 | 27 Oct 1979 | Manchester City 0–4 Liverpool | Not drafted in this run |
| 094 | 26 Dec 1979 | Liverpool 2–0 Manchester United | Not drafted in this run |
| 095 | 1 Mar 1980 | Everton 1–2 Liverpool | Not drafted in this run |
| 096 | 8 Mar 1980 | Tottenham Hotspur 0–1 Liverpool | Not drafted in this run |
| 097 | 12 Apr 1980 | Liverpool 0–0 Arsenal | Not drafted in this run |
| 098 | 28 Apr 1980 | Liverpool 1–1 Arsenal | Not drafted in this run |
| 099 | 1 May 1980 | Liverpool 0–1 Arsenal | Not drafted in this run |
| 100 | 3 May 1980 | Liverpool 4–1 Aston Villa | Not drafted in this run |
| 101 | 9 Aug 1980 | Liverpool 1–0 West Ham United | Not drafted in this run |
| 102 | 1 Oct 1980 | Liverpool 10–1 Oulu Palloseura | Not drafted in this run |
| 103 | 22 Oct 1980 | Aberdeen 0–1 Liverpool | Not drafted in this run |
| 104 | 5 Nov 1980 | Liverpool 4–0 Aberdeen | Not drafted in this run |
| 105 | 4 Mar 1981 | Liverpool 5–1 CSKA Sofia | Not drafted in this run |
| 106 | 14 Mar 1981 | Liverpool 1–1 West Ham United | Not drafted in this run |
| 107 | 1 Apr 1981 | Liverpool 2–1 West Ham United | Not drafted in this run |
| 108 | 8 Apr 1981 | Liverpool 0–0 Bayern Munich | Not drafted in this run |
| 109 | 22 Apr 1981 | Bayern Munich 1–1 Liverpool | Not drafted in this run |
| 110 | 27 May 1981 | Liverpool 1–0 Real Madrid | Existing archive item — check coverage before drafting |
| 111 | 30 Sep 1981 | Liverpool 7–0 Oulu Palloseura | Not drafted in this run |
| 112 | 4 Nov 1981 | Liverpool 3–2 AZ ’67 | Not drafted in this run |
| 113 | 7 Nov 1981 | Liverpool 3–1 Everton | Not drafted in this run |
| 114 | 13 Dec 1981 | Flamengo 3–0 Liverpool | Not drafted in this run |
| 115 | 26 Dec 1981 | Liverpool 1–3 Manchester City | Not drafted in this run |
| 116 | 13 Mar 1982 | Liverpool 3–1 Tottenham Hotspur, after extra time | Existing archive item — check coverage before drafting |
| 117 | 27 Mar 1982 | Everton 1–3 Liverpool | Not drafted in this run |
| 118 | 7 Apr 1982 | Manchester United 0–1 Liverpool | Not drafted in this run |
| 119 | 10 Apr 1982 | Manchester City 0–5 Liverpool | Not drafted in this run |
| 120 | 3 May 1982 | Tottenham Hotspur 2–2 Liverpool | Not drafted in this run |
| 121 | 7 Sep 1982 | Liverpool 4–3 Nottingham Forest | Not drafted in this run |
| 122 | 11 Sep 1982 | Liverpool 3–3 Luton Town | Not drafted in this run |
| 123 | 6 Nov 1982 | Everton 0–5 Liverpool | Not drafted in this run |
| 124 | 27 Dec 1982 | Liverpool 5–2 Manchester City | Not drafted in this run |
| 125 | 20 Feb 1983 | Liverpool 1–2 Brighton & Hove Albion | Not drafted in this run |
| 126 | 2 Mar 1983 | Widzew Łódź 2–0 Liverpool | Not drafted in this run |
| 127 | 16 Mar 1983 | Liverpool 3–2 Widzew Łódź | Not drafted in this run |
| 128 | 26 Mar 1983 | Liverpool 2–1 Manchester United, after extra time | Not drafted in this run |
| 129 | 7 May 1983 | Liverpool 1–1 Aston Villa | Not drafted in this run |
| 130 | 10 Sep 1983 | Arsenal 0–2 Liverpool | Not drafted in this run |
| 131 | 29 Oct 1983 | Liverpool 6–0 Luton Town | Not drafted in this run |
| 132 | 2 Nov 1983 | Athletic Bilbao 0–1 Liverpool | Not drafted in this run |
| 133 | 6 Nov 1983 | Liverpool 3–0 Everton | Not drafted in this run |
| 134 | 7 Feb 1984 | Liverpool 2–2 Walsall | Not drafted in this run |
| 135 | 21 Mar 1984 | Benfica 1–4 Liverpool | Not drafted in this run |
| 136 | 25 Mar 1984 | Liverpool 0–0 Everton | Not drafted in this run |
| 137 | 28 Mar 1984 | Liverpool 1–0 Everton | Not drafted in this run |
| 138 | 7 Apr 1984 | Liverpool 6–0 West Ham United | Not drafted in this run |
| 139 | 11 Apr 1984 | Liverpool 1–0 Dinamo Bucharest | Not drafted in this run |
| 140 | 25 Apr 1984 | Dinamo Bucharest 1–2 Liverpool | Not drafted in this run |
| 141 | 30 May 1984 | Liverpool 1–1 Roma, Liverpool won 4–2 on penalties | Not drafted in this run |
| 142 | 18 Aug 1984 | Liverpool 0–1 Everton | Not drafted in this run |
| 143 | 20 Oct 1984 | Liverpool 0–1 Everton | Not drafted in this run |
| 144 | 24 Oct 1984 | Liverpool 3–1 Benfica | Not drafted in this run |
| 145 | 7 Nov 1984 | Benfica 1–0 Liverpool | Not drafted in this run |
| 146 | 20 Mar 1985 | Liverpool 4–1 Austria Vienna | Not drafted in this run |
| 147 | 10 Apr 1985 | Liverpool 4–0 Panathinaikos | Not drafted in this run |
| 148 | 13 Apr 1985 | Liverpool 2–2 Manchester United | Not drafted in this run |
| 149 | 17 Apr 1985 | Liverpool 1–2 Manchester United | Not drafted in this run |
| 150 | 29 May 1985 | Liverpool 0–1 Juventus | Not drafted in this run |
| 151 | 17 Aug 1985 | Liverpool 2–0 Arsenal | Not drafted in this run |
| 152 | 21 Sep 1985 | Everton 2–3 Liverpool | Existing archive item — check coverage before drafting |
| 153 | 28 Sep 1985 | Liverpool 4–1 Tottenham Hotspur | Not drafted in this run |
| 154 | 26 Nov 1985 | Liverpool 2–1 Manchester United | Not drafted in this run |
| 155 | 22 Feb 1986 | Liverpool 0–2 Everton | Not drafted in this run |
| 156 | 8 Mar 1986 | Liverpool 4–1 Queens Park Rangers | Not drafted in this run |
| 157 | 17 Mar 1986 | Watford 1–2 Liverpool | Not drafted in this run |
| 158 | 22 Mar 1986 | Liverpool 6–0 Oxford United | Not drafted in this run |
| 159 | 5 Apr 1986 | Liverpool 2–0 Southampton | Not drafted in this run |
| 160 | 3 May 1986 | Chelsea 0–1 Liverpool | Not drafted in this run |
| 161 | 10 May 1986 | Liverpool 3–1 Everton | Not drafted in this run |
| 162 | 16 Aug 1986 | Liverpool 1–1 Everton | Not drafted in this run |
| 163 | 16 Sep 1986 | Liverpool 3–1 Everton | Not drafted in this run |
| 164 | 23 Sep 1986 | Liverpool 10–0 Fulham | Not drafted in this run |
| 165 | 30 Sep 1986 | Everton 1–4 Liverpool | Not drafted in this run |
| 166 | 1 Nov 1986 | Liverpool 6–2 Norwich City | Not drafted in this run |
| 167 | 14 Feb 1987 | Liverpool 4–3 Leicester City | Not drafted in this run |
| 168 | 5 Apr 1987 | Liverpool 1–2 Arsenal | Not drafted in this run |
| 169 | 25 Apr 1987 | Liverpool 3–1 Everton | Not drafted in this run |
| 170 | 15 Aug 1987 | Arsenal 1–2 Liverpool | Existing archive item — check coverage before drafting |
| 171 | 17 Oct 1987 | Liverpool 4–0 Queens Park Rangers | Not drafted in this run |
| 172 | 1 Nov 1987 | Liverpool 2–0 Everton | Not drafted in this run |
| 173 | 28 Dec 1987 | Liverpool 4–0 Newcastle United | Not drafted in this run |
| 174 | 1 Jan 1988 | Liverpool 4–0 Coventry City | Not drafted in this run |
| 175 | 21 Feb 1988 | Everton 0–1 Liverpool | Not drafted in this run |
| 176 | 20 Mar 1988 | Everton 1–0 Liverpool | Not drafted in this run |
| 177 | 4 Apr 1988 | Liverpool 3–3 Manchester United | Not drafted in this run |
| 178 | 9 Apr 1988 | Liverpool 2–1 Nottingham Forest | Not drafted in this run |
| 179 | 13 Apr 1988 | Liverpool 5–0 Nottingham Forest | Not drafted in this run |
| 180 | 14 May 1988 | Liverpool 0–1 Wimbledon | Not drafted in this run |
| 181 | 20 Aug 1988 | Liverpool 2–1 Wimbledon | Not drafted in this run |
| 182 | 3 Sep 1988 | Liverpool 1–0 Manchester United | Not drafted in this run |
| 183 | 23 Nov 1988 | Liverpool 2–1 Arsenal | Not drafted in this run |
| 184 | 1 Jan 1989 | Manchester United 3–1 Liverpool | Not drafted in this run |
| 185 | 15 Apr 1989 | Liverpool v Nottingham Forest, abandoned | Not drafted in this run |
| 186 | 3 May 1989 | Everton 0–0 Liverpool | Not drafted in this run |
| 187 | 7 May 1989 | Liverpool 3–1 Nottingham Forest | Not drafted in this run |
| 188 | 20 May 1989 | Liverpool 3–2 Everton, after extra time | Not drafted in this run |
| 189 | 23 May 1989 | Liverpool 5–1 West Ham United | Not drafted in this run |
| 190 | 26 May 1989 | Liverpool 0–2 Arsenal | Not drafted in this run |
| 191 | 12 Sep 1989 | Liverpool 9–0 Crystal Palace | Existing archive item — check coverage before drafting |
| 192 | 23 Sep 1989 | Everton 1–3 Liverpool | Not drafted in this run |
| 193 | 26 Nov 1989 | Liverpool 2–1 Arsenal | Not drafted in this run |
| 194 | 16 Dec 1989 | Chelsea 2–5 Liverpool | Not drafted in this run |
| 195 | 9 Jan 1990 | Liverpool 8–0 Swansea City | Not drafted in this run |
| 196 | 3 Feb 1990 | Liverpool 2–1 Everton | Not drafted in this run |
| 197 | 8 Apr 1990 | Liverpool 3–4 Crystal Palace, after extra time | Not drafted in this run |
| 198 | 28 Apr 1990 | Liverpool 2–1 Queens Park Rangers | Not drafted in this run |
| 199 | 5 May 1990 | Coventry City 1–6 Liverpool | Not drafted in this run |
