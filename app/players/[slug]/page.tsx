import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ArticleMeta } from "@/app/components/ArticleMeta";
import { getArticleExcerpt } from "@/lib/format";
import { playerName } from "@/lib/content/player-names";
import { getPlayerArticles, getPlayerPageSlugs, PLAYERS_PATH } from "@/lib/content/players";
import { socialMetadata } from "@/lib/social-metadata";

// Pages exist only for players tagged in at least three articles.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPlayerPageSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!getPlayerPageSlugs().includes(slug)) return {};
  const name = playerName(slug);
  return socialMetadata(`${name} | The Liverpool Brief`, `Articles about ${name} by Denny Regan.`, `${PLAYERS_PATH}/${slug}`);
}

export default async function PlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getPlayerPageSlugs().includes(slug)) notFound();
  const articles = getPlayerArticles(slug);
  return <>
    <SiteHeader active="articles" />
    <main id="main-content" className="site-width collection">
      <p className="eyebrow">Player</p>
      <h1 className="collection-title">{playerName(slug)}</h1>
      <div className="article-grid">{articles.map(article => <article key={article.href} className="article-card">
        <ArticleMeta {...article} />
        <h2><Link href={article.href}>{article.title}</Link></h2>
        <p className="preview-excerpt">{getArticleExcerpt(article, 180)}</p>
        <Link className="read-link" href={article.href} aria-label={`Read article: ${article.title}`}>Read article</Link>
      </article>)}</div>
    </main>
  </>;
}
