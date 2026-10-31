import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { ArticleSchema } from "./types.ts";

export function getArticles(root = process.cwd()) {
  const directory = path.join(root, "content/articles/liverpool");
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter(f => f.endsWith(".md")).map(filename => {
    try {
      const slug = filename.slice(0, -3);
      const { data, content } = matter(fs.readFileSync(path.join(directory, filename), "utf8"));
      if (data.slug && data.slug !== slug) throw new Error("slug must match filename");
      return ArticleSchema.parse({ ...data, slug, body: content.trim() });
    } catch (error) { throw new Error(`Invalid article ${filename}: ${String(error)}`); }
  }).sort((a,b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getArticle(slug: string, root = process.cwd()) {
  const article = getArticles(root).find(a => a.slug === slug);
  if (!article) throw new Error(`Article not found: ${slug}`);
  return article;
}
