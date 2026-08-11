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

  return {
    title: feature.title,
    description: feature.excerpt,
    openGraph: {
      title: feature.title,
      description: feature.excerpt,
    },
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
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader active="archive" />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{feature.title}</h1>
        <p className="text-sm text-gray-500 mb-8">{feature.historicalPeriod}</p>
        <div className="text-gray-700 leading-relaxed [&>p]:mb-4 [&_a]:text-accent [&_a]:underline [&_strong]:font-semibold [&_table]:w-full [&_table]:mb-4 [&_table]:border-collapse [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{feature.body}</ReactMarkdown>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-200">
          <ShareButton title={feature.title} />
        </div>
      </main>
    </div>
  );
}
