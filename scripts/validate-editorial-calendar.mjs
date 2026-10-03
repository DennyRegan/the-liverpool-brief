import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import matter from 'gray-matter';
import { z } from 'zod';
import { getHistoryEvents } from '../lib/content/this-week.ts';
import { getArchiveFeatures } from '../lib/content/archive.ts';
import { ArchiveFeatureSchema } from '../lib/content/types.ts';
import { getHistoryEntities } from '../lib/content/entities.ts';
import { getHistory, getArticleEraIds } from '../lib/content/history.ts';

import { publicationClassSchema, isPublicStatus, validateAutomaticHistory } from './automatic-history-state.mjs';

export const calendarPath = 'docs/editorial/history-calendar.json';
const text = z.string().min(1);
const matchRecoverySchema = z.object({
  completed: z.boolean(), reviewRequired: z.boolean(), matchLabel: text,
  opposition: text, score: z.string().regex(/^\d+–\d+$/).nullable(),
  sourceFiles: z.array(text).min(1), sourceManuscript: z.object({
    name: text, libraryFileId: text, modifiedAt: text, sha256: z.string().regex(/^[a-f0-9]{64}$/),
    archiveMember: text.optional(),
  }).strict(),
  sourceBodySha256: text, preservedSourcePath: text, articleBodySha256: text,
  duplicateResolution: text, blockers: z.array(text), pipelinePredecessor: text.optional(),
}).strict();
// New research shares the stock inventory, without invented recovery provenance.
const matchProductionSchema = z.object({
  batchId: text, season: z.string().regex(/^\d{4}-\d{2}$/),
  completed: z.boolean(), reviewRequired: z.boolean(), matchLabel: text,
  opposition: text, score: z.string().regex(/^\d+–\d+$/), editorialReason: text,
  sourceFiles: z.array(text).min(1), model: z.literal('gpt-6-astra'),
  workerId: text, blockers: z.array(text),
}).strict();
const biographyProductionSchema = z.object({
  completed: z.boolean(), reviewRequired: z.boolean(), editorialReason: text,
  sourceFiles: z.array(text), model: z.enum(['gpt-6-astra', 'gpt-6.1-sol']), workerId: text,
  blockers: z.array(text),
}).strict();
const entrySchema = z.object({
  id: text, event: text, historicalEventDate: z.iso.date(), featuredWeek: z.iso.date(),
  selection: z.enum(['selected', 'provisional', 'alternative']),
  status: z.enum(['planned', 'writing', 'ready_for_review', 'approved', 'publication_pending', 'published', 'blocked']),
  publicationClass: publicationClassSchema.optional(),
  owner: text.nullable(),
  claim: z.object({ token: text, claimedAt: z.iso.datetime(), baseCommit: text }).strict().nullable(),
  eventPath: text.nullable(), draftPath: text.nullable(), originalDraftId: text.nullable(),
  publishedDestination: z.string().regex(/^\/archive\/[a-z0-9]+(?:-[a-z0-9]+)*$/).nullable(),
  approval: z.object({ by: z.literal('Denny'), recordedAt: z.iso.datetime(), evidence: text }).strict().nullable(),
  notes: text,
  evidence: z.array(z.object({ location: text, confidence: z.enum(['high', 'medium', 'low', 'unverified']), scope: text }).strict()).min(1),
  researchStatus: z.enum(['not_rechecked', 'needs_research', 'verified']),
  matchRecovery: matchRecoverySchema.optional(),
  matchProduction: matchProductionSchema.optional(),
  biographyProduction: biographyProductionSchema.optional(),
  migration: z.object({
    personId: text, completed: z.boolean(), reviewRequired: z.boolean(),
    sourceFiles: z.array(text), sourceManuscript: z.object({
      name: text, libraryFileId: text, modifiedAt: text, sha256: text,
    }).strict().optional(), duplicateResolution: text, blockers: z.array(text),
  }).strict().optional(),
}).strict();

// Career inventory shares this file and workflow, without an invented anniversary or schedule.
const biographySchema = entrySchema.omit({ historicalEventDate: true, featuredWeek: true })
  .extend({ personId: text });
