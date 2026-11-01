import { getWriting } from "./writing.ts";
import { playerName } from "./player-names.ts";

export const PLAYERS_PATH = "/players";
/** A player gets a page only once this many articles are tagged with them. */
export const PLAYER_PAGE_MINIMUM = 3;

/** Every tagged piece (Articles and retained Archive pieces), newest first. */
export function getPlayerArticles(slug: string, root = process.cwd()) {
  return getWriting(root).filter(article => article.players?.includes(slug));
}

/** Slugs of players with enough tagged articles for a page. */
export function getPlayerPageSlugs(root = process.cwd()) {
  const counts = new Map<string, number>();
  for (const article of getWriting(root)) for (const slug of article.players ?? []) counts.set(slug, (counts.get(slug) ?? 0) + 1);
  return [...counts].filter(([, count]) => count >= PLAYER_PAGE_MINIMUM).map(([slug]) => slug)
    .sort((a, b) => playerName(a).localeCompare(playerName(b), "en-GB"));
}
