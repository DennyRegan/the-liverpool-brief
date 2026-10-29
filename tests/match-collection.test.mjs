import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getMatchCollection, matchSeasons, paginate, seasonMatchHref, readMatchManifest, matchDecade, matchFixture, getFeaturedMatches } from '../lib/content/match-collection.ts';
import { getHistoryLibrary, historySearchDocuments, newsletterDiscovery } from '../lib/content/history-library.ts';
import { getPublicSitemap } from '../lib/content/sitemap.ts';
import { getWriting } from '../lib/content/writing.ts';
const localTest = (name, fn) => test(name, { skip: !fs.existsSync('prototype/match-review/manifest.json') && 'Local editorial pack not installed' }, fn);

localTest('the complete local collection preserves 560 canonical reports and distinguishes approval states', () => {
 const matches = getMatchCollection(process.cwd(), true);
 assert.equal(matches.length, 560);
 assert.equal(new Set(matches.map(a => a.href)).size, 560);
 assert.equal(matches.filter(a => a.publication === 'published').length, 2);
 assert.equal(matches.filter(a => a.publication === 'withdrawn').length, 224);
 assert.equal(matches.filter(a => a.publication === 'draft').length, 334);
 assert.equal(matchSeasons(matches).length, 58);
 assert.equal(matches.filter(a => a.season === '1987-88').length, 12);
 assert.ok(matches.every(a => a.href === `/archive/${a.slug}`));
 assert.ok(!matches.some(a => a.season === '2026-27' || a.slug === 'liverpool-7-tottenham-0'));
});
test('normal public loading never reads the private manifest or requires staged manuscripts', () => {
 const root = fs.mkdtempSync(path.join(os.tmpdir(), 'public-matches-'));
 try { fs.cpSync('content', path.join(root, 'content'), { recursive: true });
  assert.equal(getMatchCollection(root).length, 2);
  assert.equal(matchSeasons(getMatchCollection(root)).length, 2);
 } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
localTest('review manuscripts cannot leak into public search, newsletter, sitemap or latest writing', () => {
 const manifest = readMatchManifest();
 const privateSlugs = new Set(manifest.reports.filter(r => r.included && r.status !== 'published').map(r => r.slug));
 getMatchCollection(process.cwd(), true);
 const library = getHistoryLibrary();
 for (const doc of historySearchDocuments(library)) assert.ok(!privateSlugs.has(doc.href.split('/').pop()));
 for (const item of newsletterDiscovery(library, '2026-10-29').matches) assert.ok(!privateSlugs.has(item.slug));
 for (const item of getPublicSitemap()) assert.ok(!privateSlugs.has(new URL(item.url).pathname.split('/').pop()));
 for (const item of getWriting()) assert.ok(!privateSlugs.has(item.slug));
 assert.ok(!getPublicSitemap().some(e => e.url.endsWith('/history/seasons/2015-16')));
});
localTest('all season reports remain reachable with bounded pages and accurate return fragments', () => {
 const matches = getMatchCollection(process.cwd(), true);
 for (const { season } of matchSeasons(matches)) {
  const reports = matches.filter(a => a.season === season); const found = [];
  const pages = paginate(reports).pages;
  for (let i = 1; i <= pages; i++) { const part = paginate(reports, String(i)); assert.ok(part.items.length <= 12); found.push(...part.items.map(a => a.slug)); }
  assert.deepEqual(found, reports.map(a => a.slug));
  for (const article of reports) { const url = new URL(seasonMatchHref(article, matches), 'http://localhost'); assert.equal(url.pathname, `/history/seasons/${season}`); assert.ok(paginate(reports, url.searchParams.get('page')).items.some(a => `#article-${a.slug}` === url.hash)); }
 }
 assert.equal(paginate(matches, '-4').page, 1); assert.equal(paginate(matches, 'NaN').page, 1);
 assert.equal(paginate(matches, '999999').page, paginate(matches).pages);
});
localTest('draft publication dates stay missing rather than borrowing match dates', () => {
 const drafts = getMatchCollection(process.cwd(), true).filter(a => a.publication === 'draft');
 assert.ok(drafts.some(a => !a.date));
 assert.ok(drafts.filter(a => !a.date).every(a => a.historicalEventDate));
});
localTest('evidence is invalidated if a preserved manuscript changes', () => {
 const root = fs.mkdtempSync(path.join(os.tmpdir(), 'review-hash-'));
 try { fs.cpSync('content', path.join(root, 'content'), { recursive: true });
  const manifest = readMatchManifest(); const entry = manifest.reports.find(r => r.status === 'withdrawn' && r.included);
  manifest.reports = [entry];
  fs.mkdirSync(path.join(root, 'prototype/match-review'), { recursive: true });
  fs.writeFileSync(path.join(root, 'prototype/match-review/manifest.json'), JSON.stringify(manifest));
  const file = path.join(root, entry.localPath); fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, fs.readFileSync(entry.localPath, 'utf8') + '\nChanged claim.\n');
  assert.throws(() => getMatchCollection(root, true), /Review evidence is stale/);
 } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

localTest('match discovery uses event decades and explicit fixture wording without guessing results', () => {
 const all = getMatchCollection(process.cwd(), true);
 const derby = all.find(a => a.slug === 'liverpool-everton-1990-barnes-beardsley-derby-double');
 assert.equal(derby.season, '1989-90'); assert.equal(matchDecade(derby), '1990');
 assert.equal(matchFixture(derby, new Map([['everton', 'Everton']])), 'Liverpool against Everton');
 const forest = all.find(a => a.slug === 'liverpool-nottingham-forest-1988-five-at-anfield');
 assert.equal(matchFixture(forest, new Map()), 'Liverpool 5–0 Nottingham Forest');
 assert.equal(matchFixture(all.find(a => a.slug === 'arsenal-liverpool-1987-barnes-beardsley-debuts'), new Map()), 'Arsenal 1–2 Liverpool');
 assert.equal(matchFixture({ ...derby, oppositionIds: [] }, new Map()), undefined);
});

test('featured discovery requires editorial selection, publication and matching event verification', () => {
 const library = getHistoryLibrary();
 const forest = 'liverpool-nottingham-forest-1988-five-at-anfield';
 assert.deepEqual(getFeaturedMatches(library).map(a => a.slug), [forest]);
 assert.deepEqual(getFeaturedMatches({ ...library, events: [] }), []);
 assert.deepEqual(getFeaturedMatches({ ...library, articles: [] }), []);
 assert.deepEqual(getFeaturedMatches({ ...library, events: library.events.map(e => ({ ...e, date: '1988-04-14' })) }), []);
 const root = fs.mkdtempSync(path.join(os.tmpdir(), 'featured-matches-'));
 try {
  const dir = path.join(root, 'content/history/liverpool'); fs.mkdirSync(dir, { recursive:true });
  const config = path.join(dir, 'featured-matches.json');
  fs.writeFileSync(config, JSON.stringify(['liverpool-everton-1990-barnes-beardsley-derby-double', forest]));
  assert.deepEqual(getFeaturedMatches(library, root).map(a => a.slug), [forest]);
  fs.writeFileSync(config, JSON.stringify([forest, forest]));
  assert.throws(() => getFeaturedMatches(library, root), /Duplicate/);
  fs.writeFileSync(config, JSON.stringify(['one', 'two', 'three', 'four']));
  assert.throws(() => getFeaturedMatches(library, root));
  fs.writeFileSync(config, '[]'); assert.deepEqual(getFeaturedMatches(library, root), []);
 } finally { fs.rmSync(root, { recursive:true, force:true }); }
});
