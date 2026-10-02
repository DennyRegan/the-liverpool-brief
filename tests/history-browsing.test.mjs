import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getArchiveFeatures, getHistoryBrowseArticles } from '../lib/content/archive.ts';

test('factual matches and players follow the current canonical public collection', () => {
  const canonical = getArchiveFeatures();
  for (const [section, type] of [['matches', 'match'], ['players', 'player']]) {
    const actual = getHistoryBrowseArticles(section);
    const expected = canonical.filter(a => a.editorialMode === 'factual' && a.articleType === type);
    assert.deepEqual(actual.map(a => a.slug).sort(), expected.map(a => a.slug).sort());
    assert.equal(new Set(actual.map(a => a.slug)).size, actual.length);
    for (const a of actual) assert.ok(canonical.some(p => p.slug === a.slug));
  }
});

test('future player content needs explicit approval and player type; shared player tags do not create profiles', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'history-browse-'));
  try {
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    const unchanged = getHistoryBrowseArticles('players', root).map(a => a.slug);
    const withoutThompson = unchanged.filter(slug => slug !== 'phil-thompson');
    const filename = path.join(root, 'content/archive/liverpool/phil-thompson.md');
    const original = fs.readFileSync(filename, 'utf8').replace(/^editorialMode:.*\n/m, '');
    fs.writeFileSync(filename, original.replace('articleType: "player"', 'articleType: "player"\neditorialMode: "factual"'));
    assert.deepEqual(getHistoryBrowseArticles('players', root).map(a => a.slug), unchanged);
    fs.writeFileSync(filename, original.replace('articleType: "player"', 'articleType: "manager"\neditorialMode: "factual"'));
    assert.deepEqual(getHistoryBrowseArticles('players', root).map(a => a.slug), withoutThompson);
    fs.writeFileSync(filename, original.replace('articleType: "player"', 'articleType: "player"\neditorialMode: "opinion"'));
    assert.deepEqual(getHistoryBrowseArticles('players', root).map(a => a.slug), withoutThompson);
    fs.writeFileSync(filename, original.replace('articleType: "player"', 'articleType: "player"\neditorialMode: "automatic"'));
    assert.throws(() => getArchiveFeatures(root), /phil-thompson/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('player biographies sort by the canonical subject first name, independently of title and publication date', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'history-player-order-'));
  try {
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    for (const slug of ['phil-thompson', 'john-barnes-1987']) {
      const filename = path.join(root, 'content/archive/liverpool', `${slug}.md`);
      const original = fs.readFileSync(filename, 'utf8').replace(/^editorialMode:.*\n/m, '');
      fs.writeFileSync(filename, original.replace('articleType: "player"', 'articleType: "player"\neditorialMode: "factual"')
        .replace(/^title:.*$/m, `title: "${slug === 'phil-thompson' ? 'A captain' : 'Z winger'}"`));
    }
    // Put first-name order in conflict with surname order.
    const entitiesPath = path.join(root, 'content/history/liverpool/entities.json');
    const entities = JSON.parse(fs.readFileSync(entitiesPath, 'utf8'));
    entities.find(entity => entity.id === 'phil-thompson').label = 'Alan Thompson';
    fs.writeFileSync(entitiesPath, JSON.stringify(entities));
    assert.deepEqual(getHistoryBrowseArticles('players', root).filter(a => ['phil-thompson', 'john-barnes-1987'].includes(a.slug)).map(a => a.slug), ['phil-thompson', 'john-barnes-1987']);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
