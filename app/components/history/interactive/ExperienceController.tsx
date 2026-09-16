"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { ExperienceControls } from "@/lib/interactive-history/models";

type ControllerValue = {
  model: ExperienceControls; selected: string | null; cursor: number; announcement: string;
  navigate: (id: string, options?: { move?: boolean; focus?: boolean; history?: "push" | "replace" | "none"; announce?: string; exposeOutcome?: boolean }) => void;
};
const ControllerContext = createContext<ControllerValue | null>(null);
function useExperience() {
  const context = useContext(ControllerContext);
  if (!context) throw new Error("Experience controls need ExperienceController");
  return context;
}

export function ExperienceController({ model, children }: { model: ExperienceControls; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [cursor, setCursor] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const current = useRef<string | null>(null);
  const penaltyCursor = useRef(0);
  const suppressScroll = useRef(true);
  const sourceReturn = useRef<string | null>(null);
  const browsingEvidence = useRef(false);
  const start = model.moments.find(m => m.state.shootout && m.state.shootout.taken.subject + m.state.shootout.taken.opposition === 0);
  const outcome = model.moments.find(m => m.state.outcome !== null);
  const startId = start?.id;
  const outcomeId = outcome?.id;

  const position = useCallback((id: string, focus = false) => {
    const target = document.getElementById(id);
    if (!target) return;
    for (let parent = target.parentElement; parent; parent = parent.parentElement) {
      if (parent instanceof HTMLDetailsElement) parent.open = true;
    }
    const offset = parseFloat(root.current?.style.getPropertyValue("--ih-bar-height") || "80");
    const heading = target.matches("h1,h2,h3") ? target : target.querySelector<HTMLElement>("h1,h2,h3");
    window.scrollTo({ top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset - 20), behavior: "instant" });
    if (focus) (heading ?? target).focus({ preventScroll: true });
  }, []);

  const navigate = useCallback((id: string, options: { move?: boolean; focus?: boolean; history?: "push" | "replace" | "none"; announce?: string; exposeOutcome?: boolean } = {}) => {
    const attemptIndex = model.attempts.findIndex(a => a.id === id);
    const moment = model.moments.find(m => m.id === id);
    if (!moment && attemptIndex < 0) return;
    browsingEvidence.current = false;
    suppressScroll.current = true;
    let nextCursor = penaltyCursor.current;
    if (id === startId) nextCursor = 0;
    if (attemptIndex >= 0) nextCursor = attemptIndex + 1;
    if (id === outcomeId) nextCursor = model.attempts.length;
    penaltyCursor.current = nextCursor;
    setCursor(nextCursor);
    const outcomeDisclosure = root.current?.querySelector<HTMLDetailsElement>("[data-outcome-disclosure]");
    if (outcomeDisclosure) {
      if (options.exposeOutcome !== false && (id === outcomeId || (attemptIndex >= 0 && nextCursor === model.attempts.length))) outcomeDisclosure.open = true;
      else if (nextCursor < model.attempts.length || (moment && id !== startId)) outcomeDisclosure.open = false;
    }
    current.current = id;
    setSelected(id);
    setAnnouncement(options.announce ?? "");
    const historyMode = options.history ?? "push";
    if (historyMode !== "none" && window.location.hash !== `#${id}`) {
      window.history[historyMode === "push" ? "pushState" : "replaceState"](window.history.state, "", `#${id}`);
    }
    if (options.move !== false) {
      root.current?.querySelectorAll<HTMLDetailsElement>("[data-moment-index]").forEach(index => { index.open = false; });
      // The principal target stays visible while the subordinate landmarks share its position.
      position(attemptIndex >= 0 && startId ? startId : id, options.focus);
      if (root.current) root.current.dataset.inNarrative = "true";
    }
    requestAnimationFrame(() => requestAnimationFrame(() => { suppressScroll.current = false; }));
  }, [model, startId, outcomeId, position]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let frame = 0;
    let restoration = 0;
    let previousY = window.scrollY;
    const bar = element.querySelector<HTMLElement>("[data-state-bar]");
    const resize = new ResizeObserver(() => {
      const height = bar?.getBoundingClientRect().height ?? 80;
      const sticky = window.innerHeight >= 500 && height < window.innerHeight / 4;
      element.style.setProperty("--ih-bar-height", `${sticky ? height : 0}px`);
      element.dataset.sticky = String(sticky);
    });
    if (bar) resize.observe(bar);
    const restore = () => {
      suppressScroll.current = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(restoration);
      restoration = requestAnimationFrame(() => {
        let id = "";
        try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { /* Malformed fragment uses the introduction. */ }
        if (model.moments.some(m => m.id === id) || model.attempts.some(a => a.id === id)) {
          const focused = document.activeElement as HTMLElement | null;
          navigate(id, { history: "none", focus: false });
          const bounds = focused?.getBoundingClientRect();
          if (focused && focused !== document.body && (!focused.checkVisibility() || (bounds && (bounds.bottom <= 0 || bounds.top >= window.innerHeight)))) position(model.attempts.some(a => a.id === id) && startId ? startId : id, true);
        } else if (id.startsWith("source-") && model.sourceIds.includes(id.slice(7))) {
          browsingEvidence.current = true;
          current.current ??= model.moments[0].id;
          setSelected(current.current);
          sourceReturn.current = current.current;
          position(id);
          element.dataset.inNarrative = "false";
          suppressScroll.current = true;
        } else {
          browsingEvidence.current = false;
          current.current = model.moments[0].id;
          setSelected(current.current);
          if (id) {
            window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
            document.getElementById("experience-introduction")?.scrollIntoView();
          }
          suppressScroll.current = false;
        }
        previousY = window.scrollY;
      });
    };
    const scroll = () => {
      const y = window.scrollY;
      if (y === previousY) return;
      previousY = y;
      if (suppressScroll.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (browsingEvidence.current) { element.dataset.inNarrative = "false"; return; }
        const narrative = element.querySelector<HTMLElement>("[data-narrative]");
        const threshold = parseFloat(element.style.getPropertyValue("--ih-bar-height") || "80") + 24;
        if (!narrative) return;
        const rect = narrative.getBoundingClientRect();
        element.dataset.inNarrative = String(rect.top <= threshold && rect.bottom > threshold);
        let next = model.moments[0].id;
        for (const heading of element.querySelectorAll<HTMLElement>("[data-moment-id]")) {
          const id = heading.dataset.momentId!;
          if (id === outcomeId && (penaltyCursor.current < model.attempts.length || !heading.checkVisibility())) continue;
          if (heading.getBoundingClientRect().top <= threshold) next = id;
        }
        if (next === startId && penaltyCursor.current > 0) next = model.attempts[penaltyCursor.current - 1].id;
        if (next !== current.current) {
          current.current = next;
          setSelected(next);
          window.history.replaceState(window.history.state, "", `#${next}`);
        }
      });
    };
    const resume = () => { browsingEvidence.current = false; suppressScroll.current = false; };
    const keyScroll = (event: KeyboardEvent) => {
      if (["PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End", " "].includes(event.key) && !(event.target instanceof HTMLButtonElement) && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLElement && event.target.closest("summary"))) resume();
    };
    const toggle = (event: Event) => {
      const details = event.target;
      if (!(details instanceof HTMLDetailsElement)) return;
      suppressScroll.current = true;
      if (details.matches("[data-outcome-disclosure]") && !details.open && current.current === outcomeId && model.attempts.length) {
        const last = model.attempts.at(-1)!;
        navigate(last.id, { history: "replace", move: false, exposeOutcome: false });
      }
      requestAnimationFrame(() => requestAnimationFrame(() => { previousY = window.scrollY; suppressScroll.current = false; }));
    };
    restore();
    window.addEventListener("popstate", restore);
    window.addEventListener("hashchange", restore);
    window.addEventListener("pageshow", restore);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("wheel", resume, { passive: true });
    window.addEventListener("touchmove", resume, { passive: true });
    window.addEventListener("keydown", keyScroll);
    element.addEventListener("toggle", toggle, true);
    return () => {
      resize.disconnect(); cancelAnimationFrame(frame); cancelAnimationFrame(restoration);
      window.removeEventListener("popstate", restore); window.removeEventListener("hashchange", restore); window.removeEventListener("pageshow", restore);
      window.removeEventListener("scroll", scroll); window.removeEventListener("wheel", resume); window.removeEventListener("touchmove", resume); window.removeEventListener("keydown", keyScroll);
      element.removeEventListener("toggle", toggle, true);
    };
  }, [model, navigate, position, startId, outcomeId]);

  return <ControllerContext.Provider value={{ model, selected, cursor, announcement, navigate }}>
    <div ref={root} className="ih-experience" data-enhanced={selected !== null} onClick={event => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href^='#']");
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const id = link.getAttribute("href")!.slice(1);
      if (id === "moment-index") {
        event.preventDefault(); suppressScroll.current = true;
        const index = document.getElementById(id) as HTMLDetailsElement | null;
        if (index) { index.open = true; position(id); if (event.detail === 0) index.querySelector("summary")?.focus({ preventScroll: true }); }
      } else if (link.hasAttribute("data-return-to-moment")) {
        event.preventDefault();
        navigate(sourceReturn.current ?? current.current ?? model.moments[0].id, { history: "none", focus: true });
      } else if (model.moments.some(m => m.id === id) || model.attempts.some(a => a.id === id)) {
        event.preventDefault(); navigate(id, { focus: event.detail === 0 });
      } else if (id.startsWith("source-") && model.sourceIds.includes(id.slice(7))) {
        event.preventDefault(); sourceReturn.current = current.current;
        browsingEvidence.current = true;
        suppressScroll.current = true; position(id, true);
        root.current!.dataset.inNarrative = "false";
      }
    }}>{children}</div>
  </ControllerContext.Provider>;
}

