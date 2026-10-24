import { getWriting } from "@/lib/content/writing";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ArticleCollection } from "@/app/components/ArticleCollection";
import { ArticlesNavigation } from "@/app/components/ArticlesNavigation";

export const metadata = { title: "Articles | The Liverpool Brief", alternates: { canonical: "/articles" } };

const TYPES = [["Opinion", "opinion"], ["Analysis", "analysis"], ["Team News", "team-news"], ["History", "history"]] as const;

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const writing = getWriting();
  // Team News remains discoverable before its first approved article is published.
  const types = TYPES.filter(([label]) => label === "Team News" || writing.some(article => article.category === label));
  const selected = types.find(([, param]) => param === type)?.[0];
  const articles = writing.filter(article => !selected || article.category === selected);
  return <><SiteHeader active="articles" /><main id="main-content" className="site-width collection">
    <h1 className="collection-title">Articles</h1>
    <ArticlesNavigation selected={selected ?? "All"} hasAnalysis={types.some(([label]) => label === "Analysis")} />
    <ArticleCollection articles={articles} emptyMessage={selected === "Team News" ? "Team news will appear here when published." : undefined} />
  </main></>;
}
