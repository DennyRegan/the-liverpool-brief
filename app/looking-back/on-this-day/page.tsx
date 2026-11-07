import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryHeader } from "@/app/components/HistoryHeader";
import { formatDayDate, getVisibleLookingBack, LOOKING_BACK_PATH, ON_THIS_DAY_PATH, ON_THIS_DAY_PREVIOUS_PATH, splitOnThisDay } from "@/lib/content/looking-back";
import { socialMetadata } from "@/lib/social-metadata";
import "../looking-back.css";
import "../history.css";

// Regenerated at most hourly, so a new week appears on its Monday without a deploy.
export const revalidate = 3600;

export const metadata = socialMetadata(
  "On This Day | Looking Back | The Liverpool Brief",
  "Moments from Liverpool's past that happened this week.",
  ON_THIS_DAY_PATH,
);

type Piece = ReturnType<typeof getVisibleLookingBack>[number];

function PieceList({ pieces }: { pieces: Piece[] }) {
  return <ol className="history-list">
    {pieces.map(piece => <li key={piece.slug}>
      {piece.scheduled && <p className="history-scheduled" role="note">Scheduled for {formatDayDate(piece.liveFrom)}</p>}
      <p className="history-list-meta">{piece.dateline}</p>
      <h3><Link href={`${LOOKING_BACK_PATH}/${piece.slug}`}>{piece.title}</Link></h3>
      <p className="history-list-excerpt">{piece.excerpt}</p>
    </li>)}
  </ol>;
}

/** This Monday–Sunday week only (Europe/London), in date order. Earlier weeks are on Previous weeks. */
export default function OnThisDayPage() {
  const { week, thisWeek, previousWeeks, upcoming } = splitOnThisDay(getVisibleLookingBack());
  return <>
    <SiteHeader active="looking-back" />
    <main id="main-content" className="site-width collection history-index">
      <HistoryHeader title="On This Day" standfirst={`This week · ${week.range}`} />
      {thisWeek.length ? <PieceList pieces={thisWeek} /> : <p className="empty-state">Nothing this week yet.</p>}
      {previousWeeks.length > 0 && <p className="otd-previous"><Link href={ON_THIS_DAY_PREVIOUS_PATH}>Previous weeks <span aria-hidden="true">→</span></Link></p>}
      {/* Previews and local only: production never has pieces from later weeks. */}
      {upcoming.length > 0 && <section className="history-decade" aria-labelledby="otd-upcoming">
        <h2 id="otd-upcoming" className="history-decade-heading">Coming up (preview only)</h2>
        <PieceList pieces={upcoming} />
      </section>}
    </main>
  </>;
}
