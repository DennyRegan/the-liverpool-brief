import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getEditionNeighbours, getReganOnFootballEditions, isReganOnFootball } from '../lib/content/regan-on-football.ts';
import { getWriting } from '../lib/content/writing.ts';
import { selectHomeLead } from '../lib/content/homepage.ts';
import { articleMetadata } from '../lib/social-metadata.ts';

test('only Opinion articles with the exact column tag qualify', () => {
  assert.equal(isReganOnFootball({ category: 'Opinion', tags: ['football', 'regan-on-football'] }), true);
  for (const article of [
    { category: 'Opinion' }, { category: 'Opinion', tags: [] },
    { category: 'Opinion', tags: ['Regan on Football'] },
    { category: 'Opinion', tags: ['regan-on-football-extra'] },
    { category: 'Analysis', tags: ['regan-on-football'] },
    { category: 'History', tags: ['regan-on-football'] },
  ]) assert.equal(isReganOnFootball(article), false);
});

test('editions use the existing loader, sort deterministically and remain ordinary canonical writing', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'regan-column-'));
  try {
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    const directory = path.join(root, 'content/articles/liverpool');
    fs.rmSync(directory, { recursive: true });
    fs.mkdirSync(directory, { recursive: true });
    assert.deepEqual(getReganOnFootballEditions(root), []);
    // Local editorial manuscripts are not editions, even with the right tag/date.
    fs.mkdirSync(path.join(root, 'drafts'), { recursive: true });
    fs.writeFileSync(path.join(root, 'drafts', 'forthcoming.md'),
      '---\ntitle: Unapproved edition\ndate: "2026-10-30"\ncategory: Opinion\ntags: [regan-on-football]\n---\nPrivate draft.');
    assert.deepEqual(getReganOnFootballEditions(root), []);
    const write = (slug, date, category, tags) => fs.writeFileSync(path.join(directory, `${slug}.md`),
      `---\ntitle: ${slug}\ndate: "${date}"\ncategory: ${category}\ntags: ${JSON.stringify(tags)}\n---\nTest fixture body.\n`);
    write('column-old', '2026-10-01', 'Opinion', ['regan-on-football']);
    assert.deepEqual(getReganOnFootballEditions(root).map(a => a.slug), ['column-old']);
    write('column-z', '2026-10-20', 'Opinion', ['regan-on-football']);
    write('column-a', '2026-10-20', 'Opinion', ['regan-on-football']);
    write('ordinary', '2026-10-21', 'Opinion', []);
    write('analysis', '2026-10-22', 'Analysis', ['regan-on-football']);
    const editions = getReganOnFootballEditions(root);
    assert.deepEqual(editions.map(a => a.slug), ['column-a', 'column-z', 'column-old']);
    const writing = getWriting(root);
    for (const article of editions) {
      assert.equal(writing.filter(a => a.href === `/articles/${article.slug}`).length, 1);
      assert.equal(articleMetadata(article, '').alternates.canonical, `/articles/${article.slug}`);
      assert.equal(article.category, 'Opinion');
    }
    // Column editions receive no perpetual lead or priority over newer writing.
    const now = new Date('2026-10-23T12:00:00Z');
    assert.equal(selectHomeLead(writing, now).slug, 'analysis');
    assert.equal(selectHomeLead(writing.filter(a => a.category === 'Opinion'), now).slug, 'ordinary');
    assert.equal(selectHomeLead(writing.filter(a => isReganOnFootball(a)), now).slug, 'column-a');
    assert.deepEqual(getEditionNeighbours(editions, 'column-z'), { newer: editions[0], older: editions[2] });
    assert.equal(getEditionNeighbours(editions, 'column-a').newer, undefined);
    assert.equal(getEditionNeighbours(editions, 'column-old').older, undefined);
    assert.deepEqual(getEditionNeighbours(editions, 'forthcoming'), {});
    fs.unlinkSync(path.join(directory, 'column-z.md'));
    assert.equal(getEditionNeighbours(getReganOnFootballEditions(root), 'column-a').older.slug, 'column-old');
    assert.equal(getEditionNeighbours([editions[0]], 'column-a').older, undefined);
    assert.deepEqual(getEditionNeighbours([], 'column-a'), {});
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
