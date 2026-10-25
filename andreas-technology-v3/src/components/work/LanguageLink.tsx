'use client'

import { writeStorage } from '@/utils/storage'

/** The other language's version of this page; the choice is remembered, as in the main nav. */
export default function LanguageLink({ href, code, short, label }: { href: string; code: string; short: string; label: string }) {
    return (
        <a
            href={href}
            hrefLang={code}
            lang={code}
            aria-label={label}
            onClick={() => writeStorage('language', code)}
            className="inline-flex items-center justify-center size-11 md:size-auto md:h-8 md:min-w-8 md:px-1.5 rounded-full t-caption font-semibold text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition-colors"
        >
            {short}
        </a>
    )
}
