// The homepage leads with ONE piece: the newest thing Denny has published, of
// any kind. Liverpool opinion and analysis, Football Observed, biographies and
// series parts all compete on date. (Changed 11 November 2026 at Denny's
// request: the lead used to be Liverpool pieces only, so newer Football
// Observed and history pieces sat below an older article and the site looked
// stale.) On a tied date the earlier item in the list wins, so callers put the
// writing first.
//
// An active editorial pin (lib/content/homepage-override.json, at most seven
// days) beats the date order, but only when its target is live and among the
// candidates; otherwise the newest piece leads as usual.
export type LeadCandidate<T> = { date: string; href: string; item: T };

export function selectNewestLead<T>(candidates: LeadCandidate<T>[], pinnedHref?: string) {
  const pinned = pinnedHref ? candidates.find(candidate => candidate.href === pinnedHref) : undefined;
  if (pinned) return pinned.item;
  return candidates.reduce<LeadCandidate<T> | undefined>((best, next) => !best || next.date > best.date ? next : best, undefined)?.item;
}
