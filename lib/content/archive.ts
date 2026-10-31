import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ArchiveFeatureSchema } from "./types.ts";

export function getArchiveFeatures(root = process.cwd()) {
    const dir = path.join(root, "content/archive/liverpool");
    if (!fs.existsSync(dir)) return [];
    const filenames = fs.readdirSync(dir).filter(f => f.endsWith(".md")).sort();
    const articles = filenames.map(filename => {
        try {
            const slug = filename.replace(/\.md$/, "");
            const { data, content } = matter(fs.readFileSync(path.join(dir, filename), "utf-8"));
            if (data.slug !== undefined && data.slug !== slug) {
                throw new Error(`slug "${data.slug}" must match filename "${slug}"`);
            }
            return ArchiveFeatureSchema.parse({ ...data, slug, body: content.trim() });
        } catch (error) {
            throw new Error(`Invalid Archive article ${filename}: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
    return articles.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getArchiveFeature(slug: string, root = process.cwd()) {
    const article = getArchiveFeatures(root).find(article => article.slug === slug);
    if (!article) throw new Error(`Archive article not found: ${slug}`);
    return article;
}

// Listing category follows the stored editorialMode: opinion pieces are Opinion,
// factual historical pieces are History.
export function getArchiveCategory(article: { editorialMode?: "factual" | "opinion" }) {
    return article.editorialMode === "factual" ? "History" as const : "Opinion" as const;
}
