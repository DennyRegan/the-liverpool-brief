import { getArticles } from "./articles.ts";
import { getArchiveCategory, getArchiveFeatures } from "./archive.ts";

// Keep each piece at its existing URL; combine only the collection metadata.
// Archive pieces keep their stored editorialMode: opinion pieces list as Opinion,
// factual historical pieces list as History.
export function getWriting(root = process.cwd()) {
  return [
    ...getArticles(root).map(article => ({ ...article, href: `/articles/${article.slug}` })),
    ...getArchiveFeatures(root).map(article => ({ ...article, category: getArchiveCategory(article), href: `/archive/${article.slug}` })),
  ].sort((a, b) => b.date.localeCompare(a.date) || a.href.localeCompare(b.href));
}
