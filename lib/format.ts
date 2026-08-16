// Shared display formatting for dates and excerpts.
//
// All date formatting here is pinned to a fixed locale ("en-GB") and a fixed
// time zone ("Europe/London"), rather than relying on the server's or the
// browser's default locale/time zone. Without that, a server-rendered page
// and the client hydrating it can compute different wall-clock strings for
// the same instant (e.g. a build server in UTC vs. a browser in the UK during
// BST), which produces a hydration mismatch or, worse, a visibly wrong time.

const TIME_ZONE = "Europe/London";
const LOCALE = "en-GB";

function partsOf(date: Date, options: Intl.DateTimeFormatOptions) {
  const parts = new Intl.DateTimeFormat(LOCALE, { timeZone: TIME_ZONE, ...options }).formatToParts(
    date
  );
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return get;
}

/** "Sat 15 August 2026, 08:30" */
export function formatLastUpdated(iso: string): string {
  const date = new Date(iso);
  const get = partsOf(date, {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${get("weekday")} ${get("day")} ${get("month")} ${get("year")}, ${get("hour")}:${get("minute")}`;
}

/** "Monday, 10 August 2026" */
export function formatLongDate(iso: string): string {
  const date = new Date(iso);
  const get = partsOf(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return `${get("weekday")}, ${get("day")} ${get("month")} ${get("year")}`;
}

/** "10 August 2026" (rendered upper-case via CSS so casing stays a style concern) */
export function formatListDate(iso: string): string {
  const date = new Date(iso);
  const get = partsOf(date, { day: "numeric", month: "long", year: "numeric" });
  return `${get("day")} ${get("month")} ${get("year")}`;
}

/** Plain-text excerpt of a Markdown body, for standfirsts and meta descriptions. */
export function getExcerpt(body: string, maxLength = 155): string {
  const plainText = body
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\n+/g, " ")
    .trim();

  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength).trim() + "...";
}
