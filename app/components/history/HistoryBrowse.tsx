import { HistoryBrowseList } from "./HistoryBrowseList";
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
      <HistoryBrowseList section={section} articles={articles.map(({ slug, title, excerpt, historicalPeriod, decade, season }) => ({ slug, title, excerpt, historicalPeriod, decade, season }))} />
    </main>
  </>;
}
