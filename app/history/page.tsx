import Link from "next/link";
import { HistoryNav } from "@/app/components/history/HistoryNav";
import { SiteHeader } from "@/app/components/SiteHeader";
import { EraCard } from "@/app/components/history/EraCard";
import { getArchiveFeatures } from "@/lib/content/archive";
import { getHistory, getEraArticles, eraYears } from "@/lib/content/history";
import { formatListDate } from "@/lib/format";

export const metadata = {
  title: "Liverpool History Explorer | The Liverpool Brief",
  description: "Explore Liverpool’s modern history, from Bill Shankly onwards. The managers, major honours, key players and original Archive writing, era by era.",
  alternates: { canonical: "/history" },
};

export default function HistoryPage() {
  const history = getHistory();
  const articles = getArchiveFeatures();
  return (
    <>
      <SiteHeader active="history" />
      <main id="main-content" className="site-width hx-page">
      <HistoryNav active="explorer" />
        <header className="hx-intro">
          <p className="eyebrow">Liverpool FC · {history.eras[0].startDate.slice(0, 4)} onwards</p>
          <h1>Liverpool History Explorer</h1>
          <p className="hx-standfirst">The managers, the teams and the moments that shaped modern Liverpool. Follow the story from Shankly, or step into an era you remember.</p>
        </header>

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
          <Link href="/articles?category=archive">Read all Archive writing <span aria-hidden="true">→</span></Link>
          <a href="#main-content">Back to the top <span aria-hidden="true">↑</span></a>
        </aside>
      </main>
    </>
  );
}
