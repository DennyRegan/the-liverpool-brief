import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getHistoryLibrary, historySearchDocuments, searchHistory, eventsOnDate, londonDate, validDate, shiftDate, newsletterDiscovery, seriesNeighbours, availableEntities, relatedReading } from '../lib/content/history-library.ts';
import { loadHistoryPrototype } from '../lib/content/history-prototype.ts';
import { getPublicSitemap } from '../lib/content/sitemap.ts';
const localTest = (name, fn) => test(name, { skip: !fs.existsSync('prototype/history/1987-88.json') && 'Local editorial pack not installed' }, fn);
const forest = 'liverpool-nottingham-forest-1988-five-at-anfield';
function fixture(run) {
 const root = fs.mkdtempSync(path.join(os.tmpdir(), 'connected-history-'));
 fs.cpSync('content', path.join(root, 'content'), { recursive: true });
 try { return run(root); } finally { fs.rmSync(root, { recursive: true, force: true }); }
}
function chapter(root, name, part, extra = '') {
 fs.writeFileSync(path.join(root, 'content/articles/liverpool', `${name}.md`), `---\ntitle: ${name}\ndate: '2026-10-25'\ncategory: Opinion\nseries: klopps-liverpool\npart: ${part}\nmanagerIds: [jurgen-klopp]\n${extra}---\nAn approved fixture chapter.\n`);
}
test('published directory and factual decisions govern browsing, search and recommendations', () => fixture(root => {
 const drafts = path.join(root, 'docs/editorial/drafts'); fs.mkdirSync(drafts, { recursive: true });
 fs.writeFileSync(path.join(drafts, 'private.md'), 'Synthetic unpublished text: nicol-hat-trick.');
 const library = getHistoryLibrary(root);
 assert.equal(library.articles.length, 2);
 assert.ok(library.articles.every(a => a.editorialMode === 'factual'));
 assert.equal(historySearchDocuments(library).some(d => /nicol-hat-trick/.test(d.href)), false);
 assert.ok(searchHistory(library, 'John Barnes').some(d => d.href === `/archive/${forest}`));
 for (const query of ['1987–88', 'Nottingham Forest', 'First Division', 'Aldridge']) assert.ok(searchHistory(library, query).some(d => d.href === `/archive/${forest}`));
 assert.equal(searchHistory(library, 'unfindable-xyz').length, 0);
 const current = library.articles.find(a => a.slug === forest);
 assert.ok(relatedReading(current, library).every(r => r.article.slug !== forest));
 assert.ok(relatedReading(current, library).length <= 3);
}));
localTest('local review season adds relationships without leaking into search, anniversaries, newsletter or sitemap', () => {
 const library = getHistoryLibrary(process.cwd(), loadHistoryPrototype().season);
 assert.equal(library.seasons[0].review, true);
 assert.ok(availableEntities(library).some(e => e.id === 'bruce-grobbelaar'));
 assert.equal(historySearchDocuments(library).some(d => d.href === '/history/seasons/1987-88'), false);
 assert.equal(newsletterDiscovery(library, '2026-04-19').seasons.length, 0);
 assert.ok(getPublicSitemap().some(e => e.url.endsWith('/history/seasons/1987-88'))); // The public match-only collection exists; the rich review record remains private.
 assert.ok(!getPublicSitemap().some(e => e.url.endsWith('/history/seasons/1986-87')));
 assert.equal(library.articles.length, 2);
});
test('On This Day uses verified event dates, not publication dates, and respects leap/year boundaries', () => {
 const library = getHistoryLibrary();
 assert.equal(eventsOnDate(library.events, '2026-04-13')[0].date, '1988-04-13');
 assert.equal(eventsOnDate(library.events, '2026-09-15').length, 0);
 assert.equal(eventsOnDate(library.events, '1987-04-13').length, 0);
 assert.equal(validDate('2026-02-29'), false);
 assert.equal(validDate('2028-02-29'), true);
 assert.equal(validDate('2026-04-31'), false);
 const leap = [{ ...library.events[0], date: '2000-02-29' }];
 assert.equal(eventsOnDate(leap, '2028-02-29').length, 1);
 assert.equal(eventsOnDate(leap, '2027-02-28').length, 0);
 assert.equal(shiftDate('2026-01-01', -1), '2025-12-31');
 assert.equal(londonDate(new Date('2026-06-01T23:30:00Z')), '2026-06-02');
 const selection = newsletterDiscovery(library, '2026-04-19');
 assert.equal(selection.start, '2026-04-13'); assert.equal(selection.anniversaries.length, 1);
 assert.equal(newsletterDiscovery(library, '2026-04-20').anniversaries.length, 0);
});
test('withdrawing verified material removes event, search and recommendations; date/source drift fails validation', () => fixture(root => {
 const filename = path.join(root, 'content/archive/liverpool', `${forest}.md`);
 const original = fs.readFileSync(filename, 'utf8');
 fs.writeFileSync(filename, original.replace("historicalEventDate: '1988-04-13'", "historicalEventDate: '1988-04-14'"));
 assert.throws(() => getHistoryLibrary(root), /Event date drift/);
 fs.writeFileSync(filename, original.replace('https://www.lfchistory.net/games/1632', 'https://example.com/replaced'));
 assert.throws(() => getHistoryLibrary(root), /Unrecorded event source/);
 fs.unlinkSync(filename);
 const library = getHistoryLibrary(root); assert.equal(library.events.length, 0);
 assert.ok(!historySearchDocuments(library).some(d => d.href.includes(forest)));
}));
test('series derives chapter availability and navigation from normal canonical articles, skipping unavailable parts', () => fixture(root => {
 chapter(root, 'chapter-three-fixture', 3); chapter(root, 'chapter-one-fixture', 1);
 const library = getHistoryLibrary(root); const series = library.series[0];
 assert.deepEqual(series.articles.map(a => a.part), [1, 3]);
 assert.equal(seriesNeighbours(series, '/articles/chapter-one-fixture').next.href, '/articles/chapter-three-fixture');
 assert.equal(seriesNeighbours(series, '/articles/chapter-one-fixture').previous, undefined);
 assert.equal(seriesNeighbours(series, '/articles/chapter-three-fixture').next, undefined);
 assert.equal(searchHistory(library, 'Jurgen Klopp').filter(d => d.type === 'Article').length, 2);
 assert.equal(newsletterDiscovery(library, '2026-10-29').chapters.length, 2);
 chapter(root, 'duplicate-fixture', 3);
 assert.throws(() => getHistoryLibrary(root), /Invalid published chapter order/);
}));
test('series metadata rejects unknown series, missing parts and mismatched identity', () => fixture(root => {
 chapter(root, 'bad-fixture', 22); assert.throws(() => getHistoryLibrary(root), /Invalid published chapter order/);
 fs.unlinkSync(path.join(root, 'content/articles/liverpool/bad-fixture.md'));
 const file = path.join(root, 'content/history/liverpool/series/klopps-liverpool.json');
 const series = JSON.parse(fs.readFileSync(file)); series.personIds = ['imagined-manager']; fs.writeFileSync(file, JSON.stringify(series));
 assert.throws(() => getHistoryLibrary(root), /Unknown series person/);
}));
localTest('approved season records create season and sourced event discovery; unknown identities fail closed', () => fixture(root => {
 const record = structuredClone(loadHistoryPrototype().season); record.relatedSeasons = [];
 record.events = [{ id: 'fixture-event', date: '1988-04-23', title: 'Fixture event', detail: 'Test only', sourceIds: ['lfch-games'], personIds: ['peter-beardsley'] }];
 const directory = path.join(root, 'content/history/liverpool/seasons'); fs.mkdirSync(directory, { recursive: true });
 const file = path.join(directory, '1987-88.json'); fs.writeFileSync(file, JSON.stringify(record));
 let library = getHistoryLibrary(root); assert.equal(library.seasons[0].review, false);
 assert.ok(searchHistory(library, '1987–88').some(d => d.type === 'Season'));
 assert.ok(eventsOnDate(library.events, '2026-04-23').some(e => e.id === '1987-88-fixture-event'));
 record.events[0].personIds = ['invented-person']; fs.writeFileSync(file, JSON.stringify(record));
 assert.throws(() => getHistoryLibrary(root), /unknown person/);
}));
test('new approved biography strengthens person, season and reading collections without reverse lists', () => fixture(root => {
 const text = fs.readFileSync(path.join(root, 'content/archive/liverpool', `${forest}.md`), 'utf8')
  .replace(`slug: ${forest}`, 'slug: biography-fixture')
  .replace('category: match', 'category: person').replace('articleType: match', 'articleType: player');
 fs.writeFileSync(path.join(root, 'content/archive/liverpool/biography-fixture.md'), text);
 const library = getHistoryLibrary(root);
 const biography = library.articles.find(a => a.slug === 'biography-fixture');
 assert.equal(biography.articleType, 'player');
 assert.ok(newsletterDiscovery(library, '2026-10-29').biographies.some(a => a === biography));
 assert.ok(relatedReading(biography, library).some(r => r.article.slug === forest));
 assert.ok(searchHistory(library, 'John Barnes').some(d => d.href === '/archive/biography-fixture'));
 assert.equal(library.events.some(e => e.id === 'article-biography-fixture'), false);
}));
