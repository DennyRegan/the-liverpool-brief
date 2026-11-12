"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import type { MapGame, MapStop, SeasonMapData } from "@/lib/content/season-map";
import { EUROPE, SHEET, type Camera } from "@/lib/season-map/views";
import "./season-map.css";

// The season map: one season's games as pins on the vintage sheet, with the
// journey drawn from game to game in date order. The sheet itself (coast, seas)
// is passed in as children, already drawn on the server. No map library.

type View = "britain" | "europe";
type Leg = { from: MapStop; to: MapStop };

const ZOOM_MS = 900;
const DRAW_MS = 850;

const transformOf = (c: Camera) => `translate(${SHEET / 2 - c.k * c.cx} ${SHEET / 2 - c.k * c.cy}) scale(${c.k})`;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A gentle arc between two stops; out and back bow to opposite sides, so both show. */
function arc({ from, to }: Leg, t = 1) {
  const bow = 0.16;
  const cx = (from.x + to.x) / 2 - (to.y - from.y) * bow;
  const cy = (from.y + to.y) / 2 + (to.x - from.x) * bow;
  // The first part of the curve, up to t (de Casteljau).
  const ax = from.x + (cx - from.x) * t, ay = from.y + (cy - from.y) * t;
  const bx = cx + (to.x - cx) * t, by = cy + (to.y - cy) * t;
  const ex = ax + (bx - ax) * t, ey = ay + (by - ay) * t;
  return `M${from.x} ${from.y}Q${ax.toFixed(2)} ${ay.toFixed(2)} ${ex.toFixed(2)} ${ey.toFixed(2)}`;
}

function Compass() {
  return <svg className="sm-compass" viewBox="-50 -58 100 112" aria-hidden="true">
    <circle r="30" className="sm-compass-ring" />
    <circle r="24" className="sm-compass-ring sm-compass-fine" />
    <path className="sm-compass-minor" d="M0 -27L5 0L0 27L-5 0ZM-27 0L0 -5L27 0L0 5Z" transform="rotate(45)" />
    <path className="sm-compass-light" d="M0 -40L7 0L0 40L-7 0ZM-40 0L0 -7L40 0L0 7Z" />
    <path className="sm-compass-dark" d="M0 -40L7 0L0 0ZM0 40L-7 0L0 0ZM40 0L0 7L0 0ZM-40 0L0 -7L0 0Z" />
    <text y="-44" textAnchor="middle">N</text>
  </svg>;
}

