import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryHeader } from "@/app/components/HistoryHeader";
import { getVisibleSeries, SERIES_PATH } from "@/lib/content/history";
import { socialMetadata } from "@/lib/social-metadata";
import "../history.css";

export const revalidate = 3600;

export const metadata = socialMetadata("Series | The Liverpool Brief", "Longer stories from Liverpool's past, told part by part.", SERIES_PATH);

export default function SeriesIndexPage() {
  const series = getVisibleSeries();
  return <>
    <SiteHeader active="history" />
    <main id="main-content" className="history-page">
      <HistoryHeader title="Series" />
      {series.length ? <ul className="history-links">
        {series.map(item => <li key={item.slug}><Link href={`${SERIES_PATH}/${item.slug}`}>
          <h2>{item.title}</h2>
          <p>{item.parts.length} of {item.totalParts} parts published</p>
        </Link></li>)}
      </ul> : <p className="empty-state">The first series will appear here when published.</p>}
    </main>
  </>;
}
