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
  const { getWriting } = await import('../lib/content/writing.ts');
  const { getBrief } = await import('../lib/content/briefs.ts');
  const { getMatchCentre } = await import('../lib/content/match-centre.ts');
  const { getFactualHistoryArticles } = await import('../lib/content/archive.ts');
  const { getHomeLeadOverride } = await import('../lib/content/homepage-config.ts');
  const { selectHomeLead, selectHomeBrief, selectHomeCoverage } = await import('../lib/content/homepage.ts');
  const now = new Date();
  const lead = selectHomeLead(getWriting(), now, getHomeLeadOverride());
  const brief = selectHomeBrief(getBrief(), now);
  const coverage = selectHomeCoverage(getMatchCentre(), getFactualHistoryArticles(), now);
  assert.equal((main.match(/<section\b/g) ?? []).length, 1 + Number(Boolean(brief)) + Number(Boolean(coverage)), 'only eligible areas render');
  assert.equal(main.includes('id="home-brief-heading"'), Boolean(brief));
  assert.equal(main.includes('id="home-coverage-heading"'), Boolean(coverage));
  if (lead) assert.ok(main.includes(`href="${lead.href}"`));
  if (coverage) assert.ok(main.includes(`href="${coverage.href}"`));
  if (brief) {
    const block = main.split('class="home-brief-compact"')[1].split('</section>')[0];
    assert.equal((block.match(/<li[ >]/g) ?? []).length, brief.stories.length);
    assert.ok(brief.stories.length <= 3);
    assert.ok(block.includes(`dateTime="${brief.lastUpdated}"`) || block.includes(`datetime="${brief.lastUpdated}"`));
    assert.equal((block.match(/href="\/brief"/g) ?? []).length, 1);
  }
  assert.doesNotMatch(main, /More to read|From the match archive|Latest in History|This Week in History|Season spotlight|home-browse|articles\?category=/);
  for (const href of ['/articles', '/articles?type=analysis', '/history', '/match-centre']) assert.ok(main.includes(`href="${href}"`));
  assert.match(main, /aria-label="Explore more"/);
  assert.match(html, /href="\/search"/);
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
  console.log('PASS one editorial lead, eligible coverage/Brief, compact Explore and canonical destinations');
} finally {
  if (server.exitCode === null) {
    const exited = once(server, 'exit');
    server.kill('SIGTERM');
    await exited;
  }
}
