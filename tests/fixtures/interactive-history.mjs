import { getHistoryEntities } from '../../lib/content/entities.ts';

// Engineering fixture only: existing identities exercise canonical resolution;
// the record is written exclusively into temporary directories, never content.
export function fixture(id = 'synthetic-review') {
  const people = getHistoryEntities().filter(entity => entity.kind === 'person').map(entity => entity.id);
  const squad = offset => ({ starters: people.slice(offset, offset + 11).map((personId, i) => ({ personId, shirtNumber: i + 1 })), substitutes: people.slice(offset + 11, offset + 14).map((personId, i) => ({ personId, shirtNumber: i + 12 })) });
  const rosters = { subject: squad(0), opposition: squad(14) };
  const event = (id, sequence, type, payload) => ({ id, sequence, type, payload, time: { label: 'Synthetic event', precision: 'phase' }, claimIds: ['fixture-claim'] });
  return {
    schemaVersion: 1, id, kind: 'match', title: 'Synthetic review fixture', standfirst: 'Engineering fixture for publication boundaries.', dateRange: { start: '2005-05-25', end: '2005-05-25' },
    relationships: { seasonIds: ['2004-05'], eraIds: ['rafael-benitez'], playerIds: ['steven-gerrard'], managerIds: ['rafael-benitez'], oppositionIds: ['ac-milan'], competitionIds: ['european-cup'], locationIds: [], articleSlugs: ['liverpool-monaco-champions-league-2004'] },
    contexts: [], chapters: [{ id: 'fixture', title: 'Synthetic match' }],
    moments: [
      { id: 'beginning', chapterId: 'fixture', title: 'Before kick-off', afterEventId: null, presentation: 'standard', blocks: [{ id: 'intro', type: 'paragraph', text: 'Synthetic engineering fixture.', claimIds: ['fixture-claim'] }] },
      { id: 'outcome', chapterId: 'fixture', title: 'Final result', afterEventId: 'full-time', presentation: 'standard', blocks: [{ id: 'final', type: 'paragraph', text: 'Synthetic fixture ends here.', claimIds: ['fixture-claim'] }] },
    ],
    match: { oppositionId: 'ac-milan', rosters, rules: { substitutionLimit: 3, allowReentry: false, extraTimeSubstitutionBonus: 0, resolution: 'normal-time', claimIds: ['fixture-claim'] } },
    events: [event('kick-off', 1, 'phase-change', { phase: 'first-half' }), event('goal', 2, 'goal', { side: 'opposition', scorerId: rosters.opposition.starters[0].personId, classification: 'open-play' }), event('interval', 3, 'phase-change', { phase: 'interval' }), event('restart', 4, 'phase-change', { phase: 'second-half' }), event('full-time', 5, 'phase-change', { phase: 'end-normal-time' })],
    diagrams: [], statistics: [],
    claims: [{ id: 'fixture-claim', statement: 'Synthetic example for software verification.', kind: 'verified-fact', sourceRefs: [{ sourceId: 'fixture-source', locator: 'Synthetic fixture', relation: 'supports' }], confidence: 'High', status: 'approved', temporalScope: 'Engineering test', displayTreatment: 'plain-fact', reviewNote: 'PRIVATE_CLAIM_NOTE' }],
    sources: [{ id: 'fixture-source', title: 'Synthetic fixture source', publisher: 'Engineering test', url: 'https://example.org/fixture', publishedOn: null, retrievedOn: '2026-09-16', type: 'match-record', confidence: 'High', scope: 'Engineering fixture only', independenceGroup: 'fixture', limitations: [] }],
    editorial: { status: 'reviewed', reviewedOn: '2026-09-16', provenance: { specification: 'PRIVATE_SPECIFICATION', baselineCommit: '7c3fde673c01904d81cec930f66064bf7cf45565', researchModel: 'PRIVATE_MODEL', researchTask: 'PRIVATE_TASK' }, unresolvedIssues: [] },
    publication: { status: 'published', publishedOn: '2026-09-16', approvalReference: 'SYNTHETIC_TEST_APPROVAL' },
  };
}
