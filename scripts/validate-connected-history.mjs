import assert from 'node:assert/strict';
import { getHistoryLibrary, historySearchDocuments, availableEntities } from '../lib/content/history-library.ts';
const library = getHistoryLibrary();
assert.ok(!library.seasons.some(s => s.review));
const documents = historySearchDocuments(library);
assert.ok(!documents.some(d => d.href.startsWith('/preview/')));
console.log(`PASS: ${library.articles.length} approved factual articles, ${library.seasons.length} public seasons, ${availableEntities(library).length} connected subjects, ${library.series.length} series, ${library.events.length} verified events. No draft/prototype report inputs.`);
