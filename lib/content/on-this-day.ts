import { eventsOnDate, londonDate, shiftDate, validDate, availableEntities, entityHref, type HistoryEvent, type HistoryLibrary } from './history-library.ts';
import { SITE_URL } from '../site.ts';

export const FIRST_CALENDAR_DATE = '0001-01-01';
export const LAST_CALENDAR_DATE = '9999-12-31';
export function calendarDate(input: unknown, now = new Date()) {
  const valid = typeof input === 'string' && validDate(input) && input >= FIRST_CALENDAR_DATE && input <= LAST_CALENDAR_DATE;
  return { date: valid ? input : londonDate(now), invalid: input !== undefined && !valid };
}
export function adjacentDate(date: string, days: number) {
  const shifted = shiftDate(date, days);
  return validDate(shifted) && shifted >= FIRST_CALENDAR_DATE && shifted <= LAST_CALENDAR_DATE ? shifted : undefined;
}
// Calendar labels must not shift historical dates through London's old UTC offsets.
export function calendarLabel(date: string, year = true) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'long', ...(year ? { year: 'numeric' } : {}) }).format(new Date(`${date}T12:00:00Z`));
}
export function orderedEvents(events: HistoryEvent[], date: string) {
  return eventsOnDate(events, date).toSorted((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
}
export function eventWeek(events: HistoryEvent[], end: string) {
  return Array.from({ length: 7 }, (_, i) => adjacentDate(end, i - 6)).filter((date): date is string => Boolean(date))
    .flatMap(anniversary => orderedEvents(events, anniversary).map(event => ({ anniversary, event })));
}
/** Jump only to a real occurrence, never February 28 as a substitute for February 29. */
export function nextEventDates(events: HistoryEvent[], after: string, limit = 3) {
  const occurrences = events.flatMap(event => {
    const firstYear = Math.max(Number(after.slice(0, 4)), Number(event.date.slice(0, 4)));
    // Eight years covers the leap-year gap across a non-leap century.
    for (let year = firstYear; year <= Math.min(firstYear + 8, 9999); year++) {
      const date = `${String(year).padStart(4, '0')}-${event.date.slice(5)}`;
      if (validDate(date) && date > after && date >= event.date) return [{ date, event }];
    }
    return [];
  }).sort((a, b) => a.date.localeCompare(b.date) || a.event.id.localeCompare(b.event.id));
  const dates = new Set<string>();
  return occurrences.filter(item => {
    if (dates.has(item.date)) return false;
    dates.add(item.date); return true;
  }).slice(0, limit);
}
export function eventLinks(event: HistoryEvent, library: HistoryLibrary) {
  const publicLibrary = { ...library, seasons: library.seasons.filter(s => !s.review) };
  const entities = availableEntities(publicLibrary);
  const seasonExists = event.season && (publicLibrary.seasons.some(s => s.record.season === event.season)
    || library.articles.some(a => a.articleType === 'match' && a.season === event.season));
  return [
    ...(seasonExists ? [{ href: `/history/seasons/${event.season}`, label: event.season!.replace('-', '–') }] : []),
    ...[...new Set([...event.personIds, ...event.competitionIds])].slice(0, 5).flatMap(id => {
      const entity = entities.find(e => e.id === id);
      return entity ? [{ href: entityHref(entity), label: entity.label }] : [];
    }),
  ];
}
export function briefCopy(event: HistoryEvent, anniversary: string) {
  return [`On This Day — ${calendarLabel(anniversary)}`, event.title, `Historical date: ${calendarLabel(event.date)}`,
    event.description, new URL(event.href, SITE_URL).href, '', 'Sources:', ...event.sourceUrls,
    `Checked ${calendarLabel(event.reviewedOn)}. ${event.scope}`].filter(line => line !== undefined).join('\n');
}
