import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { initialMatchState, reduceMatchState, replayMatch, compileMatchStates, replayContext } from '../lib/interactive-history/state.ts';
import { ExperienceSchema, validateExperience } from '../lib/interactive-history/schema.ts';

const roster = prefix => ({ starters: Array.from({ length: 11 }, (_, i) => ({ personId: `${prefix}-${i + 1}`, shirtNumber: i + 1 })), substitutes: Array.from({ length: 4 }, (_, i) => ({ personId: `${prefix}-sub-${i + 1}`, shirtNumber: i + 12 })) });
const match = (resolution = 'extra-time-then-penalties') => ({ oppositionId: 'test-opponent', rosters: { subject: roster('red'), opposition: roster('blue') }, rules: { substitutionLimit: 3, allowReentry: false, extraTimeSubstitutionBonus: 0, resolution, claimIds: ['record'] } });
const ev = (id, sequence, type, payload) => ({ id, sequence, type, time: { label: id, precision: 'phase' }, payload, claimIds: ['record'] });
const phase = (id, sequence, value) => ev(id, sequence, 'phase-change', { phase: value });
const phases = () => [phase('kickoff', 1, 'first-half'), phase('interval', 2, 'interval'), phase('restart', 3, 'second-half'), phase('ninety', 4, 'end-normal-time'), phase('extra-first', 5, 'extra-time-first'), phase('extra-interval', 6, 'extra-time-interval'), phase('extra-second', 7, 'extra-time-second'), phase('extra-end', 8, 'end-extra-time')];
function penaltySetup(initialKicks = 5) {
  return [...phases(), ev('penalties', 9, 'shootout-start', { firstSide: 'opposition', initialKicks, eligibleTakers: { subject: match().rosters.subject.starters.map(p => p.personId), opposition: match().rosters.opposition.starters.map(p => p.personId) } })];
}
const kick = (n, side, result, takerId = `${side === 'subject' ? 'red' : 'blue'}-${Math.ceil(n / 2)}`) => ev(`kick-${n}`, 9 + n, 'shootout-attempt', { side, takerId, result });
function baseExperience() {
  return {
    schemaVersion: 1, id: 'synthetic-match', kind: 'match', title: 'Synthetic match — engineering fixture', standfirst: 'A non-public contract fixture.', dateRange: { start: '2005-01-01', end: '2005-01-01' },
    relationships: { seasonIds: [], eraIds: [], playerIds: [], managerIds: [], oppositionIds: ['test-opponent'], competitionIds: [], locationIds: [], articleSlugs: [] },
    match: match('normal-time'), events: [phase('kickoff', 1, 'first-half')],
    contexts: [], chapters: [{ id: 'opening', title: 'Opening' }], moments: [{ id: 'beginning', chapterId: 'opening', title: 'Beginning', afterEventId: null, presentation: 'standard', blocks: [{ id: 'account', type: 'paragraph', text: 'Synthetic fixture.', claimIds: ['record'] }] }], diagrams: [], statistics: [],
    claims: [{ id: 'record', statement: 'Engineering example only.', kind: 'verified-fact', sourceRefs: [{ sourceId: 'test-source', locator: 'Fixture definition', relation: 'supports' }], confidence: 'High', status: 'approved', temporalScope: 'Fixture', displayTreatment: 'plain-fact', reviewNote: 'Not historical content.' }],
    sources: [{ id: 'test-source', title: 'Engineering fixture', publisher: 'Test suite', url: 'https://example.com/fixture', publishedOn: null, retrievedOn: '2026-09-16', type: 'match-record', confidence: 'High', scope: 'Synthetic tests only', independenceGroup: 'fixture', limitations: ['Not historical evidence'] }],
    editorial: { status: 'working-draft', reviewedOn: null, provenance: { specification: 'Istanbul Interactive History v1.1', baselineCommit: 'fixture', researchModel: 'none', researchTask: 'none' }, unresolvedIssues: [] }, publication: { status: 'draft' },
  };
}

test('match replay starts with derived zero scores and does not mutate source records', () => {
  const config = match(), events = [phase('kickoff', 1, 'first-half'), ev('goal', 2, 'goal', { side: 'opposition', scorerId: 'blue-1', classification: 'open-play' })];
  const before = JSON.stringify({ config, events });
  const state = replayMatch(config, events, 'goal');
  assert.deepEqual(state.score, { subject: 0, opposition: 1 });
  assert.equal(JSON.stringify({ config, events }), before);
  assert.deepEqual(initialMatchState(config).score, { subject: 0, opposition: 0 });
});

