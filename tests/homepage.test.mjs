import test from 'node:test';
import assert from 'node:assert/strict';
import { selectHomeLead, selectHomeBrief, selectHomeCoverage, LeadOverrideSchema } from '../lib/content/homepage.ts';
const at = iso => new Date(iso);
const now = at('2026-10-10T12:00:00Z');
const a = { date: '2026-10-10', href: '/articles/a', category: 'Analysis' };
const b = { date: '2026-10-09', href: '/archive/b', category: 'Opinion' };
const pin = { href: b.href, startsAt: '2026-10-09T12:00:00Z', expiresAt: '2026-10-11T12:00:00Z' };
const brief = { status: 'published', lastUpdated: '2026-10-09T12:00:00Z', stories: [{ headline: 'One', summary: '' }, { headline: 'Two', summary: '' }, { headline: 'Three', summary: '' }, { headline: 'Four', summary: '' }] };
const fixture = { id: 'qa-next', oppositionId: 'everton', competitionId: 'premier-league', side: 'home', date: '2026-10-11', kickoff: '2026-10-11T16:30:00+01:00', status: 'scheduled', sourceIds: ['qa'], preview: { title: 'Approved preview', body: 'Prose stays in Match Centre', updatedAt: '2026-10-09T10:00:00Z', sourceIds: ['qa'] } };
const completed = { ...fixture, id: 'qa-last', date: '2026-10-09', kickoff: '2026-10-09T20:00:00+01:00', status: 'completed', score: { home: 1, away: 0 }, reportSlug: 'qa-report' };
const report = { slug: 'qa-report', title: 'Published report', date: '2026-10-09' };
const coverage = (fixtures, iso, reports = [report]) => selectHomeCoverage({ fixtures }, reports, at(iso));

