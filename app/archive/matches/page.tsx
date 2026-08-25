import Link from "next/link";
import { getMatchFeatures } from "@/lib/content/archive";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ArchiveList } from "@/app/archive/matches/ArchiveList";

export default function MatchesArchivePage() {
  const features = getMatchFeatures();

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader active="archive" />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/archive" className="text-sm font-medium text-accent hover:text-accent-dark">
          ‹ Archive
        </Link>
        <h1 className="font-serif text-3xl font-bold text-gray-900 mt-4 mb-2">Matches</h1>
        <p className="text-gray-500 mb-10">Classic stories from Anfield&rsquo;s history.</p>

        {features.length > 0 ? (
          <ArchiveList features={features} />
        ) : (
          <p className="text-gray-500">No matches yet.</p>
        )}
      </main>
    </div>
  );
}
