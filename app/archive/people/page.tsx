import Link from "next/link";
import { getPersonFeatures } from "@/lib/content/archive";
import { SiteHeader } from "@/app/components/SiteHeader";

export default function PeopleArchivePage() {
  const features = getPersonFeatures();

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader active="archive" />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/archive" className="text-sm font-medium text-accent hover:text-accent-dark">
          ‹ Archive
        </Link>
        <h1 className="font-serif text-3xl font-bold text-gray-900 mt-4 mb-2">People</h1>
        <p className="text-gray-500 mb-10">The players and managers who shaped Liverpool FC.</p>

        {features.length > 0 ? (
          <ul>
            {features.map((feature, index) => (
              <li key={feature.slug} className={index > 0 ? "pt-6 mt-6 border-t border-gray-200" : ""}>
                <Link href={`/archive/${feature.slug}`} className="group flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                      <span className="text-accent">{feature.decade}</span> · {feature.historicalPeriod}
                    </p>
                    <h2 className="font-serif text-xl font-bold text-gray-900 mb-2 group-hover:underline">
                      {feature.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">{feature.excerpt}</p>
                  </div>
                  <span className="text-accent text-xl leading-none shrink-0 pt-1" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No people features yet.</p>
        )}
      </main>
    </div>
  );
}
