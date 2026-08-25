"use client";

import { useState } from "react";
import Link from "next/link";
import type { getMatchFeatures } from "@/lib/content/archive";

type ArchiveFeature = ReturnType<typeof getMatchFeatures>[number];

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
        <ul>
          {filtered.map((feature, index) => (
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
        <p className="text-gray-500">No features from this decade yet.</p>
      )}
    </div>
  );
}
