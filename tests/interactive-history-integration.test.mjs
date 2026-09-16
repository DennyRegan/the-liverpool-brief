import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
await import('../scripts/register-server-only.mjs');
const {
  getPublishedExperiences, getPublishedExperience, getPreviewExperience,
  getSeasonExperiences, getEraExperiences, getArticleExperiences,
  toExperienceDocument, toExperienceControls, validateExperienceReferences,
} = await import('../lib/content/interactive-history.ts');
const { getHistoryEntities } = await import('../lib/content/entities.ts');

import { fixture } from './fixtures/interactive-history.mjs';

function withRoot(run) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'interactive-publication-'));
  try {
    fs.cpSync('content', path.join(root, 'content'), { recursive: true });
    // Publication fixtures start with an empty collection, independently of live content.
    fs.rmSync(path.join(root, 'content/history/liverpool/interactive'), { recursive: true, force: true });
    return run(root);
  }
  finally { fs.rmSync(root, { recursive: true, force: true }); }
}
function write(root, record, draft = false) {
  const filename = draft ? path.join(root, 'docs/editorial/interactive-history', record.id, 'experience.json') : path.join(root, 'content/history/liverpool/interactive', `${record.id}.json`);
  fs.mkdirSync(path.dirname(filename), { recursive: true }); fs.writeFileSync(filename, JSON.stringify(record));
}

test('approved Istanbul is discoverable under Interactive History without a duplicate draft', () => {
  const experience = getPublishedExperience('istanbul-2005');
  assert.ok(experience);
  assert.equal(experience.publication.status, 'published');
  assert.match(experience.publication.approvalReference, /Denny.*16 September 2026/);
  assert.equal(experience.editorial.status, 'reviewed');
  assert.ok(getSeasonExperiences('2004-05').some(item => item.id === experience.id));
  assert.ok(getEraExperiences('rafael-benitez').some(item => item.id === experience.id));
  assert.equal(getPreviewExperience(experience.id, { NODE_ENV: 'development', INTERACTIVE_HISTORY_PREVIEW: experience.id }), undefined);
  assert.equal(fs.existsSync('docs/editorial/interactive-history/istanbul-2005/experience.json'), false);
  const document = toExperienceDocument(experience);
  assert.equal(document.claims.length, 80);
  assert.ok(!document.contentNotes.some(note => note.includes('editorial approval')));
});

test('drafts cannot enter any public selector; preview requires exact allowlist and development', () => withRoot(root => {
  const record = fixture(); record.publication = { status: 'draft' }; write(root, record, true);
  assert.deepEqual(getPublishedExperiences(root), []);
  assert.equal(getPublishedExperience(record.id, root), undefined);
  for (const selector of [getSeasonExperiences, getEraExperiences, getArticleExperiences]) assert.deepEqual(selector('2004-05', root), []);
  assert.equal(getPreviewExperience(record.id, { NODE_ENV: 'development', INTERACTIVE_HISTORY_PREVIEW: record.id }, root).id, record.id);
  for (const environment of [
    { NODE_ENV: 'production', INTERACTIVE_HISTORY_PREVIEW: record.id },
    { NODE_ENV: 'test', INTERACTIVE_HISTORY_PREVIEW: record.id },
    { NODE_ENV: 'development' },
    { NODE_ENV: 'development', INTERACTIVE_HISTORY_PREVIEW: `${record.id},other` },
    { NODE_ENV: 'development', INTERACTIVE_HISTORY_PREVIEW: 'other' },
  ]) assert.equal(getPreviewExperience(record.id, environment, root), undefined);
  // A malformed draft would throw if it were touched: failed gates must precede I/O.
  fs.writeFileSync(path.join(root, 'docs/editorial/interactive-history', record.id, 'experience.json'), '{ invalid');
  assert.equal(getPreviewExperience(record.id, { NODE_ENV: 'production', INTERACTIVE_HISTORY_PREVIEW: record.id }, root), undefined);
  assert.equal(getPreviewExperience('../synthetic-review', { NODE_ENV: 'development', INTERACTIVE_HISTORY_PREVIEW: '../synthetic-review' }, root), undefined);
  write(root, record); // Even a draft accidentally placed in the published folder is invisible.
  assert.deepEqual(getPublishedExperiences(root), []);
}));

