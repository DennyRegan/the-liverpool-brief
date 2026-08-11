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
