import test from 'node:test';
import assert from 'node:assert/strict';
import { selectHomeLead, selectHomePage, LeadOverrideSchema } from '../lib/content/homepage.ts';
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

const column = { date: '2026-10-10', href: '/articles/column', category: 'Opinion', tags: ['regan-on-football'] };
const ordinary = [a, b, { ...a, href: '/articles/news', category: 'Team News' }, { ...b, href: '/articles/extra' }];
const histories = Array.from({length: 5}, (_, i) => ({ date: '2026-10-10', href: `/archive/history-${i}`, category: 'History', editorialMode: 'factual' }));
const cards = selection => [selection.lead, selection.column, ...selection.more].filter(Boolean);

test('homepage shows four unique journalism pieces including the column and no History story', () => {
  const input = [...histories, column, ...ordinary, { ...column, href: '/articles/previous-column', date: '2026-10-08' }];
  const before = structuredClone(input);
  const selected = selectHomePage(input, now);
  assert.equal(selected.lead, a);
  assert.equal(selected.column, column);
  assert.equal(selected.more.length, 2);
  assert.ok(selected.more.every(a => a.category !== 'History'));
  assert.equal('history' in selected, false);
  assert.ok(cards(selected).every(a => a.category !== 'History'));
  assert.equal(cards(selected).length, 4);
  assert.equal(new Set(cards(selected).map(a => a.href)).size, 4);
  assert.deepEqual(input, before);
});

test('homepage has no duplicate column when an active editorial override leads with it', () => {
  const override = { ...pin, href: column.href };
  const selected = selectHomePage([...histories, column, ...ordinary], now, override);
  assert.equal(selected.lead, column);
  assert.equal(selected.column, undefined);
  assert.equal(selected.more.length, 3);
  assert.equal(cards(selected).filter(a => a.href === column.href).length, 1);
  assert.equal(selectHomePage([column, ...ordinary], at(pin.expiresAt), override).lead, a);
  assert.equal(selectHomePage([column, ...ordinary], now, pin).lead, b);
});

test('homepage caps journalism without a column and never fills shortages with History or older editions', () => {
  assert.equal(cards(selectHomePage([...histories, ...ordinary], now)).length, 4);
  const sparse = selectHomePage([...histories, column], now);
  assert.equal(sparse.lead, column);
  assert.equal(sparse.column, undefined);
  assert.deepEqual(sparse.more, []);
  assert.equal(cards(sparse).length, 1);
  assert.deepEqual(cards(selectHomePage([], now)), []);
  assert.equal(cards(selectHomePage(histories, now)).length, 0);
});

test('homepage excludes future dates, deduplicates canonical URLs and handles Team News alone', () => {
  const news = ordinary[2];
  const future = { ...column, date: '2026-10-11' };
  const selected = selectHomePage([news, news, future, ...histories], now);
  assert.equal(selected.lead, news);
  assert.equal(selected.column, undefined);
  assert.equal(cards(selected).length, 1);
  assert.equal(selectHomePage([future], at('2026-10-10T23:00:00Z')).lead, future);
});
