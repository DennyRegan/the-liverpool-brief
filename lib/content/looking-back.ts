import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { LookingBackSchema } from "./types.ts";
import { formatDayDate, isLive, isProduction, liveFrom, onlyLive, weekEndingSunday, withGoLive } from "./go-live.ts";

export const LOOKING_BACK_PATH = "/looking-back";
// Keepsakes always carry the publication byline, never a personal one.
// The AI disclosure lives on the About page only. Drafts sit in docs/looking-back-drafts/.
export const LOOKING_BACK_BYLINE = "The Liverpool Brief";

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

// ---- Scheduled publishing -------------------------------------------------
// The go-live rule (Monday of the piece's week, midnight Europe/London, live
// permanently, hidden on production until then) is shared with History and
// lives in ./go-live.ts. Re-exported here so Looking Back callers are unchanged.
export { isProduction, liveFrom, isLive, formatDayDate, weekEndingSunday };

/** Pieces this deployment may show: live only on production, everything (flagged) elsewhere. */
export function getVisibleLookingBack(now = new Date(), env: Record<string, string | undefined> = process.env, root = process.cwd()) {
  return withGoLive(getLookingBack(root), now, env);
}

/** Live pieces only, whatever the environment (used by the sitemap). */
export function getLiveLookingBack(now = new Date(), root = process.cwd()) {
  return onlyLive(getLookingBack(root), now);
}

export function getVisibleLookingBackPiece(slug: string, now = new Date(), env: Record<string, string | undefined> = process.env) {
  return getVisibleLookingBack(now, env).find(piece => piece.slug === slug);
}

/** Groups pieces by the Monday–Sunday week their date falls in: newest week first, earliest piece first within a week. */
export function groupByWeek<T extends { date: string; slug: string }>(pieces: readonly T[]) {
  const weeks = new Map<string, T[]>();
  for (const piece of pieces) {
    const sunday = weekEndingSunday(piece.date);
    weeks.set(sunday, [...(weeks.get(sunday) ?? []), piece]);
  }
  return [...weeks.entries()].sort(([a], [b]) => b.localeCompare(a))
    .map(([sunday, items]) => ({
      sunday, heading: `Week ending ${formatDayDate(sunday)}`,
      pieces: [...items].sort((a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug)),
    }));
}
