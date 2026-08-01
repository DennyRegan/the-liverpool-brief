import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getArticle, getArticles } from "@/lib/content/articles";
import { SiteHeader } from "@/app/components/SiteHeader";

export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }));
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{article.title}</h1>
        <p className="text-sm text-gray-500 mb-8">
          {new Date(article.date).toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="text-gray-700 leading-relaxed [&>p]:mb-4 [&_a]:text-accent [&_a]:underline [&_strong]:font-semibold [&_table]:w-full [&_table]:mb-4 [&_table]:border-collapse [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body}</ReactMarkdown>
        </div>
      </main>
    </div>
  );
}
