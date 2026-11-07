import { getLondonToday } from "./homepage.ts";

// The go-live rule shared by Looking Back and History. A piece's `date` is its
// publication date; the whole Monday–Sunday week it falls in goes live together
// at midnight Europe/London on the Monday (getLondonToday, the same logic as the
// homepage) and stays live permanently. On production, pieces not yet live do not
// exist anywhere (lists, pages, images, sitemap). Everywhere else (Vercel
// previews, local) they are shown flagged "Scheduled for". Nothing here runs on a
// timer: it only compares the current date with the file's date.

/** True only on the Vercel production deployment. */
export function isProduction(env: Record<string, string | undefined> = process.env) {
  return env.VERCEL_ENV === "production";
}

/** The day a piece goes live: the Monday of the week its date falls in. */
export function liveFrom(piece: { date: string }) {
  const date = new Date(`${piece.date}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7);
  return date.toISOString().slice(0, 10);
}

export function isLive(piece: { date: string }, now = new Date()) {
  return liveFrom(piece) <= getLondonToday(now);
}

/** Pieces this deployment may show: live only on production, everything (flagged) elsewhere. */
export function withGoLive<T extends { date: string }>(pieces: readonly T[], now = new Date(), env: Record<string, string | undefined> = process.env) {
  const flagged = pieces.map(piece => ({ ...piece, liveFrom: liveFrom(piece), scheduled: !isLive(piece, now) }));
  return isProduction(env) ? flagged.filter(piece => !piece.scheduled) : flagged;
}

/** Live pieces only, whatever the environment (used by the sitemap). */
export function onlyLive<T extends { date: string }>(pieces: readonly T[], now = new Date()) {
  return pieces.filter(piece => isLive(piece, now));
}

/** The ISO date a number of days after (or, if negative, before) another. */
export function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** True when a live piece's date falls within the last `days` days (Europe/London), or later this week. */
export function isRecent(piece: { date: string }, days: number, now = new Date()) {
  return isLive(piece, now) && piece.date > addDays(getLondonToday(now), -days);
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
