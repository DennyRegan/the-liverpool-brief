import test from 'node:test';
import assert from 'node:assert/strict';
import { selectHomeLead, LeadOverrideSchema } from '../lib/content/homepage.ts';
const at = iso => new Date(iso);
const now = at('2026-10-10T12:00:00Z');
const a = { date: '2026-10-10', href: '/articles/a', category: 'Analysis' };
const b = { date: '2026-10-09', href: '/archive/b', category: 'Opinion' };
const pin = { href: b.href, startsAt: '2026-10-09T12:00:00Z', expiresAt: '2026-10-11T12:00:00Z' };

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
