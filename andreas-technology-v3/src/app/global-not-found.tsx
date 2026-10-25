import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { HEAD_SCRIPT } from './head-script'

// Served for any URL that matches no route. It bypasses app/[lang]/layout.tsx, so it brings
// its own styles, font and theme script (the stored theme is painted before first paint).
const inter = Inter({ subsets: ['latin', 'greek'], display: 'swap', variable: '--font-inter', axes: ['opsz'], preload: false })

export const metadata: Metadata = {
    title: 'Page not found | Andreas Fragkiadakis',
    description: 'This page does not exist. Go to andreas.technology.',
    // Next adds <meta name="robots" content="noindex"> to the 404 itself.
}

export default function GlobalNotFound() {
    return (
        <html lang="en" className={inter.variable} suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
            </head>
            <body className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
                <p className="t-eyebrow">404</p>
                <h1 className="t-headline text-[2.5rem] md:text-[3.5rem]">Page not found.</h1>
                <p className="t-body text-[var(--muted)] max-w-[30rem]">
                    The link may be old, or the address mistyped.
                    <span lang="el" className="block mt-2">Η σελίδα δεν βρέθηκε.</span>
                </p>
                <div className="flex flex-wrap justify-center gap-3.5">
                    <Link href="/" className="kn-pill kn-pill--fill">Go to the homepage</Link>
                    <Link href="/el" hrefLang="el" lang="el" className="kn-pill kn-pill--line">Στα ελληνικά</Link>
                </div>
            </body>
        </html>
    )
}
