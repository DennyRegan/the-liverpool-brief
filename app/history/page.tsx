import { JourneyCards } from "@/app/components/history/V3Exploration";
import { getV3View } from "@/lib/content/history-v3-view";
import Link from "next/link";
import { HistoryNav } from "@/app/components/history/HistoryNav";
import { SiteHeader } from "@/app/components/SiteHeader";
import { EraCard } from "@/app/components/history/EraCard";
import { getFactualHistoryArticles } from "@/lib/content/archive";
import { getHistory, getEraArticles, eraYears } from "@/lib/content/history";
import { formatListDate } from "@/lib/format";

export const metadata = {
  title: "Liverpool History Explorer | The Liverpool Brief",
  description: "Explore Liverpool’s modern history, from Bill Shankly onwards. The managers, major honours, key players and related articles, era by era.",
  alternates: { canonical: "/history" },
};

export default function HistoryPage() {
  const history = getHistory();
  const articles = getFactualHistoryArticles();
  return (
    <>
      <SiteHeader active="history" />
      <main id="main-content" className="site-width hx-page">
      <HistoryNav active="explorer" />
        <header className="hx-intro">
          <p className="eyebrow">Liverpool FC · {history.eras[0].startDate.slice(0, 4)} onwards</p>
          <h1>Liverpool History Explorer</h1>
          <p className="hx-standfirst">The managers, the teams and the moments that shaped modern Liverpool. Start with a person, a season or a match. Follow a guided journey, or find your own way through the years.</p>
        </header>

        <nav className="entity-entry-links" aria-label="Ways into Liverpool history">
          <Link href="/history/timeline">Timeline <span>Follow the writing through the years →</span></Link>
          <Link href="/history/my-years">Your Liverpool Years <span>Choose where your story begins →</span></Link>
          <Link href="/history/seasons">Seasons <span>Teams, trophies and turning points →</span></Link>
          <Link href="/history/matches">Matches <span>Explore the original match writing →</span></Link>
          <Link href="#era-index">Managerial eras <span>Follow Liverpool’s managers →</span></Link>
          <Link href="/history/journeys">Guided Journeys <span>Read a story across the library →</span></Link>
          <Link href="/history/players">People <span>Players, managers and their stories →</span></Link>
          <Link href="/history/opposition">Opposition <span>Liverpool against familiar rivals →</span></Link>
          <Link href="/history/competitions">Competitions <span>League campaigns and cup runs →</span></Link>
        </nav>
        <section className="v3-featured" aria-labelledby="guided-journeys"><h2 id="guided-journeys">Follow a guided journey</h2><JourneyCards journeys={getV3View().journeys} headingLevel={3} /></section>
        <details className="hx-index" id="era-index">
          <summary>Choose an era<span aria-hidden="true">↓</span></summary>
          <nav aria-label="Choose a managerial era">
            <ol role="list">{history.eras.map(era => <li key={era.id}>
              <a href={`#${era.id}`}><span>{era.manager}</span><span>{eraYears(era)}</span></a>
            </li>)}</ol>
          </nav>
        </details>

        <ol className="hx-timeline" aria-label="Liverpool managerial chronology" role="list">
          {history.eras.map(era => <li key={era.id}>
            <EraCard era={era} articles={getEraArticles(articles, era.id, history.eras)} />
          </li>)}
        </ol>

        <aside className="hx-colophon">
          <p>A guide to the men’s first team, including the 1991 caretaker spell and the 1998 joint tenure. Key players are a small editorial selection.</p>
          <p>{history.honoursNote}</p>
          <p>Facts checked {formatListDate(history.verifiedOn)}. Sources and date notes appear with each era.</p>
          <Link href="/history/matches">Browse historical matches <span aria-hidden="true">→</span></Link>
          <a href="#main-content">Back to the top <span aria-hidden="true">↑</span></a>
        </aside>
      </main>
    </>
  );
}
