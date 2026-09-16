import { z } from 'zod';
import type { Block, Experience, ReferenceResolvers } from './types.ts';
import { compileMatchStates, replayContext } from './state.ts';

const text = z.string().trim().min(1);
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase kebab-case ID');
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value, 'Invalid calendar date');
const ids = z.array(id);
const claims = ids.min(1);
const boundary = id.nullable();
const side = z.enum(['subject', 'opposition']);
const confidence = z.enum(['High', 'Medium', 'Low']);
const number = z.number().finite().nonnegative();
const sideIds = z.object({ subject: ids.min(1), opposition: ids.min(1) }).strict();
const time = z.object({ label: text, precision: z.enum(['minute', 'interval', 'phase', 'approximate']), minute: z.number().int().nonnegative().optional(), addedMinute: z.number().int().nonnegative().optional() }).strict();
const phase = z.enum(['first-half', 'interval', 'second-half', 'end-normal-time', 'extra-time-first', 'extra-time-interval', 'extra-time-second', 'end-extra-time']);
const paragraphText = text.refine(value => !/(^|\n)\s{0,3}(?:#{1,6}\s|[-*+]\s|\d+\.\s|>|```)|!\[|<\/?[a-z][^>]*>/i.test(value), 'Paragraphs allow only inline Markdown, without headings, images, lists, code blocks or raw HTML');
const paragraph = z.object({ id, type: z.literal('paragraph'), text: paragraphText, claimIds: claims }).strict();
const list = z.object({ id, type: z.literal('list'), items: z.array(z.object({ text: paragraphText, claimIds: claims }).strict()).min(1) }).strict();
const contextBlock = z.object({ id, type: z.literal('context'), contextId: id }).strict();
const contextBlocks = z.discriminatedUnion('type', [paragraph, list, contextBlock]);
const comparisonView = z.object({ label: text, boundary, diagramId: id }).strict();
export const BlockSchema = z.discriminatedUnion('type', [paragraph, list, contextBlock,
  z.object({ id, type: z.literal('personnel'), side, boundary }).strict(),
  z.object({ id, type: z.literal('diagram'), diagramId: id }).strict(),
  z.object({ id, type: z.literal('statistics'), statisticsId: id }).strict(),
  z.object({ id, type: z.literal('comparison'), title: text, views: z.tuple([comparisonView, comparisonView]) }).strict(),
  z.object({ id, type: z.literal('shootout') }).strict(),
]);
const context = z.object({ id, title: text, scope: z.discriminatedUnion('type', [
  z.object({ type: z.literal('at-boundary'), boundary, label: text }).strict(),
  z.object({ type: z.literal('period'), start: date, end: date, label: text }).strict(),
  z.object({ type: z.literal('retrospective'), label: text }).strict(),
]), blocks: z.array(contextBlocks).min(1) }).strict();
const squadPerson = z.object({ personId: id, shirtNumber: z.number().int().positive() }).strict();
const roster = z.object({ starters: z.array(squadPerson).length(11), substitutes: z.array(squadPerson) }).strict();
export const MatchConfigSchema = z.object({ oppositionId: id, competitionLabel: text.optional(), rosters: z.object({ subject: roster, opposition: roster }).strict(), rules: z.object({ substitutionLimit: z.number().int().nonnegative(), allowReentry: z.literal(false), extraTimeSubstitutionBonus: z.number().int().nonnegative(), resolution: z.enum(['normal-time', 'extra-time-then-penalties']), claimIds: claims }).strict() }).strict();
const eventBase = { id, sequence: z.number().int().positive(), time, claimIds: claims };
export const MatchEventSchema = z.discriminatedUnion('type', [
  z.object({ ...eventBase, type: z.literal('phase-change'), payload: z.object({ phase }).strict() }).strict(),
  z.object({ ...eventBase, type: z.literal('goal'), payload: z.object({ side, scorerId: id, classification: z.enum(['open-play', 'penalty', 'rebound', 'own-goal']), assistedByIds: ids.optional() }).strict() }).strict(),
  z.object({ ...eventBase, type: z.literal('substitution'), payload: z.object({ side, outgoingId: id, incomingId: id }).strict() }).strict(),
  z.object({ ...eventBase, type: z.literal('booking'), payload: z.object({ side, personId: id }).strict() }).strict(),
  z.object({ ...eventBase, type: z.literal('dismissal'), payload: z.object({ side, personId: id }).strict() }).strict(),
  z.object({ ...eventBase, type: z.literal('penalty-awarded'), payload: z.object({ side, involvedPersonIds: ids.optional() }).strict() }).strict(),
  z.object({ ...eventBase, type: z.literal('penalty-saved'), payload: z.object({ side, takerId: id, goalkeeperId: id }).strict() }).strict(),
  z.object({ ...eventBase, type: z.literal('incident'), payload: z.object({ subtype: z.literal('goalkeeper-intervention'), involvedPersonIds: ids.min(1) }).strict() }).strict(),
  z.object({ ...eventBase, type: z.literal('shootout-start'), payload: z.object({ firstSide: side, eligibleTakers: sideIds, initialKicks: z.number().int().positive() }).strict() }).strict(),
  z.object({ ...eventBase, type: z.literal('shootout-attempt'), payload: z.object({ side, takerId: id, result: z.enum(['scored', 'saved', 'off-target', 'woodwork']), description: text.optional() }).strict() }).strict(),
]);
const diagram = z.object({ id, title: text, side, personnelBoundary: boundary, depictedPeriod: text, partial: z.boolean(), players: z.array(z.object({ personId: id, role: text, x: number.max(100), y: number.max(100), claimIds: claims }).strict()).min(1), arrows: z.array(z.object({ fromPersonId: id, toPersonId: id, meaning: z.enum(['observed-action', 'described-role-relationship', 'editorial-connection']), label: text, claimIds: claims }).strict()).optional(), claimIds: claims, interpretationNote: text, description: text }).strict();
const statistics = z.object({ id, title: text, provider: text, period: z.object({ start: id, end: id, includesAddedTime: z.boolean(), includesExtraTime: z.boolean(), label: text }).strict(), evidenceContext: text, observations: z.array(z.object({ metricId: id, label: text, unit: z.enum(['count', 'percent']), values: z.object({ subject: number.nullable(), opposition: number.nullable() }).strict(), sourceId: id, claimId: id, caveat: z.string() }).strict()).min(1) }).strict();
const source = z.object({ id, title: text, publisher: text, url: z.string().url().refine(value => /^https?:\/\//.test(value), 'Sources need an http(s) URL'), publishedOn: date.nullable(), retrievedOn: date, type: z.enum(['match-record', 'contemporary-report', 'later-participant-account', 'retrospective-analysis', 'rules', 'specialist-record']), confidence, scope: text, independenceGroup: text, locator: text.optional(), limitations: z.array(text) }).strict();
const claim = z.object({ id, statement: text, kind: z.enum(['verified-fact', 'statistical-observation', 'contemporary-reporting', 'later-recollection', 'tactical-interpretation']), sourceRefs: z.array(z.object({ sourceId: id, locator: text, relation: z.enum(['supports', 'qualifies', 'contradicts']) }).strict()).min(1), confidence, status: z.enum(['approved', 'needs-review', 'excluded']), temporalScope: text, displayTreatment: z.enum(['plain-fact', 'named-attribution', 'interpretation-label', 'uncertainty-note']), reviewNote: z.string() }).strict();
const relationships = z.object({ seasonIds: z.array(z.string().regex(/^\d{4}-\d{2}$/)), eraIds: ids, playerIds: ids, managerIds: ids, oppositionIds: ids, competitionIds: ids, locationIds: ids, articleSlugs: ids, seasonEventRefs: z.array(z.object({ seasonId: text, eventId: id }).strict()).optional(), seasonFactRefs: z.array(z.object({ seasonId: text, field: z.enum(['managers', 'leaguePosition', 'competitionSummary']), sourceIndex: z.number().int().nonnegative() }).strict()).optional() }).strict();
const editorial = z.object({ status: z.enum(['working-draft', 'reviewed']), reviewedOn: date.nullable(), provenance: z.object({ specification: text, baselineCommit: text, researchModel: text, researchTask: text }).strict(), unresolvedIssues: z.array(z.object({ id, description: text, blocking: z.boolean() }).strict()) }).strict();
const publication = z.discriminatedUnion('status', [z.object({ status: z.literal('draft') }).strict(), z.object({ status: z.literal('published'), publishedOn: date, approvalReference: text }).strict()]);
const base = { schemaVersion: z.literal(1), id, title: text, standfirst: text, dateRange: z.object({ start: date, end: date }).strict(), relationships, contexts: z.array(context), chapters: z.array(z.object({ id, title: text }).strict()).min(1), moments: z.array(z.object({ id, chapterId: id, title: text, afterEventId: boundary, blocks: z.array(BlockSchema).min(1), presentation: z.enum(['standard', 'exploration', 'compact-sequence', 'attempt-sequence']) }).strict()).min(1), diagrams: z.array(diagram), statistics: z.array(statistics), claims: z.array(claim).min(1), sources: z.array(source).min(1), editorial, publication };
export const ExperienceSchema = z.discriminatedUnion('kind', [
  z.object({ ...base, kind: z.literal('match'), match: MatchConfigSchema, events: z.array(MatchEventSchema) }).strict(),
  z.object({ ...base, kind: z.literal('context'), events: z.array(z.object({ id, sequence: z.number().int().positive(), type: z.literal('context-transition'), payload: z.object({ contextId: id }).strict(), claimIds: claims }).strict()) }).strict(),
]);

function check(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function unique(items: { id: string }[], label: string) { check(new Set(items.map(item => item.id)).size === items.length, `${label}: duplicate ID`); }

/** Structural, evidence, boundary, replay and optional canonical-reference validation. */
export function validateExperience(input: unknown, refs: ReferenceResolvers = {}): Experience {
  const experience = ExperienceSchema.parse(input) as Experience;
  const { contexts, moments, chapters, diagrams, statistics, claims, sources, publication } = experience;
  check(experience.dateRange.start <= experience.dateRange.end, 'Historical date range is reversed');
  for (const [label, items] of Object.entries({ contexts, moments, chapters, diagrams, statistics, claims, sources, events: experience.events })) unique(items, label);
  const eventIndex = new Map(experience.events.map((event, index) => [event.id, index]));
  const boundaryIndex = (value: string | null): number => {
    if (value === null) return -1;
    const index = eventIndex.get(value); check(index !== undefined, `Unknown event boundary: ${value}`); return index;
  };
  const sourceMap = new Map(sources.map(source => [source.id, source]));
  const claimMap = new Map(claims.map(claim => [claim.id, claim]));
  const contextMap = new Map(contexts.map(context => [context.id, context]));
  const diagramMap = new Map(diagrams.map(diagram => [diagram.id, diagram]));
  const statisticMap = new Map(statistics.map(statistic => [statistic.id, statistic]));
  const checkClaims = (claimIds: string[], owner: string) => {
    for (const claimId of claimIds) {
      const item = claimMap.get(claimId); check(item, `${owner}: unknown claim ID ${claimId}`);
      check(item.status !== 'excluded', `${owner}: excluded claim ${claimId} cannot be used`);
      if (publication.status === 'published') check(item.status === 'approved', `${owner}: unreviewed claim ${claimId} cannot be published`);
    }
  };
  for (const claim of claims) {
    for (const ref of claim.sourceRefs) check(sourceMap.has(ref.sourceId), `${claim.id}: unknown source ID ${ref.sourceId}`);
    check(claim.sourceRefs.some(ref => ref.relation === 'supports'), `${claim.id}: no supporting source`);
    if (claim.kind === 'tactical-interpretation') check(claim.displayTreatment === 'interpretation-label', `${claim.id}: tactical interpretation needs an explicit label`);
    if (claim.kind === 'later-recollection') check(claim.displayTreatment === 'named-attribution' || claim.displayTreatment === 'uncertainty-note', `${claim.id}: later recollection needs attribution`);
  }
  const states = experience.kind === 'match' ? compileMatchStates(experience.match, experience.events) : null;
  if (experience.kind === 'context') {
    replayContext(experience.events, experience.events.at(-1)?.id ?? null);
    check(!diagrams.length && !statistics.length, 'Context fixtures cannot contain football diagrams or match statistics');
    for (const event of experience.events) check(contextMap.has(event.payload.contextId), `${event.id}: unknown context ID ${event.payload.contextId}`);
  } else {
    checkClaims(experience.match.rules.claimIds, 'Match rules');
    check(refs.entity?.(experience.match.oppositionId, 'opposition') !== false, `Unknown opposition entity: ${experience.match.oppositionId}`);
    for (const side of ['subject', 'opposition'] as const) for (const person of [...experience.match.rosters[side].starters, ...experience.match.rosters[side].substitutes]) check(refs.entity?.(person.personId, 'person') !== false, `Unknown person entity: ${person.personId}`);
  }
  for (const event of experience.events) checkClaims(event.claimIds, event.id);
  for (const diagram of diagrams) {
    boundaryIndex(diagram.personnelBoundary); checkClaims(diagram.claimIds, diagram.id);
    const personnel = states?.[diagram.personnelBoundary ?? '$initial'].personnel[diagram.side].onField;
    check(personnel, `${diagram.id}: diagrams require match state`);
    check(new Set(diagram.players.map(p => p.personId)).size === diagram.players.length, `${diagram.id}: duplicate player`);
    if (!diagram.partial) check(diagram.players.length === personnel.length, `${diagram.id}: complete diagram does not match playing numbers at its boundary`);
    for (const person of diagram.players) { check(personnel.includes(person.personId), `${diagram.id}: ${person.personId} is not eligible at its personnel boundary`); checkClaims(person.claimIds, `${diagram.id}/${person.personId}`); }
    for (const arrow of diagram.arrows ?? []) {
      check(diagram.players.some(p => p.personId === arrow.fromPersonId) && diagram.players.some(p => p.personId === arrow.toPersonId), `${diagram.id}: arrow references a missing player`);
      checkClaims(arrow.claimIds, diagram.id);
    }
  }
  for (const statistic of statistics) {
    const start = boundaryIndex(statistic.period.start), end = boundaryIndex(statistic.period.end);
    check(start <= end, `${statistic.id}: statistics period is reversed`);
    const hasExtraTime = states?.[statistic.period.end].phase.startsWith('extra-time') || states?.[statistic.period.end].phase === 'end-extra-time';
    check(Boolean(hasExtraTime) === statistic.period.includesExtraTime, `${statistic.id}: extra-time coverage disagrees with its period boundary`);
    check(new Set(statistic.observations.map(observation => observation.metricId)).size === statistic.observations.length, `${statistic.id}: duplicate metric ID`);
    for (const observation of statistic.observations) {
      checkClaims([observation.claimId], statistic.id);
      check(sourceMap.has(observation.sourceId), `${statistic.id}: unknown source ID ${observation.sourceId}`);
      check(claimMap.get(observation.claimId)?.sourceRefs.some(ref => ref.sourceId === observation.sourceId), `${statistic.id}: metric provider source does not support its claim`);
      if (observation.unit === 'percent') for (const value of Object.values(observation.values)) check(value === null || value <= 100, `${statistic.id}: percentage exceeds 100`);
      if (observation.unit === 'count') for (const value of Object.values(observation.values)) check(value === null || Number.isInteger(value), `${statistic.id}: counts must be whole numbers`);
    }
  }
  let shootoutBlocks = 0;
  const validateBlocks = (blocks: Block[], owner: string, ownerBoundary: string | null, depth = 0, ancestors: string[] = []) => {
    unique(blocks, `${owner} blocks`);
    for (const block of blocks) {
      switch (block.type) {
        case 'paragraph': checkClaims(block.claimIds, `${owner}/${block.id}`); break;
        case 'list': for (const item of block.items) checkClaims(item.claimIds, `${owner}/${block.id}`); break;
        case 'context': {
          const value = contextMap.get(block.contextId); check(value, `${owner}: unknown context ID ${block.contextId}`);
          check(!ancestors.includes(value.id), `${owner}: recursive context ${value.id}`);
          check(depth <= 1, `${owner}: contexts may contain only one child-context level`);
          if (value.scope.type === 'at-boundary') check(boundaryIndex(value.scope.boundary) <= boundaryIndex(ownerBoundary), `${owner}: future context boundary is presented as current`);
          validateBlocks(value.blocks, value.id, value.scope.type === 'at-boundary' ? value.scope.boundary : ownerBoundary, depth + 1, [...ancestors, value.id]);
          break;
        }
        case 'personnel': check(states, `${owner}: personnel requires a match`); boundaryIndex(block.boundary); check(boundaryIndex(block.boundary) <= boundaryIndex(ownerBoundary), `${owner}: future personnel boundary is presented as current`); break;
        case 'diagram': { const value = diagramMap.get(block.diagramId); check(value, `${owner}: unknown diagram ID ${block.diagramId}`); check(boundaryIndex(value.personnelBoundary) <= boundaryIndex(ownerBoundary), `${owner}: future diagram is presented as current`); break; }
        case 'comparison': for (const view of block.views) { const value = diagramMap.get(view.diagramId); check(value, `${owner}: unknown comparison diagram ${view.diagramId}`); boundaryIndex(view.boundary); check(value.personnelBoundary === view.boundary, `${owner}: comparison diagram and view boundary disagree`); } break;
        case 'statistics': { const value = statisticMap.get(block.statisticsId); check(value, `${owner}: unknown statistics ID ${block.statisticsId}`); check(boundaryIndex(value.period.end) <= boundaryIndex(ownerBoundary), `${owner}: future statistical period is presented as current`); break; }
        case 'shootout': check(experience.kind === 'match', `${owner}: shoot-out requires a match`); shootoutBlocks += 1; break;
      }
    }
  };
  let lastChapter = -1, lastBoundary = -1;
  const usedChapters = new Set<string>();
  for (const moment of moments) {
    check(!/^shootout-\d+$/.test(moment.id), `${moment.id}: attempt anchors are generated, not authored moments`);
    const chapterIndex = chapters.findIndex(chapter => chapter.id === moment.chapterId);
    check(chapterIndex !== -1, `${moment.id}: unknown chapter ID ${moment.chapterId}`);
    check(chapterIndex >= lastChapter, `${moment.id}: chapter membership must be contiguous and ordered`);
    const index = boundaryIndex(moment.afterEventId);
    check(index >= lastBoundary, `${moment.id}: moment boundaries must follow event order`);
    lastChapter = chapterIndex; lastBoundary = index; usedChapters.add(moment.chapterId);
    if (moment.blocks.some(block => block.type === 'shootout')) check(moment.presentation === 'attempt-sequence', `${moment.id}: shoot-out needs attempt-sequence presentation`);
    validateBlocks(moment.blocks, moment.id, moment.afterEventId);
  }
  check(chapters.every(chapter => usedChapters.has(chapter.id)), 'Every chapter needs a principal moment');
  check(shootoutBlocks <= 1, 'A match can have only one shoot-out block');
  // Validate contexts even when no moment uses them, without double-counting match modules.
  for (const context of contexts) {
    if (context.scope.type === 'at-boundary') boundaryIndex(context.scope.boundary);
    if (context.scope.type === 'period') check(context.scope.start <= context.scope.end, `${context.id}: context period is reversed`);
    validateBlocks(context.blocks, context.id, context.scope.type === 'at-boundary' ? context.scope.boundary : experience.events.at(-1)?.id ?? null, 1, [context.id]);
  }
  for (const [key, values] of Object.entries(experience.relationships)) if (Array.isArray(values) && values.every(value => typeof value === 'string')) check(new Set(values).size === values.length, `${key}: duplicate reference`);
  for (const key of ['playerIds', 'managerIds', 'oppositionIds', 'competitionIds', 'locationIds'] as const) {
    const kind = key === 'playerIds' || key === 'managerIds' ? 'person' : key === 'oppositionIds' ? 'opposition' : key === 'competitionIds' ? 'competition' : 'location';
    for (const value of experience.relationships[key]) check(refs.entity?.(value, kind) !== false, `Unknown ${kind} entity: ${value}`);
  }
  for (const value of experience.relationships.seasonIds) check(refs.season?.(value) !== false, `Unknown season: ${value}`);
  for (const value of experience.relationships.eraIds) check(refs.era?.(value) !== false, `Unknown era: ${value}`);
  for (const value of experience.relationships.articleSlugs) check(refs.article?.(value) !== false, `Unknown or non-factual published article: ${value}`);
  for (const value of experience.relationships.seasonEventRefs ?? []) check(refs.seasonEvent?.(value.seasonId, value.eventId) !== false, `Unknown season event: ${value.seasonId}/${value.eventId}`);
  for (const value of experience.relationships.seasonFactRefs ?? []) check(refs.seasonFact?.(value.seasonId, value.field, value.sourceIndex) !== false, `Unresolved season fact: ${value.seasonId}/${value.field}`);
  if (publication.status === 'published') {
    check(experience.kind === 'match', 'Context fixtures cannot enter public content');
    check(experience.editorial.status === 'reviewed' && experience.editorial.reviewedOn, 'Publication requires a reviewed editorial record');
    check(!experience.editorial.unresolvedIssues.some(issue => issue.blocking), 'Publication has blocking evidence issues');
  }
  return experience;
}
