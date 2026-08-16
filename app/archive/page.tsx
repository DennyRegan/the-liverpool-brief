import { getArchiveFeatures } from "@/lib/content/archive";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ArchiveList } from "@/app/archive/ArchiveList";

export default function ArchivePage() {
  const features = getArchiveFeatures();

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader active="archive" />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">The Liverpool Archive</h1>
        <p className="text-gray-500 mb-10">Classic stories from Anfield&rsquo;s history.</p>

        {features.length > 0 ? (
          <ArchiveList features={features} />
        ) : (
          <p className="text-gray-500">No archive features yet.</p>
        )}
      </main>
    </div>
  );
}
