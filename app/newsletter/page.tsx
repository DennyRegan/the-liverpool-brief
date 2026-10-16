import Link from 'next/link';
import { SiteHeader } from '@/app/components/SiteHeader';
import { getNewsletterConfig } from '@/lib/newsletter-config';
import { SenderSignupForm } from '@/app/components/SenderSignupForm';
import './newsletter.css';

export const metadata = {
  title: 'The Sunday Brief | The Liverpool Brief',
  description: 'A weekly email with the best opinion, analysis and history from The Liverpool Brief. Normally on Sundays. Free to subscribe.',
  alternates: { canonical: '/newsletter' },
};
// Read the form configuration at request time, like the existing homepage.
export const dynamic = 'force-dynamic';

export default function NewsletterPage() {
  const config = getNewsletterConfig();
  return <>
    <SiteHeader />
    <main id="main-content" className="reading-page newsletter-page">
      <p className="eyebrow">The Liverpool Brief, by email</p>
      <h1>The Sunday Brief</h1>
      <p className="standfirst">The best things worth reading from The Liverpool Brief that week. Opinion, analysis, history and match coverage — chosen for you, normally on Sundays.</p>
      {config ? <>
        <p className="newsletter-help">Free to subscribe. Enter your email below, then click the link in your confirmation email. You can unsubscribe at any time.</p>
        <SenderSignupForm {...config} />
      </> : <p className="newsletter-help">Newsletter signup is not open yet. Please check back soon.</p>}
      <p className="newsletter-help">How we use your email: <Link href="/newsletter/privacy">newsletter privacy notice</Link>.</p>
    </main>
  </>;
}