test('synthetic ordinary match uses different credited side, substitution order and normal-time result', () => {
  const fixture = baseExperience();
  fixture.events = [phase('kickoff', 1, 'first-half'), ev('blue-goal', 2, 'goal', { side: 'opposition', scorerId: 'blue-2', classification: 'open-play' }), ev('blue-change', 3, 'substitution', { side: 'opposition', outgoingId: 'blue-3', incomingId: 'blue-sub-2' }), phase('interval', 4, 'interval'), ev('red-change', 5, 'substitution', { side: 'subject', outgoingId: 'red-4', incomingId: 'red-sub-3' }), phase('restart', 6, 'second-half'), phase('ninety', 7, 'end-normal-time')];
  fixture.moments.push({ id: 'result', chapterId: 'opening', title: 'Result', afterEventId: 'ninety', presentation: 'standard', blocks: [{ id: 'result-account', type: 'paragraph', text: 'Synthetic result.', claimIds: ['record'] }] });
  validateExperience(fixture);
  const state = replayMatch(fixture.match, fixture.events, 'ninety');
  assert.deepEqual(state.outcome, { result: 'win', winner: 'opposition', method: 'normal-time' });
  assert.ok(state.personnel.opposition.onField.includes('blue-sub-2'));
  assert.ok(state.personnel.subject.onField.includes('red-sub-3'));
  assert.throws(() => reduceMatchState(state, phase('invalid-extra', 8, 'extra-time-first')), /resolved outcome/);
});

test('normal-time draws resolve and tied knockout normal time stays unresolved', () => {
  assert.equal(replayMatch(match('normal-time'), phases().slice(0, 4), 'ninety').outcome.result, 'draw');
  assert.equal(replayMatch(match(), phases().slice(0, 4), 'ninety').outcome, null);
});

test('saved in-match penalties do not count; a rebound is one match goal', () => {
  const events = [phase('kickoff', 1, 'first-half'), ev('award', 2, 'penalty-awarded', { side: 'subject' }), ev('save', 3, 'penalty-saved', { side: 'subject', takerId: 'red-2', goalkeeperId: 'blue-1' }), ev('rebound', 4, 'goal', { side: 'subject', scorerId: 'red-2', classification: 'rebound' })];
  assert.deepEqual(replayMatch(match(), events, 'save').score, { subject: 0, opposition: 0 });
  const result = replayMatch(match(), events, 'rebound');
  assert.deepEqual(result.score, { subject: 1, opposition: 0 });
  assert.equal(result.shootout, null);
});

test('own goals credit the opposite side to their scorer', () => {
  const events = [phase('kickoff', 1, 'first-half'), ev('own-goal', 2, 'goal', { side: 'opposition', scorerId: 'red-1', classification: 'own-goal' })];
  assert.equal(replayMatch(match(), events, 'own-goal').score.opposition, 1);
  events[1].payload.scorerId = 'blue-1';
  assert.throws(() => replayMatch(match(), events, 'own-goal'), /not on the field/);
});

test('substitution invariants reject repeat entry, re-entry and excess changes', () => {
  const events = [phase('kickoff', 1, 'first-half'), ev('first-sub', 2, 'substitution', { side: 'subject', outgoingId: 'red-1', incomingId: 'red-sub-1' })];
  const state = replayMatch(match(), events, 'first-sub');
  assert.throws(() => reduceMatchState(state, ev('repeat', 3, 'substitution', { side: 'subject', outgoingId: 'red-2', incomingId: 'red-sub-1' })), /unused named substitute/);
  assert.throws(() => reduceMatchState(state, ev('reentry', 3, 'substitution', { side: 'subject', outgoingId: 'red-sub-1', incomingId: 'red-1' })), /re-entry/);
  let current = state;
  for (let i = 2; i <= 3; i++) current = reduceMatchState(current, ev(`sub-${i}`, i + 1, 'substitution', { side: 'subject', outgoingId: `red-${i}`, incomingId: `red-sub-${i}` }));
  assert.throws(() => reduceMatchState(current, ev('fourth', 5, 'substitution', { side: 'subject', outgoingId: 'red-4', incomingId: 'red-sub-4' })), /limit exceeded/);
});

test('dismissals reduce playing numbers and cannot be reversed by a substitution', () => {
  const state = replayMatch(match(), [phase('kickoff', 1, 'first-half'), ev('dismissal', 2, 'dismissal', { side: 'subject', personId: 'red-1' })], 'dismissal');
  assert.equal(state.personnel.subject.onField.length, 10);
  assert.throws(() => reduceMatchState(state, ev('replacement', 3, 'substitution', { side: 'subject', outgoingId: 'red-1', incomingId: 'red-sub-1' })), /not on the field/);
});

