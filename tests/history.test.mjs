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
const HISTORY_ARTICLE_PAGES = ['app/looking-back/[slug]/page.tsx', 'app/looking-back/biographies/[slug]/page.tsx', 'app/looking-back/series/[series]/[slug]/page.tsx', 'app/archive/[slug]/page.tsx'];
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

test('the real series list starts with Klopp\'s Liverpool, 13 parts, and every "Part N of X" label reads that total', () => {
  const [first] = history.getSeriesDefinitions();
  assert.deepEqual(first, { slug: 'klopps-liverpool', title: "Klopp's Liverpool", totalParts: 13 });
  for (const file of ['app/looking-back/page.tsx', 'app/looking-back/series/[series]/page.tsx', 'app/looking-back/series/[series]/[slug]/page.tsx', 'app/components/HistoryLatest.tsx', 'lib/content/history.ts']) {
    assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /\b(of|in) (13|21)\b/, `${file} must not hard-code the series length`);
  }
  assert.equal(history.getVisibleSeries(at('2026-11-06T12:00:00Z'), {})[0].totalParts, 13);
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
  for (const route of ['/looking-back', '/looking-back/on-this-day', '/looking-back/on-this-day/previous', '/looking-back/biographies', '/looking-back/series', '/looking-back/features']) assert.ok(urls.some(u => u.endsWith(route)), route);
  assert.ok(!urls.some(u => new URL(u).pathname.startsWith('/history')));
  assert.ok(urls.some(u => u.endsWith('/looking-back/biographies/test-person-one')));
  assert.ok(!urls.some(u => u.includes('test-person-future')));
  assert.ok(urls.some(u => u.endsWith('/looking-back/series/test-series/test-part-two')));
  assert.ok(!urls.some(u => u.includes('test-part-three')));
});

test('History pages revalidate hourly, render dated pieces on request, and the real content folders are free of test data', () => {
  for (const file of ['app/looking-back/biographies/[slug]/page.tsx', 'app/looking-back/series/[series]/page.tsx', 'app/looking-back/series/[series]/[slug]/page.tsx']) {
    const source = fs.readFileSync(file, 'utf8');
    assert.match(source, /export const dynamicParams = true/, file);
    assert.match(source, /export const revalidate = 3600/, file);
  }
  for (const file of ['app/looking-back/biographies/page.tsx', 'app/looking-back/series/page.tsx']) assert.match(fs.readFileSync(file, 'utf8'), /export const revalidate = 3600/, file);
  for (const dir of ['content/biographies', 'content/series']) {
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir, { recursive: true })) {
      if (!String(entry).endsWith('.md')) continue;
      assert.doesNotMatch(fs.readFileSync(path.join(dir, String(entry)), 'utf8'), /\[TEST\]|TEST CONTENT/, entry);
    }
  }
});

test('Looking Back index pages share one header with plain list styling, and Looking Back is active on every page', () => {
  const css = fs.readFileSync('app/looking-back/history.css', 'utf8');
  assert.doesNotMatch(css, /column-count|first-letter|--paper/);
  const indexPages = ['app/looking-back/on-this-day/page.tsx', 'app/looking-back/on-this-day/previous/page.tsx', 'app/looking-back/features/page.tsx', 'app/looking-back/biographies/page.tsx', 'app/looking-back/series/page.tsx', 'app/looking-back/series/[series]/page.tsx'];
  for (const file of indexPages) assert.match(fs.readFileSync(file, 'utf8'), /HistoryHeader/, file);
  for (const file of ['app/looking-back/page.tsx', ...indexPages, ...HISTORY_ARTICLE_PAGES.slice(0, 3)]) assert.match(fs.readFileSync(file, 'utf8'), /<SiteHeader active="looking-back" \/>/, file);
  const header = fs.readFileSync('app/components/SiteHeader.tsx', 'utf8');
  assert.ok(header.indexOf('"Football Observed"') < header.indexOf('"Looking Back"'));
  assert.doesNotMatch(header, /"History"/);
});

test('no reader-facing label says History in the Looking Back pages, homepage block or Articles filter', () => {
  for (const file of ['app/looking-back/page.tsx', 'app/components/HistoryLatest.tsx', 'app/components/HistoryHeader.tsx', 'app/components/ArticlesNavigation.tsx', 'app/looking-back/on-this-day/page.tsx', 'app/looking-back/on-this-day/previous/page.tsx', 'app/looking-back/features/page.tsx']) {
    const text = fs.readFileSync(file, 'utf8').replace(/\/\/.*$|\/\*[\s\S]*?\*\/|^import .*$|History(Header|Latest)|getLatestHistory/gm, '');
    assert.doesNotMatch(text, /History/, file);
  }
});

