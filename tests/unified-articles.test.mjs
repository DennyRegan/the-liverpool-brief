import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readFileSync } from 'node:fs';
const { getWriting } = await import('../lib/content/writing.ts');
const { ArticleSchema } = await import('../lib/content/types.ts');

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Articles keeps one canonical collection with Opinion, Analysis and Features views', () => {
  const collection = read('app/components/ArticleCollection.tsx');
  assert.doesNotMatch(collection, /Article categories|Archive subcategories|filter\s*=/);
  assert.match(collection, /\[featured, \.\.\.rest\] = articles/);
  const page = read('app/articles/page.tsx');
  for (const type of ['opinion', 'analysis', 'features']) assert.match(page, new RegExp(`"${type}"`));
  assert.doesNotMatch(page, /Archive subcategories|type=archive/);
});

test('Team News no longer exists: the schema rejects it and nothing in the site offers it', () => {
  const base = { title: 'T', date: '2026-10-24', slug: 't', body: 'Test.' };
  assert.equal(ArticleSchema.safeParse({ ...base, category: 'Team News' }).success, false);
  assert.equal(ArticleSchema.safeParse({ ...base, category: 'Matchday' }).success, true);
  for (const file of ['app/articles/page.tsx', 'app/components/ArticlesNavigation.tsx', 'lib/content/homepage.ts', 'lib/content/types.ts']) {
    assert.doesNotMatch(read(file), /Team News|team-news/i, file);
  }
  // A leftover Team News article fails the build rather than slipping through.
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'team-news-'));
  try {
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    fs.writeFileSync(path.join(root, 'content/articles/liverpool/leftover.md'), '---\ntitle: Leftover\ndate: "2026-10-24"\ncategory: Team News\n---\nTest.\n');
    assert.throws(() => getWriting(root), /leftover\.md/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
  // The former Team News article now lives in Matchday with its URL unchanged.
  const brighton = getWriting().find(article => article.href === '/articles/liverpool-squad-update-barcola-available-brighton');
  assert.equal(brighton.category, 'Matchday');
});

test('legacy Archive collection routes return readers to Articles', () => {
  for (const route of ['', '/matches', '/people']) {
    assert.match(read(`app/archive${route}/page.tsx`), /redirect\("\/articles"\)/);
  }
  // Seasons moved to Looking Back on 12 November 2026.
  assert.match(read('app/archive/seasons/page.tsx'), /permanentRedirect\("\/looking-back\/seasons"\)/);
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

test('the Analysis tab sits directly after Opinion, and only once an Analysis article exists', () => {
  const nav = read('app/components/ArticlesNavigation.tsx');
  const opinion = nav.indexOf('["Opinion"'), analysis = nav.indexOf('["Analysis"'), matchday = nav.indexOf('["Matchday"');
  assert.ok(opinion < analysis && analysis < matchday);
  assert.match(nav, /\.\.\.\(hasAnalysis \? \[\["Analysis", "\/articles\?type=analysis"\]\] : \[\]\)/);
  assert.match(read('app/articles/page.tsx'), /hasAnalysis=\{types\.some\(\(\[category\]\) => category === "Analysis"\)\}/);
  assert.match(read('app/articles/page.tsx'), /TYPES\.filter\(\(\[category\]\) => writing\.some\(article => article\.category === category\)\)/);
});


test('article and Football Observed pages carry "By Denny Regan" under the headline', () => {
  const page = read('app/articles/[slug]/page.tsx');
  const headline = page.indexOf('<h1 className="article-title">');
  const meta = page.indexOf('<ArticleMeta {...article} author showColumn={false} />');
  assert.ok(headline >= 0 && meta > headline);
  assert.match(read('app/components/ArticleMeta.tsx'), /By Denny Regan/);
});
