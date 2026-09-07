import test from 'node:test';
import assert from 'node:assert/strict';
import { selectHomeWriting } from '../lib/content/homepage.ts';

const piece = (category, date, slug) => ({ category, date, href: `/${category.toLowerCase()}/${slug}` });

test('the homepage selects one latest Opinion and one latest Archive independently', () => {
  const archive = piece('Archive', '2026-08-01', 'archive');
  const opinion = piece('Opinion', '2026-09-06', 'latest');
  const writing = [
    piece('Opinion', '2026-09-04', 'older'), archive,
    piece('Opinion', '2026-09-05', 'recent'), opinion,
    piece('Archive', '2026-07-01', 'old-archive'),
  ];
  const before = [...writing];
  assert.deepEqual(selectHomeWriting(writing), { opinion, archive });
  assert.deepEqual(writing, before);
});

test('new Archive articles replace only the Archive selection', () => {
  const opinion = piece('Opinion', '2026-09-01', 'opinion');
  const archive = piece('Archive', '2026-09-06', 'new-archive');
  assert.deepEqual(selectHomeWriting([
    piece('Archive', '2026-09-02', 'old-archive'), archive, opinion,
  ]), { opinion, archive });
});

test('missing categories stay empty rather than showing the wrong kind of article', () => {
  const opinion = piece('Opinion', '2026-09-06', 'opinion');
  assert.deepEqual(selectHomeWriting([opinion]), { opinion, archive: undefined });
  const archive = piece('Archive', '2026-09-06', 'archive');
  assert.deepEqual(selectHomeWriting([archive]), { opinion: undefined, archive });
  assert.deepEqual(selectHomeWriting([]), { opinion: undefined, archive: undefined });
});

test('publication-date ties have a stable URL-based selection', () => {
  const a = piece('Opinion', '2026-09-06', 'a');
  const b = piece('Opinion', '2026-09-06', 'b');
  assert.equal(selectHomeWriting([b, a]).opinion, a);
  assert.equal(selectHomeWriting([a, b]).opinion, a);
});
