import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { formatListDate } from "@/lib/format";
import { CALLS_PATH, getCalls } from "@/lib/content/calls";
import { socialMetadata } from "@/lib/social-metadata";

export const metadata = socialMetadata(
  "Calls | The Liverpool Brief",
  "Predictions made on this site, and how they turned out.",
  CALLS_PATH,
);

const STATUS = { open: "Open", right: "Right", wrong: "Wrong" } as const;

export default function CallsPage() {
  const calls = getCalls();
  return <>
    <SiteHeader />
    <main id="main-content" className="site-width collection calls-page">
      <h1 className="collection-title">Calls</h1>
      <p className="calls-intro">Predictions made on this site, and how they turned out.</p>
      {calls.length ? <ol className="calls-list">
        {calls.map((call, index) => <li key={`${call.href}-${index}`} className="call">
          <p className="article-meta">
            <span className={`call-status call-status--${call.status}`}>{STATUS[call.status]}</span>
            <time dateTime={call.date}>{formatListDate(call.date)}</time>
          </p>
          <blockquote className="call-claim"><p>“{call.claim}”</p></blockquote>
          {call.note && <p className="call-note">{call.note}</p>}
          <p className="call-source">From <Link href={call.href}>{call.title}</Link></p>
        </li>)}
      </ol> : <p className="empty-state">Calls will appear here when published.</p>}
    </main>
  </>;
}
