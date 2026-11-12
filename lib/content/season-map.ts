import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { getVisibleMatchRevisitedPiece, MATCH_REVISITED_PATH } from "./history.ts";
import { SeasonIdSchema, SEASONS_PATH } from "./seasons.ts";
import { britainCamera, inView, project, unitsPerKm, type Camera, type Projection } from "../season-map/views.ts";

// The season map (Looking Back > Seasons): one season's games on a vintage map,
// in date order. One folder per season, content/looking-back/season-maps/[season]:
//   games.json     every game, in order: Denny's season data file, unchanged
//   map.json       which games are key games, and what each one opens
//   write-ups/     the long write-ups, one Markdown file per piece ("# Title", then the text)
// A season has a map only when its folder exists. Nothing here is written by the
// site, and research notes (flags, figure lists) are never shown.

const Text = z.string().trim().min(1);
const Slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const Count = z.number().int().nonnegative();
const Position = z.number().int().positive().nullable();

/** One game, exactly as it is in the season data file. */
export const SeasonMapGameSchema = z.object({
  n: z.number().int().positive(),
  date: z.iso.date(),
  competition: Text,
  /** "R2 replay", "QF 1st leg", "Final"; empty for league games. */
  round: z.string(),
  opponent: Text,
  /** H home, A away, N neutral ground. */
  venue: z.enum(["H", "A", "N"]),
  ground: Text,
  lfc: Count, opp: Count, ht_lfc: Count, ht_opp: Count,
  attendance: z.number().int().positive().nullable(),
  attendance_alt: z.number().int().positive().nullable(),
  lfc_scorers: z.string(),
  opp_scorers: z.string(),
  lfc_league_pos: Position,
  opp_league_pos: Position,
  referee: z.string(),
  /** Research notes; never shown. An attendance is not printed when they say "unresolved". */
  flags: z.string(),
  city: Text,
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
}).strict();

export const SeasonMapGamesSchema = z.array(SeasonMapGameSchema).min(1).superRefine((games, ctx) => {
  games.forEach((game, index) => {
    if (game.n !== index + 1) ctx.addIssue({ code: "custom", path: [index, "n"], message: `Game numbers must run 1, 2, 3 in order; expected ${index + 1}` });
    if (index > 0 && game.date < games[index - 1].date) ctx.addIssue({ code: "custom", path: [index, "date"], message: "Games must be in date order" });
  });
});

/** Key games get a different pin and open a long write-up, a Match Revisited piece, or both. */
export const SeasonMapConfigSchema = z.object({
  season: SeasonIdSchema,
  keyGames: z.record(z.string().regex(/^[1-9]\d*$/), z.object({
    /** File name (without .md) in write-ups/. Two legs of a tie can share one. */
    writeUp: Slug.optional(),
    /** Slug of a Match Revisited piece; linked only once that piece is visible. */
    matchRevisited: Slug.optional(),
  }).strict().refine(key => key.writeUp || key.matchRevisited, "A key game needs a write-up or a Match Revisited piece")),
}).strict();

export type SeasonMapGame = z.infer<typeof SeasonMapGameSchema>;

/** One game as the page shows it: display text only, no research notes. */
export type MapGame = {
  number: number;
  date: string;       // "Wednesday 16 March 1977"
  shortDate: string;  // "16 Mar"
  month: string;      // "March 1977"
  competition: string; // "European Cup quarter-final, second leg"
  fixture: string;    // "Liverpool 3–1 Saint-Étienne"
  ground: string;     // "Anfield, Liverpool"
  scorers: { team: string; text: string }[];
  attendance?: string;
  leaguePosition?: string;
  key: boolean;
  article?: { href: string; label: string };
  /** The long write-up, when the key game has one: its title and Markdown text. */
  writeUp?: { title: string; body: string };
  stop: number;
};

/** One place on the map. Anfield is a single stop holding every home game. */
export type MapStop = {
  x: number; y: number;
  label: string;
  games: number[];   // indexes into the games list, in date order
  home: boolean;
  key: boolean;
  /** Outside the Britain view: the map zooms out to Europe for it. */
  abroad: boolean;
};

