import { getHistoryLibrary, availableEntities, entityHref, HISTORY_NAV } from '../lib/content/history-library.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const { getPublicSitemap } = await import('../lib/content/sitemap.ts');
const { default: sitemap, revalidate } = await import('../app/sitemap.ts');
const { default: robots } = await import('../app/robots.ts');
const { getArticles } = await import('../lib/content/articles.ts');
const { getArchiveFeatures } = await import('../lib/content/archive.ts');
const { getNewsletterConfig } = await import('../lib/newsletter-config.ts');
const { socialMetadata } = await import('../lib/social-metadata.ts');

const origin = 'https://theliverpoolbrief.com';
const urls = entries => entries.map(entry => entry.url);
const newsletter = { SENDER_PUBLIC_ACCOUNT_ID: 'abc123', SENDER_NEWSLETTER_FORM_ID: 'form1', SENDER_NEWSLETTER_FORM_URL: 'https://stats.sender.net/forms/form1/view' };

test('sitemap lists only the public pages and retained articles', () => {
  const entries = sitemap();
  const library = getHistoryLibrary();
  const expected = [
    ...library.articles.filter(a => a.articleType === "match" && a.season).map(a => `/history/seasons/${a.season}`),
    "/history", ...HISTORY_NAV.map(item => item.href), ...availableEntities(library).map(entityHref), ...library.seasons.map(s => `/history/seasons/${s.record.season}`), ...library.series.map(s => `/history/series/${s.id}`),
    '/', '/about', '/articles', '/regan-on-football',
    ...(getNewsletterConfig() ? ['/newsletter', '/newsletter/privacy'] : []),
    ...getArticles().map(a => `/articles/${a.slug}`),
    ...getArchiveFeatures().map(a => `/archive/${a.slug}`),
  ].map(route => route === '/' ? origin : new URL(route, origin).href);
  assert.deepEqual(urls(entries).sort(), [...new Set(expected)].sort());
  assert.equal(revalidate, 3600);
  assert.equal(new Set(urls(entries)).size, entries.length);
  for (const entry of entries) {
    const url = new URL(entry.url);
    assert.equal(url.origin, origin);
    assert.equal(url.search, '');
    assert.equal(url.hash, '');
    assert.equal(entry.lastModified, undefined);
    assert.doesNotMatch(url.pathname, /^\/(preview|docs|content|brief|this-week|match-centre|search)(\/|$)/);
    assert.ok(!['/archive', '/archive/matches', '/archive/people', '/archive/seasons'].includes(url.pathname));
  }
});

test('newsletter pages are advertised only while signup is configured', () => {
  const closed = urls(getPublicSitemap(process.cwd(), {}));
  assert.ok(!closed.some(url => url.includes('/newsletter')));
  const open = urls(getPublicSitemap(process.cwd(), newsletter));
  assert.ok(open.includes(`${origin}/newsletter`));
  assert.ok(open.includes(`${origin}/newsletter/privacy`));
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

test('new public stories appear automatically; editorial drafts stay out', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'crawlability-'));
  try {
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    const article = path.join(root, 'content/articles/liverpool/sitemap-public-fixture.md');
    fs.writeFileSync(article, '---\ntitle: Sitemap fixture\ndate: "2026-10-01"\n---\nPublic fixture.\n');
    const editorial = path.join(root, 'docs/editorial/drafts');
    fs.mkdirSync(editorial, { recursive: true });
    fs.writeFileSync(path.join(editorial, 'sitemap-private-fixture.md'), 'PRIVATE_DRAFT');
    const result = urls(getPublicSitemap(root));
    assert.ok(result.includes(`${origin}/articles/sitemap-public-fixture`));
    assert.ok(!result.some(url => /private-fixture/.test(url)));
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
