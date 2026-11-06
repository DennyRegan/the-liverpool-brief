import { getWriting } from "@/lib/content/writing";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ArticleCollection } from "@/app/components/ArticleCollection";
import { ArticlesNavigation } from "@/app/components/ArticlesNavigation";

export const metadata = { title: "Articles | The Liverpool Brief", alternates: { canonical: "/articles" } };

// [category, filter label, query value]. Retained factual Archive pieces are
// stored as "History" but readers see them as Features (part of Looking Back).
const TYPES = [["Opinion", "Opinion", "opinion"], ["Analysis", "Analysis", "analysis"], ["History", "Features", "features"]] as const;
// Old shared links used ?type=history.
const ALIASES: Record<string, string> = { history: "features" };

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const writing = getWriting();
  // Only offer filters for categories that currently have published articles.
  const types = TYPES.filter(([category]) => writing.some(article => article.category === category));
  const match = types.find(([, , param]) => param === (type && (ALIASES[type] ?? type)));
  const selected = match?.[0];
  const articles = writing.filter(article => !selected || article.category === selected);
  return <><SiteHeader active="articles" /><main id="main-content" className="site-width collection">
    <h1 className="collection-title">Articles</h1>
    <ArticlesNavigation selected={match?.[1] ?? "All"} hasAnalysis={types.some(([category]) => category === "Analysis")} />
    <ArticleCollection articles={articles} />
  </main></>;
}
