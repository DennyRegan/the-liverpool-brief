import Link from "next/link";
import { HISTORY_PATH } from "@/lib/content/history";

/** The one header treatment shared by every History page: masthead, dateline, headline. */
export function HistoryHeader({ title, dateline, as: Heading = "h1" }: { title: string; dateline?: string; as?: "h1" | "h2" }) {
  return (
    <header className="history-header">
      <p className="history-masthead"><Link href={HISTORY_PATH}>The Brief · History</Link></p>
      {dateline && <p className="history-dateline">{dateline}</p>}
      <Heading className="history-headline">{title}</Heading>
    </header>
  );
}

export function ScheduledNote({ date }: { date: string }) {
  return <p className="history-scheduled" role="note">Scheduled for {date}</p>;
}
