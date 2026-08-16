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
      aria-label={copied ? "Link copied" : "Share"}
      title={copied ? "Link copied" : "Share"}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark"
    >
      {copied ? (
        "Copied!"
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M12 3v12" />
          <path d="M7.5 7.5 12 3l4.5 4.5" />
          <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
        </svg>
      )}
    </button>
  );
}