export function MatchStateBar() {
  const { model, selected } = useExperience();
  const [copyStatus, setCopyStatus] = useState<{ message: string; moment: string | null } | null>(null);
  const state = model.attempts.find(a => a.id === selected)?.state ?? model.moments.find(m => m.id === selected)?.state;
  return <div className="ih-state-bar" data-state-bar aria-label="Current historical state">
    <div className="ih-state-reading">
      <span className="ih-state-time">{state?.timeLabel ?? "Explore the match"}</span>
      {state && <span className="ih-state-score"><span>{model.teams.subject}</span> <strong>{state.score.subject}–{state.score.opposition}</strong> <span>{model.teams.opposition}</span>{state.shootout && <small>Penalties {state.shootout.score.subject}–{state.shootout.score.opposition}</small>}</span>}
    </div>
    <div className="ih-state-actions"><a href="#moment-index" onClick={() => { const index = document.getElementById("moment-index") as HTMLDetailsElement | null; if (index) index.open = true; }}>Moments</a><button type="button" onClick={async () => {
      const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${selected ?? model.moments[0].id}`;
      try { await navigator.clipboard.writeText(url); setCopyStatus({ message: "Moment link copied", moment: selected }); } catch { setCopyStatus({ message: url, moment: selected }); }
    }}>Copy link<span className="ih-sr-only"> to this moment</span></button></div>
    {copyStatus && copyStatus.moment === selected && <div className="ih-copy-status"><span role="status">{copyStatus.message}</span><button type="button" aria-label="Dismiss link message" onClick={() => setCopyStatus(null)}>Close</button></div>}
  </div>;
}

export function ShootoutSequence() {
  const { model, cursor, selected, announcement, navigate } = useExperience();
  const start = model.moments.find(m => m.state.shootout && m.state.shootout.taken.subject + m.state.shootout.taken.opposition === 0);
  if (!start) return null;
  const state = cursor ? model.attempts[cursor - 1].state : start.state;
  const penalties = state.shootout!;
  const nextSide = penalties.nextSide;
  const nextLabel = nextSide ? `Reveal ${model.teams[nextSide]}’s ${ordinal(penalties.taken[nextSide] + 1)} penalty` : "Shoot-out complete";
  const scoreText = `${model.teams.subject} ${penalties.score.subject}, ${model.teams.opposition} ${penalties.score.opposition}`;
  return <div className="ih-shootout-enhancement" hidden={selected === null}>
    <div className="ih-penalty-score"><span>Penalty score</span><strong>{penalties.score.subject}–{penalties.score.opposition}</strong><span>{model.teams.subject} · {model.teams.opposition}</span></div>
    <p className="ih-caption">Match score {state.score.subject}–{state.score.opposition} after extra time. {cursor} {cursor === 1 ? "attempt" : "attempts"} revealed.</p>
    <div className="ih-penalty-controls">
      <button type="button" className="ih-primary" aria-disabled={penalties.complete} onClick={() => {
        if (penalties.complete) return;
        const attempt = model.attempts[cursor];
        const p = attempt.state.shootout!;
        navigate(attempt.id, { move: false, announce: `${attempt.taker}: ${attempt.result}. Penalties: ${model.teams.subject} ${p.score.subject}, ${model.teams.opposition} ${p.score.opposition}.${p.complete ? ` Shoot-out complete. ${model.teams[p.winner!]} win.` : ""}` });
      }}>{nextLabel}</button>
      <div className="ih-penalty-secondary"><button type="button" aria-disabled={cursor === 0} onClick={() => {
        if (!cursor) return;
        const previous = cursor === 1 ? start : model.attempts[cursor - 2];
        const p = previous.state.shootout!;
        navigate(previous.id, { move: false, announce: `${cursor - 1} attempts shown. Penalties: ${model.teams.subject} ${p.score.subject}, ${model.teams.opposition} ${p.score.opposition}.` });
      }}>Previous attempt</button><button type="button" aria-disabled={cursor === 0} onClick={() => {
        if (cursor) navigate(start.id, { move: false, announce: "Shoot-out restarted. No attempts shown. Penalty score 0–0." });
      }}>Start shoot-out again</button></div>
    </div>
    <p className="ih-sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
    {cursor === 0 ? <p className="ih-shootout-empty">The match is level. Reveal the first attempt when you are ready.</p> : <ol className="ih-attempts" aria-label="Revealed penalties">{model.attempts.slice(0, cursor).map((attempt, i) => <li key={attempt.id} id={`revealed-${attempt.id}`}><span className="ih-attempt-number">{i + 1}</span><div><a href={`#${attempt.id}`}>{attempt.taker}</a><small>{model.teams[attempt.side]} · {attempt.result}</small></div><strong aria-label={`Penalty score ${attempt.state.shootout!.score.subject} to ${attempt.state.shootout!.score.opposition}`}>{attempt.state.shootout!.score.subject}–{attempt.state.shootout!.score.opposition}</strong></li>)}</ol>}
    {penalties.complete && <p className="ih-completion">{model.teams[penalties.winner!]} win the shoot-out. {scoreText}.</p>}
  </div>;
}
function ordinal(n: number) { return ["", "first", "second", "third", "fourth", "fifth"][n] ?? `${n}th`; }
