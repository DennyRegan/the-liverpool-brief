import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readFileSync } from 'node:fs';
const { getWriting } = await import('../lib/content/writing.ts');
const { ArticleSchema } = await import('../lib/content/types.ts');
const { articleMetadata } = await import('../lib/social-metadata.ts');

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Articles keeps one canonical collection with Opinion, Analysis, Team News and History views', () => {
  const collection = read('app/components/ArticleCollection.tsx');
  assert.doesNotMatch(collection, /Article categories|Archive subcategories|filter\s*=/);
  assert.match(collection, /\[featured, \.\.\.rest\] = articles/);
  const page = read('app/articles/page.tsx');
  for (const type of ['opinion', 'analysis', 'team-news', 'history']) assert.match(page, new RegExp(`"${type}"`));
  assert.doesNotMatch(page, /Archive subcategories|type=archive/);
});

test('Team News joins the existing article collection without changing earlier writing or canonical metadata', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'team-news-'));
  try {
    const before = getWriting();
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    const fixtures = [['team-news-older-fixture', '2026-10-23'], ['team-news-latest-fixture', '2026-10-24']];
    const fixtureSlugs = new Set(fixtures.map(([slug]) => slug));
    for (const [slug, date] of fixtures) {
      fs.writeFileSync(path.join(root, 'content/articles/liverpool', `${slug}.md`),
        `---\ntitle: ${slug}\ndate: "${date}"\ncategory: Team News\nexcerpt: Test fixture.\ntags: [availability]\n---\nTest fixture only.\n`);
    }
    const writing = getWriting(root);
    const news = writing.filter(article => fixtureSlugs.has(article.slug));
    assert.deepEqual(news.map(article => article.slug), ['team-news-latest-fixture', 'team-news-older-fixture']);
    for (const article of news) {
      assert.equal(article.category, 'Team News');
      assert.equal(article.href, `/articles/${article.slug}`);
      assert.equal(writing.filter(item => item.href === article.href).length, 1);
      const metadata = articleMetadata(article, article.excerpt);
      assert.equal(metadata.alternates.canonical, article.href);
      assert.equal(metadata.openGraph.section, 'Team News');
      assert.deepEqual(metadata.keywords, ['availability']);
    }
    assert.deepEqual(writing.filter(article => !fixtureSlugs.has(article.slug)), before);
    assert.equal(ArticleSchema.parse({ title: 'Legacy', date: '2026-10-24', slug: 'legacy', body: 'Test.' }).category, 'Opinion');
    assert.equal(ArticleSchema.safeParse({ ...news[0], category: 'team-news' }).success, false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
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
