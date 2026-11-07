import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryHeader } from "@/app/components/HistoryHeader";
import { getVisibleLookingBack, LOOKING_BACK_PATH, ON_THIS_DAY_PATH, ON_THIS_DAY_PREVIOUS_PATH, splitOnThisDay } from "@/lib/content/looking-back";
import { socialMetadata } from "@/lib/social-metadata";
import "../../looking-back.css";
import "../../history.css";

export const revalidate = 3600;

export const metadata = socialMetadata(
  "Previous weeks | On This Day | The Liverpool Brief",
  "Earlier weeks of On This Day, newest week first.",
  ON_THIS_DAY_PREVIOUS_PATH,
);

/** Every week before the current one, newest week first, earliest piece first within a week. */
export default function OnThisDayPreviousPage() {
  const { previousWeeks } = splitOnThisDay(getVisibleLookingBack());
  return <>
    <SiteHeader active="looking-back" />
    <main id="main-content" className="site-width collection history-index">
      <div className="reading-tools"><Link href={ON_THIS_DAY_PATH} className="back-link">‹ On This Day</Link></div>
      <HistoryHeader title="Previous weeks" standfirst="Earlier weeks of On This Day." />
      {previousWeeks.length ? previousWeeks.map(week => <section key={week.sunday} className="history-decade" aria-labelledby={`week-${week.sunday}`}>
        <h2 id={`week-${week.sunday}`} className="history-decade-heading">{week.heading}</h2>
        <ol className="history-list">
          {week.pieces.map(piece => <li key={piece.slug}>
            <p className="history-list-meta">{piece.dateline}</p>
            <h3><Link href={`${LOOKING_BACK_PATH}/${piece.slug}`}>{piece.title}</Link></h3>
            <p className="history-list-excerpt">{piece.excerpt}</p>
          </li>)}
        </ol>
      </section>) : <p className="empty-state">Earlier weeks will appear here.</p>}
    </main>
  </>;
}
