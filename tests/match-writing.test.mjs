import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import matter from 'gray-matter';
import { ArticleSchema } from '../lib/content/types.ts';
import { getArticles } from '../lib/content/articles.ts';
import { getArticleCollection, matchContext } from '../lib/content/match-writing.ts';
import { selectHomeCoverage, selectHomeLead } from '../lib/content/homepage.ts';
import { getTestMatchCentre, excludeUnrelatedMatchArticles } from './fixtures/league-table.mjs';

function withContent(run) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'match-writing-'));
  try {
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    const data = getTestMatchCentre();
    excludeUnrelatedMatchArticles(root, data);
    for (const fixture of data.fixtures) { delete fixture.preview; delete fixture.briefing; }
    fs.writeFileSync(path.join(root, 'content/match-centre/liverpool/current.json'), JSON.stringify({ season: data.season }));
    const save = () => fs.writeFileSync(path.join(root, `content/match-centre/liverpool/${data.season}.json`), JSON.stringify(data));
    save();
    run(root, data, save);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
}
function write(root, article) {
  const { body, ...metadata } = article;
  fs.writeFileSync(path.join(root, `content/articles/liverpool/${article.slug}.md`), matter.stringify(body, metadata));
}
const article = (fixture, category = 'Preview') => ({
  title: 'An editorial headline', slug: 'qa-match-writing', date: '2026-09-17',
  category, season: '2026-27', fixtureId: fixture.id,
  historicalEventDate: fixture.date, oppositionIds: [fixture.oppositionId], competitionIds: [fixture.competitionId],
  body: 'Preserved manuscript for this test.',
});

test('previews and reports require explicit match references; existing Opinion stays Opinion', () => {
  const f = getTestMatchCentre().fixtures[0];
  for (const category of ['Preview', 'Match report']) {
    assert.equal(ArticleSchema.safeParse(article(f, category)).success, true);
    for (const missing of ['season', 'fixtureId']) assert.equal(ArticleSchema.safeParse({ ...article(f, category), [missing]: undefined }).success, false);
  }
  assert.equal(ArticleSchema.parse({ title: 'Existing opinion', slug: 'existing-opinion', date: '2026-09-17', body: 'Text.' }).category, 'Opinion');
});

test('unknown/mismatched references and reports of unfinished matches fail validation', () => withContent((root, data) => {
  const f = data.fixtures.find(fixture => fixture.status === 'scheduled');
  for (const [change, error] of [
    [{ fixtureId: 'unknown-fixture' }, /does not exist/],
    [{ historicalEventDate: '2026-07-01' }, /historicalEventDate/],
    [{ oppositionIds: ['everton'] }, /oppositionIds/],
    [{ competitionIds: ['fa-cup'] }, /competitionIds/],
    [{ category: 'Match report' }, /recorded completed fixture/],
  ]) {
    write(root, { ...article(f), ...change });
    assert.throws(() => getArticles(root), error);
  }
}));

test('article references use their own season after the current pointer changes', () => withContent((root, data) => {
  write(root, article(data.fixtures[0], 'Match report'));
  fs.writeFileSync(path.join(root, 'content/match-centre/liverpool/current.json'), JSON.stringify({ season: '2027-28' }));
  assert.equal(getArticles(root).find(item => item.slug === 'qa-match-writing').fixtureId, data.fixtures[0].id);
}));

test('Articles includes written previews/reports exactly once, never empty fixtures or unrelated historical prose', () => withContent((root, data, save) => {
  const f = data.fixtures.find(fixture => fixture.status === 'scheduled');
  f.preview = { title: 'Saved public preview', body: 'Original saved preview prose.', updatedAt: data.updatedAt, sourceIds: f.sourceIds };
  save();
  write(root, article(data.fixtures[0], 'Match report'));
  const collection = getArticleCollection(root);
  assert.equal(new Set(collection.map(item => item.href)).size, collection.length);
  assert.equal(collection.filter(item => item.title === 'Saved public preview').length, 1);
  assert.equal(collection.find(item => item.title === 'Saved public preview').body, f.preview.body);
  assert.ok(collection.some(item => item.category === 'Match report' && item.href === '/articles/qa-match-writing'));
  assert.ok(collection.some(item => item.href === `/archive/${data.fixtures[0].reportSlug}`));
  assert.ok(!collection.some(item => item.href === '/archive/phil-thompson'));
  assert.equal(collection.filter(item => item.href.startsWith('/match-centre')).length, 1);
  fs.mkdirSync(path.join(root, 'docs/editorial/drafts'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs/editorial/drafts/private-match.md'), 'PRIVATE_MATCH_DRAFT');
  assert.ok(!JSON.stringify(getArticleCollection(root)).includes('PRIVATE_MATCH_DRAFT'));
}));

test('context retains home-away score order and keeps a completed match preview free of retrospective results', () => {
  const f = { ...getTestMatchCentre().fixtures[0], side: 'away', status: 'completed', score: { home: 1, away: 2 } };
  assert.match(matchContext(f, true), /Newcastle United 1–2 Liverpool/);
  assert.match(matchContext(f, false), /Newcastle United v Liverpool/);
  assert.doesNotMatch(matchContext(f, false), /1–2/);
  const penalties = { ...f, score: { home: 1, away: 1 }, afterExtraTime: true, penalties: { home: 3, away: 4 } };
  assert.match(matchContext(penalties, true), /After extra time; 3–4 on penalties \(home–away\)/);
});

test('homepage surfaces only written coverage, using canonical article links and existing time windows', () => {
  const next = { id: 'qa-next', date: '2026-10-18', kickoff: '2026-10-18T16:30:00+01:00', status: 'scheduled' };
  const previous = { id: 'qa-last', date: '2026-10-17', status: 'completed', score: { home: 1, away: 2 } };
  const preview = { ...article(next), href: '/articles/qa-preview', category: 'Preview' };
  const report = { ...article(previous, 'Match report'), href: '/articles/qa-report', date: '2026-10-17' };
  const now = new Date('2026-10-17T20:00:00Z');
  assert.equal(selectHomeCoverage({ fixtures: [next, previous] }, [], now), undefined);
  assert.equal(selectHomeCoverage({ fixtures: [next, previous] }, [], now, [preview, report]).href, preview.href);
  assert.equal(selectHomeCoverage({ fixtures: [previous] }, [], now, [report]).href, report.href);
  assert.equal(selectHomeCoverage({ fixtures: [previous] }, [], new Date('2026-10-20T00:00:00Z'), [report]), undefined);
  assert.equal(selectHomeLead([preview, report], now).href, report.href);
  assert.equal(selectHomeCoverage({ fixtures: [next], season: '2027-28' }, [], now, [preview]), undefined);
  const futureUpdate = { ...next, preview: { title: 'Future update', body: 'Prose.', updatedAt: '2026-10-17T21:00:00Z' } };
  const legacyProjection = { ...preview, href: '/match-centre#match-preview' };
  assert.equal(selectHomeCoverage({ fixtures: [futureUpdate] }, [], now, [legacyProjection]), undefined);
});
