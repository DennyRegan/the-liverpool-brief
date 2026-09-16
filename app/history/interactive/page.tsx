import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryNav } from "@/app/components/history/HistoryNav";
import { ExperienceCards } from "@/app/components/history/interactive/ExperienceCards";
import { getPublishedExperiences, toExperienceSummary } from "@/lib/content/interactive-history";

export function generateMetadata(): Metadata {
  if (!getPublishedExperiences().length) notFound();
  return {
    title: "Interactive History | The Liverpool Brief",
    description: "Explore Liverpool history through a continuous story, sourced moments and the choices that shaped the match.",
    alternates: { canonical: "/history/interactive" },
  };
}

export default function InteractiveHistoryPage() {
  const experiences = getPublishedExperiences();
  if (!experiences.length) notFound();
  return <>
    <SiteHeader active="history" />
    <main id="main-content" className="site-width hx-page">
      <HistoryNav active="interactive" />
      <header className="hx-intro">
        <p className="eyebrow">Liverpool FC · History</p>
        <h1>Interactive History</h1>
        <p className="hx-standfirst">Follow the story. Explore the turning points, the people and the evidence at your own pace.</p>
      </header>
      <ExperienceCards experiences={experiences.map(toExperienceSummary)} headingId="interactive-experiences" />
    </main>
  </>;
}
