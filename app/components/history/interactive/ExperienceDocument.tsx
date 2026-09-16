import ReactMarkdown from "react-markdown";
import type { ReactNode } from "react";
import type { ExperienceControls, ExperienceDocumentModel } from "@/lib/interactive-history/models";
import type { Block, Boundary, Diagram, MatchEvent, Moment, Side, Statistics } from "@/lib/interactive-history/types";
import { ExperienceController, MatchStateBar, ShootoutSequence } from "./ExperienceController";
import { StateComparison } from "./StateComparison";
import "@/app/history/interactive/interactive-history.css";

type Document = ExperienceDocumentModel;
const sourceLabels: Record<string, string> = { "verified-fact": "Match record", "statistical-observation": "Statistical record", "contemporary-reporting": "Reported at the time", "later-recollection": "Later recollection", "tactical-interpretation": "Tactical interpretation" };

function Markdown({ children }: { children: string }) {
  return <ReactMarkdown skipHtml allowedElements={["p", "em", "strong", "a", "code", "br"]} unwrapDisallowed>{children}</ReactMarkdown>;
}
function stateAt(document: Document, boundary: Boundary) { return document.states[boundary ?? "$initial"]; }

export function ExperienceDocument({ document, controls, preview = false }: { document: Document; controls: ExperienceControls; preview?: boolean }) {
  const first = document.moments[0];
  const exploration = document.moments.find(moment => stateAt(document, moment.afterEventId).phase === "interval");
  const outcome = document.moments.find(moment => stateAt(document, moment.afterEventId).outcome);
  return <ExperienceController model={controls}>
    <header className="ih-introduction" id="experience-introduction">
      <p className="eyebrow">Interactive History {preview && <span className="ih-preview-label">· Local review draft</span>}</p>
      <h1>{document.title}</h1>
      <p className="ih-subject-date">{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(document.dateRange.start))} <span>·</span> {document.match.competitionLabel ?? document.relationships.competitionIds.map(id => document.names[id]).join(" · ")} <span>·</span> {document.relationships.locationIds.map(id => document.names[id]).join(" · ")}</p>
      <p className="ih-standfirst">{document.standfirst}</p>
      <div className="ih-intro-links"><a className="ih-primary" href={`#${first.id}`}>Explore from the beginning <span aria-hidden="true">↓</span></a>{exploration && <a href={`#${exploration.id}`}>Go to half-time <span aria-hidden="true">↗</span></a>}</div>
      <p className="ih-how-to">Read at your own pace. Open a team, compare the change, or follow the evidence at any moment.</p>{document.contentNotes.map(note => <p className="ih-caption" key={note}>{note}</p>)}
    </header>
    <MatchStateBar />
    <div className="ih-reading-layout">
      <aside className="ih-rail"><MomentIndex document={document} outcomeId={outcome?.id} /><p className="ih-rail-note">A match in moments.<br />Every score is {document.teams.subject} first.</p></aside>
      <div className="ih-narrative" data-narrative>
        {document.moments.map(moment => moment.id === outcome?.id
          ? <details key={moment.id} className="ih-outcome" data-outcome-disclosure><summary>After the final <span>— reveals the result</span></summary><MomentSection document={document} controls={controls} moment={moment} /></details>
          : <MomentSection key={moment.id} document={document} controls={controls} moment={moment} />)}
      </div>
    </div>
    <div className="ih-after-reading"><ExperienceConnections document={document} /><EvidenceCatalogue document={document} /></div>
  </ExperienceController>;
}

function MomentIndex({ document, outcomeId }: { document: Document; outcomeId?: string }) {
  return <details className="ih-moment-index" id="moment-index" data-moment-index><summary>Moments in the match</summary><nav aria-label="Match moments"><ol>{document.chapters.map(chapter => {
    const moments = document.moments.filter(moment => moment.chapterId === chapter.id);
    return <li key={chapter.id}><a href={`#${moments[0].id}`} className="ih-chapter-link">{chapter.title}{moments[0].id === outcomeId && <span className="ih-sr-only"> — reveals the result</span>}</a><ol>{moments.map(moment => <li key={moment.id}><a href={`#${moment.id}`}>{moment.title}{moment.id === outcomeId && <small>Reveals the result</small>}</a></li>)}</ol></li>;
  })}</ol></nav></details>;
}

