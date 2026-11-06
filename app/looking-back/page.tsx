import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { plural } from "@/app/components/HistoryHeader";
import { BIOGRAPHIES_PATH, getLookingBackHub, SERIES_PATH } from "@/lib/content/history";
import { FEATURES_PATH, KEEPSAKES_PATH, LOOKING_BACK_PATH } from "@/lib/content/looking-back";
import { socialMetadata } from "@/lib/social-metadata";
import "./history.css";

// Regenerated at most hourly, so pieces appear on their Monday without a deploy.
export const revalidate = 3600;

export const metadata = socialMetadata(
  "Looking Back | The Liverpool Brief",
  "Keepsakes, biographies, series and features from Liverpool's past.",
  LOOKING_BACK_PATH,
);

export default function LookingBackHub() {
  const { lead, counts, latest } = getLookingBackHub();
  const doors = [
    { href: KEEPSAKES_PATH, title: "Keepsakes", text: "The best moments from Liverpool's past, every week.", count: plural(counts.keepsakes, "keepsake") },
    { href: BIOGRAPHIES_PATH, title: "Biographies", text: "The people who made Liverpool, by decade.", count: plural(counts.biographies, "biography", "biographies") },
    { href: SERIES_PATH, title: "Series", text: "Longer stories told part by part.", count: counts.series === 1 ? `${counts.seriesParts} of ${counts.seriesPartsTotal} parts` : plural(counts.seriesParts, "part") },
  ];
  return <>
    <SiteHeader active="looking-back" />
    <main id="main-content" className="lbh">
      <header className="lbh-masthead">
        <h1>Looking Back</h1>
        <p>Keepsakes, lives and longer stories from Liverpool&rsquo;s past.</p>
      </header>

      {lead && <article className={`lbh-lead${lead.type === "Biography" ? " lbh-lead--years" : ""}`} aria-labelledby="lbh-lead-title">
        <p className="lbh-figure" aria-hidden="true"><span>{lead.figure}</span><small>{lead.figureNote}</small></p>
        <div className="lbh-lead-text">
          <p className="lbh-kicker">{lead.kicker}{lead.type === "Series" && <span className="visually-hidden">, {lead.label.split(", ").pop()}</span>}</p>
          <h2 id="lbh-lead-title"><Link href={lead.href}>{lead.title}</Link></h2>
          <p className="lbh-lead-excerpt">{lead.excerpt}</p>
          <Link className="lbh-read" href={lead.href}>{lead.readLabel}</Link>
        </div>
      </article>}

      <section className="lbh-doors" aria-labelledby="lbh-doors-heading">
        <h2 id="lbh-doors-heading" className="visually-hidden">Sections</h2>
        <ul>
          {doors.map(door => <li key={door.href}>
            <Link href={door.href}>
              <span className="lbh-door-title">{door.title}</span>
              <span className="lbh-door-text">{door.text}</span>
              <span className="lbh-door-count">{door.count}</span>
            </Link>
          </li>)}
        </ul>
        {counts.features > 0 && <p className="lbh-features"><Link href={FEATURES_PATH}>Features</Link>: {plural(counts.features, "longer historical piece")}.</p>}
      </section>

      {latest.length > 0 && <section className="lbh-latest" aria-labelledby="lbh-latest-heading">
        <h2 id="lbh-latest-heading">Latest</h2>
        <ol>
          {latest.map(item => <li key={item.href}>
            <p className="lbh-item-type">{item.label}</p>
            <h3><Link href={item.href}>{item.title}</Link></h3>
            <p className="lbh-item-excerpt">{item.excerpt}</p>
          </li>)}
        </ol>
      </section>}
    </main>
  </>;
}
