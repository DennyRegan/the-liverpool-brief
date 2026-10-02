import assert from 'node:assert/strict';
import { getEditorialReviewQueue } from './editorial-review-queue.mjs';
import { getArchiveFeatures } from '../lib/content/archive.ts';

// Check an already-running local production build. No deployment or publication.
const base = new URL(process.argv[2] ?? 'http://127.0.0.1:3100');
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname), 'Use a local production server');
for (let attempt = 0; attempt < 30; attempt++) {
  try {
    const ready = await fetch(base, { signal: AbortSignal.timeout(2000) });
    if (ready.status === 200) break;
  } catch { /* Local server may still be starting. */ }
  if (attempt === 29) throw new Error('Local production server did not become ready');
  await new Promise(resolve => setTimeout(resolve, 1000));
}
const queues = ['biographies', 'matches'].map(kind => getEditorialReviewQueue(kind));
const entries = queues.flatMap(q => q.entries).filter(e => e.unpublished && e.canonicalDraftPath);
const publicSlugs = new Set(getArchiveFeatures().map(a => a.slug));
assert.equal(new Set(entries.map(e => e.slug)).size, entries.length, 'Duplicate unpublished slug');
for (const e of entries) assert.ok(!publicSlugs.has(e.slug), `Unpublished slug is public: ${e.slug}`);
const checks = entries.flatMap(e => [
  { route: `/archive/${e.slug}`, expected: 404, id: e.id },
  { route: `/${e.canonicalDraftPath}`, expected: 404, id: e.id },
]);
checks.push(...['/docs/editorial/history-calendar.json', '/docs/editorial/review-queue-preparation-2026-10-01.md',
  '/scripts/editorial-review-queue.mjs'].map(route => ({ route, expected: 404 })));
checks.push(...['/', '/history', '/history/opposition', '/articles', '/sitemap.xml', '/robots.txt',
  '/archive/1995-08-19-liverpool-sheffield-wednesday', '/archive/1995-09-23-liverpool-bolton-wanderers',
  '/archive/1996-02-24-blackburn-rovers-liverpool'].map(route => ({ route, expected: 200 })));
const results = [];
let cursor = 0;
await Promise.all(Array.from({ length: 8 }, async () => {
  while (cursor < checks.length) {
    const c = checks[cursor++];
    const response = await fetch(new URL(c.route, base), { signal: AbortSignal.timeout(30000), redirect: 'manual' });
    const body = await response.text();
    assert.equal(response.status, c.expected, c.route);
    if (c.route === '/sitemap.xml') for (const e of entries) {
      assert.ok(!body.includes(`/archive/${e.slug}<`), `Unpublished slug leaked into sitemap: ${e.slug}`);
    }
    results.push({ ...c, actual: response.status });
  }
}));
results.sort((a, b) => a.route < b.route ? -1 : a.route > b.route ? 1 : 0);
console.log(JSON.stringify({ version: 1, base: base.origin, unpublishedArticles: entries.length,
  checks: results.length, passed: true, results }, null, 2));
