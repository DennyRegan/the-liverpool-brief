import { getArchiveCategory, getArchiveFeatures } from '@/lib/content/archive';
import { socialImage, socialImageSize } from '@/lib/social-image';
export const runtime = 'nodejs';
export const size = socialImageSize;
export const contentType = 'image/png';
export const alt = 'The Liverpool Brief — article headline';
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const article = getArchiveFeatures().find(article => article.slug === slug);
  if (!article) return new Response(null, { status: 404 });
  return socialImage(article.title, getArchiveCategory(article), article.body);
}