test('shoot-out early completion, attempts and match scores stay separate', () => {
  const events = penaltySetup();
  for (let n = 1; n <= 6; n++) events.push(kick(n, n % 2 ? 'opposition' : 'subject', n % 2 ? 'saved' : 'scored'));
  const state = replayMatch(match(), events, 'kick-6');
  assert.deepEqual(state.score, { subject: 0, opposition: 0 });
  assert.deepEqual(state.shootout.score, { subject: 3, opposition: 0 });
  assert.equal(state.shootout.attempts.length, 6);
  assert.equal(state.outcome.winner, 'subject');
  assert.throws(() => reduceMatchState(state, kick(7, 'opposition', 'scored')), /resolved outcome/);
});

test('sudden death requires equal attempts before a winner; takers can repeat only after a cycle', () => {
  const events = [...penaltySetup(1), kick(1, 'opposition', 'scored'), kick(2, 'subject', 'scored'), kick(3, 'opposition', 'scored'), kick(4, 'subject', 'saved')];
  assert.equal(replayMatch(match(), events, 'kick-3').outcome, null);
  assert.equal(replayMatch(match(), events, 'kick-4').outcome.winner, 'opposition');
  const repeated = [...penaltySetup(1), kick(1, 'opposition', 'scored'), kick(2, 'subject', 'scored'), kick(3, 'opposition', 'scored', 'blue-1')];
  assert.throws(() => compileMatchStates(match(), repeated), /repeated taker/);
  const cycle = penaltySetup(1);
  for (let n = 1; n <= 24; n++) cycle.push(kick(n, n % 2 ? 'opposition' : 'subject', 'scored', `${n % 2 ? 'blue' : 'red'}-${(Math.ceil(n / 2) - 1) % 11 + 1}`));
  assert.equal(compileMatchStates(match(), cycle)['kick-24'].outcome, null);
});

test('penalties reject consecutive sides, removed takers and an ineligible start', () => {
  assert.throws(() => compileMatchStates(match(), [...penaltySetup(), kick(1, 'opposition', 'scored'), kick(2, 'opposition', 'scored')]), /alternate/);
  assert.throws(() => compileMatchStates(match(), [...penaltySetup(), kick(1, 'opposition', 'saved', 'blue-sub-1')]), /not an eligible/);
  assert.throws(() => compileMatchStates(match(), [phase('kickoff', 1, 'first-half'), { ...penaltySetup().at(-1), sequence: 2 }]), /after extra time/);
  const reducedWithoutReason = penaltySetup();
  reducedWithoutReason.at(-1).payload.eligibleTakers = { subject: ['red-1'], opposition: ['blue-1'] };
  assert.throws(() => compileMatchStates(match(), reducedWithoutReason), /must cover the on-field players/);
});

test('match-specific extra-time bonus applies only after extra time begins', () => {
  const config = match(); config.rules.extraTimeSubstitutionBonus = 1;
  const events = [phase('kickoff', 1, 'first-half')];
  for (let n = 1; n <= 3; n++) events.push(ev(`sub-${n}`, n + 1, 'substitution', { side: 'subject', outgoingId: `red-${n}`, incomingId: `red-sub-${n}` }));
  const fourth = ev('fourth-sub', 5, 'substitution', { side: 'subject', outgoingId: 'red-4', incomingId: 'red-sub-4' });
  assert.throws(() => compileMatchStates(config, [...events, fourth]), /limit exceeded/);
  events.push(phase('interval', 5, 'interval'), phase('restart', 6, 'second-half'), phase('ninety', 7, 'end-normal-time'), phase('extra-first', 8, 'extra-time-first'), { ...fourth, sequence: 9 });
  assert.equal(compileMatchStates(config, events)['fourth-sub'].substitutionsUsed.subject, 4);
  const noBonus = match();
  assert.throws(() => compileMatchStates(noBonus, events), /limit exceeded/);
});

test('compiled states equal direct replay at every event prefix', () => {
  const events = [...penaltySetup(), kick(1, 'opposition', 'off-target'), kick(2, 'subject', 'scored')];
  const compiled = compileMatchStates(match(), events);
  for (const event of events) assert.deepEqual(compiled[event.id], replayMatch(match(), events, event.id));
  assert.deepEqual(compiled.$initial, replayMatch(match(), events, null));
  assert.throws(() => replayMatch(match(), events, 'missing'), /Unknown event boundary/);
});

