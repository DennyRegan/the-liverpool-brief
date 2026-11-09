import { getVisibleMatchRevisited, getVisibleMatchRevisitedPiece } from '@/lib/content/history';
import { lookingBackImage, lookingBackImageSize } from '@/lib/looking-back-card';

export const runtime = 'nodejs';
export const size = lookingBackImageSize;
export const contentType = 'image/png';
export const alt = 'The Liverpool Brief · Match Revisited';
export const dynamicParams = true;
export const revalidate = 3600;

export function generateStaticParams() {
  return getVisibleMatchRevisited().map(piece => ({ slug: piece.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const piece = getVisibleMatchRevisitedPiece((await params).slug);
  if (!piece) return new Response(null, { status: 404 });
  return lookingBackImage({
    kicker: ['Match Revisited', piece.competition, piece.eventDate?.slice(0, 4)],
    headline: piece.headline ?? piece.title,
    subtitle: piece.scoreline && piece.opponent ? `${piece.scoreline} v ${piece.opponent}` : undefined,
  });
}
