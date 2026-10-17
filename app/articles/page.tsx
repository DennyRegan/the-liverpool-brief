import Link from "next/link";
import { getArticleCollection } from "@/lib/content/match-writing";
import { formatListDate, getArticleExcerpt } from "@/lib/format";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ArticleCollection } from "@/app/components/ArticleCollection";

export const metadata = { title: "Articles | The Liverpool Brief", alternates: { canonical: "/articles" } };
const views = [
  { label: "All", href: "/articles", type: undefined, category: undefined },
  { label: "Opinion", href: "/articles?type=opinion", type: "opinion", category: "Opinion" },
  { label: "Analysis", href: "/articles?type=analysis", type: "analysis", category: "Analysis" },
  { label: "Previews", href: "/articles?type=preview", type: "preview", category: "Preview" },
  { label: "Match reports", href: "/articles?type=match-report", type: "match-report", category: "Match report" },
];

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ type?: string | string[] }> }) {
  const { type } = await searchParams;
  const selected = views.find(view => view.type === type) ?? views[0];
  const articles = getArticleCollection().filter(article => !selected.category || article.category === selected.category).map(article => ({
    slug: article.slug, href: article.href, title: article.title, category: article.category,
    date: `${article.dateLabel ? `${article.dateLabel} ` : ''}${formatListDate(article.date)}`, byline: article.byline, matchContext: article.matchContext, excerpt: getArticleExcerpt(article, 220),
    minutes: Math.max(1, Math.ceil(article.body.split(/\s+/).length / 220)),
  }));
  return <><SiteHeader active="articles" /><main id="main-content" className="site-width collection">
    <nav className="writing-types" aria-label="Article types">{views.map(view => <Link key={view.href} href={view.href} aria-current={selected === view ? "page" : undefined}>{view.label}</Link>)}</nav>
    <ArticleCollection articles={articles} emptyMessage={selected.category ? `Published ${selected.category === "Analysis" ? "Analysis" : selected.category.toLowerCase()} articles will appear here.` : undefined} />
  </main></>;
}
