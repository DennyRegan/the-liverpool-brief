import test from 'node:test';
import assert from 'node:assert/strict';
import { getNewsletterPopupConfig, isNewsletterPopupPage } from '../lib/newsletter-popup.ts';

const values = {
  SENDER_PUBLIC_ACCOUNT_ID: 'public-example-id',
  SENDER_NEWSLETTER_FORM_ID: 'embed123',
  SENDER_NEWSLETTER_FORM_URL: 'https://stats.sender.net/forms/embed123/view',
  SENDER_NEWSLETTER_POPUP_FORM_ID: 'popup456',
};

test('published popup ID alone does not opt the website into popups', () => {
  for (const enabled of [undefined, '', 'false', 'TRUE', '1', ' true ']) {
    assert.equal(getNewsletterPopupConfig({ ...values, SENDER_NEWSLETTER_POPUP_ENABLED: enabled }), null);
  }
});

test('popup requires explicit opt-in, valid newsletter config and a distinct, specific ID', () => {
  const enabled = { ...values, SENDER_NEWSLETTER_POPUP_ENABLED: 'true' };
  assert.deepEqual(getNewsletterPopupConfig(enabled), { accountId: values.SENDER_PUBLIC_ACCOUNT_ID, formId: 'popup456' });
  for (const formId of ['', ' ', 'all', 'embed123', '<script>', 'popup/456']) {
    assert.equal(getNewsletterPopupConfig({ ...enabled, SENDER_NEWSLETTER_POPUP_FORM_ID: formId }), null);
  }
  for (const key of ['SENDER_PUBLIC_ACCOUNT_ID', 'SENDER_NEWSLETTER_FORM_ID', 'SENDER_NEWSLETTER_FORM_URL']) {
    assert.equal(getNewsletterPopupConfig({ ...enabled, [key]: '' }), null);
  }
  assert.equal(getNewsletterPopupConfig({ ...enabled, SENDER_NEWSLETTER_FORM_URL: 'https://evil.example/forms/embed123/view' }), null);
});

test('popup is eligible on editorial pages only, with exact section boundaries', () => {
  for (const path of ['/', '/articles', '/articles/a-story', '/archive/a-story', '/looking-back', '/looking-back/keepsakes', '/looking-back/biographies/a-player', '/looking-back/series/klopps-liverpool/part-one', '/regan-on-football']) {
    assert.equal(isNewsletterPopupPage(path), true, path);
  }
  for (const path of ['/newsletter', '/newsletter/', '/newsletter/privacy', '/about', '/calls', '/admin', '/articles-other', '/looking-backup', '/api/newsletter', '/unknown', '']) {
    assert.equal(isNewsletterPopupPage(path), false, path);
  }
});