function MomentSection({ document, controls, moment }: { document: Document; controls: ExperienceControls; moment: Moment }) {
  const state = stateAt(document, moment.afterEventId);
  const chapter = document.chapters.find(item => item.id === moment.chapterId)!;
  const firstInChapter = document.moments.find(item => item.chapterId === chapter.id)?.id === moment.id;
  const openingDiagrams = moment.afterEventId === null ? moment.blocks.filter(block => block.type === "diagram") : [];
  return <section className={`ih-moment ih-${moment.presentation}`} aria-labelledby={moment.id}>
    {firstInChapter && <p className="ih-chapter-eyebrow">{chapter.title}</p>}
    {moment.presentation === "attempt-sequence" && <div className="ih-attempt-landmarks" aria-label="Shoot-out attempt destinations">{controls.attempts.map((attempt, index) => <span id={attempt.id} key={attempt.id} tabIndex={-1} role="group" aria-label={`After attempt ${index + 1}`} />)}</div>}
    <div className="ih-static-state"><span>{state.clock.label}</span><span>{document.teams.subject} <strong>{state.score.subject}–{state.score.opposition}</strong> {document.teams.opposition}{state.shootout && <> · Penalties {state.shootout.score.subject}–{state.shootout.score.opposition}</>}</span></div>
    <h2 id={moment.id} data-moment-id={moment.id} tabIndex={-1}>{moment.title}</h2>
    <div className="ih-moment-body">{moment.blocks.map(block => {
      if (block.type === "diagram" && openingDiagrams.length === 2) {
        if (block.id !== openingDiagrams[0].id) return null;
        const diagrams = openingDiagrams.map(b => document.diagrams.find(d => d.id === b.diagramId)!);
        return <StateComparison key={block.id} title="Starting teams" labels={[document.teams[diagrams[0].side], document.teams[diagrams[1].side]]} views={diagrams.map(d => <TacticalDiagram key={d.id} document={document} diagram={d} headingLevel={4} />) as [ReactNode, ReactNode]} />;
      }
      return <BlockView key={block.id} block={block} document={document} controls={controls} />;
    })}</div>
    <MomentEvidence document={document} title={moment.title} revealsResults={moment.presentation === "attempt-sequence"} claimIds={document.momentEvidence[moment.id] ?? []} />
  </section>;
}

function BlockView({ block, document, controls }: { block: Block; document: Document; controls: ExperienceControls }) {
  switch (block.type) {
    case "paragraph": return <div className="ih-prose"><Markdown>{block.text}</Markdown></div>;
    case "list": return <ul className="ih-prose ih-list">{block.items.map((item, i) => <li key={i}><Markdown>{item.text}</Markdown></li>)}</ul>;
    case "context": {
      const context = document.contexts.find(item => item.id === block.contextId)!;
      return <details className="ih-context"><summary>{context.title}</summary><div className="ih-disclosure-body"><p className="ih-caption">{context.scope.label}</p>{context.blocks.map(child => <BlockView key={child.id} block={child} document={document} controls={controls} />)}</div></details>;
    }
    case "personnel": return <Personnel document={document} side={block.side} boundary={block.boundary} />;
    case "diagram": return <TacticalDiagram document={document} diagram={document.diagrams.find(d => d.id === block.diagramId)!} />;
    case "comparison": return <StateComparison title={block.title} labels={[block.views[0].label, block.views[1].label]} views={block.views.map(view => <TacticalDiagram key={view.diagramId} document={document} diagram={document.diagrams.find(d => d.id === view.diagramId)!} label={view.label} headingLevel={4} />) as [ReactNode, ReactNode]} />;
    case "statistics": {
      const stats = document.statistics.find(s => s.id === block.statisticsId)!;
      return stats.period.includesExtraTime ? <details className="ih-context"><summary>Match statistics after extra time</summary><StatisticComparison document={document} statistics={stats} /></details> : <StatisticComparison document={document} statistics={stats} />;
    }
    case "shootout": {
      const matchScore = controls.attempts[0]?.state.score;
      return <><ShootoutSequence /><details className="ih-full-record"><summary>Read the complete shoot-out record <span>— reveals all attempts</span></summary><p className="ih-caption">All tallies are {document.teams.subject}–{document.teams.opposition}.{matchScore && <> The match score remains {matchScore.subject}–{matchScore.opposition}.</>}</p><ol className="ih-attempts">{controls.attempts.map((attempt, i) => <li key={attempt.id}><span className="ih-attempt-number">{i + 1}</span><div>{attempt.taker}<small>{document.teams[attempt.side]} · {attempt.result}</small></div><strong>{attempt.state.shootout!.score.subject}–{attempt.state.shootout!.score.opposition}</strong></li>)}</ol></details></>;
    }
  }
}

