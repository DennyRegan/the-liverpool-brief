import Link from "next/link";
import { getV3View } from "@/lib/content/history-v3-view";
import {
  continueFrom,
  type ContinueContext,
  type Journey,
  type TimelineSection,
} from "@/lib/content/history-v3";
import { seasonLabel } from "@/lib/content/seasons";
import { formatListDate } from "@/lib/format";

export function ContinueFromHere({ context }: { context: ContinueContext }) {
  const data = getV3View();
  const links = continueFrom(context, data.context, data.journeys);
  if (!links.length) return null;
  return (
    <nav className="v3-continue" aria-label="Continue from here">
      <h2>Continue from here</h2>
      <ul role="list">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} prefetch={false}>
              {l.label} <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
export function JourneyCards({
  journeys,
  headingLevel = 2,
}: {
  journeys: Journey[];
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className="v3-journey-cards" role="list">
      {journeys.map((j) => (
        <li key={j.id}>
          <p className="eyebrow">Guided journey · {j.steps.length} stops</p>
          <Heading>
            <Link href={`/history/journeys/${j.id}`}>
              {j.title} <span aria-hidden="true">→</span>
            </Link>
          </Heading>
          <p>{j.introduction}</p>
        </li>
      ))}
    </ul>
  );
}
export function TimelineSections({
  sections,
}: {
  sections: TimelineSection[];
}) {
  if (!sections.length)
    return (
      <p className="v3-empty" role="status">
        No published material matches this selection. Try another period or
        reset the filters.
      </p>
    );
  return (
    <div className="v3-timeline">
      {sections.map((section, index) => {
        const records = section.entries.filter((e) => e.kind === "season");
        const events = section.entries.filter((e) => e.kind !== "season");
        return (
          <section
            className="v3-year"
            id={`year-${section.year}`}
            key={section.year}
            aria-labelledby={`year-heading-${section.year}`}
          >
            <h2 id={`year-heading-${section.year}`}>{section.year}</h2>
            {records.map((e) => (
              <div className="v3-season-context" key={e.id}>
                <p className="eyebrow">Season beginning this year</p>
                <h3>
                  <Link href={e.href}>
                    {e.title} <span aria-hidden="true">→</span>
                  </Link>
                </h3>
                {e.detail && <p>{e.detail}</p>}
                <ul className="v3-context-links" role="list">
                  {e.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {events.length > 0 && (
              <details
                className="v3-events"
                open={index === 0 || sections.length <= 2}
              >
                <summary>
                  Writing and events <span>({events.length})</span>
                  <span aria-hidden="true"> ↓</span>
                </summary>
                <ol role="list">
                  {events.map((e) => (
                    <li key={e.id} data-timeline-id={e.id}>
                      <p className="eyebrow">
                        {e.kind === "era"
                          ? "Managerial era begins"
                          : e.kind === "event"
                            ? "From the Season record"
                            : "Original factual writing"}
                        {e.date && (
                          <>
                            {" "}
                            ·{" "}
                            <time dateTime={e.date}>
                              {formatListDate(e.date)}
                            </time>
                          </>
                        )}
                        {!e.date &&
                          e.season &&
                          ` · ${seasonLabel(e.season)} · exact date not recorded`}
                      </p>
                      <h3>
                        <Link href={e.href} prefetch={false}>
                          {e.title} <span aria-hidden="true">↗</span>
                        </Link>
                      </h3>
                      <ul className="v3-context-links" role="list">
                        {e.links.map((l) => (
                          <li key={l.href}>
                            <Link href={l.href} prefetch={false}>
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </details>
            )}
            {sections[index + 1] && (
              <a
                className="v3-forward"
                href={`#year-${sections[index + 1].year}`}
              >
                Continue into {sections[index + 1].year}{" "}
                <span aria-hidden="true">↓</span>
              </a>
            )}
          </section>
        );
      })}
    </div>
  );
}
