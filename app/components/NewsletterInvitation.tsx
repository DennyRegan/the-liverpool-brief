import Link from 'next/link';
import { getNewsletterConfig } from '@/lib/newsletter-config';

export function NewsletterInvitation() {
  const signupReady = Boolean(getNewsletterConfig());
  return <aside className="newsletter-invitation" aria-labelledby="newsletter-invitation-heading">
    <div>
      <h2 id="newsletter-invitation-heading">The Sunday Brief</h2>
      <p>The best of The Liverpool Brief, in one weekly email. Normally on Sundays.</p>
      {!signupReady && <p>Signup opens soon.</p>}
    </div>
    <Link className="read-link" href="/newsletter" prefetch={false}>{signupReady ? 'Sign up free →' : 'About the newsletter →'}</Link>
  </aside>;
}
