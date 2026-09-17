import { getArticles } from './articles.ts';
import { getHistory, getArticleEraIds } from './history.ts';
import { getExplorations } from './exploration.ts';
import { getSeasons } from './seasons.ts';
import { getFactualHistoryArticles } from './archive.ts';
import { getHistoryEntities } from './entities.ts';
import { getRelatedArchiveArticles } from './discovery.ts';
import type { Article } from './types.ts';

export type AnalysisContext = { season: string } | { entityId: string } | { eraId: string } | { matchSlug: string };
/** Query the canonical Articles collection. Analysis never affects V2 eligibility. */
export function getContextAnalysis(context: AnalysisContext, root = process.cwd()) {
  const eras = getHistory(root).eras;
  return getArticles(root).filter(a => a.category === 'Analysis').filter(a => {
    if ('season' in context) return a.season === context.season;
    if ('eraId' in context) return getArticleEraIds(a, eras).includes(context.eraId);
    if ('matchSlug' in context) return a.relatedMatches?.includes(context.matchSlug);
    return [a.playerIds, a.managerIds, a.oppositionIds, a.competitionIds, a.locationIds, a.themeIds].some(ids => ids?.includes(context.entityId));
  });
}

export function analysisConnections(article: Article, root = process.cwd()) {
  if (article.category !== 'Analysis') return [];
  const ids = new Set([...(article.playerIds ?? []), ...(article.managerIds ?? []), ...(article.oppositionIds ?? []), ...(article.competitionIds ?? [])]);
  const entities = getExplorations(root).filter(d => ids.has(d.entity.id)).map(d => ({ href: d.href, label: d.entity.label }));
  const eras = getHistory(root).eras;
  const eraIds = getArticleEraIds(article, eras);
  const eraLinks = eras.filter(e => eraIds.includes(e.id)).map(e => ({ href: `/history/${e.id}`, label: `${e.manager} era` }));
  const season = getSeasons(root).find(s => s.season === article.season);
  const reports = getFactualHistoryArticles(root);
  const explicit = reports.filter(a => article.relatedMatches?.includes(a.slug));
  // Existing recommendation rules also support substantial theme and people connections
  // without inventing additional entity destinations or counting broad tags alone.
  const related = getRelatedArchiveArticles(article, reports, eras, getHistoryEntities(root)).map(r => r.article);
  const reading = [...new Map([...explicit, ...related].map(a => [a.slug, a])).values()].map(a => ({ href: `/archive/${a.slug}`, label: a.title }));
  return [...(season ? [{ href: `/history/seasons/${season.season}`, label: `Explore ${season.season.replace('-', '–')}` }] : []), ...entities, ...eraLinks, ...reading];
}
