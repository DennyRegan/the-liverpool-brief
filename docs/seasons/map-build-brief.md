# Seasons map: build brief (for the Fable session)

Written 12 November 2026. A short handover so the map build can start without re-explaining the feature.

## What it is

An interactive map of one Liverpool season, game by game. The first season is 1976–77, with 62 games. Each game is a pin, and a line draws the journey from one game to the next in date order. Key games get a different-coloured pin and open a long write-up. Every other game opens a short entry.

## Look

- **The same style as Looking Back.** Use the vintage newspaper design already on the site: the same fonts, cream paper background and ink colours. Take them from the existing Looking Back styles in the repo (DennyRegan/the-liverpool-brief). Don't invent new ones.
- **The map itself is a vintage map:** an old engraved or printed atlas look. That means sepia or ink coastlines on cream paper, a lightly hatched or tinted sea, serif place labels, and perhaps a compass rose and a simple scale bar. No modern map tiles, satellite imagery or Google-style roads.
- **Modern underneath:** smooth animated journey lines, pins that respond to tap and hover, a smooth zoom between views, fast loading and good behaviour on a phone.

## Recommended approach (simplest that does it properly)

1. **No map library and no tile service.** Draw the map as one SVG from public-domain coastline data (Natural Earth, 1:50m). Map libraries and tile services look modern by default and are harder to make vintage.
2. **Project the coastlines once, at build time** (d3-geo in Node is fine), and ship a static SVG path. The page then only has to draw pins and lines, so it stays fast.
3. **Two views:** Britain, and Europe. Trabzon is about 3,000 km east of Anfield. On a single map Britain would shrink to a smudge, and 55 of the 62 games are in Britain. Zoom smoothly to the Europe view when the journey goes abroad, and back again.
4. **Anfield is a hub.** There are 30 home games at one point, so don't stack 30 pins. Use one Anfield marker that shows its games as a list or a small fan.
5. **Save the reader's place in the browser** (localStorage, wrapped in try/catch). No accounts.
6. **Pin colours:** key games in one colour (a deep red fits the palette), all other games in ink. Optionally, a middle tier for notable games later.

## Data

- `1976-77-season-data.json` (in this folder) has one object per game: date, competition, opponent, venue, ground, score, scorers, attendance, league position, notes, and `city`, `lat`, `lng`.
- Key games: #40 and #44 (Saint-Étienne), #48 and #52 (Zürich), #53 and #54 (Everton), #61 (Wembley), #62 (Rome).
- Key game text is in `1976-77-key-game-write-ups.md` (in this folder). Saint-Étienne and Rome open the Match Revisited articles that already exist on the site.
- The short entries for the other games are not written yet. Build with placeholders: score, scorers and attendance taken straight from the data.
- Don't print the attendance where the notes say "unresolved" (#8, #15).
- The figure list at the bottom of the write-ups file is internal. Never render it.

## Keep out

- No accounts, comments, likes or share counts.
- No sound and no autoplay.
- One season per page. A season index can come later, once a second season exists.

## Done means

- All 62 games are on the map in date order, and the line draws between them.
- Key pins are visibly different and open their write-ups.
- The view switches between Britain and Europe.
- It works on a phone.
- The reader's place is remembered.
- `npm run build` passes.
