import type { NewsletterConfig } from './newsletter-config.ts';

type SenderQueue = ((...args: unknown[]) => void) & {
  q?: unknown[][];
  l?: number;
  on?: (event: string, callback: () => void) => void;
  listeners?: Record<string, (() => void)[]>;
};
export type SenderWindow = Window & {
  Sender?: string;
  sender?: SenderQueue;
  senderFormsLoaded?: boolean;
  senderForms?: {
    render: (formId: string, config: { onRender: () => void }) => void;
    destroy: (formId: string) => void;
  };
  liverpoolBriefSenderAccount?: string;
};

// Sender's documented public JS SDK, with automatic/pop-up rendering disabled.
export const SENDER_SCRIPT_URL = 'https://cdn.sender.net/accounts_resources/universal.js?explicit=true';

export function mountSenderForm(browser: SenderWindow, config: NewsletterConfig, onRender: () => void, onError: () => void) {
  browser.Sender = 'sender';
  if (!browser.sender) {
    const queue: SenderQueue = (...args) => { (queue.q ??= []).push(args); };
    queue.l = Date.now();
    queue.on = (event, callback) => { ((queue.listeners ??= {})[event] ??= []).push(callback); };
    browser.sender = queue;
  }
  if (browser.liverpoolBriefSenderAccount !== config.accountId) {
    browser.sender(config.accountId);
    browser.liverpoolBriefSenderAccount = config.accountId;
  }
  let active = true;
  let rendered = false;
  const render = () => {
    if (!active || rendered || !browser.senderFormsLoaded || !browser.senderForms) return;
    rendered = true;
    browser.senderForms.render(config.formId, { onRender: () => { if (active) onRender(); } });
  };
  browser.addEventListener('onSenderFormsLoaded', render);

  const scriptId = 'liverpool-brief-sender-sdk';
  const existing = browser.document.getElementById(scriptId) as HTMLScriptElement | null;
  const script = existing ?? browser.document.createElement('script');
  if (!existing) {
    script.id = scriptId;
    script.src = SENDER_SCRIPT_URL;
    script.async = true;
  }
  script.addEventListener('error', onError);
  if (!existing) browser.document.head.appendChild(script);
  render();

  return () => {
    active = false;
    browser.removeEventListener('onSenderFormsLoaded', render);
    script.removeEventListener('error', onError);
    if (rendered) browser.senderForms?.destroy(config.formId);
  };
}
