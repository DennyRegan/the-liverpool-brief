import { getArticles } from '@/lib/content/articles';
import { socialImage, socialImageSize } from '@/lib/social-image';
import { socialSection } from '@/lib/social-card';
export const runtime = 'nodejs';
export const size = socialImageSize;
export const contentType = 'image/png';
export const alt = 'The Liverpool Brief — article headline';
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const article = getArticles().find(article => article.slug === slug);
  if (!article) return new Response(null, { status: 404 });
  return socialImage(article.title, socialSection(article), article.body);
}
