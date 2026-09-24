import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const archiveDirectory = fileURLToPath(new URL('../content/archive/liverpool/', import.meta.url));

test('every published match report ends with a visible source list', () => {
  for (const file of fs.readdirSync(archiveDirectory).filter(name => name.endsWith('.md'))) {
    const { data, content } = matter(fs.readFileSync(path.join(archiveDirectory, file), 'utf8'));
    if (data.articleType !== 'match' && data.category !== 'match') continue;

    const sections = content.split(/^## Sources\s*$/m);
    assert.equal(sections.length, 2, `${file}: expected one Sources section`);
    assert.match(sections[1], /^\s*- \[[^\]]+\]\(https:\/\/[\s\S]+\)\s*$/m, `${file}: expected a linked source`);
    assert.doesNotMatch(sections[1], /^## /m, `${file}: Sources must be the last section`);
  }
});
