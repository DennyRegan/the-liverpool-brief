import Link from 'next/link';
import { getContextAnalysis, type AnalysisContext } from '@/lib/content/analysis';
import { getArticleExcerpt } from '@/lib/format';

export function AnalysisReading({ context }: { context: AnalysisContext }) {
  const articles = getContextAnalysis(context);
  if (!articles.length) return null;
  return <section className="analysis-reading" aria-labelledby="connected-analysis"><p className="eyebrow">Evidence-led investigations</p><h2 id="connected-analysis">Analysis</h2><ul role="list">{articles.map(a => <li key={a.slug}><h3><Link href={`/articles/${a.slug}`}>{a.title} <span aria-hidden="true">↗</span></Link></h3><p>{getArticleExcerpt(a)}</p></li>)}</ul></section>;
}
