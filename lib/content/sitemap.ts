import { getHistoryLibrary, availableEntities, entityHref, HISTORY_NAV } from "./history-library.ts";
import type { MetadataRoute } from "next";
import { SITE_URL } from "../site.ts";
import { getArticles } from "./articles.ts";
import { getArchiveFeatures } from "./archive.ts";
import { getNewsletterConfig } from "../newsletter-config.ts";

/** Mirror public page selectors; never scan editorial folders for destinations. */
export function getPublicSitemap(root = process.cwd(), env = process.env): MetadataRoute.Sitemap {
  const library = getHistoryLibrary(root);
  const paths = [
    "/history", ...HISTORY_NAV.map(item => item.href),
    ...availableEntities(library).map(entityHref),
    ...library.articles.filter(a => a.articleType === "match" && a.season).map(a => `/history/seasons/${a.season}`),
    ...library.seasons.map(s => `/history/seasons/${s.record.season}`),
    ...library.series.map(s => `/history/series/${s.id}`),
    "/", "/about", "/articles", "/regan-on-football",
    // The newsletter pages are public only while signup is configured.
    ...(getNewsletterConfig(env) ? ["/newsletter", "/newsletter/privacy"] : []),
    ...getArticles(root).map(article => `/articles/${article.slug}`),
    // Retained Archive pieces keep their original canonical URLs.
    ...getArchiveFeatures(root).map(article => `/archive/${article.slug}`),
  ];
  // Publication/event/review dates are not reliable page modification timestamps.
  // Omit lastModified rather than invent a fresh date on every generation.
  return [...new Set(paths)].map(path => ({ url: path === "/" ? SITE_URL : new URL(path, SITE_URL).href }));
}