test('the hub has rows counted from live content: series and parts, the current week, and lives', () => {
  const now = at('2026-11-07T12:00:00Z');
  const hub = history.getLookingBackHub(now);
  assert.deepEqual(Object.keys(hub).sort(), ['biographies', 'matchRevisited', 'onThisDay', 'seasons', 'series']);
  assert.equal(hub.series.count, 1);
  assert.equal(hub.series.parts, history.getLiveSeriesParts(now).length);
  assert.equal(hub.biographies, history.getLiveBiographies(now).length);
  assert.deepEqual(hub.onThisDay, { monday: '2026-11-02', sunday: '2026-11-08' });
  // The red dot: a part published in the last 7 days, and not once a week has passed.
  assert.equal(hub.series.newThisWeek, true);
  assert.equal(history.getLookingBackHub(at('2026-11-20T12:00:00Z')).series.newThisWeek, false);
  const page = fs.readFileSync('app/looking-back/page.tsx', 'utf8');
  for (const gone of ['Features', 'Latest', 'lbh-new', 'lbh-contents-text']) assert.doesNotMatch(page, new RegExp(gone));
  assert.match(page, /"On This Day"/);
  assert.doesNotMatch(page, /Keepsake/);
});

test('On This Day shows only the current Monday–Sunday week (UK time), in date order; earlier weeks go to Previous weeks', () => {
  const pieces = [
    { slug: 'b', date: '2026-11-08' }, { slug: 'a', date: '2026-11-02' }, { slug: 'old', date: '2026-10-28' },
    { slug: 'older', date: '2026-10-20' }, { slug: 'next', date: '2026-11-09' },
  ];
  // 23:30 on Sunday 8 November in London is still that week; 00:30 on Monday is the next.
  const split = looking.splitOnThisDay(pieces, at('2026-11-08T23:30:00Z'));
  assert.deepEqual(split.thisWeek.map(p => p.slug), ['a', 'b']);
  assert.equal(split.week.range, '2–8 November');
  assert.deepEqual(split.previousWeeks.map(w => [w.sunday, w.pieces.map(p => p.slug)]), [['2026-11-01', ['old']], ['2026-10-25', ['older']]]);
  assert.deepEqual(split.upcoming.map(p => p.slug), ['next']);
  assert.deepEqual(looking.splitOnThisDay(pieces, at('2026-11-09T00:30:00Z')).thisWeek.map(p => p.slug), ['next']);
  assert.equal(looking.formatWeekRange('2026-11-30', '2026-12-06'), '30 November – 6 December');
});

test('Keepsakes is now On This Day: the old list URL redirects permanently and no page says Keepsakes', () => {
  const config = fs.readFileSync('next.config.ts', 'utf8');
  assert.match(config, /source: "\/looking-back\/keepsakes", destination: "\/looking-back\/on-this-day", statusCode: 301/);
  assert.equal(fs.existsSync('app/looking-back/keepsakes'), false);
  for (const file of ['app/looking-back/page.tsx', 'app/looking-back/[slug]/page.tsx', 'app/looking-back/on-this-day/page.tsx', 'app/looking-back/on-this-day/previous/page.tsx', 'app/components/HistoryLatest.tsx']) {
    assert.doesNotMatch(fs.readFileSync(file, 'utf8'), />[^<]*Keepsake|"[^"]*Keepsake/, file);
  }
});

test('keepsake slugs cannot take a Looking Back section name', () => {
  const copy = fs.mkdtempSync(path.join(os.tmpdir(), 'lb-reserved-'));
  try {
    fs.mkdirSync(path.join(copy, 'content/looking-back'), { recursive: true });
    fs.writeFileSync(path.join(copy, 'content/looking-back/series.md'), '---\ntitle: "T"\nslug: "series"\ndate: "2026-11-02"\neventDate: "1970-11-02"\ndateline: "D"\nexcerpt: "E."\n---\nBody.\n');
    assert.throws(() => looking.getLookingBack(copy), /reserved/);
  } finally { fs.rmSync(copy, { recursive: true, force: true }); }
});

