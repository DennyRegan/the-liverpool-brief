import { getArticleEraIds, seasonKey, type HistoryEra } from "./history.ts";
import type { HistoryEntity } from "./entities.ts";

/** Only relationship metadata is needed; returned articles retain their full canonical content. */
export type ArchiveDiscoveryArticle = {
  slug: string;
  date: string;
  historicalEventDate?: string;
  historyEras?: string[];
  season?: string;
  playerIds?: string[];
  managerIds?: string[];
  oppositionIds?: string[];
  competitionIds?: string[];
  locationIds?: string[];
  themeIds?: string[];
};

export type RelatedArchiveArticle<T extends ArchiveDiscoveryArticle> = {
  article: T;
  score: number;
  reasons: string[];
};

function sharedIds(left: readonly string[] = [], right: readonly string[] = []) {
  const rightIds = new Set(right);
  return [...new Set(left)].filter(id => rightIds.has(id)).sort();
}

function personIds(article: ArchiveDiscoveryArticle) {
  // A player who becomes a manager remains one person, including within one article.
  return [...new Set([...(article.playerIds ?? []), ...(article.managerIds ?? [])])];
}

/**
 * Shared central people: 5 each (at most 2); season: 5; opposition: 3;
 * managerial era: 2; competition: 1; themes: 2 each (at most 2).
 * Era, opposition and competition score once, regardless of the number shared.
 * Location and decade never score: Anfield and broad periods would create filler.
 *
 * A recommendation needs 5 points and a person, season, opposition or theme in
 * common. Era/competition context can strengthen a specific connection but can
 * never qualify by itself. Publication dates only break ties, never add points.
 * This is symmetric, deterministic and depends only on approved metadata.
 * Pass the canonical Archive collection; no article bodies or reverse links are stored.
 */
export function getRelatedArchiveArticles<T extends ArchiveDiscoveryArticle>(
  current: ArchiveDiscoveryArticle,
  articles: readonly T[],
  eras: HistoryEra[],
  entities: readonly HistoryEntity[],
  limit = 3,
): RelatedArchiveArticle<T>[] {
  const resultLimit = Math.max(0, Math.floor(limit));
  if (!resultLimit) return [];

  const labels = new Map(entities.map(entity => [entity.id, entity.label]));
  const currentPeople = personIds(current);
  const currentEras = getArticleEraIds(current, eras);
  const currentSeason = seasonKey(current.season);
  const seen = new Set([current.slug]);
  const recommendations: RelatedArchiveArticle<T>[] = [];

  for (const article of articles) {
    // Canonical slugs define identity; the first original object wins duplicate input.
    if (seen.has(article.slug)) continue;
    seen.add(article.slug);

    const people = sharedIds(currentPeople, personIds(article));
    const sameSeason = Boolean(currentSeason && currentSeason === seasonKey(article.season));
    const opposition = sharedIds(current.oppositionIds, article.oppositionIds);
    const themes = sharedIds(current.themeIds, article.themeIds).slice(0, 2);
    if (!people.length && !sameSeason && !opposition.length && !themes.length) continue;

    const sameEra = sharedIds(currentEras, getArticleEraIds(article, eras)).length > 0;
    const competitions = sharedIds(current.competitionIds, article.competitionIds);
    const score = Math.min(people.length, 2) * 5 + (sameSeason ? 5 : 0) + (opposition.length ? 3 : 0)
      + (sameEra ? 2 : 0) + (competitions.length ? 1 : 0) + themes.length * 2;
    if (score < 5) continue;

    // Explain specific connections before broad context; never expose internal IDs.
    // Person labels follow the current article's editorial order (players, then
    // managers). This affects display only: ordering metadata never changes scores.
    const sharedPeople = new Set(people);
    const reasons = currentPeople.filter(id => sharedPeople.has(id)).slice(0, 2)
      .map(id => labels.get(id) ?? "Shared person");
    if (sameSeason) reasons.push(currentSeason!.replace("-", "–"));
    if (opposition.length) reasons.push(labels.has(opposition[0]) ? `Against ${labels.get(opposition[0])}` : "Same opposition");
    reasons.push(...themes.map(id => labels.get(id) ?? "Shared theme"));
    if (sameEra) reasons.push("Same era");
    if (competitions.length) reasons.push(labels.get(competitions[0]) ?? "Same competition");

    recommendations.push({ article, score, reasons: [...new Set(reasons)].slice(0, 2) });
  }

  return recommendations.sort((a, b) => b.score - a.score
    || b.article.date.localeCompare(a.article.date)
    || a.article.slug.localeCompare(b.article.slug)).slice(0, resultLimit);
}
