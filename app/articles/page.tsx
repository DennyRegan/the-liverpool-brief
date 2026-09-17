import Link from "next/link";
import { getWriting } from "@/lib/content/writing";
import { formatListDate, getArticleExcerpt } from "@/lib/format";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ArticleCollection } from "@/app/components/ArticleCollection";

export const metadata = { title: "Articles | The Liverpool Brief", alternates: { canonical: "/articles" } };

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const selected = type === "opinion" ? "Opinion" : type === "analysis" ? "Analysis" : undefined;
  const articles = getWriting().filter(article => !selected || article.category === selected).map(article => ({
    slug: article.slug, href: article.href, title: article.title, category: article.category,
    date: formatListDate(article.date), excerpt: getArticleExcerpt(article, 220),
    minutes: Math.max(1, Math.ceil(article.body.split(/\s+/).length / 220)),
  }));
  return <><SiteHeader active="articles" /><main id="main-content" className="site-width collection"><nav className="writing-types" aria-label="Article types">{[["All", "/articles"], ["Opinion", "/articles?type=opinion"], ["Analysis", "/articles?type=analysis"]].map(([label, href]) => <Link key={href} href={href} aria-current={(selected ?? "All") === label ? "page" : undefined}>{label}</Link>)}</nav><ArticleCollection articles={articles} emptyMessage={selected === "Analysis" ? "Evidence-led investigations will appear here when published." : undefined} /></main></>;
}
