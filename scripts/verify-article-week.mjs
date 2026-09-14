import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { getArticleWeek, getHistoryEvents, getHistoryWindow } from '../lib/content/this-week.ts';
import { getArchiveFeatures } from '../lib/content/archive.ts';
const origin = 'http://127.0.0.1:3143';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3143'], { stdio: ['ignore', 'pipe', 'pipe'] });
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Server startup timed out')), 30000);
    server.on('error', error => { clearTimeout(timer); reject(error); });
    server.on('exit', code => { clearTimeout(timer); reject(new Error(`Server exited: ${code}`)); });
    server.stderr.on('data', data => process.stderr.write(data));
    server.stdout.on('data', data => { if (data.toString().includes('Ready')) { clearTimeout(timer); resolve(); } });
  });
  const expected = getArticleWeek(getArchiveFeatures(), getHistoryWindow(getHistoryEvents())).flatMap(d => d.articles);
  const response = await fetch(`${origin}/this-week`);
  assert.equal(response.status, 200);
  const html = await response.text();
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
  assert.equal((main.match(/<article /g) ?? []).length, expected.length);
  assert.ok(!main.includes('Further reading') && !main.includes('Source ↗') && !main.includes('<img'));
  assert.equal(main.includes('history-empty'), expected.length === 0);
  const links = [...new Set([...main.matchAll(/href="(\/archive\/[^" ]+)"/g)].map(m => m[1]))];
  assert.deepEqual(links.sort(), expected.map(a => `/archive/${a.slug}`).sort());
  for (const link of links) assert.equal((await fetch(`${origin}${link}`)).status, 200, link);
  console.log(`PASS article-only production page: ${expected.length} cards, canonical links resolve, no source-only entries or duplicate reading list.`);
} finally {
  if (server.exitCode === null) { const stopped = once(server, 'exit'); server.kill('SIGTERM'); await stopped; }
}
