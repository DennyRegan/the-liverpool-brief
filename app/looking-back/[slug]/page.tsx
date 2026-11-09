import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryArticle } from "@/app/components/HistoryArticle";
import { formatDayDate, getVisibleLookingBack, getVisibleLookingBackPiece, LOOKING_BACK_BYLINE, LOOKING_BACK_PATH, ON_THIS_DAY_PATH, ON_THIS_DAY_PREVIOUS_PATH } from "@/lib/content/looking-back";
import { formatDayMonthYear, onThisDayKicker, readTime } from "@/lib/content/history-article";
import { getRelatedPieces } from "@/lib/content/related";
import { socialMetadata } from "@/lib/social-metadata";

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
  // Previous and next by anniversary date, among the pieces this deployment may show.
  const ordered = [...getVisibleLookingBack()].sort((a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug));
  const index = ordered.findIndex(item => item.slug === piece.slug);
  const [previous, next] = [ordered[index - 1], ordered[index + 1]];
  return <>
    <SiteHeader active="looking-back" />
    <HistoryArticle
      back={{ href: ON_THIS_DAY_PATH, label: "Back to this week's On This Day" }}
      kicker={onThisDayKicker(piece) ?? `On This Day · ${piece.eventDate.slice(0, 4)}`}
      title={piece.title}
      scoreline={piece.scoreline}
      standfirst={piece.excerpt}
      byline={`By ${LOOKING_BACK_BYLINE}`}
      dateline={[formatDayMonthYear(piece.eventDate), "On This Day", readTime(piece.body)]}
      body={piece.body}
      scheduledFor={piece.scheduled ? formatDayDate(piece.liveFrom) : undefined}
      previous={previous && { href: `${LOOKING_BACK_PATH}/${previous.slug}`, label: "Previous", detail: previous.title }}
      next={next && { href: `${LOOKING_BACK_PATH}/${next.slug}`, label: "Next", detail: next.title }}
      links={[{ href: ON_THIS_DAY_PREVIOUS_PATH, label: "Previous weeks" }]}
      related={getRelatedPieces(`${LOOKING_BACK_PATH}/${piece.slug}`)}
    >
      <p className="lb-actions">
        <a href={`${LOOKING_BACK_PATH}/${piece.slug}/opengraph-image`} download={`${piece.slug}.png`}>Download image</a>
      </p>
    </HistoryArticle>
  </>;
}
