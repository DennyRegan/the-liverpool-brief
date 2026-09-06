import { getArticles } from "./articles";
import { getArchiveFeatures } from "./archive";

// Keep each piece at its existing URL; combine only the collection metadata.
export function getWriting() {
  return [
    ...getArticles().map(article => ({ ...article, category: "Opinion", archiveType: undefined, href: `/articles/${article.slug}` })),
    ...getArchiveFeatures().map(article => ({ ...article, archiveType: article.category, category: "Archive", href: `/archive/${article.slug}` })),
  ].sort((a, b) => b.date.localeCompare(a.date) || a.href.localeCompare(b.href));
}
