import Link from "next/link";
import { getArticles } from "@/lib/content/articles";
import { SiteHeader } from "@/app/components/SiteHeader";
import { formatListDate, getExcerpt } from "@/lib/format";

export default function ArticlesPage() {
  const articles = getArticles();

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader active="articles" />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Articles</h1>
        <p className="text-gray-500 mb-10">Opinion and analysis from The Liverpool Brief.</p>

        {articles.length > 0 ? (
          <ul>
            {articles.map((article, index) => (
              <li key={article.slug} className={index > 0 ? "pt-6 mt-6 border-t border-gray-200" : ""}>
                <Link href={`/articles/${article.slug}`} className="group flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                      <span className="text-accent">{article.category}</span> · {formatListDate(article.date)}
                    </p>
                    <h2 className="font-serif text-xl font-bold text-gray-900 mb-2 group-hover:underline">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">{getExcerpt(article.body, 120)}</p>
                  </div>
                  <span className="text-accent text-xl leading-none shrink-0 pt-1" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No articles yet.</p>
        )}
      </main>
    </div>
  );
}
