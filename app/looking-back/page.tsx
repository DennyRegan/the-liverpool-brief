import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { plural } from "@/app/components/HistoryHeader";
import { BIOGRAPHIES_PATH, getLookingBackHub, MATCH_REVISITED_PATH, SERIES_PATH } from "@/lib/content/history";
import { formatWeekRange, LOOKING_BACK_PATH, ON_THIS_DAY_PATH } from "@/lib/content/looking-back";
import { socialMetadata } from "@/lib/social-metadata";
import "./history.css";

// Regenerated at most hourly, so counts and the week change without a deploy.
export const revalidate = 3600;

export const metadata = socialMetadata(
  "Looking Back | The Liverpool Brief",
  "Series, On This Day, Match Revisited and biographies from Liverpool's past.",
  LOOKING_BACK_PATH,
);

/**
 * "What is Looking Back": the same header and entry pattern as Match Revisited
 * (history.css), then the four sections as whole-entry links. Every count and the
 * week range come from the content files via getLookingBackHub.
 */
export default function LookingBackHub() {
  const { series, onThisDay, biographies, matchRevisited } = getLookingBackHub();
  const entries = [
    { href: SERIES_PATH, title: "Series", meta: `${plural(series.count, "series", "series")} · ${plural(series.parts, "part")}`, isNew: series.newThisWeek, standfirst: "Longer stories told in parts, one chapter at a time. Currently running: Klopp's Liverpool." },
    { href: ON_THIS_DAY_PATH, title: "On This Day", meta: `This week · ${formatWeekRange(onThisDay.monday, onThisDay.sunday)}`, standfirst: "The anniversaries that fall this week in Liverpool's history, with a fresh set each week." },
    // Match Revisited: listed once it has a live piece.
    ...(matchRevisited ? [{ href: MATCH_REVISITED_PATH, title: "Match Revisited", meta: plural(matchRevisited.count, "match", "matches"), standfirst: "One classic Liverpool match, written up at length every Monday." }] : []),
    { href: BIOGRAPHIES_PATH, title: "Biographies", meta: plural(biographies, "life", "lives"), standfirst: "The people who shaped the club, one life at a time." },
  ];
  return <>
    <SiteHeader active="looking-back" />
    <main id="main-content" className="site-width collection history-index lbh">
      <header className="history-header">
        <p className="history-masthead"><span>Looking Back</span></p>
        <h1 className="history-headline">Looking Back</h1>
        <p className="history-standfirst">Liverpool&rsquo;s history, written up at length.</p>
      </header>
      <section className="lbh-about" aria-label="About Looking Back">
        <p>Looking Back is where The Liverpool Brief goes to the past. Liverpool&rsquo;s history is full of stories that get retold quickly and loosely. These pages take the time to do it properly: researched, checked against the record, and written to be read at length rather than skimmed.</p>
        <p>The aim is to stay close to what actually happened and who was there, and to say so plainly when the record is thin. There are four ways in.</p>
      </section>
      <nav aria-label="Looking Back sections">
        <ol className="history-list">
          {entries.map(entry => <li key={entry.href}>
            <Link href={entry.href} className="lbh-entry">
              <span className="lbh-entry-text">
                <span className="history-list-meta lbh-meta">
                  {entry.meta}
                  {entry.isNew && <span className="lbh-dot"><span className="visually-hidden">, new part this week</span></span>}
                </span>
                <h3>{entry.title}</h3>
                <span className="history-list-excerpt">{entry.standfirst}</span>
              </span>
              <span className="lbh-entry-arrow" aria-hidden="true">→</span>
            </Link>
          </li>)}
        </ol>
      </nav>
    </main>
  </>;
}
