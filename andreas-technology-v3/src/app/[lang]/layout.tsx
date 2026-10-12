import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { content } from '@/data/content'
import { LOCALES, localeInfo, toLocale, type Locale } from '@/data/locales'
import { KEYWORDS, META } from '@/data/meta'
import { PERSON, SITE_URL, SOCIAL_URLS } from '@/data/site'
import { HEAD_SCRIPT } from '../head-script'

// Inter is the non-Apple fallback in the system stack (see --font-display / --font-text).
// Greek is loaded too, so Greek keeps its weights on Windows and Android, and the optical
// size axis lets Inter tighten for display sizes the way San Francisco does. It is not
// preloaded: Apple devices render San Francisco and never need it, and elsewhere each
// subset downloads only when its glyphs are first used (metric-matched fallback until then).
const inter = Inter({ subsets: ['latin', 'greek'], display: 'swap', variable: '--font-inter', axes: ['opsz'], preload: false })

/** One static page per language; any other first segment is a 404. */
export const dynamicParams = false

export function generateStaticParams() {
    return LOCALES.map(({ code }) => ({ lang: code }))
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
    const lang = toLocale((await params).lang)
    const meta = META[lang]
    const { path, ogLocale } = localeInfo(lang)
    return {
        metadataBase: new URL(SITE_URL),
        title: { default: meta.title, template: `%s | ${PERSON.name}` },
        description: meta.description,
        keywords: KEYWORDS,
        authors: [{ name: PERSON.name, url: SITE_URL }],
        creator: PERSON.name,
        alternates: {
            canonical: path,
            languages: Object.fromEntries([...LOCALES.map((l) => [l.code, l.path]), ['x-default', '/']]),
        },
        manifest: '/favicons/site.webmanifest',
        icons: {
            icon: [
                { url: '/favicon.ico', sizes: '32x32', type: 'image/png' },
                { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
                { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            ],
            apple: [{ url: '/favicons/apple-touch-icon.png', sizes: '180x180' }],
        },
        openGraph: {
            type: 'website',
            locale: ogLocale,
            alternateLocale: LOCALES.filter((l) => l.code !== lang).map((l) => l.ogLocale),
            url: path,
            siteName: PERSON.name,
            title: meta.title,
            description: meta.shareDescription,
        },
        twitter: {
            card: 'summary_large_image',
            title: meta.title,
            description: meta.xDescription,
        },
        robots: { index: true, follow: true },
    }
}

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#000000' },
    ],
}

/** Structured data: one Person (the site's owner) and the WebSite they publish. */
function jsonLd(lang: Locale) {
    const personId = `${SITE_URL}/#person`
    const copy = content.en
    return [
        {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: PERSON.name,
            url: SITE_URL,
            inLanguage: LOCALES.map((l) => l.code),
            description: META[lang].siteDescription,
            publisher: { '@id': personId },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'Person',
            '@id': personId,
            name: PERSON.name,
            url: SITE_URL,
            mainEntityOfPage: SITE_URL,
            image: `${SITE_URL}/favicons/android-chrome-512x512.png`,
            description: 'Apple fleet and IT automation lead at Omilia: Jamf Pro, endpoint security and automation for 550+ Macs.',
            jobTitle: 'Team Lead, Apple Fleet & IT Automation',
            worksFor: { '@type': 'Organization', name: 'Omilia', url: 'https://omilia.com' },
            alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of West Attica' },
            knowsLanguage: ['en', 'el', 'de'],
            sameAs: [SOCIAL_URLS.github, SOCIAL_URLS.linkedin],
            email: PERSON.email,
            address: { '@type': 'PostalAddress', addressLocality: 'Athens', addressCountry: 'GR' },
            knowsAbout: ['Jamf Pro', 'Apple Business Manager', 'macOS fleet management', 'Endpoint security', 'CIS Benchmarks', 'Microsoft Sentinel', 'IT automation', 'Python', 'Bash', 'ITIL 4'],
            hasCredential: copy.education
                .filter((e) => e.kind === 'certification' || e.kind === 'license')
                .map((e) => ({
                    '@type': 'EducationalOccupationalCredential',
                    name: e.degree,
                    credentialCategory: e.kind === 'license' ? 'Professional License' : 'Certification',
                    recognizedBy: { '@type': 'Organization', name: e.institution },
                    ...(e.link ? { url: e.link.startsWith('http') ? e.link : `${SITE_URL}${e.link}` } : {}),
                })),
        },
    ]
}

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
    const lang = toLocale((await params).lang)
    const copy = content[lang]
    return (
        <html lang={lang} className={inter.variable} suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang)) }} />
            </head>
            <body>
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100001] focus:px-4 focus:py-2 focus:bg-[var(--accent-fill)] focus:text-white focus:rounded-full focus:outline-none"
                >
                    {copy.keynote.common.skip}
                </a>
                <ThemeProvider>
                    <LocaleProvider locale={lang} copy={copy}>
                        {children}
                    </LocaleProvider>
                </ThemeProvider>
                <SpeedInsights />
            </body>
        </html>
    )
}
