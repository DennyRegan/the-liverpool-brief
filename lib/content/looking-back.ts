import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { LookingBackSchema } from "./types.ts";
import { getLondonToday } from "./homepage.ts";

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
// `date` is the anniversary. A piece goes live at midnight Europe/London on the
// Monday of the Monday–Sunday week containing that date (getLondonToday, the
// same logic as the homepage), and stays live permanently. On production,
// pieces not yet live do not exist anywhere. Everywhere else (Vercel previews,
// local) they are shown with a "Scheduled for" banner.

/** True only on the Vercel production deployment. */
export function isProduction(env: Record<string, string | undefined> = process.env) {
  return env.VERCEL_ENV === "production";
}

/** The Monday that starts the Monday–Sunday week containing this date. */
export function weekStartingMonday(iso: string) {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7);
  return date.toISOString().slice(0, 10);
}

/** The day a piece goes live: the Monday of its week. */
export function liveFrom(piece: { date: string }) {
  return weekStartingMonday(piece.date);
}

export function isLive(piece: { date: string }, now = new Date()) {
  return liveFrom(piece) <= getLondonToday(now);
}

/** Pieces this deployment may show: live only on production, everything (flagged) elsewhere. */
export function getVisibleLookingBack(now = new Date(), env: Record<string, string | undefined> = process.env, root = process.cwd()) {
  const pieces = getLookingBack(root).map(piece => ({ ...piece, liveFrom: liveFrom(piece), scheduled: !isLive(piece, now) }));
  return isProduction(env) ? pieces.filter(piece => !piece.scheduled) : pieces;
}

/** Live pieces only, whatever the environment (used by the sitemap). */
export function getLiveLookingBack(now = new Date(), root = process.cwd()) {
  return getLookingBack(root).filter(piece => isLive(piece, now));
}

export function getVisibleLookingBackPiece(slug: string, now = new Date(), env: Record<string, string | undefined> = process.env) {
  return getVisibleLookingBack(now, env).find(piece => piece.slug === slug);
}

/** "Sunday 1 November 2026" for an ISO date, independent of the server time zone. */
export function formatDayDate(iso: string) {
  const parts = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .formatToParts(new Date(`${iso}T12:00:00Z`));
  const part = (type: string) => parts.find(p => p.type === type)!.value;
  return `${part("weekday")} ${part("day")} ${part("month")} ${part("year")}`;
}

/** The Sunday ending the Monday–Sunday week that contains this date. */
export function weekEndingSunday(iso: string) {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + (7 - date.getUTCDay()) % 7);
  return date.toISOString().slice(0, 10);
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
