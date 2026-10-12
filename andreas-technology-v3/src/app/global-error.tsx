'use client'

import './globals.css'

/** Last-resort screen if the root layout itself fails: a page, never a blank screen. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
                <p className="t-eyebrow">Andreas Fragkiadakis</p>
                <h1 className="t-headline text-[2.5rem]">Something went wrong.</h1>
                <p className="t-body text-[var(--muted)] max-w-[28rem]">The page hit an unexpected error. Reloading usually fixes it.</p>
                <button type="button" onClick={reset} className="kn-pill kn-pill--fill">Reload</button>
            </body>
        </html>
    )
}
