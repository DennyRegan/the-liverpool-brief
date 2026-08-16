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
    <div className="min-h-screen bg-white">
      <SiteHeader active="articles" />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <Link href="/articles" className="text-sm font-medium text-accent hover:text-accent-dark">
            ‹ Back
          </Link>
          <ShareButton title={article.title} />
        </div>

        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">{article.title}</h1>
        <p className="text-sm text-gray-500 mb-8">
          {formatLongDate(article.date)} · <span className="text-accent">{article.category}</span>
        </p>

        <div className="text-gray-700 leading-relaxed [&>p]:mb-4 [&_a]:text-accent [&_a]:underline [&_strong]:font-semibold [&_table]:w-full [&_table]:mb-4 [&_table]:border-collapse [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2">
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
      </main>
    </div>
  );
}
