import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const seasonMap = await import('../lib/content/season-map.ts');
const { britainCamera, inView, project } = await import('../lib/season-map/views.ts');

const base = JSON.parse(fs.readFileSync('lib/season-map/base.json', 'utf8'));
const folder = 'content/looking-back/season-maps/1976-77';
// Preview rules, so a scheduled Match Revisited piece counts as visible.
const map = seasonMap.getSeasonMap('1976-77', process.cwd(), new Date('2026-11-12T12:00:00Z'), {});
const game = number => map.games[number - 1];

test('the base map is drawn once from Natural Earth and covers Anfield to Trabzon', () => {
  assert.match(base.source, /Natural Earth/);
  assert.ok(base.land.length > 10000 && base.borders.length > 1000);
  const britain = britainCamera(base.projection);
  const anfield = project(base.projection, 53.4308, -2.9608);
  const trabzon = project(base.projection, 41.0, 39.7253);
  assert.equal(inView(britain, anfield), true);
  assert.equal(inView(britain, trabzon), false);
  for (const point of [anfield, trabzon]) assert.ok(point.x > 0 && point.x < base.size && point.y > 0 && point.y < base.size);
});

test('all 62 games of 1976-77 are on the map in date order, and the 30 home games share one Anfield stop', () => {
  assert.equal(map.games.length, 62);
  assert.deepEqual(map.games.map(g => g.number), Array.from({ length: 62 }, (_, index) => index + 1));
  const home = map.stops.filter(stop => stop.home);
  assert.equal(home.length, 1);
  assert.equal(home[0].label, 'Anfield');
  assert.equal(home[0].games.length, 30);
  assert.equal(map.stops.reduce((sum, stop) => sum + stop.games.length, 0), 62);
  assert.equal(map.games.every(g => map.stops[g.stop].games.includes(g.number - 1)), true);
  assert.equal(game(1).fixture.replace('⁠', ''), 'Liverpool 1–0 Southampton');
  assert.equal(game(40).fixture.replace('⁠', ''), 'Saint-Étienne 1–0 Liverpool');
  assert.equal(game(62).ground, 'Stadio Olimpico, Rome');
  assert.equal(game(2).ground, 'Anfield, Liverpool');
});

test('competitions read in full', () => {
  assert.equal(game(2).competition, 'First Division');
  assert.equal(game(1).competition, 'Charity Shield');
  assert.equal(game(7).competition, 'League Cup second round replay');
  assert.equal(game(44).competition, 'European Cup quarter-final, second leg');
  assert.equal(game(54).competition, 'FA Cup semi-final replay');
  assert.equal(game(62).competition, 'European Cup final');
  assert.throws(() => seasonMap.competitionLine('FA Cup', 'R9'), /Unknown round/);
});

test('games abroad switch the map to Europe; Belfast stays in the Britain view', () => {
  const stopOf = number => map.stops[game(number).stop];
  assert.deepEqual([15, 40, 48, 62].map(n => stopOf(n).abroad), [true, true, true, true]);
  assert.deepEqual([15, 40, 48, 62].map(n => stopOf(n).label), ['Trabzon', 'Saint-Étienne', 'Zürich', 'Rome']);
  assert.equal(stopOf(12).abroad, false);
  assert.equal(stopOf(12).label, 'Seaview');
  assert.equal(map.stops.filter(stop => stop.abroad).length, 4);
  // Wembley (Charity Shield and FA Cup final) and Maine Road (league game, semi-final and replay) are one pin each.
  assert.equal(game(1).stop, game(61).stop);
  assert.deepEqual(stopOf(53).games, [28, 52, 53]);
});

