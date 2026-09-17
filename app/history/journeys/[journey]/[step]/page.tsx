import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryNav } from "@/app/components/history/HistoryNav";
import { getV3View } from "@/lib/content/history-v3-view";
type Props = { params: Promise<{ journey: string; step: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return getV3View().journeys.flatMap((j) =>
    j.steps.map((_, i) => ({ journey: j.id, step: String(i + 1) })),
  );
}
async function resolve(params: Props["params"]) {
  const { journey, step } = await params;
  const j = getV3View().journeys.find((j) => j.id === journey);
  const n = Number(step);
  if (!j || !/^\d+$/.test(step) || String(n) !== step || !j.steps[n - 1])
    notFound();
  return { j, n, s: j.steps[n - 1] };
}
export async function generateMetadata({ params }: Props) {
  const { j, n, s } = await resolve(params);
  return {
    title: `${s.title} | ${j.title}`,
    alternates: { canonical: `/history/journeys/${j.id}/${n}` },
  };
}
export default async function JourneyStep({ params }: Props) {
  const { j, n, s } = await resolve(params);
  return (
    <>
      <SiteHeader active="history" />
      <main id="main-content" className="site-width hx-page v3-page v3-reader">
        <HistoryNav active="journeys" />
        <Link className="hx-back" href={`/history/journeys/${j.id}`}>
          ← {j.title}
        </Link>
        <header className="hx-intro">
          <p className="eyebrow">
            Step {n} of {j.steps.length} · {s.period}
          </p>
          <h1>{s.title}</h1>
          {s.description && <p className="hx-standfirst">{s.description}</p>}
        </header>
        <Link className="v3-primary" href={s.href} prefetch={false}>
          {s.kind === "article"
            ? "Read the original article"
            : "Explore this stop"}{" "}
          <span aria-hidden="true">↗</span>
        </Link>
        <p className="v3-reader-note">
          Open the original, then use Back to return to this step. This step has
          its own link, so you can return without an account or saved progress.
        </p>
        <nav
          className="v3-context-links"
          aria-label="Explore this step’s context"
        >
          {s.links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label} →
            </Link>
          ))}
        </nav>
        <nav className="v3-step-navigation" aria-label="Journey steps">
          {n > 1 && (
            <Link rel="prev" href={`/history/journeys/${j.id}/${n - 1}`}>
              <span>← Previous step</span>
              <strong>{j.steps[n - 2].title}</strong>
            </Link>
          )}
          {n < j.steps.length ? (
            <Link rel="next" href={`/history/journeys/${j.id}/${n + 1}`}>
              <span>Next step →</span>
              <strong>{j.steps[n].title}</strong>
            </Link>
          ) : (
            <Link href="/history/journeys">
              <span>Journey complete</span>
              <strong>Choose another journey →</strong>
            </Link>
          )}
        </nav>
        <Link className="v3-forward" href="/history">
          Explore history in your own direction →
        </Link>
      </main>
    </>
  );
}
