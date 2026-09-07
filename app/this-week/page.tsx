import Link from "next/link";
import { getArchiveFeatures } from "@/lib/content/archive";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryWeek } from "@/app/components/HistoryWeek";
import { getHistoryEvents, getHistoryWindow, getWeekReading } from "@/lib/content/this-week";
import "./this-week.css";

export const metadata = {
  title: "This Week in Liverpool History | The Liverpool Brief",
  description: "Seven days of Liverpool history, with verified sources and links to full Archive stories.",
};
// Render on each visit so a cached build cannot leave yesterday's window on screen.
export const dynamic = "force-dynamic";

export default function ThisWeekPage() {
  const days = getHistoryWindow(getHistoryEvents());
  const reading = getWeekReading(getArchiveFeatures(), days);
  return <><SiteHeader active="this-week" /><main id="main-content" className="reading-page history-page">
    <h1>This Week in Liverpool History</h1>
    <p className="history-range"><time dateTime={days[0].iso}>{days[0].label}</time> – <time dateTime={days[6].iso}>{days[6].label}</time></p>
    <HistoryWeek days={days} />
    {reading.length > 0 && <section className="history-section" aria-labelledby="further-reading">
      <h2 id="further-reading">Further reading</h2>
      <p className="history-summary">Longer stories from this week in Liverpool history.</p>
      {reading.map(article => <article className="history-entry" key={article.slug}>
        <h3><Link href={`/archive/${article.slug}`}>{article.title}</Link></h3>
        <p className="history-summary">{article.excerpt}</p>
        <Link className="read-link" href={`/archive/${article.slug}`}>Read the full story →</Link>
      </article>)}
    </section>}
  </main></>;
}
