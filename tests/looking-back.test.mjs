import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const { LookingBackSchema } = await import('../lib/content/types.ts');
const { getLookingBack, LOOKING_BACK_DISCLOSURE } = await import('../lib/content/looking-back.ts');

const valid = {
  title: 'Rush scores four as Liverpool run riot at Goodison', slug: 'rush-scores-four-everton-1982',
  date: '2026-11-01', eventDate: '1982-11-06', dateline: 'Goodison Park · Saturday 6 November 1982 · First Division',
  scoreline: 'Everton 0 Liverpool 5', excerpt: "Ian Rush's four goals in a 5–0 win at Goodison Park.", body: 'Body.',
};

test('a complete keepsake parses; the scoreline is optional', () => {
  assert.equal(LookingBackSchema.parse(valid).slug, valid.slug);
  const noScore = { ...valid }; delete noScore.scoreline;
  assert.equal(LookingBackSchema.parse(noScore).scoreline, undefined);
});

test('the schema rejects missing fields, bad dates, extra fields and multi-sentence excerpts', () => {
  for (const field of ['title', 'slug', 'date', 'eventDate', 'dateline', 'excerpt']) {
    const rest = { ...valid }; delete rest[field];
    assert.throws(() => LookingBackSchema.parse(rest), undefined, `missing ${field}`);
  }
  assert.throws(() => LookingBackSchema.parse({ ...valid, date: '1 November 2026' }));
  assert.throws(() => LookingBackSchema.parse({ ...valid, eventDate: '1982-11-31' }));
  assert.throws(() => LookingBackSchema.parse({ ...valid, eventDate: '2026-11-02' }), /eventDate/);
  assert.throws(() => LookingBackSchema.parse({ ...valid, sources: ['https://example.com'] }));
  assert.throws(() => LookingBackSchema.parse({ ...valid, excerpt: 'One sentence. And another.' }));
  assert.throws(() => LookingBackSchema.parse({ ...valid, excerpt: 'No closing punctuation' }));
  assert.throws(() => LookingBackSchema.parse({ ...valid, slug: 'Not A Slug' }));
});

test('the loader fails the build on a mismatched slug and lists newest first', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'looking-back-'));
  const dir = path.join(root, 'content/looking-back');
  const write = (file, data) => fs.writeFileSync(path.join(dir, file), `---\n${Object.entries(data).map(([k, v]) => `${k}: "${v}"`).join('\n')}\n---\nBody.\n`);
  try {
    fs.mkdirSync(dir, { recursive: true });
    const front = { ...valid }; delete front.body;
    write('older.md', { ...front, slug: 'older', date: '2026-10-25' });
    write('newer.md', { ...front, slug: 'newer', date: '2026-11-01' });
    assert.deepEqual(getLookingBack(root).map(p => p.slug), ['newer', 'older']);
    write('wrong.md', { ...front, slug: 'different' });
    assert.throws(() => getLookingBack(root), /wrong\.md.*must match filename/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('the published Rush keepsake is valid and the disclosure lives only in the template', () => {
  const rush = getLookingBack().find(p => p.slug === 'rush-scores-four-everton-1982');
  assert.equal(rush.eventDate, '1982-11-06');
  assert.equal(rush.scoreline, 'Everton 0 Liverpool 5');
  for (const file of fs.readdirSync('content/looking-back')) {
    assert.ok(!fs.readFileSync(path.join('content/looking-back', file), 'utf8').includes(LOOKING_BACK_DISCLOSURE));
  }
  assert.match(fs.readFileSync('app/looking-back/[slug]/page.tsx', 'utf8'), /LOOKING_BACK_DISCLOSURE/);
});

test('Looking Back is in the main navigation after Football Observed, and History has not returned', () => {
  const header = fs.readFileSync('app/components/SiteHeader.tsx', 'utf8');
  assert.ok(header.indexOf('"Football Observed"') < header.indexOf('"Looking Back"'));
  for (const dir of ['app/history', 'app/this-week', 'content/history', 'content/this-week']) assert.equal(fs.existsSync(dir), false);
});
