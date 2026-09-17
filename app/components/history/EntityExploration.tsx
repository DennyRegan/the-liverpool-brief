import { ContinueFromHere } from "./V3Exploration";
import { AnalysisReading } from '@/app/components/AnalysisReading';
import Link from 'next/link';
import { SiteHeader } from '@/app/components/SiteHeader';
import { HistoryNav } from './HistoryNav';
import { getExplorationContext, groupExplorationArticles, personSections, personEras, explorationSeasons, type Exploration, type ExplorationKind } from '@/lib/content/exploration';
import { eraYears } from '@/lib/content/history';
import type { ArchiveFeature } from '@/lib/content/types';

export function EntityIndex({ kind }: { kind: ExplorationKind }) {
  const { destinations } = getExplorationContext();
  const title = kind === 'opposition' ? 'Opposition' : 'Competitions';
  return <><SiteHeader active="history" /><main id="main-content" className="site-width hx-page">
    <HistoryNav /><header className="hx-intro"><p className="eyebrow">Explore Liverpool history</p><h1>{title}</h1>
    <p className="hx-standfirst">{kind === 'opposition' ? 'Familiar opponents, different seasons. Follow Liverpool’s story through the teams they faced.' : 'League campaigns and cup runs, told through the original writing.'}</p></header>
    <EntityDirectory destinations={destinations.filter(d => d.entity.kind === kind)} />
  </main></>;
}

export function EntityDirectory({ destinations }: { destinations: Exploration[] }) {
  return <ul className="entity-directory" role="list">{destinations.map(d => <li key={d.entity.id}>
    <Link href={d.href} prefetch={false}><span>{d.entity.label}</span><small>{d.articles.length} articles <span aria-hidden="true">→</span></small></Link>
  </li>)}</ul>;
}

function ArticleGroups({ articles, available, prefix }: { articles: ArchiveFeature[]; available: Set<string>; prefix: string }) {
  return <div className="entity-groups">{groupExplorationArticles(articles).map((group, index) => <details className="entity-group" key={group.id} open={articles.length <= 12 || index === 0}>
    <summary><h3>{group.label}</h3><span>{group.articles.length} {group.articles.length === 1 ? 'article' : 'articles'} <span aria-hidden="true">↓</span></span></summary>
    {group.season && available.has(group.season) && <Link className="entity-season-link" href={`/history/seasons/${group.season}`}>Explore {group.label} <span aria-hidden="true">→</span></Link>}
    <ul className="hx-reading-list" role="list" aria-label={`${prefix}: ${group.label}`}>{group.articles.map(a => <li key={a.slug}><article>
      <p className="hx-period">{a.historicalPeriod}</p><h4><Link href={`/archive/${a.slug}`} prefetch={false}>{a.title} <span aria-hidden="true">↗</span></Link></h4><p>{a.excerpt}</p>
    </article></li>)}</ul>
  </details>)}</div>;
}

export function EntityExploration({ destination }: { destination: Exploration }) {
  const { seasons, eras } = getExplorationContext();
  const { entity, articles } = destination;
  const person = entity.kind === 'person';
  const relevantSeasons = explorationSeasons(destination, seasons);
  const tenures = personEras(entity, eras);
  const sections = person ? personSections(destination) : [{ id: 'writing', label: 'Through the seasons', articles }];
  const available = new Set(seasons.map(s => s.season));
  return <><SiteHeader active="history" /><main id="main-content" className="site-width hx-page entity-page">
    <HistoryNav active={person ? 'players' : undefined} />
    <Link className="hx-back" href={person ? '/history/players' : `/history/${entity.kind === 'opposition' ? 'opposition' : 'competitions'}`}>← {person ? 'All people' : entity.kind === 'opposition' ? 'All opposition' : 'All competitions'}</Link>
    <header className="hx-intro"><p className="eyebrow">Liverpool history · {person ? 'People' : entity.kind === 'opposition' ? 'Opposition' : 'Competition'}</p>
      <h1>{entity.label}</h1><p className="hx-standfirst">{person ? `Explore ${entity.label} through the original writing.` : entity.kind === 'opposition' ? `Liverpool against ${entity.label}, across the years.` : `Liverpool in the ${entity.label}, through match reports and historical features.`}</p>
    </header>
    {sections.length > 1 && <nav className="season-jump" aria-label="On this page">{sections.map(s => <a key={s.id} href={`#${s.id}`}>{s.label}</a>)}</nav>}
    {sections.map(s => <section className="entity-section" key={s.id} aria-labelledby={s.id}><h2 id={s.id}>{s.label}</h2><ArticleGroups articles={s.articles} available={available} prefix={s.label} /></section>)}
      <AnalysisReading context={{ entityId: entity.id }} />
    {relevantSeasons.length > 0 && <details className="entity-context"><summary>Explore the seasons <span aria-hidden="true">↓</span></summary><ul role="list">{relevantSeasons.map(s => <li key={s.season}><Link href={`/history/seasons/${s.season}`}>{s.season.replace('-', '–')}</Link></li>)}</ul></details>}
    {tenures.length > 0 && <section className="entity-section" aria-labelledby="manager-eras"><h2 id="manager-eras">Managerial eras</h2><ul className="entity-era-links" role="list">{tenures.map(e => <li key={e.id}><Link href={`/history/${e.id}`}>{e.manager} · {eraYears(e)} <span aria-hidden="true">→</span></Link></li>)}</ul></section>}
    <ContinueFromHere context={{ entityId: entity.id }} />
  </main></>;
}
