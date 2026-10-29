import Link from 'next/link';
import { formatLongDate } from '@/lib/format';
import { availableEntities, entityHref, type HistoryEvent, type HistoryLibrary } from '@/lib/content/history-library';
export function EventList({ events, library }: { events: HistoryEvent[]; library: HistoryLibrary }) {
  const entities = availableEntities(library);
  return <ol className="hl-event-list">{events.map(event => <li key={event.id}><time className="hl-eyebrow" dateTime={event.date}>{formatLongDate(event.date)}</time><h2><Link href={event.href}>{event.title}</Link></h2>{event.description && <p>{event.description}</p>}<Link className="hl-text-link" href={event.href}>Read the story →</Link><ul className="hl-chips">{event.season && library.seasons.some(s => s.record.season === event.season) && <li><Link href={`/history/seasons/${event.season}`}>{event.season.replace('-', '–')}</Link></li>}{[...event.personIds, ...event.competitionIds].slice(0, 5).map(id => { const entity = entities.find(e => e.id === id); return entity ? <li key={id}><Link href={entityHref(entity)}>{entity.label}</Link></li> : null; })}</ul><details className="hl-details"><summary>Event verification</summary><p>Checked {formatLongDate(event.reviewedOn)}. {event.scope}</p><ul>{event.sourceUrls.map(url => <li key={url}><a href={url}>{new URL(url).hostname} ↗</a></li>)}</ul></details></li>)}</ol>;
}
