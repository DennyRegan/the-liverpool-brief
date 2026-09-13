import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { registerHooks } from 'node:module';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getSeasons, SeasonSchema, getSeasonArchiveArticles } from '../lib/content/seasons.ts';
import { getArchiveFeatures } from '../lib/content/archive.ts';
import { ArchiveFeatureSchema } from '../lib/content/types.ts';

// Compile JSX with the existing TypeScript dependency; retain node:test and real Next links.
const hooks = registerHooks({
  resolve(specifier, context, next) {
    return next(specifier === 'next/link' ? 'next/link.js' : specifier, context);
  },
  load(url, context, next) {
    if (!url.endsWith('.tsx')) return next(url, context);
    return { format: 'module', shortCircuit: true, source: ts.transpileModule(
      fs.readFileSync(new URL(url), 'utf8'),
      { compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX } },
    ).outputText };
  },
});
const { SeasonNavigation } = await import('../app/components/SeasonNavigation.tsx');
const { ArchiveSeasonLink } = await import('../app/components/ArchiveSeasonLink.tsx');
hooks.deregister();
const render = (component, props) => renderToStaticMarkup(createElement(component, props));
const records = ['1986-87', '1987-88', '1988-89'].map(season => ({ season }));
const nav = (season, seasons = records) => render(SeasonNavigation, { season, seasons });
const hrefs = html => [...html.matchAll(/href="([^"]+)"/g)].map(match => match[1]);

test('middle season renders both chronological destinations', () => {
  assert.deepEqual(hrefs(nav('1987-88')), ['/history/seasons/1986-87', '/history/seasons/1988-89']);
  assert.match(nav('1987-88'), /rel="prev"/);
  assert.match(nav('1987-88'), /rel="next"/);
});
test('first published season renders only next', () => {
  assert.deepEqual(hrefs(nav('1986-87')), ['/history/seasons/1987-88']);
  assert.doesNotMatch(nav('1986-87'), /rel="prev"/);
});
test('latest published season renders only previous', () => {
  assert.deepEqual(hrefs(nav('1988-89')), ['/history/seasons/1987-88']);
  assert.doesNotMatch(nav('1988-89'), /rel="next"/);
});
test('navigation skips missing seasons and never guesses URLs', () => {
  const sparse = [records[0], records[2]];
  assert.deepEqual(hrefs(nav('1986-87', sparse)), ['/history/seasons/1988-89']);
  assert.deepEqual(hrefs(nav('1988-89', sparse)), ['/history/seasons/1986-87']);
  assert.equal(nav('1987-88', sparse), '');
  assert.equal(nav('1987-88', [records[1]]), '');
});
test('adding a JSON record changes rendered navigation without application changes', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'season-navigation-'));
  try {
    fs.cpSync('content/history', path.join(root, 'content/history'), { recursive: true });
    const before = getSeasons(root);
    const latest = before.at(-1);
    assert.doesNotMatch(nav(latest.season, before), /rel="next"/);
    const year = Number(latest.season.slice(0, 4)) + 1;
    const season = `${year}-${String((year + 1) % 100).padStart(2, '0')}`;
    // Schema-valid synthetic test record; no historical claims are published.
    fs.writeFileSync(path.join(root, `content/history/liverpool/seasons/${season}.json`), JSON.stringify({ ...latest, season, relatedSeasons: [] }));
    const after = getSeasons(root);
    assert.ok(hrefs(nav(latest.season, after)).includes(`/history/seasons/${season}`));
    assert.deepEqual(hrefs(nav(season, after)), [`/history/seasons/${latest.season}`]);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
test('Archive return link renders only an existing canonical destination', () => {
  const link = article => render(ArchiveSeasonLink, { article, seasons: records });
  assert.deepEqual(hrefs(link({ season: '1987-88' })), ['/history/seasons/1987-88']);
  assert.match(link({ season: '1987-88' }), /Explore 1987–88/);
  assert.equal(link({ season: '1989-90' }), '');
  assert.equal(link({}), '');
  assert.equal(link({ season: '1987/88' }), '');
});
test('a new Archive file joins its season through metadata alone; career prose is not inferred', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-season-'));
  try {
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    const source = fs.readFileSync('content/archive/liverpool/john-barnes-1987.md', 'utf8');
    fs.writeFileSync(path.join(root, 'content/archive/liverpool/season-test-fixture.md'), source.replace('slug: "john-barnes-1987"', 'slug: "season-test-fixture"'));
    const articles = getArchiveFeatures(root);
    const selected = getSeasonArchiveArticles('1987-88', articles);
    assert.ok(selected.some(article => article.slug === 'john-barnes-1987'));
    const added = articles.find(article => article.slug === 'season-test-fixture');
    assert.ok(selected.includes(added)); // The original object, not copied into a Season.
    const career = articles.find(article => article.slug === 'phil-thompson');
    assert.equal(career.season, undefined);
    assert.equal(render(ArchiveSeasonLink, { article: career, seasons: getSeasons(root) }), '');
    assert.ok(!selected.includes(career));
    assert.equal(SeasonSchema.safeParse({ ...getSeasons(root)[0], relatedArticles: [added.slug] }).success, false);
    const unpublished = source.replace('slug: "john-barnes-1987"', 'slug: "unpublished-season-fixture"').replace('season: "1987-88"', 'season: "1892-93"');
    fs.writeFileSync(path.join(root, 'content/archive/liverpool/unpublished-season-fixture.md'), unpublished);
    const waiting = getArchiveFeatures(root).find(article => article.slug === 'unpublished-season-fixture');
    assert.equal(waiting.season, '1892-93'); // The loader accepts an unavailable canonical season.
    assert.equal(render(ArchiveSeasonLink, { article: waiting, seasons: getSeasons(root) }), '');

  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
test('both schemas require canonical consecutive IDs while Archive seasons remain optional and need not exist', () => {
  const article = getArchiveFeatures()[0];
  const season = getSeasons()[0];
  for (const id of ['1987/88', '1987–88', '87-88', '1987-1988', '1987-89', ' 1987-88']) {
    assert.equal(ArchiveFeatureSchema.safeParse({ ...article, season: id }).success, false, id);
    assert.equal(SeasonSchema.safeParse({ ...season, season: id }).success, false, id);
  }
  for (const id of ['1987-88', '1999-00', '1892-93', undefined]) {
    assert.equal(ArchiveFeatureSchema.safeParse({ ...article, season: id }).success, true, String(id));
  }
});
