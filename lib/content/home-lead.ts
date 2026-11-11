// The homepage leads with ONE piece: the newest thing Denny has published, of
// any kind. Liverpool opinion and analysis, Football Observed, biographies and
// series parts all compete on date. (Changed 11 November 2026 at Denny's
// request: the lead used to be Liverpool pieces only, so newer Football
// Observed and history pieces sat below an older article and the site looked
// stale.) On a tied date the earlier item in the list wins, so callers put the
// writing first.
export type LeadCandidate<T> = { date: string; item: T };

export function selectNewestLead<T>(candidates: LeadCandidate<T>[]) {
  return candidates.reduce<LeadCandidate<T> | undefined>((best, next) => !best || next.date > best.date ? next : best, undefined)?.item;
}
