import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const seasons = await import('../lib/content/seasons.ts');

test('all 67 restored seasons load, newest first, and every person and competition has a name', () => {
  const all = seasons.getSeasons();
  assert.equal(all.length, 67);
  assert.equal(all[0].season, '2025-26');
  assert.equal(all[all.length - 1].season, '1959-60');
  assert.deepEqual(all.map(s => s.season), [...all.map(s => s.season)].sort().reverse());
  assert.equal(seasons.getSeasons().every(s => s.sources.length > 0), true);
});

test('hub summary, labels and finishes read as written', () => {
  const summary = seasons.getSeasonsSummary();
  assert.deepEqual(summary, { count: 67, newest: '2025-26', oldest: '1959-60' });
  assert.equal(seasons.leagueSpan(summary.oldest, summary.newest), '1959–60 to 2025–26');
  assert.deepEqual([1, 2, 3, 11, 12, 22].map(seasons.leagueFinish), ['Champions', '2nd', '3rd', '11th', '12th', '22nd']);
});

test('an unnamed ID or a mismatched filename fails the build', () => {
  const root = fs.mkdtempSync('/tmp/seasons-');
  fs.mkdirSync(`${root}/content/looking-back/seasons`, { recursive: true });
  fs.copyFileSync('content/looking-back/seasons/1985-86.json', `${root}/content/looking-back/seasons/1985-86.json`);
  fs.writeFileSync(`${root}/content/looking-back/season-names.json`, '{}');
  assert.throws(() => seasons.getSeasons(root), /has no name in season-names\.json/);
  fs.renameSync(`${root}/content/looking-back/seasons/1985-86.json`, `${root}/content/looking-back/seasons/1986-87.json`);
  assert.throws(() => seasons.getSeasons(root), /must match its filename/);
  assert.deepEqual(seasons.getSeasons('/nonexistent-root'), []);
});

test('Seasons is a Looking Back section: reserved slug, hub row, and no History routes return', async () => {
  const { RESERVED_LOOKING_BACK_SEGMENTS } = await import('../lib/content/looking-back.ts');
  assert.ok(RESERVED_LOOKING_BACK_SEGMENTS.includes('seasons'));
  assert.match(fs.readFileSync('app/looking-back/page.tsx', 'utf8'), /SEASONS_PATH/);
  assert.equal(fs.existsSync('app/looking-back/seasons/page.tsx'), true);
  assert.equal(fs.existsSync('app/looking-back/seasons/[season]/page.tsx'), true);
  assert.equal(fs.existsSync('content/history'), false);
});
