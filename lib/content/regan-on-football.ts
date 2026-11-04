import { getArticles } from "./articles.ts";

export const REGAN_ON_FOOTBALL_TAG = "regan-on-football";
export const REGAN_ON_FOOTBALL_PATH = "/regan-on-football";
export const FOOTBALL_OBSERVED_OPINION_TAG = "football-observed-opinion";

// Only the existing Opinion article system participates in this column.
export function isReganOnFootball(article: { category: string; tags?: readonly string[] }) {
  return article.category === "Opinion" && article.tags?.includes(REGAN_ON_FOOTBALL_TAG) === true;
}

// Occasional opinion pieces sit under the Football Observed heading but are not weekly editions.
export function isFootballObservedOpinion(article: { category: string; tags?: readonly string[] }) {
  return isReganOnFootball(article) && article.tags?.includes(FOOTBALL_OBSERVED_OPINION_TAG) === true;
}

export function isWeeklyEdition(article: { category: string; tags?: readonly string[] }) {
  return isReganOnFootball(article) && !isFootballObservedOpinion(article);
}

export function getReganOnFootballEditions(root = process.cwd()) {
  // The validated loader already orders publication dates newest first, with slug ties.
  return getArticles(root).filter(isWeeklyEdition);
}

export function getFootballObservedPieces(root = process.cwd()) {
  return getArticles(root).filter(isReganOnFootball);
}

export function getFootballObservedOpinions(root = process.cwd()) {
  return getArticles(root).filter(isFootballObservedOpinion);
}

export function getEditionNeighbours<T extends { slug: string }>(editions: readonly T[], slug: string) {
  const index = editions.findIndex(edition => edition.slug === slug);
  if (index < 0) return {};
  return { newer: editions[index - 1], older: editions[index + 1] };
}
