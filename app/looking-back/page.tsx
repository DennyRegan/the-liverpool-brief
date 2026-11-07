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
  const { series, counts, latest } = getLookingBackHub();
  const sections: { href: string; title: string; text: string; count: string; tag?: string }[] = [
    ...series.map(item => ({ href: `${SERIES_PATH}/${item.slug}`, title: item.title, text: "Liverpool under Jürgen Klopp, told part by part.", count: `${item.totalParts}-part series`, tag: `New: Part ${item.newestPart}` })),
    { href: KEEPSAKES_PATH, title: "Keepsakes", text: "The best moments from Liverpool's past, every week.", count: plural(counts.keepsakes, "keepsake") },
    { href: BIOGRAPHIES_PATH, title: "Biographies", text: "The people who made Liverpool, by decade.", count: plural(counts.biographies, "biography", "biographies") },
  ];
  return <>
    <SiteHeader active="looking-back" />
    <main id="main-content" className="lbh">
      <header className="lbh-masthead">
        <h1>Looking Back</h1>
        <p>Keepsakes, lives and longer stories from Liverpool&rsquo;s past.</p>
      </header>

      <section className="lbh-contents" aria-labelledby="lbh-contents-heading">
        <h2 id="lbh-contents-heading" className="visually-hidden">Contents</h2>
        <ul>
          {sections.map(section => <li key={section.href}>
            <Link href={section.href}>
              <span className="lbh-contents-title">{section.title}</span>
              <span className="lbh-contents-text">{section.text}</span>
              <span className="lbh-contents-meta">
                <span className="lbh-contents-count">{section.count}</span>
                {section.tag && <span className="lbh-new">{section.tag}</span>}
              </span>
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
