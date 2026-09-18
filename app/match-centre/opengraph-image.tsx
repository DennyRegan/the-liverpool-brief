import { getMatchCentre, selectMatches } from '@/lib/content/match-centre';
import { socialImage, socialImageSize } from '@/lib/social-image';
export const size = socialImageSize;
export const contentType = 'image/png';
export const alt = 'The Liverpool Brief — Match Centre';
export const dynamic = 'force-dynamic';
export default function Image() {
  const { next } = selectMatches(getMatchCentre());
  return socialImage(next?.preview?.title ?? 'The season, match by match.', next?.preview ? 'Match preview' : 'Match Centre');
}
