import type { Metadata } from 'next';
import type { Article } from './content/types.ts';

export function socialMetadata(title: string, description: string, path: string): Metadata {
  return {
    title, description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: 'The Liverpool Brief', locale: 'en_GB', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export function articleMetadata(article: Article, description: string): Metadata {
  const title = article.seoTitle ?? article.title;
  const metadata = socialMetadata(title, description, `/articles/${article.slug}`);
  return {
    ...metadata,
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
