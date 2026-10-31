import { formatListDate } from "../format.ts";
import { MATCH_TYPES, type Article } from "./types.ts";

export const MATCHDAY_PATH = "/matchday";

type Fixture = NonNullable<Article["fixture"]>;
type MatchdayPiece = { slug: string; date: string; matchType?: Article["matchType"]; fixture?: Fixture };

/** "Liverpool v Arsenal, Premier League, 1 November 2026"; the home side is named first. */
export function fixtureHeading(fixture: Fixture) {
  const teams = fixture.venue === "Home" ? `Liverpool v ${fixture.opponent}` : `${fixture.opponent} v Liverpool`;
  return `${teams}, ${fixture.competition}, ${formatListDate(fixture.date)}`;
}

const typeOrder = (piece: MatchdayPiece) => piece.matchType ? MATCH_TYPES.indexOf(piece.matchType) : MATCH_TYPES.length;

/**
 * Groups pieces by fixture (same opponent on the same date), newest fixture first.
 * Within a fixture: Preview, Report, then Opinion on a match, each by publication date.
 * Pieces with no fixture are returned separately so they still display.
 */
export function groupByFixture<T extends MatchdayPiece>(pieces: readonly T[]) {
  const groups = new Map<string, { heading: string; fixtureDate: string; pieces: T[] }>();
  const unassigned: T[] = [];
  for (const piece of pieces) {
    if (!piece.fixture) { unassigned.push(piece); continue; }
    const key = `${piece.fixture.date}|${piece.fixture.opponent.trim().toLowerCase()}`;
    const group = groups.get(key) ?? { heading: fixtureHeading(piece.fixture), fixtureDate: piece.fixture.date, pieces: [] };
    group.pieces.push(piece);
    groups.set(key, group);
  }
  const ordered = (list: T[]) => [...list].sort((a, b) => typeOrder(a) - typeOrder(b) || a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug));
  return {
    fixtures: [...groups.values()]
      .map(group => ({ ...group, pieces: ordered(group.pieces) }))
      .sort((a, b) => b.fixtureDate.localeCompare(a.fixtureDate) || a.heading.localeCompare(b.heading)),
    unassigned: ordered(unassigned),
  };
}
