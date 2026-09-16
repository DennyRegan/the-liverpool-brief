/** Serializable authoring and replay contracts. No loaders or browser dependencies. */
export type Side = 'subject' | 'opposition';
export type Boundary = string | null;
export type Phase = 'before-kickoff' | 'first-half' | 'interval' | 'second-half' | 'end-normal-time' | 'extra-time-first' | 'extra-time-interval' | 'extra-time-second' | 'end-extra-time' | 'shootout';
export type TimeLabel = { label: string; precision: 'minute' | 'interval' | 'phase' | 'approximate'; minute?: number; addedMinute?: number };
export type SquadPerson = { personId: string; shirtNumber: number };
export type MatchRules = { substitutionLimit: number; allowReentry: false; extraTimeSubstitutionBonus: number; resolution: 'normal-time' | 'extra-time-then-penalties'; claimIds: string[] };
export type MatchConfig = { oppositionId: string; competitionLabel?: string; rosters: Record<Side, { starters: SquadPerson[]; substitutes: SquadPerson[] }>; rules: MatchRules };
export type PenaltyResult = 'scored' | 'saved' | 'off-target' | 'woodwork';
export type EventPayloads = {
  'phase-change': { phase: Exclude<Phase, 'before-kickoff' | 'shootout'> };
  goal: { side: Side; scorerId: string; classification: 'open-play' | 'penalty' | 'rebound' | 'own-goal'; assistedByIds?: string[] };
  substitution: { side: Side; outgoingId: string; incomingId: string };
  booking: { side: Side; personId: string };
  dismissal: { side: Side; personId: string };
  'penalty-awarded': { side: Side; involvedPersonIds?: string[] };
  'penalty-saved': { side: Side; takerId: string; goalkeeperId: string };
  incident: { subtype: 'goalkeeper-intervention'; involvedPersonIds: string[] };
  'shootout-start': { firstSide: Side; eligibleTakers: Record<Side, string[]>; initialKicks: number };
  'shootout-attempt': { side: Side; takerId: string; result: PenaltyResult; description?: string };
};
export type MatchEvent = { [K in keyof EventPayloads]: { id: string; sequence: number; type: K; time: TimeLabel; payload: EventPayloads[K]; claimIds: string[] } }[keyof EventPayloads];
export type ContextEvent = { id: string; sequence: number; type: 'context-transition'; payload: { contextId: string }; claimIds: string[] };
export type Outcome = { result: 'win'; winner: Side; method: 'normal-time' | 'extra-time' | 'penalties' } | { result: 'draw'; winner: null; method: 'normal-time' };
export type ShootoutAttempt = EventPayloads['shootout-attempt'] & { eventId: string };
export type MatchState = {
  phase: Phase; clock: TimeLabel; score: Record<Side, number>; rules: MatchRules;
  personnel: Record<Side, { onField: string[]; unusedSubstitutes: string[]; removed: string[] }>;
  substitutionsUsed: Record<Side, number>;
  discipline: { eventId: string; type: 'booking' | 'dismissal'; side: Side; personId: string }[];
  shootout: null | { firstSide: Side; initialKicks: number; eligibleTakers: Record<Side, string[]>; attempts: ShootoutAttempt[]; attemptsTaken: Record<Side, number>; score: Record<Side, number>; nextSide: Side | null; complete: boolean; winner: Side | null };
  outcome: Outcome | null;
};
export type EvidenceSource = { id: string; title: string; publisher: string; url: string; publishedOn: string | null; retrievedOn: string; type: 'match-record' | 'contemporary-report' | 'later-participant-account' | 'retrospective-analysis' | 'rules' | 'specialist-record'; confidence: 'High' | 'Medium' | 'Low'; scope: string; independenceGroup: string; locator?: string; limitations: string[] };
export type Claim = { id: string; statement: string; kind: 'verified-fact' | 'statistical-observation' | 'contemporary-reporting' | 'later-recollection' | 'tactical-interpretation'; sourceRefs: { sourceId: string; locator: string; relation: 'supports' | 'qualifies' | 'contradicts' }[]; confidence: 'High' | 'Medium' | 'Low'; status: 'approved' | 'needs-review' | 'excluded'; temporalScope: string; displayTreatment: 'plain-fact' | 'named-attribution' | 'interpretation-label' | 'uncertainty-note'; reviewNote: string };
export type ParagraphBlock = { id: string; type: 'paragraph'; text: string; claimIds: string[] };
export type ListBlock = { id: string; type: 'list'; items: { text: string; claimIds: string[] }[] };
export type ContextBlock = { id: string; type: 'context'; contextId: string };
export type ComparisonView = { label: string; boundary: Boundary; diagramId: string };
export type Block = ParagraphBlock | ListBlock | ContextBlock
  | { id: string; type: 'personnel'; side: Side; boundary: Boundary }
  | { id: string; type: 'diagram'; diagramId: string }
  | { id: string; type: 'statistics'; statisticsId: string }
  | { id: string; type: 'comparison'; title: string; views: [ComparisonView, ComparisonView] }
  | { id: string; type: 'shootout' };
