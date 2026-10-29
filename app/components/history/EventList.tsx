import Link from 'next/link';
import { type HistoryEvent, type HistoryLibrary } from '@/lib/content/history-library';
import { calendarLabel, eventLinks } from '@/lib/content/on-this-day';

export function EventList({ events, library }: { events: HistoryEvent[]; library: HistoryLibrary }) {
  return <ol className="hl-event-list">{events.map(event => <li key={event.id} id={`event-${event.id}`}>
    <time className="hl-eyebrow" dateTime={event.date}>{calendarLabel(event.date)}</time>
    <h2><Link href={event.href}>{event.title}</Link></h2>
    {event.description && <p>{event.description}</p>}
    <Link className="hl-text-link" href={event.href}>Read the story →</Link>
    <ul className="hl-chips">{eventLinks(event, library).map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul>
    <details className="hl-details"><summary>Event verification</summary>
      <p>Checked {calendarLabel(event.reviewedOn)}. {event.scope}</p>
      <ul>{event.sourceUrls.map((url, i) => <li key={url}><a href={url}>Source {i + 1}: {new URL(url).hostname.replace(/^www\./, '')} ↗</a></li>)}</ul>
    </details>
  </li>)}</ol>;
}
