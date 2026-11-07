import Link from "next/link";
import { REGAN_ON_FOOTBALL_PATH } from "@/lib/content/regan-on-football";
import { MATCHDAY_PATH } from "@/lib/content/matchday";

export function ArticlesNavigation({ selected, hasAnalysis = false }: {
  selected: string;
  hasAnalysis?: boolean;
}) {
  const links = [
    ["All", "/articles"],
    ["Opinion", "/articles?type=opinion"],
    // Analysis appears only once at least one Analysis article is published.
    ...(hasAnalysis ? [["Analysis", "/articles?type=analysis"]] : []),
    ["Matchday", MATCHDAY_PATH],
    ["Features", "/articles?type=features"],
    ["Football Observed", REGAN_ON_FOOTBALL_PATH],
  ];
  // On the Football Observed page the main navigation already marks it as current.
  const shown = selected === "Football Observed" ? links.filter(([label]) => label !== selected) : links;
  return (
    <nav className="writing-types" aria-label="Article categories" tabIndex={0}>
      {shown.map(([label, href]) => (
        <Link key={href} href={href} aria-current={selected === label ? "page" : undefined}>{label}</Link>
      ))}
    </nav>
  );
}