test('lead selects newest Opinion/Analysis deterministically without mutating or admitting History/future writing', () => {
  const input = [b, { ...a, href: '/articles/z' }, a, { ...a, date: '2026-10-11' }, { ...a, date: '2026-10-10', editorialMode: 'factual', href: '/archive/history' }];
  const before = structuredClone(input);
  assert.equal(selectHomeLead(input, now), a); assert.deepEqual(input, before);
  assert.equal(selectHomeLead([], now), undefined);
  assert.equal(selectHomeLead([b], at('2027-01-01T12:00:00Z')), b);
});
test('lead override starts inclusively, expires exclusively, and falls back for unavailable targets', () => {
  assert.equal(selectHomeLead([a,b], at(pin.startsAt), pin), b);
  assert.equal(selectHomeLead([a,b], at(pin.expiresAt), pin), a);
  assert.equal(selectHomeLead([a,b], now, { ...pin, startsAt: '2026-10-10T12:00:00.001Z' }), a);
  assert.equal(selectHomeLead([a], now, pin), a);
  assert.equal(selectHomeLead([a,b], now, { ...pin, href: '/archive/missing' }), a);
  assert.equal(selectHomeLead([a,b], now, { ...pin, href: '/archive/history' }), a);
});
test('override validation rejects malformed, unbounded and reversed selections', () => {
  assert.ok(LeadOverrideSchema.safeParse(null).success);
  assert.ok(LeadOverrideSchema.safeParse(pin).success);
  for (const value of [{ ...pin, expiresAt: '2026-10-20T12:00:00Z' }, { ...pin, expiresAt: pin.startsAt }, { ...pin, href: '/history' }, { href: '/articles/a' }, { ...pin, unknown: true }]) assert.equal(LeadOverrideSchema.safeParse(value).success, false);
});
test('London midnight determines publication eligibility', () => {
  assert.equal(selectHomeLead([a], at('2026-10-09T23:00:00Z')), a);
  assert.equal(selectHomeLead([a], at('2026-10-09T22:59:59Z')), undefined);
});
test('Brief caps distinct nonempty headlines at three and preserves evidence timestamp', () => {
  const result = selectHomeBrief({ ...brief, stories: [{headline:' ',summary:''}, brief.stories[0], {headline:' one ',summary:''}, ...brief.stories.slice(1)] }, now);
  assert.deepEqual(result.stories.map(s=>s.headline), ['One','Two','Three']); assert.equal(result.lastUpdated, brief.lastUpdated);
});
test('Brief hides empty, unpublished, invalid and future updates', () => {
  for (const change of [{status:'draft'}, {stories:[]}, {lastUpdated:'nonsense'}, {lastUpdated:'2026-10-10T12:00:01Z'}, {lastUpdated:'2026-10-10'}]) assert.equal(selectHomeBrief({...brief,...change},now),undefined);
});
test('Brief expires at exactly 48 elapsed hours including DST changes', () => {
  assert.ok(selectHomeBrief(brief,at('2026-10-11T11:59:59.999Z')));
  assert.equal(selectHomeBrief(brief,at('2026-10-11T12:00:00Z')),undefined);
  const autumn = {...brief,lastUpdated:'2026-10-24T12:00:00+01:00'};
  assert.ok(selectHomeBrief(autumn,at('2026-10-26T10:59:59Z')));
  assert.equal(selectHomeBrief(autumn,at('2026-10-26T11:00:00Z')),undefined);
});
test('preview opens exactly 48 hours before kick-off and stops at kick-off', () => {
  assert.equal(coverage([fixture],'2026-10-09T15:29:59.999Z'),undefined);
  assert.equal(coverage([fixture],'2026-10-09T15:30:00Z').kind,'preview');
  assert.equal(coverage([fixture],'2026-10-11T15:29:59.999Z').href,'/match-centre#match-preview');
  assert.equal(coverage([fixture],'2026-10-11T15:30:00Z'),undefined);
});
test('preview wins overlap, review remains fallback', () => {
  assert.equal(coverage([fixture,completed],'2026-10-10T12:00:00Z').kind,'preview');
  assert.equal(coverage([completed,{...fixture,preview:undefined}],'2026-10-10T12:00:00Z').kind,'review');
});
test('postponed/cancelled, missing date/time/coverage and future preview updates cannot qualify', () => {
  for (const change of [{status:'postponed'}, {status:'cancelled'}, {kickoff:undefined}, {date:undefined,kickoff:undefined}, {preview:undefined}, {preview:{...fixture.preview,updatedAt:'2026-10-11T12:00:00Z'}}]) assert.equal(coverage([{...fixture,...change}],'2026-10-10T12:00:00Z'),undefined);
});
test('only selectMatches next fixture can supply the preview anchor', () => {
  const earlier = {...fixture,id:'earlier',kickoff:'2026-10-11T15:00:00+01:00',preview:undefined};
  assert.equal(coverage([fixture,earlier],'2026-10-10T12:00:00Z'),undefined);
});
test('rescheduling preserves identity and recomputes windows', () => {
  const moved = {...fixture,date:'2026-10-18',kickoff:'2026-10-18T16:30:00+01:00'};
  assert.equal(coverage([moved],'2026-10-10T12:00:00Z'),undefined);
  assert.equal(coverage([moved],'2026-10-17T12:00:00Z').fixture.id,fixture.id);
});
test('elapsed scheduled fixtures never become reviews, including delayed results', () => {
  assert.equal(coverage([{...completed,status:'scheduled'}],'2026-10-10T12:00:00Z'),undefined);
  assert.equal(coverage([{...completed,status:'postponed'}],'2026-10-10T12:00:00Z'),undefined);
});
test('review requires latest completed fixture and available published report', () => {
  assert.equal(coverage([completed],'2026-10-10T12:00:00Z',[]),undefined);
  assert.equal(coverage([completed],'2026-10-10T12:00:00Z',[{...report,date:'2026-10-11'}]),undefined);
  assert.equal(coverage([completed,{...completed,id:'newer',date:'2026-10-10',kickoff:'2026-10-10T10:00:00Z',reportSlug:undefined}],'2026-10-10T12:00:00Z'),undefined);
  assert.equal(coverage([{...completed,kickoff:undefined}],'2026-10-10T12:00:00Z').href,'/archive/qa-report');
});
test('review expires at London midnight after matchday plus two days, not report publication time', () => {
  assert.ok(coverage([completed],'2026-10-11T22:59:59.999Z'));
  assert.equal(coverage([completed],'2026-10-11T23:00:00Z'),undefined);
  assert.equal(coverage([completed],'2026-10-12T12:00:00Z',[{...report,date:'2026-10-12'}]),undefined);
});
test('review calendar expiry respects autumn and spring clock changes', () => {
  for (const [date,before,expiry] of [['2026-10-24','2026-10-26T23:59:59Z','2026-10-27T00:00:00Z'],['2026-03-28','2026-03-30T22:59:59Z','2026-03-30T23:00:00Z']]) {
    const f={...completed,date,kickoff:undefined}; const reports=[{...report,date}];
    assert.ok(coverage([f],before,reports)); assert.equal(coverage([f],expiry,reports),undefined);
  }
});
test('duplicate inputs still produce exactly one coverage selection', () => {
  assert.equal(coverage([fixture,fixture,completed],'2026-10-10T12:00:00Z').kind,'preview');
});