test('the eight key games have different pins and open their write-ups', () => {
  assert.deepEqual(map.games.filter(g => g.key).map(g => g.number), [40, 44, 48, 52, 53, 54, 61, 62]);
  assert.equal(map.games.filter(g => g.key).every(g => g.writeUp && g.writeUp.body.length > 300), true);
  assert.equal(map.games.filter(g => !g.key).every(g => !g.writeUp && !g.article), true);
  assert.equal(game(48).writeUp.title, 'FC Zürich: the road to Rome');
  assert.equal(game(48).writeUp.body, game(52).writeUp.body);
  assert.match(game(61).writeUp.body, /If your name's on the Cup you win/);
  assert.equal(game(62).article.href, '/looking-back/match-revisited/four-days-from-wembley-to-rome');
  // The Saint-Étienne piece is linked only once it is on the site.
  const published = fs.existsSync('content/match-revisited/supersubs-night-against-saint-etienne.md');
  assert.equal(!!game(44).article, published);
});

test('the write-ups on the site are the pieces from docs/seasons, word for word', () => {
  const source = fs.readFileSync('docs/seasons/1976-77-key-game-write-ups.md', 'utf8').replaceAll('\\*', '*');
  for (const file of fs.readdirSync(`${folder}/write-ups`)) {
    const paragraphs = fs.readFileSync(`${folder}/write-ups/${file}`, 'utf8').trim().split(/\n\n+/).slice(1);
    for (const paragraph of paragraphs) assert.ok(source.includes(paragraph), `${file}: "${paragraph.slice(0, 40)}…" is not in the source file`);
  }
  assert.deepEqual(JSON.parse(fs.readFileSync(`${folder}/games.json`, 'utf8')), JSON.parse(fs.readFileSync('docs/seasons/1976-77-season-data.json', 'utf8')));
});

test('the figure list, check notes and research flags never reach the page', () => {
  const page = JSON.stringify(map);
  for (const internal of ['FIGURE LIST', 'not for publication', 'Check notes', 'British Newspaper Archive', 'OCR', '→ Then', 'unresolved', 'Wikipedia', 'Homewood']) {
    assert.equal(page.includes(internal), false, `"${internal}" must not be shown`);
  }
  const bad = fs.mkdtempSync('/tmp/season-map-');
  fs.cpSync(folder, `${bad}/${folder}`, { recursive: true });
  fs.appendFileSync(`${bad}/${folder}/write-ups/everton.md`, '\n## FIGURE LIST AND CHECK NOTES (not for publication)\n');
  assert.throws(() => seasonMap.getSeasonMap('1976-77', bad), /contains internal notes/);
});

test('an attendance marked unresolved is not printed (games 8 and 15)', () => {
  assert.equal(game(8).attendance, undefined);
  assert.equal(game(15).attendance, undefined);
  assert.equal(game(1).attendance, '76,500');
  assert.equal(map.games.filter(g => !g.attendance).length, 2);
});

test('a season without a folder has no map, and a bad file fails the build', () => {
  assert.equal(seasonMap.getSeasonMap('1985-86'), undefined);
  assert.deepEqual(seasonMap.getSeasonMapSeasons('/nonexistent-root'), []);
  const bad = fs.mkdtempSync('/tmp/season-map-');
  fs.cpSync(folder, `${bad}/${folder}`, { recursive: true });
  const data = JSON.parse(fs.readFileSync(`${folder}/games.json`, 'utf8'));
  data[3].n = 9;
  fs.writeFileSync(`${bad}/${folder}/games.json`, JSON.stringify(data));
  assert.throws(() => seasonMap.getSeasonMap('1976-77', bad), /Game numbers must run 1, 2, 3 in order/);
});

test('every season with a map has a season record, and no map libraries or tile services are used', () => {
  const records = new Set(fs.readdirSync('content/looking-back/seasons').map(file => file.replace('.json', '')));
  assert.deepEqual(seasonMap.getSeasonMapSeasons(), ['1976-77']);
  for (const season of seasonMap.getSeasonMapSeasons()) assert.ok(records.has(season), `${season} has a map but no season record`);
  const source = fs.readFileSync('app/components/SeasonMap.tsx', 'utf8') + fs.readFileSync('app/components/SeasonMapBase.tsx', 'utf8');
  assert.doesNotMatch(source, /leaflet|mapbox|maplibre|tile\.openstreetmap|googleapis/i);
  assert.match(source, /localStorage/);
});
