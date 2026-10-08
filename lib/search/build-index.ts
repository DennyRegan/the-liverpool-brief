import 'server-only';
import { getArticles } from '../content/articles.ts';
import { getArchiveFeatures } from '../content/archive.ts';
import { getHistory, eraYears } from '../content/history.ts';
import { getSeasons, seasonLabel } from '../content/seasons.ts';
import { getHistoryEntities } from '../content/entities.ts';
import { deriveExplorations } from '../content/exploration.ts';
import { getPublishedExperiences } from '../content/interactive-history.ts';
import { normaliseSearch, type SearchDocument } from './search.ts';

// Only public loaders enter this projection. Editorial/source folders are never scanned.
export function buildSearchIndex(root = process.cwd()): SearchDocument[] {
  const articles = getArticles(root), archive = getArchiveFeatures(root), seasons = getSeasons(root);
  const entities = getHistoryEntities(root), labels = new Map(entities.map(e => [e.id, e.label]));
  const eras = getHistory(root).eras;
  const documents: SearchDocument[] = [];
  const plain = (text: string) => text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/https?:\/\/\S+/g, '').replace(/<[^>]*>/g, '').replace(/[#*_`>|]/g, '').replace(/\s+/g, ' ').trim();
  const names = (ids: string[]) => [...new Set(ids)].map(id => labels.get(id)).filter(Boolean).join(' ');
  const seasonTerms = (season?: string) => season ? `${seasonLabel(season)} ${season.slice(0, 4)} ${Number(season.slice(0, 4)) + 1}` : '';
  const relationshipTerms = (item: { season?: string; playerIds?: string[]; managerIds?: string[]; oppositionIds?: string[]; competitionIds?: string[]; locationIds?: string[]; themeIds?: string[]; historyEras?: string[]; historicalEventDate?: string }) => [
    seasonTerms(item.season), item.historicalEventDate,
    names([...(item.playerIds ?? []), ...(item.managerIds ?? []), ...(item.oppositionIds ?? []), ...(item.competitionIds ?? []), ...(item.locationIds ?? []), ...(item.themeIds ?? [])]),
    ...(item.historyEras ?? []).map(id => eras.find(e => e.id === id)?.manager ?? ''),
  ].filter(Boolean).join(' ');
  const add = (href: string, title: string, type: string, context: string, excerpt: string, metadata: string, body: string) => {
    documents.push({ href, title, type, context, excerpt: plain(excerpt).slice(0, 240), titleText: normaliseSearch(title), metadataText: normaliseSearch(metadata), bodyText: normaliseSearch(plain(body)) });
  };
  for (const article of articles) add(`/articles/${article.slug}`, article.title, article.category, article.date, article.excerpt ?? article.body, relationshipTerms(article), article.body);
  for (const article of archive) {
    const type = article.editorialMode !== 'factual' ? 'Opinion' : ({ match: 'Historical match', player: 'Player biography', manager: 'Manager biography', 'club-event': 'Club history', season: 'Season article' } as Record<string, string>)[article.articleType ?? ''] ?? 'History article';
    add(`/archive/${article.slug}`, article.title, type, article.historicalPeriod, article.excerpt, relationshipTerms(article), article.body);
  }
  for (const season of seasons) {
    const ids = [...season.managerIds, ...season.keyPlayerIds, ...season.trophyIds, season.league.competitionId, ...season.topScorers.map(p => p.personId), ...season.competitions.map(c => c.competitionId), ...season.transfers.in.map(p => p.personId), ...season.transfers.out.map(p => p.personId), ...season.events.flatMap(e => [...(e.personIds ?? []), ...(e.competitionIds ?? [])])];
    const body = [...season.overview, season.managerNote ?? '', ...season.events.flatMap(e => [e.title, e.detail]), ...season.competitions.map(c => c.result), ...season.transfers.in.flatMap(t => [t.club, t.note ?? '']), ...season.transfers.out.flatMap(t => [t.club, t.note ?? ''])].join(' ');
    add(`/history/seasons/${season.season}`, `Liverpool ${seasonLabel(season.season)}`, 'Season', seasonLabel(season.season), season.overview[0], `${seasonTerms(season.season)} ${names(ids)}`, body);
  }
  for (const era of eras) add(`/history/${era.id}`, `${era.manager} · ${eraYears(era)}`, 'Managerial era', eraYears(era), era.summary, `${era.manager} ${era.keyPlayers.join(' ')} ${era.startDate} ${era.endDate ?? ''}`, [era.summary, era.context, ...era.honours.flatMap(h => [h.name, ...h.years]), ...(era.otherHonours ?? []).flatMap(h => [h.name, ...h.years])].join(' '));
  for (const destination of deriveExplorations(archive, entities)) {
    const type = ({ person: 'Person', opposition: 'Opposition', competition: 'Competition' } as Record<string, string>)[destination.entity.kind];
    add(destination.href, destination.entity.label, type, `${destination.articles.length} historical articles`, `Explore ${destination.entity.label} through published Liverpool history.`, destination.entity.label, destination.articles.map(a => `${a.title} ${a.excerpt} ${seasonTerms(a.season)}`).join(' '));
  }
  for (const experience of getPublishedExperiences(root)) add(`/history/interactive/${experience.id}`, experience.title, 'Interactive history', experience.dateRange.start, experience.standfirst, `${names([...(experience.relationships.playerIds ?? []), ...(experience.relationships.managerIds ?? []), ...(experience.relationships.oppositionIds ?? []), ...(experience.relationships.competitionIds ?? [])])} ${experience.relationships.seasonIds.map(seasonTerms).join(' ')}`, experience.standfirst);
  return [...new Map(documents.map(d => [d.href, d])).values()].sort((a, b) => a.href.localeCompare(b.href));
}
