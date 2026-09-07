type WritingSummary = { category: string; date: string; href: string };

// Select each category independently, so recent opinion pieces cannot displace
// the Archive slot. Sort a copy to leave the shared collection untouched.
export function selectHomeWriting<T extends WritingSummary>(writing: T[]) {
  const newestFirst = [...writing].sort((a, b) =>
    b.date.localeCompare(a.date) || a.href.localeCompare(b.href)
  );
  return {
    opinion: newestFirst.find(article => article.category === "Opinion"),
    archive: newestFirst.find(article => article.category === "Archive"),
  };
}
