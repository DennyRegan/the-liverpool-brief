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
const { getLiveLookingBack } = await import('../lib/content/looking-back.ts');
const { getLiveBiographies, getLiveMatchRevisited, getLiveSeriesParts } = await import('../lib/content/history.ts');
const { getPlayerPageSlugs } = await import('../lib/content/players.ts');
const { socialMetadata } = await import('../lib/social-metadata.ts');

const origin = 'https://theliverpoolbrief.com';
const urls = entries => entries.map(entry => entry.url);
const newsletter = { SENDER_PUBLIC_ACCOUNT_ID: 'abc123', SENDER_NEWSLETTER_FORM_ID: 'form1', SENDER_NEWSLETTER_FORM_URL: 'https://stats.sender.net/forms/form1/view' };

test('sitemap lists only the public pages and retained articles', () => {
  const entries = sitemap();
  const expected = [
    '/', '/about', '/articles', '/regan-on-football', '/matchday', '/looking-back', '/looking-back/on-this-day', '/looking-back/on-this-day/previous', '/looking-back/biographies', '/looking-back/series', '/looking-back/match-revisited', '/looking-back/features', '/looking-back/timeline', '/calls',
    ...(getNewsletterConfig() ? ['/newsletter', '/newsletter/privacy'] : []),
    ...getArticles().map(a => `/articles/${a.slug}`),
    ...getArchiveFeatures().map(a => `/archive/${a.slug}`),
    ...getLiveLookingBack().map(p => `/looking-back/${p.slug}`),
    ...getLiveBiographies().map(b => `/looking-back/biographies/${b.slug}`),
    ...getLiveMatchRevisited().map(m => `/looking-back/match-revisited/${m.slug}`),
    ...[...new Set(getLiveSeriesParts().map(p => p.seriesSlug))].map(slug => `/looking-back/series/${slug}`),
    ...getLiveSeriesParts().map(p => `/looking-back/series/${p.seriesSlug}/${p.slug}`),
    ...getPlayerPageSlugs().map(slug => `/players/${slug}`),
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
    assert.doesNotMatch(url.pathname, /^\/(preview|docs|content|brief|history|this-week|match-centre|search)(\/|$)/);
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

test('the old History section stays removed, the History hub lives in Looking Back, and old URLs redirect', async () => {
  for (const dir of ['app/history', 'app/this-week', 'app/search', 'content/history', 'content/this-week']) assert.equal(fs.existsSync(dir), false, `${dir} must not return`);
  assert.doesNotMatch(fs.readFileSync('app/components/SiteHeader.tsx', 'utf8'), /"History"|"\/history"/);
  const { default: config } = await import('../next.config.ts');
  const redirects = await config.redirects();
  for (const source of ['/this-week', '/search', '/history/matches', '/history/seasons/:path*', '/history/people/:path*', '/history/explore', '/history/on-this-day']) {
    assert.ok(redirects.some(r => r.source === source && r.destination === '/' && r.permanent), `${source} redirects home`);
  }
  // The 5 November hub moved into Looking Back: 301s to the equivalent page.
  const moved = {
    '/history': '/looking-back', '/history/biographies': '/looking-back/biographies', '/history/biographies/:slug': '/looking-back/biographies/:slug',
    '/history/series': '/looking-back/series', '/history/series/:series': '/looking-back/series/:series', '/history/series/:series/:slug': '/looking-back/series/:series/:slug',
    '/history/:path*': '/looking-back',
  };
  for (const [source, destination] of Object.entries(moved)) {
    assert.ok(redirects.some(r => r.source === source && r.destination === destination && r.statusCode === 301), `${source} → ${destination}`);
  }
  // Specific rules come before the catch-all, and the removed sections still go home.
  const index = source => redirects.findIndex(r => r.source === source);
  assert.ok(index('/history/series/:series/:slug') < index('/history/:path*') && index('/history/matches') < index('/history/:path*'));
  for (const workflow of fs.existsSync('.github/workflows') ? fs.readdirSync('.github/workflows') : []) assert.doesNotMatch(workflow, /histor|biograph/i, 'no History publisher workflow');
});

