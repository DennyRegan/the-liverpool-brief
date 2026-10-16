'use client';

import { useEffect, useState } from 'react';
import type { NewsletterConfig } from '@/lib/newsletter-config';
import { mountSenderForm, type SenderWindow } from '@/lib/newsletter-embed';

export function SenderSignupForm({ accountId, formId, formUrl }: NewsletterConfig) {
  const [status, setStatus] = useState('Loading signup form…');
  useEffect(() => mountSenderForm(
    window as SenderWindow,
    { accountId, formId, formUrl },
    () => setStatus(''),
    () => setStatus('The signup form could not load. Please use the link below.'),
  ), [accountId, formId, formUrl]);

  return <>
    <div className="newsletter-form" role="group" aria-label="Subscribe to The Sunday Brief">
      <div className="sender-form-field" data-sender-form-id={formId} />
    </div>
    <p className="newsletter-help" role="status">{status}</p>
    <p className="newsletter-help">Having trouble with the form? <a href={formUrl} target="_blank" rel="noopener noreferrer">Open the signup form in a new tab</a>.</p>
  </>;
}
