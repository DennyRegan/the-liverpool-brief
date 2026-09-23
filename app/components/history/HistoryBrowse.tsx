import { EntityDirectory } from './EntityExploration';
import { getExplorations } from '@/lib/content/exploration';
import { HistoryBrowseList } from "./HistoryBrowseList";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryNav } from "@/app/components/history/HistoryNav";
import Link from "next/link";
import { getPublishedExperiences } from "@/lib/content/interactive-history";
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
        <h1>{matches ? "Matches" : "People"}</h1>
        <p className="hx-standfirst">{matches
          ? "Historical match reports: what happened, how the games unfolded and why they mattered."
          : "Players and managers, connected through the original writing. Explore a person or read a biography below."}</p>
      </header>
      {matches && getPublishedExperiences().length > 0 && <p className="hx-context"><Link href="/history/interactive">Explore Interactive History <span aria-hidden="true">→</span></Link></p>}
      {!matches && <section aria-labelledby="people-explore"><h2 id="people-explore" className="entity-heading">Explore people</h2><EntityDirectory destinations={getExplorations().filter(d => d.entity.kind === 'person')} /></section>}
      {!matches && <h2 className="entity-heading" id="biographies">Biographies and player features</h2>}
      <HistoryBrowseList section={section} articles={articles.map(({ slug, title, excerpt, historicalPeriod, historicalEventDate, decade, season }) => ({ slug, title, excerpt, historicalPeriod, historicalEventDate, decade, season }))} />
    </main>
  </>;
}
