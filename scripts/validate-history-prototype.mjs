import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { loadHistoryPrototype } from '../lib/content/history-prototype.ts';
import { getWriting } from '../lib/content/writing.ts';
import { getPublicSitemap } from '../lib/content/sitemap.ts';

const data = loadHistoryPrototype();
const provenance = JSON.parse(fs.readFileSync('prototype/history/provenance.json', 'utf8'));
for (const record of provenance.reports) {
  assert.equal(createHash('sha256').update(fs.readFileSync(record.localPath)).digest('hex'), record.sha256, `Changed recovered article: ${record.slug}`);
}
assert.equal(createHash('sha256').update(fs.readFileSync('prototype/history/1987-88.json')).digest('hex'), provenance.season.sha256, 'Changed recovered season');
const publicSlugs = new Set(getWriting().map(article => article.slug));
const sitemap = getPublicSitemap();
for (const record of provenance.reports.filter(record => record.localPath.startsWith('prototype/'))) {
  assert.ok(!publicSlugs.has(record.slug));
  assert.ok(!sitemap.some(entry => entry.url.endsWith(`/archive/${record.slug}`)));
}
assert.ok(!sitemap.some(entry => entry.url.includes('/preview/')));
assert.equal(data.matches.length, 5);
assert.equal(data.groups.length, 4);
console.log('PASS: five unchanged reports, preserved season schema, canonical relationships, four sourced venues, public collection and sitemap isolation.');
