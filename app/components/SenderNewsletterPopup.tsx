'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { mountSenderPopup, type NewsletterPopupConfig } from '@/lib/newsletter-popup';
import type { SenderWindow } from '@/lib/newsletter-embed';

export function SenderNewsletterPopup({ accountId, formId }: NewsletterPopupConfig) {
  const pathname = usePathname();
  useEffect(() => mountSenderPopup(
    window as SenderWindow, { accountId, formId }, pathname,
  ), [accountId, formId, pathname]);
  return null;
}
