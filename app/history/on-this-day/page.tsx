import type { Metadata } from 'next';
import Link from 'next/link';
import { getHistoryLibrary } from '@/lib/content/history-library';
import { adjacentDate, calendarDate, calendarLabel, eventWeek, FIRST_CALENDAR_DATE, LAST_CALENDAR_DATE, nextEventDates, orderedEvents } from '@/lib/content/on-this-day';
import { EventList } from '@/app/components/history/EventList';
import { verifiedHistoryWeek, weekForDate, requestedWeek } from '@/lib/content/weekly-history';
import { WeekRollover } from '@/app/components/history/WeekRollover';
import './on-this-day.css';

export const metadata: Metadata = { title: 'This Week in Liverpool History | The Liverpool Brief', alternates: { canonical: '/history/on-this-day' } };
// Recompute the London calendar day on every request, including after midnight.
export const dynamic = 'force-dynamic';
export default async function OnThisDayPage({ searchParams }: { searchParams: Promise<{ date?: string | string[]; week?: string | string[] }> }) {
  const query = await searchParams;
  const { date, invalid } = calendarDate(query.date);
  const library = getHistoryLibrary();
  if (query.date === undefined) {
    const requested = requestedWeek(query.week);
    const days = query.week === undefined ? verifiedHistoryWeek(library) : weekForDate(library, requested.date);
    const start = days[0].iso; const end = days.at(-1)!.iso;
    const previous = adjacentDate(start, -7); const next = adjacentDate(start, 7);
    const populated = days.filter(day => day.entries.length);
    return <main id="main-content" className="hl-main otd-page">
      {query.week === undefined && <WeekRollover monday={start} />}
      <header className="hl-heading"><p className="hl-eyebrow">On This Day · This Week in History</p><h1>This week in Liverpool history.</h1><p className="hl-deck">Researched stories, written in advance and revisited on their anniversaries.</p></header>
      <form className="hl-filters" action="/history/on-this-day"><label>Choose a week (any date)<input key={requested.date} type="date" name="week" defaultValue={requested.date} min={FIRST_CALENDAR_DATE} max="9999-12-26" required /></label><button>Show week</button><Link href="/history/on-this-day">Current week</Link><Link href={`?date=${calendarDate(undefined).date}`}>On this day</Link></form>
      {requested.invalid && <p role="status">That week date is invalid. Showing the current week instead.</p>}
      <nav className="hl-adjacent" aria-label="History weeks">{previous ? <Link href={`?week=${previous}`}>← Previous week</Link> : <span />}<h2><time dateTime={start}>{calendarLabel(start, false)}</time> – <time dateTime={end}>{calendarLabel(end)}</time></h2>{next && next <= '9999-12-26' ? <Link href={`?week=${next}`}>Next week →</Link> : <span />}</nav>
      <p className="hl-muted">Monday to Sunday, UK time. All approved stories for the week are available from Monday.</p>
      {populated.length ? populated.map(day => <section className="hl-section" key={day.iso}><h2>{day.weekday}, {day.label}</h2><EventList events={day.entries} library={library} /></section>) : <div className="hl-empty"><h2>No approved stories for this week yet.</h2><p>We leave gaps when there is no verified, approved entry. Explore the existing History collection while more writing is prepared.</p><Link className="hl-text-link" href="/history/matches">Explore classic matches →</Link></div>}
      <details className="hl-details"><summary>How this collection works</summary><p>Stories are researched and written ahead of time. This page selects stored, approved writing for the UK calendar week and changes each Monday. Nothing is generated when you visit.</p><p>Historical dates recur annually; February 29 stays on February 29. Drafts and withdrawn articles are excluded. Open a story for the complete writing, or its verification notes for the sources and scope of the date check.</p></details>
    </main>;
  }
  const events = orderedEvents(library.events, date);
  const recent = eventWeek(library.events, date).filter(item => item.anniversary !== date).reverse();
  const upcoming = nextEventDates(library.events, date);
  const previous = adjacentDate(date, -1);
  const next = adjacentDate(date, 1);
  return <main id="main-content" className="hl-main otd-page">
    <header className="hl-heading"><p className="hl-eyebrow">On This Day</p><h1>A date with history.</h1><p className="hl-deck">Liverpool anniversaries, with the stories and sources behind them.</p></header>
    <form className="hl-filters" action="/history/on-this-day">
      <label>Choose a calendar date<input key={date} type="date" name="date" defaultValue={date} min={FIRST_CALENDAR_DATE} max={LAST_CALENDAR_DATE} required /></label>
      <button>Show events</button><Link href={`?date=${calendarDate(undefined).date}`}>Today</Link><Link href="/history/on-this-day">This week</Link>
    </form>
    {invalid && <p role="status" className="hl-empty">That date is invalid. Showing today instead.</p>}
    <nav className="hl-adjacent" aria-label="Calendar dates">
      {previous ? <Link href={`?date=${previous}`}>← Previous day</Link> : <span />}
      <h2><time dateTime={date}>{calendarLabel(date)}</time></h2>
      {next ? <Link href={`?date=${next}`}>Next day →</Link> : <span />}
    </nav>
    <p className="hl-muted">Today follows the UK calendar. Dates below are the dates events happened.</p>
    {events.length ? <EventList events={events} library={library} /> : <div className="hl-empty">
      <h2>No verified entry for this date yet.</h2><p>Our calendar is still growing. We only include sourced events from approved History records.</p>
      <Link className="hl-text-link" href="/history/matches">Explore classic matches →</Link>
    </div>}
    {recent.length > 0 && <section className="hl-section"><h2>Earlier in this seven-day window</h2><ul className="otd-dates">{recent.map(({ event, anniversary }) => <li key={event.id}><Link href={`?date=${anniversary}`}>{event.title}</Link><time dateTime={anniversary}>{calendarLabel(anniversary, false)}</time></li>)}</ul></section>}
    {upcoming.length > 0 && <section className="hl-section"><h2>Next dates in the collection</h2><p className="hl-muted">A small, growing selection — these are upcoming anniversaries, not events for the selected day.</p><ul className="otd-dates">{upcoming.map(({ date: occurrence, event }) => <li key={occurrence}><Link href={`?date=${occurrence}`}>{event.title}</Link><time dateTime={occurrence}>{calendarLabel(occurrence)}</time></li>)}</ul></section>}
    <details className="hl-details"><summary>How this calendar is curated</summary><p>Entries come from approved factual articles with a checked historical date, or approved season records with dated, high-confidence sources. Open “Event verification” to see the sources and what was checked. The collection is selective; an empty day does not mean nothing happened.</p><p>February 29 anniversaries appear on February 29 only. No articles are written or published automatically.</p></details>
  </main>;
}
