import type { Metadata } from 'next';
import Link from 'next/link';
import { getHistoryLibrary, eventsOnDate, londonDate, shiftDate, validDate } from '@/lib/content/history-library';
import { EventList } from '@/app/components/history/EventList';
import { formatLongDate } from '@/lib/format';
export const metadata: Metadata = { title: 'On This Day | The Liverpool Brief', alternates: { canonical: '/history/on-this-day' } };
export default async function OnThisDayPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { date: input } = await searchParams; const invalid = input !== undefined && (typeof input !== 'string' || !validDate(input));
  const date = !invalid && input ? input : londonDate(); const library = getHistoryLibrary(); const events = eventsOnDate(library.events, date);
  return <main id="main-content" className="hl-main"><header className="hl-heading"><p className="hl-eyebrow">On This Day</p><h1>A date with history.</h1><p className="hl-deck">Verified events from Liverpool’s past, connected to the stories behind them.</p></header><form className="hl-filters" action="/history/on-this-day"><label>Choose a calendar date<input type="date" name="date" defaultValue={date} required /></label><button>Show events</button><Link href="/history/on-this-day">Today</Link></form>{invalid && <p role="status" className="hl-empty">That date is invalid. Showing today instead.</p>}<nav className="hl-adjacent" aria-label="Calendar dates"><Link href={`?date=${shiftDate(date, -1)}`}>← Previous day</Link><p>{formatLongDate(date)}</p><Link href={`?date=${shiftDate(date, 1)}`}>Next day →</Link></nav>{events.length ? <EventList events={events} library={library} /> : <div className="hl-empty"><h2>No verified entry for this date yet.</h2><p>The collection is deliberately selective. Browse another date or explore the published match reports.</p><Link className="hl-text-link" href="/history/matches">Explore classic matches →</Link></div>}
    {library.events.length > 0 && <details className="hl-details"><summary>Browse dates with verified entries</summary><ul className="hl-chips">{[...new Set(library.events.map(e => e.date.slice(5)))].sort().map(day => { const target = `${date.slice(0, 4)}-${day}`; return validDate(target) ? <li key={day}><Link href={`?date=${target}`}>{new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${target}T12:00:00Z`))}</Link></li> : null; })}</ul></details>}
  </main>;
}
