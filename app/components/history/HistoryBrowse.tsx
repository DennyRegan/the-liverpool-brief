import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryNav } from "@/app/components/history/HistoryNav";
import { getHistoryBrowseArticles } from "@/lib/content/archive";

export function HistoryBrowse({ section }: { section: "matches" | "players" }) {
  const articles = getHistoryBrowseArticles(section);
  const matches = section === "matches";
  return <>
    <SiteHeader active="history" />
    <main id="main-content" className="site-width hx-page">
      <HistoryNav active={section} />
      <header className="hx-intro">
        <p className="eyebrow">Liverpool FC · History</p>
        <h1>{matches ? "Matches" : "Players"}</h1>
        <p className="hx-standfirst">{matches
          ? "Historical match reports: what happened, how the games unfolded and why they mattered."
          : "The careers and contributions of Liverpool players, told through factual biographies and historical accounts."}</p>
      </header>
      {articles.length > 0 ? <ul className="hx-reading-list hx-browse-list" role="list">
        {articles.map(article => <li key={article.slug}>
          <article>
            <p className="hx-period">{article.historicalPeriod}</p>
            <h2><Link href={`/archive/${article.slug}`} prefetch={false}>{article.title}<span aria-hidden="true"> ↗</span></Link></h2>
            <p>{article.excerpt}</p>
          </article>
        </li>)}
      </ul> : <p className="hx-quiet">{matches ? "Historical match reports will appear here as they are published." : "Player biographies will appear here as they are published."}</p>}
    </main>
  </>;
}
