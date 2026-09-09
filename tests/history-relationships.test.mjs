import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getArchiveFeature, getArchiveFeatures } from '../lib/content/archive.ts';
import { ArchiveFeatureSchema } from '../lib/content/types.ts';
import { HistoryEntitiesSchema, getHistoryEntities } from '../lib/content/entities.ts';
import { getHistory, getArticleEraIds, seasonKey } from '../lib/content/history.ts';
import { getHistoryEvents, getHistoryWindow, getWeekReading } from '../lib/content/this-week.ts';

const archive = {
  title: 'Relationship validation fixture', slug: 'relationship-fixture',
  date: '2026-09-09', historicalPeriod: '1987–88', decade: '1980s',
  excerpt: 'Temporary test metadata.', category: 'person',
};
const body = 'Original **Markdown** stays in one Archive file.\n\nA second paragraph.';
const entities = getHistoryEntities();
const entityId = kind => {
  const entity = entities.find(item => item.kind === kind);
  assert.ok(entity, `The current editorial registry includes a ${kind} entity`);
  return entity.id;
};
const relationships = {
  playerIds: [entityId('person')], managerIds: [entityId('person')],
  oppositionIds: [entityId('opposition')], competitionIds: [entityId('competition')],
  locationIds: [entityId('location')], themeIds: [entityId('theme')],
};
const valid = { ...archive, body, articleType: 'player', season: '1987-88', ...relationships };

