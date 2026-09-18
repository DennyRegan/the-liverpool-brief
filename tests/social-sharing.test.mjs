import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { socialMetadata } from '../lib/social-metadata.ts';

test('shared stories have consistent canonical, Open Graph and large X cards', () => {
  const result = socialMetadata('A Liverpool headline', 'A concise summary.', '/articles/example');
  assert.equal(result.alternates.canonical, '/articles/example');
  assert.equal(result.openGraph.url, '/articles/example');
  assert.equal(result.openGraph.title, 'A Liverpool headline');
  assert.equal(result.openGraph.siteName, 'The Liverpool Brief');
  assert.equal(result.twitter.card, 'summary_large_image');
  assert.equal(result.twitter.title, result.openGraph.title);
});

test('native sharing sends the headline and canonical URL, not generic site text', () => {
  const source = fs.readFileSync('app/components/ShareButton.tsx', 'utf8');
  assert.match(source, /text: title/);
  assert.match(source, /link\[rel="canonical"\]/);
  assert.doesNotMatch(source, /text: "The Liverpool Brief"/);
});

test('articles, reports and Match Centre have dedicated share images', () => {
  for (const route of ['articles/[slug]', 'archive/[slug]', 'match-centre']) {
    assert.match(fs.readFileSync(`app/${route}/opengraph-image.tsx`, 'utf8'), /socialImage\(/);
  }
});
