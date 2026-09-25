import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryNav } from "@/app/components/history/HistoryNav";
import { getV3View } from "@/lib/content/history-v3-view";
import { journeyStepHref, journeyMinutes } from "@/lib/content/history-v3";
type Props = { params: Promise<{ journey: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return getV3View().journeys.map((j) => ({ journey: j.id }));
}
export async function generateMetadata({ params }: Props) {
  const { journey } = await params;
  const j = getV3View().journeys.find((j) => j.id === journey);
  if (!j) notFound();
  return {
    title: `${j.title} | The Liverpool Brief`,
    description: j.introduction,
    alternates: { canonical: `/history/journeys/${j.id}` },
  };
}
export default async function JourneyPage({ params }: Props) {
  const { journey } = await params;
  const j = getV3View().journeys.find((j) => j.id === journey);
  if (!j) notFound();
  const narrative = Boolean(j.steps[0].chapter);
  return (
    <>
      <SiteHeader active="history" />
      <main id="main-content" className={`site-width hx-page v3-page ${narrative ? "journey-story" : ""}`}>
        <HistoryNav active="journeys" />
        <Link className="hx-back" href="/history/journeys">
          ← All journeys
        </Link>
        <header className="hx-intro">
          <p className="eyebrow">Guided journey · {j.steps.length} {narrative ? "chapters" : "stops"}{narrative && ` · About ${journeyMinutes(j)} minutes`}</p>
          <h1>{j.title}</h1>
          <p className="hx-standfirst">{j.introduction}</p>
        </header>
        <Link className="v3-primary" href={journeyStepHref(j, 0)}>
          {narrative ? "Read chapter one" : "Start this journey"} →
        </Link>
        {narrative && <p className="journey-reading-note">Read the story from beginning to end, or choose a chapter below. Original match reports and season records are there when you want more detail.</p>}
        <ol className="v3-steps">
          {j.steps.map((s, i) => (
            <li key={`${s.kind}:${s.id}`}>
              <p className="eyebrow">{narrative && `Chapter ${i + 1} · `}{s.chapter?.period ?? s.period}</p>
              <h2>
                <Link href={journeyStepHref(j, i)}>
                  {s.chapter?.title ?? s.title} <span aria-hidden="true">→</span>
                </Link>
              </h2>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
