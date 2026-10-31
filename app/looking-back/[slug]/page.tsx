import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ShareButton } from "@/app/components/ShareButton";
import { formatDayDate, getVisibleLookingBack, getVisibleLookingBackPiece, LOOKING_BACK_BYLINE, LOOKING_BACK_PATH } from "@/lib/content/looking-back";
import { socialMetadata } from "@/lib/social-metadata";
import "../looking-back.css";

// Pages built at deploy time cover the pieces visible then. dynamicParams lets
// a piece whose date arrives later render on request instead of staying a 404
// until the next deploy; revalidate re-checks each page at most hourly.
export const dynamicParams = true;
export const revalidate = 3600;

export function generateStaticParams() {
  return getVisibleLookingBack().map(piece => ({ slug: piece.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const piece = getVisibleLookingBackPiece((await params).slug);
  if (!piece) return {};
  const metadata = socialMetadata(piece.title, piece.excerpt, `${LOOKING_BACK_PATH}/${piece.slug}`);
  return { ...metadata, authors: [{ name: LOOKING_BACK_BYLINE }], openGraph: { ...metadata.openGraph, type: "article", publishedTime: piece.date, authors: [LOOKING_BACK_BYLINE] } };
}

export default async function LookingBackPiecePage({ params }: { params: Promise<{ slug: string }> }) {
  const piece = getVisibleLookingBackPiece((await params).slug);
  if (!piece) notFound();
  return <>
    <SiteHeader active="looking-back" />
    <main id="main-content" className="lb-page">
      <div className="reading-tools">
        <Link href={LOOKING_BACK_PATH} className="back-link">‹ Looking Back</Link>
        <ShareButton title={piece.title} />
      </div>
      {piece.scheduled && <p className="lb-scheduled lb-scheduled--page" role="note">Scheduled for {formatDayDate(piece.liveFrom)}</p>}
      <article className="lb-cutting" aria-labelledby="lb-headline">
        <p className="lb-masthead">The Brief · Looking Back</p>
        <p className="lb-dateline">{piece.dateline}</p>
        <h1 id="lb-headline" className="lb-headline">{piece.title}</h1>
        {piece.scoreline && <p className="lb-scoreline">{piece.scoreline}</p>}
        <p className="lb-byline">By {LOOKING_BACK_BYLINE}</p>
        <div className="lb-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{piece.body}</ReactMarkdown></div>
      </article>
      <p className="lb-actions">
        <a href={`${LOOKING_BACK_PATH}/${piece.slug}/opengraph-image`} download={`${piece.slug}.png`}>Download image</a>
      </p>
    </main>
  </>;
}
