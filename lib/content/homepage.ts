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
