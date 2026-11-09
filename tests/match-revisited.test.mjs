import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const { MatchRevisitedSchema } = await import('../lib/content/types.ts');
const history = await import('../lib/content/history.ts');
const { getPublicSitemap } = await import('../lib/content/sitemap.ts');

// Made-up test data written to a temporary folder; never real content.
const piece = { title: 'TEST PIECE', slug: 'test-past', date: '2026-11-02', eventDate: '1984-05-30', opponent: 'Test FC', scoreline: '1-0', competition: 'Test Cup', decade: '1980s', excerpt: 'One line.', body: 'Body.' };
const file = p => `---\n${Object.entries(p).filter(([k]) => k !== 'body').map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n')}\n---\n${p.body}\n`;
function makeRoot(pieces) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-'));
  fs.mkdirSync(path.join(root, 'content/match-revisited'), { recursive: true });
  for (const p of pieces) fs.writeFileSync(path.join(root, 'content/match-revisited', `${p.slug}.md`), file(p));
  return root;
}
const past = piece, future = { ...piece, title: 'TEST FUTURE', slug: 'test-future', date: '2026-12-14' };
const now = new Date('2026-11-09T12:00:00Z');

test('schema is strict and requires the match facts', () => {
  assert.equal(MatchRevisitedSchema.parse(piece).opponent, 'Test FC');
  for (const field of ['title', 'slug', 'date', 'eventDate', 'opponent', 'scoreline', 'competition', 'decade', 'excerpt', 'body']) {
    const rest = { ...piece }; delete rest[field];
    assert.throws(() => MatchRevisitedSchema.parse(rest), undefined, `missing ${field}`);
  }
  for (const extra of [{ season: '1983-84' }, { relatedMatches: [] }, { sources: [] }]) assert.throws(() => MatchRevisitedSchema.parse({ ...piece, ...extra }));
});

test('a past-dated piece shows and a future-dated one is hidden on production, in lists, latest and sitemap', () => {
  const root = makeRoot([past, future]);
  const prod = { VERCEL_ENV: 'production' };
  assert.deepEqual(history.getVisibleMatchRevisited(now, prod, root).map(p => p.slug), ['test-past']);
  assert.equal(history.getVisibleMatchRevisitedPiece('test-future', now, prod, root), undefined);
  assert.deepEqual(history.getLiveMatchRevisited(now, root).map(p => p.slug), ['test-past']);
  assert.equal(history.getLatestMatchRevisited(now, root).slug, 'test-past');
  const preview = history.getVisibleMatchRevisited(now, { VERCEL_ENV: 'preview' }, root);
  assert.deepEqual(preview.map(p => [p.slug, p.scheduled]), [['test-future', true], ['test-past', false]]);
});

test('a piece goes live at midnight London on its Monday; a missed week leaves the last piece up', () => {
  const root = makeRoot([past, future]);
  assert.equal(history.getLatestMatchRevisited(new Date('2026-12-13T23:30:00Z'), root).slug, 'test-past');
  assert.equal(history.getLatestMatchRevisited(new Date('2026-12-14T00:00:00Z'), root).slug, 'test-future');
  assert.equal(history.getLatestMatchRevisited(new Date('2027-03-01T00:00:00Z'), root).slug, 'test-future');
  assert.equal(history.getLatestMatchRevisited(now, makeRoot([])), undefined);
});

test('the real content folder parses', () => {
  assert.ok(Array.isArray(history.getMatchRevisited()));
});

test('the sitemap lists live pieces only', () => {
  const root = makeRoot([past, { ...future, date: '2099-01-05' }]);
  const urls = getPublicSitemap(root, {}).map(entry => entry.url);
  assert.ok(urls.some(url => url.endsWith('/looking-back/match-revisited/test-past')));
  assert.ok(!urls.some(url => url.endsWith('/looking-back/match-revisited/test-future')));
  assert.ok(urls.some(url => url.endsWith('/looking-back/match-revisited')));
});

test('the homepage and the Looking Back hub feature the latest live piece', () => {
  const home = fs.readFileSync('app/page.tsx', 'utf8');
  assert.match(home, /<MatchRevisitedHome \/>/);
  assert.ok(home.indexOf('<FootballObservedHome') < home.indexOf('<MatchRevisitedHome'), 'after Football Observed');
  assert.match(fs.readFileSync('app/components/MatchRevisitedHome.tsx', 'utf8'), /getLatestMatchRevisited\(\)/);
  assert.match(fs.readFileSync('app/looking-back/page.tsx', 'utf8'), /matchRevisited/);
  const root = makeRoot([past, future]);
  assert.equal(history.getLookingBackHub(now, root).matchRevisited.latest.slug, 'test-past');
  assert.equal(history.getLookingBackHub(now, root).matchRevisited.count, 1);
  assert.equal(history.getLookingBackHub(now, makeRoot([])).matchRevisited, undefined);
});

test('Match Revisited joins Continue reading through its player and opponent tags and its season', async () => {
  const { getConnectedPieces, connection } = await import('../lib/content/related.ts');
  const root = makeRoot([{ ...past, slug: 'test-a', players: ['kenny-dalglish'] }]);
  const mine = getConnectedPieces(now, root).find(p => p.href.endsWith('/match-revisited/test-a'));
  assert.equal(mine.kind, 'Match Revisited');
  assert.equal(mine.season, '1983-84');
  assert.deepEqual(mine.players, ['kenny-dalglish']);
  assert.ok(connection(mine, { ...mine, href: '/x', series: undefined }));
});
