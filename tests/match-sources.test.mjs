import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const archiveDirectory = fileURLToPath(new URL('../content/archive/liverpool/', import.meta.url));

test('published match reports retain source lists unless Denny explicitly approves an exception', () => {
  for (const file of fs.readdirSync(archiveDirectory).filter(name => name.endsWith('.md'))) {
    const { data, content } = matter(fs.readFileSync(path.join(archiveDirectory, file), 'utf8'));
    if (data.articleType !== 'match' && data.category !== 'match') continue;

    const sections = content.split(/^## Sources\s*$/m);
    // Denny explicitly requested no public source list on 16 October 2026.
    // Retrieved evidence remains in docs/research/lask-liverpool-2026-10-14-editor-notes.md.
    if (file === 'lask-liverpool-2026-10-14.md') {
      assert.equal(sections.length, 1, `${file}: Denny requested no public Sources section`);
      assert.equal(data.sources, undefined, `${file}: keep evidence in editorial notes`);
      continue;
    }
    assert.equal(sections.length, 2, `${file}: expected one Sources section`);
    assert.match(sections[1], /^\s*- \[[^\]]+\]\(https:\/\/[\s\S]+\)\s*$/m, `${file}: expected a linked source`);
    assert.doesNotMatch(sections[1], /^## /m, `${file}: Sources must be the last section`);
  }
});
