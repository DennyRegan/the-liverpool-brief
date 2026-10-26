import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { socialMetadata, articleMetadata } from '../lib/social-metadata.ts';
import { ArticleSchema } from '../lib/content/types.ts';

test('article publication metadata preserves the canonical slug and separate editorial headline', () => {
  const article = ArticleSchema.parse({
    title: 'The editorial headline', seoTitle: 'The search headline', date: '2026-10-16',
    slug: 'bundesliga-tax-premier-league-analysis', category: 'Analysis',
    tags: ['Bundesliga', 'Florian Wirtz'], researchCutoff: '2026-10-16', body: 'Article text.',
  });
  const result = articleMetadata(article, 'The supplied excerpt.');
  assert.equal(result.title, 'The search headline');
  assert.equal(result.description, 'The supplied excerpt.');
  assert.equal(result.alternates.canonical, '/articles/bundesliga-tax-premier-league-analysis');
  assert.equal(result.openGraph.type, 'article');
  assert.equal(result.openGraph.publishedTime, '2026-10-16');
  assert.equal(result.openGraph.section, 'Analysis');
  assert.equal(result.openGraph.title, article.title);
  assert.equal(result.twitter.title, article.title);
  assert.equal(result.openGraph.description, 'The supplied excerpt.');
  assert.equal(result.twitter.description, 'The supplied excerpt.');
  assert.deepEqual(result.openGraph.tags, article.tags);
  assert.deepEqual(result.authors, [{ name: 'Denny Regan' }]);
  assert.equal(article.title, 'The editorial headline');
  assert.equal(ArticleSchema.safeParse({ ...article, researchCutoff: '16/10/2026' }).success, false);
  assert.equal(articleMetadata({ ...article, seoTitle: undefined }, '').title, article.title);
});

test('shared stories have consistent canonical, Open Graph and large X cards', () => {
  const result = socialMetadata('A Liverpool headline', 'A concise summary.', '/articles/example');
  assert.equal(result.alternates.canonical, '/articles/example');
  assert.equal(result.openGraph.url, '/articles/example');
  assert.equal(result.openGraph.title, 'A Liverpool headline');
  assert.equal(result.openGraph.siteName, 'The Liverpool Brief');
  assert.equal(result.twitter.card, 'summary_large_image');
  assert.equal(result.twitter.title, result.openGraph.title);
  assert.equal(result.openGraph.images[0].url, 'https://theliverpoolbrief.com/articles/example/opengraph-image?v=editorial-2');
  assert.deepEqual(result.twitter.images, result.openGraph.images);
  assert.equal(result.openGraph.images[0].width, 1200);
  assert.equal(result.openGraph.images[0].height, 630);
  assert.equal(result.openGraph.images[0].alt, 'A Liverpool headline');
});

test('Archive images use their retained canonical route and collection pages do not invent image endpoints', () => {
  assert.equal(socialMetadata('History headline', 'Excerpt.', '/archive/example').twitter.images[0].url,
    'https://theliverpoolbrief.com/archive/example/opengraph-image?v=editorial-2');
  assert.equal(socialMetadata('Articles', 'Excerpt.', '/articles').openGraph.images, undefined);
});

test('native sharing sends the headline and canonical URL, not generic site text', () => {
  const source = fs.readFileSync('app/components/ShareButton.tsx', 'utf8');
  assert.match(source, /text: title/);
  assert.match(source, /link\[rel="canonical"\]/);
  assert.doesNotMatch(source, /text: "The Liverpool Brief"/);
});

test('articles and Archive pieces have dedicated share images', () => {
  for (const route of ['articles/[slug]', 'archive/[slug]']) {
    assert.match(fs.readFileSync(`app/${route}/opengraph-image.tsx`, 'utf8'), /socialImage\(/);
  }
});
