import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getArticle, getArticles } from "@/lib/content/articles";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ShareButton } from "@/app/components/ShareButton";
import { formatLongDate, getExcerpt } from "@/lib/format";

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

  const description = getExcerpt(article.body);

  return {
    title: article.title,
    description,
    openGraph: {
      title: article.title,
      description,
    },
  };
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
  return (
    <div className="min-h-screen">
      <SiteHeader active="articles" />
      <main id="main-content" className="reading-page">
        <div className="flex items-center justify-between mb-8">
          <Link href="/articles" className="text-sm font-medium text-accent hover:text-accent-dark">
            ‹ Back
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
            <span className="font-semibold text-gray-700">Sources: </span>
            {article.sources.join(" · ")}
          </div>
        )}
        <aside className="read-next"><p className="eyebrow">Keep reading</p>{getArticles().filter(item => item.slug !== article.slug).slice(0, 2).map(item => <Link key={item.slug} href={`/articles/${item.slug}`}>{item.title} <span aria-hidden="true">↗</span></Link>)}</aside>
      </main>
    </div>
  );
}
