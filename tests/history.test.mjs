import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const { BiographySchema, SeriesPartSchema, SeriesDefinitionSchema } = await import('../lib/content/types.ts');
const history = await import('../lib/content/history.ts');
const { liveFrom, isLive } = await import('../lib/content/go-live.ts');
const looking = await import('../lib/content/looking-back.ts');
const { getPublicSitemap } = await import('../lib/content/sitemap.ts');

// Made-up test content (tests/fixtures/history/README.md); never read by the site.
const root = path.resolve('tests/fixtures/history');
const at = iso => new Date(iso);
const production = { VERCEL_ENV: 'production' };
const preview = { VERCEL_ENV: 'preview' };

const bio = { title: 'Billy Liddell', slug: 'billy-liddell', date: '2026-11-09', historicalPeriod: '1938–1961', decade: '1950s', excerpt: 'One line.', body: 'Body.' };
const part = { seriesSlug: 'klopps-liverpool', partNumber: 1, title: 'The Inheritance', slug: 'the-inheritance', date: '2026-11-09', excerpt: 'One line.', body: 'Body.' };

test('a complete biography parses; role is optional; unknown fields and bad values are rejected', () => {
  assert.equal(BiographySchema.parse(bio).slug, 'billy-liddell');
  assert.equal(BiographySchema.parse({ ...bio, role: 'Forward' }).role, 'Forward');
  for (const field of ['title', 'slug', 'date', 'historicalPeriod', 'decade', 'excerpt', 'body']) {
    const rest = { ...bio }; delete rest[field];
    assert.throws(() => BiographySchema.parse(rest), undefined, `missing ${field}`);
  }
  assert.throws(() => BiographySchema.parse({ ...bio, sources: ['https://example.com'] }));
  assert.throws(() => BiographySchema.parse({ ...bio, playerIds: ['billy-liddell'] }));
  assert.throws(() => BiographySchema.parse({ ...bio, decade: 'fifties' }));
  assert.throws(() => BiographySchema.parse({ ...bio, date: '9 November 2026' }));
  assert.throws(() => BiographySchema.parse({ ...bio, slug: 'Not A Slug' }));
});

test('a complete series part parses; missing fields, bad part numbers and extra fields are rejected', () => {
  assert.equal(SeriesPartSchema.parse(part).partNumber, 1);
  for (const field of ['seriesSlug', 'partNumber', 'title', 'slug', 'date', 'excerpt', 'body']) {
    const rest = { ...part }; delete rest[field];
    assert.throws(() => SeriesPartSchema.parse(rest), undefined, `missing ${field}`);
  }
  for (const partNumber of [0, -1, 1.5, '1']) assert.throws(() => SeriesPartSchema.parse({ ...part, partNumber }));
  assert.throws(() => SeriesPartSchema.parse({ ...part, sources: [] }));
  assert.throws(() => SeriesDefinitionSchema.parse({ slug: 'klopps-liverpool', title: "Klopp's Liverpool" }));
});

test('the real series list starts with Klopp\'s Liverpool, 21 parts', () => {
  const [first] = history.getSeriesDefinitions();
  assert.deepEqual(first, { slug: 'klopps-liverpool', title: "Klopp's Liverpool", totalParts: 21 });
});

test('the go-live rule is the Looking Back code, not a second copy', () => {
  assert.equal(looking.liveFrom, liveFrom);
  assert.equal(looking.isLive, isLive);
  assert.doesNotMatch(fs.readFileSync('lib/content/history.ts', 'utf8'), /getLondonToday|setUTCDate/);
  // A Monday piece is live from that midnight; a Sunday piece waits for the Monday before.
  assert.equal(liveFrom({ date: '2026-11-09' }), '2026-11-09');
  assert.equal(liveFrom({ date: '2026-11-15' }), '2026-11-09');
  assert.equal(isLive({ date: '2026-11-15' }, at('2026-11-08T23:59:59Z')), false);
  assert.equal(isLive({ date: '2026-11-15' }, at('2026-11-09T00:00:00Z')), true);
});

test('biographies: live ones show, future ones are hidden on production and flagged elsewhere, and stay live', () => {
  const now = at('2026-06-01T12:00:00Z');
  assert.deepEqual(history.getVisibleBiographies(now, production, root).map(b => b.slug), ['test-person-two', 'test-person-one', 'test-person-three']);
  const flagged = history.getVisibleBiographies(now, preview, root);
  assert.equal(flagged.find(b => b.slug === 'test-person-future').scheduled, true);
  assert.equal(flagged.find(b => b.slug === 'test-person-future').liveFrom, '2099-01-05');
  assert.equal(history.getVisibleBiography('test-person-future', now, production, root), undefined);
  assert.ok(history.getVisibleBiography('test-person-one', at('2035-01-01T00:00:00Z'), production, root));
  assert.ok(!history.getLiveBiographies(now, root).some(b => b.slug === 'test-person-future'));
});

test('biographies group by decade, oldest first, ordered by first year; the dateline uses role and years', () => {
  const groups = history.groupByDecade(history.getVisibleBiographies(at('2026-06-01T12:00:00Z'), production, root));
  assert.deepEqual(groups.map(g => [g.decade, g.entries.map(e => e.slug)]), [['1950s', ['test-person-two', 'test-person-one']], ['1970s', ['test-person-three']]]);
  assert.equal(history.biographyDateline({ historicalPeriod: '1958–1966', role: 'Forward' }), 'Forward · 1958–1966');
  assert.equal(history.biographyDateline({ historicalPeriod: '1952–1960' }), '1952–1960');
});

