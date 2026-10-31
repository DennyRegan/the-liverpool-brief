import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { formatDayDate, getVisibleLookingBack, groupByWeek, LOOKING_BACK_PATH } from "@/lib/content/looking-back";
import { socialMetadata } from "@/lib/social-metadata";
import "./looking-back.css";

// Regenerated at most hourly, so dated pieces appear without a new deploy.
export const revalidate = 3600;

export const metadata = socialMetadata(
  "Looking Back | The Liverpool Brief",
  "One short keepsake a week from Liverpool's past.",
  LOOKING_BACK_PATH,
);

export default function LookingBackPage() {
  const weeks = groupByWeek(getVisibleLookingBack());
  return <>
    <SiteHeader active="looking-back" />
    <main id="main-content" className="site-width collection">
      <h1 className="collection-title">Looking Back</h1>
      {weeks.length ? weeks.map(week => <section key={week.sunday} className="lb-week" aria-labelledby={`week-${week.sunday}`}>
        <h2 id={`week-${week.sunday}`} className="lb-week-heading">{week.heading}</h2>
        <ol className="lb-list">
          {week.pieces.map(piece => <li key={piece.slug}>
            {piece.scheduled && <p className="lb-scheduled" role="note">Scheduled for {formatDayDate(piece.liveFrom)}</p>}
            <p className="lb-list-dateline">{piece.dateline}</p>
            <h3><Link href={`${LOOKING_BACK_PATH}/${piece.slug}`}>{piece.title}</Link></h3>
            <p className="preview-excerpt">{piece.excerpt}</p>
          </li>)}
        </ol>
      </section>) : <p className="empty-state">The first keepsake will appear here when published.</p>}
    </main>
  </>;
}
