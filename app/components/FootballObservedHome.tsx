import Link from "next/link";
import type { Article } from "@/lib/content/types";
import { REGAN_ON_FOOTBALL_PATH } from "@/lib/content/regan-on-football";
import { formatListDate } from "@/lib/format";
import { FootballObservedFeature } from "./FootballObservedFeature";

export function FootballObservedHome({ editions }: { editions: Article[] }) {
  const [latest, ...previous] = editions;
  if (!latest) return null;
  return <section className="home-observed" aria-labelledby="home-observed-heading">
    <header className="observed-home-heading">
      <div>
        <h2 id="home-observed-heading"><Link href={REGAN_ON_FOOTBALL_PATH}>Football Observed</Link></h2>
        <p className="column-byline">A weekly column by Denny Regan</p>
      </div>
      <Link className="collection-link" href={REGAN_ON_FOOTBALL_PATH}>All editions →</Link>
    </header>
    <FootballObservedFeature article={latest} home />
    {previous.length > 0 && <nav className="observed-recent" aria-label="Previous Football Observed editions">
      <h3 className="eyebrow">Previous editions</h3>
      <ul>{previous.slice(0, 2).map(article => <li key={article.slug}>
        <time dateTime={article.date}>{formatListDate(article.date)}</time>
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </li>)}</ul>
    </nav>}
  </section>;
}
