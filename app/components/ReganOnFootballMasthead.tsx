import Link from "next/link";
import { REGAN_ON_FOOTBALL_PATH } from "@/lib/content/regan-on-football";

export function ReganOnFootballMasthead({ compact = false, weekly = true }: { compact?: boolean; weekly?: boolean }) {
  return (
    <header className={`column-masthead${compact ? " column-masthead--compact" : ""}`}>
      {compact ? (
        <p className="column-name"><Link href={REGAN_ON_FOOTBALL_PATH}>Football Observed</Link></p>
      ) : (
        <h1 className="column-name">Football Observed</h1>
      )}
      {weekly && <p className="column-byline">A weekly column by Denny Regan</p>}
    </header>
  );
}
