import { getVisibleSeriesParts, getVisibleSeriesPart } from '@/lib/content/history';
import { lookingBackImage, lookingBackImageSize } from '@/lib/looking-back-card';

export const runtime = 'nodejs';
export const size = lookingBackImageSize;
export const contentType = 'image/png';
export const alt = 'The Liverpool Brief · Series';
export const dynamicParams = true;
export const revalidate = 3600;

export function generateStaticParams() {
  return getVisibleSeriesParts().map(part => ({ series: part.seriesSlug, slug: part.slug }));
}

export default async function Image({ params }: { params: Promise<{ series: string; slug: string }> }) {
  const { series, slug } = await params;
  const found = getVisibleSeriesPart(series, slug);
  if (!found) return new Response(null, { status: 404 });
  return lookingBackImage({ kicker: [found.series.title, `Part ${found.part.partNumber} of ${found.series.totalParts}`], headline: found.part.title });
}
