import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { LookingBackSchema } from "./types.ts";

export const LOOKING_BACK_PATH = "/looking-back";
export const LOOKING_BACK_DISCLOSURE = "Written with AI from checked sources and approved by The Liverpool Brief.";

/** Every keepsake, newest publication first. Any invalid file fails the build. */
export function getLookingBack(root = process.cwd()) {
  const directory = path.join(root, "content/looking-back");
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter(name => name.endsWith(".md")).map(filename => {
    try {
      const slug = filename.slice(0, -3);
      const { data, content } = matter(fs.readFileSync(path.join(directory, filename), "utf8"));
      if (data.slug !== slug) throw new Error(`slug "${data.slug}" must match filename "${slug}"`);
      return LookingBackSchema.parse({ ...data, body: content.trim() });
    } catch (error) {
      throw new Error(`Invalid Looking Back piece ${filename}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }).sort((a, b) => b.date.localeCompare(a.date) || b.eventDate.localeCompare(a.eventDate) || a.slug.localeCompare(b.slug));
}

export function getLookingBackPiece(slug: string, root = process.cwd()) {
  return getLookingBack(root).find(piece => piece.slug === slug);
}
