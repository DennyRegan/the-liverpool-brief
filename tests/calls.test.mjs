import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const { ArticleSchema } = await import('../lib/content/types.ts');
const { getArticles, assertCallsQuoted } = await import('../lib/content/articles.ts');
const { getCalls } = await import('../lib/content/calls.ts');

const base = { title: 'T', date: '2026-10-31', slug: 't', body: 'Liverpool will win the league. **They will score 90 goals.**' };

test('calls are optional and need a claim and a known status', () => {
  assert.equal(ArticleSchema.parse(base).calls, undefined);
  const parsed = ArticleSchema.parse({ ...base, calls: [{ claim: 'Liverpool will win the league.', status: 'open' }, { claim: 'x', status: 'wrong', note: 'They finished second.' }] });
  assert.equal(parsed.calls.length, 2);
  for (const bad of [{ claim: 'x', status: 'maybe' }, { status: 'open' }, { claim: 'x', status: 'open', extra: 1 }]) {
    assert.throws(() => ArticleSchema.parse({ ...base, calls: [bad] }));
  }
});

test('a claim must be quoted word for word, ignoring only bold markers and line breaks', () => {
  assert.doesNotThrow(() => assertCallsQuoted([{ claim: 'Liverpool will win the league.' }, { claim: 'They will score 90 goals.' }], base.body));
  assert.throws(() => assertCallsQuoted([{ claim: 'Liverpool will win the title.' }], base.body), /word for word/);
  assert.throws(() => assertCallsQuoted([{ claim: 'liverpool will win the league.' }], base.body), /word for word/);
});

test('a paraphrased call fails the build', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'calls-'));
  try {
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    fs.writeFileSync(path.join(root, 'content/articles/liverpool/paraphrase.md'), '---\ntitle: P\ndate: "2026-10-31"\ncalls:\n  - claim: "Liverpool will definitely win."\n    status: open\n---\nLiverpool will win.\n');
    assert.throws(() => getArticles(root), /paraphrase\.md.*word for word/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('/calls collects every call, newest article first, with date, status and link', () => {
  const calls = getCalls();
  const total = getArticles().reduce((sum, article) => sum + (article.calls?.length ?? 0), 0);
  assert.equal(calls.length, total);
  const dates = calls.map(call => call.date);
  assert.deepEqual(dates, [...dates].sort().reverse());
  for (const call of calls) {
    assert.match(call.href, /^\/articles\/[a-z0-9-]+$/);
    assert.ok(['open', 'right', 'wrong'].includes(call.status));
  }
  const page = fs.readFileSync('app/calls/page.tsx', 'utf8');
  assert.match(page, /Predictions made on this site, and how they turned out\./);
  assert.match(fs.readFileSync('app/layout.tsx', 'utf8'), /<Link href="\/calls">Calls<\/Link>/);
});

test('each call shows its article\'s own publication date and links with the article title as the link text', () => {
  const articles = new Map(getArticles().map(article => [`/articles/${article.slug}`, article]));
  for (const call of getCalls()) {
    const article = articles.get(call.href);
    assert.equal(call.date, article.date, call.href);
    assert.equal(call.title, article.title, call.href);
  }
  assert.match(fs.readFileSync('app/calls/page.tsx', 'utf8'), /From <Link href=\{call\.href\}>\{call\.title\}<\/Link>/);
});
