"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { getHistoryWindow } from "@/lib/content/this-week";
import { HistoryEventCard } from "./HistoryEventCard";
import { HistoryArtwork } from "./HistoryArtwork";

type Days = ReturnType<typeof getHistoryWindow>;

export function HistoryWeek({ days }: { days: Days }) {
  // The same ordered events power the overview and viewer. Empty dates never
  // become blank slides, and multiple events on a day remain independently openable.
  const entries = days.flatMap(day => day.events.map(event => ({ event, dateLabel: day.label })));
  const [selected, setSelected] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const touchRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isOpen = selected !== null;
  const current = selected === null ? null : entries[selected];

  function open(index: number, button: HTMLButtonElement) {
    triggerRef.current = button;
    // Back on a phone closes the viewer rather than leaving This Week.
    window.history.pushState({ ...window.history.state, liverpoolWeekViewer: true }, "");
    setSelected(index);
  }

  function close() {
    if (window.history.state?.liverpoolWeekViewer) window.history.back();
    else setSelected(null);
  }

  function move(direction: number) {
    setSelected(index => index === null ? null : Math.max(0, Math.min(entries.length - 1, index + direction)));
    scrollRef.current?.scrollTo({ top: 0 });
  }

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow };
    body.style.setProperty("position", "fixed");
    body.style.setProperty("top", `-${scrollY}px`);
    body.style.setProperty("width", "100%");
    body.style.setProperty("overflow", "hidden");
    dialog.showModal();
    const onBack = () => setSelected(null);
    window.addEventListener("popstate", onBack);
    return () => {
      window.removeEventListener("popstate", onBack);
      dialog.close();
      for (const [property, value] of Object.entries(previous)) body.style.setProperty(property, value);
      window.scrollTo(0, scrollY);
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  return <>
    <p className="week-instruction">A different chapter each day. Tap a card to open.</p>
    <div className="week-grid">
      {days.map(day => <section key={day.iso} aria-labelledby={`day-${day.iso}`}
        className={`week-day ${day.events.length ? "" : "week-day-empty"}`}>
        <h2 id={`day-${day.iso}`} className="week-day-heading">
          <time dateTime={day.iso}>{day.label}</time><span>{day.weekday}</span>
        </h2>
        {day.events.length ? day.events.map(event => <HistoryEventCard key={event.slug} event={event} dateLabel={day.label}
          onOpen={button => open(entries.findIndex(entry => entry.event.slug === event.slug), button)} />)
          : <p className="history-empty">No event selected.</p>}
      </section>)}
    </div>

    <dialog id="week-viewer" ref={dialogRef} className="week-viewer" aria-labelledby="viewer-title"
      aria-describedby="viewer-summary" onCancel={event => { event.preventDefault(); close(); }}
      onClick={event => { if (event.target === event.currentTarget) close(); }}
      onKeyDown={event => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
      }}>
      {current && <div className="week-viewer-shell">
        <header className="week-viewer-toolbar">
          <span>This Week <span aria-hidden="true">/</span> <span aria-live="polite" aria-atomic="true">{(selected ?? 0) + 1} of {entries.length}</span></span>
          <button type="button" onClick={close} className="week-close" autoFocus aria-label="Close story">Close <span aria-hidden="true">×</span></button>
        </header>
        <div ref={scrollRef} className="week-viewer-scroll"
          onTouchStart={event => {
            if (event.touches.length !== 1) { touchRef.current = null; return; }
            const target = event.target as HTMLElement;
            if (target.closest("button, a")) return;
            touchRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY, time: Date.now() };
          }}
          onTouchCancel={() => { touchRef.current = null; }}
          onTouchEnd={event => {
            const start = touchRef.current;
            touchRef.current = null;
            if (!start || !event.changedTouches[0] || event.touches.length) return;
            const dx = event.changedTouches[0].clientX - start.x;
            const dy = event.changedTouches[0].clientY - start.y;
            if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.6 && Date.now() - start.time < 700) move(dx < 0 ? 1 : -1);
          }}>
          <article className={`week-expanded ${current.event.image ? "" : "week-expanded-text"}`}>
            {current.event.image && <div className="week-expanded-art"><HistoryArtwork image={current.event.image} /></div>}
            <div className="week-expanded-copy">
              <p className="week-eyebrow">On this day <span aria-hidden="true" /></p>
              <p className="week-expanded-date">{current.dateLabel} <span>{current.event.year}</span></p>
              <h2 id="viewer-title">{current.event.title}</h2>
              <p id="viewer-summary">{current.event.summary}</p>
              {current.event.image?.kind === "illustration" && <p className="week-expanded-caption">Illustration inspired by the event.</p>}
              <div className="week-expanded-links">
                {current.event.archiveSlug && <Link className="week-full-story" href={`/archive/${current.event.archiveSlug}`} onClick={() => setSelected(null)}>Read the full story →</Link>}
                <a href={current.event.source} target="_blank" rel="noopener noreferrer">Source ↗</a>
              </div>
            </div>
          </article>
        </div>
        <nav className="week-viewer-controls" aria-label="History stories">
          <button type="button" onClick={() => move(-1)} disabled={selected === 0} aria-label="Previous story">← <span>Previous</span></button>
          <span className="week-swipe-hint">Swipe to explore</span>
          <button type="button" onClick={() => move(1)} disabled={selected === entries.length - 1} aria-label="Next story"><span>Next</span> →</button>
        </nav>
      </div>}
    </dialog>
  </>;
}
