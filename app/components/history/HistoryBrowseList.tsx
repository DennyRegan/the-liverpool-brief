"use client";

import { useState } from "react";
import Link from "next/link";

type BrowseArticle = {
  slug: string; title: string; excerpt: string; historicalPeriod: string;
  decade: string; season?: string;
};

export function HistoryBrowseList({ section, articles }: { section: "matches" | "players"; articles: BrowseArticle[] }) {
  const [decade, setDecade] = useState("");
  const [season, setSeason] = useState("");
  const matches = section === "matches";
  const decades = [...new Set(articles.map(article => article.decade))].sort().reverse();
  const inDecade = articles.filter(article => !decade || article.decade === decade);
  const seasons = [...new Set(inDecade.flatMap(article => article.season ? [article.season] : []))].sort().reverse();
  const visible = matches ? inDecade.filter(article => !season || article.season === season) : articles;

  return <>
    {matches && articles.length > 0 && <>
      <div className="hx-match-filters" role="group" aria-label="Filter historical matches">
        <label>Decade<select value={decade} onChange={event => { setDecade(event.target.value); setSeason(""); }}>
          <option value="">All decades</option>
          {decades.map(value => <option key={value} value={value}>{value}</option>)}
        </select></label>
        <label>Season<select value={season} onChange={event => setSeason(event.target.value)}>
          <option value="">All seasons</option>
          {seasons.map(value => <option key={value} value={value}>{value.replace("-", "–")}</option>)}
        </select></label>
        {(decade || season) && <button type="button" onClick={() => { setDecade(""); setSeason(""); }}>Reset filters</button>}
      </div>
      <p className="hx-quiet" role="status">{visible.length} {visible.length === 1 ? "match" : "matches"}</p>
    </>}
    {!matches && articles.length > 0 && <p className="hx-quiet">Alphabetical by first name</p>}
    {visible.length > 0 ? <ul className="hx-reading-list hx-browse-list" role="list">
      {visible.map(article => <li key={article.slug}><article>
        <p className="hx-period">{article.historicalPeriod}</p>
        <h2><Link href={`/archive/${article.slug}`} prefetch={false}>{article.title}<span aria-hidden="true"> ↗</span></Link></h2>
        <p>{article.excerpt}</p>
      </article></li>)}
    </ul> : <p className="hx-quiet">{matches
      ? (articles.length ? "No matches found. Try another filter." : "Historical match reports will appear here as they are published.")
      : "Player biographies will appear here as they are published."}</p>}
  </>;
}
