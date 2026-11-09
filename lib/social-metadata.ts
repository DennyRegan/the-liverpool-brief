import type { Metadata } from 'next';
import type { Article } from './content/types.ts';
import { SITE_URL } from './site.ts';
import { SOCIAL_IMAGE_VERSION, socialImageSize } from './social-card.ts';

const LOOKING_BACK_PATH = '/looking-back';
/** The site's default social image (app/opengraph-image.png), as on the homepage. */
const DEFAULT_SOCIAL_IMAGE = { url: new URL('/opengraph-image.png', SITE_URL).href, width: 1197, height: 630, alt: 'The Liverpool Brief' };

export function socialMetadata(title: string, description: string, path: string): Metadata {
  const sectionPage = /^\/looking-back\/(on-this-day|on-this-day\/previous|biographies|series|features)$/.test(path);
  const image = !sectionPage && /^\/(articles|archive|looking-back)\/[a-z0-9-]+$/.test(path)
    ? { url: new URL(`${path}/opengraph-image?v=${SOCIAL_IMAGE_VERSION}`, SITE_URL).href, ...socialImageSize, alt: title }
    // Looking Back pages without their own image route (the hub, section pages,
    // biographies and series parts) use the site's default social image: setting
    // openGraph here would otherwise drop the one app/opengraph-image.png provides.
    : path === LOOKING_BACK_PATH || path.startsWith(`${LOOKING_BACK_PATH}/`) ? DEFAULT_SOCIAL_IMAGE
    : undefined;
  return {
    title, description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: 'The Liverpool Brief', locale: 'en_GB', type: 'website', ...(image ? { images: [image] } : {}) },
    twitter: { card: 'summary_large_image', title, description, ...(image ? { images: [image] } : {}) },
  };
}

export function articleMetadata(article: Article, description: string): Metadata {
  const metadata = socialMetadata(article.title, description, `/articles/${article.slug}`);
  return {
    ...metadata,
    title: article.seoTitle ?? article.title,
    authors: [{ name: 'Denny Regan' }],
    keywords: article.tags,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: article.date,
      authors: ['Denny Regan'],
      section: article.category,
      tags: article.tags,
    },
  };
}
