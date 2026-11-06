import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryHeader } from "@/app/components/HistoryHeader";
import { getVisibleSeries, SERIES_PATH } from "@/lib/content/history";
import { socialMetadata } from "@/lib/social-metadata";
import "../history.css";

export const revalidate = 3600;

export const metadata = socialMetadata("Series | Looking Back | The Liverpool Brief", "Longer stories from Liverpool's past, told part by part.", SERIES_PATH);

export default function SeriesIndexPage() {
  const series = getVisibleSeries();
  return <>
    <SiteHeader active="looking-back" />
    <main id="main-content" className="history-page">
      <HistoryHeader title="Series" standfirst="Longer stories told part by part." />
      {series.length ? <ol className="history-list">
        {series.map(item => <li key={item.slug}>
          <p className="history-list-meta">{item.parts.filter(p => !p.scheduled).length} of {item.totalParts} parts published</p>
          <h3><Link href={`${SERIES_PATH}/${item.slug}`}>{item.title}</Link></h3>
          <p className="history-list-excerpt">Latest: part {item.parts[item.parts.length - 1].partNumber}, {item.parts[item.parts.length - 1].title}.</p>
        </li>)}
      </ol> : <p className="empty-state">The first series will appear here when published.</p>}
    </main>
  </>;
}
