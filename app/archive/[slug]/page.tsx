import { socialMetadata } from '@/lib/social-metadata';
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getArchiveFeature, getArchiveFeatures } from "@/lib/content/archive";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ShareButton } from "@/app/components/ShareButton";

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

  return socialMetadata(feature.title, feature.excerpt, `/archive/${feature.slug}`);
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

  return (
    <div className="min-h-screen">
      <SiteHeader active="articles" />
      <main id="main-content" className="reading-page">
        <div className="flex items-center justify-between mb-8">
          <Link href="/articles" className="text-sm font-medium text-accent hover:text-accent-dark">
            ‹ Articles
          </Link>
          <ShareButton title={feature.title} />
        </div>

        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">{feature.title}</h1>
        <p className="text-sm text-gray-500 mb-8">{feature.historicalPeriod}</p>

        <div className="article-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{feature.body}</ReactMarkdown>
        </div>
      </main>
    </div>
  );
}
