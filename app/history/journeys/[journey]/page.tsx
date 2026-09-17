import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryNav } from "@/app/components/history/HistoryNav";
import { getV3View } from "@/lib/content/history-v3-view";
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
  return (
    <>
      <SiteHeader active="history" />
      <main id="main-content" className="site-width hx-page v3-page">
        <HistoryNav active="journeys" />
        <Link className="hx-back" href="/history/journeys">
          ← All journeys
        </Link>
        <header className="hx-intro">
          <p className="eyebrow">Guided journey · {j.steps.length} stops</p>
          <h1>{j.title}</h1>
          <p className="hx-standfirst">{j.introduction}</p>
        </header>
        <Link className="v3-primary" href={`/history/journeys/${j.id}/1`}>
          Start this journey →
        </Link>
        <ol className="v3-steps">
          {j.steps.map((s, i) => (
            <li key={`${s.kind}:${s.id}`}>
              <p className="eyebrow">{s.period}</p>
              <h2>
                <Link href={`/history/journeys/${j.id}/${i + 1}`}>
                  {s.title} <span aria-hidden="true">→</span>
                </Link>
              </h2>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
