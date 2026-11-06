import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryHeader, plural, ScheduledNote } from "@/app/components/HistoryHeader";
import { BIOGRAPHIES_PATH, getVisibleBiographies, groupByDecade } from "@/lib/content/history";
import { formatDayDate } from "@/lib/content/go-live";
import { socialMetadata } from "@/lib/social-metadata";
import "../history.css";

// Regenerated at most hourly, so dated pieces appear without a new deploy.
export const revalidate = 3600;

export const metadata = socialMetadata("Biographies | Looking Back | The Liverpool Brief", "The people who made Liverpool, by decade.", BIOGRAPHIES_PATH);

export default function BiographiesPage() {
  const people = getVisibleBiographies();
  const decades = groupByDecade(people);
  return <>
    <SiteHeader active="looking-back" />
    <main id="main-content" className="history-page">
      <HistoryHeader title="Biographies" standfirst="The people who made Liverpool, by decade." count={plural(people.filter(p => !p.scheduled).length, "biography", "biographies")} />
      {decades.length ? decades.map(({ decade, entries }) => <section key={decade} className="history-decade" aria-labelledby={`decade-${decade}`}>
        <h2 id={`decade-${decade}`} className="history-decade-heading">{decade}</h2>
        <ol className="history-list">
          {entries.map(person => <li key={person.slug}>
            {person.scheduled && <ScheduledNote date={formatDayDate(person.liveFrom)} />}
            <p className="history-list-meta">{person.historicalPeriod}</p>
            <h3><Link href={`${BIOGRAPHIES_PATH}/${person.slug}`}>{person.title}</Link></h3>
            <p className="history-list-excerpt">{person.excerpt}</p>
          </li>)}
        </ol>
      </section>) : <p className="empty-state">The first biography will appear here when published.</p>}
    </main>
  </>;
}
