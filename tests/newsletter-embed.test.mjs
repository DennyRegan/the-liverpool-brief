import test from 'node:test';
import assert from 'node:assert/strict';
import { mountSenderForm, SENDER_SCRIPT_URL } from '../lib/newsletter-embed.ts';
import { mountSenderPopup } from '../lib/newsletter-popup.ts';

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

const popup = { accountId: config.accountId, formId: 'popup456' };

test('popup uses the documented explicit SDK and renders only its selected ID once ready', () => {
  const f = fixture();
  const cleanup = mountSenderPopup(f.browser, popup, '/articles/a-story');
  assert.deepEqual(f.rendered, []);
  assert.equal(f.scripts.values().next().value.src, SENDER_SCRIPT_URL);
  assert.match(SENDER_SCRIPT_URL, /\?explicit=true$/);
  f.ready(); f.ready();
  assert.deepEqual(f.rendered, [popup.formId]);
  cleanup();
  assert.deepEqual(f.destroyed, [popup.formId]);
});

test('excluded pages never load the popup SDK or queue its account', () => {
  const f = fixture();
  for (const path of ['/newsletter', '/newsletter/privacy', '/about', '/calls']) {
    mountSenderPopup(f.browser, popup, path)();
  }
  f.ready();
  assert.equal(f.scripts.size, 0);
  assert.equal(f.browser.sender, undefined);
  assert.deepEqual(f.rendered, []);
});

test('navigation before SDK readiness cancels the popup; embedded signup still works', () => {
  const f = fixture();
  const leaveArticle = mountSenderPopup(f.browser, popup, '/articles/a-story');
  leaveArticle();
  const leaveSignup = mountSenderForm(f.browser, config, () => {}, () => {});
  f.ready();
  assert.deepEqual(f.rendered, [config.formId]);
  assert.equal(f.scripts.size, 1);
  assert.deepEqual(f.browser.sender.q, [[config.accountId]]);
  leaveSignup();
  assert.deepEqual(f.destroyed, [config.formId]);
});

test('article → signup → article destroys only the leaving form and reuses one SDK', () => {
  const f = fixture(); f.browser.senderFormsLoaded = true;
  const leaveArticle = mountSenderPopup(f.browser, popup, '/articles/first');
  leaveArticle();
  const leaveSignup = mountSenderForm(f.browser, config, () => {}, () => {});
  leaveSignup();
  const leaveNextArticle = mountSenderPopup(f.browser, popup, '/articles/second');
  assert.deepEqual(f.rendered, [popup.formId, config.formId, popup.formId]);
  assert.deepEqual(f.destroyed, [popup.formId, config.formId]);
  leaveNextArticle();
  assert.deepEqual(f.destroyed, [popup.formId, config.formId, popup.formId]);
  assert.equal(f.scripts.size, 1);
  assert.deepEqual(f.browser.sender.q, [[config.accountId]]);
});

test('independent popup cleanup never destroys the embedded form', () => {
  const f = fixture();
  const leaveSignup = mountSenderForm(f.browser, config, () => {}, () => {});
  const leavePopup = mountSenderPopup(f.browser, popup, '/');
  f.ready();
  leavePopup();
  assert.deepEqual(f.destroyed, [popup.formId]);
  leaveSignup();
  assert.deepEqual(f.destroyed, [popup.formId, config.formId]);
});

test('failed SDK leaves popup silent and the embedded error callback working', () => {
  const f = fixture(); let errors = 0;
  const leavePopup = mountSenderPopup(f.browser, popup, '/');
  const leaveSignup = mountSenderForm(f.browser, config, () => {}, () => errors++);
  f.scripts.values().next().value.dispatchEvent(new Event('error'));
  assert.equal(errors, 1);
  assert.deepEqual(f.rendered, []);
  leavePopup(); leaveSignup();
});
