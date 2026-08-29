import type { MetadataRoute } from 'next';
import { getArticles } from '@/lib/content';
import { locales, siteOrigin } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const core = locales.flatMap((locale) => ['', '/resume', '/notes'].map((path) => ({ url: `${siteOrigin}/${locale}${path}`, lastModified: new Date('2026-08-29'), changeFrequency: path === '/notes' ? 'weekly' as const : 'monthly' as const, priority: path === '' ? 1 : .8 })));
  const notes = locales.flatMap((locale) => getArticles(locale).map((article) => ({ url: `${siteOrigin}/${locale}/notes/${article.slug}`, lastModified: new Date(`${article.updatedAt ?? article.publishedAt}T00:00:00Z`), changeFrequency: 'monthly' as const, priority: .7 })));
  return [...core, ...notes];
}
