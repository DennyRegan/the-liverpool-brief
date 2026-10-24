import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readFileSync } from 'node:fs';
const { getWriting } = await import('../lib/content/writing.ts');

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Articles keeps one canonical collection with Opinion, Analysis and History views', () => {
  const collection = read('app/components/ArticleCollection.tsx');
  assert.doesNotMatch(collection, /Article categories|Archive subcategories|filter\s*=/);
  assert.match(collection, /\[featured, \.\.\.rest\] = articles/);
  const page = read('app/articles/page.tsx');
  for (const type of ['opinion', 'analysis', 'history']) assert.match(page, new RegExp(`"${type}"`));
  assert.doesNotMatch(page, /Archive subcategories|type=archive/);
});

test('legacy Archive collection routes return readers to Articles', () => {
  for (const route of ['', '/matches', '/people', '/seasons']) {
    assert.match(read(`app/archive${route}/page.tsx`), /redirect\("\/articles"\)/);
  }
});

test('retained Archive pieces join Articles once at their original URLs', () => {
  const writing = getWriting();
  assert.equal(new Set(writing.map(article => article.href)).size, writing.length);
  assert.equal(new Set(writing.map(article => article.title)).size, writing.length);
  for (const article of writing.filter(item => item.href.startsWith('/archive/'))) {
    assert.ok(['Opinion', 'History'].includes(article.category));
    assert.equal(article.category === 'History', article.editorialMode === 'factual');
  }
  assert.match(read('app/archive/[slug]/page.tsx'), /getArchiveFeature\(slug\)/);
  // Archive pages show the byline and publication date, with the match date labelled separately.
  const page = read('app/archive/[slug]/page.tsx');
  assert.match(page, /ArticleMeta \{\.\.\.feature\} category=\{getArchiveCategory\(feature\)\} author/);
  const meta = read('app/components/ArticleMeta.tsx');
  assert.match(meta, /By Denny Regan/);
  assert.match(meta, /dateTime=\{date\}/);
  assert.match(meta, /Published \$\{formatListDate\(date\)\}/);
  assert.match(page, /Match date: \{feature\.historicalEventDate/);
});

test('a new Analysis article appears in Articles without code changes', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'analysis-'));
  try {
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    fs.writeFileSync(path.join(root, 'content/articles/liverpool/analysis-fixture.md'),
      '---\ntitle: Analysis fixture\ndate: "2026-10-20"\ncategory: Analysis\n---\n| Player | Goals |\n| --- | --- |\n| A | 1 |\n');
    const article = getWriting(root).find(item => item.slug === 'analysis-fixture');
    assert.equal(article.category, 'Analysis');
    assert.equal(article.href, '/articles/analysis-fixture');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
