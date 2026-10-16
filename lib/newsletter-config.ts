/** Public form identifiers only; the website never needs a Sender API key. */
export type NewsletterConfig = { accountId: string; formId: string; formUrl: string };

export function getNewsletterFormUrl(value = process.env.SENDER_NEWSLETTER_FORM_URL): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.port || url.search || url.hash) return null;
    // Never render an arbitrary external form that could collect readers' addresses.
    if (url.hostname !== 'stats.sender.net') return null;
    if (!/^\/forms\/[A-Za-z0-9_-]+\/view$/.test(url.pathname)) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function getNewsletterConfig(values = process.env): NewsletterConfig | null {
  const accountId = values.SENDER_PUBLIC_ACCOUNT_ID?.trim();
  const formId = values.SENDER_NEWSLETTER_FORM_ID?.trim();
  const formUrl = getNewsletterFormUrl(values.SENDER_NEWSLETTER_FORM_URL ?? '');
  if (!accountId || !formId || !formUrl) return null;
  if (!/^[A-Za-z0-9_-]+$/.test(accountId) || !/^[A-Za-z0-9_-]+$/.test(formId)) return null;
  if (new URL(formUrl).pathname !== `/forms/${formId}/view`) return null;
  return { accountId, formId, formUrl };
}
