// Run against the built site: BASE_URL=http://127.0.0.1:3155 node scripts/verify-search.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gzipSync } from 'node:zlib';
import { normaliseSearch, searchDocuments } from '../lib/search/search.ts';
const base = process.env.BASE_URL ?? 'http://127.0.0.1:3155';
const index = JSON.parse(fs.readFileSync('.generated/search-index.json', 'utf8'));
const get = async route => { const r = await fetch(base + route, { signal: AbortSignal.timeout(15000) }); assert.equal(r.status, 200, route); return r.text(); };
const main = html => html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
const empty = await get('/search');
assert.match(empty, /role="search"/); assert.match(empty, /method="get"/); assert.match(empty, /Enter a name/);
assert.ok(empty.includes('href="https://theliverpoolbrief.com/search"'));
assert.match(main(await get('/search?q=zzqnomatchzzq')), /No results/);
for (const q of ['Dalglish', 'Bob Paisley', 'Everton', '1986', 'European Cup', 'Barcelona', 'Gerrard', 'dalgl', 'DALGLISH']) {
  const expected = searchDocuments(index, q).slice(0, 20).map(d => d.href);
  const html = main(await get(`/search?${new URLSearchParams({ q })}`));
  assert.ok(expected.length, q);
  const links = [...html.matchAll(/<h3><a\b[^>]*href="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(links, expected, q); assert.equal(links.length, new Set(links).size);
}
const query = 'Liverpool', results = searchDocuments(index, query);
assert.ok(results.length > 20);
const pageTwo = main(await get('/search?q=Liverpool&page=2'));
assert.deepEqual([...pageTwo.matchAll(/<h3><a\b[^>]*href="([^"]+)"/g)].map(m => m[1]), results.slice(20, 40).map(d => d.href));
for (const route of ['/', '/articles', '/history', '/match-centre']) {
  const html = await get(route); assert.match(html, /href="\/search"/);
  assert.ok(!html.includes('titleText') && !html.includes('metadataText') && !html.includes('bodyText'), 'Index never serialised to normal pages');
}
assert.ok(!fs.existsSync('public/search-index.json'));
const trace = JSON.parse(fs.readFileSync('.next/server/app/search/page.js.nft.json'));
assert.ok(trace.files.some(f => f.endsWith('.generated/search-index.json')), 'Search index included in deployed server trace');
for (const route of ['page', 'articles/page', 'history/page', 'match-centre/page']) {
  const files = JSON.parse(fs.readFileSync(`.next/server/app/${route}.js.nft.json`)).files;
  assert.ok(!files.some(f => f.endsWith('.generated/search-index.json')), `${route} does not trace search index`);
}
assert.equal(normaliseSearch('1986–87'), normaliseSearch('1986-87'));
console.log(`PASS Search: canonical server-rendered GET results, supplied queries, partial/case searches, empty/no-results, pagination, header links and deployment tracing. Index ${index.length} destinations; ${fs.statSync('.generated/search-index.json').size} server bytes (${gzipSync(fs.readFileSync('.generated/search-index.json')).length} gzip), zero index bytes in normal page payloads.`);
