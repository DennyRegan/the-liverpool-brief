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
import { PlayerTags } from "@/app/components/PlayerTags";
import { ContinueReading } from "@/app/components/ContinueReading";
import { getRelatedPieces } from "@/lib/content/related";
import { ArticleMeta } from "@/app/components/ArticleMeta";
import { HistoryArticle } from "@/app/components/HistoryArticle";
import { FEATURES_PATH } from "@/lib/content/looking-back";
import { formatDayMonthYear, readTime } from "@/lib/content/history-article";

// Re-checked at most hourly so "Continue reading" picks up pieces that go live later.
export const revalidate = 3600;

export function generateStaticParams() {
  return getArchiveFeatures().map((feature) => ({ slug: feature.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
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
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let feature;
  try {
    feature = getArchiveFeature(slug);
  } catch {
    notFound();
  }

  // Features (factual pieces) are Looking Back pieces and use the shared history
  // article template. Opinion pieces keep the modern article layout below.
  if (feature.editorialMode === "factual") {
    return <>
      <SiteHeader active="looking-back" />
      <HistoryArticle
        back={{ href: FEATURES_PATH, label: "Back to Features" }}
        kicker={feature.decade ?? "Feature"}
        title={feature.title}
        standfirst={feature.excerpt}
        byline="By Denny Regan"
        dateline={[feature.historicalEventDate ? formatDayMonthYear(feature.historicalEventDate) : feature.historicalPeriod, "Feature", readTime(feature.body)]}
        body={feature.body}
        links={[{ href: FEATURES_PATH, label: "All Features" }]}
        related={getRelatedPieces(`/archive/${feature.slug}`)}
        extras={<PlayerTags players={feature.players} />}
      />
    </>;
  }

  return (
    <div className="min-h-screen">
      <SiteHeader active="articles" />
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
        <PlayerTags players={feature.players} />
        <ContinueReading items={getRelatedPieces(`/archive/${feature.slug}`)} />
      </main>
    </div>
  );
}
