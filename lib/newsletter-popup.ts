import { getNewsletterConfig } from './newsletter-config.ts';
import { mountSenderForm, type SenderWindow } from './newsletter-embed.ts';

export type NewsletterPopupConfig = { accountId: string; formId: string };

export function getNewsletterPopupConfig(values = process.env): NewsletterPopupConfig | null {
  // A separate opt-in keeps this draft inert, even if a popup is already published.
  if (values.SENDER_NEWSLETTER_POPUP_ENABLED !== 'true') return null;
  const newsletter = getNewsletterConfig(values);
  const formId = values.SENDER_NEWSLETTER_POPUP_FORM_ID?.trim();
  if (!newsletter || !formId || !/^[A-Za-z0-9_-]+$/.test(formId) || formId === 'all') return null;
  if (formId === newsletter.formId) return null;
  return { accountId: newsletter.accountId, formId };
}

export function isNewsletterPopupPage(pathname: string): boolean {
  // Editorial pages only. In particular, never interrupt signup or its privacy notice.
  return pathname === '/' || /^\/(articles|archive|looking-back|regan-on-football)(\/|$)/.test(pathname);
}

export function mountSenderPopup(browser: SenderWindow, config: NewsletterPopupConfig, pathname: string) {
  if (!isNewsletterPopupPage(pathname)) return () => {};
  // Sender applies the popup's published status, triggers, frequency and visibility.
  // Do not force it open, render "all", or add a competing timer/cookie system.
  return mountSenderForm(browser, config, () => {}, () => {});
}
