import Link from "next/link";

export function HistoryNav({ active }: { active: "explorer" | "seasons" | "matches" | "players" }) {
  return <nav className="history-nav" aria-label="History sections">
    <Link href="/history" aria-current={active === "explorer" ? "page" : undefined}>History Explorer</Link>
    <Link href="/history/seasons" aria-current={active === "seasons" ? "page" : undefined}>Seasons</Link>
    <Link href="/history/matches" aria-current={active === "matches" ? "page" : undefined}>Matches</Link>
    <Link href="/history/players" aria-current={active === "players" ? "page" : undefined}>Players</Link>
  </nav>;
}