test('series: parts in order, future parts hidden, neighbours skip hidden parts', () => {
  const monday = at('2026-01-05T12:00:00Z');
  let series = history.getVisibleSeriesBySlug('test-series', monday, production, root);
  assert.deepEqual(series.parts.map(p => p.partNumber), [1]);
  assert.equal(series.totalParts, 3);
  const later = at('2026-06-01T12:00:00Z');
  series = history.getVisibleSeriesBySlug('test-series', later, production, root);
  assert.deepEqual(series.parts.map(p => p.partNumber), [1, 2]);
  const second = history.getVisibleSeriesPart('test-series', 'test-part-two', later, production, root);
  assert.equal(second.previous.slug, 'test-part-one');
  assert.equal(second.next, undefined);
  assert.equal(history.getVisibleSeriesPart('test-series', 'test-part-three', later, production, root), undefined);
  assert.equal(history.getVisibleSeriesPart('test-series', 'test-part-three', later, preview, root).part.scheduled, true);
  // A series with no live part is not listed on production.
  assert.deepEqual(history.getVisibleSeries(at('2025-01-01T00:00:00Z'), production, root), []);
});

test('bad files fail the build: slug/filename, duplicate part, unknown series, part past the total, wrong folder', () => {
  const copy = fs.mkdtempSync(path.join(os.tmpdir(), 'history-'));
  try {
    fs.cpSync(root, copy, { recursive: true });
    const dir = path.join(copy, 'content/series/test-series');
    const write = (file, data) => fs.writeFileSync(path.join(dir, file), `---\n${Object.entries(data).map(([k, v]) => `${k}: ${typeof v === 'number' ? v : `"${v}"`}`).join('\n')}\n---\nBody.\n`);
    const base = { seriesSlug: 'test-series', partNumber: 1, title: 'T', date: '2026-01-05', excerpt: 'E' };
    write('dup.md', { ...base, slug: 'dup' });
    assert.throws(() => history.getSeriesParts(copy), /Duplicate part 1/);
    fs.rmSync(path.join(dir, 'dup.md'));
    write('past.md', { ...base, slug: 'past', partNumber: 4 });
    assert.throws(() => history.getSeriesParts(copy), /has 3 parts/);
    fs.rmSync(path.join(dir, 'past.md'));
    write('mismatch.md', { ...base, slug: 'other', partNumber: 9 });
    assert.throws(() => history.getSeriesParts(copy), /must match filename/);
    fs.rmSync(path.join(dir, 'mismatch.md'));
    write('lost.md', { ...base, slug: 'lost', seriesSlug: 'nope', partNumber: 2 });
    assert.throws(() => history.getSeriesParts(copy), /has seriesSlug "nope"/);
    fs.rmSync(path.join(dir, 'lost.md'));
    fs.mkdirSync(path.join(copy, 'content/series/nope'));
    fs.renameSync(path.join(dir, 'test-part-one.md'), path.join(copy, 'content/series/nope/test-part-one.md'));
    assert.throws(() => history.getSeriesParts(copy), /unknown series|sits in the/);
  } finally { fs.rmSync(copy, { recursive: true, force: true }); }
});

test('the sitemap lists History pages and only live pieces', () => {
  const urls = getPublicSitemap(root, {}).map(e => e.url);
  for (const route of ['/history', '/history/biographies', '/history/series']) assert.ok(urls.some(u => u.endsWith(route)), route);
  assert.ok(urls.some(u => u.endsWith('/history/biographies/test-person-one')));
  assert.ok(!urls.some(u => u.includes('test-person-future')));
  assert.ok(urls.some(u => u.endsWith('/history/series/test-series/test-part-two')));
  assert.ok(!urls.some(u => u.includes('test-part-three')));
});

test('History pages revalidate hourly, render dated pieces on request, and the real content folders are free of test data', () => {
  for (const file of ['app/history/biographies/[slug]/page.tsx', 'app/history/series/[series]/page.tsx', 'app/history/series/[series]/[slug]/page.tsx']) {
    const source = fs.readFileSync(file, 'utf8');
    assert.match(source, /export const dynamicParams = true/, file);
    assert.match(source, /export const revalidate = 3600/, file);
  }
  for (const file of ['app/history/biographies/page.tsx', 'app/history/series/page.tsx']) assert.match(fs.readFileSync(file, 'utf8'), /export const revalidate = 3600/, file);
  for (const dir of ['content/biographies', 'content/series']) {
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir, { recursive: true })) {
      if (!String(entry).endsWith('.md')) continue;
      assert.doesNotMatch(fs.readFileSync(path.join(dir, String(entry)), 'utf8'), /\[TEST\]|TEST CONTENT/, entry);
    }
  }
});

test('History pages share one header and use plain body text, with no newspaper styling', () => {
  const css = fs.readFileSync('app/history/history.css', 'utf8');
  assert.doesNotMatch(css, /column-count|first-letter|--paper/);
  for (const file of ['app/history/page.tsx', 'app/history/biographies/page.tsx', 'app/history/biographies/[slug]/page.tsx', 'app/history/series/page.tsx', 'app/history/series/[series]/page.tsx', 'app/history/series/[series]/[slug]/page.tsx']) {
    assert.match(fs.readFileSync(file, 'utf8'), /HistoryHeader/, file);
  }
  const header = fs.readFileSync('app/components/SiteHeader.tsx', 'utf8');
  assert.ok(header.indexOf('"History"') < header.indexOf('"Looking Back"') && header.indexOf('"Football Observed"') < header.indexOf('"History"'));
});