test('schema rejects unknown fields, dangling claims/sources and canonical wrong kinds', () => {
  const fixture = baseExperience(); validateExperience(fixture);
  assert.throws(() => ExperienceSchema.parse({ ...fixture, currentScore: '1-0' }), /Unrecognized key/);
  const wrongClaim = structuredClone(fixture); wrongClaim.events[0].claimIds = ['missing'];
  assert.throws(() => validateExperience(wrongClaim), /unknown claim ID/);
  const wrongSource = structuredClone(fixture); wrongSource.claims[0].sourceRefs[0].sourceId = 'missing';
  assert.throws(() => validateExperience(wrongSource), /unknown source ID/);
  assert.throws(() => validateExperience(fixture, { entity: (_id, kind) => kind !== 'person' }), /Unknown person entity/);
  const badOrder = structuredClone(fixture); badOrder.events.push({ ...badOrder.events[0], id: 'another' });
  assert.throws(() => validateExperience(badOrder), /strictly increasing/);
});

test('schema rejects a diagram showing a future substitute at the initial boundary', () => {
  const fixture = baseExperience();
  fixture.diagrams = [{ id: 'wrong-team', title: 'Invalid diagram', side: 'subject', personnelBoundary: null, depictedPeriod: 'Before kick-off', partial: true, players: [{ personId: 'red-sub-1', role: 'Forward', x: 50, y: 50, claimIds: ['record'] }], claimIds: ['record'], interpretationNote: 'Schematic.', description: 'Invalid fixture.' }];
  assert.throws(() => validateExperience(fixture), /not eligible at its personnel boundary/);
});

test('schema rejects recursive contexts and unsupported nested payload fields', () => {
  const fixture = baseExperience();
  fixture.contexts = [{ id: 'loop-a', title: 'A', scope: { type: 'retrospective', label: 'Reference' }, blocks: [{ id: 'to-b', type: 'context', contextId: 'loop-b' }] }, { id: 'loop-b', title: 'B', scope: { type: 'retrospective', label: 'Reference' }, blocks: [{ id: 'to-a', type: 'context', contextId: 'loop-a' }] }];
  assert.throws(() => validateExperience(fixture), /recursive context|child-context level/);
  const arbitraryPatch = baseExperience(); arbitraryPatch.events[0].payload.score = { subject: 3, opposition: 3 };
  assert.throws(() => validateExperience(arbitraryPatch), /Unrecognized key/);
  const reentryRule = baseExperience(); reentryRule.match.rules.allowReentry = true;
  assert.throws(() => validateExperience(reentryRule), /expected false/);
});

test('schema rejects a comparison diagram with the wrong explicit personnel boundary', () => {
  const fixture = baseExperience();
  fixture.diagrams = [{ id: 'starting-player', title: 'Starting player', side: 'subject', personnelBoundary: null, depictedPeriod: 'Before kick-off', partial: true, players: [{ personId: 'red-1', role: 'Goalkeeper', x: 50, y: 90, claimIds: ['record'] }], claimIds: ['record'], interpretationNote: 'Schematic.', description: 'Fixture.' }];
  fixture.moments[0].blocks.push({ id: 'comparison', type: 'comparison', title: 'Two states', views: [{ label: 'Before kick-off', boundary: null, diagramId: 'starting-player' }, { label: 'At kickoff', boundary: 'kickoff', diagramId: 'starting-player' }] });
  assert.throws(() => validateExperience(fixture), /comparison diagram and view boundary disagree/);
});

test('schema rejects future statistics used at an earlier moment', () => {
  const fixture = baseExperience(); fixture.events = phases().slice(0, 4);
  fixture.statistics = [{ id: 'later-data', title: 'Later data', provider: 'Fixture', period: { start: 'kickoff', end: 'ninety', includesAddedTime: true, includesExtraTime: false, label: 'End of normal time' }, evidenceContext: 'Synthetic', observations: [{ metricId: 'shots', label: 'Shots', unit: 'count', values: { subject: 1, opposition: 2 }, sourceId: 'test-source', claimId: 'record', caveat: '' }] }];
  fixture.moments[0].blocks.push({ id: 'future-stats', type: 'statistics', statisticsId: 'later-data' });
  assert.throws(() => validateExperience(fixture), /future statistical period/);
  fixture.moments[0].blocks.pop();
  fixture.statistics[0].period.includesExtraTime = true;
  assert.throws(() => validateExperience(fixture), /extra-time coverage disagrees/);
  fixture.statistics[0].period.includesExtraTime = false;
  fixture.statistics[0].observations[0].values.subject = 1.5;
  assert.throws(() => validateExperience(fixture), /counts must be whole numbers/);
  fixture.statistics[0].observations[0].values.subject = 1;
  fixture.statistics[0].observations.push(structuredClone(fixture.statistics[0].observations[0]));
  assert.throws(() => validateExperience(fixture), /duplicate metric ID/);
});

