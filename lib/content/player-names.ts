import names from "../../content/players.json" with { type: "json" };

/** Display names for player tags, keyed by slug. Add a player here before tagging them. */
const PLAYER_NAMES: Record<string, string> = names;

export function isKnownPlayer(slug: string) {
  return Object.hasOwn(PLAYER_NAMES, slug);
}

export function playerName(slug: string) {
  return PLAYER_NAMES[slug] ?? slug;
}

export function knownPlayers() {
  return Object.keys(PLAYER_NAMES);
}

/** Fails the build when an article tags a player missing from content/players.json. */
export function assertKnownPlayers(players: readonly string[] | undefined) {
  for (const slug of players ?? []) {
    if (!isKnownPlayer(slug)) throw new Error(`players: unknown player "${slug}"; add it to content/players.json`);
  }
}
