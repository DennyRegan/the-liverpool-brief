import { getHistoryWindow } from './this-week.ts';
import { eventsOnDate, shiftDate, type HistoryLibrary } from './history-library.ts';
import { calendarDate, LAST_CALENDAR_DATE, FIRST_CALENDAR_DATE } from './on-this-day.ts';

/** Reuses the former This Week calendar; only the current verified public projection is supplied. */
export function verifiedHistoryWeek(library: HistoryLibrary, now = new Date()) {
  return getHistoryWindow([], now).filter(day => day.iso >= FIRST_CALENDAR_DATE && day.iso <= LAST_CALENDAR_DATE)
    .map(day => ({ ...day, entries: eventsOnDate(library.events, day.iso) }));
}
export function weekForDate(library: HistoryLibrary, date: string) {
  return verifiedHistoryWeek(library, new Date(`${date}T12:00:00Z`));
}
export function previousWeekEnd(now = new Date()) {
  return shiftDate(getHistoryWindow([], now)[0].iso, -1);
}
export function preparationWeeks(now = new Date()) {
  const monday = getHistoryWindow([], now)[0].iso;
  return Array.from({ length: 4 }, (_, index) => ({ start: shiftDate(monday, index * 7), end: shiftDate(monday, index * 7 + 6) }));
}
export function requestedWeek(input: unknown, now = new Date()) {
  const parsed = calendarDate(input, now);
  // The final complete supported week ends on 26 December 9999.
  return parsed.date > '9999-12-26' ? { date: calendarDate(undefined, now).date, invalid: true } : parsed;
}
