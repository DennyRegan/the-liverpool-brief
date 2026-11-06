import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const { ArticleSchema } = await import('../lib/content/types.ts');
const { getArticles } = await import('../lib/content/articles.ts');
const { getWriting } = await import('../lib/content/writing.ts');
const { knownPlayers, playerName } = await import('../lib/content/player-names.ts');
const { getPlayerArticles, getPlayerPageSlugs, PLAYER_PAGE_MINIMUM } = await import('../lib/content/players.ts');

test('players is an optional list of slugs', () => {
  const base = { title: 'T', date: '2026-10-31', slug: 't', body: 'Body.' };
  assert.equal(ArticleSchema.parse(base).players, undefined);
  assert.deepEqual(ArticleSchema.parse({ ...base, players: ['alexander-isak'] }).players, ['alexander-isak']);
  assert.throws(() => ArticleSchema.parse({ ...base, players: ['Alexander Isak'] }));
});

test('an unknown player slug fails the build', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'players-'));
  try {
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    fs.writeFileSync(path.join(root, 'content/articles/liverpool/unknown-player.md'), '---\ntitle: Unknown\ndate: "2026-10-31"\nplayers: ["not-a-player"]\n---\nBody.\n');
    assert.throws(() => getArticles(root), /unknown player "not-a-player"/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('player pages exist only for players with three or more articles, listed newest first', () => {
  const pages = getPlayerPageSlugs();
  for (const slug of knownPlayers()) {
    assert.equal(pages.includes(slug), getPlayerArticles(slug).length >= PLAYER_PAGE_MINIMUM, slug);
  }
  for (const slug of pages) {
    const dates = getPlayerArticles(slug).map(article => article.date);
    assert.deepEqual(dates, [...dates].sort().reverse(), slug);
  }
  assert.deepEqual(pages.map(playerName), ['Alexander Isak', 'Dominik Szoboszlai', 'Florian Wirtz', 'Kenny Dalglish', 'Ronald Araújo', 'Víctor Muñoz']);
});

test('every registered player is tagged somewhere, and no article is tagged twice with the same player', () => {
  const tagged = new Set(getWriting().flatMap(article => article.players ?? []));
  for (const slug of knownPlayers()) assert.ok(tagged.has(slug), `${slug} is in content/players.json but tags no article`);
  for (const article of getWriting()) assert.equal(new Set(article.players ?? []).size, (article.players ?? []).length, article.href);
});

test('tags show at the foot of article and Archive pages', () => {
  assert.match(fs.readFileSync('app/articles/[slug]/page.tsx', 'utf8'), /<PlayerTags players=\{article\.players\} \/>/);
  assert.match(fs.readFileSync('app/archive/[slug]/page.tsx', 'utf8'), /<PlayerTags players=\{feature\.players\} \/>/);
});
