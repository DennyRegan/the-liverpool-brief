// Run after npm run build. Starts and closes its own production server.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { getArchiveFeatures } from '../lib/content/archive.ts';
import { getHistory, getEraArticles } from '../lib/content/history.ts';

const origin = 'http://127.0.0.1:3128';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3128'], { stdio: ['ignore', 'pipe', 'pipe'] });
const { eras } = getHistory();
const articles = getArchiveFeatures();
const get = async route => {
  const response = await fetch(new URL(route, origin), { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200, route);
  return response.text();
};
const mainOf = html => html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';

try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Production preview startup timed out')), 15000);
    server.once('error', error => { clearTimeout(timeout); reject(error); });
    server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Preview exited with ${code}`)); });
    server.stderr.on('data', data => process.stderr.write(data));
    server.stdout.on('data', data => { if (data.toString().includes('Ready')) { clearTimeout(timeout); resolve(); } });
  });

  const landing = await get('/history');
  assert.match(landing, /<link rel="canonical" href="https:\/\/theliverpoolbrief.com\/history"/);
  assert.equal((mainOf(landing).match(/class="hx-era"/g) ?? []).length, eras.length);
  assert.ok(/<a[^>]*aria-current="page"[^>]*>History/.test(landing), 'History navigation is active');

  for (let i = 0; i < eras.length; i++) {
    const era = eras[i];
    assert.ok(landing.includes(`id="${era.id}"`), `landing anchor: ${era.id}`);
    const html = await get(`/history/${era.id}`);
    const main = mainOf(html);
    assert.equal((main.match(/<h1[ >]/g) ?? []).length, 1, `${era.id}: one main heading`);
    assert.ok(html.includes(`href="https://theliverpoolbrief.com/history/${era.id}"`), 'permanent canonical URL');
    assert.match(main, /Major honours/);
    assert.match(main, /Sources &amp; historical notes/);
    assert.ok(!main.includes('No articles yet'));
    const expected = getEraArticles(articles, era.id, eras);
    const actual = [...main.matchAll(/href="\/archive\/([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(actual, expected.map(article => article.slug), `${era.id}: canonical Archive links once each`);
    assert.equal(main.includes('id="era-writing"'), expected.length > 0, 'zero-article eras omit the reading section');
    if (eras[i - 1]) assert.ok(main.includes(`href="/history/${eras[i - 1].id}"`));
    if (eras[i + 1]) assert.ok(main.includes(`href="/history/${eras[i + 1].id}"`));
    console.log(`PASS /history/${era.id}`);
  }

  for (const route of ['/history/unknown-manager', '/history/kenny-dalglish']) {
    assert.equal((await fetch(new URL(route, origin))).status, 404, route);
  }
  const routes = ['/', '/brief', '/articles', '/articles?category=archive', '/articles?category=opinion', '/archive', '/archive/matches', '/archive/people', '/archive/seasons', '/this-week', '/about',
    ...articles.map(article => `/archive/${article.slug}`),
    ...fs.readdirSync('content/articles/liverpool').filter(name => name.endsWith('.md')).map(name => `/articles/${name.slice(0, -3)}`),
  ];
  for (const route of routes) {
    const html = await get(route);
    assert.match(html, /id="main-content"/, route);
    assert.match(html, /href="\/history"/, `${route}: History is discoverable`);
  }
  const home = mainOf(await get('/'));
  assert.deepEqual([...home.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map(match => match[1]), ['The Brief', 'Opinion', 'Archive']);
  assert.equal((home.match(/<article>/g) ?? []).length, 3);
  assert.ok(!home.includes('hx-'), 'homepage content is unchanged');
  console.log(`PASS History landing, 16 era pages, 2 invalid routes and ${routes.length} existing routes`);
} finally {
  if (server.exitCode === null) {
    const exited = once(server, 'exit');
    server.kill('SIGTERM');
    await exited;
  }
}
