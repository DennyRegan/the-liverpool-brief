import { getArchiveFeature } from '@/lib/content/archive';
import { socialImage, socialImageSize } from '@/lib/social-image';
export const size = socialImageSize;
export const contentType = 'image/png';
export const alt = 'The Liverpool Brief — History headline';
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArchiveFeature((await params).slug);
  return socialImage(article.title, article.category === 'match' ? 'Match report' : 'History');
}
