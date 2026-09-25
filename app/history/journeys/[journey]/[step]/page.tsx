import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryNav } from "@/app/components/history/HistoryNav";
import { getV3View } from "@/lib/content/history-v3-view";
import { journeyStepHref, journeyStepIndex } from "@/lib/content/history-v3";
type Props = { params: Promise<{ journey: string; step: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return getV3View().journeys.flatMap((j) =>
    [
      ...j.steps.map((s, i) => ({ journey: j.id, step: s.chapter?.slug ?? String(i + 1) })),
      ...(j.legacySteps ?? []).map((_, i) => ({ journey: j.id, step: String(i + 1) })),
    ],
  );
}
async function resolve(params: Props["params"]) {
  const { journey, step } = await params;
  const j = getV3View().journeys.find((j) => j.id === journey);
  if (!j) notFound();
  const index = journeyStepIndex(j, step);
  if (index < 0) notFound();
  if (j.steps[index].chapter && step !== j.steps[index].chapter?.slug)
    permanentRedirect(journeyStepHref(j, index));
  return { j, n: index + 1, s: j.steps[index] };
}
export async function generateMetadata({ params }: Props) {
  const { j, n, s } = await resolve(params);
  return {
    title: `${s.chapter?.title ?? s.title} | ${j.title}`,
    description: s.chapter?.paragraphs[0] ?? s.description,
    alternates: { canonical: journeyStepHref(j, n - 1) },
  };
}
export default async function JourneyStep({ params }: Props) {
  const { j, n, s } = await resolve(params);
  const chapter = s.chapter;
  const reading = [s, ...(s.reading ?? [])].filter((ref, i, refs) => refs.findIndex((r) => r.href === ref.href) === i);
  const chapterSources = j.sources?.filter((source) => chapter?.sourceIds.includes(source.id)) ?? [];
  return (
    <>
      <SiteHeader active="history" />
      <main id="main-content" className={`site-width hx-page v3-page v3-reader ${chapter ? "journey-story" : ""}`}>
        <HistoryNav active="journeys" />
        <Link className="hx-back" href={`/history/journeys/${j.id}`}>
          ← {j.title}
        </Link>
        {chapter && (
          <div className="journey-orientation">
            <nav className="journey-progress" aria-label="Chapter progress">
              {j.steps.map((step, index) => (
                <Link key={step.chapter!.slug} href={journeyStepHref(j, index)}
                  aria-current={index === n - 1 ? "step" : undefined}
                  aria-label={`Chapter ${index + 1}: ${step.chapter!.title}`}
                  className={index < n - 1 ? "journey-earlier" : undefined}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                </Link>
              ))}
            </nav>
            <details className="journey-contents">
              <summary>Chapters <span>{n} of {j.steps.length}</span></summary>
              <nav aria-label="Journey contents">
                <ol>
                  {j.steps.map((step, index) => (
                    <li key={step.chapter!.slug}>
                      <Link href={journeyStepHref(j, index)} aria-current={index === n - 1 ? "page" : undefined}>
                        <span>{index + 1}. {step.chapter!.title}</span>
                        <small>{step.chapter!.period}</small>
                      </Link>
                    </li>
                  ))}
                </ol>
              </nav>
            </details>
          </div>
        )}
        <header className="hx-intro">
          <p className="eyebrow">
            {chapter ? "Chapter" : "Step"} {n} of {j.steps.length} · {chapter?.period ?? s.period}
          </p>
          <h1>{chapter?.title ?? s.title}</h1>
          {!chapter && s.description && <p className="hx-standfirst">{s.description}</p>}
        </header>
        {chapter ? (
          <>
            <article className="journey-prose" aria-label={chapter.title}>
              {chapter.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </article>
            {n === j.steps.length && j.closing && (
              <section className="journey-closing" aria-labelledby="journey-end">
                <p className="eyebrow">Journey complete</p>
                <h2 id="journey-end">Looking back</h2>
                <p>{j.closing}</p>
              </section>
            )}
            <aside className="journey-deeper" aria-labelledby="deeper-title">
              <h2 id="deeper-title">Read further</h2>
              <p>Optional reading opens in a new tab, keeping your place here.</p>
              <ul role="list">
                {reading.map((ref) => (
                  <li key={ref.href}>
                    <Link href={ref.href} prefetch={false} target="_blank" rel="noopener">
                      {ref.title} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
                    </Link>
                    <small>{ref.kind === "article" ? "Original report" : ref.kind === "season" ? "Season record" : "Explore the history"}</small>
                  </li>
                ))}
              </ul>
            </aside>
          </>
        ) : <>
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
        </>}
        <nav className="v3-step-navigation" aria-label="Journey steps">
          {n > 1 && (
            <Link rel="prev" href={journeyStepHref(j, n - 2)}>
              <span>← Previous {chapter ? "chapter" : "step"}</span>
              <strong>{j.steps[n - 2].chapter?.title ?? j.steps[n - 2].title}</strong>
            </Link>
          )}
          {n < j.steps.length ? (
            <Link rel="next" href={journeyStepHref(j, n)}>
              <span>Next {chapter ? "chapter" : "step"} →</span>
              <strong>{j.steps[n].chapter?.title ?? j.steps[n].title}</strong>
            </Link>
          ) : (
            <Link href="/history/journeys">
              <span>Journey complete</span>
              <strong>Choose another journey →</strong>
            </Link>
          )}
        </nav>
        {chapterSources.length > 0 && (
          <details className="hx-sources journey-sources">
            <summary>Sources for this chapter</summary>
            <ul>{chapterSources.map((source) => (
              <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<span className="sr-only"> (opens in a new tab)</span></a></li>
            ))}</ul>
          </details>
        )}
        <Link className="v3-forward" href="/history">
          Explore history in your own direction →
        </Link>
      </main>
    </>
  );
}
