import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadPublishedHistoryAtlas } from '../lib/content/history-prototype.ts';
import { getHistoryLibrary, historySearchDocuments } from '../lib/content/history-library.ts';
const forest = 'liverpool-nottingham-forest-1988-five-at-anfield';
function fixture(run) {
 const root = fs.mkdtempSync(path.join(os.tmpdir(), 'published-season-atlas-'));
 fs.cpSync('content', path.join(root, 'content'), { recursive: true });
 try { return run(root); } finally { fs.rmSync(root, { recursive: true, force: true }); }
}
test('published season and atlas work without private inputs and only link approved reports', () => fixture(root => {
 const library = getHistoryLibrary(root);
 assert.equal(library.seasons.find(s => s.record.season === '1987-88').review, false);
 assert.ok(historySearchDocuments(library).some(d => d.href === '/history/seasons/1987-88'));
 assert.equal(library.articles.length, 9);
 assert.equal(library.events.length, 9); // Two retained events plus seven commissioned weekly entries.
 const atlas = loadPublishedHistoryAtlas(root);
 assert.deepEqual(atlas.groups.map(g => g.id), ['anfield']);
 assert.deepEqual(atlas.groups.flatMap(g => g.matches.map(m => m.href)), [`/archive/${forest}`]);
 assert.ok(atlas.coastline.length > 0);
}));
test('withdrawing the approved report removes the public atlas despite private copies', () => fixture(root => {
 const file = path.join(root, 'content/archive/liverpool', `${forest}.md`);
 const privateDir = path.join(root, 'prototype/history/reports'); fs.mkdirSync(privateDir, { recursive: true });
 fs.renameSync(file, path.join(privateDir, `${forest}.md`));
 assert.equal(loadPublishedHistoryAtlas(root), undefined);
 assert.equal(getHistoryLibrary(root).articles.length, 8);
}));
test('unknown atlas entity IDs fail validation without inventing relationships', () => fixture(root => {
 const file = path.join(root, 'content/history/liverpool/atlases/1987-88.json');
 const atlas = JSON.parse(fs.readFileSync(file)); atlas.venues[0].id = 'invented-ground'; fs.writeFileSync(file, JSON.stringify(atlas));
 assert.throws(() => loadPublishedHistoryAtlas(root), /Unknown atlas location/);
}));
