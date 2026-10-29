import Link from 'next/link';
import { formatLongDate } from '@/lib/format';
import { matchFixture, type CollectionMatch, type MatchReview } from '@/lib/content/match-collection';
export function ReviewSummary({ review }: { review: MatchReview }) {
  return <details className="hl-details hl-review-notes"><summary>Editorial review and sources</summary>
    <p><strong>{review.assessment.outcome === 'ready-for-approval' ? 'Ready for your editorial approval' : review.status === 'published' ? 'Already published' : 'Verification or editorial review required'}</strong>. {review.assessment.scope}</p>
    <ul>{review.assessment.findings.map((finding, i) => <li key={i}>{finding}</li>)}</ul>
    {!!review.assessment.coreRecords?.length && <><h3>Retrieved match evidence</h3><ul>{review.assessment.coreRecords.map(record => <li key={record.url}><a href={record.url}>{record.name} · {record.date} ↗</a></li>)}</ul></>}
    {!!review.assessment.sourceAccessIssues?.length && <><h3>Sources needing attention</h3><ul>{review.assessment.sourceAccessIssues.map(source => <li key={source.url}><a href={source.url}>{source.url}</a> — {source.status ? `HTTP ${source.status}` : 'not retrieved'}{source.error ? ' · Retrieval incomplete' : ''}</li>)}</ul></>}
    {review.metadataIssues.length > 0 && <><h3>Metadata to review</h3><ul>{review.metadataIssues.map(issue => <li key={issue}>{issue}</li>)}</ul></>}
    <p>{review.sourceUrls.length} source links recorded across {review.sourceDomains.length} domains. A recorded link is not proof that its claims have been checked.</p>
    <p><a href={`https://github.com/DennyRegan/the-liverpool-brief/blob/${review.sourceRef}/${review.sourcePath}`}>Preserved manuscript and provenance ↗</a></p>
  </details>;
}
export function MatchReadingList({ matches, entities = [], showFixture = false }: { matches: CollectionMatch[]; entities?: { id: string; label: string }[]; showFixture?: boolean }) {
  const labels = new Map(entities.map(e => [e.id, e.label]));
  if (!matches.length) return <p className="hl-empty">No reports match this selection.</p>;
  return <ol className={`hl-reading${showFixture ? ' hl-match-stories' : ''}`}>{matches.map(match => <li key={match.slug} id={`article-${match.slug}`}>
    <div className="hl-reading-date">{match.historicalEventDate ? <time dateTime={match.historicalEventDate}>{formatLongDate(match.historicalEventDate)}</time> : match.historicalPeriod}
      <span className="hl-status">{match.publication === 'published' ? 'Published report' : match.publication === 'withdrawn' ? 'Withdrawn · Approval required' : 'Draft · Not approved'}</span>
    </div><article>{showFixture && <><p className="hl-match-context">{[match.season?.replace('-', '–'), ...(match.competitionIds ?? []).map(id => labels.get(id))].filter(Boolean).join(' · ')}</p>{matchFixture(match, labels) && <p className="hl-match-fixture">{matchFixture(match, labels)}</p>}</>}<h3><Link href={match.href}>{match.title}</Link></h3><p>{match.excerpt}</p><Link className="hl-text-link" href={match.href}>{match.publication === 'published' ? 'Read the report' : 'Review the report'} →</Link>
      {match.review && <ReviewSummary review={match.review} />}</article>
  </li>)}</ol>;
}
export function CollectionPagination({ page, pages, base, params = {} }: { page: number; pages: number; base: string; params?: Record<string, string> }) {
  if (pages <= 1) return null;
  const href = (number: number) => { const query = new URLSearchParams(Object.entries(params).filter(([,value]) => value)); if (number > 1) query.set('page', String(number)); return `${base}${query.size ? `?${query}` : ''}#collection`; };
  return <nav className="hl-adjacent" aria-label="Collection pages">{page > 1 && <Link href={href(page - 1)}>← Previous page</Link>}<span>Page {page} of {pages}</span>{page < pages && <Link href={href(page + 1)}>Next page →</Link>}</nav>;
}
export function CollectionReviewNotice() {
  return <p className="hl-coverage">Local approval preview. Published reports, withdrawn reports and unpublished drafts are labelled separately. Unapproved material is excluded from the public site, latest articles, search and newsletter.</p>;
}
