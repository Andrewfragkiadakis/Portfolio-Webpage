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
export const CONTENT_UPDATED_AT = '2026-10-25'

/**
 * Self-hosted résumé: the public 1-page CV (no phone number). Set to null to hide the
 * Download button; replace the PDF and its size label together when the CV changes.
 */
export const CV = { path: '/files/Andreas-Fragkiadakis-CV.pdf', sizeLabel: '56 KB' } as { path: string; sizeLabel: string } | null

/**
 * Google Search Console ownership token (the content of its HTML-tag method). Rendered as
 * <meta name="google-site-verification"> when set; null renders nothing.
 */
export const GOOGLE_SITE_VERIFICATION = null as string | null
