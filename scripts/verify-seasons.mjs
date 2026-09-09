// Run after npm run build; owns a temporary local production server.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { getSeasons, getSeasonArchiveArticles } from '../lib/content/seasons.ts';
import { getArchiveFeatures } from '../lib/content/archive.ts';
import { getHistory } from '../lib/content/history.ts';

const origin = 'http://127.0.0.1:3141';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3141'], { stdio: ['ignore', 'pipe', 'pipe'] });
const mainOf = html => (html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '').replace(/<!--[\s\S]*?-->/g, '');
const all = getSeasons();
const archive = getArchiveFeatures();
const get = async route => {
  const response = await fetch(new URL(route, origin), { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200, route);
  return response.text();
};
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Season preview startup timed out')), 15000);
    server.once('error', error => { clearTimeout(timeout); reject(error); });
    server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Preview exited with ${code}`)); });
    server.stderr.on('data', data => process.stderr.write(data));
    server.stdout.on('data', data => { if (data.toString().includes('Ready')) { clearTimeout(timeout); resolve(); } });
  });
  const landing = mainOf(await get('/history/seasons'));
  assert.deepEqual([...landing.matchAll(/href="\/history\/seasons\/([0-9-]+)"/g)].map(m => m[1]), all.map(s => s.season));
  assert.match(landing, /From Bill Shankly/);
  assert.match(landing, /aria-current="page" href="\/history\/seasons"/);
  const internalLinks = new Set();
  for (let i = 0; i < all.length; i++) {
    const season = all[i];
    const route = `/history/seasons/${season.season}`;
    const html = await get(route);
    const main = mainOf(html);
    assert.equal((main.match(/<h1[ >]/g) ?? []).length, 1);
    assert.ok(html.includes(`href="https://theliverpoolbrief.com${route}"`), 'canonical URL');
    for (const heading of ['Season overview', 'Key players', 'Transfers in', 'Transfers out', 'Important connections', 'Sources &amp; historical notes']) assert.ok(main.includes(heading), `${route}: ${heading}`);
    assert.match(main, /AI-assisted historical reference/);
    for (const kind of ['domestic', 'europe', 'other']) assert.equal(main.includes(`id="competition-${kind}"`), season.competitions.some(c => c.kind === kind), `${route}: only entered competitions`);
    for (const source of season.sources) assert.ok(main.includes(`id="source-${source.id}"`), `${route}: source ${source.id}`);
    const expectedArchive = getSeasonArchiveArticles(season.season, archive).map(a => a.slug);
    assert.deepEqual([...main.matchAll(/href="\/archive\/([^"]+)"/g)].map(m => m[1]), expectedArchive);
    assert.equal(main.includes('id="season-archive"'), expectedArchive.length > 0);
    assert.equal(main.includes('rel="prev"'), i > 0);
    assert.equal(main.includes('rel="next"'), i < all.length - 1);
    for (const [, href] of main.matchAll(/href="(\/[^"#]+)"/g)) internalLinks.add(href.replaceAll('&amp;', '&'));
    for (const [, fragment] of main.matchAll(/href="#([^"]+)"/g)) assert.ok(main.includes(`id="${fragment}"`), `${route}: #${fragment}`);
    console.log(`PASS ${route}`);
  }
  for (const route of internalLinks) await get(route);
  const missingYear = Number(all.at(-1).season.slice(0, 4)) + 1;
  const unpublished = `${missingYear}-${String((missingYear + 1) % 100).padStart(2, '0')}`;
  for (const route of [`/history/seasons/${unpublished}`, '/history/seasons/1959-61', '/history/seasons/unknown']) assert.equal((await fetch(new URL(route, origin))).status, 404, route);
  const explorer = mainOf(await get('/history'));
  assert.equal((explorer.match(/class="hx-era"/g) ?? []).length, getHistory().eras.length);
  assert.ok(explorer.includes('href="/history/seasons"'));
  console.log(`PASS ${all.length} season pages, chronological index, ${internalLinks.size} internal destinations, source anchors, conditional sections and 3 invalid routes`);
} finally {
  if (server.exitCode === null) {
    const exited = once(server, 'exit'); server.kill('SIGTERM'); await exited;
  }
}
