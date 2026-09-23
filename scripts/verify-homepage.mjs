// Run after npm run build. Checks the real production page and its destinations.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const origin = 'http://127.0.0.1:3127';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3127'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Preview startup timed out')), 15000);
    server.once('error', reject);
    server.once('exit', code => {
      clearTimeout(timeout);
      reject(new Error(`Preview exited with code ${code}`));
    });
    server.stderr.on('data', data => process.stderr.write(data));
    server.stdout.on('data', data => {
      if (data.toString().includes('Ready')) {
        clearTimeout(timeout);
        resolve();
      }
    });
  });

  const response = await fetch(origin, { signal: AbortSignal.timeout(10000) });
  assert.equal(response.status, 200);
  const html = await response.text();
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(main, 'homepage has a main content landmark');
  assert.equal((main.match(/<h1[ >]/g) || []).length, 1, 'one lead heading');
  const headings = [...main.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map(match => match[1].replace(/<[^>]+>/g, '')).filter((_, i) => i !== 1);
  // The home card appears only on a day with a published history article.
  assert.deepEqual(headings.filter(heading => heading !== 'This Week in History'), ['Featured writing', 'Explore Liverpool history', 'The Brief', 'Latest in History', 'Season spotlight']);
  assert.match(main, /id="home-match-feature-heading"/);
  assert.doesNotMatch(main, /articles\?category=/);
  assert.match(main, /href="\/articles"/);
  assert.match(main, /href="\/history\/seasons/);
  assert.match(main, /href="\/this-week"/);
  const historySection = main.split('id="home-history-heading"')[1].split('</section>')[0];
  assert.doesNotMatch(historySection, /href="\/history\/seasons\//, 'seasons do not occupy Latest in History');
  assert.match(main, /Explore this season/);
  const links = new Set([...main.matchAll(/href="([^"]+)"/g)].map(match => match[1].replaceAll('&amp;', '&')));
  for (const href of links) {
    const destination = await fetch(new URL(href, origin), { signal: AbortSignal.timeout(10000) });
    assert.equal(destination.status, 200, href);
    const body = await destination.text();
    assert.match(body, /id="main-content"/, `${href} renders its content`);
    const fragment = new URL(href, origin).hash.slice(1);
    if (fragment) assert.ok(body.includes(`id="${fragment}"`), `${href} has a real moment destination`);
    console.log(`PASS ${href}`);
  }
  console.log('PASS article lead, Brief, mixed History, weekly feature and working destinations');
} finally {
  if (server.exitCode === null) {
    const exited = once(server, 'exit');
    server.kill('SIGTERM');
    await exited;
  }
}
