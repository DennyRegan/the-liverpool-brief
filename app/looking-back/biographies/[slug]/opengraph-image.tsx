import { biographyDateline, getVisibleBiographies, getVisibleBiography } from '@/lib/content/history';
import { lookingBackImage, lookingBackImageSize } from '@/lib/looking-back-card';

export const runtime = 'nodejs';
export const size = lookingBackImageSize;
export const contentType = 'image/png';
export const alt = 'The Liverpool Brief · Biography';
export const dynamicParams = true;
export const revalidate = 3600;

export function generateStaticParams() {
  return getVisibleBiographies().map(person => ({ slug: person.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const person = getVisibleBiography((await params).slug);
  if (!person) return new Response(null, { status: 404 });
  return lookingBackImage({ kicker: ['Biography', person.decade], headline: person.title, subtitle: biographyDateline(person) });
}