test('publication requires reviewed claims and editorial status, not dates alone', () => {
  const fixture = baseExperience(); fixture.publication = { status: 'published', publishedOn: '2026-09-16', approvalReference: 'Synthetic test only' };
  assert.throws(() => validateExperience(fixture), /reviewed editorial record/);
  fixture.editorial.status = 'reviewed'; fixture.editorial.reviewedOn = '2026-09-16'; fixture.claims[0].status = 'needs-review';
  assert.throws(() => validateExperience(fixture), /unreviewed claim/);
  fixture.publication = { status: 'draft' }; validateExperience(fixture);
  fixture.claims[0].status = 'excluded'; assert.throws(() => validateExperience(fixture), /excluded claim/);
});

test('clock-free context fixture uses the shared reading contract without match fields', () => {
  const fixture = baseExperience(); delete fixture.match; fixture.kind = 'context'; fixture.id = 'synthetic-context';
  fixture.contexts = [{ id: 'background', title: 'Background', scope: { type: 'retrospective', label: 'Reference context' }, blocks: [{ id: 'context-text', type: 'paragraph', text: 'A context-only engineering fixture.', claimIds: ['record'] }] }];
  fixture.events = [{ id: 'context-begins', sequence: 1, type: 'context-transition', payload: { contextId: 'background' }, claimIds: ['record'] }];
  fixture.moments[0].afterEventId = 'context-begins';
  validateExperience(fixture);
  assert.deepEqual(replayContext(fixture.events, 'context-begins'), { contextId: 'background' });
  assert.deepEqual(replayContext(fixture.events), { contextId: null });
  assert.equal('clock' in replayContext(fixture.events, 'context-begins'), false);
});

test('held Istanbul record matches the independently supplied score, personnel and penalty baseline', () => {
  const file = new URL('../docs/editorial/interactive-history/istanbul-2005/held-experience.json', import.meta.url);
  const record = validateExperience(JSON.parse(fs.readFileSync(file, 'utf8')));
  assert.equal(record.kind, 'match');
  const states = compileMatchStates(record.match, record.events);
  for (const [boundary, score] of [['maldini-goal', [0, 1]], ['crespo-goal-one', [0, 2]], ['crespo-goal-two', [0, 3]], ['gerrard-goal', [1, 3]], ['smicer-goal', [2, 3]], ['alonso-rebound-goal', [3, 3]]]) assert.deepEqual(Object.values(states[boundary].score), score, boundary);
  const interval = states['interval-start'];
  assert.ok(interval.personnel.subject.onField.includes('vladimir-smicer'));
  assert.ok(interval.personnel.subject.onField.includes('steve-finnan'));
  assert.ok(!interval.personnel.subject.onField.includes('harry-kewell'));
  assert.equal(interval.substitutionsUsed.subject, 1);
  assert.equal(interval.personnel.subject.unusedSubstitutes.length, 6);
  const restart = states['second-half-start'];
  assert.ok(restart.personnel.subject.onField.includes('dietmar-hamann'));
  assert.ok(!restart.personnel.subject.onField.includes('steve-finnan'));
  assert.equal(restart.substitutionsUsed.subject, 2);
  assert.ok(states['normal-time-ended'].personnel.subject.onField.includes('djibril-cisse'));
  assert.ok(states['normal-time-ended'].personnel.opposition.onField.includes('jon-dahl-tomasson'));
  assert.ok(states['normal-time-ended'].personnel.opposition.onField.includes('serginho'));
  assert.ok(states['rui-costa-for-gattuso'].personnel.opposition.onField.includes('rui-costa'));
  const expected = [[0, 0], [1, 0], [1, 0], [2, 0], [2, 1], [2, 1], [2, 2], [3, 2], [3, 2]];
  const takers = ['serginho', 'dietmar-hamann', 'andrea-pirlo', 'djibril-cisse', 'jon-dahl-tomasson', 'john-arne-riise', 'kaka', 'vladimir-smicer', 'andriy-shevchenko'];
  expected.forEach((score, i) => { const state = states[`penalty-${i + 1}`]; assert.deepEqual(Object.values(state.shootout.score), score); assert.deepEqual(state.score, { subject: 3, opposition: 3 }); assert.equal(state.shootout.attempts.at(-1).takerId, takers[i]); assert.equal(Boolean(state.outcome), i === 8); });
  assert.equal(states['penalty-9'].shootout.attemptsTaken.subject, 4);
  assert.equal(states['penalty-9'].outcome.winner, 'subject');
  assert.deepEqual(replayMatch(record.match, record.events, 'interval-start'), interval);
});
