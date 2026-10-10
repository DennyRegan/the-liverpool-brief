import { z } from 'zod';
import { selectMatches, type MatchCentre } from './match-centre.ts';
import { getLondonToday } from './this-week.ts';

const HOUR = 3600000;
export const LeadOverrideSchema = z.object({
  href: z.string().regex(/^\/(articles|archive)\/[a-z0-9]+(?:-[a-z0-9]+)*$/),
  startsAt: z.iso.datetime({ offset: true }),
  expiresAt: z.iso.datetime({ offset: true }),
}).strict().refine(o => Date.parse(o.expiresAt) > Date.parse(o.startsAt) && Date.parse(o.expiresAt) - Date.parse(o.startsAt) <= 7 * 24 * HOUR,
  'The override must expire after its start and within seven days').nullable();
export type LeadOverride = z.infer<typeof LeadOverrideSchema>;

type Writing = { date: string; href: string; category: string; editorialMode?: string };
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

type Brief = { status: string; lastUpdated: string; stories: { headline: string; summary: string }[] };
export function selectHomeBrief<T extends Brief>(brief: T, now: Date) {
  const timestamp = z.iso.datetime({ offset: true }).safeParse(brief.lastUpdated);
  const age = now.getTime() - Date.parse(brief.lastUpdated);
  if (brief.status !== 'published' || !timestamp.success || age < 0 || age >= 48 * HOUR) return undefined;
  const seen = new Set<string>();
  const stories = brief.stories.filter(s => {
    const key = s.headline.trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-GB');
    if (!key || seen.has(key)) return false;
    seen.add(key); return true;
  }).slice(0, 3);
  return stories.length ? { ...brief, stories } : undefined;
}

// Calendar arithmetic happens on ISO dates; comparing London dates gives the
// correct midnight boundary on both 23-hour and 25-hour DST transition days.
function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
type Report = { slug: string; date: string; title: string };
export function selectHomeCoverage<T extends Report>(data: Pick<MatchCentre, 'fixtures'>, reports: T[], now: Date) {
  const { next, last } = selectMatches(data, now);
  const today = getLondonToday(now);
  if (next?.preview && next.kickoff && Date.parse(next.preview.updatedAt) <= now.getTime()) {
    const untilKickoff = Date.parse(next.kickoff) - now.getTime();
    if (untilKickoff > 0 && untilKickoff <= 48 * HOUR) return { kind: 'preview' as const, fixture: next, title: next.preview.title, href: '/match-centre#match-preview' };
  }
  if (last?.date && last.reportSlug && last.date <= today && today < addDays(last.date, 3)) {
    const report = reports.find(a => a.slug === last.reportSlug && a.date <= today);
    if (report) return { kind: 'review' as const, fixture: last, title: report.title, href: `/archive/${report.slug}` };
  }
  return undefined;
}
