import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryHeader, ScheduledNote } from "@/app/components/HistoryHeader";
import { getVisibleSeries, getVisibleSeriesBySlug, SERIES_PATH } from "@/lib/content/history";
import { formatDayDate } from "@/lib/content/go-live";
import { socialMetadata } from "@/lib/social-metadata";
import "../../history.css";

export const dynamicParams = true;
export const revalidate = 3600;

export function generateStaticParams() {
  return getVisibleSeries().map(item => ({ series: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ series: string }> }): Promise<Metadata> {
  const series = getVisibleSeriesBySlug((await params).series);
  if (!series) return {};
  return socialMetadata(`${series.title} | The Liverpool Brief`, `${series.title}: a ${series.totalParts}-part series.`, `${SERIES_PATH}/${series.slug}`);
}

export default async function SeriesPage({ params }: { params: Promise<{ series: string }> }) {
  const series = getVisibleSeriesBySlug((await params).series);
  if (!series) notFound();
  return <>
    <SiteHeader active="looking-back" />
    <main id="main-content" className="history-page">
      <div className="reading-tools"><Link href={SERIES_PATH} className="back-link">‹ Series</Link></div>
      <HistoryHeader title={series.title} standfirst={`A series in ${series.totalParts} parts.`} count={`${series.parts.filter(p => !p.scheduled).length} published so far.`} />
      <ol className="history-list">
        {series.parts.map(part => <li key={part.slug}>
          {part.scheduled && <ScheduledNote date={formatDayDate(part.liveFrom)} />}
          <p className="history-list-meta">Part {part.partNumber} of {series.totalParts}</p>
          <h3><Link href={`${SERIES_PATH}/${series.slug}/${part.slug}`}>{part.title}</Link></h3>
          <p className="history-list-excerpt">{part.excerpt}</p>
        </li>)}
      </ol>
    </main>
  </>;
}
