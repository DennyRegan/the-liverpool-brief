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
  assert.deepEqual([...main.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map(match => match[1]), ['Articles', 'The Brief', 'Latest in History', 'This Week in History', 'Explore Liverpool history']);
  assert.doesNotMatch(main, /articles\?category=/);
  assert.match(main, /href="\/articles"/);
  assert.match(main, /href="\/history\/seasons/);
  assert.match(main, /href="\/this-week"/);
  const links = new Set([...main.matchAll(/href="([^"]+)"/g)].map(match => match[1].replaceAll('&amp;', '&')));
  for (const href of links) {
    const destination = await fetch(new URL(href, origin), { signal: AbortSignal.timeout(10000) });
    assert.equal(destination.status, 200, href);
    const body = await destination.text();
    assert.match(body, /id="main-content"/, `${href} renders its content`);
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
