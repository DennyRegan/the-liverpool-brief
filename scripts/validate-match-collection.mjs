import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { getMatchCollection, readMatchManifest, matchSeasons, getFeaturedMatches } from '../lib/content/match-collection.ts';
import { getHistoryLibrary } from '../lib/content/history-library.ts';
import { getHistoryEntities } from '../lib/content/entities.ts';
const manifest = readMatchManifest();
const matches = getMatchCollection(process.cwd(), true);
const entities = new Map(getHistoryEntities().map(e => [e.id, e.kind]));
for (const match of matches) {
 for (const [field, kind] of Object.entries({ playerIds: 'person', managerIds: 'person', oppositionIds: 'opposition', competitionIds: 'competition', locationIds: 'location', themeIds: 'theme' })) {
  for (const id of match[field] ?? []) assert.equal(entities.get(id), kind, `${match.slug}: unknown ${field}: ${id}`);
 }
 const review = match.review;
 if (match.publication !== 'published') {
  const source = execFileSync('git', ['show', `${review.sourceRef}:${review.sourcePath}`]);
  assert.deepEqual(fs.readFileSync(review.localPath), source, `Preserved manuscript changed: ${match.slug}`);
 }
 assert.ok(!review.assessment.outcome.includes('approved'), 'Preparation must never grant approval');
}
const featured = getFeaturedMatches(getHistoryLibrary());
assert.ok(featured.length <= 3);
assert.ok(featured.every(a => a.publication === 'published'));
const publicMatches = getMatchCollection();
assert.equal(publicMatches.length, 2);
assert.equal(matches.filter(a => a.season === '1987-88').length, 12);
assert.equal(manifest.reports.filter(r => r.status === 'published-opinion').length, 2);
console.log(`PASS: ${matches.length} canonical reports across ${matchSeasons(matches).length} seasons; ${publicMatches.length} published; preserved manuscripts and canonical entity IDs validated. No publication performed.`);
