import Link from "next/link";
import { getLatestMatchRevisited, MATCH_REVISITED_PATH } from "@/lib/content/history";

/**
 * Homepage feature spot: the newest Match Revisited piece whose date has passed
 * (Europe/London). It stays until a later piece goes live, so a missed week leaves
 * the last one up. Renders nothing until a piece is live.
 */
export function MatchRevisitedHome() {
  const piece = getLatestMatchRevisited();
  if (!piece) return null;
  const href = `${MATCH_REVISITED_PATH}/${piece.slug}`;
  return <section className="home-history" aria-labelledby="home-match-revisited-heading">
    <div className="home-section-heading">
      <h2 id="home-match-revisited-heading" className="eyebrow">Match Revisited</h2>
      <Link className="collection-link" href={MATCH_REVISITED_PATH}>All matches</Link>
    </div>
    <article className="article-card">
      <p className="home-history-meta">{piece.scoreline} v {piece.opponent} · {piece.competition} · {piece.eventDate.slice(0, 4)}</p>
      <h3><Link href={href}>{piece.title}</Link></h3>
      <p className="preview-excerpt">{piece.excerpt}</p>
      <Link className="read-link" href={href} aria-label={`Read: ${piece.title}`}>Read</Link>
    </article>
  </section>;
}
