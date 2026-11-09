import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryArticle } from "@/app/components/HistoryArticle";
import { getVisibleSeries, getVisibleSeriesPart, SERIES_PATH } from "@/lib/content/history";
import { formatDayDate } from "@/lib/content/go-live";
import { formatDayMonthYear, readTime } from "@/lib/content/history-article";
import { getRelatedPieces } from "@/lib/content/related";
import { socialMetadata } from "@/lib/social-metadata";

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
  const seriesPath = `${SERIES_PATH}/${series.slug}`;
  return <>
    <SiteHeader active="looking-back" />
    <HistoryArticle
      back={{ href: seriesPath, label: `Back to ${series.title}` }}
      kicker={`${series.title} · Part ${part.partNumber} of ${series.totalParts}`}
      title={part.title}
      standfirst={part.excerpt}
      dateline={[formatDayMonthYear(part.date), "Series", readTime(part.body)]}
      body={part.body}
      scheduledFor={part.scheduled ? formatDayDate(part.liveFrom) : undefined}
      previous={previous && { href: `${seriesPath}/${previous.slug}`, label: `Part ${previous.partNumber}`, detail: previous.title }}
      next={next && { href: `${seriesPath}/${next.slug}`, label: `Part ${next.partNumber}`, detail: next.title }}
      links={[{ href: seriesPath, label: "All parts" }]}
      related={getRelatedPieces(`${seriesPath}/${part.slug}`)}
    />
  </>;
}
