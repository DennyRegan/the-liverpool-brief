import Link from "next/link";
import { getArchiveFeatures } from "@/lib/content/archive";
import { SiteHeader } from "@/app/components/SiteHeader";

const SECTIONS = [
  {
    href: "/archive/matches",
    label: "Matches",
    description: "Classic Liverpool matches, from European nights to unforgettable derby days.",
  },
  {
    href: "/archive/people",
    label: "People",
    description: "The players and managers who shaped Liverpool FC.",
  },
  {
    href: "/archive/seasons",
    label: "Seasons",
    description:
      "We start here, where Bill Shankly takes over, and go right through to the modern day.",
  },
];

export default function ArchivePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader active="archive" />
      <main id="main-content" className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">The Liverpool Archive</h1>
        <p className="text-gray-500 mb-10">Classic stories from Anfield&rsquo;s history.</p>

        {getArchiveFeatures().length === 0 && <p className="text-gray-600 mb-8">Denny’s archive articles will appear here as they are published.</p>}
        <ul>
          {SECTIONS.map((section, index) => (
            <li key={section.href} className={index > 0 ? "pt-6 mt-6 border-t border-gray-200" : ""}>
              <Link href={section.href} className="group flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-gray-900 mb-2 group-hover:underline">
                    {section.label}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">{section.description}</p>
                </div>
                <span className="text-accent text-xl leading-none shrink-0 pt-1" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
