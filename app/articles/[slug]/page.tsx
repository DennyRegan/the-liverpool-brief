import { analysisConnections } from '@/lib/content/analysis';
import { socialMetadata } from '@/lib/social-metadata';
import { getMatchCentre } from '@/lib/content/match-centre';
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getArticle, getArticles } from "@/lib/content/articles";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ShareButton } from "@/app/components/ShareButton";
import { formatLongDate, getArticleExcerpt, getSourceLink } from "@/lib/format";

export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let article;
  try {
    article = getArticle(slug);
  } catch {
    return {};
  }

  const description = getArticleExcerpt(article);

  return socialMetadata(article.title, description, `/articles/${article.slug}`);
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let article;
  try {
    article = getArticle(slug);
  } catch {
    notFound();
  }
  const connections = analysisConnections(article);
  const currentSeason = getMatchCentre().season;
  return (
    <div className="min-h-screen">
      <SiteHeader active="articles" />
      <main id="main-content" className="reading-page">
        <div className="flex items-center justify-between mb-8">
          <Link href="/articles" className="text-sm font-medium text-accent hover:text-accent-dark">
            ‹ Articles
          </Link>
          <ShareButton title={article.title} />
        </div>

        <h1 className="article-title">{article.title}</h1>
        <p className="text-sm text-gray-500 mb-8">
          By Denny Regan · {formatLongDate(article.date)} · <span className="text-accent">{article.category}</span>
        </p>

        <div className="article-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body}</ReactMarkdown>
        </div>

        {article.whatMatters && article.whatMatters.length > 0 && (
          <div className="bg-gray-50 border-l-4 border-accent p-5 mt-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">What matters</p>
            <ul className="space-y-2">
              {article.whatMatters.map((point, idx) => (
                <li key={idx} className="text-gray-700 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-accent">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {article.sources && article.sources.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200 text-sm text-gray-600">
            <h2 className="font-semibold text-gray-700 mb-3">Sources</h2>
            <ol className="list-decimal pl-5 space-y-2">
              {article.sources.map((source, index) => {
                const link = getSourceLink(source);
                return <li key={`${source}-${index}`} className="break-words">
                  {link ? <a href={link.href} target="_blank" rel="noopener noreferrer"
                    className="text-accent underline" aria-label={`Source ${index + 1}: ${link.label} (opens in a new tab)`}>
                    {link.label} ↗
                  </a> : source}
                </li>;
              })}
            </ol>
          </div>
        )}
        {article.season === currentSeason && <p className="article-context"><Link href="/match-centre">Follow {currentSeason.replace("-", "–")} in Match Centre →</Link></p>}
        {connections.length > 0 && <nav className="article-context" aria-label="Connected reading"><h2>Explore the context</h2><ul role="list">{connections.map(link => <li key={link.href}><Link href={link.href}>{link.label} →</Link></li>)}</ul></nav>}
        <aside className="read-next"><p className="eyebrow">Keep reading</p>{getArticles().filter(item => item.slug !== article.slug).slice(0, 2).map(item => <Link key={item.slug} href={`/articles/${item.slug}`}>{item.title} <span aria-hidden="true">↗</span></Link>)}</aside>
      </main>
    </div>
  );
}
