import test from 'node:test';
import assert from 'node:assert/strict';
import { getNewsletterFormUrl, getNewsletterConfig } from '../lib/newsletter-config.ts';

test('newsletter accepts only a public HTTPS Sender hosted signup URL', () => {
  const url = 'https://stats.sender.net/forms/example123/view';
  assert.equal(getNewsletterFormUrl(url), url);
  assert.equal(getNewsletterFormUrl(`  ${url}\n`), url);
  assert.equal(getNewsletterFormUrl(''), null);
  assert.equal(getNewsletterFormUrl('  '), null);
});

test('newsletter rejects misdirected forms, credentials and secret-looking URLs', () => {
  for (const url of [
    'not-a-url', 'javascript:alert(1)', 'http://stats.sender.net/forms/example/view',
    'https://sender.net/forms/example/view', 'https://stats.sender.net.evil.example/forms/example/view',
    'https://evil.example/forms/example/view', 'https://app.sender.net/forms',
    'https://user:secret@stats.sender.net/forms/example/view',
    'https://stats.sender.net:8443/forms/example/view',
    'https://stats.sender.net/forms/example/view?api-key=secret',
    'https://stats.sender.net/forms/example/view#fragment',
    'https://stats.sender.net/forms/', 'https://stats.sender.net/forms/example/view/nested',
    'https://brief.sibforms.com/serve/example',
  ]) assert.equal(getNewsletterFormUrl(url), null, url);
});

test('newsletter stays closed for incomplete, unsafe or mismatched form identifiers', () => {
  const values = { SENDER_PUBLIC_ACCOUNT_ID: 'public-example-id', SENDER_NEWSLETTER_FORM_ID: 'example123', SENDER_NEWSLETTER_FORM_URL: 'https://stats.sender.net/forms/example123/view' };
  assert.deepEqual(getNewsletterConfig(values), { accountId: 'public-example-id', formId: 'example123', formUrl: values.SENDER_NEWSLETTER_FORM_URL });
  for (const key of Object.keys(values)) assert.equal(getNewsletterConfig({ ...values, [key]: '' }), null);
  assert.equal(getNewsletterConfig({ ...values, SENDER_NEWSLETTER_FORM_ID: 'another-form' }), null);
  assert.equal(getNewsletterConfig({ ...values, SENDER_PUBLIC_ACCOUNT_ID: '<script>bad</script>' }), null);
  assert.equal(getNewsletterConfig({ BREVO_NEWSLETTER_FORM_URL: 'https://brief.sibforms.com/serve/example' }), null);
});
