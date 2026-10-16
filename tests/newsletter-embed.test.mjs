import test from 'node:test';
import assert from 'node:assert/strict';
import { mountSenderForm, SENDER_SCRIPT_URL } from '../lib/newsletter-embed.ts';

const config = { accountId: 'public-example-id', formId: 'example123', formUrl: 'https://stats.sender.net/forms/example123/view' };
function fixture() {
  const browser = new EventTarget();
  const scripts = new Map();
  browser.document = {
    getElementById: id => scripts.get(id) ?? null,
    createElement: () => new EventTarget(),
    head: { appendChild: script => scripts.set(script.id, script) },
  };
  const rendered = [];
  const destroyed = [];
  browser.senderForms = { render: (id, options) => { rendered.push(id); options.onRender(); }, destroy: id => destroyed.push(id) };
  const ready = () => { browser.senderFormsLoaded = true; browser.dispatchEvent(new Event('onSenderFormsLoaded')); };
  return { browser, scripts, rendered, destroyed, ready };
}

test('form waits for SDK dependencies and renders only its own ID once', () => {
  const f = fixture();
  let readyCount = 0;
  const cleanup = mountSenderForm(f.browser, config, () => readyCount++, () => {});
  assert.deepEqual(f.rendered, []);
  const script = f.scripts.values().next().value;
  assert.equal(script.src, SENDER_SCRIPT_URL);
  assert.equal(script.async, true);
  assert.deepEqual(f.browser.sender.q, [[config.accountId]]);
  f.ready(); f.ready();
  assert.deepEqual(f.rendered, [config.formId]);
  assert.equal(readyCount, 1);
  cleanup();
  assert.deepEqual(f.destroyed, [config.formId]);
});

test('leaving signup before SDK readiness never renders a form on another page', () => {
  const f = fixture();
  const cleanup = mountSenderForm(f.browser, config, () => assert.fail('must not render after leaving'), () => assert.fail('removed error listener'));
  cleanup(); f.ready();
  f.scripts.values().next().value.dispatchEvent(new Event('error'));
  assert.deepEqual(f.rendered, []);
  assert.deepEqual(f.destroyed, []);
});

test('returning to signup reuses the SDK and restores the destroyed form', () => {
  const f = fixture(); f.browser.senderFormsLoaded = true;
  const first = mountSenderForm(f.browser, config, () => {}, () => {});
  first();
  const second = mountSenderForm(f.browser, config, () => {}, () => {});
  assert.equal(f.scripts.size, 1);
  assert.deepEqual(f.browser.sender.q, [[config.accountId]]);
  assert.deepEqual(f.rendered, [config.formId, config.formId]);
  second();
  assert.deepEqual(f.destroyed, [config.formId, config.formId]);
});

test('blocked or failed SDK loading reports a load failure, never a successful subscription', () => {
  const f = fixture(); let errors = 0;
  const cleanup = mountSenderForm(f.browser, config, () => assert.fail('must not claim ready'), () => errors++);
  f.scripts.values().next().value.dispatchEvent(new Event('error'));
  assert.equal(errors, 1);
  assert.deepEqual(f.rendered, []);
  cleanup();
});
