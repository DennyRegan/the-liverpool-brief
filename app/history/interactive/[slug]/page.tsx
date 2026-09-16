import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryNav } from "@/app/components/history/HistoryNav";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperienceDocument } from "@/app/components/history/interactive/ExperienceDocument";
import { getPublishedExperiences, getPublishedExperience, toExperienceDocument, toExperienceControls } from "@/lib/content/interactive-history";
import "../interactive-history.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return getPublishedExperiences().map(experience => ({ slug: experience.id }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const experience = getPublishedExperience(slug);
  if (!experience) notFound();
  return {
    title: `${experience.title} — Interactive History | The Liverpool Brief`,
    description: experience.standfirst,
    alternates: { canonical: `/history/interactive/${experience.id}` },
    openGraph: { title: `${experience.title} — Interactive History`, description: experience.standfirst },
  };
}
export default async function InteractiveExperiencePage({ params }: Props) {
  const { slug } = await params;
  const experience = getPublishedExperience(slug);
  if (!experience) notFound();
  return <><SiteHeader active="history" /><main id="main-content" className="site-width hx-page ih-page"><HistoryNav active="interactive" /><ExperienceDocument document={toExperienceDocument(experience)} controls={toExperienceControls(experience)} preview={false} /></main></>;
}
