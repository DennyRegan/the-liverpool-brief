import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { registerHooks } from 'node:module';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { fixture } from './fixtures/interactive-history.mjs';
await import('../scripts/register-server-only.mjs');
const { toExperienceDocument, toExperienceControls, validateExperienceReferences, getPublishedExperience } = await import('../lib/content/interactive-history.ts');

// Compile real server and client TSX using the repository's existing runner.
// React's static renderer exercises the shared no-JavaScript reading document.
const hooks = registerHooks({
  resolve(specifier, context, next) {
    if (specifier.endsWith('.css')) return { url: 'data:text/javascript,export {}', shortCircuit: true };
    const base = specifier.startsWith('@/') ? path.join(process.cwd(), specifier.slice(2))
      : specifier.startsWith('.') && context.parentURL?.startsWith('file:') ? fileURLToPath(new URL(specifier, context.parentURL)) : undefined;
    if (base) {
      const filename = [base, `${base}.tsx`, `${base}.ts`].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
      if (filename) return { url: pathToFileURL(filename).href, shortCircuit: true };
    }
    return next(specifier === 'next/link' ? 'next/link.js' : specifier, context);
  },
  load(url, context, next) {
    if (!url.endsWith('.tsx')) return next(url, context);
    return { format: 'module', shortCircuit: true, source: ts.transpileModule(fs.readFileSync(new URL(url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX } }).outputText };
  },
});
const { ExperienceDocument } = await import('../app/components/history/interactive/ExperienceDocument.tsx');
hooks.deregister();
const render = record => renderToStaticMarkup(createElement(ExperienceDocument, {
  document: toExperienceDocument(record, process.cwd(), { preview: record.publication.status === 'draft' }),
  controls: toExperienceControls(record, process.cwd(), { preview: record.publication.status === 'draft' }),
  preview: record.publication.status === 'draft',
}));

test('the real reader renders a different match and normal-time result without Istanbul branches', () => {
  const record = fixture('different-match');
  record.relationships.competitionIds = ['first-division'];
  const subject = record.match.rosters.subject;
  const opposition = record.match.rosters.opposition;
  // The other side changes first; the subject's change follows after the interval.
  record.events.splice(2, 0, { id: 'opposition-change', sequence: 3, type: 'substitution', time: { label: '30′', precision: 'minute', minute: 30 }, payload: { side: 'opposition', outgoingId: opposition.starters[1].personId, incomingId: opposition.substitutes[0].personId }, claimIds: ['fixture-claim'] });
  record.events.splice(4, 0, { id: 'subject-change', sequence: 5, type: 'substitution', time: { label: 'Half-time', precision: 'interval' }, payload: { side: 'subject', outgoingId: subject.starters[1].personId, incomingId: subject.substitutes[0].personId }, claimIds: ['fixture-claim'] });
  record.events.forEach((event, index) => { event.sequence = index + 1; });
  const parsed = validateExperienceReferences(record);
  const html = render(parsed);
  assert.match(html, /Synthetic review fixture/);
  assert.match(html, /First Division/);
  assert.match(html, /id="beginning"/);
  assert.match(html, /id="outcome"/);
  assert.match(html, /<strong>0–1<\/strong>/);
  assert.doesNotMatch(html, /Istanbul|UEFA Champions League final|3–3|Reveal .* penalty/);
  assert.match(html, /Synthetic engineering fixture/);
  assert.match(html, /Synthetic fixture source/);
  assert.doesNotMatch(html, /PRIVATE_|SYNTHETIC_TEST_APPROVAL/);
});

test('Istanbul server HTML preserves headings, static state, real links, evidence and complete fallback record', () => {
  const experience = getPublishedExperience('istanbul-2005');
  const html = render(experience);
  for (const moment of experience.moments) assert.ok(html.includes(`id="${moment.id}"`), moment.id);
  for (let i = 1; i <= 9; i++) assert.ok(html.includes(`id="shootout-${i}"`));
  assert.match(html, /<details class="ih-full-record"><summary>Read the complete shoot-out record/);
  assert.match(html, /href="\/archive\/liverpool-monaco-champions-league-2004"/);
  assert.match(html, /At the interval/);
  assert.match(html, /At the restart/);
  assert.match(html, /Evidence for this moment/);
  assert.doesNotMatch(html, /researchModel|reviewNote|approvalReference|confidence/);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'native fragment IDs must be unique');
});
