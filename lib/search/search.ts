export type SearchDocument = {
  href: string; title: string; type: string; context: string; excerpt: string;
  titleText: string; metadataText: string; bodyText: string;
};

export function normaliseSearch(text: string) {
  return text.normalize('NFKD').replace(/\p{M}/gu, '').toLocaleLowerCase('en-GB')
    .replace(/[’']/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}

function tokenMatch(text: string, token: string) {
  // Word prefixes support Dalgl / Barc without accidental matches inside names.
  return text.split(' ').some(word => word === token || token.length >= 2 && word.startsWith(token));
}

/** Small, deterministic lexical search. All query words must match somewhere. */
export function searchDocuments(documents: SearchDocument[], query: string) {
  const phrase = normaliseSearch(query.slice(0, 120));
  if (!phrase) return [];
  const tokens = [...new Set(phrase.split(' '))].slice(0, 8);
  const ranked = documents.flatMap(document => {
    let score = 0;
    for (const token of tokens) {
      const weight = tokenMatch(document.titleText, token) ? 40
        : tokenMatch(document.metadataText, token) ? 24
        : tokenMatch(document.bodyText, token) ? 4 : 0;
      if (!weight) return [];
      score += weight;
    }
    if (document.titleText === phrase) score += 120;
    else if (document.titleText.includes(phrase)) score += 60;
    else if (document.metadataText.includes(phrase)) score += 25;
    if (tokens.every(token => tokenMatch(document.titleText, token))) score += Math.max(0, 20 - document.titleText.split(' ').length);
    return [{ document, score }];
  }).sort((a, b) => b.score - a.score || a.document.title.localeCompare(b.document.title, 'en-GB') || a.document.href.localeCompare(b.document.href));
  // A canonical destination can appear once, even if an input projection overlaps.
  const unique = new Map<string, SearchDocument>();
  for (const { document } of ranked) if (!unique.has(document.href)) unique.set(document.href, document);
  return [...unique.values()];
}
