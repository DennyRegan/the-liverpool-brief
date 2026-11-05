import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ShareButton } from "@/app/components/ShareButton";
import { HistoryHeader, ScheduledNote } from "@/app/components/HistoryHeader";
import { BIOGRAPHIES_PATH, biographyDateline, getVisibleBiographies, getVisibleBiography } from "@/lib/content/history";
import { formatDayDate } from "@/lib/content/go-live";
import { socialMetadata } from "@/lib/social-metadata";
import "../../history.css";

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
    <SiteHeader active="history" />
    <main id="main-content" className="history-page">
      <div className="reading-tools">
        <Link href={BIOGRAPHIES_PATH} className="back-link">‹ Biographies</Link>
        <ShareButton title={person.title} />
      </div>
      {person.scheduled && <ScheduledNote date={formatDayDate(person.liveFrom)} />}
      <article>
        <HistoryHeader title={person.title} dateline={biographyDateline(person)} />
        <div className="history-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{person.body}</ReactMarkdown></div>
      </article>
    </main>
  </>;
}
