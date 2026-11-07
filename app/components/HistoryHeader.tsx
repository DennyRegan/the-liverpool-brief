import Link from "next/link";
import { LOOKING_BACK_PATH } from "@/lib/content/looking-back";

/**
 * The header shared by every Looking Back section page and piece (biographies,
 * series, features, the On This Day lists): masthead, dateline, headline, and on
 * index pages a one-line standfirst and count. On This Day pieces keep their own
 * newspaper-cutting look.
 */
export function HistoryHeader({ title, dateline, standfirst, count }: { title: string; dateline?: string; standfirst?: string; count?: string }) {
  return (
    <header className="history-header">
      <p className="history-masthead"><Link href={LOOKING_BACK_PATH}>Looking Back</Link></p>
      {dateline && <p className="history-dateline">{dateline}</p>}
      <h1 className="history-headline">{title}</h1>
      {(standfirst || count) && <p className="history-standfirst">
        {standfirst}{standfirst && count && " "}{count && <span className="history-count">{count}</span>}
      </p>}
    </header>
  );
}

export function ScheduledNote({ date }: { date: string }) {
  return <p className="history-scheduled" role="note">Scheduled for {date}</p>;
}

/** "1 biography", "7 lives". */
export function plural(count: number, one: string, many = `${one}s`) {
  return `${count} ${count === 1 ? one : many}`;
}
