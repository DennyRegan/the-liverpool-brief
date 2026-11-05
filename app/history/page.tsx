import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryHeader } from "@/app/components/HistoryHeader";
import { BIOGRAPHIES_PATH, HISTORY_PATH, SERIES_PATH } from "@/lib/content/history";
import { LOOKING_BACK_PATH } from "@/lib/content/looking-back";
import { socialMetadata } from "@/lib/social-metadata";
import "./history.css";

export const metadata = socialMetadata("History | The Liverpool Brief", "Looking Back, biographies and series from Liverpool's past.", HISTORY_PATH);

const HOMES = [
  { href: LOOKING_BACK_PATH, title: "Looking Back", text: "One short keepsake a week from Liverpool's past." },
  { href: BIOGRAPHIES_PATH, title: "Biographies", text: "The people who made Liverpool, by decade." },
  { href: SERIES_PATH, title: "Series", text: "Longer stories told part by part." },
];

export default function HistoryPage() {
  return <>
    <SiteHeader active="history" />
    <main id="main-content" className="history-page">
      <HistoryHeader title="History" />
      <ul className="history-links">
        {HOMES.map(home => <li key={home.href}><Link href={home.href}><h2>{home.title}</h2><p>{home.text}</p></Link></li>)}
      </ul>
    </main>
  </>;
}
