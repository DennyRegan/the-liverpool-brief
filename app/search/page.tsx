import Link from 'next/link';
import { SiteHeader } from '@/app/components/SiteHeader';
import { loadSearchIndex } from '@/lib/search/load-index';
import { normaliseSearch, searchDocuments } from '@/lib/search/search';
import { socialMetadata } from '@/lib/social-metadata';
import './search.css';

export const metadata = socialMetadata('Search | The Liverpool Brief', 'Search published Liverpool opinion, analysis and history.', '/search');

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[]; page?: string | string[] }> }) {
  const params = await searchParams;
  const query = (typeof params.q === 'string' ? params.q : '').trim().slice(0, 120);
  const results = searchDocuments(loadSearchIndex(), query);
  const pages = Math.max(1, Math.ceil(results.length / 20));
  const requested = typeof params.page === 'string' && /^\d{1,4}$/.test(params.page) ? Number(params.page) : 1;
  const page = Math.min(pages, Math.max(1, requested));
  const visible = results.slice((page - 1) * 20, page * 20);
  const pageHref = (number: number) => `/search?${new URLSearchParams({ q: query, page: String(number) })}`;
  return <><SiteHeader active="search" /><main id="main-content" className="site-width search-page">
    <header><p className="eyebrow">The Liverpool Brief</p><h1>Search</h1><p>Find opinion, analysis, matches, people and seasons.</p></header>
    <form action="/search" method="get" role="search" className="search-form">
      <label htmlFor="search-query">Search the site</label>
      <div><input id="search-query" name="q" type="search" defaultValue={query} maxLength={120} placeholder="Try Dalglish, Everton or 1986" /><button type="submit">Search</button></div>
    </form>
    {!normaliseSearch(query) ? <p className="search-note">Enter a name, team, competition, season or phrase to begin.</p>
      : results.length === 0 ? <p className="search-note">No results for “{query}”. Try a surname, a shorter term or a different season.</p>
      : <section aria-labelledby="search-results-heading">
        <h2 id="search-results-heading" className="search-count">{results.length} {results.length === 1 ? 'result' : 'results'} for “{query}”</h2>
        <ol className="search-results" start={(page - 1) * 20 + 1}>{visible.map(result => <li key={result.href}><article>
          <p className="eyebrow">{result.type} <span>· {result.context}</span></p>
          <h3><Link href={result.href} prefetch={false}>{result.title} <span aria-hidden="true">↗</span></Link></h3><p>{result.excerpt}</p>
        </article></li>)}</ol>
        {pages > 1 && <nav aria-label="Search result pages" className="search-pagination">
          {page > 1 && <Link href={pageHref(page - 1)} prefetch={false}>← Previous</Link>}<span>Page {page} of {pages}</span>{page < pages && <Link href={pageHref(page + 1)} prefetch={false}>Next →</Link>}
        </nav>}
      </section>}
  </main></>;
}
