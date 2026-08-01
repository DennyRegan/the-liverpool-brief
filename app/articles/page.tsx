import Link from "next/link";
import { getArticles } from "@/lib/content/articles";
import { SiteHeader } from "@/app/components/SiteHeader";

export default function ArticlesPage() {
  const articles = getArticles();

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader active="articles" />
      <main className="max-w-2xl mx-auto px-4 py-12">
        {articles.length > 0 ? (
          <ul className="space-y-8">
            {articles.map((article) => (
              <li key={article.slug} className="border-b border-gray-200 pb-8">
                <Link href={`/articles/${article.slug}`}>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 hover:underline">
                    {article.title}
                  </h2>
                </Link>
                <p className="text-sm text-gray-500">
                  {new Date(article.date).toLocaleDateString("en-GB", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
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
