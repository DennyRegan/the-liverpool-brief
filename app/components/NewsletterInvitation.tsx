import Link from 'next/link';
import { getNewsletterConfig } from '@/lib/newsletter-config';

export function NewsletterInvitation() {
  const signupReady = Boolean(getNewsletterConfig());
  return <aside className="newsletter-invitation" aria-labelledby="newsletter-invitation-heading">
    <div>
      <h2 id="newsletter-invitation-heading">Sign up to our weekly newsletter.</h2>
      {!signupReady && <p>Signup opens soon.</p>}
    </div>
    <Link className="read-link" href="/newsletter" prefetch={false}>{signupReady ? 'Sign up' : 'About the newsletter'}</Link>
  </aside>;
}
