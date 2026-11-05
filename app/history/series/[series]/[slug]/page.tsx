import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ShareButton } from "@/app/components/ShareButton";
import { HistoryHeader, ScheduledNote } from "@/app/components/HistoryHeader";
import { getVisibleSeries, getVisibleSeriesPart, SERIES_PATH } from "@/lib/content/history";
import { formatDayDate } from "@/lib/content/go-live";
import { socialMetadata } from "@/lib/social-metadata";
import "../../../history.css";

export const dynamicParams = true;
export const revalidate = 3600;

export function generateStaticParams() {
  return getVisibleSeries().flatMap(item => item.parts.map(part => ({ series: item.slug, slug: part.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ series: string; slug: string }> }): Promise<Metadata> {
  const { series, slug } = await params;
  const found = getVisibleSeriesPart(series, slug);
  if (!found) return {};
  const metadata = socialMetadata(found.part.title, found.part.excerpt, `${SERIES_PATH}/${series}/${slug}`);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article", publishedTime: found.part.date } };
}

export default async function SeriesPartPage({ params }: { params: Promise<{ series: string; slug: string }> }) {
  const { series: seriesSlug, slug } = await params;
  const found = getVisibleSeriesPart(seriesSlug, slug);
  if (!found) notFound();
  const { series, part, previous, next } = found;
  return <>
    <SiteHeader active="history" />
    <main id="main-content" className="history-page">
      <div className="reading-tools">
        <Link href={`${SERIES_PATH}/${series.slug}`} className="back-link">‹ {series.title}</Link>
        <ShareButton title={part.title} />
      </div>
      {part.scheduled && <ScheduledNote date={formatDayDate(part.liveFrom)} />}
      <article>
        <HistoryHeader title={part.title} dateline={`${series.title} · Part ${part.partNumber} of ${series.totalParts}`} />
        <div className="history-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{part.body}</ReactMarkdown></div>
      </article>
      <nav className="history-part-nav" aria-label={`${series.title} parts`}>
        {previous && <Link className="previous" href={`${SERIES_PATH}/${series.slug}/${previous.slug}`}><small>Previous</small>Part {previous.partNumber}: {previous.title}</Link>}
        {next && <Link className="next" href={`${SERIES_PATH}/${series.slug}/${next.slug}`}><small>Next</small>Part {next.partNumber}: {next.title}</Link>}
      </nav>
    </main>
  </>;
}
