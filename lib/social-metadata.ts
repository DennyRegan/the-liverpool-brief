import type { Metadata } from 'next';
import type { Article } from './content/types.ts';
import { SITE_URL } from './site.ts';
import { SOCIAL_IMAGE_VERSION, socialImageSize } from './social-card.ts';

export function socialMetadata(title: string, description: string, path: string): Metadata {
  const image = /^\/(articles|archive|looking-back)\/[a-z0-9-]+$/.test(path)
    ? { url: new URL(`${path}/opengraph-image?v=${SOCIAL_IMAGE_VERSION}`, SITE_URL).href, ...socialImageSize, alt: title }
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
