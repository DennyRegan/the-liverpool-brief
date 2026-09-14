type DatedLink = { date: string; href: string };
const newestFirst = <T extends DatedLink>(items: T[]) => [...items].sort((a, b) =>
  b.date.localeCompare(a.date) || a.href.localeCompare(b.href)
);

// getWriting supplies all Articles, excluding explicitly factual History.
export function selectHomeWriting<T extends DatedLink>(writing: T[]) {
  const [lead, ...rest] = newestFirst(writing);
  return { lead, more: rest.slice(0, 2) };
}

// Select a mix of available types before filling remaining places by recency.
export function selectHomeHistory<T extends DatedLink & { kind: string }>(items: T[], limit = 3): T[] {
  const sorted = newestFirst(items);
  const selected: T[] = [];
  for (const item of sorted) {
    if (selected.length >= limit) break;
    if (!selected.some(other => other.kind === item.kind)) selected.push(item);
  }
  for (const item of sorted) {
    if (selected.length >= limit) break;
    if (!selected.some(other => other.href === item.href)) selected.push(item);
  }
  return newestFirst(selected);
}

/** The caller supplies Monday from the shared Europe/London calendar window. */
export function selectSeasonSpotlight<T extends { season: string }>(seasons: T[], monday: string): T | undefined {
  if (!seasons.length) return undefined;
  const ordered = [...seasons].sort((a, b) => a.season.localeCompare(b.season));
  const week = Math.floor((Date.parse(`${monday}T12:00:00Z`) - Date.parse("2026-09-14T12:00:00Z")) / (7 * 86400000));
  return ordered[((week % ordered.length) + ordered.length) % ordered.length];
}
