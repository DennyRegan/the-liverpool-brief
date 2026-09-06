import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import matter from 'gray-matter';
import { ArticleSchema } from '../lib/content/types.ts';
import { getArticleExcerpt, getExcerpt, getSourceLink } from '../lib/format.ts';

test('the published Barcola excerpt survives content validation and feeds previews', () => {
  const { data, content } = matter(fs.readFileSync(new URL('../content/articles/liverpool/why-barcola-will-justify-the-fee.md', import.meta.url), 'utf8'));
  const article = ArticleSchema.parse({ ...data, body: content.trim() });
  assert.equal(getArticleExcerpt(article, 220), data.excerpt);
  assert.equal(getArticleExcerpt(article), data.excerpt);
});

test('legacy articles receive readable fallback excerpts without partial words', () => {
  const article = ArticleSchema.parse({ title: 'Legacy article', date: '2026-09-06', slug: 'legacy', body: 'One two three four five.' });
  assert.equal(getArticleExcerpt(article, 11), 'One two...');
  assert.equal(getArticleExcerpt({ ...article, excerpt: '  ' }, 11), 'One two...');
  assert.equal(getExcerpt('One two three four', 13), 'One two three...');
  assert.equal(getExcerpt('A short paragraph.'), 'A short paragraph.');
});

test('source URLs become links while legacy outlet names remain text', () => {
  assert.deepEqual(getSourceLink('https://www.liverpoolfc.com/news/example'), {
    href: 'https://www.liverpoolfc.com/news/example', label: 'liverpoolfc.com',
  });
  for (const source of ['The Athletic', 'BBC', 'https://', 'javascript:alert(1)']) {
    assert.equal(getSourceLink(source), null);
  }
});
