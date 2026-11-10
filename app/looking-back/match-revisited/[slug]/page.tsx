import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryArticle } from "@/app/components/HistoryArticle";
import { getVisibleMatchRevisited, getVisibleMatchRevisitedPiece, MATCH_REVISITED_PATH } from "@/lib/content/history";
import { formatDayDate } from "@/lib/content/go-live";
import { formatDayMonthYear, readTime } from "@/lib/content/history-article";
import { getRelatedPieces } from "@/lib/content/related";
import { socialMetadata } from "@/lib/social-metadata";

// dynamicParams lets a piece whose Monday arrives later render on request instead
// of staying a 404 until the next deploy; revalidate re-checks each page hourly.
export const dynamicParams = true;
export const revalidate = 600;

export function generateStaticParams() {
  return getVisibleMatchRevisited().map(piece => ({ slug: piece.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const piece = getVisibleMatchRevisitedPiece((await params).slug);
  if (!piece) return {};
  const metadata = socialMetadata(piece.headline ?? piece.title, piece.excerpt, `${MATCH_REVISITED_PATH}/${piece.slug}`);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article", publishedTime: piece.date } };
}

export default async function MatchRevisitedPiecePage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const pieces = getVisibleMatchRevisited();
  const index = pieces.findIndex(item => item.slug === slug);
  if (index < 0) notFound();
  const piece = pieces[index];
  // The list is newest first, so the next index is the previous (older) piece.
  const older = pieces[index + 1], newer = pieces[index - 1];
  const step = (item: typeof piece | undefined, label: string) => item ? { href: `${MATCH_REVISITED_PATH}/${item.slug}`, label, detail: item.title } : undefined;
  return <>
    <SiteHeader active="looking-back" />
    <HistoryArticle
      masthead="The Liverpool Brief"
      back={{ href: MATCH_REVISITED_PATH, label: "Back to Match Revisited" }}
      kicker={`Match Revisited · ${piece.competition} · ${piece.eventDate.slice(0, 4)}`}
      title={piece.headline ?? piece.title}
      scoreline={`${piece.scoreline} v ${piece.opponent}`}
      standfirst={piece.excerpt}
      dateline={[formatDayMonthYear(piece.eventDate), "Match Revisited", readTime(piece.body)]}
      body={piece.body}
      scheduledFor={piece.scheduled ? formatDayDate(piece.liveFrom) : undefined}
      previous={step(older, "Earlier")}
      next={step(newer, "Later")}
      related={getRelatedPieces(`${MATCH_REVISITED_PATH}/${piece.slug}`)}
      links={[{ href: MATCH_REVISITED_PATH, label: "All matches" }]}
    />
  </>;
}
