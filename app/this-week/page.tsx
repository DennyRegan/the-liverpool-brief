import { getArchiveFeatures } from "@/lib/content/archive";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryWeek } from "@/app/components/HistoryWeek";
import { getHistoryEvents, getHistoryWindow, getVisibleArticleWeek } from "@/lib/content/this-week";

export const metadata = {
  title: "This Week in Liverpool History | The Liverpool Brief",
  description: "A fixed Monday-to-Sunday week of Liverpool history, with researched reports and articles from the History collection.",
};
// Resolve London's current calendar week on each visit, including Monday rollover.
export const dynamic = "force-dynamic";

export default function ThisWeekPage() {
  const now = new Date();
  const days = getHistoryWindow(getHistoryEvents(), now);
  const articleDays = getVisibleArticleWeek(getArchiveFeatures(), days, now);
  return <><SiteHeader active="this-week" /><main id="main-content" className="reading-page history-page">
    <h1>This Week in Liverpool History</h1>
    <p className="history-range"><time dateTime={days[0].iso}>{days[0].label}</time> – <time dateTime={days[6].iso}>{days[6].label}</time></p>
    <p className="history-summary">Reports and articles from Liverpool’s past. Each day’s selection appears on its UK date.</p>
    {!articleDays.some(day => day.articles.length > 0) && <p className="history-empty">No stories have appeared this week yet.</p>}
    <HistoryWeek days={articleDays} />
  </main></>;
}
