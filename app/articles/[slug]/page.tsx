import { articleMetadata } from '@/lib/social-metadata';
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getArticle, getArticles } from "@/lib/content/articles";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ReganOnFootballMasthead } from "@/app/components/ReganOnFootballMasthead";
import { isReganOnFootball } from "@/lib/content/regan-on-football";
import { EditionContents } from "@/app/components/EditionContents";
import { EditionNavigation } from "@/app/components/EditionNavigation";
import { EDITION_OPENING_ID, remarkEditionHeadings } from "@/lib/edition-contents";
import { ShareButton } from "@/app/components/ShareButton";
import { ArticleMeta } from "@/app/components/ArticleMeta";
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

  return articleMetadata(article, description);
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
  const column = isReganOnFootball(article);
  return (
    <div className="min-h-screen">
      <SiteHeader active={column ? "football-observed" : "articles"} />
      <main id="main-content" className="reading-page">
        <div className="reading-tools">
          <Link href="/articles" className="back-link">
            ‹ Articles
          </Link>
          <ShareButton title={article.title} />
        </div>

        {column && <ReganOnFootballMasthead compact />}
        <h1 className="article-title">{article.title}</h1>
        <ArticleMeta {...article} author={!column} showColumn={false} />
        {article.researchCutoff && <p className="text-sm text-gray-500 mb-8">Research checked to {formatLongDate(article.researchCutoff)}.</p>}

        {column && <EditionContents body={article.body} title={article.title} />}
        <div className="article-body" id={column ? EDITION_OPENING_ID : undefined} tabIndex={column ? -1 : undefined}>
          <ReactMarkdown remarkPlugins={column ? [remarkGfm, remarkEditionHeadings] : [remarkGfm]} components={{
            img: ({ src, alt, title }) => {
              const chart = typeof src === 'string' && src.startsWith('/images/analysis/bundesliga/') && src.endsWith('.png');
              return <picture className={chart ? 'article-chart' : undefined}>
                {chart && <source media="(max-width: 600px)" srcSet={src.replace(/\.png$/, '_mobile.png')} />}
                <img src={src} alt={alt ?? ''} title={title} loading="lazy" decoding="async" />
              </picture>;
            },
          }}>{article.body}</ReactMarkdown>
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
        {column && <EditionNavigation slug={article.slug} />}
        <aside className="read-next"><p className="eyebrow">Keep reading</p>{getArticles().filter(item => item.slug !== article.slug).slice(0, 2).map(item => <Link key={item.slug} href={`/articles/${item.slug}`}>{item.title} <span aria-hidden="true">↗</span></Link>)}</aside>
      </main>
    </div>
  );
}
