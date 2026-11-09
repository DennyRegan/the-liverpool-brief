import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryArticle } from "@/app/components/HistoryArticle";
import { BIOGRAPHIES_PATH, getVisibleBiographies, getVisibleBiography } from "@/lib/content/history";
import { formatDayDate } from "@/lib/content/go-live";
import { readTime } from "@/lib/content/history-article";
import { getRelatedPieces } from "@/lib/content/related";
import { socialMetadata } from "@/lib/social-metadata";

// dynamicParams lets a piece whose Monday arrives later render on request instead
// of staying a 404 until the next deploy; revalidate re-checks each page hourly.
export const dynamicParams = true;
export const revalidate = 3600;

export function generateStaticParams() {
  return getVisibleBiographies().map(person => ({ slug: person.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const person = getVisibleBiography((await params).slug);
  if (!person) return {};
  const metadata = socialMetadata(person.title, person.excerpt, `${BIOGRAPHIES_PATH}/${person.slug}`);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article", publishedTime: person.date } };
}

export default async function BiographyPage({ params }: { params: Promise<{ slug: string }> }) {
  const person = getVisibleBiography((await params).slug);
  if (!person) notFound();
  return <>
    <SiteHeader active="looking-back" />
    <HistoryArticle
      back={{ href: BIOGRAPHIES_PATH, label: "Back to Biographies" }}
      kicker={`Biography · ${person.decade}`}
      title={person.title}
      standfirst={person.excerpt}
      dateline={[person.historicalPeriod, person.role ?? "Biography", readTime(person.body)]}
      body={person.body}
      scheduledFor={person.scheduled ? formatDayDate(person.liveFrom) : undefined}
      links={[{ href: BIOGRAPHIES_PATH, label: "All biographies" }]}
      related={getRelatedPieces(`${BIOGRAPHIES_PATH}/${person.slug}`)}
    />
  </>;
}
