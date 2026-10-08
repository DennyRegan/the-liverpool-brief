import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
await import('../scripts/register-server-only.mjs');
const { buildSearchIndex } = await import('../lib/search/build-index.ts');
const { normaliseSearch, searchDocuments } = await import('../lib/search/search.ts');
const { getPublicSitemap } = await import('../lib/content/sitemap.ts');
const { getArticles } = await import('../lib/content/articles.ts');
const { getArchiveFeatures } = await import('../lib/content/archive.ts');
const { fixture } = await import('./fixtures/interactive-history.mjs');
const index = buildSearchIndex();
const document = (href, title, metadata = '', body = '') => ({ href, title, type: 'Test', context: '', excerpt: '', titleText: normaliseSearch(title), metadataText: normaliseSearch(metadata), bodyText: normaliseSearch(body) });

test('title and exact name outrank structured relationships and passing body mentions', () => {
  const docs = [document('/body', 'Other writing', '', 'Bob Paisley appears briefly.'), document('/metadata', 'A season', 'Bob Paisley'), document('/title', 'Bob Paisley')];
  assert.deepEqual(searchDocuments(docs, 'Bob Paisley').map(d => d.href), ['/title', '/metadata', '/body']);
});
test('case, accents, partial words and season punctuation work; empty/no-result queries are safe', () => {
  assert.deepEqual(searchDocuments(index, 'DALGLISH'), searchDocuments(index, 'dalglish'));
  assert.ok(searchDocuments(index, 'dalgl').length);
  assert.ok(searchDocuments(index, 'gerard houllier').some(d => d.href === '/history/gerard-houllier'));
  assert.deepEqual(searchDocuments(index, '1986-87'), searchDocuments(index, '1986–87'));
  for (const q of ['', '   ', '!!!', 'zzqnomatchzzq']) assert.deepEqual(searchDocuments(index, q), []);
});
test('all supplied reader searches find useful published material', () => {
  for (const q of ['Dalglish', 'Bob Paisley', 'Everton', '1986', 'European Cup', 'Barcelona', 'Gerrard']) assert.ok(searchDocuments(index, q).length, q);
  assert.equal(searchDocuments(index, 'Everton')[0].href, '/history/opposition/everton');
  assert.equal(searchDocuments(index, 'Bob Paisley')[0].href, '/history/people/bob-paisley');
  assert.equal(searchDocuments(index, 'European Cup')[0].href, '/history/competitions/european-cup');
});
test('every public story is indexed once at its canonical URL; existing classifications remain', () => {
  const sitemap = new Set(getPublicSitemap().map(e => new URL(e.url).pathname));
  assert.equal(index.length, new Set(index.map(d => d.href)).size);
  for (const d of index) { assert.ok(sitemap.has(d.href), d.href); assert.ok(d.title); assert.ok(d.excerpt); assert.doesNotMatch(d.href, /preview|docs|content|journeys|timeline/); }
  for (const a of getArticles()) assert.equal(index.find(d => d.href === `/articles/${a.slug}`).type, a.category);
  for (const a of getArchiveFeatures()) assert.ok(index.some(d => d.href === `/archive/${a.slug}`));
  assert.ok(index.some(d => d.type === 'Season')); assert.ok(index.some(d => d.type === 'Manager biography'));
  const duplicate = document('/one', 'Dalglish'); assert.equal(searchDocuments([duplicate, duplicate], 'dalglish').length, 1);
});
test('editorial drafts and unpublished interactive content never enter the index; new public content does', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'search-boundary-'));
  try {
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    fs.mkdirSync(path.join(root, 'docs/editorial/drafts'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs/editorial/drafts/private.md'), 'SECRET_DRAFT_SEARCH_BOUNDARY');
    const record = fixture('search-private-experience'); record.publication = { status: 'draft' };
    const dir = path.join(root, 'content/history/liverpool/interactive'); fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, `${record.id}.json`), JSON.stringify(record));
    fs.writeFileSync(path.join(root, 'content/articles/liverpool/search-public-fixture.md'), '---\ntitle: Search public fixture\ndate: "2026-10-08"\ncategory: Analysis\n---\nPublic search content.\n');
    const built = buildSearchIndex(root);
    assert.ok(!JSON.stringify(built).includes('SECRET_DRAFT_SEARCH_BOUNDARY')); assert.ok(!built.some(d => d.href.includes('search-private-experience')));
    assert.ok(built.some(d => d.href === '/articles/search-public-fixture' && d.type === 'Analysis'));
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