export type SeasonMapData = {
  season: string;
  games: MapGame[];
  stops: MapStop[];
  britain: Camera;
  /** Scale bars, as a fraction of the map's width. */
  scale: { britain: { miles: number; width: number }; europe: { miles: number; width: number } };
};

const MAPS_DIRECTORY = "content/looking-back/season-maps";
const KM_PER_MILE = 1.609344;

export function seasonMapPath(season: string) { return `${SEASONS_PATH}/${season}/map`; }

/** Seasons that have a map, oldest first. */
export function getSeasonMapSeasons(root = process.cwd()): string[] {
  const directory = path.join(root, MAPS_DIRECTORY);
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).filter(entry => entry.isDirectory() && fs.existsSync(path.join(directory, entry.name, "games.json"))).map(entry => entry.name).sort();
}

function readProjection(root: string): Projection {
  // The base map always comes from the repository, whatever content root a test passes.
  const file = [path.join(root, "lib/season-map/base.json"), path.join(process.cwd(), "lib/season-map/base.json")].find(candidate => fs.existsSync(candidate));
  if (!file) throw new Error("Missing lib/season-map/base.json; run node scripts/build-season-map.mjs");
  return JSON.parse(fs.readFileSync(file, "utf8")).projection;
}

function ordinal(n: number) {
  const lastTwo = n % 100;
  const suffix = lastTwo >= 11 && lastTwo <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";
  return `${n}${suffix}`;
}

function formatDate(date: string, options: Intl.DateTimeFormatOptions) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", { timeZone: "UTC", ...options });
}

/** Liverpool first at home and on neutral grounds; the home side first away. The word joiner keeps a score on one line. */
function fixtureLine(game: SeasonMapGame) {
  return game.venue === "A"
    ? `${game.opponent} ${game.opp}–\u2060${game.lfc} Liverpool`
    : `Liverpool ${game.lfc}–\u2060${game.opp} ${game.opponent}`;
}

const ROUNDS: Record<string, string> = { R1: "first round", R2: "second round", R3: "third round", R4: "fourth round", R5: "fifth round", QF: "quarter-final", SF: "semi-final", Final: "final" };

/** "League" and "" to "First Division"; "European Cup" and "QF 2nd leg" to "European Cup quarter-final, second leg". */
export function competitionLine(competition: string, round: string) {
  if (competition === "League") return "First Division";
  const [stage, ...rest] = round.split(" ").filter(Boolean);
  if (!stage) return competition;
  const detail = rest.join(" ").replace("1st", "first").replace("2nd", "second");
  if (!ROUNDS[stage]) throw new Error(`Unknown round "${round}"`);
  return `${competition} ${ROUNDS[stage]}${detail ? (detail === "replay" ? " replay" : `, ${detail}`) : ""}`;
}

/**
 * Pins that would sit on top of each other in the Britain view (the London or
 * Birmingham grounds, Goodison next to Anfield) are eased apart a little, as a
 * printed map would do. Anfield never moves.
 */
function spread(stops: MapStop[], gap: number) {
  const movable = stops.filter(stop => !stop.abroad);
  for (let pass = 0; pass < 60; pass += 1) {
    for (let i = 0; i < movable.length; i += 1) for (let j = i + 1; j < movable.length; j += 1) {
      const a = movable[i], b = movable[j];
      let dx = b.x - a.x, dy = b.y - a.y;
      let distance = Math.hypot(dx, dy);
      if (distance >= gap) continue;
      if (distance < 1e-6) { dx = Math.cos(i * 2.4 + j); dy = Math.sin(i * 2.4 + j); distance = 1; }
      const push = (gap - distance) / distance;
      const shareA = a.home ? 0 : b.home ? 1 : 0.5;
      a.x -= dx * push * shareA; a.y -= dy * push * shareA;
      b.x += dx * push * (1 - shareA); b.y += dy * push * (1 - shareA);
    }
  }
}

