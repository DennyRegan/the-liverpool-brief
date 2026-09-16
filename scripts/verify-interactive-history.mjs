// Run after npm run build. Owns a local production server; never reads a draft.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
await import('./register-server-only.mjs');
const { getPublishedExperiences } = await import('../lib/content/interactive-history.ts');
const port = process.env.INTERACTIVE_VERIFY_PORT ?? '3147';
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', port], {
  stdio: ['ignore', 'pipe', 'pipe'],
  // The accidental production allowlist must not enable the draft route.
  env: { ...process.env, NODE_ENV: 'production', INTERACTIVE_HISTORY_PREVIEW: 'istanbul-2005' },
});
const mainOf = html => (html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '').replace(/<!--[\s\S]*?-->/g, '');
async function get(route, expected = 200) {
  const response = await fetch(new URL(route, origin), { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, expected, route);
  return response.text();
}
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Interactive History verification server timed out')), 20000);
    server.once('error', error => { clearTimeout(timeout); reject(error); });
    server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Verification server exited with ${code}`)); });
    server.stderr.on('data', data => process.stderr.write(data));
    server.stdout.on('data', data => { if (data.toString().includes('Ready')) { clearTimeout(timeout); resolve(); } });
  });
  const experiences = getPublishedExperiences();
  for (const filename of fs.readdirSync('.next/server/app', { recursive: true }).filter(filename => filename.endsWith('.nft.json'))) {
    const trace = JSON.parse(fs.readFileSync(`.next/server/app/${filename}`, 'utf8'));
    assert.ok(!trace.files.some(file => file.includes('docs/editorial/interactive-history')), `${filename}: production trace excludes editorial drafts`);
  }
  const collection = await get('/history/interactive', experiences.length ? 200 : 404);
  await get('/history/interactive/not-a-published-experience', 404);
  await get('/preview/interactive-history/istanbul-2005', 404);
  await get('/preview/interactive-history/unknown', 404);
  for (const experience of experiences) {
    assert.ok(mainOf(collection).includes(`href="/history/interactive/${experience.id}"`), 'collection links to published experience');
    const html = await get(`/history/interactive/${experience.id}`);
    const main = mainOf(html);
    assert.equal((main.match(/<h1[ >]/g) ?? []).length, 1);
    assert.ok(html.includes(`href="https://theliverpoolbrief.com/history/interactive/${experience.id}"`), 'canonical URL');
    for (const moment of experience.moments) assert.ok(main.includes(`id="${moment.id}"`), `moment ${moment.id}`);
    for (const source of experience.sources.filter(source => experience.claims.some(claim => claim.status === 'approved' && claim.sourceRefs.some(ref => ref.sourceId === source.id)))) {
      assert.ok(main.includes(`id="source-${source.id}"`), `source ${source.id}`);
    }
    for (const internal of [...main.matchAll(/href="(\/(?:archive|history)\/[^"#]+)"/g)].map(match => match[1])) await get(internal);
    assert.doesNotMatch(html, /"approvalReference"|"researchModel"|"researchTask"|"reviewNote"|"confidence"/);
    assert.doesNotMatch(main, /Local review draft|editorial approval|Working draft only/i);
    const routes = ['/history', '/history/matches', '/history/players',
      ...experience.relationships.seasonIds.map(id => `/history/seasons/${id}`),
      ...experience.relationships.eraIds.map(id => `/history/${id}`)];
    for (const route of routes) {
      const discovery = mainOf(await get(route));
      assert.ok(discovery.includes('href="/history/interactive"'), `${route}: Interactive History subnavigation`);
      if (route === '/history/matches') {
        assert.match(discovery, /Explore Interactive History/, 'Matches has a separate collection link');
      } else if (route !== '/history' && route !== '/history/players') {
        assert.ok(discovery.includes(`href="/history/interactive/${experience.id}"`), `${route}: experience discovery`);
      }
      assert.doesNotMatch(discovery, /href="\/preview\/interactive-history/, `${route}: no draft link`);
    }
  }
  if (!experiences.length) {
    await get('/history/interactive/istanbul-2005', 404);
    for (const route of ['/history', '/history/matches', '/history/players', '/history/rafael-benitez', '/history/seasons/2004-05', '/archive/liverpool-monaco-champions-league-2004']) {
      const main = mainOf(await get(route));
      assert.doesNotMatch(main, /href="\/history\/interactive(?:\/|"|#)/, `${route}: draft discovery hidden`);
      assert.doesNotMatch(main, /href="\/preview\/interactive-history/, `${route}: no draft link`);
    }
  }
  console.log(`PASS Interactive History: ${experiences.length} public experiences, guarded preview in production, 404s, conditional discovery and canonical links.`);
} finally {
  if (server.exitCode === null) { const exited = once(server, 'exit'); server.kill('SIGTERM'); await exited; }
}
