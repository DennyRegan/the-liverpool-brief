import Link from "next/link";
import { getWriting } from "@/lib/content/writing";
import { formatListDate, getArticleExcerpt } from "@/lib/format";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ArticleCollection } from "@/app/components/ArticleCollection";

export const metadata = { title: "Articles | The Liverpool Brief", alternates: { canonical: "/articles" } };

const TYPES = [["Opinion", "opinion"], ["Analysis", "analysis"], ["History", "history"]] as const;

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const writing = getWriting();
  // Only offer filters for categories that currently have published articles.
  const types = TYPES.filter(([label]) => writing.some(article => article.category === label));
  const selected = types.find(([, param]) => param === type)?.[0];
  const articles = writing.filter(article => !selected || article.category === selected).map(article => ({
    slug: article.slug, href: article.href, title: article.title, category: article.category,
    date: formatListDate(article.date), excerpt: getArticleExcerpt(article, 220),
    minutes: Math.max(1, Math.ceil(article.body.split(/\s+/).length / 220)),
  }));
  const links = [["All", "/articles"], ...types.map(([label, param]) => [label, `/articles?type=${param}`])];
  return <><SiteHeader active="articles" /><main id="main-content" className="site-width collection">{types.length > 1 && <nav className="writing-types" aria-label="Article types">{links.map(([label, href]) => <Link key={href} href={href} aria-current={(selected ?? "All") === label ? "page" : undefined}>{label}</Link>)}</nav>}<ArticleCollection articles={articles} /></main></>;
}