function playerEvents(document: Document, personId: string, boundary: Boundary) {
  const last = boundary === null ? -1 : document.events.findIndex(e => e.id === boundary);
  return document.events.slice(0, last + 1).filter((event): event is MatchEvent => {
    const p = event.payload;
    return ("scorerId" in p && p.scorerId === personId) || ("takerId" in p && p.takerId === personId) || ("incomingId" in p && p.incomingId === personId) || ("outgoingId" in p && p.outgoingId === personId);
  });
}

function PersonContext({ document, side, personId, boundary, role, label }: { document: Document; side: Side; personId: string; boundary: Boundary; role?: string; label?: string }) {
  const state = stateAt(document, boundary);
  const roster = document.match.rosters[side];
  const player = [...roster.starters, ...roster.substitutes].find(p => p.personId === personId)!;
  const status = state.personnel[side].onField.includes(personId) ? "On the field" : state.personnel[side].unusedSubstitutes.includes(personId) ? "Unused named substitute" : "Replaced; cannot return";
  const events = playerEvents(document, personId, boundary);
  return <details className="ih-person"><summary><span className="ih-shirt-number">{player.shirtNumber}</span><span>{document.names[personId]}</span>{role && <small>{role}</small>}</summary><div className="ih-person-detail"><p><strong>{label ?? state.clock.label}</strong> · {document.teams[side]}</p><p>{status}{role && <> · {role} (schematic role)</>}</p>{events.map(event => <p key={event.id}>{event.time.label}: {event.type === "goal" ? event.payload.classification === "rebound" ? "Scored from the rebound after the penalty was saved." : "Scored a match goal." : event.type === "substitution" ? event.payload.incomingId === personId ? `Replaced ${document.names[event.payload.outgoingId]}.` : `Replaced by ${document.names[event.payload.incomingId]}.` : event.type === "shootout-attempt" ? `Penalty ${event.payload.result}.` : "The original penalty was saved."}</p>)}<EvidenceLinks document={document} claimIds={[...document.match.rules.claimIds, ...events.flatMap(event => event.claimIds)]} /></div></details>;
}

function Personnel({ document, side, boundary }: { document: Document; side: Side; boundary: Boundary }) {
  const state = stateAt(document, boundary);
  const personnel = state.personnel[side];
  const remaining = state.rules.substitutionLimit + (state.phase.startsWith("extra-time") || state.phase === "end-extra-time" || state.phase === "shootout" ? state.rules.extraTimeSubstitutionBonus : 0) - state.substitutionsUsed[side];
  return <div className="ih-personnel"><h3>{document.teams[side]} · {state.clock.label}</h3><p className="ih-caption">{personnel.onField.length} on the field · {remaining} {remaining === 1 ? "substitution" : "substitutions"} remaining</p><ul className="ih-people-list">{personnel.onField.map(personId => <li key={personId}><PersonContext {...{ document, side, boundary, personId }} /></li>)}</ul><details className="ih-context"><summary>Named substitutes still unused ({personnel.unusedSubstitutes.length})</summary><ul className="ih-people-list">{personnel.unusedSubstitutes.map(personId => <li key={personId}><PersonContext {...{ document, side, boundary, personId }} /></li>)}</ul><p className="ih-caption">Named availability does not establish each player’s medical fitness.</p></details></div>;
}

