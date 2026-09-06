import { getWriting } from "@/lib/content/writing";
import { formatListDate, getArticleExcerpt } from "@/lib/format";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ArticleCollection } from "@/app/components/ArticleCollection";

export const metadata = { title: "Articles | The Liverpool Brief", alternates: { canonical: "/articles" } };

export default async function ArticlesPage({ searchParams }: {
  searchParams: Promise<{ category?: string | string[]; type?: string | string[] }>;
}) {
  const { category, type } = await searchParams;
  const archiveType = type === "match" || type === "person" ? type : "all";
  const filter = category === "archive" ? "Archive" : category === "opinion" ? "Opinion" : "All";
  const articles = getWriting().map(article => ({
    slug: article.slug, href: article.href, title: article.title, category: article.category, archiveType: article.archiveType,
    date: formatListDate(article.date), excerpt: getArticleExcerpt(article, 220),
    minutes: Math.max(1, Math.ceil(article.body.split(/\s+/).length / 220)),
  }));
  return <><SiteHeader active="articles" /><main id="main-content" className="site-width collection"><ArticleCollection articles={articles} filter={filter} archiveType={archiveType} /></main></>;
}