test('latest History: newest live biography and series part only, never a future one, and shown on the homepage and hub', () => {
  const now = at('2026-06-01T12:00:00Z');
  const latest = history.getLatestHistory(now, root);
  assert.deepEqual(latest.map(i => i.kind).sort(), ['Biography', 'Series']);
  assert.equal(latest.find(i => i.kind === 'Series').href, '/looking-back/series/test-series/test-part-two');
  assert.match(latest.find(i => i.kind === 'Biography').href, /^\/looking-back\/biographies\/test-person-(one|two|three)$/);
  assert.ok(latest.find(i => i.kind === 'Series').label.endsWith('Part 2 of 3'));
  assert.ok(!latest.some(i => i.href.includes('future') || i.href.includes('part-three')));
  assert.deepEqual(history.getLatestHistory(at('2020-01-01T00:00:00Z'), root), []);
  assert.match(fs.readFileSync('app/page.tsx', 'utf8'), /<HistoryLatest \/>/);
  assert.match(fs.readFileSync('app/components/HistoryLatest.tsx', 'utf8'), /From Looking Back/);
});

test('every Looking Back piece uses the one shared history article template; current-day articles and Football Observed never do', () => {
  for (const file of HISTORY_ARTICLE_PAGES) {
    const source = fs.readFileSync(file, 'utf8');
    assert.match(source, /<HistoryArticle\b/, file);
    assert.doesNotMatch(source, /history-article\.css|\.ha-/, `${file} must not style the template itself`);
  }
  // Only factual Archive pieces (Features) take the template; opinion pieces keep the modern layout.
  assert.match(fs.readFileSync('app/archive/[slug]/page.tsx', 'utf8'), /if \(feature\.editorialMode === "factual"\) \{\s*return <>\s*<SiteHeader active="looking-back" \/>\s*<HistoryArticle/);
  for (const file of ['app/articles/[slug]/page.tsx', 'app/regan-on-football/page.tsx', 'app/page.tsx', 'app/looking-back/page.tsx']) {
    assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /HistoryArticle|history-article/, file);
  }
  const css = fs.readFileSync('app/components/history-article.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.match(css, /oldstyle-nums/);
  assert.match(css, /hyphens: manual/);
  assert.equal((css.match(/::first-letter/g) ?? []).length, 2, 'one drop cap rule plus its initial-letter refinement');
  assert.doesNotMatch(css, /text-align: justify|blackletter|UnifrakturMaguntia|gothic/i);
  assert.match(css, /var\(--lb-head\)/);
});

test('Looking Back pages use The Back Pages typefaces (no blackletter), loaded only for Looking Back', () => {
  const fonts = fs.readFileSync('app/components/history-fonts.ts', 'utf8').replace(/\/\/.*$/gm, '');
  for (const face of ['IM_Fell_English', 'IM_Fell_English_SC', 'Old_Standard_TT']) assert.match(fonts, new RegExp(`\\b${face}\\b`));
  assert.doesNotMatch(fonts, /Unifraktur|Blackletter|Gothic/i);
  assert.match(fs.readFileSync('app/looking-back/layout.tsx', 'utf8'), /historyFonts/);
  assert.match(fs.readFileSync('app/components/HistoryArticle.tsx', 'utf8'), /historyFonts/);
  assert.doesNotMatch(fs.readFileSync('app/layout.tsx', 'utf8'), /Fell|Old_Standard/);
  const index = fs.readFileSync('app/looking-back/history.css', 'utf8');
  for (const rule of ['.history-list h3', '.history-index .history-headline']) assert.match(index, new RegExp(`${rule.replace(/[.]/g, '\\.')} \\{[^}]*var\\(--lb-head\\)`), rule);
});

test('history article kickers and read times come from existing frontmatter', async () => {
  const helpers = await import('../lib/content/history-article.ts');
  assert.equal(helpers.onThisDayKicker({ dateline: 'Anfield · Tuesday 7 November 1967 · Inter-Cities Fairs Cup, second round, first leg', eventDate: '1967-11-07' }), 'Inter-Cities Fairs Cup · 1967');
  assert.equal(helpers.onThisDayKicker({ dateline: 'Anfield · Saturday 15 November 1969', eventDate: '1969-11-15' }), undefined);
  for (const piece of looking.getLookingBack()) assert.ok(helpers.onThisDayKicker(piece), `${piece.slug} has no competition in its dateline`);
  assert.equal(helpers.formatDayMonthYear('1967-11-07'), '7 November 1967');
  assert.equal(helpers.readMinutes('word '.repeat(450)), 2);
  assert.equal(helpers.readMinutes('one'), 1);
});

test('every Looking Back page, index pages included, sits on cream paper; modern pages do not', () => {
  const paper = /body:has\(\.ha-page\), body:has\(\.lb-fonts\) \{\s*background-color: #f4ecda;/;
  assert.match(fs.readFileSync('app/looking-back/history.css', 'utf8'), paper);
  assert.match(fs.readFileSync('app/components/history-article.css', 'utf8'), paper);
  for (const file of ['app/globals.css', 'app/editorial.css']) assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /#f4ecda/, file);
});