export function SeasonMap({ data, seasonLabel, writeUps, children }: {
  data: SeasonMapData;
  seasonLabel: string;
  /** Long write-ups for key games, already rendered, by game number. */
  writeUps: Record<number, ReactNode>;
  children: ReactNode;
}) {
  const { games, stops, britain, scale, season } = data;
  const last = games.length - 1;
  const storageKey = `lb-season-map:${season}`;

  const [index, setIndex] = useState(0);
  const [manualView, setManualView] = useState<View | null>(null);
  const [openStop, setOpenStop] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [resumed, setResumed] = useState(false);

  const game = games[index];
  const stop = stops[game.stop];
  const view: View = manualView ?? (stop.abroad ? "europe" : "britain");
  const target = view === "europe" ? EUROPE : britain;

  // The camera is moved by hand (requestAnimationFrame) so the sheet, the pins
  // and the journey line stay in step during a zoom. React only sets it once.
  const [firstCamera] = useState<Camera>(target);
  const camera = useRef<Camera>(firstCamera);
  const svgRef = useRef<SVGSVGElement>(null);
  const sheetRef = useRef<SVGGElement>(null);
  const legRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const from = camera.current;
    const to = target;
    const apply = (c: Camera) => {
      camera.current = c;
      sheetRef.current?.setAttribute("transform", transformOf(c));
      svgRef.current?.style.setProperty("--sm-inv", String(1 / c.k));
    };
    if (from.k === to.k && from.cx === to.cx && from.cy === to.cy) return;
    if (reducedMotion()) { apply(to); return; }
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = ease(Math.min(1, (now - start) / ZOOM_MS));
      // Zoom geometrically, so the map seems to move at a steady pace.
      apply({ k: from.k * Math.pow(to.k / from.k, t), cx: from.cx + (to.cx - from.cx) * t, cy: from.cy + (to.cy - from.cy) * t });
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  // The journey: every leg already travelled, and the leg into the current game.
  const legs = useMemo(() => games.map((g, i): Leg | null => (i > 0 && games[i - 1].stop !== g.stop ? { from: stops[games[i - 1].stop], to: stops[g.stop] } : null)), [games, stops]);
  const travelled = useMemo(() => {
    const seen = new Set<string>();
    let d = "";
    for (let i = 1; i < index; i += 1) {
      const leg = legs[i];
      const key = `${games[i - 1].stop}>${games[i].stop}`;
      if (!leg || seen.has(key)) continue;
      seen.add(key);
      d += arc(leg);
    }
    return d;
  }, [games, legs, index]);

  useEffect(() => {
    const path = legRef.current;
    const leg = legs[index];
    if (!path) return;
    if (!leg) { path.setAttribute("d", ""); return; }
    if (reducedMotion()) { path.setAttribute("d", arc(leg)); return; }
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DRAW_MS);
      path.setAttribute("d", arc(leg, Math.max(0.001, ease(t))));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [legs, index]);

  // The reader's place, kept in this browser only.
  useEffect(() => {
    let saved = 0;
    try { saved = Number(window.localStorage.getItem(storageKey)); } catch { /* private window or storage blocked: start at game 1 */ }
    if (!Number.isInteger(saved) || saved < 2 || saved > games.length) return;
    const frame = requestAnimationFrame(() => { setIndex(saved - 1); setResumed(true); });
    return () => cancelAnimationFrame(frame);
  }, [storageKey, games.length]);

  const go = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(last, next));
    setIndex(clamped);
    setManualView(null);
    setOpenStop(null);
    setResumed(false);
    try { window.localStorage.setItem(storageKey, String(clamped + 1)); } catch { /* not saved; the map still works */ }
  }, [last, storageKey]);

  const shown = useCallback((s: MapStop, i: number) => view === "britain" || s.abroad || s.home || i === game.stop, [view, game.stop]);

  /** The stop nearest a pointer, within a finger's reach. */
  const stopAt = (event: PointerEvent<SVGSVGElement> | React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const box = svg.getBoundingClientRect();
    const c = camera.current;
    const unit = box.width / SHEET; // screen pixels per view unit
    const x = ((event.clientX - box.left) / unit - SHEET / 2) / c.k + c.cx;
    const y = ((event.clientY - box.top) / unit - SHEET / 2) / c.k + c.cy;
    const reach = 22 / unit / c.k;
    let best: number | null = null;
    let bestDistance = reach;
    stops.forEach((s, i) => {
      if (!shown(s, i)) return;
      const distance = Math.hypot(s.x - x, s.y - y);
      if (distance < bestDistance) { best = i; bestDistance = distance; }
    });
    return best as number | null;
  };

  const choose = (i: number) => {
    if (stops[i].games.length === 1) go(stops[i].games[0]);
    else { setOpenStop(i); setHovered(null); }
  };

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLInputElement || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === "ArrowRight") { event.preventDefault(); go(index + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); go(index - 1); }
  };

  const months = useMemo(() => {
    const groups: { month: string; games: number[] }[] = [];
    games.forEach((g, i) => {
      const group = groups[groups.length - 1];
      if (group?.month === g.month) group.games.push(i); else groups.push({ month: g.month, games: [i] });
    });
    return groups;
  }, [games]);

  // Draw order: ordinary pins, then key pins, then Anfield, then the current one on top.
  const order = useMemo(() => stops.map((_, i) => i).sort((a, b) => {
    const rank = (i: number) => (i === game.stop ? 3 : stops[i].home ? 2 : stops[i].key ? 1 : 0);
    return rank(a) - rank(b);
  }), [stops, game.stop]);

  const list = openStop === null ? null : stops[openStop];
  const bar = scale[view];

  return <div className="sm" onKeyDown={onKey}>
    <div className="sm-stage">
      <figure className="sm-figure" aria-label={`Map of Liverpool's ${seasonLabel} season. Every game is also in the list below the map.`}>
        <svg
          ref={svgRef}
          className="sm-svg"
          viewBox={`0 0 ${SHEET} ${SHEET}`}
          data-view={view}
          data-hover={hovered !== null || undefined}
          style={{ "--sm-inv": 1 / firstCamera.k } as React.CSSProperties}
          onClick={event => { const i = stopAt(event); if (i !== null) choose(i); }}
          onPointerMove={event => { if (event.pointerType === "mouse") setHovered(stopAt(event)); }}
          onPointerLeave={() => setHovered(null)}
          aria-hidden="true"
        >
          <defs>
            <pattern id="sm-hatch" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M0 3H6" className="sm-hatch-line" />
            </pattern>
          </defs>
          <rect width={SHEET} height={SHEET} className="sm-sea-fill" />
          <rect width={SHEET} height={SHEET} fill="url(#sm-hatch)" />
          <g ref={sheetRef} transform={transformOf(firstCamera)}>
            {children}
            <path className="sm-travelled" d={travelled} vectorEffect="non-scaling-stroke" />
            <path ref={legRef} className="sm-leg" vectorEffect="non-scaling-stroke" />
            {order.map(i => {
              const s = stops[i];
              const visited = s.games[0] <= index;
              const classes = ["sm-fixed", "sm-pin", s.key && "is-key", s.home && "is-home", s.abroad && "is-abroad", visited && "is-visited", i === game.stop && "is-active", i === hovered && "is-hovered", !shown(s, i) && "is-hidden"].filter(Boolean).join(" ");
              return <g key={i} className={classes} style={{ transform: `translate(${s.x}px, ${s.y}px) scale(calc(var(--sm-inv) * var(--sm-pin, 1)))` }}>
                {i === game.stop && <circle className="sm-pin-halo" r="15" />}
                {s.home
                  ? <><circle className="sm-pin-mark" r="9" /><circle className="sm-pin-core" r="3.6" /></>
                  : s.key
                    ? <rect className="sm-pin-mark" x="-6.2" y="-6.2" width="12.4" height="12.4" transform="rotate(45)" />
                    : <circle className="sm-pin-mark" r="5.4" />}
                <text className="sm-pin-label" y={s.home ? -15 : -12} textAnchor="middle">{s.label}</text>
              </g>;
            })}
          </g>
        </svg>
        <div className="sm-views" role="group" aria-label="Map view">
          {(["britain", "europe"] as const).map(v => <button key={v} type="button" aria-pressed={view === v} onClick={() => setManualView(v)}>{v === "britain" ? "Britain" : "Europe"}</button>)}
        </div>
        <Compass />
        <div className="sm-scale" aria-hidden="true">
          <span className="sm-scale-bar" style={{ width: `${(bar.width * 100).toFixed(2)}%` }} />
          <span>{bar.miles} miles</span>
        </div>
      </figure>
      <p className="sm-legend">
        <span><i className="sm-key-dot sm-key-home" />Anfield</span>
        <span><i className="sm-key-dot sm-key-key" />Key game</span>
        <span><i className="sm-key-dot" />Game played</span>
        <span><i className="sm-key-dot sm-key-ahead" />Still to come</span>
      </p>
    </div>

    <div className="sm-panel">
      <div className="sm-stepper">
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0}>← Previous</button>
        <p aria-live="polite">Game {game.number} of {games.length}</p>
        <button type="button" onClick={() => go(index + 1)} disabled={index === last}>Next →</button>
      </div>
      <input
        className="sm-range" type="range" min={1} max={games.length} value={index + 1}
        onChange={event => go(Number(event.target.value) - 1)}
        aria-label="Move through the season" aria-valuetext={`Game ${game.number}: ${game.fixture}`}
      />
      {resumed && <p className="sm-resumed">Picked up where you left off. <button type="button" onClick={() => go(0)}>Start again</button></p>}

      {list && openStop !== null
        ? <section className="sm-stop" aria-label={`Games at ${list.label}`}>
            <div className="sm-stop-head">
              <h2>{list.label} <span>· {list.games.length} games</span></h2>
              <button type="button" onClick={() => setOpenStop(null)}>Close</button>
            </div>
            <GameList games={games} indexes={list.games} current={index} onChoose={go} />
          </section>
        : <GameCard key={game.number} game={game} writeUp={writeUps[game.number]} atStop={stop.games.length > 1 ? { label: stop.label, count: stop.games.length, open: () => setOpenStop(game.stop) } : undefined} />}

      <details className="sm-all">
        <summary>All {games.length} games</summary>
        {months.map(group => <section key={group.month}>
          <h3>{group.month}</h3>
          <GameList games={games} indexes={group.games} current={index} onChoose={go} />
        </section>)}
      </details>
    </div>
  </div>;
}

