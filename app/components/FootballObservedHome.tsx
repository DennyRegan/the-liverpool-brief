import Link from "next/link";
import type { Article } from "@/lib/content/types";
import { REGAN_ON_FOOTBALL_PATH } from "@/lib/content/regan-on-football";
import { FootballObservedFeature } from "./FootballObservedFeature";

export function FootballObservedHome({ article }: { article: Article }) {
  return <section className="home-observed" aria-labelledby="home-observed-heading">
    <header className="observed-home-heading">
      <div>
        <h2 id="home-observed-heading"><Link href={REGAN_ON_FOOTBALL_PATH}>Football Observed</Link></h2>
        <p className="column-byline">A weekly column by Denny Regan</p>
      </div>
      <Link className="collection-link" href={REGAN_ON_FOOTBALL_PATH}>All editions →</Link>
    </header>
    <FootballObservedFeature article={article} home />
  </section>;
}
