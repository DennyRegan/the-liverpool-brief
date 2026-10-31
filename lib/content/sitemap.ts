import type { MetadataRoute } from "next";
import { SITE_URL } from "../site.ts";
import { getArticles } from "./articles.ts";
import { getArchiveFeatures } from "./archive.ts";
import { getNewsletterConfig } from "../newsletter-config.ts";

/** Mirror public page selectors; never scan editorial folders for destinations. */
export function getPublicSitemap(root = process.cwd(), env = process.env): MetadataRoute.Sitemap {
  const paths = [
    "/", "/about", "/articles", "/regan-on-football", "/matchday",
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
