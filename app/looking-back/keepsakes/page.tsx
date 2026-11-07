import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryHeader, plural } from "@/app/components/HistoryHeader";
import { formatDayDate, getVisibleLookingBack, groupByWeek, KEEPSAKES_PATH, LOOKING_BACK_PATH } from "@/lib/content/looking-back";
import { socialMetadata } from "@/lib/social-metadata";
import "../looking-back.css";
import "../history.css";

// Regenerated at most hourly, so dated pieces appear without a new deploy.
export const revalidate = 3600;

export const metadata = socialMetadata(
  "Keepsakes | Looking Back | The Liverpool Brief",
  "The best moments from Liverpool's past, every week.",
  KEEPSAKES_PATH,
);

export default function KeepsakesPage() {
  const pieces = getVisibleLookingBack();
  const weeks = groupByWeek(pieces);
  return <>
    <SiteHeader active="looking-back" />
    <main id="main-content" className="site-width collection history-index">
      <HistoryHeader title="Keepsakes" standfirst="The best moments from Liverpool's past, every week." count={plural(pieces.filter(p => !p.scheduled).length, "keepsake")} />
      {weeks.length ? weeks.map(week => <section key={week.sunday} className="history-decade" aria-labelledby={`week-${week.sunday}`}>
        <h2 id={`week-${week.sunday}`} className="history-decade-heading">{week.heading}</h2>
        <ol className="history-list">
          {week.pieces.map(piece => <li key={piece.slug}>
            {piece.scheduled && <p className="history-scheduled" role="note">Scheduled for {formatDayDate(piece.liveFrom)}</p>}
            <p className="history-list-meta">{piece.dateline}</p>
            <h3><Link href={`${LOOKING_BACK_PATH}/${piece.slug}`}>{piece.title}</Link></h3>
            <p className="history-list-excerpt">{piece.excerpt}</p>
          </li>)}
        </ol>
      </section>) : <p className="empty-state">The first keepsake will appear here when published.</p>}
    </main>
  </>;
}
