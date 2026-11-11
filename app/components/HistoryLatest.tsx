import Link from "next/link";
import { getLatestHistory } from "@/lib/content/history";
import { LOOKING_BACK_PATH } from "@/lib/content/looking-back";

/** Homepage block: the newest live biography and series part. Renders nothing until something is live. */
export function HistoryLatest({ exclude }: { exclude?: string }) {
  const items = getLatestHistory().filter(item => item.href !== exclude);
  if (!items.length) return null;
  return <section className="home-history" aria-labelledby="home-history-heading">
    <div className="home-section-heading">
      <h2 id="home-history-heading" className="eyebrow">From Looking Back</h2>
      <Link className="collection-link" href={LOOKING_BACK_PATH}>All of Looking Back</Link>
    </div>
    <div className="article-grid">{items.map(item => <article className="article-card" key={item.href}>
      <p className="home-history-meta">{item.label}</p>
      <h3><Link href={item.href}>{item.title}</Link></h3>
      <p className="preview-excerpt">{item.excerpt}</p>
      <Link className="read-link" href={item.href} aria-label={`Read: ${item.title}`}>Read</Link>
    </article>)}</div>
  </section>;
}
