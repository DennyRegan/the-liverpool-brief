import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { LookingBackSchema } from "./types.ts";
import { assertKnownTags } from "./opponents.ts";
import { addDays, formatDayDate, isLive, isProduction, liveFrom, onlyLive, weekEndingSunday, withGoLive } from "./go-live.ts";
import { getLondonToday } from "./homepage.ts";

export const LOOKING_BACK_PATH = "/looking-back";
// Looking Back is the hub for everything historical. Its subsections sit under it.
// The short weekly pieces are called "On This Day" (renamed from Keepsakes on
// 7 November 2026; /looking-back/keepsakes redirects permanently). Individual
// pieces keep their permanent /looking-back/[slug] URLs.
export const ON_THIS_DAY_PATH = "/looking-back/on-this-day";
export const ON_THIS_DAY_PREVIOUS_PATH = "/looking-back/on-this-day/previous";
export const FEATURES_PATH = "/looking-back/features";
/** Route segments under /looking-back that a piece's slug may not use. */
export const RESERVED_LOOKING_BACK_SEGMENTS = ["on-this-day", "keepsakes", "biographies", "series", "features", "match-revisited"];
// On This Day pieces always carry the publication byline, never a personal one.
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
      if (RESERVED_LOOKING_BACK_SEGMENTS.includes(slug)) throw new Error(`slug "${slug}" is reserved for a Looking Back section`);
      const piece = LookingBackSchema.parse({ ...data, body: content.trim() });
      assertKnownTags(piece);
      return piece;
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

// ---- On This Day: the current week -----------------------------------------

/** The Monday–Sunday week (Europe/London) containing now. */
export function currentWeek(now = new Date()) {
  const sunday = weekEndingSunday(getLondonToday(now));
  return { monday: addDays(sunday, -6), sunday };
}

/** "2–8 November", or "30 November – 6 December" when the week crosses a month. */
export function formatWeekRange(monday: string, sunday: string) {
  const [, mDay, mMonth] = formatDayDate(monday).split(" ");
  const [, sDay, sMonth] = formatDayDate(sunday).split(" ");
  return mMonth === sMonth ? `${mDay}–${sDay} ${sMonth}` : `${mDay} ${mMonth} – ${sDay} ${sMonth}`;
}

/**
 * Splits pieces around the current week by their `date` (the anniversary this
 * year): this week's in date order, earlier weeks grouped newest week first,
 * and later ones (which only previews and local show, flagged Scheduled).
 */
export function splitOnThisDay<T extends { date: string; slug: string }>(pieces: readonly T[], now = new Date()) {
  const { monday, sunday } = currentWeek(now);
  const byDate = (a: T, b: T) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug);
  return {
    week: { monday, sunday, range: formatWeekRange(monday, sunday) },
    thisWeek: pieces.filter(p => p.date >= monday && p.date <= sunday).sort(byDate),
    previousWeeks: groupByWeek(pieces.filter(p => p.date < monday)),
    upcoming: pieces.filter(p => p.date > sunday).sort(byDate),
  };
}
