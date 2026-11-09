import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { plural } from "@/app/components/HistoryHeader";
import { BIOGRAPHIES_PATH, getLookingBackHub, MATCH_REVISITED_PATH, SERIES_PATH } from "@/lib/content/history";
import { formatWeekRange, LOOKING_BACK_PATH, ON_THIS_DAY_PATH } from "@/lib/content/looking-back";
import { socialMetadata } from "@/lib/social-metadata";
import "./history.css";

// Regenerated at most hourly, so counts and the week change without a deploy.
export const revalidate = 3600;

export const metadata = socialMetadata(
  "Looking Back | The Liverpool Brief",
  "Series, On This Day and biographies from Liverpool's past.",
  LOOKING_BACK_PATH,
);

/** Three rows only: Series, On This Day, Biographies. Every line is counted from the content files. */
export default function LookingBackHub() {
  const { series, onThisDay, biographies, matchRevisited } = getLookingBackHub();
  const rows = [
    { href: SERIES_PATH, title: "Series", line: `${plural(series.count, "series", "series")} · ${plural(series.parts, "part")}`, isNew: series.newThisWeek },
    { href: ON_THIS_DAY_PATH, title: "On This Day", line: `This week · ${formatWeekRange(onThisDay.monday, onThisDay.sunday)}` },
    // Match Revisited: listed once it has a live piece.
    ...(matchRevisited ? [{ href: MATCH_REVISITED_PATH, title: "Match Revisited", line: plural(matchRevisited, "match", "matches") }] : []),
    { href: BIOGRAPHIES_PATH, title: "Biographies", line: plural(biographies, "life", "lives") },
  ];
  return <>
    <SiteHeader active="looking-back" />
    <main id="main-content" className="site-width collection lbh">
      <h1 className="collection-title">Looking Back</h1>
      <nav className="lbh-rows" aria-label="Looking Back sections">
        <ul>
          {rows.map(row => <li key={row.href}>
            <Link href={row.href}>
              <span className="lbh-row-text">
                <span className="lbh-row-title">
                  {row.title}
                  {row.isNew && <span className="lbh-dot"><span className="visually-hidden">, new part this week</span></span>}
                </span>
                <span className="lbh-row-line">{row.line}</span>
              </span>
              <span className="lbh-row-arrow" aria-hidden="true">→</span>
            </Link>
          </li>)}
        </ul>
      </nav>
    </main>
  </>;
}
