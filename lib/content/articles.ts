import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ArticleSchema } from "./types";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles/liverpool");

function loadArticle(filename: string) {
    const slug = filename.replace(/\.md$/, "");
    const filepath = path.join(ARTICLES_DIR, filename);
    const fileContent = fs.readFileSync(filepath, "utf-8");
    const { data, content } = matter(fileContent);
    return ArticleSchema.parse({ ...data, slug, body: content.trim() });
}

export function getArticles() {
    const filenames = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));
    return filenames
        .map(loadArticle)
        .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticle(slug: string) {
    return loadArticle(`${slug}.md`);
}
