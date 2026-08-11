"use client";

import { useState } from "react";
import Link from "next/link";
import type { getArchiveFeatures } from "@/lib/content/archive";

type ArchiveFeature = ReturnType<typeof getArchiveFeatures>[number];

const DECADES = ["1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];

export function ArchiveList({ features }: { features: ArchiveFeature[] }) {
  const [decade, setDecade] = useState<string>("All");

  const filtered =
    decade === "All" ? features : features.filter((feature) => feature.decade === decade);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10">
        {["All", ...DECADES].map((option) => {
          const isActive = option === decade;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setDecade(option)}
              className={
                isActive
                  ? "text-sm font-medium px-3 py-1 rounded-full bg-accent text-white"
                  : "text-sm font-medium px-3 py-1 rounded-full border border-gray-200 text-gray-600 hover:text-accent hover:border-accent"
              }
            >
              {option}
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <ul className="space-y-8">
          {filtered.map((feature) => (
            <li key={feature.slug} className="border-b border-gray-200 pb-8">
              <Link href={`/archive/${feature.slug}`}>
                <h2 className="text-xl font-bold text-gray-900 mb-2 hover:underline">
                  {feature.title}
                </h2>
              </Link>
              <p className="text-sm text-gray-500 mb-3">{feature.decade}</p>
              <p className="text-gray-700 leading-relaxed">{feature.excerpt}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No features from this decade yet.</p>
      )}
    </div>
  );
}
