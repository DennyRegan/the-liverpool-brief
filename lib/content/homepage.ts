import { z } from 'zod';
import { isReganOnFootball } from './regan-on-football.ts';

const HOUR = 3600000;

export function getLondonToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find(p => p.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export const LeadOverrideSchema = z.object({
  href: z.string().regex(/^(?:\/(?:articles|archive)\/[a-z0-9]+(?:-[a-z0-9]+)*|\/looking-back\/series\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*)$/),
  startsAt: z.iso.datetime({ offset: true }),
  expiresAt: z.iso.datetime({ offset: true }),
}).strict().refine(o => Date.parse(o.expiresAt) > Date.parse(o.startsAt) && Date.parse(o.expiresAt) - Date.parse(o.startsAt) <= 7 * 24 * HOUR,
  'The override must expire after its start and within seven days').nullable();
export type LeadOverride = z.infer<typeof LeadOverrideSchema>;

/** The pinned href while an override is active (start inclusive, expiry exclusive), otherwise undefined. */
export function activePinnedHref(override: LeadOverride, now: Date) {
  return override && Date.parse(override.startsAt) <= now.getTime() && now.getTime() < Date.parse(override.expiresAt) ? override.href : undefined;
}

type Writing = { date: string; href: string; category: string; editorialMode?: string; tags?: readonly string[] };
export function selectHomeLead<T extends Writing>(writing: T[], now: Date, override: LeadOverride = null) {
  const today = getLondonToday(now);
  const eligible = [...writing].filter(a => ['Opinion', 'Analysis'].includes(a.category) && a.editorialMode !== 'factual' && a.date <= today)
    .sort((a, b) => b.date.localeCompare(a.date) || a.href.localeCompare(b.href));
  const pinned = override && Date.parse(override.startsAt) <= now.getTime() && now.getTime() < Date.parse(override.expiresAt)
    ? eligible.find(a => a.href === override.href) : undefined;
  // Dates remain visible even when the latest writing is older than 14 days.
  // We deliberately make no relative freshness claim on the homepage.
  return pinned ?? eligible[0];
}

// Two journalism pieces at most: the single newest Liverpool piece as the lead,
// then the newest Football Observed piece (a weekly edition or an occasional
// article) in its own section below. There is deliberately no list of further
// articles on the homepage: a short list of older dates made the site look
// stale. The full list lives at /articles.
// The column never takes the Liverpool lead slot, even when it is the newest
// piece or an editorial override names it.
export function selectHomePage<T extends Writing>(writing: T[], now: Date, override: LeadOverride = null) {
  const today = getLondonToday(now);
  const eligible = [...new Map(writing.map(article => [article.href, article])).values()]
    .filter(article => article.date <= today)
    .sort((a, b) => b.date.localeCompare(a.date) || a.href.localeCompare(b.href));
  const journalism = eligible.filter(article => ['Opinion', 'Analysis'].includes(article.category) && article.editorialMode !== 'factual');
  const latestColumn = journalism.find(isReganOnFootball);
  const otherWriting = journalism.filter(article => !isReganOnFootball(article));
  const lead = selectHomeLead(otherWriting, now, override) ?? otherWriting[0];
  const column = latestColumn;
  return { lead, column };
}
