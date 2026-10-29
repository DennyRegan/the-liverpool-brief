import test from 'node:test';
import fs from 'node:fs';
const localTest = (name, fn) => test(name, { skip: !fs.existsSync('prototype/history/1987-88.json') && 'Local editorial pack not installed' }, fn);
import assert from 'node:assert/strict';
import { loadHistoryPrototype, prototypeEnabled, isLoopbackHost } from '../lib/content/history-prototype.ts';
import { groupMatchesByVenue, projectBritain, groupAtlasLocations } from '../lib/history-atlas.ts';
import { getWriting } from '../lib/content/writing.ts';
import { getPublicSitemap } from '../lib/content/sitemap.ts';

test('prototype requires explicit local opt-in and rejects hosting/CI', () => {
  assert.equal(prototypeEnabled({}), false);
  assert.equal(prototypeEnabled({ LIVERPOOL_HISTORY_PROTOTYPE: 'true' }), false);
  assert.equal(prototypeEnabled({ LIVERPOOL_HISTORY_PROTOTYPE: '1' }), true);
  assert.equal(prototypeEnabled({ LIVERPOOL_HISTORY_PROTOTYPE: '1', VERCEL: '1' }), false);
  assert.equal(prototypeEnabled({ LIVERPOOL_HISTORY_PROTOTYPE: '1', CI: '1' }), false);
  for (const host of ['localhost:3147', '127.0.0.1:3147', '[::1]:3147']) assert.equal(isLoopbackHost(host), true);
  for (const host of [null, 'theliverpoolbrief.com', 'localhost.evil.test', '127.0.0.1.example.com', '127.0.0.1:3147@evil.test']) assert.equal(isLoopbackHost(host), false);
});

localTest('the five canonical reports provide both list and atlas, with Anfield grouped', () => {
  const { matches, groups, season, articles } = loadHistoryPrototype();
  assert.deepEqual(matches.map(m => m.historicalEventDate), ['1987-08-15', '1987-09-20', '1987-10-17', '1988-04-13', '1988-05-14']);
  assert.equal(season.season, '1987-88');
  assert.equal(groups.find(g => g.id === 'anfield').matches.length, 2);
  assert.equal(groups.flatMap(g => g.matches).length, 5);
  for (const match of matches) {
    assert.equal(match.href, `/archive/${match.slug}`);
    const article = articles.find(a => a.slug === match.slug);
    assert.equal(match.title, article.title);
    assert.equal(match.locationId, article.locationIds[0]);
    assert.ok(article.sources.length > 0);
  }
});

localTest('atlas grouping also works for a different article selection without a new registry', () => {
  const { matches, venues } = loadHistoryPrototype();
  const selected = matches.filter(m => m.playerIds.includes('steve-nicol'));
  assert.equal(groupMatchesByVenue(selected, venues).flatMap(g => g.matches).length, selected.length);
  assert.throws(() => groupMatchesByVenue([{ ...matches[0], locationId: 'unknown-stadium' }], venues), /No verified atlas location/);
});

localTest('verified stadium coordinates remain intact when London is grouped', () => {
  const { venues } = loadHistoryPrototype();
  const highbury = venues.find(g => g.id === 'highbury');
  const wembley = venues.find(g => g.id === 'wembley');
  assert.deepEqual([highbury.latitude, highbury.longitude], [51.55778, -0.10278]);
  assert.deepEqual([wembley.latitude, wembley.longitude], [51.55556, -0.27972]);
  assert.ok(wembley.source.includes('(1923)'));
  for (const venue of venues) {
    const [x,y] = projectBritain(venue.longitude, venue.latitude);
    assert.ok(x > 0 && x < 640 && y > 0 && y < 610);
  }
  const { groups, matches } = loadHistoryPrototype();
  const locations = groupAtlasLocations(groups);
  assert.equal(locations.length, 3);
  const london = locations.find(location => location.label === 'London');
  assert.deepEqual(london.grounds.map(g => g.id), ['highbury', 'wembley']);
  assert.deepEqual(london.matches.map(m => m.slug), [matches[0].slug, matches[4].slug]);
  assert.equal(london.longitude, (highbury.longitude + wembley.longitude) / 2);
  assert.equal(locations.find(location => location.id === 'anfield').matches.length, 2);
  assert.equal(locations.flatMap(location => location.matches).length, 5);
  assert.equal(groupAtlasLocations([groups[0]])[0].label, 'Highbury');
});

localTest('recovered reports stay out of public writing and sitemap even with the prototype flag', () => {
  const previous = process.env.LIVERPOOL_HISTORY_PROTOTYPE;
  process.env.LIVERPOOL_HISTORY_PROTOTYPE = '1';
  try {
    const { matches } = loadHistoryPrototype();
    const withdrawn = matches.filter(m => !m.slug.includes('five-at-anfield'));
    const writing = getWriting(); const sitemap = getPublicSitemap();
    assert.ok(withdrawn.every(m => !writing.some(a => a.slug === m.slug)));
    assert.ok(withdrawn.every(m => !sitemap.some(p => p.url.endsWith(m.href))));
    assert.ok(!sitemap.some(p => p.url.includes('/preview/')));
  } finally {
    if (previous === undefined) delete process.env.LIVERPOOL_HISTORY_PROTOTYPE;
    else process.env.LIVERPOOL_HISTORY_PROTOTYPE = previous;
  }
});
