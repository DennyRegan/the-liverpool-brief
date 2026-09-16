import { getFactualHistoryArticles } from './archive.ts';
import { getHistoryEntities, type HistoryEntity } from './entities.ts';
import { getHistory, type HistoryEra } from './history.ts';
import { getSeasons, type HistorySeason } from './seasons.ts';
import type { ArchiveFeature } from './types.ts';

export type ExplorationKind = 'person' | 'opposition' | 'competition';
export const explorationThresholds = { person: 3, opposition: 5, competition: 5 } as const;
const segments = { person: 'people', opposition: 'opposition', competition: 'competitions' } as const;
export const explorationHref = (entity: Pick<HistoryEntity, 'kind' | 'id'>) =>
  entity.kind in segments ? `/history/${segments[entity.kind as ExplorationKind]}/${entity.id}` : undefined;
export type Exploration = { entity: HistoryEntity; href: string; articles: ArchiveFeature[] };

export function historicalOrder(a: ArchiveFeature, b: ArchiveFeature) {
  // A season is a grouping key, never an invented exact event date.
  const key = (article: ArchiveFeature) => article.historicalEventDate ?? article.season?.slice(0, 4) ?? article.date;
  return key(a).localeCompare(key(b)) || a.slug.localeCompare(b.slug);
}

/** Only the existing public factual loader supplies production input. No draft directory is read. */
export function deriveExplorations(articles: ArchiveFeature[], entities: HistoryEntity[]): Exploration[] {
  const canonical = [...new Map(articles.filter(a => a.editorialMode === 'factual').map(a => [a.slug, a])).values()];
  return entities.flatMap(entity => {
    if (!(entity.kind in explorationThresholds)) return [];
    const kind = entity.kind as ExplorationKind;
    const related = canonical.filter(article => kind === 'person'
      ? article.playerIds?.includes(entity.id) || article.managerIds?.includes(entity.id)
      : kind === 'opposition' ? article.oppositionIds?.includes(entity.id) : article.competitionIds?.includes(entity.id));
    return related.length >= explorationThresholds[kind]
      ? [{ entity, href: explorationHref(entity)!, articles: related.sort(historicalOrder) }] : [];
  }).sort((a, b) => a.entity.label.localeCompare(b.entity.label, 'en-GB') || a.entity.id.localeCompare(b.entity.id));
}

export function getExplorations(root = process.cwd()) {
  return deriveExplorations(getFactualHistoryArticles(root), getHistoryEntities(root));
}

export function groupExplorationArticles(articles: ArchiveFeature[]) {
  const keys = [...new Set(articles.map(a => a.season).filter((id): id is string => !!id))].sort();
  return [
    ...keys.map(season => ({ id: season, label: season.replace('-', '–'), season, articles: articles.filter(a => a.season === season).sort(historicalOrder) })),
    ...(articles.some(a => !a.season) ? [{ id: 'wider-history', label: 'Career and wider history', season: undefined, articles: articles.filter(a => !a.season).sort(historicalOrder) }] : []),
  ];
}

/** Dual-role articles get their own section, so no arbitrary role wins and each appears once. */
export function personSections(exploration: Exploration) {
  const id = exploration.entity.id;
  return [
    { id: 'player', label: 'As a player', articles: exploration.articles.filter(a => a.playerIds?.includes(id) && !a.managerIds?.includes(id)) },
    { id: 'manager', label: 'As manager', articles: exploration.articles.filter(a => a.managerIds?.includes(id) && !a.playerIds?.includes(id)) },
    { id: 'both', label: 'As player and manager', articles: exploration.articles.filter(a => a.playerIds?.includes(id) && a.managerIds?.includes(id)) },
  ].filter(section => section.articles.length);
}

export function explorationSeasons(exploration: Exploration, seasons: HistorySeason[]) {
  const { entity, articles } = exploration;
  const articleSeasons = new Set(articles.map(a => a.season));
  return seasons.filter(s => articleSeasons.has(s.season) || entity.kind === 'person' && [
    ...s.managerIds, ...s.keyPlayerIds, ...s.topScorers.map(p => p.personId),
    ...s.transfers.in.map(p => p.personId), ...s.transfers.out.map(p => p.personId), ...s.events.flatMap(e => e.personIds ?? []),
  ].includes(entity.id));
}

/** Era records currently store manager labels, not person IDs. Exact names only; no tenure inference. */
export function personEras(entity: HistoryEntity, eras: HistoryEra[]) {
  const normalise = (s: string) => s.normalize('NFKC').trim().toLocaleLowerCase('en-GB');
  return entity.kind === 'person' ? eras.filter(e => e.manager.split(' & ').some(name => normalise(name) === normalise(entity.label))) : [];
}

export function articleExplorationLinks(article: ArchiveFeature, destinations: Exploration[]) {
  if (article.editorialMode !== 'factual') return [];
  const ids = [...new Set([article.playerIds?.[0], article.managerIds?.[0], ...(article.playerIds ?? []).slice(1), ...(article.managerIds ?? []).slice(1)].filter((id): id is string => !!id))];
  const candidates = [
    ...ids.slice(0, 2), ...(article.oppositionIds ?? []).slice(0, 1),
    ...(article.competitionIds ?? []).slice(0, 1), ...ids.slice(2),
    ...(article.oppositionIds ?? []).slice(1), ...(article.competitionIds ?? []).slice(1),
  ];
  return [...new Set(candidates)].flatMap(id => {
    const target = destinations.find(d => d.entity.id === id);
    return target ? [{ label: target.entity.label, href: target.href }] : [];
  }).slice(0, 5);
}

export function getExplorationContext() {
  return { destinations: getExplorations(), seasons: getSeasons(), eras: getHistory().eras };
}
