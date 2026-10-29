"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { historyDate, matchLabel, projectBritain, groupAtlasLocations, type AtlasGround } from "@/lib/history-atlas";

export function HistoryAtlas({ grounds, coastline }: {
  grounds: AtlasGround[]; coastline: { name: string; d: string }[];
}) {
  const locations = groupAtlasLocations(grounds);
  const matchCount = grounds.reduce((total, ground) => total + ground.matches.length, 0);
  const fullSelection = grounds.length === 4 && matchCount === 5;
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(locations[0].id);
  const selected = locations.find(location => location.id === selectedId)!;
  const id = useId();
  const panelId = `${id}-panel`;
  const mapId = `${id}-map`;
  const choose = (location: (typeof locations)[number]) => setSelectedId(location.id);

  return <div className="hp-explore">
    <div className="hp-ways" aria-label="Explore this season">
      <a className="hp-button hp-button-primary" href="#matches">Read the season’s matches <span aria-hidden="true">↓</span></a>
      <button className="hp-button hp-button-secondary" type="button" aria-expanded={open} aria-controls={mapId} onClick={() => setOpen(!open)}>
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16" /></svg>
        {open ? "Close the map" : "Explore the interactive map"}<span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
    </div>
    <section id={mapId} className="hp-atlas" hidden={!open} aria-labelledby={`${id}-title`}>
      <div className="hp-section-heading"><div><p className="hp-kicker">The season atlas</p><h2 id={`${id}-title`}>{fullSelection ? "Four grounds. Five stories." : `${grounds.length} ${grounds.length === 1 ? "ground" : "grounds"}. ${matchCount} ${matchCount === 1 ? "story" : "stories"}.`}</h2></div><p>Select a place to explore its matches.</p></div>
      <div className="hp-atlas-grid">
        <div className="hp-map" role="group" aria-label="Map of Britain. Choose a place to explore available match reports.">
          <svg className="hp-cartography" viewBox="0 0 640 610" aria-hidden="true">
            <defs><pattern id={`${id}-grid`} width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="#d8d8cb" strokeWidth=".6" /></pattern></defs>
            <rect width="640" height="610" fill={`url(#${id}-grid)`} />
            {coastline.map(country => <path key={country.name} d={country.d} fill={country.name === "Ireland" ? "#e9e7dc" : "#dedfce"} stroke="#b4b8a3" strokeWidth=".8" />)}
            <text x="60" y="62" className="hp-map-note">BRITAIN</text><text x="60" y="81" className="hp-map-caption">Grounds of 1987–88</text>
            <text x="244" y="212" className="hp-map-region">SCOTLAND</text>
            <text x="334" y="432" className="hp-map-region">ENGLAND</text>
            <text x="245" y="462" className="hp-map-region">WALES</text>
            <text x="164" y="362" className="hp-map-water">Irish Sea</text>
            <text x="476" y="245" className="hp-map-water">North Sea</text>
            <path d="M569 92V50m-7 10 7-13 7 13" fill="none" stroke="#6a705d" strokeWidth="1.3" /><text x="564" y="40" className="hp-map-caption">N</text>
          </svg>
          {locations.map(ground => {
            const [x,y] = projectBritain(ground.longitude, ground.latitude);
            return <button key={ground.id} type="button" className={`hp-pin ${selectedId === ground.id ? "is-selected" : ""}`}
              style={{ left: `${x / 640 * 100}%`, top: `${y / 610 * 100}%` }}
              aria-pressed={selectedId === ground.id} aria-controls={panelId}
              aria-label={`${ground.label}${ground.grounds.length > 1 ? `, ${ground.grounds.length} grounds` : ""}, ${ground.matches.length} ${ground.matches.length === 1 ? "match" : "matches"}`}
              onClick={() => choose(ground)}>
              <span className="hp-pin-dot" aria-hidden="true">{ground.matches.length > 1 ? ground.matches.length : ""}</span>
              <span className="hp-pin-label" aria-hidden="true">{ground.label}{ground.grounds.length > 1 ? ` · ${ground.grounds.length} grounds` : ""}</span>
            </button>;
          })}
          <span className="hp-map-credit">Coastline: Natural Earth</span>
        </div>
        <div className="hp-atlas-panel" id={panelId}>
          <div className="hp-venue-switch" role="group" aria-label="Choose a place">
            {locations.map(ground => <button key={ground.id} type="button" aria-pressed={selectedId === ground.id} onClick={() => choose(ground)}>{ground.label}</button>)}
          </div>
          <div className="hp-venue-heading"><p className="hp-kicker">{selected.grounds.length > 1 ? "Explore the grounds" : selected.city}</p><h3>{selected.label}</h3><p>{selected.grounds.length > 1 ? `${selected.grounds.length} grounds · ${selected.matches.length} reports in this selection` : selected.id === "wembley" ? "The original Wembley · FA Cup final" : `${selected.matches.length} ${selected.matches.length === 1 ? "match" : "matches"} in this selection`}</p></div>
          <p className="hp-sr-only" role="status">{selected.label} selected. {selected.matches.length} {selected.matches.length === 1 ? "report available" : "reports available"}.</p>
          <div className="hp-venue-reports">
            {selected.matches.map(match => <article key={match.slug}>
              {selected.grounds.length > 1 && <p className="hp-panel-ground">{selected.grounds.find(ground => ground.id === match.locationId)!.label}{match.locationId === "wembley" && <span>Original stadium · FA Cup final</span>}</p>}
              <p className="hp-date"><time dateTime={match.historicalEventDate}>{historyDate(match.historicalEventDate)}</time> · {match.competition}</p>
              <p className="hp-panel-score">{matchLabel(match)}</p>
              <h4>{match.title}</h4><p className="hp-panel-excerpt">{match.excerpt}</p>
              <Link className="hp-read-link" href={match.href}>Read the match report <span aria-hidden="true">→</span><span className="hp-sr-only">: {matchLabel(match)}</span></Link>
            </article>)}
          </div>
          <a className="hp-map-reading" href="#matches">{fullSelection ? "See all five matches in date order" : "Read the published matches"} ↓</a>
        </div>
      </div>
      <details className="hp-map-sources"><summary>About the map and its locations</summary><p>Stadium points use the published coordinates below, checked on 28 October 2026. {locations.some(location => location.grounds.length > 1) && "Highbury and Wembley refer to the grounds used in 1987–88. At this scale, London groups its two grounds into one marker, positioned between their verified coordinates. Select London to see each ground and its report."} The coastline is a modern geographic reference.</p><ul>{grounds.map(g => <li key={g.id}><a href={g.source}>{g.label}</a> — {g.latitude.toFixed(5)}, {g.longitude.toFixed(5)}. {g.note}</li>)}</ul><p><a href="https://www.naturalearthdata.com/about/terms-of-use/">Natural Earth</a> supplies the public-domain coastline.</p></details>
    </section>
  </div>;
}
