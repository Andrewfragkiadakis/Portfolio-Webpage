import type { MetadataRoute } from 'next'
import { LOCALES, localePath } from '@/data/locales'
import { CONTENT_UPDATED_AT, SITE_URL } from '@/data/site'
import { CASE_STUDIES } from '@/data/work'

export const dynamic = 'force-static'

const absolute = (path: string) => `${SITE_URL}${path === '/' ? '' : path}`

/** Every page in every language, each listing its other-language versions as alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const latestStudy = CASE_STUDIES.map((s) => s.updated).sort().at(-1) ?? CONTENT_UPDATED_AT
  const pages: { sub: string; lastModified: string; priority: number }[] = [
    { sub: '', lastModified: CONTENT_UPDATED_AT, priority: 1 },
    { sub: '/work', lastModified: latestStudy, priority: 0.7 },
    ...CASE_STUDIES.map((s) => ({ sub: `/work/${s.slug}`, lastModified: s.updated, priority: 0.7 })),
  ]
  return pages.flatMap(({ sub, lastModified, priority }) => {
    const languages = Object.fromEntries(LOCALES.map((l) => [l.code, absolute(localePath(l.code, sub))]))
    return LOCALES.map((l) => ({
      url: languages[l.code],
      lastModified,
      changeFrequency: 'monthly' as const,
      // The home page in its main language leads; its Greek version follows.
      priority: sub === '' && l.path !== '/' ? 0.9 : priority,
      alternates: { languages },
    }))
  })
}
