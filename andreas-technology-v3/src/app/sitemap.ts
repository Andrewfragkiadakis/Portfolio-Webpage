import type { MetadataRoute } from 'next'
import { LOCALES } from '@/data/locales'
import { CONTENT_UPDATED_AT, SITE_URL } from '@/data/site'

export const dynamic = 'force-static'

/** One entry per language, each listing the other as its alternate. */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(LOCALES.map((l) => [l.code, `${SITE_URL}${l.path === '/' ? '' : l.path}`]))
  return LOCALES.map((l) => ({
    url: `${SITE_URL}${l.path === '/' ? '' : l.path}`,
    lastModified: CONTENT_UPDATED_AT,
    changeFrequency: 'monthly',
    priority: l.path === '/' ? 1 : 0.9,
    alternates: { languages },
  }))
}
