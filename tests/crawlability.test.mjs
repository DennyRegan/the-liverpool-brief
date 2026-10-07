import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
await import('../scripts/register-server-only.mjs');
const { getPublicSitemap } = await import('../lib/content/sitemap.ts');
const { default: sitemap, revalidate } = await import('../app/sitemap.ts');
const { default: robots } = await import('../app/robots.ts');
const { getArticles } = await import('../lib/content/articles.ts');
const { getArchiveFeatures } = await import('../lib/content/archive.ts');
const { getHistory } = await import('../lib/content/history.ts');
const { getSeasons } = await import('../lib/content/seasons.ts');
const { getExplorations } = await import('../lib/content/exploration.ts');
const { getPublishedExperiences } = await import('../lib/content/interactive-history.ts');
const { socialMetadata } = await import('../lib/social-metadata.ts');
import { fixture } from './fixtures/interactive-history.mjs';

const origin = 'https://theliverpoolbrief.com';
const urls = entries => entries.map(entry => entry.url);

test('sitemap covers public collections and the exact dynamic page destinations', () => {
  const entries = sitemap();
  const experiences = getPublishedExperiences();
  const expected = [
    '/', '/about', '/articles', '/brief', '/match-centre', '/this-week',
    '/history', '/history/matches', '/history/players', '/history/seasons',
    '/history/my-years',
    '/history/opposition', '/history/competitions',
    ...getArticles().map(a => `/articles/${a.slug}`),
    ...getArchiveFeatures().map(a => `/archive/${a.slug}`),
    ...getHistory().eras.map(e => `/history/${e.id}`),
    ...getSeasons().map(s => `/history/seasons/${s.season}`),
    ...getExplorations().map(d => d.href),
    ...(experiences.length ? ['/history/interactive'] : []),
    ...experiences.map(experience => `/history/interactive/${experience.id}`),
  ].map(route => route === '/' ? origin : new URL(route, origin).href);
  assert.deepEqual(urls(entries).sort(), expected.sort());
  assert.equal(revalidate, 3600);
  assert.equal(new Set(urls(entries)).size, entries.length);
  for (const entry of entries) {
    const url = new URL(entry.url);
    assert.equal(url.origin, origin);
    assert.equal(url.search, '');
    assert.equal(url.hash, '');
    assert.equal(entry.lastModified, undefined);
    assert.doesNotMatch(url.pathname, /^\/(preview|docs|content)(\/|$)/);
    assert.ok(!['/archive', '/archive/matches', '/archive/people', '/archive/seasons', '/history/people'].includes(url.pathname));
  }
  // The held experience and its unavailable index must not be advertised.
  assert.ok(!urls(entries).includes(`${origin}/history/interactive/istanbul-2005`));
  if (!experiences.length) assert.ok(!urls(entries).includes(`${origin}/history/interactive`));
});

test('story URLs resolve to the same canonical origin and paths as social metadata', () => {
  const destinations = new Set(urls(sitemap()));
  for (const [prefix, articles] of [['articles', getArticles()], ['archive', getArchiveFeatures()]]) {
    for (const article of articles) {
      const metadata = socialMetadata(article.title, article.excerpt ?? '', `/${prefix}/${article.slug}`);
      const canonical = new URL(metadata.alternates.canonical, origin).href;
      assert.ok(destinations.has(canonical));
      assert.equal(new URL(metadata.openGraph.url, origin).href, canonical);
    }
  }
  assert.match(fs.readFileSync('app/layout.tsx', 'utf8'), /metadataBase: new URL\(SITE_URL\)/);
});

test('new public stories appear automatically; editorial and interactive drafts stay out', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'crawlability-'));
  try {
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    const article = path.join(root, 'content/articles/liverpool/sitemap-public-fixture.md');
    fs.writeFileSync(article, '---\ntitle: Sitemap fixture\ndate: "2026-10-01"\n---\nPublic fixture.\n');
    const editorial = path.join(root, 'docs/editorial/drafts');
    fs.mkdirSync(editorial, { recursive: true });
    fs.writeFileSync(path.join(editorial, 'sitemap-private-fixture.md'), 'PRIVATE_DRAFT');
    const directory = path.join(root, 'content/history/liverpool/interactive');
    fs.rmSync(directory, { recursive: true, force: true });
    fs.mkdirSync(directory, { recursive: true });
    const record = fixture();
    const filename = path.join(directory, `${record.id}.json`);
    fs.writeFileSync(filename, JSON.stringify({ ...record, publication: { status: 'draft' } }));
    let result = urls(getPublicSitemap(root));
    assert.ok(result.includes(`${origin}/articles/sitemap-public-fixture`));
    assert.ok(!result.some(url => /private-fixture|interactive/.test(url)));
    fs.writeFileSync(filename, JSON.stringify(record));
    result = urls(getPublicSitemap(root));
    assert.ok(result.includes(`${origin}/history/interactive`));
    assert.ok(result.includes(`${origin}/history/interactive/${record.id}`));
    record.editorial.unresolvedIssues.push({ id: 'blocked', description: 'Unresolved evidence', blocking: true });
    fs.writeFileSync(filename, JSON.stringify(record));
    assert.throws(() => getPublicSitemap(root));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('robots allows public stories, blocks previews and source material, and advertises the canonical sitemap', () => {
  const result = robots();
  assert.equal(result.rules.userAgent, '*');
  assert.equal(result.rules.allow, '/');
  assert.deepEqual(result.rules.disallow, ['/preview', '/docs/', '/content/']);
  assert.equal(result.sitemap, `${origin}/sitemap.xml`);
  for (const entry of sitemap()) {
    assert.ok(!result.rules.disallow.some(prefix => new URL(entry.url).pathname.startsWith(prefix)));
  }
});
