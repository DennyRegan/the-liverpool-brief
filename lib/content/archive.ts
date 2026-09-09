import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ArchiveFeatureSchema } from "./types.ts";
import { getHistoryEntities } from "./entities.ts";
import { getHistory, getArticleEraIds } from "./history.ts";

const relationshipKinds = {
    playerIds: "person", managerIds: "person", oppositionIds: "opposition",
    competitionIds: "competition", locationIds: "location", themeIds: "theme",
} as const;

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
    if (!articles.length) return [];
    const entities = new Map(getHistoryEntities(root).map(entity => [entity.id, entity]));
    const { eras } = getHistory(root);
    const bySlug = new Map(articles.map(article => [article.slug, article]));
    for (const article of articles) {
        try {
            for (const [field, kind] of Object.entries(relationshipKinds)) {
                for (const id of article[field as keyof typeof relationshipKinds] ?? []) {
                    const entity = entities.get(id);
                    if (!entity) throw new Error(`${field}: unknown entity ID "${id}"; add it to content/history/liverpool/entities.json or correct the ID`);
                    if (entity.kind !== kind) throw new Error(`${field}: "${id}" is ${entity.kind}; expected ${kind}`);
                }
            }
            getArticleEraIds(article, eras);
            // Preserve the older curated season links, while rejecting broken references.
            for (const slug of article.relatedMatches ?? []) {
                const related = bySlug.get(slug);
                if (slug === article.slug) throw new Error("relatedMatches cannot link the article to itself");
                if (!related) throw new Error(`relatedMatches: Archive article not found: "${slug}"`);
                if (related.category !== "match") throw new Error(`relatedMatches: "${slug}" must have category "match"`);
            }
        } catch (error) {
            throw new Error(`Invalid Archive article ${article.slug}.md: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    return articles.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getArchiveFeature(slug: string, root = process.cwd()) {
    const article = getArchiveFeatures(root).find(article => article.slug === slug);
    if (!article) throw new Error(`Archive article not found: ${slug}`);
    return article;
}

export function archiveFeatureExists(slug: string) {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && fs.existsSync(path.join(process.cwd(), "content/archive/liverpool", `${slug}.md`));
}

export function getMatchFeatures() {
    return getArchiveFeatures().filter(feature => feature.category === "match");
}

export function getPersonFeatures() {
    return getArchiveFeatures().filter(feature => feature.category === "person");
}

export function getSeasonFeatures() {
    // Oldest first — this is a historical run through the seasons, not a news feed.
    return getArchiveFeatures()
        .filter(feature => feature.category === "season")
        .sort((a, b) => ((a.season ?? a.historicalPeriod) < (b.season ?? b.historicalPeriod) ? -1 : 1));
}
