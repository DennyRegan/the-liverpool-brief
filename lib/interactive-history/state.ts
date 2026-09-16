import type { Boundary, ContextEvent, MatchConfig, MatchEvent, MatchState, Phase, Side } from './types.ts';

const sides: Side[] = ['subject', 'opposition'];
const opposite = (side: Side): Side => side === 'subject' ? 'opposition' : 'subject';
const playing: Phase[] = ['first-half', 'second-half', 'extra-time-first', 'extra-time-second'];
function requireState(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function distinct(values: string[], label: string) {
  requireState(new Set(values).size === values.length, `${label}: duplicate person ID`);
}

export function initialMatchState(match: MatchConfig): MatchState {
  const everyone: string[] = [];
  for (const side of sides) {
    const roster = match.rosters[side];
    requireState(roster.starters.length === 11, `${side}: a starting XI must contain eleven players`);
    const squad = [...roster.starters, ...roster.substitutes];
    const ids = squad.map(p => p.personId);
    distinct(ids, `${side} roster`);
    requireState(new Set(squad.map(p => p.shirtNumber)).size === squad.length, `${side}: duplicate shirt number`);
    everyone.push(...ids);
  }
  distinct(everyone, 'Match rosters');
  requireState(match.rules.allowReentry === false, 'Re-entry rules are not supported');
  requireState(Number.isInteger(match.rules.substitutionLimit) && match.rules.substitutionLimit >= 0, 'Invalid substitution limit');
  requireState(Number.isInteger(match.rules.extraTimeSubstitutionBonus) && match.rules.extraTimeSubstitutionBonus >= 0, 'Invalid extra-time substitution bonus');
  return {
    phase: 'before-kickoff', clock: { label: 'Before kick-off', precision: 'phase' },
    score: { subject: 0, opposition: 0 }, rules: structuredClone(match.rules),
    personnel: {
      subject: { onField: match.rosters.subject.starters.map(p => p.personId), unusedSubstitutes: match.rosters.subject.substitutes.map(p => p.personId), removed: [] },
      opposition: { onField: match.rosters.opposition.starters.map(p => p.personId), unusedSubstitutes: match.rosters.opposition.substitutes.map(p => p.personId), removed: [] },
    },
    substitutionsUsed: { subject: 0, opposition: 0 }, discipline: [], shootout: null, outcome: null,
  };
}

/** Applies one explicit historical event; it never mutates its input. */
export function reduceMatchState(previous: MatchState, event: MatchEvent): MatchState {
  requireState(!previous.outcome, `${event.id}: event follows a resolved outcome`);
  const state = structuredClone(previous);
  state.clock = { ...event.time };
  const onField = (side: Side, id: string) => requireState(state.personnel[side].onField.includes(id), `${event.id}: ${id} is not on the field for ${side}`);
  const duringPlay = () => requireState(playing.includes(state.phase), `${event.id}: ${event.type} is invalid in phase ${state.phase}`);
  switch (event.type) {
    case 'phase-change': {
      const next: Partial<Record<Phase, Phase>> = {
        'before-kickoff': 'first-half', 'first-half': 'interval', interval: 'second-half',
        'second-half': 'end-normal-time', 'end-normal-time': 'extra-time-first',
        'extra-time-first': 'extra-time-interval', 'extra-time-interval': 'extra-time-second',
        'extra-time-second': 'end-extra-time',
      };
      requireState(next[state.phase] === event.payload.phase, `${event.id}: invalid phase transition ${state.phase} → ${event.payload.phase}`);
      if (event.payload.phase === 'extra-time-first') {
        requireState(state.rules.resolution === 'extra-time-then-penalties' && state.score.subject === state.score.opposition, `${event.id}: extra time requires an unresolved tied knockout match`);
      }
      state.phase = event.payload.phase;
      if (state.phase === 'end-normal-time' || state.phase === 'end-extra-time') {
        const tied = state.score.subject === state.score.opposition;
        if (!tied) state.outcome = { result: 'win', winner: state.score.subject > state.score.opposition ? 'subject' : 'opposition', method: state.phase === 'end-normal-time' ? 'normal-time' : 'extra-time' };
        else if (state.rules.resolution === 'normal-time') state.outcome = { result: 'draw', winner: null, method: 'normal-time' };
      }
      break;
    }
    case 'goal': {
      duringPlay();
      const { side, scorerId, classification, assistedByIds = [] } = event.payload;
      onField(classification === 'own-goal' ? opposite(side) : side, scorerId);
      for (const id of assistedByIds) onField(side, id);
      state.score[side] += 1;
      break;
    }
    case 'substitution': {
      requireState(playing.includes(state.phase) || state.phase === 'interval' || state.phase === 'extra-time-interval', `${event.id}: substitution is invalid in phase ${state.phase}`);
      const { side, outgoingId, incomingId } = event.payload;
      onField(side, outgoingId);
      const personnel = state.personnel[side];
      requireState(personnel.unusedSubstitutes.includes(incomingId), `${event.id}: ${incomingId} is not an unused named substitute; re-entry is forbidden`);
      const bonus = state.phase.startsWith('extra-time') ? state.rules.extraTimeSubstitutionBonus : 0;
      requireState(state.substitutionsUsed[side] < state.rules.substitutionLimit + bonus, `${event.id}: substitution limit exceeded for ${side}`);
      personnel.onField = personnel.onField.map(id => id === outgoingId ? incomingId : id);
      personnel.unusedSubstitutes = personnel.unusedSubstitutes.filter(id => id !== incomingId);
      personnel.removed.push(outgoingId);
      state.substitutionsUsed[side] += 1;
      break;
    }
    case 'booking':
    case 'dismissal': {
      duringPlay();
      const { side, personId } = event.payload;
      onField(side, personId);
      state.discipline.push({ eventId: event.id, type: event.type, side, personId });
      if (event.type === 'dismissal') {
        state.personnel[side].onField = state.personnel[side].onField.filter(id => id !== personId);
        state.personnel[side].removed.push(personId);
      }
      break;
    }
    case 'penalty-awarded':
      duringPlay();
      for (const id of event.payload.involvedPersonIds ?? []) requireState(sides.some(side => state.personnel[side].onField.includes(id)), `${event.id}: involved player ${id} is not on the field`);
      break;
    case 'penalty-saved':
      duringPlay();
      onField(event.payload.side, event.payload.takerId);
      onField(opposite(event.payload.side), event.payload.goalkeeperId);
      break;
    case 'incident':
      duringPlay();
      for (const id of event.payload.involvedPersonIds) requireState(sides.some(side => state.personnel[side].onField.includes(id)), `${event.id}: involved player ${id} is not on the field`);
      break;
    case 'shootout-start': {
      requireState(state.rules.resolution === 'extra-time-then-penalties' && state.phase === 'end-extra-time' && state.score.subject === state.score.opposition, `${event.id}: shoot-out requires a tied score after extra time`);
      const { eligibleTakers, firstSide, initialKicks } = event.payload;
      requireState(Number.isInteger(initialKicks) && initialKicks > 0, `${event.id}: invalid initial kick allotment`);
      for (const side of sides) {
        distinct(eligibleTakers[side], `${event.id}: ${side} eligible takers`);
        requireState(eligibleTakers[side].length > 0, `${event.id}: empty eligible takers`);
        for (const id of eligibleTakers[side]) onField(side, id);
      }
      requireState(eligibleTakers.subject.length === eligibleTakers.opposition.length, `${event.id}: shoot-out eligible sides must have equal playing numbers`);
      const eligibleCount = Math.min(state.personnel.subject.onField.length, state.personnel.opposition.onField.length);
      requireState(eligibleTakers.subject.length === eligibleCount, `${event.id}: eligible takers must cover the on-field players, reducing only to equate unequal sides`);
      state.phase = 'shootout';
      state.shootout = { firstSide, initialKicks, eligibleTakers: structuredClone(eligibleTakers), attempts: [], attemptsTaken: { subject: 0, opposition: 0 }, score: { subject: 0, opposition: 0 }, nextSide: firstSide, complete: false, winner: null };
      break;
    }
    case 'shootout-attempt': {
      const shootout = state.shootout;
      requireState(state.phase === 'shootout' && shootout && !shootout.complete, `${event.id}: no unfinished shoot-out`);
      const { side, takerId, result } = event.payload;
      requireState(shootout.nextSide === side, `${event.id}: shoot-out attempts must alternate`);
      requireState(shootout.eligibleTakers[side].includes(takerId), `${event.id}: ${takerId} is not an eligible penalty taker`);
      const prior = shootout.attempts.filter(a => a.side === side);
      const cycleLength = shootout.eligibleTakers[side].length;
      const cycleStart = Math.floor(prior.length / cycleLength) * cycleLength;
      requireState(!prior.slice(cycleStart).some(a => a.takerId === takerId), `${event.id}: repeated taker before every eligible player completed this cycle`);
      shootout.attempts.push({ ...event.payload, eventId: event.id });
      shootout.attemptsTaken[side] += 1;
      if (result === 'scored') shootout.score[side] += 1;
      let winner: Side | null = null;
      const { subject, opposition } = shootout.attemptsTaken;
      if (subject <= shootout.initialKicks && opposition <= shootout.initialKicks) {
        for (const candidate of sides) {
          const other = opposite(candidate);
          if (shootout.score[candidate] > shootout.score[other] + shootout.initialKicks - shootout.attemptsTaken[other]) winner = candidate;
        }
      } else if (subject === opposition && shootout.score.subject !== shootout.score.opposition) {
        winner = shootout.score.subject > shootout.score.opposition ? 'subject' : 'opposition';
      }
      shootout.winner = winner;
      shootout.complete = winner !== null;
      shootout.nextSide = winner ? null : opposite(side);
      if (winner) state.outcome = { result: 'win', winner, method: 'penalties' };
      break;
    }
  }
  for (const side of sides) {
    const personnel = state.personnel[side];
    distinct([...personnel.onField, ...personnel.unusedSubstitutes, ...personnel.removed], `${event.id}: ${side} personnel`);
    requireState(state.score[side] >= 0, `${event.id}: negative score`);
  }
  return state;
}

function validateEventOrder(events: { id: string; sequence: number }[]) {
  const ids = new Set<string>();
  let last = 0;
  for (const event of events) {
    requireState(event.id !== '$initial' && !ids.has(event.id), `${event.id}: duplicate or reserved event ID`);
    requireState(Number.isInteger(event.sequence) && event.sequence > last, `${event.id}: event sequence must be positive and strictly increasing`);
    ids.add(event.id); last = event.sequence;
  }
}

export function compileMatchStates(match: MatchConfig, events: MatchEvent[]): Record<string, MatchState> {
  validateEventOrder(events);
  let state = initialMatchState(match);
  const states: Record<string, MatchState> = { $initial: state };
  for (const event of events) {
    state = reduceMatchState(state, event);
    states[event.id] = state;
  }
  return states;
}

export function replayMatch(match: MatchConfig, events: MatchEvent[], afterEventId: Boundary = null): MatchState {
  validateEventOrder(events);
  if (afterEventId === null) return initialMatchState(match);
  const index = events.findIndex(event => event.id === afterEventId);
  requireState(index !== -1, `Unknown event boundary: ${afterEventId}`);
  return events.slice(0, index + 1).reduce(reduceMatchState, initialMatchState(match));
}

/** Proof that progression and boundaries do not require a match clock. */
export function replayContext(events: ContextEvent[], afterEventId: Boundary = null): { contextId: string | null } {
  validateEventOrder(events);
  if (afterEventId === null) return { contextId: null };
  const index = events.findIndex(event => event.id === afterEventId);
  requireState(index !== -1, `Unknown context event boundary: ${afterEventId}`);
  return { contextId: events[index].payload.contextId };
}
