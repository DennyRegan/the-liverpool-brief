import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ArchiveFeatureSchema } from "./types";

const ARCHIVE_DIR = path.join(process.cwd(), "content/archive/liverpool");

function loadArchiveFeature(filename: string) {
    const slug = filename.replace(/\.md$/, "");
    const filepath = path.join(ARCHIVE_DIR, filename);
    const fileContent = fs.readFileSync(filepath, "utf-8");
    const { data, content } = matter(fileContent);
    return ArchiveFeatureSchema.parse({ ...data, slug, body: content.trim() });
}

export function getArchiveFeatures() {
    const filenames = fs.readdirSync(ARCHIVE_DIR).filter((f) => f.endsWith(".md"));
    return filenames
        .map(loadArchiveFeature)
        .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArchiveFeature(slug: string) {
    return loadArchiveFeature(`${slug}.md`);
}

export function archiveFeatureExists(slug: string) {
    return fs.existsSync(path.join(ARCHIVE_DIR, `${slug}.md`));
}

export function getMatchFeatures() {
    return getArchiveFeatures().filter((feature) => feature.category === "match");
}

export function getPersonFeatures() {
    return getArchiveFeatures().filter((feature) => feature.category === "person");
}

export function getSeasonFeatures() {
    // Oldest first — this is a historical run through the seasons, not a news feed.
    return getArchiveFeatures()
        .filter((feature) => feature.category === "season")
        .sort((a, b) => ((a.season ?? a.historicalPeriod) < (b.season ?? b.historicalPeriod) ? -1 : 1));
}
