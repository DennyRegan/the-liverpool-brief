import { getArchiveFeatures } from "@/lib/content/archive";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ArchiveList } from "@/app/archive/ArchiveList";

export default function ArchivePage() {
  const features = getArchiveFeatures();

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader active="archive" />
      <main className="max-w-2xl mx-auto px-4 py-12">
        {features.length > 0 ? (
          <ArchiveList features={features} />
        ) : (
          <p className="text-gray-500">No archive features yet.</p>
        )}
      </main>
    </div>
  );
}
