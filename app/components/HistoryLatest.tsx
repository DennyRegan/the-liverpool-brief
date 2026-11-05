import Link from "next/link";
import { getLatestHistory, HISTORY_PATH } from "@/lib/content/history";

/** The newest live History pieces. Renders nothing until something is live. */
export function HistoryLatest({ heading = true }: { heading?: boolean }) {
  const items = getLatestHistory();
  if (!items.length) return null;
  return <section className="home-history" aria-labelledby="home-history-heading">
    <div className="home-section-heading">
      <h2 id="home-history-heading" className="eyebrow">{heading ? "From History" : "Latest in History"}</h2>
      <Link className="collection-link" href={HISTORY_PATH}>All History</Link>
    </div>
    <div className="article-grid">{items.map(item => <article className="article-card" key={item.href}>
      <p className="history-list-meta">{item.label}</p>
      <h3><Link href={item.href}>{item.title}</Link></h3>
      <p className="preview-excerpt">{item.excerpt}</p>
      <Link className="read-link" href={item.href} aria-label={`Read: ${item.title}`}>Read</Link>
    </article>)}</div>
  </section>;
}
