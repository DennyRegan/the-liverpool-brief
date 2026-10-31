import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const { ArticleSchema } = await import('../lib/content/types.ts');
const { fixtureHeading, groupByFixture } = await import('../lib/content/matchday.ts');
const { getArticles } = await import('../lib/content/articles.ts');

const fixture = { opponent: 'Arsenal', date: '2026-11-01', competition: 'Premier League', venue: 'Home' };
const base = { title: 'T', date: '2026-10-31', slug: 't', body: 'Body.' };

test('Matchday accepts a fixture and type, and tolerates a piece with neither', () => {
  const full = ArticleSchema.parse({ ...base, category: 'Matchday', matchType: 'Preview', fixture });
  assert.equal(full.fixture.opponent, 'Arsenal');
  const bare = ArticleSchema.parse({ ...base, category: 'Matchday' });
  assert.equal(bare.fixture, undefined);
  assert.equal(bare.matchType, undefined);
  assert.equal(ArticleSchema.parse(base).category, 'Opinion');
});

test('unknown match types and incomplete fixtures are rejected', () => {
  assert.throws(() => ArticleSchema.parse({ ...base, category: 'Matchday', matchType: 'Live blog' }));
  assert.throws(() => ArticleSchema.parse({ ...base, category: 'Matchday', fixture: { ...fixture, venue: 'Neutral' } }));
  assert.throws(() => ArticleSchema.parse({ ...base, category: 'Matchday', fixture: { opponent: 'Arsenal' } }));
});

test('fixture headings name the home side first', () => {
  assert.equal(fixtureHeading(fixture), 'Liverpool v Arsenal, Premier League, 1 November 2026');
  assert.equal(fixtureHeading({ ...fixture, venue: 'Away' }), 'Arsenal v Liverpool, Premier League, 1 November 2026');
});

test('pieces group by fixture, newest fixture first, in Preview, Report, Opinion order', () => {
  const piece = (slug, date, matchType, f) => ({ slug, date, matchType, fixture: f });
  const later = { ...fixture, opponent: 'Everton', date: '2026-11-08', venue: 'Away' };
  const { fixtures, unassigned } = groupByFixture([
    piece('arsenal-opinion', '2026-11-03', 'Opinion on a match', fixture),
    piece('arsenal-report', '2026-11-01', 'Report', { ...fixture, opponent: 'ARSENAL ' }),
    piece('everton-preview', '2026-11-07', 'Preview', later),
    piece('arsenal-preview', '2026-10-31', 'Preview', fixture),
    piece('no-fixture', '2026-11-02', undefined, undefined),
  ]);
  assert.deepEqual(fixtures.map(f => f.heading), ['Everton v Liverpool, Premier League, 8 November 2026', 'Liverpool v Arsenal, Premier League, 1 November 2026']);
  assert.deepEqual(fixtures[1].pieces.map(p => p.slug), ['arsenal-preview', 'arsenal-report', 'arsenal-opinion']);
  assert.deepEqual(unassigned.map(p => p.slug), ['no-fixture']);
});

test('a Matchday piece without a fixture loads, so it cannot break the build', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'matchday-'));
  try {
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    fs.writeFileSync(path.join(root, 'content/articles/liverpool/matchday-no-fixture.md'), '---\ntitle: No fixture\ndate: "2026-10-31"\ncategory: Matchday\n---\nBody.\n');
    assert.equal(getArticles(root).find(a => a.slug === 'matchday-no-fixture').category, 'Matchday');
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('Matchday sits next to Opinion in the Articles category row', () => {
  const nav = fs.readFileSync('app/components/ArticlesNavigation.tsx', 'utf8');
  assert.ok(nav.indexOf('["Opinion"') < nav.indexOf('["Matchday"') && nav.indexOf('["Matchday"') < nav.indexOf('["Team News"'));
});
