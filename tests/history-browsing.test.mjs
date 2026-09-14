import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getArchiveFeatures, getHistoryBrowseArticles } from '../lib/content/archive.ts';

test('only the two approved reports enter Matches; existing player articles wait for review', () => {
  assert.deepEqual(getHistoryBrowseArticles('matches').map(a => a.slug).sort(), [
    'alonso-own-half-newcastle-2006', 'steve-nicol-hat-trick-newcastle-1987',
  ]);
  assert.deepEqual(getHistoryBrowseArticles('players'), []);
  assert.equal(getArchiveFeatures().filter(a => a.editorialMode !== 'factual').length, 6);
});

test('future player content needs explicit approval and player type; shared player tags do not create profiles', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'history-browse-'));
  try {
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    const filename = path.join(root, 'content/archive/liverpool/phil-thompson.md');
    const original = fs.readFileSync(filename, 'utf8');
    fs.writeFileSync(filename, original.replace('articleType: "player"', 'articleType: "player"\neditorialMode: "factual"'));
    assert.deepEqual(getHistoryBrowseArticles('players', root).map(a => a.slug), ['phil-thompson']);
    fs.writeFileSync(filename, original.replace('articleType: "player"', 'articleType: "manager"\neditorialMode: "factual"'));
    assert.deepEqual(getHistoryBrowseArticles('players', root), []);
    fs.writeFileSync(filename, original.replace('articleType: "player"', 'articleType: "player"\neditorialMode: "opinion"'));
    assert.deepEqual(getHistoryBrowseArticles('players', root), []);
    fs.writeFileSync(filename, original.replace('articleType: "player"', 'articleType: "player"\neditorialMode: "automatic"'));
    assert.throws(() => getArchiveFeatures(root), /phil-thompson/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
