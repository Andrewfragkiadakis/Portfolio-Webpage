
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { MotionConfig } from 'motion/react'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import CinematicEntry from '@/components/dom/CinematicEntry'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { SOCIAL_URLS, content } from '@/data/content'

// Inter is the non-Apple fallback in the system stack (see --font-display / --font-text).
// Greek is loaded too, so Greek keeps its weights on Windows and Android, and the optical
// size axis lets Inter tighten for display sizes the way San Francisco does.
const inter = Inter({ subsets: ['latin', 'greek'], display: 'swap', variable: '--font-inter', axes: ['opsz'] })

const SITE_URL = 'https://andreas.technology'

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'Andreas Fragkiadakis | IT & Security Engineer',
        template: '%s | Andreas Fragkiadakis',
    },
    description: 'M.Eng. Computer Engineer specializing in SecOps, infrastructure automation, and AI. Portfolio of Andreas Fragkiadakis — IT & Security Engineer based in Athens, Greece.',
    keywords: [
        'Andreas Fragkiadakis', 'Fragkiadakis', 'IT Engineer', 'Security Engineer', 'Computer Engineer', 'M.Eng', 'SecOps', 'Infrastructure Automation', 'ITIL', 'Jamf 200', 'Jamf Certified Tech', 'Jamf Pro', 'Apple Fleet Management', 'Next.js Developer', 'Frontend Developer Greece', 'Web Developer Athens', 'Portfolio', 'Athens', 'Greece',
        'Ανδρέας Φραγκιαδάκης', 'Φραγκιαδάκης', 'Μηχανικός Πληροφορικής', 'Μηχανικός Υπολογιστών', 'Μηχανικός Ασφαλείας IT', 'Web Developer Αθήνα', 'Προγραμματιστής Αθήνα', 'IT Support Ελλάδα', 'Ασφάλεια Πληροφοριακών Συστημάτων', 'Αυτοματισμός Υποδομών',
    ],
    authors: [{ name: 'Andreas Fragkiadakis', url: SITE_URL }],
    creator: 'Andreas Fragkiadakis',
    alternates: {
        canonical: SITE_URL,
    },
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: '32x32', type: 'image/png' },
            { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        ],
        apple: [
            { url: '/favicons/apple-touch-icon.png', sizes: '180x180' },
        ],
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: SITE_URL,
        siteName: 'Andreas Fragkiadakis',
        title: 'Andreas Fragkiadakis | IT & Security Engineer',
        description: 'M.Eng. Computer Engineer — SecOps, infrastructure automation & AI. View portfolio and get in touch.',
        images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Andreas Fragkiadakis | IT & Security Engineer' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Andreas Fragkiadakis | IT & Security Engineer',
        description: 'M.Eng. Computer Engineer — SecOps, infrastructure automation & AI. Portfolio.',
        creator: '@Andrewfragkiadakis',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#000000' },
    ],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={inter.variable} suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){var t=null;try{t=localStorage.getItem('theme')}catch(e){}if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.classList.add(t);document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('meta[name=\"theme-color\"]').forEach(function(m){m.setAttribute('content',t==='dark'?'#000000':'#ffffff')})})})();`,
                    }}
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{if(localStorage.getItem('cinematic-entered')==='true'){document.documentElement.dataset.entered='true';}}catch(e){}})();`,
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebSite',
                            name: 'Andreas Fragkiadakis',
                            url: SITE_URL,
                            description: 'Portfolio of Andreas Fragkiadakis — IT & Security Engineer (M.Eng.), SecOps, Infrastructure Automation & AI.',
                            publisher: {
                                '@type': 'Person',
                                name: 'Andreas Fragkiadakis',
                                url: SITE_URL,
                                jobTitle: 'IT & Security Engineer',
                                image: `${SITE_URL}/opengraph-image`,
                                sameAs: [
                                    SITE_URL,
                                    SOCIAL_URLS.github,
                                    SOCIAL_URLS.linkedin,
                                ],
                            },
                        }),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Person',
                            name: 'Andreas Fragkiadakis',
                            url: SITE_URL,
                            mainEntityOfPage: SITE_URL,
                            image: `${SITE_URL}/opengraph-image`,
                            jobTitle: 'IT & Security Engineer',
                            worksFor: { '@type': 'Organization', name: 'OMILIA LTD' },
                            sameAs: [SITE_URL, SOCIAL_URLS.github, SOCIAL_URLS.linkedin],
                            email: 'andrewfragkiadakis@gmail.com',
                            telephone: '+30-697-345-3683',
                            address: { '@type': 'PostalAddress', addressLocality: 'Athens', addressCountry: 'GR' },
                            knowsAbout: ['Jamf Pro', 'macOS fleet management', 'Endpoint security', 'IT automation', 'ITIL 4'],
                            hasCredential: content.en.education
                                .filter((e) => e.kind === 'certification' || e.kind === 'license')
                                .map((e) => ({
                                    '@type': 'EducationalOccupationalCredential',
                                    name: e.degree,
                                    credentialCategory: e.kind === 'license' ? 'Professional License' : 'Certification',
                                    recognizedBy: { '@type': 'Organization', name: e.institution },
                                    ...(e.link ? { url: e.link.startsWith('http') ? e.link : `${SITE_URL}${e.link}` } : {}),
                                })),
                        }),
                    }}
                />
            </head>
            <body>
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100001] focus:px-4 focus:py-2 focus:bg-[var(--accent-fill)] focus:text-white focus:rounded-full focus:outline-none"
                >
                    Skip to content
                </a>
                <ThemeProvider>
                    <LanguageProvider>
                        <MotionConfig reducedMotion="user">
                            <CinematicEntry />
                            {children}
                        </MotionConfig>
                    </LanguageProvider>
                </ThemeProvider>
                <SpeedInsights />
            </body>
        </html>
    )
}
