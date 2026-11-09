import Link from "next/link";
import type { RelatedPiece } from "@/lib/content/related";

/**
 * "Continue reading" at the foot of a modern article: up to three related pieces,
 * chosen automatically from shared connection tags (lib/content/related.ts).
 * Renders nothing when nothing connects. Looking Back pieces show the same list
 * inside the history article template instead.
 */
export function ContinueReading({ items }: { items: RelatedPiece[] }) {
  if (!items.length) return null;
  return (
    <nav className="continue-reading" aria-labelledby="continue-reading-heading">
      <h2 id="continue-reading-heading" className="eyebrow">Continue reading</h2>
      <ul role="list">
        {items.map(item => <li key={item.href}>
          <Link href={item.href}>{item.title}</Link>
          <p>{item.kind} · {item.reasons.join(" · ")}</p>
        </li>)}
      </ul>
    </nav>
  );
}
