"use client";

import { useState, type ReactNode } from "react";

/** Server-rendered views remain available as native disclosures if enhancement fails. */
export function StateComparison({ title, labels, views }: { title: string; labels: [string, string]; views: [ReactNode, ReactNode] }) {
  const [selected, setSelected] = useState(0);
  return <div className="ih-comparison">
    <h3>{title}</h3>
    <div className="ih-comparison-controls" role="group" aria-label={title}>{labels.map((label, index) => <button key={label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{label}</button>)}</div>
    <p className="ih-caption">Compare these two labelled moments. Your place in the match stays the same.</p>
    <div className="ih-comparison-views" data-selected={selected}>
      <div className="ih-comparison-view" data-view="0">{views[0]}</div>
      <details className="ih-comparison-view ih-alternative-view" data-view="1" open={selected === 1}><summary>{labels[1]} — alternative view</summary>{views[1]}</details>
    </div>
  </div>;
}
