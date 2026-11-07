import { formatDayDate } from "./go-live.ts";

// Small helpers for the shared history article template (app/components/HistoryArticle.tsx),
// used by every Looking Back piece: On This Day, Biographies, Series parts and Features.
// Everything is worked out from existing frontmatter; nothing is invented.

/** Whole minutes at 225 words a minute, never less than one. */
export function readMinutes(body: string) {
  const words = body.replace(/[#>*_`~[\]()!-]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 225));
}

export function readTime(body: string) {
  return `${readMinutes(body)} min read`;
}

/** "7 November 1967" for an ISO date. */
export function formatDayMonthYear(iso: string) {
  return formatDayDate(iso).split(" ").slice(1).join(" ");
}

/**
 * The On This Day kicker, "Inter-Cities Fairs Cup · 1967": the competition is the
 * last part of the piece's dateline ("Anfield · Tuesday 7 November 1967 ·
 * Inter-Cities Fairs Cup, second round, first leg") up to the first comma, and
 * the year comes from eventDate. Undefined when the dateline names no competition.
 */
export function onThisDayKicker(piece: { dateline: string; eventDate: string }) {
  const parts = piece.dateline.split(" · ");
  const competition = parts.length >= 3 ? parts.at(-1)!.split(",")[0].trim() : "";
  return competition ? `${competition} · ${piece.eventDate.slice(0, 4)}` : undefined;
}