// All invalid metadata lives in disposable roots. Published Markdown is read-only here.
function withRoot(run) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'liverpool-relationships-'));
  try {
    fs.mkdirSync(path.join(root, 'content/archive/liverpool'), { recursive: true });
    fs.mkdirSync(path.join(root, 'content/history/liverpool'), { recursive: true });
    for (const name of ['eras.json', 'entities.json']) {
      fs.copyFileSync(path.join(process.cwd(), 'content/history/liverpool', name), path.join(root, 'content/history/liverpool', name));
    }
    return run(root);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function writeArticle(root, data = archive, filename = 'relationship-fixture.md') {
  fs.writeFileSync(path.join(root, 'content/archive/liverpool', filename), `---\n${JSON.stringify(data)}\n---\n${body}\n`);
}

function articleError(root, field, value) {
  for (const load of [() => getArchiveFeatures(root), () => getArchiveFeature(archive.slug, root)]) {
    assert.throws(load, error => {
      assert.match(error.message, /relationship-fixture\.md/, 'An editor can locate the offending Markdown file');
      assert.ok(error.message.includes(field), `The error identifies ${field}: ${error.message}`);
      if (value) assert.ok(error.message.includes(value), `The error identifies ${value}: ${error.message}`);
      return true;
    });
  }
}

test('valid relationship metadata preserves navigation category, distinct article type and Markdown', () => withRoot(root => {
  assert.equal(ArchiveFeatureSchema.parse(valid).articleType, 'player');
  writeArticle(root, { ...valid, body: undefined });
  const result = getArchiveFeatures(root)[0];
  assert.equal(result.category, 'person');
  assert.equal(result.articleType, 'player');
  assert.equal(result.body, body);
  assert.deepEqual(result.playerIds, result.managerIds, 'One person identity can have both roles');
  assert.deepEqual(getArchiveFeature(archive.slug, root), result);
}));

test('legacy articles need no relationship fields, article type or declared slug', () => withRoot(root => {
  const legacy = { ...archive };
  delete legacy.slug;
  writeArticle(root, legacy);
  const result = getArchiveFeature(archive.slug, root);
  assert.equal(result.slug, archive.slug);
  assert.equal(result.category, 'person');
  assert.equal(result.articleType, undefined);
  for (const field of Object.keys(relationships)) assert.equal(result[field], undefined);
  assert.equal(result.body, body);
}));

test('all precise article types remain independent of the legacy navigation category', () => {
  for (const articleType of ['match', 'player', 'manager', 'transfer', 'season', 'competition', 'club-event', 'other']) {
    assert.equal(ArchiveFeatureSchema.parse({ ...valid, articleType }).category, 'person');
  }
});

test('unknown well-formed IDs pass structural parsing but fail both Archive loaders', () => withRoot(root => {
  for (const field of Object.keys(relationships)) {
    const value = { ...archive, [field]: ['unregistered-entity'] };
    assert.ok(ArchiveFeatureSchema.safeParse({ ...value, body }).success);
    writeArticle(root, value);
    articleError(root, field, 'unregistered-entity');
  }
}));

test('entity kinds prevent confusing a person, opposition, competition, location or theme', () => withRoot(root => {
  for (const field of Object.keys(relationships)) {
    const wrongId = entityId(field === 'playerIds' || field === 'managerIds' ? 'location' : 'person');
    writeArticle(root, { ...archive, [field]: [wrongId] });
    articleError(root, field, wrongId);
  }
}));

test('duplicate relationship IDs fail clearly rather than being silently deduplicated', () => withRoot(root => {
  for (const [field, [id]] of Object.entries(relationships)) {
    const value = { ...archive, [field]: [id, id] };
    assert.equal(ArchiveFeatureSchema.safeParse({ ...value, body }).success, false);
    writeArticle(root, value);
    articleError(root, field);
  }
}));

test('malformed relationship IDs and non-array values identify their field and file', () => withRoot(root => {
  for (const field of Object.keys(relationships)) {
    for (const value of [['John-Barnes'], ['john_barnes'], ['john--barnes'], ['../john-barnes'], [''], 'john-barnes']) {
      writeArticle(root, { ...archive, [field]: value });
      articleError(root, field);
    }
  }
}));

test('invalid article types and publication or event dates fail with the filename', () => withRoot(root => {
  for (const [field, value] of [
    ['articleType', 'biography'], ['date', '9 September 2026'], ['date', '2026-02-30'],
    ['historicalEventDate', '1987/08/15'], ['historicalEventDate', '1987-02-29'],
  ]) {
    writeArticle(root, { ...archive, [field]: value });
    articleError(root, field);
  }
}));

test('a declared slug cannot silently override or disagree with its canonical filename', () => withRoot(root => {
  writeArticle(root, { ...archive, slug: 'different-article' });
  articleError(root, 'slug', 'different-article');
}));

test('relatedMatches references keep existing canonical links and reject missing articles', () => withRoot(root => {
  writeArticle(root, { ...archive, category: 'season', relatedMatches: ['linked-match'] });
  articleError(root, 'relatedMatches', 'linked-match');
  writeArticle(root, { ...archive, slug: 'linked-match', category: 'match' }, 'linked-match.md');
  assert.deepEqual(getArchiveFeature(archive.slug, root).relatedMatches, ['linked-match']);
  assert.equal(getArchiveFeatures(root).length, 2);
}));

test('unknown and duplicate managerial era references are caught before rendering', () => withRoot(root => {
  for (const historyEras of [['kenny-dalglish'], ['bob-paisley', 'bob-paisley']]) {
    writeArticle(root, { ...archive, historyEras });
    articleError(root, 'historyEras');
  }
}));

test('canonical entity registry rejects duplicate identities, malformed IDs, labels and kinds', () => {
  const entity = { id: 'fixture-person', label: 'Fixture Person', kind: 'person' };
  assert.ok(HistoryEntitiesSchema.safeParse([entity]).success);
  for (const invalid of [
    [entity, entity], [entity, { ...entity, id: 'fixture-person-alias' }],
    [{ ...entity, id: 'Fixture-Person' }], [{ ...entity, label: '  ' }],
    [{ ...entity, kind: 'manager' }],
  ]) assert.equal(HistoryEntitiesSchema.safeParse(invalid).success, false);
});

test('bad entity registry data reports entities.json, including malformed JSON', () => withRoot(root => {
  const filename = path.join(root, 'content/history/liverpool/entities.json');
  for (const text of [JSON.stringify([...entities, entities[0]]), '{ invalid JSON']) {
    fs.writeFileSync(filename, text);
    assert.throws(() => getHistoryEntities(root), /entities\.json/);
    writeArticle(root, archive);
    assert.throws(() => getArchiveFeatures(root), /entities\.json/);
  }
}));

test('bad era registry data reports eras.json through the existing History loader', () => withRoot(root => {
  const history = getHistory(root);
  const filename = path.join(root, 'content/history/liverpool/eras.json');
  for (const text of [JSON.stringify({ ...history, eras: [history.eras[0], history.eras[0]] }), '{ invalid JSON']) {
    fs.writeFileSync(filename, text);
    assert.throws(() => getHistory(root), /eras\.json/);
    writeArticle(root, archive);
    assert.throws(() => getArchiveFeatures(root), /eras\.json/);
  }
}));

test('legacy season spellings normalize without changing their editorial display value', () => {
  for (const season of ['1987-88', '1987/88', '1987–88', '1987-1988']) {
    assert.equal(seasonKey(season), '1987-88');
    assert.equal(ArchiveFeatureSchema.parse({ ...valid, season }).season, season);
  }
  assert.equal(seasonKey('1999-00'), '1999-00');
  for (const season of ['1987-89', '87-88', '1987', '1987-1989']) {
    assert.equal(ArchiveFeatureSchema.safeParse({ ...valid, season }).success, false);
  }
});

test('season-only History placement requires the whole July–June season to fit one tenure', () => {
  const { eras } = getHistory();
  for (const season of ['1987-88', '1987/88', '1987–88']) {
    assert.deepEqual(getArticleEraIds({ ...archive, season }, eras), ['kenny-dalglish-1985-1991']);
  }
  assert.deepEqual(getArticleEraIds({ ...archive, season: '1982-83' }, eras), ['bob-paisley']);
  assert.deepEqual(getArticleEraIds({ ...archive, season: '1983-84' }, eras), ['joe-fagan']);
  for (const season of ['1974-75', '1984-85', '1990-91', '1998-99', '2010-11', '2023-24']) {
    assert.deepEqual(getArticleEraIds({ ...archive, season }, eras), [], `Handover season ${season} needs editorial placement`);
  }
});

test('explicit eras override dates, dates override seasons, and manager identities never imply tenures', () => {
  const { eras } = getHistory();
  const contexts = { ...archive, season: '1987-88', historicalEventDate: '1978-09-02', managerIds: ['kenny-dalglish'] };
  assert.deepEqual(getArticleEraIds(contexts, eras), ['bob-paisley']);
  assert.deepEqual(getArticleEraIds({ ...contexts, historyEras: ['joe-fagan'] }, eras), ['joe-fagan']);
  assert.deepEqual(getArticleEraIds({ ...archive, managerIds: ['kenny-dalglish'] }, eras), []);
  assert.deepEqual(getArticleEraIds({ ...contexts, historicalEventDate: '1974-07-20' }, eras), [], 'An exact date in a vacancy cannot fall back to an unrelated season');
});

test('existing This Week links still resolve to the original Archive articles after migration', () => {
  const articles = getArchiveFeatures();
  const events = getHistoryEvents();
  for (const event of events.filter(event => event.archiveSlug)) {
    assert.ok(articles.some(article => article.slug === event.archiveSlug), event.archiveSlug);
  }
  const days = getHistoryWindow(events, new Date('2026-09-09T12:00:00Z'));
  const reading = getWeekReading(articles, days);
  assert.ok(reading.some(article => article.slug === 'liverpool-9-crystal-palace-0'));
  assert.equal(reading.length, new Set(reading.map(article => article.slug)).size);
});