function GameList({ games, indexes, current, onChoose }: { games: MapGame[]; indexes: number[]; current: number; onChoose: (index: number) => void }) {
  return <ol className="sm-list">
    {indexes.map(i => <li key={i}>
      <button type="button" className={games[i].key ? "is-key" : undefined} aria-current={i === current ? "true" : undefined} onClick={() => onChoose(i)}>
        <span className="sm-list-date">{games[i].shortDate}</span>
        <span className="sm-list-fixture">{games[i].fixture}</span>
      </button>
    </li>)}
  </ol>;
}

function GameCard({ game, writeUp, atStop }: { game: MapGame; writeUp?: ReactNode; atStop?: { label: string; count: number; open: () => void } }) {
  return <article className={`sm-card${game.key ? " is-key" : ""}`}>
    <p className="sm-card-kicker">{game.key && <span className="sm-card-key">Key game · </span>}{game.competition}</p>
    <h2 className="sm-card-fixture">{game.fixture}</h2>
    <p className="sm-card-date">{game.date}</p>
    <dl className="sm-card-facts">
      <div><dt>Ground</dt><dd>{game.ground}</dd></div>
      {game.scorers.length > 0 && <div><dt>Scorers</dt><dd>{game.scorers.map(side => <span key={side.team} className="sm-card-side"><i>{side.team}:</i> {side.text}</span>)}</dd></div>}
      {game.attendance && <div><dt>Attendance</dt><dd>{game.attendance}</dd></div>}
      {game.leaguePosition && <div><dt>League position</dt><dd>{game.leaguePosition}</dd></div>}
    </dl>
    {writeUp && <section className="sm-writeup">
      <h3 className="sm-writeup-title">{game.writeUp?.title}</h3>
      <div className="ha-body">{writeUp}</div>
    </section>}
    {game.article && <p className="sm-card-article"><Link href={game.article.href}>{game.article.label} →</Link></p>}
    {atStop && <p className="sm-card-stop"><button type="button" onClick={atStop.open}>All {atStop.count} games at {atStop.label}</button></p>}
  </article>;
}
