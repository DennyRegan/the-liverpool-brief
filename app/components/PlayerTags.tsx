import Link from "next/link";
import { playerName } from "@/lib/content/player-names";
import { getPlayerPageSlugs, PLAYERS_PATH } from "@/lib/content/players";

/** Player tags at the foot of an article. Players with a page are links; others are plain names. */
export function PlayerTags({ players }: { players?: readonly string[] }) {
  if (!players?.length) return null;
  const pages = new Set(getPlayerPageSlugs());
  return (
    <nav className="player-tags" aria-label="Players in this article">
      <span className="eyebrow">Players</span>
      <ul role="list">
        {players.map(slug => <li key={slug}>
          {pages.has(slug) ? <Link href={`${PLAYERS_PATH}/${slug}`}>{playerName(slug)}</Link> : <span>{playerName(slug)}</span>}
        </li>)}
      </ul>
    </nav>
  );
}
