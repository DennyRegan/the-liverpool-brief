import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/app/components/SiteHeader';
import { getNewsletterConfig } from '@/lib/newsletter-config';
import { SenderSignupForm } from '@/app/components/SenderSignupForm';
import { ShareButton } from '@/app/components/ShareButton';
import { SITE_URL } from '@/lib/site';
import { socialMetadata } from '@/lib/social-metadata';
import './newsletter.css';

export const metadata = socialMetadata(
  'The Sunday Brief | The Liverpool Brief',
  'A weekly email with the best opinion, analysis and history from The Liverpool Brief. Normally on Sundays. Free to subscribe.',
  '/newsletter',
);
const shareTitle = 'The Sunday Brief — The Liverpool Brief';
const shareOnX = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(`${SITE_URL}/newsletter`)}`;
// Read the form configuration at request time, like the existing homepage.
export const dynamic = 'force-dynamic';

export default function NewsletterPage() {
  const config = getNewsletterConfig();
  // Hidden until signup is configured; the integration stays ready to restore.
  if (!config) notFound();
  return <>
    <SiteHeader />
    <main id="main-content" className="reading-page newsletter-page">
      <p className="eyebrow">The Liverpool Brief, by email</p>
      <h1>The Sunday Brief</h1>
      <p className="standfirst">The best things worth reading from The Liverpool Brief that week. Opinion, analysis, history and match coverage — chosen for you, normally on Sundays.</p>
      <div className="newsletter-share" role="group" aria-label="Share The Sunday Brief">
        <ShareButton title={shareTitle} label="Share" />
        <a href={shareOnX} target="_blank" rel="noopener noreferrer">Share on X <span aria-hidden="true">↗</span></a>
      </div>
      {config ? <>
        <p className="newsletter-help">Free to subscribe. Enter your email below, then click the link in your confirmation email. You can unsubscribe at any time.</p>
        <SenderSignupForm {...config} />
      </> : <p className="newsletter-help">Newsletter signup is not open yet. Please check back soon.</p>}
      <p className="newsletter-help">How we use your email: <Link href="/newsletter/privacy">newsletter privacy notice</Link>.</p>
    </main>
  </>;
}
