import type { Metadata } from 'next';

export function socialMetadata(title: string, description: string, path: string): Metadata {
  return {
    title, description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: 'The Liverpool Brief', locale: 'en_GB', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}
