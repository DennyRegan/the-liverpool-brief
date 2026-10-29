"use client";
import { useState } from 'react';
type Field = { name: string; label: string; options: { id: string; label: string }[] };
export function MatchFilters({ fields, values, activeCount }: { fields: Field[]; values: Record<string, string>; activeCount: number }) {
  const [expanded, setExpanded] = useState(false);
  return <div className={`hl-match-filter-controls${expanded ? ' is-open' : ''}`}>
    <button type="button" className="hl-filter-toggle" aria-expanded={expanded} aria-controls="match-filter-form" onClick={() => setExpanded(value => !value)}>Filter matches{activeCount ? ` (${activeCount} active)` : ''}<span aria-hidden="true">{expanded ? '−' : '+'}</span></button>
    <form id="match-filter-form" className="hl-filters hl-compact-filters" action="/history/matches#collection">
      {fields.map(field => <label key={field.name} htmlFor={`filter-${field.name}`}>{field.label}<select id={`filter-${field.name}`} name={field.name} defaultValue={values[field.name]}><option value="">All</option>{field.options.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>)}
      <button type="submit">Apply filters</button>
    </form>
    <noscript><style>{`.hl-match-filter-controls .hl-compact-filters { display:grid!important; } .hl-filter-toggle { display:none!important; }`}</style></noscript>
  </div>;
}
