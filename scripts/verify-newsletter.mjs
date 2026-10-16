// Local website checks only: never contacts Sender or submits a subscriber.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const exampleForm = 'https://stats.sender.net/forms/example123/view';

async function verify(formUrl, port) {
  const origin = `http://127.0.0.1:${port}`;
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
    env: { ...process.env, SENDER_PUBLIC_ACCOUNT_ID: 'public-example-id', SENDER_NEWSLETTER_FORM_ID: 'example123', SENDER_NEWSLETTER_FORM_URL: formUrl },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Local server startup timed out')), 15000);
      server.once('error', error => { clearTimeout(timeout); reject(error); });
      server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Local server exited: ${code}`)); });
      server.stderr.on('data', data => process.stderr.write(data));
      server.stdout.on('data', data => {
        if (data.toString().includes('Ready')) { clearTimeout(timeout); resolve(); }
      });
    });
    const pages = {};
    for (const route of ['/', '/newsletter', '/newsletter/privacy']) {
      const response = await fetch(new URL(route, origin), { signal: AbortSignal.timeout(10000) });
      assert.equal(response.status, 200, route);
      pages[route] = await response.text();
      assert.match(pages[route], /id="main-content"/, route);
    }
    const home = pages['/'];
    const signup = pages['/newsletter'];
    const enabled = Boolean(formUrl);
    assert.ok(home.includes('newsletter-invitation-heading'));
    assert.ok(home.includes('href="/newsletter"'));
    assert.equal(home.includes('Signup opens soon.'), !enabled);
    assert.equal(home.includes('Sign up free'), enabled);
    assert.equal(signup.includes('data-sender-form-id="example123"'), enabled);
    assert.match(signup, /rel="canonical" href="https:\/\/theliverpoolbrief\.com\/newsletter"/);
    assert.match(signup, /href="\/newsletter\/privacy"/);
    // No site-owned form collects an address; the approved provider does that.
    assert.doesNotMatch(signup, /<input[^>]+type="email"/);
    if (enabled) {
      assert.ok(signup.includes(`href="${exampleForm}"`));
      assert.match(signup, /aria-label="Subscribe to The Sunday Brief"/);
      assert.match(signup, /click the link in your confirmation email/);
    } else {
      assert.match(signup, /Newsletter signup is not open yet/);
      assert.doesNotMatch(signup, /data-sender-form-id|stats\.sender\.net/);
    }
    const privacy = pages['/newsletter/privacy'];
    assert.match(privacy, /mailto:theliverpoolbrief@gmail\.com/);
    assert.match(privacy, /https:\/\/www\.sender\.net\/privacy-policy\//);
    assert.doesNotMatch(privacy, /Brevo|sibforms/);
    assert.doesNotMatch(home, /accounts_resources\/universal\.js|data-sender-form-id/);
    assert.match(privacy, /unsubscribe/i);
    console.log(`PASS ${enabled ? 'configured Sender placement and fallback (example only)' : 'unconfigured signup closed'}; homepage, signup and privacy return 200`);
  } finally {
    if (server.exitCode === null) {
      const exited = once(server, 'exit');
      server.kill('SIGTERM');
      await exited;
    }
  }
}

await verify('', 3138);
await verify(exampleForm, 3139);
