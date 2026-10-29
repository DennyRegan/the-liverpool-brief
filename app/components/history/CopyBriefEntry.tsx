'use client';

import { useRef, useState } from 'react';

export function CopyBriefEntry({ text }: { text: string }) {
  const field = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState('');
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Entry and source references copied.');
    } catch {
      field.current?.focus();
      field.current?.select();
      setStatus('Text selected. Use your device’s Copy command.');
    }
  }
  return <div className="otd-copy">
    <label htmlFor="brief-entry">Sunday Brief draft text and source notes</label>
    <textarea id="brief-entry" ref={field} value={text} readOnly rows={10} />
    <button type="button" onClick={copy}>Copy entry and sources</button>
    <p role="status" aria-live="polite">{status}</p>
  </div>;
}
