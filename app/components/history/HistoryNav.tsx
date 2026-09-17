import Link from "next/link";
import { getPublishedExperiences } from "@/lib/content/interactive-history";

export function HistoryNav({ active }: { active?: "explorer" | "seasons" | "matches" | "players" | "interactive" }) {
  const hasExperiences = getPublishedExperiences().length > 0;
  return <nav className="history-nav" aria-label="History sections">
    <Link href="/history" aria-current={active === "explorer" ? "page" : undefined}>History Explorer</Link>
    <Link href="/history/seasons" aria-current={active === "seasons" ? "page" : undefined}>Seasons</Link>
    <Link href="/history/matches" aria-current={active === "matches" ? "page" : undefined}>Matches</Link>
    <Link href="/history/players" aria-current={active === "players" ? "page" : undefined}>People</Link>
    <Link href="/this-week">This Week</Link>
    {hasExperiences && <Link href="/history/interactive" aria-current={active === "interactive" ? "page" : undefined}>Interactive History</Link>}
  </nav>;
}
