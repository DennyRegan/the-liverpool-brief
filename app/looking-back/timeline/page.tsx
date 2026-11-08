import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryHeader } from "@/app/components/HistoryHeader";
import { getVisibleTimeline, seasonLabel, TIMELINE_PATH } from "@/lib/content/timeline";
import { socialMetadata } from "@/lib/social-metadata";
import { TimelineView } from "./TimelineView";
import "../history.css";
import "./timeline.css";

// Regenerated at most hourly, so entries appear as the pieces they link to go live.
export const revalidate = 3600;

export const metadata = socialMetadata(
  "Klopp's Liverpool timeline | The Liverpool Brief",
  "The key matches, signings and moments of the Klopp era, season by season.",
  TIMELINE_PATH,
);

export default function TimelinePage() {
  const cards = getVisibleTimeline();
  const seasons = [...new Set(cards.map(card => card.season))].sort().map(season => ({
    id: season, label: seasonLabel(season),
    main: cards.filter(c => c.season === season && c.priority === "main"),
    extended: cards.filter(c => c.season === season && c.priority === "extended"),
  }));
  return <>
    <SiteHeader active="looking-back" />
    <main id="main-content" className="site-width collection history-index tl">
      <div className="reading-tools"><Link href="/looking-back" className="back-link">‹ Looking Back</Link></div>
      <HistoryHeader title="Klopp's Liverpool timeline" standfirst="October 2015 to May 2024: the key matches, signings and moments, season by season." />
      {seasons.length ? <TimelineView seasons={seasons} /> : <p className="empty-state">The timeline will appear here as the series is published.</p>}
    </main>
  </>;
}
