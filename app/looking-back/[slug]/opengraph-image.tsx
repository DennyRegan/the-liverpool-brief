import { getVisibleLookingBack } from '@/lib/content/looking-back';
import { onThisDayKicker } from '@/lib/content/history-article';
import { lookingBackImage, lookingBackImageSize } from '@/lib/looking-back-card';

export const runtime = 'nodejs';
export const size = lookingBackImageSize;
export const contentType = 'image/png';
export const alt = 'The Liverpool Brief · Looking Back · On This Day';

// Same scheduling as the page: built for visible pieces, later ones on request.
export const dynamicParams = true;
export const revalidate = 3600;

export function generateStaticParams() {
  return getVisibleLookingBack().map(piece => ({ slug: piece.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const piece = getVisibleLookingBack().find(item => item.slug === slug);
  if (!piece) return new Response(null, { status: 404 });
  return lookingBackImage({ kicker: ['On This Day', onThisDayKicker(piece)], headline: piece.title, subtitle: piece.scoreline });
}
