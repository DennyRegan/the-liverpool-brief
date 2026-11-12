# Season map

An interactive map of one Liverpool season, game by game, at `/looking-back/seasons/[season]/map`. Built 12 November 2026 from Denny's brief. The first season is 1976–77.

## What the reader gets

- A vintage printed map on the Looking Back cream sheet, in the Looking Back typefaces.
- One pin per ground. Games still to come are open rings; games played are filled in. Key games are red diamonds. Anfield is one red target holding every home game; tapping it lists them.
- A line drawn from each game to the next, in date order.
- Two views, Britain and Europe. The map zooms out by itself when the journey goes abroad and back in when it comes home. The reader can also switch by hand.
- Previous and Next, a slider, the left and right arrow keys, and a full list of games.
- The reader's place is remembered in their own browser. Nothing is sent anywhere.

## The files

Denny's originals are kept in `docs/seasons/` (the build brief, the season data and the key-game write-ups). The site never reads that folder. What the site reads is `content/looking-back/season-maps/[season]/`:

- `games.json`: the season data file, unchanged. One object per game with `n`, `date`, `competition`, `round`, `opponent`, `venue` (`H`, `A` or `N`), `ground`, `lfc`, `opp`, the scorers, `attendance`, `lfc_league_pos`, `flags`, `city`, `lat` and `lng`. Games must be numbered 1, 2, 3… in date order.
- `map.json`: the key games. Each game number names a `writeUp` (a file in `write-ups/`), a `matchRevisited` slug, or both. Two legs of a tie can share one write-up.
- `write-ups/[name].md`: one piece per file. The first line is `# Title`; the rest is the text.

What is shown for every game: date, competition, score, ground, both sides' scorers, attendance and Liverpool's league position. What is never shown: `flags`, the referee, half-time scores, the alternative attendance, and the attendance itself where the flag says "unresolved" (games 8 and 15 in 1976–77). The figure list and check notes at the bottom of the write-ups file stay in `docs/seasons/` only; the build fails if they turn up in a write-up file.

A key game links to its Match Revisited piece only when that piece is visible on the site, so a scheduled piece is not linked on production until it goes live.

The short entries for ordinary games are not written yet. When they are, they need a new optional field and a line in the card.

The season must already have a record in `content/looking-back/seasons`. The season page then links to its map, and the map is added to the sitemap.

## How it is built

- No map library and no tile service. `scripts/build-season-map.mjs` draws the coastlines and borders once from Natural Earth 1:50m data (public domain) and saves them as SVG paths in `lib/season-map/base.json`. Run it again only to change the map's area. `d3-geo`, `topojson-client` and `world-atlas` are needed only by that script.
- The whole map is one square sheet of Europe; the Britain view is a 5× zoom into it (`lib/season-map/views.ts`).
- `app/components/SeasonMapBase.tsx` prints the sheet on the server. `app/components/SeasonMap.tsx` adds the pins, the journey and the controls in the browser. Styles are in `app/components/season-map.css`.
- Grounds that sit almost on top of each other (the London clubs, Goodison beside Anfield) are eased slightly apart so each pin can be tapped.
- `tests/season-map.test.mjs` checks the real 1976–77 files: 62 games, 30 at Anfield, the eight key games, the hidden attendances, and that the write-ups match `docs/seasons/` word for word.
