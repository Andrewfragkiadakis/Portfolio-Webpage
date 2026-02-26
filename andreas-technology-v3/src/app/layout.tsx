
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import CinematicEntry from '@/components/dom/CinematicEntry'
import NoiseOverlay from '@/components/dom/NoiseOverlay'
import ThemeToggle from '@/components/ui/ThemeToggle'
import CustomCursor from '@/components/ui/CustomCursor'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { SOCIAL_URLS } from '@/data/content'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

const SITE_URL = 'https://andreas.technology'

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'Andreas Fragkiadakis | IT & Security Engineer',
        template: '%s | Andreas Fragkiadakis',
    },
    // ≤155 chars for clean SERP display
    description: 'M.Eng. Computer Engineer — SecOps, infrastructure automation & AI. Portfolio of Andreas Fragkiadakis, IT & Security Engineer, Athens Greece.',
    keywords: [
        'Andreas Fragkiadakis', 'Fragkiadakis', 'IT Engineer Athens', 'Security Engineer Greece',
        'SecOps', 'Infrastructure Automation', 'ITIL 4', 'Next.js Developer Greece',
        'Web Developer Athens', 'Freelance Developer Athens', 'IT Support Engineer Greece',
        'Ανδρέας Φραγκιαδάκης', 'Μηχανικός Πληροφορικής Αθήνα', 'Web Developer Αθήνα',
        'IT Support Ελλάδα', 'Ασφάλεια Πληροφοριακών Συστημάτων',
    ],
    authors: [{ name: 'Andreas Fragkiadakis', url: SITE_URL }],
    creator: 'Andreas Fragkiadakis',
    // hreflang: both EN and EL served at the same URL (single-page bilingual app)
    alternates: {
        canonical: SITE_URL,
        languages: {
            'en': SITE_URL,
            'el': SITE_URL,
            'x-default': SITE_URL,
        },
    },
    icons: {
        icon: [
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
        alternateLocale: ['el_GR'],
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
    },
    robots: {
        index: true,
        follow: true,
    },
    other: {
        'theme-color': '#030014',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta name="theme-color" content="#030014" media="(prefers-color-scheme: dark)" />
                <meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)" />
                <link rel="manifest" href="/favicons/site.webmanifest" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
                <link
                    rel="preload"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                    as="style"
                    crossOrigin="anonymous"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';l.crossOrigin='anonymous';l.referrerPolicy='no-referrer';document.head.appendChild(l);})();`,
                    }}
                />
                <noscript>
                    <link
                        rel="stylesheet"
                        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                        crossOrigin="anonymous"
                    />
                </noscript>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){var mq=window.matchMedia('(prefers-color-scheme:dark)');var ml=window.matchMedia('(prefers-color-scheme:light)');if(mq.matches||ml.matches){t=mq.matches?'dark':'light';}else{var h=new Date().getHours();t=(h>=7&&h<20)?'light':'dark';}}document.documentElement.classList.add(t);}catch(e){}})();`,
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
                            alumniOf: [
                                { '@type': 'EducationalOrganization', name: 'University of West Attica', address: { '@type': 'PostalAddress', addressLocality: 'Athens', addressCountry: 'GR' } },
                                { '@type': 'EducationalOrganization', name: 'SRH Hochschule Heidelberg', address: { '@type': 'PostalAddress', addressLocality: 'Heidelberg', addressCountry: 'DE' } },
                            ],
                            hasCredential: {
                                '@type': 'EducationalOccupationalCredential',
                                name: 'ITIL 4 Foundation Certificate in IT Service Management',
                                credentialCategory: 'Professional Certification',
                                recognizedBy: { '@type': 'Organization', name: 'AXELOS Global Best Practice' },
                            },
                            knowsLanguage: [
                                { '@type': 'Language', name: 'English' },
                                { '@type': 'Language', name: 'Greek' },
                                { '@type': 'Language', name: 'German' },
                            ],
                        }),
                    }}
                />
            </head>
            <body className={inter.className}>
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100001] focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-white focus:rounded focus:outline-none"
                >
                    Skip to content
                </a>
                <ThemeProvider>
                    <LanguageProvider>
                        <CinematicEntry />
                        <NoiseOverlay />
                        <ThemeToggle />
                        <CustomCursor />
                        {children}
                    </LanguageProvider>
                </ThemeProvider>
                <SpeedInsights />
            </body>
        </html>
    )
}
