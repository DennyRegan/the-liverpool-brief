import { getArticles } from "./articles.ts";

export const REGAN_ON_FOOTBALL_TAG = "regan-on-football";
export const REGAN_ON_FOOTBALL_PATH = "/regan-on-football";

// Only the existing Opinion article system participates in this column.
export function isReganOnFootball(article: { category: string; tags?: readonly string[] }) {
  return article.category === "Opinion" && article.tags?.includes(REGAN_ON_FOOTBALL_TAG) === true;
}

export function getReganOnFootballEditions(root = process.cwd()) {
  // The validated loader already orders publication dates newest first, with slug ties.
  return getArticles(root).filter(isReganOnFootball);
}

export function getEditionNeighbours<T extends { slug: string }>(editions: readonly T[], slug: string) {
  const index = editions.findIndex(edition => edition.slug === slug);
  if (index < 0) return {};
  return { newer: editions[index - 1], older: editions[index + 1] };
}
