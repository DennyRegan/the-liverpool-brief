import { getArticles } from "./articles.ts";
import { getArchiveFeatures } from "./archive.ts";

// Keep each piece at its existing URL; combine only the collection metadata.
export function getWriting(root = process.cwd()) {
  return [
    ...getArticles(root).map(article => ({ ...article, href: `/articles/${article.slug}` })),
    ...getArchiveFeatures(root).filter(article => article.editorialMode !== "factual").map(article => ({ ...article, category: "Opinion" as const, href: `/archive/${article.slug}` })),
  ].sort((a, b) => b.date.localeCompare(a.date) || a.href.localeCompare(b.href));
}
