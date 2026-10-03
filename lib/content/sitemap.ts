import type { MetadataRoute } from "next";
import { SITE_URL } from "../site.ts";
import { getArticles } from "./articles.ts";
import { getArchiveFeatures } from "./archive.ts";
import { getV3Context } from "./history-v3.ts";
import { getPublishedExperiences } from "./interactive-history.ts";

/** Mirror public page selectors; never scan editorial folders for destinations. */
export function getPublicSitemap(root = process.cwd()): MetadataRoute.Sitemap {
  const context = getV3Context(root);
  const experiences = getPublishedExperiences(root);
  const paths = [
    "/", "/about", "/articles", "/brief", "/match-centre", "/this-week",
    "/history", "/history/matches", "/history/players", "/history/seasons",
    "/history/my-years",
    "/history/opposition", "/history/competitions",
    ...getArticles(root).map(article => `/articles/${article.slug}`),
    // Legacy collection pages redirect, but individual Archive URLs stay canonical.
    ...getArchiveFeatures(root).map(article => `/archive/${article.slug}`),
    ...context.eras.map(era => `/history/${era.id}`),
    ...context.seasons.map(season => `/history/seasons/${season.season}`),
    ...context.destinations.map(destination => destination.href),
    // The index itself returns 404 while the published collection is empty.
    ...(experiences.length ? ["/history/interactive"] : []),
    ...experiences.map(experience => `/history/interactive/${experience.id}`),
  ];
  // Publication/event/review dates are not reliable page modification timestamps.
  // Omit lastModified rather than invent a fresh date on every generation.
  return [...new Set(paths)].map(path => ({ url: path === "/" ? SITE_URL : new URL(path, SITE_URL).href }));
}
