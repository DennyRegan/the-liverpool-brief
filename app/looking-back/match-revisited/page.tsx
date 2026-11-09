import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryHeader, plural, ScheduledNote } from "@/app/components/HistoryHeader";
import { getVisibleMatchRevisited, MATCH_REVISITED_PATH } from "@/lib/content/history";
import { formatDayDate } from "@/lib/content/go-live";
import { formatDayMonthYear } from "@/lib/content/history-article";
import { socialMetadata } from "@/lib/social-metadata";
import "../history.css";

// Regenerated at most hourly, so a Monday piece appears without a new deploy.
export const revalidate = 3600;

export const metadata = socialMetadata("Match Revisited | Looking Back | The Liverpool Brief", "One classic Liverpool match, written up at length every Monday.", MATCH_REVISITED_PATH);

export default function MatchRevisitedPage() {
  const pieces = getVisibleMatchRevisited();
  return <>
    <SiteHeader active="looking-back" />
    <main id="main-content" className="site-width collection history-index">
      <HistoryHeader title="Match Revisited" standfirst="One classic Liverpool match, written up at length every Monday." count={plural(pieces.filter(p => !p.scheduled).length, "match", "matches")} />
      {pieces.length ? <ol className="history-list">
        {pieces.map(piece => <li key={piece.slug}>
          {piece.scheduled && <ScheduledNote date={formatDayDate(piece.liveFrom)} />}
          <p className="history-list-meta">{piece.scoreline} · {piece.competition} · {formatDayMonthYear(piece.eventDate)}</p>
          <h3><Link href={`${MATCH_REVISITED_PATH}/${piece.slug}`}>{piece.title}</Link></h3>
          <p className="history-list-excerpt">{piece.excerpt}</p>
        </li>)}
      </ol> : <p className="empty-state">The first Match Revisited will appear here when published.</p>}
    </main>
  </>;
}
