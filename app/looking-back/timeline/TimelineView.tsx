"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { TimelineCard } from "@/lib/content/timeline";

type Season = { id: string; label: string; main: TimelineCard[]; extended: TimelineCard[] };
type Filter = "all" | "match" | "signing" | "moment";
const FILTERS: { key: Filter; label: string }[] = [{ key: "all", label: "All" }, { key: "match", label: "Matches" }, { key: "signing", label: "Signings" }, { key: "moment", label: "Moments" }];
const TYPE_LABEL = { match: "Match", signing: "Signing", moment: "Moment" } as const;

// True only once hydrated in the browser. Before that (and with JavaScript off)
// everything is shown and the filter and expanders are absent.
const subscribe = () => () => {};
const useEnhanced = () => useSyncExternalStore(subscribe, () => true, () => false);

/** The season holding the entry named in the URL hash, so a shared link opens it. */
function seasonOfHash(seasons: Season[]) {
  if (typeof window === "undefined") return undefined;
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return undefined;
  const has = (card: TimelineCard): boolean => card.id === id || card.children.some(has);
  return seasons.find(s => s.extended.some(has))?.id;
}

function Card({ card, nested = false }: { card: TimelineCard; nested?: boolean }) {
  const Heading = nested ? "h4" : "h3";
  return (
    <li id={card.id} className={`tl-card tl-${card.type}${nested ? " tl-sub" : ""}`}>
      <p className="tl-meta"><span className="tl-date">{card.dateLabel}</span><span className="tl-tag">{TYPE_LABEL[card.type]}</span></p>
      <Heading className="tl-title"><a href={`#${card.id}`}>{card.title}</a></Heading>
      {(card.competition || card.result) && <p className="tl-result">{[card.result, card.competition].filter(Boolean).join(" · ")}</p>}
      {(card.announcedLabel || card.effectiveLabel) && <p className="tl-result">{[card.announcedLabel && `Announced ${card.announcedLabel}`, card.effectiveLabel && `Effective ${card.effectiveLabel}`].filter(Boolean).join(" · ")}</p>}
      <p className="tl-summary">{card.summary}</p>
      {card.children.length > 0 && <ol className="tl-children" aria-label={`Within ${card.title}`}>{card.children.map(child => <Card key={child.id} card={child} nested />)}</ol>}
      {card.resolvedLinks.length > 0 && <ul className="tl-links">{card.resolvedLinks.map(link => <li key={link.href}><a href={link.href}>{link.label} →</a></li>)}</ul>}
    </li>
  );
}

export function TimelineView({ seasons }: { seasons: Season[] }) {
  const enhanced = useEnhanced();
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const season = seasonOfHash(seasons);
    return season ? { [season]: true } : {};
  });

  useEffect(() => {
    const onHash = () => {
      const season = seasonOfHash(seasons);
      if (season) {
        setOpen(current => ({ ...current, [season]: true }));
        requestAnimationFrame(() => document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView());
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [seasons]);

  const shows = (card: TimelineCard) => filter === "all" || card.type === filter;
  return <>
    <nav className="tl-jump" aria-label="Jump to a season">
      <ul>{seasons.map(s => <li key={s.id}><a href={`#season-${s.id}`}>{s.label}</a></li>)}</ul>
    </nav>
    {enhanced && <div className="tl-filter" role="group" aria-label="Filter by type">
      {FILTERS.map(f => <button key={f.key} type="button" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>{f.label}</button>)}
    </div>}
    {seasons.map(season => {
      const main = season.main.filter(shows), extended = season.extended.filter(shows);
      if (!main.length && !extended.length) return null;
      const expanded = !enhanced || open[season.id];
      return (
        <section key={season.id} className="tl-season" aria-labelledby={`season-${season.id}`}>
          <h2 id={`season-${season.id}`} className="tl-season-title">{season.label}</h2>
          {main.length > 0 && <ol className="tl-list">{main.map(card => <Card key={card.id} card={card} />)}</ol>}
          {extended.length > 0 && <div className="tl-more">
            {enhanced
              ? <button type="button" className="tl-more-button" aria-expanded={expanded} aria-controls={`more-${season.id}`} onClick={() => setOpen(c => ({ ...c, [season.id]: !c[season.id] }))}>
                  {expanded ? "Hide" : "More from this season"} <span className="tl-count">({extended.length})</span>
                </button>
              : <h3 className="tl-more-heading">More from this season</h3>}
            <ol id={`more-${season.id}`} className="tl-list" hidden={!expanded}>{extended.map(card => <Card key={card.id} card={card} />)}</ol>
          </div>}
        </section>
      );
    })}
  </>;
}
