import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryNav } from "@/app/components/history/HistoryNav";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperienceDocument } from "@/app/components/history/interactive/ExperienceDocument";
import { getPreviewExperience, toExperienceDocument, toExperienceControls } from "@/lib/content/interactive-history";
import "@/app/history/history.css";
import "@/app/history/interactive/interactive-history.css";

type Props = { params: Promise<{ slug: string }> };
// Never cache a local draft as a public static page. The loader checks both gates
// before touching the draft path, including in a production build/start.
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const experience = getPreviewExperience(slug);
  if (!experience) notFound();
  return { title: `${experience.title} — Local editorial preview`, robots: { index: false, follow: false } };
}
export default async function PreviewInteractiveExperiencePage({ params }: Props) {
  const { slug } = await params;
  const experience = getPreviewExperience(slug);
  if (!experience) notFound();
  return <><SiteHeader active="history" /><main id="main-content" className="site-width hx-page ih-page"><HistoryNav active="interactive" /><ExperienceDocument document={toExperienceDocument(experience, process.cwd(), { preview: true })} controls={toExperienceControls(experience, process.cwd(), { preview: true })} preview /></main></>;
}