test('one reviewed record supplies season, era, article and canonical discovery without reverse lists', () => withRoot(root => {
  const record = fixture(); write(root, record);
  assert.deepEqual(getPublishedExperiences(root).map(item => item.id), [record.id]);
  assert.deepEqual(getSeasonExperiences('2004-05', root).map(item => item.id), [record.id]);
  assert.deepEqual(getEraExperiences('rafael-benitez', root).map(item => item.id), [record.id]);
  assert.deepEqual(getArticleExperiences('liverpool-monaco-champions-league-2004', root).map(item => item.id), [record.id]);
  assert.deepEqual(getArticleExperiences('istanbul-2005-champions-league-final', root), []);
  const document = toExperienceDocument(getPublishedExperience(record.id, root), root);
  assert.ok(document.connections.articles.some(article => article.href === '/archive/liverpool-monaco-champions-league-2004'));
  assert.ok(document.connections.seasons.some(season => season.href === '/history/seasons/2004-05'));
  assert.ok(document.connections.eras.some(era => era.href === '/history/rafael-benitez'));
  assert.ok(document.connections.relatedArticles.length <= 3);
  assert.ok(document.connections.relatedArticles.some(article => article.id === 'liverpool-monaco-champions-league-2004'));
}));

test('public projections exclude research, review, approval and full canonical corpora', () => withRoot(root => {
  const record = validateExperienceReferences(fixture(), root);
  const document = toExperienceDocument(record, root);
  const controls = toExperienceControls(record, root);
  const serialised = JSON.stringify({ document, controls });
  for (const privateValue of ['PRIVATE_CLAIM_NOTE', 'PRIVATE_SPECIFICATION', 'PRIVATE_MODEL', 'PRIVATE_TASK', 'SYNTHETIC_TEST_APPROVAL']) assert.ok(!serialised.includes(privateValue), privateValue);
  for (const privateKey of ['"confidence"', '"reviewNote"', '"editorial"', '"publication"', '"independenceGroup"', '"approvalReference"']) assert.ok(!serialised.includes(privateKey), privateKey);
  assert.equal(Object.keys(controls).sort().join(','), 'attempts,id,moments,sourceIds,teams');
  assert.ok(!JSON.stringify(controls).includes('Synthetic engineering fixture.'));
  assert.ok(Object.keys(document.names).length < getHistoryEntities(root).length);
  assert.deepEqual(controls.moments[0].state.score, { subject: 0, opposition: 0 });
  assert.deepEqual(controls.moments.at(-1).state.score, { subject: 0, opposition: 1 });
  assert.equal(controls.moments.at(-1).state.outcome.winner, 'opposition');
}));

test('publication rejects absent approval, blocking evidence and unresolved canonical references', () => withRoot(root => {
  for (const change of [
    record => { delete record.publication.approvalReference; },
    record => { record.editorial.unresolvedIssues.push({ id: 'identity', description: 'Unknown player identity', blocking: true }); },
    record => { record.relationships.articleSlugs = ['unpublished-istanbul-report']; },
    record => { record.relationships.eraIds = ['unknown-era']; },
    record => { record.match.rosters.subject.starters[0].personId = 'unknown-person'; },
    record => { record.relationships.seasonFactRefs = [{ seasonId: '2004-05', field: 'researchNotes', sourceIndex: 0 }]; },
  ]) {
    const record = fixture(); change(record); write(root, record);
    assert.throws(() => getPublishedExperiences(root));
  }
}));

test('referenced opinion articles are not factual candidates or reciprocal destinations', () => withRoot(root => {
  const record = fixture(); record.relationships.articleSlugs = ['john-barnes-1987'];
  assert.throws(() => validateExperienceReferences(record, root));
}));


test('review-pending content is available only through an explicit draft projection without private notes', () => withRoot(root => {
  const record = fixture();
  record.publication = { status: 'draft' };
  record.editorial.status = 'working-draft';
  record.claims[0].status = 'needs-review';
  const draft = validateExperienceReferences(record, root);
  assert.throws(() => toExperienceDocument(draft, root), /explicit preview/);
  assert.throws(() => toExperienceControls(draft, root), /explicit preview/);
  const document = toExperienceDocument(draft, root, { preview: true });
  const controls = toExperienceControls(draft, root, { preview: true });
  assert.equal(document.claims.length, 1);
  assert.equal(document.moments[0].blocks[0].text, 'Synthetic engineering fixture.');
  assert.ok(document.contentNotes.some(note => note.includes('editorial approval')));
  assert.deepEqual(controls.sourceIds, ['fixture-source']);
  assert.doesNotMatch(JSON.stringify({ document, controls }), /PRIVATE_|needs-review|researchModel|reviewNote|confidence/);
}));
