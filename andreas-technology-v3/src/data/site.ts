/** Facts about the site and its owner that do not depend on the language. */
export const SITE_URL = 'https://andreas.technology'

export const SOCIAL_URLS = {
    github: 'https://github.com/Andrewfragkiadakis',
    linkedin: 'https://www.linkedin.com/in/andreas-fragkiadakis/',
} as const

export const PERSON = {
    name: 'Andreas Fragkiadakis',
    email: 'andrewfragkiadakis@gmail.com',
} as const

/** Bump when the content changes, so the sitemap reports a real modification date. */
export const CONTENT_UPDATED_AT = '2026-10-12'

/**
 * Self-hosted résumé. Leave null until an up-to-date PDF is in public/files (D5 in
 * docs/KEYNOTE-AUDIT-PLAN.md); the Download button is hidden while it is null.
 */
export const CV = null as { path: string; sizeLabel: string } | null
