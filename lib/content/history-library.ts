import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { getArchiveFeatures } from './archive.ts';
import { getArticles } from './articles.ts';
import { getHistoryEntities, HistoryIdSchema, HistoryIdsSchema, type HistoryEntity } from './entities.ts';
import { getHistory } from './history.ts';
import { SeasonSchema, type HistorySeason } from './season-schema.ts';
import { normaliseSearch, searchDocuments, type SearchDocument } from '../search/search.ts';
import { getRelatedArchiveArticles } from './discovery.ts';
import { getHistoryEvents } from './this-week.ts';
import type { ArchiveFeature, Article } from './types.ts';

export { HISTORY_NAV } from '../history-navigation.ts';
export type HistoryArticle = ArchiveFeature & { href: string };
export type SeriesArticle = (ArchiveFeature | Article) & { href: string };
export type SeasonEntry = { record: HistorySeason; review: boolean };
const SeriesSchema = z.object({
  id: HistoryIdSchema, title: z.string().min(1), introduction: z.string().min(1),
  plannedChapters: z.number().int().positive().max(200), personIds: HistoryIdsSchema,
  chapters: z.array(z.object({ part: z.number().int().positive(), title: z.string().min(1).optional(), status: z.enum(['planned', 'draft', 'review']) }).strict()),
}).strict();
export type HistorySeries = z.infer<typeof SeriesSchema> & { articles: SeriesArticle[] };
const VerificationSchema = z.array(z.object({
  articleSlug: HistoryIdSchema, eventSlug: HistoryIdSchema.optional(), historicalEventDate: z.iso.date(), reviewedOn: z.iso.date(),
  sourceUrls: z.array(z.url().refine(url => url.startsWith('https://'))).min(1), scope: z.string().min(1),
}).strict());
export type HistoryEvent = {
  id: string; date: string; title: string; description?: string; href: string; season?: string;
  personIds: string[]; competitionIds: string[]; sourceUrls: string[]; reviewedOn: string; scope: string;
};
function jsonFiles(directory: string) {
  return fs.existsSync(directory) ? fs.readdirSync(directory).filter(name => name.endsWith('.json')).sort() : [];
}
export function articleEntityIds(article: SeriesArticle) {
  return [...new Set([...(article.playerIds ?? []), ...(article.managerIds ?? []), ...(article.oppositionIds ?? []), ...(article.competitionIds ?? []), ...(article.locationIds ?? []), ...(article.themeIds ?? [])])];
}
export function seasonPersonIds(record: HistorySeason) {
  return [...new Set([...record.managerIds, ...record.keyPlayerIds, ...record.topScorers.map(s => s.personId), ...record.transfers.in.map(t => t.personId), ...record.transfers.out.map(t => t.personId), ...record.events.flatMap(e => e.personIds ?? [])])];
}
export function seasonEntityIds(record: HistorySeason) {
  return [...seasonPersonIds(record), record.league.competitionId, ...record.competitions.map(c => c.competitionId), ...record.events.flatMap(e => e.competitionIds ?? [])];
}
export function validateSeasonEntities(record: HistorySeason, entities: HistoryEntity[]) {
  const byId = new Map(entities.map(e => [e.id, e]));
  for (const id of seasonPersonIds(record)) if (byId.get(id)?.kind !== 'person') throw new Error(`Season ${record.season}: unknown person ${id}`);
  for (const id of [record.league.competitionId, ...record.trophyIds, ...record.competitions.map(c => c.competitionId), ...record.events.flatMap(e => e.competitionIds ?? [])]) {
    if (byId.get(id)?.kind !== 'competition') throw new Error(`Season ${record.season}: unknown competition ${id}`);
  }
}