function readWriteUp(directory: string, name: string) {
  const file = path.join(directory, "write-ups", `${name}.md`);
  if (!fs.existsSync(file)) throw new Error(`write-ups/${name}.md is missing`);
  const match = fs.readFileSync(file, "utf8").trim().match(/^# (.+)\n+([\s\S]+)$/);
  if (!match) throw new Error(`write-ups/${name}.md must start with "# Title" and then the text`);
  // Internal notes must never reach the page.
  if (/figure list|not for publication|→ Then:/i.test(match[2])) throw new Error(`write-ups/${name}.md contains internal notes; keep only the piece itself`);
  return { title: match[1].trim(), body: match[2].trim() };
}

/** One season's map, or undefined when the season has none. A bad file fails the build. */
export function getSeasonMap(season: string, root = process.cwd(), now = new Date(), env: Record<string, string | undefined> = process.env): SeasonMapData | undefined {
  const directory = path.join(root, MAPS_DIRECTORY, season);
  const file = path.join(directory, "games.json");
  if (!fs.existsSync(file)) return undefined;
  try {
    const games = SeasonMapGamesSchema.parse(JSON.parse(fs.readFileSync(file, "utf8")));
    const config = SeasonMapConfigSchema.parse(JSON.parse(fs.readFileSync(path.join(directory, "map.json"), "utf8")));
    if (config.season !== season) throw new Error("Season in map.json must match its folder name");
    for (const number of Object.keys(config.keyGames)) if (Number(number) > games.length) throw new Error(`Key game ${number} is not in games.json`);

    const projection = readProjection(root);
    const britain = britainCamera(projection);
    const stops: MapStop[] = [];
    const byPlace = new Map<string, number>();
    const view = games.map((game, index): MapGame => {
      const place = `${game.lat.toFixed(3)},${game.lng.toFixed(3)}`;
      let stop = byPlace.get(place);
      const withCity = game.ground.endsWith(`, ${game.city}`) ? game.ground : `${game.ground}, ${game.city}`;
      if (stop === undefined) {
        const point = project(projection, game.lat, game.lng);
        stop = stops.length;
        byPlace.set(place, stop);
        const abroad = !inView(britain, point);
        stops.push({ ...point, label: abroad ? game.city : game.ground.replace(`, ${game.city}`, ""), games: [], home: false, key: false, abroad });
      }
      const key = config.keyGames[String(game.n)];
      stops[stop].games.push(index);
      if (game.venue === "H") stops[stop].home = true;
      if (key) stops[stop].key = true;

      const piece = key?.matchRevisited ? getVisibleMatchRevisitedPiece(key.matchRevisited, now, env, root) : undefined;
      return {
        number: game.n,
        date: formatDate(game.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
        shortDate: formatDate(game.date, { day: "numeric", month: "short" }),
        month: formatDate(game.date, { month: "long", year: "numeric" }),
        competition: competitionLine(game.competition, game.round),
        fixture: fixtureLine(game),
        ground: withCity,
        scorers: [{ team: "Liverpool", text: game.lfc_scorers.trim() }, { team: game.opponent, text: game.opp_scorers.trim() }].filter(side => side.text),
        attendance: game.attendance && !/unresolved/i.test(game.flags) ? game.attendance.toLocaleString("en-GB") : undefined,
        leaguePosition: game.lfc_league_pos ? ordinal(game.lfc_league_pos) : undefined,
        key: !!key,
        article: piece ? { href: `${MATCH_REVISITED_PATH}/${piece.slug}`, label: `Match Revisited: ${piece.title}` } : undefined,
        writeUp: key?.writeUp ? readWriteUp(directory, key.writeUp) : undefined,
        stop,
      };
    });
    spread(stops, 4.4);
    for (const stop of stops) { stop.x = Math.round(stop.x * 100) / 100; stop.y = Math.round(stop.y * 100) / 100; }

    const bar = (miles: number, lat: number, zoom: number) => ({ miles, width: (miles * KM_PER_MILE * unitsPerKm(projection, lat) * zoom) / 1000 });
    return { season, games: view, stops, britain, scale: { britain: bar(50, 53, britain.k), europe: bar(300, 48, 1) } };
  } catch (error) {
    throw new Error(`Invalid season map ${season}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
