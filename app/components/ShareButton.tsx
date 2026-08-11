"use client";

import { useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: "The Liverpool Brief", url });
      } catch {
        // User cancelled the share sheet, or it failed silently — nothing to do.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — nothing more we can do.
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="text-sm font-medium text-accent hover:text-accent-dark"
    >
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
