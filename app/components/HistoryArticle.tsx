import type { ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ShareButton } from "@/app/components/ShareButton";
import type { RelatedPiece } from "@/lib/content/related";
import { historyFonts } from "./history-fonts";
import "./history-article.css";

/** Small capitals would print "1950s" as "1950S"; keep a decade's "s" lower case. */
function Caps({ text }: { text: string }) {
  return <>{text.split(/(?<=\d{3}0)(s)\b/).map((part, index) => index % 2 ? <span key={index} className="ha-lower">s</span> : part)}</>;
}

export type HistoryLink = { href: string; label: string; detail?: string };

/**
 * The one template for every Looking Back piece: On This Day, Biographies,
 * Series parts and the factual Features. A classic "on this day" newspaper
 * article in The Liverpool Brief's own fonts and red: back line, kicker,
 * headline, italic standfirst, dateline, body with a single drop cap, then
 * previous/next and section links. Only the words passed in vary by type.
 * Current-day articles and Football Observed never use it.
 */
export function HistoryArticle({ masthead, back, kicker, title, scoreline, standfirst, byline, dateline, body, scheduledFor, previous, next, links, related = [], extras, children }: {
  /** Small line at the very top (Match Revisited): switches on the premium edition styling. */
  masthead?: string;
  back: HistoryLink;
  kicker: string;
  title: string;
  scoreline?: string;
  standfirst: string;
  byline?: string;
  dateline: string[];
  body: string;
  scheduledFor?: string;
  previous?: HistoryLink;
  next?: HistoryLink;
  links: HistoryLink[];
  /** "Continue reading": related pieces from lib/content/related.ts. */
  related?: RelatedPiece[];
  extras?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <main id="main-content" className={`ha-page ${historyFonts}${masthead ? " ha-edition" : ""}`}>
      {masthead && <p className="ha-masthead">{masthead}</p>}
      <p className="ha-backline"><Link href={back.href}>{back.label} <span aria-hidden="true">→</span></Link></p>
      {scheduledFor && <p className="ha-scheduled" role="note">Scheduled for {scheduledFor}</p>}
      <article aria-labelledby="ha-headline">
        <header className="ha-head">
          <p className="ha-kicker"><Caps text={kicker} /></p>
          <h1 id="ha-headline" className="ha-headline">{title}</h1>
          {scoreline && <p className="ha-scoreline">{scoreline}</p>}
          <p className="ha-standfirst">{standfirst}</p>
          {byline && <p className="ha-byline">{byline}</p>}
          <p className="ha-dateline">{dateline.map((part, index) => <span key={part}>{index > 0 && <span aria-hidden="true"> · </span>}<Caps text={part} /></span>)}</p>
        </header>
        <div className="ha-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown></div>
        <div className="ha-extras">
          {extras}
          <ShareButton title={title} />
        </div>
      </article>
      <footer className="ha-foot">
        {(previous || next) && <nav className="ha-step" aria-label="More pieces">
          {previous && <Link className="ha-previous" href={previous.href} rel="prev"><span className="ha-step-label"><span aria-hidden="true">← </span>{previous.label}</span>{previous.detail && <span className="ha-step-detail">{previous.detail}</span>}</Link>}
          {next && <Link className="ha-next" href={next.href} rel="next"><span className="ha-step-label">{next.label}<span aria-hidden="true"> →</span></span>{next.detail && <span className="ha-step-detail">{next.detail}</span>}</Link>}
        </nav>}
        {related.length > 0 && <nav className="ha-related" aria-labelledby="ha-related-heading">
          <h2 id="ha-related-heading" className="ha-related-heading">Continue reading</h2>
          <ul role="list">
            {related.map(item => <li key={item.href}>
              <Link href={item.href}>{item.title}</Link>
              <p><Caps text={`${item.kind} · ${item.reasons.join(" · ")}`} /></p>
            </li>)}
          </ul>
        </nav>}
        <p className="ha-links">{links.map(link => <Link key={link.href} href={link.href}>{link.label} <span aria-hidden="true">→</span></Link>)}</p>
        {children}
      </footer>
    </main>
  );
}
