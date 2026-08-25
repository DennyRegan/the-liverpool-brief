import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { archiveFeatureExists, getArchiveFeature, getArchiveFeatures } from "@/lib/content/archive";
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

  const seasonFacts =
    feature.category === "season"
      ? ([
          ["Season", feature.season],
          ["Manager", feature.manager],
          ["League finish", feature.leagueFinish],
          ["European competition", feature.european],
          ["Domestic cups", feature.domesticCups],
          ["Top scorer", feature.topScorer],
          ["Arrivals", feature.arrivals],
          ["Departures", feature.departures],
        ] as const).filter(([, value]) => Boolean(value))
      : [];

  const relatedMatches =
    feature.category === "season" && feature.relatedMatches
      ? feature.relatedMatches
          .filter((matchSlug) => archiveFeatureExists(matchSlug))
          .map((matchSlug) => getArchiveFeature(matchSlug))
      : [];

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader active="archive" />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <Link href="/archive" className="text-sm font-medium text-accent hover:text-accent-dark">
            ‹ Back
          </Link>
          <ShareButton title={feature.title} />
        </div>

        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">{feature.title}</h1>
        <p className="text-sm text-gray-500 mb-8">{feature.historicalPeriod}</p>

        {seasonFacts.length > 0 && (
          <dl className="mb-8 border border-gray-200 rounded-lg divide-y divide-gray-200 bg-gray-50 text-sm">
            {seasonFacts.map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4 px-4 py-2.5">
                <dt className="font-semibold text-gray-500">{label}</dt>
                <dd className="text-gray-900 text-right">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="text-gray-700 leading-relaxed [&>p]:mb-4 [&_a]:text-accent [&_a]:underline [&_strong]:font-semibold [&_table]:w-full [&_table]:mb-4 [&_table]:border-collapse [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{feature.body}</ReactMarkdown>
        </div>

        {relatedMatches.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">From this season</h2>
            <ul className="space-y-2">
              {relatedMatches.map((match) => (
                <li key={match.slug}>
                  <Link
                    href={`/archive/${match.slug}`}
                    className="text-accent font-medium hover:text-accent-dark hover:underline"
                  >
                    {match.title} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