// An editorial stock item has an actual match date, but no invented anniversary week.
const matchSchema = entrySchema.omit({ featuredWeek: true }).refine(
  e => Boolean(e.matchRecovery) !== Boolean(e.matchProduction),
  'Match stock requires either recovery provenance or new-research evidence');

export function validateCalendar(calendar, root = process.cwd()) {
  assert.equal(calendar.version, 1);
  assert.equal(calendar.timezone, 'Europe/London');
  assert.equal(calendar.canonicalLocation, `https://github.com/DennyRegan/the-liverpool-brief/blob/main/${calendarPath}`);
  const entries = z.array(entrySchema).min(1).parse(calendar.entries);
  const biographies = z.array(biographySchema).parse(calendar.biographies ?? []);
  const matches = z.array(matchSchema).parse(calendar.matches ?? []);
  const batches = z.array(z.object({
    id: text, season: z.string().regex(/^\d{4}-\d{2}$/),
    stage: z.enum(['not_started', 'season_research', 'match_research', 'drafting', 'fact_check', 'checkpointed']),
    owner: text, model: z.literal('gpt-6-astra'), workerId: text,
    sourceNote: text.nullable(), selectedRowIds: z.array(text), reusedPaths: z.array(text),
    notes: text, nextStage: text.nullable(),
  }).strict()).parse(calendar.matchProductionBatches ?? []);
  z.array(z.object({ id: text, season: z.string().regex(/^\d{4}-\d{2}$/),
    status: z.literal('NOT LOCATED'), articlePath: z.null(), notes: text, evidence: z.array(text).min(1),
  }).strict()).parse(calendar.matchRecoveryGaps ?? []);
  const ids = new Set(), dates = new Set(), drafts = new Set(), biographyPeople = new Set();
  const articles = new Map(getArchiveFeatures(root).map(a => [`/archive/${a.slug}`, a]));
  const entities = new Map(getHistoryEntities(root).map(entity => [entity.id, entity.kind]));
  const { eras } = getHistory(root);
  const events = new Map(getHistoryEvents(root).map(e => [`content/this-week/liverpool/${e.slug}.md`, e]));
  const readFile = (relative, prefix) => {
    assert.ok(relative.startsWith(prefix) && !relative.split('/').includes('..'), `Unsafe path: ${relative}`);
    return matter(fs.readFileSync(path.join(root, relative), 'utf8')).data;
  };
  const recoveredMatches = new Set();
  for (const e of [...entries, ...biographies, ...matches]) {
    assert.ok(!ids.has(e.id), `Duplicate row ${e.id}`); ids.add(e.id);
    if (e.personId) assert.equal(entities.get(e.personId), 'person', `${e.id}: unknown biography person`);
    if (e.migration) {
      assert.equal(entities.get(e.migration.personId), 'person', `${e.id}: unknown migration person`);
      for (const file of e.migration.sourceFiles) {
        assert.ok(file.startsWith('docs/editorial/drafts/') && !file.split('/').includes('..'), `${e.id}: unsafe source path`);
        assert.ok(fs.existsSync(path.join(root, file)), `${e.id}: missing source file ${file}`);
      }
      if (e.status === 'approved') assert.equal(e.migration.blockers.length, 0, `${e.id}: unresolved approval blockers`);
    }
    if (e.biographyProduction) {
      const production = e.biographyProduction;
      assert.ok(e.personId && !e.migration, `${e.id}: new biography must have one canonical identity and no recovery provenance`);
      for (const file of production.sourceFiles) {
        assert.ok(file.startsWith('docs/editorial/drafts/') && !file.split('/').includes('..'), `${e.id}: unsafe biography source path`);
        assert.ok(fs.existsSync(path.join(root, file)), `${e.id}: missing biography source ${file}`);
      }
      if (['ready_for_review', 'approved', 'publication_pending', 'published'].includes(e.status)) {
        assert.equal(production.completed, true, `${e.id}: finished biography requires completed evidence`);
        assert.ok(production.sourceFiles.length >= 2, `${e.id}: research and audit records required`);
        assert.equal(e.researchStatus, 'verified', `${e.id}: finished biography requires factual audit`);
      }
      if (!isPublicStatus(e.status)) {
        assert.equal(e.publishedDestination, null, `${e.id}: unpublished biography has public destination`);
        if (e.status !== 'approved') {
          assert.equal(e.approval, null, `${e.id}: new biography has unapproved approval`);
          assert.equal(production.reviewRequired, true, `${e.id}: new biography requires review`);
        }
      }
    }
    const personId = e.personId ?? e.migration?.personId;
    if (personId) {
      assert.equal(e.id, `${personId}-career-biography`, `${e.id}: biography identity mismatch`);
      assert.ok(!biographyPeople.has(personId), `${e.id}: duplicate biography subject`);
      biographyPeople.add(personId);
    }
    if (e.featuredWeek) {
    const identity = `${e.featuredWeek}:${e.historicalEventDate}:${e.event}`;
    assert.ok(!dates.has(identity), `Duplicate event ${identity}`); dates.add(identity);
    const monday = new Date(`${e.featuredWeek}T12:00:00Z`);
    assert.equal(monday.getUTCDay(), 1, `${e.id}: featuredWeek must be Monday`);
    const weekDates = Array.from({ length: 7 }, (_, i) => new Date(+monday + i * 86400000).toISOString().slice(5, 10));
    assert.ok(weekDates.includes(e.historicalEventDate.slice(5)), `${e.id}: anniversary outside featured week`);
    }
    if (e.matchRecovery || e.matchProduction) {
      assert.ok(!recoveredMatches.has(e.historicalEventDate), `${e.id}: duplicate recovered match`);
      recoveredMatches.add(e.historicalEventDate);
    }
    if (e.matchProduction) {
      const m = e.matchProduction;
      assert.ok(batches.some(b => b.id === m.batchId && b.season === m.season), `${e.id}: unknown production batch`);
      for (const file of m.sourceFiles) {
        assert.ok(file.startsWith('docs/editorial/drafts/') && !file.split('/').includes('..'), `${e.id}: unsafe source path`);
        assert.ok(fs.existsSync(path.join(root, file)), `${e.id}: missing source ${file}`);
      }
      const year = Number(e.historicalEventDate.slice(0, 4)) - (Number(e.historicalEventDate.slice(5, 7)) < 7 ? 1 : 0);
      assert.equal(m.season, `${year}-${String((year + 1) % 100).padStart(2, '0')}`, `${e.id}: match outside production season`);
      if (['ready_for_review', 'approved', 'publication_pending', 'published'].includes(e.status)) assert.equal(m.completed, true, `${e.id}: finished status requires completed research`);
      if (!isPublicStatus(e.status)) {
        assert.equal(e.publishedDestination, null, `${e.id}: unpublished production has a destination`);
        assert.ok(![...articles.values()].some(a => a.historicalEventDate === e.historicalEventDate && a.articleType === 'match'), `${e.id}: newly researched match already has public coverage`);
        if (e.status !== 'approved') {
          assert.equal(m.reviewRequired, true, `${e.id}: new writing requires Denny review`);
          assert.equal(e.approval, null, `${e.id}: approval is only recorded at explicit approval`);
        }
      }
      if (e.status === 'approved') assert.equal(m.blockers.length, 0, `${e.id}: unresolved production approval blockers`);
      if (e.draftPath && !isPublicStatus(e.status)) {
        const article = matter(fs.readFileSync(path.join(root, e.draftPath), 'utf8'));
        assert.equal(article.data.articleType, 'match', `${e.id}: production must be a match report`);
        assert.equal(article.data.slug, path.basename(e.draftPath, '.md'), `${e.id}: production filename/slug mismatch`);
        assert.equal(article.data.season, m.season, `${e.id}: production season mismatch`);
        assert.ok(!Object.hasOwn(article.data, 'date'), `${e.id}: production draft has publication date`);
        assert.ok(article.data.oppositionIds?.length, `${e.id}: opposition identity required`);
        assert.ok(article.data.competitionIds?.length, `${e.id}: competition identity required`);
        assert.ok(article.data.managerIds?.length, `${e.id}: manager identity required`);
        assert.ok(!articles.has(`/archive/${article.data.slug}`), `${e.id}: unpublished production slug is public`);
      }
    }
    if (e.matchRecovery) {
      const m = e.matchRecovery;
      for (const file of m.sourceFiles) {
        assert.ok(file.startsWith('docs/editorial/drafts/') && !file.split('/').includes('..'), `${e.id}: unsafe source path`);
        assert.ok(fs.existsSync(path.join(root, file)), `${e.id}: missing source ${file}`);
      }
      assert.ok(m.sourceFiles.includes(m.preservedSourcePath), `${e.id}: preserved source missing from evidence`);
      const source = fs.readFileSync(path.join(root, m.preservedSourcePath), 'utf8');
      assert.equal(createHash('sha256').update(source).digest('hex'), m.sourceManuscript.sha256, `${e.id}: recovered original changed`);
      assert.equal(createHash('sha256').update(matter(source).content).digest('hex'), m.sourceBodySha256, `${e.id}: original body changed`);
      const articlePath = e.publishedDestination ? `content/archive/liverpool/${e.publishedDestination.split('/').at(-1)}.md` : e.draftPath;
      assert.ok(articlePath, `${e.id}: recovered completed match needs an article path`);
      const article = matter(fs.readFileSync(path.join(root, articlePath), 'utf8'));
      assert.equal(article.data.articleType, 'match', `${e.id}: recovered content must be a match report`);
      assert.equal(article.data.historicalEventDate, e.historicalEventDate, `${e.id}: match date mismatch`);
      const year = Number(e.historicalEventDate.slice(0, 4)) - (Number(e.historicalEventDate.slice(5, 7)) < 7 ? 1 : 0);
      assert.equal(article.data.season, `${year}-${String((year + 1) % 100).padStart(2, '0')}`, `${e.id}: match outside principal season`);
      if (!isPublicStatus(e.status)) {
        assert.ok(!Object.hasOwn(article.data, 'date'), `${e.id}: recovered draft has publication date`);
        assert.ok(!articles.has(`/archive/${article.data.slug}`), `${e.id}: recovered unpublished slug is public`);
        if (e.status !== 'approved') assert.equal(m.reviewRequired, true, `${e.id}: unreviewed recovery requires review`);
        if (articlePath.startsWith('docs/editorial/drafts/match-recovery/')) {
          assert.equal(article.data.slug, path.basename(articlePath, '.md'), `${e.id}: recovered filename/slug mismatch`);
        }
      }
      if (e.status === 'approved') assert.equal(m.blockers.length, 0, `${e.id}: unresolved match approval blockers`);
      if (m.pipelinePredecessor) assert.ok(fs.existsSync(path.join(root, m.pipelinePredecessor)), `${e.id}: pipeline predecessor missing`);
    }
    if (e.eventPath) {
      const event = events.get(e.eventPath);
      assert.ok(event, `${e.id}: missing event file`);
      assert.equal(`${event.year}-${String(event.month).padStart(2, '0')}-${String(event.day).padStart(2, '0')}`, e.historicalEventDate, `${e.id}: event date mismatch`);
    }
    if (e.draftPath) {
      assert.ok(!drafts.has(e.draftPath), `Draft reused by duplicate row: ${e.draftPath}`); drafts.add(e.draftPath);
      const draft = readFile(e.draftPath, 'docs/editorial/drafts/');
      if (e.personId || e.migration) assert.ok(!Object.hasOwn(draft, 'date'), `${e.id}: migrated draft must not have a publication date`);
      // Drafts share Archive metadata, but do not acquire a publication date or enter its loader.
      ArchiveFeatureSchema.omit({ date: true, body: true }).parse(draft);
      for (const [field, kind] of Object.entries({ playerIds: 'person', managerIds: 'person', oppositionIds: 'opposition', competitionIds: 'competition', locationIds: 'location', themeIds: 'theme' })) {
        for (const id of draft[field] ?? []) assert.equal(entities.get(id), kind, `${e.id}: draft ${field} must use canonical ${kind} ID ${id}`);
      }
      getArticleEraIds(draft, eras);
      if (e.personId) {
        assert.equal(draft.slug, path.basename(e.draftPath, '.md'), `${e.id}: filename/slug mismatch`);
        assert.ok([...(draft.playerIds ?? []), ...(draft.managerIds ?? [])].includes(e.personId), `${e.id}: principal subject missing`);
        if (!isPublicStatus(e.status)) assert.ok(!articles.has(`/archive/${draft.slug}`), `${e.id}: unpublished biography duplicates public slug`);
      }
      // A career biography can use eras without treating its calendar anchor as a single event.
      if (draft.historicalEventDate) assert.equal(draft.historicalEventDate, e.historicalEventDate, `${e.id}: draft date mismatch`);
      else assert.ok(draft.category === 'person' && draft.historyEras?.length && !e.eventPath, `${e.id}: event draft requires historicalEventDate`);
      if (draft.season) assert.match(draft.season, /^\d{4}-\d{2}$/, `${e.id}: noncanonical season`);
      if (draft.season) assert.equal(Number(draft.season.slice(5)), (Number(draft.season.slice(0, 4)) + 1) % 100, `${e.id}: nonconsecutive season`);
    }
    if (['ready_for_review', 'approved'].includes(e.status)) assert.ok(e.draftPath && e.owner, `${e.id}: completed draft requires path and owner`);
    if (e.status === 'writing') assert.ok(e.claim && e.owner, `${e.id}: writing requires a claim and owner`);
    else assert.equal(e.claim, null, `${e.id}: only writing rows may hold a claim`);
    if (e.status === 'approved') assert.ok(e.approval, `${e.id}: explicit approval missing`);
    if (isPublicStatus(e.status)) assert.ok(e.publishedDestination, `${e.id}: publication destination missing`);
    if (e.publishedDestination) {
      const article = articles.get(e.publishedDestination);
      assert.ok(article, `${e.id}: published destination missing from canonical collection`);
      if (e.historicalEventDate) assert.equal(article.historicalEventDate, e.historicalEventDate, `${e.id}: published date mismatch`);
    }
  }
  const batchIds = new Set(), batchSeasons = new Set();
  for (const b of batches) {
    assert.ok(!batchIds.has(b.id) && !batchSeasons.has(b.season), `${b.id}: duplicate production batch`);
    batchIds.add(b.id); batchSeasons.add(b.season);
    if (b.sourceNote) assert.ok(fs.existsSync(path.join(root, b.sourceNote)), `${b.id}: missing season research`);
    for (const file of b.reusedPaths) assert.ok(fs.existsSync(path.join(root, file)), `${b.id}: missing reused article`);
    assert.equal(new Set(b.selectedRowIds).size, b.selectedRowIds.length, `${b.id}: duplicate selected row`);
    for (const id of b.selectedRowIds) {
      const row = matches.find(r => r.id === id);
      assert.ok(row?.matchProduction?.batchId === b.id, `${b.id}: selection belongs to another batch`);
      if (b.stage === 'checkpointed') {
        assert.ok(['ready_for_review', 'approved', 'publication_pending', 'published'].includes(row.status), `${b.id}: unfinished checkpoint`);
        assert.equal(row.matchProduction.completed, true, `${b.id}: incomplete production checkpoint`);
      }
    }
    if (b.stage === 'checkpointed') assert.equal(b.nextStage, null, `${b.id}: completed batch has remaining work`);
  }
  const rows = [...entries, ...biographies, ...matches];
  validateAutomaticHistory(calendar, rows, articles);
  return rows;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const entries = validateCalendar(JSON.parse(fs.readFileSync(calendarPath, 'utf8')));
  console.log(`Validated ${entries.length} shared calendar entries. Historical truth and approval evidence require editorial review.`);
}
