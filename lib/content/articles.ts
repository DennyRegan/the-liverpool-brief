import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { ArticleSchema } from "./types.ts";
import { getHistoryEntities } from "./entities.ts";
import { getHistory, getArticleEraIds } from "./history.ts";
import { getArchiveFeatures } from "./archive.ts";

export function getArticles(root = process.cwd()) {
  const directory = path.join(root, "content/articles/liverpool");
  if (!fs.existsSync(directory)) return [];
  const entities = new Map(getHistoryEntities(root).map(e => [e.id, e.kind]));
  const eras = getHistory(root).eras;
  const archive = new Map(getArchiveFeatures(root).map(a => [a.slug, a]));
  return fs.readdirSync(directory).filter(f => f.endsWith(".md")).map(filename => {
    try {
      const slug = filename.slice(0, -3);
      const { data, content } = matter(fs.readFileSync(path.join(directory, filename), "utf8"));
      if (data.slug && data.slug !== slug) throw new Error("slug must match filename");
      const article = ArticleSchema.parse({ ...data, slug, body: content.trim() });
      const kinds = { playerIds: "person", managerIds: "person", oppositionIds: "opposition", competitionIds: "competition", locationIds: "location", themeIds: "theme" } as const;
      for (const field of Object.keys(kinds) as (keyof typeof kinds)[]) for (const id of article[field] ?? []) {
        if (entities.get(id) !== kinds[field]) throw new Error(`${field}: ${id} must be a canonical ${kinds[field]}`);
      }
      getArticleEraIds(article, eras);
      for (const id of article.relatedMatches ?? []) {
        if (archive.get(id)?.articleType !== "match" || archive.get(id)?.editorialMode !== "factual") throw new Error(`relatedMatches: ${id} must be a published factual match report`);
      }
      return article;
    } catch (error) { throw new Error(`Invalid article ${filename}: ${String(error)}`); }
  }).sort((a,b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getArticle(slug: string, root = process.cwd()) {
  const article = getArticles(root).find(a => a.slug === slug);
  if (!article) throw new Error(`Article not found: ${slug}`);
  return article;
}
