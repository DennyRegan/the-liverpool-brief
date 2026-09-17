import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryNav } from "@/app/components/history/HistoryNav";
import { JourneyCards } from "@/app/components/history/V3Exploration";
import { getV3View } from "@/lib/content/history-v3-view";
export const metadata = {
  title: "Guided History Journeys | The Liverpool Brief",
  alternates: { canonical: "/history/journeys" },
};
export default function JourneysPage() {
  return (
    <>
      <SiteHeader active="history" />
      <main id="main-content" className="site-width hx-page v3-page">
        <HistoryNav active="journeys" />
        <header className="hx-intro">
          <p className="eyebrow">One story leads to another</p>
          <h1>Guided Journeys</h1>
          <p className="hx-standfirst">
            Choose a path through the original writing.
          </p>
          <p>
            A few starting points, each following existing articles, people and
            Seasons. Take the next step, or follow a connection of your own.
          </p>
        </header>
        <JourneyCards journeys={getV3View().journeys} />
      </main>
    </>
  );
}