function TacticalDiagram({ document, diagram, label, headingLevel = 3 }: { document: Document; diagram: Diagram; label?: string; headingLevel?: 3 | 4 }) {
  const Heading = headingLevel === 4 ? "h4" : "h3";
  const titleId = `diagram-${diagram.id}-title`;
  const descriptionId = `diagram-${diagram.id}-description`;
  const roster = [...document.match.rosters[diagram.side].starters, ...document.match.rosters[diagram.side].substitutes];
  return <figure className="ih-diagram"><figcaption><Heading id={titleId}>{label ?? diagram.title}</Heading><p>{diagram.depictedPeriod}</p><span className="ih-evidence-label">Tactical interpretation{diagram.partial && " · partial view"}</span></figcaption><svg viewBox="0 0 100 125" role="img" aria-labelledby={`${titleId} ${descriptionId}`} className={`ih-pitch ih-side-${diagram.side}`}><desc id={descriptionId}>{diagram.description}</desc><rect className="ih-pitch-ground" x="1" y="1" width="98" height="123" rx="1"/><g className="ih-pitch-lines"><rect x="6" y="7" width="88" height="111"/><path d="M6 62.5H94 M31 7V25H69V7 M31 118V100H69V118 M40 7V14H60V7 M40 118V111H60V118"/><circle cx="50" cy="62.5" r="12"/></g>{diagram.arrows?.map((arrow, i) => {
    const from = diagram.players.find(p => p.personId === arrow.fromPersonId)!;
    const to = diagram.players.find(p => p.personId === arrow.toPersonId)!;
    return <g key={i} className="ih-role-arrow"><title>{`${arrow.label} (${arrow.meaning})`}</title><line x1={10 + from.x * .8} y1={12 + from.y} x2={10 + to.x * .8} y2={12 + to.y} strokeDasharray="2 2" /></g>;
  })}{diagram.players.map(player => <g key={player.personId} transform={`translate(${10 + player.x * .8} ${12 + player.y})`}><title>{`${document.names[player.personId]} — ${player.role}`}</title>{diagram.side === "subject" ? <circle className="ih-player-marker" r="4.1" /> : <rect className="ih-player-marker" x="-4.1" y="-4.1" width="8.2" height="8.2" rx=".5" />}<text textAnchor="middle" dy="1.35">{roster.find(p => p.personId === player.personId)!.shirtNumber}</text></g>)}</svg><p className="ih-diagram-description">{diagram.description}</p><p className="ih-caption">{diagram.interpretationNote}</p><details className="ih-context ih-diagram-people"><summary>Players and roles · {label ?? diagram.depictedPeriod}</summary><ul className="ih-people-list">{diagram.players.map(player => <li key={player.personId}><PersonContext document={document} side={diagram.side} personId={player.personId} boundary={diagram.personnelBoundary} role={player.role} label={label ?? diagram.depictedPeriod} /></li>)}</ul></details><EvidenceLinks document={document} claimIds={diagram.claimIds} /></figure>;
}

