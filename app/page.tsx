import { getArticles } from "@/lib/content/articles";
import { formatListDate, getExcerpt } from "@/lib/format";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ArticleCollection } from "@/app/components/ArticleCollection";

export default function Home() {
  const articles = getArticles().slice(0, 3).map(article => ({
    slug: article.slug, title: article.title, category: article.category,
    date: formatListDate(article.date), excerpt: getExcerpt(article.body, 220),
    minutes: Math.max(1, Math.ceil(article.body.split(/\s+/).length / 220)),
  }));
  return <><SiteHeader active="home" /><main id="main-content" className="site-width collection"><ArticleCollection articles={articles} home /></main></>;
}
