import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import CinematicEntry from '@/components/dom/CinematicEntry'
import NoiseOverlay from '@/components/dom/NoiseOverlay'
import ThemeToggle from '@/components/ui/ThemeToggle'
import CustomCursor from '@/components/ui/CustomCursor'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

const SITE_URL = 'https://andreas.technology'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Andreas Fragkiadakis | IT & Security Engineer',
    template: '%s | Andreas Fragkiadakis',
  },
  description: 'M.Eng. Computer Engineer specializing in SecOps, infrastructure automation, and AI. Portfolio of Andreas Fragkiadakis — IT & Security Engineer.',
  keywords: ['Andreas Fragkiadakis', 'IT Engineer', 'Security Engineer', 'Computer Engineer', 'SecOps', 'Portfolio', 'Athens'],
  authors: [{ name: 'Andreas Fragkiadakis', url: SITE_URL }],
  creator: 'Andreas Fragkiadakis',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicons/favicon.ico' },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';l.integrity='sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==';l.crossOrigin='anonymous';l.referrerPolicy='no-referrer';l.media='print';l.onload=function(){this.media='all'};document.head.appendChild(l);})();`,
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Andreas Fragkiadakis',
              url: 'https://andreas.technology',
              image: `${SITE_URL}/opengraph-image`,
              jobTitle: 'IT & Security Engineer',
              worksFor: {
                '@type': 'Organization',
                name: 'OMILIA LTD',
              },
              sameAs: [
                'https://github.com/Andrewfragkiadakis',
                'https://www.linkedin.com/in/andreas-fragkiadakis/',
              ],
              email: 'andrewfragkiadakis@gmail.com',
              telephone: '+30-697-345-3683',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Athens',
                addressCountry: 'GR',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <SmoothScroll>
              <CinematicEntry />
              <NoiseOverlay />
              <ThemeToggle />
              <CustomCursor />
              {children}
            </SmoothScroll>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
