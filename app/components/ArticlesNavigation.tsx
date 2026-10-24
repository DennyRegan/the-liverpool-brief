import Link from "next/link";
import { REGAN_ON_FOOTBALL_PATH } from "@/lib/content/regan-on-football";

export function ArticlesNavigation({ selected, hasAnalysis = false }: {
  selected: string;
  hasAnalysis?: boolean;
}) {
  const links = [
    ["All", "/articles"],
    ["Opinion", "/articles?type=opinion"],
    ...(hasAnalysis ? [["Analysis", "/articles?type=analysis"]] : []),
    ["Team News", "/articles?type=team-news"],
    ["History", "/articles?type=history"],
    ["Football Observed", REGAN_ON_FOOTBALL_PATH],
  ];
  return (
    <nav className="writing-types" aria-label="Article categories" tabIndex={0}>
      {links.map(([label, href]) => (
        <Link key={href} href={href} aria-current={selected === label ? "page" : undefined}>{label}</Link>
      ))}
    </nav>
  );
}
