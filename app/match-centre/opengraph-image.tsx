import { socialImage, socialImageSize } from '@/lib/social-image';
export const size = socialImageSize;
export const contentType = 'image/png';
export const alt = 'The Liverpool Brief — Match writing';
export const dynamic = 'force-dynamic';
export default function Image() {
  return socialImage('Liverpool match writing', 'Previews, reports and analysis');
}
