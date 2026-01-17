import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://andreas.technology'),
  title: 'Andreas Fragkiadakis | IT & Security Engineer Portfolio',
  description: 'Explore the digital portfolio of Andreas Fragkiadakis - IT & Computer Engineering Student specializing in Network Security, System Administration, and Web Development.',
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
    title: 'Andreas Fragkiadakis | IT & Security Engineer Portfolio',
    description: 'Explore the digital portfolio of Andreas Fragkiadakis - IT & Computer Engineering Student specializing in Network Security, System Administration, and Web Development.',
    url: 'https://andreas.technology',
    siteName: 'Andreas Fragkiadakis Portfolio',
    images: [
      {
        url: '/images/Porftolio website/portfolio-site-2025.png',
        width: 1200,
        height: 630,
        alt: 'Andreas Fragkiadakis Portfolio Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Andreas Fragkiadakis | IT & Security Engineer Portfolio',
    description: 'Explore the digital portfolio of Andreas Fragkiadakis - IT & Computer Engineering Student specializing in Network Security, System Administration, and Web Development.',
    images: ['/images/Porftolio website/portfolio-site-2025.png'],
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
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Andreas Fragkiadakis',
              url: 'https://andreas.technology',
              image: 'https://andreas.technology/images/Porftolio%20website/portfolio-site-2025.png',
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
              {children}
            </SmoothScroll>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