function StatisticComparison({ document, statistics }: { document: Document; statistics: Statistics }) {
  return <section className="ih-statistics" aria-label={statistics.title}><h3>{statistics.title}</h3><p className="ih-caption">{statistics.period.label} · {statistics.provider}</p><table><caption className="ih-sr-only">{statistics.title}; {statistics.period.label}</caption><thead><tr><th scope="col">Measure</th><th scope="col">{document.teams.subject}</th><th scope="col">{document.teams.opposition}</th></tr></thead><tbody>{statistics.observations.map(observation => <tr key={observation.metricId}><th scope="row">{observation.label}</th>{(["subject", "opposition"] as Side[]).map(side => <td key={side}>{observation.values[side] === null ? "Not available" : `${observation.values[side]}${observation.unit === "percent" ? "%" : ""}`}</td>)}</tr>)}</tbody></table><p className="ih-caption">{statistics.evidenceContext}</p>{[...new Set(statistics.observations.map(o => o.caveat).filter(Boolean))].map(note => <p key={note} className="ih-caption">{note}</p>)}<EvidenceLinks document={document} claimIds={statistics.observations.map(o => o.claimId)} /></section>;
}

function EvidenceLinks({ document, claimIds }: { document: Document; claimIds: string[] }) {
  const ids = [...new Set(document.claims.filter(claim => claimIds.includes(claim.id)).flatMap(claim => claim.sourceRefs.map(ref => ref.sourceId)))];
  return ids.length ? <p className="ih-evidence-links">Evidence: {ids.map((id, i) => <span key={id}>{i > 0 && " · "}<a href={`#source-${id}`}>{document.sources.find(source => source.id === id)?.publisher ?? id}<span className="ih-sr-only"> {id}</span></a></span>)}</p> : null;
}
function MomentEvidence({ document, title, claimIds, revealsResults = false }: { document: Document; title: string; claimIds: string[]; revealsResults?: boolean }) {
  const claims = document.claims.filter(claim => claimIds.includes(claim.id));
  return <details className="ih-evidence"><summary>Evidence for this moment{revealsResults && <span> — reveals all attempts</span>}<span className="ih-sr-only">: {title}</span></summary><div className="ih-disclosure-body"><h3>{title}: evidence</h3><ul>{claims.map(claim => <li key={claim.id}><span className="ih-evidence-label">{sourceLabels[claim.kind]}{claim.displayTreatment === "uncertainty-note" && " · Records differ"}</span><p>{claim.statement}</p><ul className="ih-claim-sources">{claim.sourceRefs.map((ref, i) => <li key={`${ref.sourceId}-${i}`}><a href={`#source-${ref.sourceId}`}>{document.sources.find(source => source.id === ref.sourceId)?.publisher} — {ref.locator}</a>{ref.relation !== "supports" && <> ({ref.relation})</>}</li>)}</ul></li>)}</ul></div></details>;
}
function EvidenceCatalogue({ document }: { document: Document }) {
  return <section className="ih-source-catalogue" aria-labelledby="experience-sources"><h2 id="experience-sources" tabIndex={-1}>Sources and historical notes</h2><p>The record, later memories and tactical explanations answer different questions. The notes identify their scope and limits.</p><details><summary>Open the source catalogue ({document.sources.length})</summary>{document.sources.map(source => <section key={source.id}><h3 id={`source-${source.id}`} tabIndex={-1}>{source.title}</h3><p>{source.publisher}{source.publishedOn && <> · {source.publishedOn}</>}</p><a href={source.url}>Read the source <span aria-hidden="true">↗</span></a><p>{source.scope}</p>{source.limitations.map((note, i) => <p className="ih-caption" key={i}>{note}</p>)}<a href={`#${document.moments[0].id}`} data-return-to-moment>Return to your moment ↑</a></section>)}</details></section>;
}
function ExperienceConnections({ document }: { document: Document }) {
  const connections = [...document.connections.seasons, ...document.connections.eras, ...document.connections.articles];
  return <section className="ih-connections"><h2>Continue exploring</h2><ul>{connections.map(connection => <li key={connection.href}><a href={connection.href}>{connection.title} <span aria-hidden="true">↗</span></a></li>)}</ul>{document.connections.relatedArticles.length > 0 && <div className="ih-related-reading">{document.connections.relatedArticles.map(article => <article key={article.href}><h3><a href={article.href}>{article.title}</a></h3><p>{article.excerpt}</p><small>{article.reasons.join(" · ")}</small></article>)}</div>}</section>;
}
