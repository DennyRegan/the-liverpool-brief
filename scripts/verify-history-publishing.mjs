// Integration test: real Markdown -> real loaders -> rendered History and Archive.
// Runs a disposable copy so fixture content never touches the working article tree.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'liverpool-history-publishing-'));
for (const name of ['app', 'lib', 'content', 'public', 'scripts', 'package.json', 'package-lock.json', 'next.config.ts', 'tsconfig.json', 'postcss.config.mjs', 'next-env.d.ts']) {
  fs.cpSync(name, path.join(root, name), { recursive: true });
}
fs.symlinkSync(path.join(process.cwd(), 'node_modules'), path.join(root, 'node_modules'), 'dir');
const slugs = ['history-qa-dated', 'history-qa-multiple', 'history-qa-explicit'];
const files = slugs.map(slug => path.join(root, `content/archive/liverpool/${slug}.md`));
for (const file of files) assert.ok(!fs.existsSync(file), `Refusing to overwrite ${file}`);
const historyFile = path.join(root, 'content/history/liverpool/eras.json');
const originalHistory = fs.readFileSync(historyFile, 'utf8');
const origin = 'http://127.0.0.1:3129';
let server;
const get = async route => {
  const response = await fetch(new URL(route, origin), { signal: AbortSignal.timeout(60000) });
  assert.equal(response.status, 200, route);
  const html = await response.text();
  return html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
};

try {
  const metadata = [
    'historicalEventDate: "1981-05-27"',
    'historyEras: [bob-paisley, joe-fagan]',
    'historyEras: [bob-paisley]',
  ];
  files.forEach((file, index) => fs.writeFileSync(file, `---\ntitle: "History QA fixture ${index + 1}"\nslug: "${slugs[index]}"\ndate: "2026-09-07"\nhistoricalPeriod: "Verification fixture"\ndecade: "1980s"\ncategory: "match"\nexcerpt: "Temporary publishing verification fixture."\n${metadata[index]}\n---\nTemporary verification content. Never publish.\n`));
  const history = JSON.parse(originalHistory);
  history.eras.find(era => era.id === 'joe-fagan').image = {
    src: '/images/history/history-qa-missing.webp', alt: 'Editorial illustration of Joe Fagan', width: 600, height: 750,
  };
  fs.writeFileSync(historyFile, JSON.stringify(history));
  // Webpack permits the shared dependency symlink outside the disposable root.
  server = spawn(process.execPath, ['scripts/dev.mjs', '--webpack', '--hostname', '127.0.0.1', '--port', '3129'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Development server startup timed out')), 15000);
    server.once('error', error => { clearTimeout(timeout); reject(error); });
    server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Development server exited with ${code}`)); });
    server.stderr.on('data', data => process.stderr.write(data));
    server.stdout.on('data', data => { if (data.toString().includes('Ready')) { clearTimeout(timeout); resolve(); } });
  });
  const paisley = await get('/history/bob-paisley');
  const links = [...paisley.matchAll(/href="\/archive\/([^"]+)"/g)].map(match => match[1]);
  assert.equal(links.length, 4, 'several articles include all three fixtures and the real article');
  assert.equal(new Set(links).size, 4, 'each canonical article appears once');
  for (const slug of slugs) assert.ok(links.includes(slug), slug);
  const more = paisley.match(/<details class="hx-more-reading">([\s\S]*?)<\/details>/)?.[1];
  assert.ok(more, 'additional writing uses a native disclosure');
  assert.equal((more.match(/<article>/g) ?? []).length, 1, 'first three visible, fourth disclosed');
  const fagan = await get('/history/joe-fagan');
  assert.match(fagan, /href="\/archive\/history-qa-multiple"/, 'one canonical piece appears in a second era');
  assert.match(fagan, /class="hx-monogram" aria-hidden="true">JF/, 'missing file renders the fallback');
  assert.ok(!fagan.includes('<img'), 'missing illustration creates no broken image');
  const landing = await get('/history');
  const paisleyCard = landing.match(/<article class="hx-era" id="bob-paisley"[\s\S]*?<\/article>/)?.[0];
  assert.equal((paisleyCard?.match(/href="\/archive\//g) ?? []).length, 2, 'landing card remains concise');
  const archive = await get('/articles?category=archive');
  for (const slug of slugs) {
    assert.ok(archive.includes(`href="/archive/${slug}"`), `Archive discovers ${slug}`);
    assert.match(await get(`/archive/${slug}`), /Temporary verification content/, 'existing canonical article route renders the original file');
  }
  console.log('PASS real Markdown publication, dated and multi-era placement, four-article disclosure, one-article era, canonical URLs and missing illustration.');
} finally {
  if (server && server.exitCode === null) {
    const exited = once(server, 'exit');
    server.kill('SIGTERM');
    await exited;
  }
  fs.rmSync(root, { recursive: true, force: true });
}
