import { getMatchCollectionView } from "@/lib/content/match-collection-view";
import { MatchReviewReport } from "@/app/components/history/MatchReviewReport";
import { ArticleConnections } from "@/app/components/history/ArticleConnections";
import { socialMetadata } from '@/lib/social-metadata';
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getArchiveCategory, getArchiveFeature, getArchiveFeatures } from "@/lib/content/archive";
import { formatLongDate } from "@/lib/format";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ShareButton } from "@/app/components/ShareButton";
import { ArticleMeta } from "@/app/components/ArticleMeta";
import { isPrototypeSlug, loadHistoryPrototype } from "@/lib/content/history-prototype";
import { canViewHistoryPrototype } from "@/lib/history-prototype-access";
import { HistoryReport } from "@/app/components/history-prototype/HistoryReport";

export function generateStaticParams() {
  return getArchiveFeatures().map((feature) => ({ slug: feature.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (isPrototypeSlug(slug) && await canViewHistoryPrototype()) {
    const article = loadHistoryPrototype().articles.find(article => article.slug === slug)!;
    return { title: article.title, description: article.excerpt,
      alternates: { canonical: `/archive/${slug}` }, robots: { index: false, follow: false } };
  }
  const collection = await getMatchCollectionView();
  const reviewArticle = collection.review ? collection.matches.find(a => a.slug === slug && a.publication !== 'published') : undefined;
  if (reviewArticle) return { title: reviewArticle.title, description: reviewArticle.excerpt, alternates: { canonical: `/archive/${slug}` }, robots: { index: false, follow: false } };
  let feature;
  try {
    feature = getArchiveFeature(slug);
  } catch {
    return {};
  }

  const metadata = socialMetadata(feature.title, feature.excerpt, `/archive/${feature.slug}`);
  return {
    ...metadata,
    authors: [{ name: "Denny Regan" }],
    openGraph: { ...metadata.openGraph, type: "article", publishedTime: feature.date, authors: ["Denny Regan"], section: getArchiveCategory(feature) },
  };
}

export default async function ArchiveFeaturePage({
  params, searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { slug } = await params;
  if (isPrototypeSlug(slug) && await canViewHistoryPrototype()) return <HistoryReport slug={slug} integrated={(await searchParams).from !== "prototype"} />;
  const collection = await getMatchCollectionView();
  const reviewArticle = collection.review ? collection.matches.find(a => a.slug === slug && a.publication !== 'published') : undefined;
  if (reviewArticle) return <MatchReviewReport article={reviewArticle} matches={collection.matches} />;
  let feature;
  try {
    feature = getArchiveFeature(slug);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <SiteHeader active={feature.editorialMode === "factual" ? "history" : "articles"} />
      <main id="main-content" className="reading-page">
        <div className="reading-tools">
          <Link href="/articles" className="back-link">
            ‹ Articles
          </Link>
          <ShareButton title={feature.title} />
        </div>

        <h1 className="article-title">{feature.title}</h1>
        <ArticleMeta {...feature} category={getArchiveCategory(feature)} author showColumn={false} />
        <p className="historical-date">
          Match date: {feature.historicalEventDate ? formatLongDate(feature.historicalEventDate) : feature.historicalPeriod}
        </p>

        <div className="article-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{feature.body}</ReactMarkdown>
        </div>
        <ArticleConnections href={`/archive/${feature.slug}`} />
      </main>
    </div>
  );
}