/** Published content directories are the boundary. Never scan drafts, Git history or prototype reports. */
export function getHistoryLibrary(root = process.cwd(), reviewSeason?: HistorySeason) {
  const entities = getHistoryEntities(root);
  const archive = getArchiveFeatures(root);
  const articles: HistoryArticle[] = archive.filter(a => a.editorialMode === 'factual').map(a => ({ ...a, href: `/archive/${a.slug}` }));
  const seasonDir = path.join(root, 'content/history/liverpool/seasons');
  const seasons: SeasonEntry[] = jsonFiles(seasonDir).map(filename => {
    const record = SeasonSchema.parse(JSON.parse(fs.readFileSync(path.join(seasonDir, filename), 'utf8')));
    if (filename !== `${record.season}.json`) throw new Error(`Season filename mismatch: ${filename}`);
    validateSeasonEntities(record, entities);
    return { record, review: false };
  });
  // Only the request-scoped local guard may supply a review record. Search, events and sitemap never do.
  if (reviewSeason) {
    validateSeasonEntities(reviewSeason, entities);
    const index = seasons.findIndex(s => s.record.season === reviewSeason.season);
    const entry = { record: reviewSeason, review: true };
    if (index < 0) seasons.push(entry);
    else seasons[index] = entry;
  }
  seasons.sort((a,b) => a.record.season.localeCompare(b.record.season));
  const seriesDir = path.join(root, 'content/history/liverpool/series');
  const publicWriting: SeriesArticle[] = [...archive.map(a => ({ ...a, href: `/archive/${a.slug}` })), ...getArticles(root).map(a => ({ ...a, href: `/articles/${a.slug}` }))];
  const series: HistorySeries[] = jsonFiles(seriesDir).map(filename => {
    const definition = SeriesSchema.parse(JSON.parse(fs.readFileSync(path.join(seriesDir, filename), 'utf8')));
    if (filename !== `${definition.id}.json`) throw new Error(`Series filename mismatch: ${filename}`);
    for (const id of definition.personIds) if (!entities.some(e => e.id === id && e.kind === 'person')) throw new Error(`Unknown series person ${id}`);
    const planned = definition.chapters.map(c => c.part);
    if (new Set(planned).size !== planned.length || planned.some(p => p > definition.plannedChapters)) throw new Error(`Invalid chapter plan: ${definition.id}`);
    const chapters = publicWriting.filter(a => a.series === definition.id).sort((a,b) => a.part! - b.part!);
    const parts = chapters.map(a => a.part);
    if (new Set(parts).size !== parts.length || parts.some(p => !Number.isInteger(p) || p! < 1 || p! > definition.plannedChapters)) throw new Error(`Invalid published chapter order: ${definition.id}`);
    return { ...definition, articles: chapters };
  });
  for (const article of publicWriting) {
    if ((article.series || article.part !== undefined) && (!series.some(s => s.id === article.series) || !Number.isInteger(article.part) || article.part! < 1)) throw new Error(`Invalid series metadata: ${article.href}`);
  }
  const verificationPath = path.join(root, 'content/history/liverpool/event-verifications.json');
  const verifications = VerificationSchema.parse(fs.existsSync(verificationPath) ? JSON.parse(fs.readFileSync(verificationPath, 'utf8')) : []);
  if (new Set(verifications.map(v => v.eventSlug ? `event-${v.eventSlug}` : `article-${v.articleSlug}`)).size !== verifications.length) throw new Error('Duplicate event verification');
  const legacyEvents = verifications.some(v => v.eventSlug) ? getHistoryEvents(root, { allowUnavailableArchive: true }) : [];
  const events: HistoryEvent[] = verifications.flatMap(v => {
    const article = articles.find(a => a.slug === v.articleSlug);
    // Withdrawing an article removes its discovery entry without restoring it.
    if (!article) return [];
    const event = v.eventSlug ? legacyEvents.find(e => e.slug === v.eventSlug) : undefined;
    if (v.eventSlug && (!event || event.archiveSlug !== article.slug)) throw new Error(`Missing or mismatched annual event: ${v.eventSlug}`);
    if (!event && !['match', 'club-event', 'transfer'].includes(article.articleType ?? '')) throw new Error(`Not an exact event: ${article.slug}`);
    const historicalDate = event ? `${String(event.year).padStart(4, '0')}-${String(event.month).padStart(2, '0')}-${String(event.day).padStart(2, '0')}` : article.historicalEventDate;
    if (historicalDate !== v.historicalEventDate || (article.historicalEventDate && article.historicalEventDate !== historicalDate)) throw new Error(`Event date drift: ${article.slug}`);
    const recordedSources = [...(article.sources ?? []), ...(event ? [event.source] : [])];
    if (v.sourceUrls.some(url => !recordedSources.includes(url))) throw new Error(`Unrecorded event source: ${article.slug}`);
    return [{ id: event ? `event-${event.slug}` : `article-${article.slug}`, date: v.historicalEventDate,
      title: event?.title ?? article.title, description: event?.summary ?? article.excerpt, href: article.href, season: article.season,
      personIds: [...new Set([...(article.playerIds ?? []), ...(article.managerIds ?? [])])], competitionIds: article.competitionIds ?? [], sourceUrls: v.sourceUrls, reviewedOn: v.reviewedOn, scope: v.scope }];
  });
  // Season events already have sourced factual descriptions. Only reviewed high-confidence dated records qualify.
  for (const { record, review } of seasons) if (!review) for (const event of record.events) {
    if (!event.date || event.sourceIds.some(id => record.sources.find(s => s.id === id)?.confidence !== 'high')) continue;
    if (events.some(e => e.date === event.date && e.season === record.season)) continue;
    events.push({ id: `${record.season}-${event.id}`, date: event.date, title: event.title, description: event.detail,
      href: `/history/seasons/${record.season}#event-${event.id}`, season: record.season, personIds: event.personIds ?? [], competitionIds: event.competitionIds ?? [],
      sourceUrls: event.sourceIds.map(id => record.sources.find(s => s.id === id)!.url), reviewedOn: record.reviewedOn, scope: 'Dated season event with high-confidence source records.' });
  }
  return { articles, entities, seasons, series, events: events.sort((a,b) => a.date.localeCompare(b.date)), eras: getHistory(root).eras };
}
export type HistoryLibrary = ReturnType<typeof getHistoryLibrary>;
export function availableEntities(library: HistoryLibrary) {
  const ids = new Set([...library.articles.flatMap(articleEntityIds), ...library.seasons.flatMap(s => seasonEntityIds(s.record)), ...library.series.flatMap(s => [...s.personIds, ...s.articles.flatMap(articleEntityIds)])]);
  return library.entities.filter(e => ids.has(e.id)).sort((a,b) => a.label.localeCompare(b.label, 'en-GB'));
}
export function entityHref(entity: HistoryEntity) {
  return entity.kind === 'person' ? `/history/people/${entity.id}` : `/history/explore/${entity.id}`;
}
export function relatedReading(article: HistoryArticle, library: HistoryLibrary) {
  return getRelatedArchiveArticles(article, library.articles, library.eras, library.entities, 3);
}
export function seriesNeighbours(series: HistorySeries, href: string) {
  const index = series.articles.findIndex(a => a.href === href);
  return index < 0 ? {} : { previous: series.articles[index - 1], next: series.articles[index + 1] };
}
export function londonDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
export function validDate(value: string) { return z.iso.date().safeParse(value).success; }
export function shiftDate(date: string, days: number) {
  if (!validDate(date)) throw new Error('Invalid calendar date');
  const value = new Date(`${date}T12:00:00Z`); value.setUTCDate(value.getUTCDate() + days); return value.toISOString().slice(0, 10);
}
export function eventsOnDate(events: HistoryEvent[], date: string) {
  if (!validDate(date)) return [];
  return events.filter(e => e.date.slice(5) === date.slice(5) && e.date <= date);
}
export function newsletterDiscovery(library: HistoryLibrary, end: string) {
  if (!validDate(end)) throw new Error('Invalid newsletter date');
  const start = shiftDate(end, -6);
  const anniversaries = Array.from({ length: 7 }, (_, i) => shiftDate(start, i)).flatMap(date => eventsOnDate(library.events, date).map(event => ({ event, anniversary: date })));
  return { start, end, anniversaries,
    biographies: library.articles.filter(a => ['player', 'manager'].includes(a.articleType ?? '')),
    chapters: library.series.flatMap(s => s.articles).filter(a => a.date >= start && a.date <= end),
    matches: library.articles.filter(a => a.articleType === 'match'), seasons: library.seasons.filter(s => !s.review) };
}
export function historySearchDocuments(library: HistoryLibrary): SearchDocument[] {
  const labels = new Map(library.entities.map(e => [e.id, e.label]));
  const doc = (href: string, title: string, type: string, context: string, excerpt: string, body: string): SearchDocument => ({ href, title, type, context, excerpt, titleText: normaliseSearch(title), metadataText: normaliseSearch(context), bodyText: normaliseSearch(body) });
  const articles: SeriesArticle[] = [...library.articles, ...library.series.flatMap(s => s.articles)];
  return [
    ...articles.map(a => doc(a.href, a.title, 'Article', [a.season ?? '', ...articleEntityIds(a).map(id => labels.get(id)), a.series ?? ''].join(' · '), a.excerpt ?? '', a.body)),
    ...library.seasons.filter(s => !s.review).map(({ record: s }) => doc(`/history/seasons/${s.season}`, s.season.replace('-', '–'), 'Season', seasonEntityIds(s).map(id => labels.get(id)).join(' '), s.overview[0], s.overview.join(' '))),
    ...library.series.filter(s => s.articles.length).map(s => doc(`/history/series/${s.id}`, s.title, 'Series', s.personIds.map(id => labels.get(id)).join(' '), s.introduction, '')),
  ];
}
export function searchHistory(library: HistoryLibrary, query: string) { return searchDocuments(historySearchDocuments(library), query); }
