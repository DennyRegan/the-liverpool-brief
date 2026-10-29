// Read-only editorial audit. This never writes content, approves entries or sends email.
import { getHistoryLibrary, londonDate } from '../lib/content/history-library.ts';
import { calendarDate, eventWeek, nextEventDates } from '../lib/content/on-this-day.ts';
const end = process.argv[2] ?? londonDate();
if (calendarDate(end).invalid) throw new Error('Use an exact calendar date: node scripts/audit-on-this-day.mjs YYYY-MM-DD');
const library = getHistoryLibrary();
const days = new Set(library.events.map(e => e.date.slice(5)));
const eligibleArticles = library.articles.filter(a => ['match', 'club-event', 'transfer'].includes(a.articleType) && a.historicalEventDate);
console.log(JSON.stringify({
  asOf: end,
  timeZone: 'Europe/London',
  verifiedEvents: library.events.length,
  coveredCalendarDays: days.size,
  possibleCalendarDays: 366,
  emptyCalendarDays: 366 - days.size,
  approvedSeasonRecords: library.seasons.filter(s => !s.review).length,
  approvedArticlesAwaitingEventVerification: eligibleArticles.filter(a => !library.events.some(e => e.href === a.href)).map(a => ({ slug: a.slug, historicalEventDate: a.historicalEventDate })),
  eventsMissingExistingExcerpt: library.events.filter(e => !e.description).map(e => e.id),
  week: eventWeek(library.events, end).map(({ anniversary, event }) => ({ anniversary, id: event.id, title: event.title, href: event.href, sources: event.sourceUrls })),
  upcoming: nextEventDates(library.events, end, 10).map(({ date, event }) => ({ anniversary: date, id: event.id, title: event.title })),
  events: library.events.map(e => ({ id: e.id, historicalEventDate: e.date, reviewedOn: e.reviewedOn, sources: e.sourceUrls, scope: e.scope })),
}, null, 2));
