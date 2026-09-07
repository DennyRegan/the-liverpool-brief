import type { HistoryEra } from "@/lib/content/history";

export function EraFacts({ era, detailed = false }: { era: HistoryEra; detailed?: boolean }) {
  const Heading = detailed ? "h2" : "h3";
  return (
    <div className="hx-facts">
      <section aria-labelledby={`${era.id}-honours`}>
        <Heading id={`${era.id}-honours`} className="eyebrow">Major honours</Heading>
        {era.honours.length ? (
          <dl className="hx-honours">
            {era.honours.map(honour => (
              <div key={honour.name}>
                <dt>{honour.name}</dt>
                <dd><span className="hx-honour-count"><span aria-hidden="true">×</span><span className="sr-only">Won </span>{honour.years.length}</span>
                  {detailed && <span className="hx-honour-years">{honour.years.join(" · ")}</span>}
                </dd>
              </div>
            ))}
          </dl>
        ) : <p className="hx-quiet">{era.endDate ? "No major honours during this tenure." : "An era still taking shape."}</p>}
        {era.otherHonours?.length ? <p className="hx-other-honours">Also: {era.otherHonours.map(honour => `${honour.name}, ${honour.years.join(", ")}`).join("; ")}.</p> : null}
      </section>
      <section aria-labelledby={`${era.id}-players`}>
        <Heading id={`${era.id}-players`} className="eyebrow">{era.playersLabel ?? "Key players"}</Heading>
        <ul className="hx-players" role="list">{era.keyPlayers.map(player => <li key={player}>{player}</li>)}</ul>
      </section>
    </div>
  );
}
