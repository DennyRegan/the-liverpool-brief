import names from "../../content/opponents.json" with { type: "json" };
import { assertKnownPlayers } from "./player-names.ts";

/** Display names for opponent tags, keyed by slug. Add a club here before tagging it. */
const OPPONENT_NAMES: Record<string, string> = names;

export function opponentName(slug: string) {
  return OPPONENT_NAMES[slug] ?? slug;
}

/** Fails the build when a piece tags a player or opponent missing from content/players.json or content/opponents.json. */
export function assertKnownTags(piece: { players?: readonly string[]; opponents?: readonly string[] }) {
  assertKnownPlayers(piece.players);
  for (const slug of piece.opponents ?? []) {
    if (!Object.hasOwn(OPPONENT_NAMES, slug)) throw new Error(`opponents: unknown opponent "${slug}"; add it to content/opponents.json`);
  }
}
