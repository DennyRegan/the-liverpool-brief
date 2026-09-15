import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getArchiveFeatures, getHistoryBrowseArticles } from '../lib/content/archive.ts';

test('only approved reports enter Matches; existing player articles wait for review', () => {
  assert.deepEqual(getHistoryBrowseArticles('matches').map(a => a.slug).sort(), [
    'alonso-own-half-newcastle-2006',
    'anfield-first-european-match-reykjavik-1964',
    'forshaw-hat-trick-manchester-united-1925',
    'fowler-scoring-debut-fulham-1993',
    'henderson-chelsea-winner-2016',
    'leeds-liverpool-1971-early-winner',
    'liverpool-bayern-1971-alun-evans',
    'tottenham-liverpool-1971-heighway-clemence',
    'liverpool-everton-1971-brian-hall',
    'liverpool-arsenal-1971-fa-cup-final',
    'liverpool-arsenal-1971-ian-ross',
    'liverpool-derby-1971-jack-whitham',
    'liverpool-everton-1972-four-goal-derby',
    'liverpool-newcastle-1972-five-goals',
    'manchester-united-liverpool-1972-thompson-debut',
    'derby-liverpool-1972-mcgovern-title-race',
    'liverpool-manchester-city-1972-opening-day',
    'liverpool-sheffield-united-1972-five-goals',
    'leeds-liverpool-1972-phil-boersma',
    'liverpool-arsenal-1971-toshack-smith',
    'liverpool-everton-comeback-1970',
    'liverpool-monaco-champions-league-2004',
    'liverpool-stromsgodset-record-win-1974',
    'mcmahon-four-fulham-ten-goals-1986',
    'saunders-four-kuusysi-european-return-1991',
    'steve-nicol-hat-trick-newcastle-1987',
    'torres-babel-six-goals-hull-2009',
    'torres-first-hat-trick-reading-2007',
    'whelan-wembley-final-tottenham-1982',
  ].sort());
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

test('player biographies sort by the canonical subject first name, independently of title and publication date', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'history-player-order-'));
  try {
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    for (const slug of ['phil-thompson', 'john-barnes-1987']) {
      const filename = path.join(root, 'content/archive/liverpool', `${slug}.md`);
      const original = fs.readFileSync(filename, 'utf8');
      fs.writeFileSync(filename, original.replace('articleType: "player"', 'articleType: "player"\neditorialMode: "factual"')
        .replace(/^title:.*$/m, `title: "${slug === 'phil-thompson' ? 'A captain' : 'Z winger'}"`));
    }
    // Put first-name order in conflict with surname order.
    const entitiesPath = path.join(root, 'content/history/liverpool/entities.json');
    const entities = JSON.parse(fs.readFileSync(entitiesPath, 'utf8'));
    entities.find(entity => entity.id === 'phil-thompson').label = 'Alan Thompson';
    fs.writeFileSync(entitiesPath, JSON.stringify(entities));
    assert.deepEqual(getHistoryBrowseArticles('players', root).map(a => a.slug), ['phil-thompson', 'john-barnes-1987']);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