export type ExperienceContext = { id: string; title: string; scope: { type: 'at-boundary'; boundary: Boundary; label: string } | { type: 'period'; start: string; end: string; label: string } | { type: 'retrospective'; label: string }; blocks: (ParagraphBlock | ListBlock | ContextBlock)[] };
export type Diagram = { id: string; title: string; side: Side; personnelBoundary: Boundary; depictedPeriod: string; partial: boolean; players: { personId: string; role: string; x: number; y: number; claimIds: string[] }[]; arrows?: { fromPersonId: string; toPersonId: string; meaning: 'observed-action' | 'described-role-relationship' | 'editorial-connection'; label: string; claimIds: string[] }[]; claimIds: string[]; interpretationNote: string; description: string };
export type Statistics = { id: string; title: string; provider: string; period: { start: string; end: string; includesAddedTime: boolean; includesExtraTime: boolean; label: string }; evidenceContext: string; observations: { metricId: string; label: string; unit: 'count' | 'percent'; values: Record<Side, number | null>; sourceId: string; claimId: string; caveat: string }[] };
export type Moment = { id: string; chapterId: string; title: string; afterEventId: Boundary; blocks: Block[]; presentation: 'standard' | 'exploration' | 'compact-sequence' | 'attempt-sequence' };
export type Relationships = { seasonIds: string[]; eraIds: string[]; playerIds: string[]; managerIds: string[]; oppositionIds: string[]; competitionIds: string[]; locationIds: string[]; articleSlugs: string[]; seasonEventRefs?: { seasonId: string; eventId: string }[]; seasonFactRefs?: { seasonId: string; field: 'managers' | 'leaguePosition' | 'competitionSummary'; sourceIndex: number }[] };
export type Editorial = { status: 'working-draft' | 'reviewed'; reviewedOn: string | null; provenance: { specification: string; baselineCommit: string; researchModel: string; researchTask: string }; unresolvedIssues: { id: string; description: string; blocking: boolean }[] };
export type Publication = { status: 'draft' } | { status: 'published'; publishedOn: string; approvalReference: string };
export type ExperienceBase = { schemaVersion: 1; id: string; title: string; standfirst: string; dateRange: { start: string; end: string }; relationships: Relationships; contexts: ExperienceContext[]; chapters: { id: string; title: string }[]; moments: Moment[]; diagrams: Diagram[]; statistics: Statistics[]; claims: Claim[]; sources: EvidenceSource[]; editorial: Editorial; publication: Publication };
export type MatchExperience = ExperienceBase & { kind: 'match'; match: MatchConfig; events: MatchEvent[] };
export type ContextExperience = ExperienceBase & { kind: 'context'; events: ContextEvent[] };
export type Experience = MatchExperience | ContextExperience;
/** Resolver callbacks keep the reusable core independent of canonical file stores. */
export type ReferenceResolvers = { entity?: (id: string, kind: 'person' | 'opposition' | 'competition' | 'location') => boolean; season?: (id: string) => boolean; era?: (id: string) => boolean; article?: (slug: string) => boolean; seasonEvent?: (seasonId: string, eventId: string) => boolean; seasonFact?: (seasonId: string, field: string, sourceIndex: number) => boolean };
