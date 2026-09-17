import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Articles keeps one canonical collection with Opinion and Analysis views', () => {
  const collection = read('app/components/ArticleCollection.tsx');
  assert.doesNotMatch(collection, /Article categories|Archive subcategories|filter\s*=/);
  assert.match(collection, /\[featured, \.\.\.rest\] = articles/);
  assert.match(read('app/articles/page.tsx'), /type=opinion/);
  assert.match(read('app/articles/page.tsx'), /type=analysis/);
  assert.doesNotMatch(read('app/articles/page.tsx'), /Archive subcategories|type=archive/);
});

test('legacy Archive collection routes return readers to Articles', () => {
  for (const route of ['', '/matches', '/people', '/seasons']) {
    assert.match(read(`app/archive${route}/page.tsx`), /redirect\("\/articles"\)/);
  }
});

test('factual history stays excluded from writing and old story URLs remain available', () => {
  assert.match(read('lib/content/writing.ts'), /editorialMode !== "factual"/);
  assert.match(read('app/archive/[slug]/page.tsx'), /historyDestination \?\? "\/articles"/);
  assert.match(read('app/archive/[slug]/page.tsx'), /getArchiveFeature\(slug\)/);
});
