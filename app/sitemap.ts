import type { MetadataRoute } from 'next';
import { allPages, pagePath } from '../components/site/pages-content';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://saasolution.es';
  return [
    { url: `${baseUrl}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/drive`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/drive/edge`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/drive/edge/beta`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/drive/edge/install`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/drive/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/drive/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/connectgrid`, changeFrequency: 'monthly', priority: 0.8 },
    ...allPages.map((p) => ({ url: `${baseUrl}${pagePath(p)}`, changeFrequency: 'monthly' as const, priority: p.group === 'legal' ? 0.3 : 0.5 })),
  ];
}
