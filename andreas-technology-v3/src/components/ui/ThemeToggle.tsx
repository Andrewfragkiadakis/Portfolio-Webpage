'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { useContent } from '@/hooks/useContent'
import { centreOf } from '@/utils/dom'
import { useEffect, useState } from 'react'

/** Round sun/moon button used in the global nav. */
export default function ThemeToggle({ className = '' }: { className?: string }) {
    const { theme, setTheme } = useTheme()
    const k = useContent().keynote
    const [mounted, setMounted] = useState(false)

    // Theme is only knowable after hydration; keep the slot but hide the icon until then.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMounted(true), [])

    const isDark = theme === 'dark'

    return (
        <button
            type="button"
            onClick={(e) => setTheme(isDark ? 'light' : 'dark', centreOf(e.currentTarget))}
            aria-label={isDark ? k.nav.toLight : k.nav.toDark}
            className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors duration-300 ${className}`}
        >
            <svg viewBox="0 0 20 20" className={`w-[1.05rem] h-[1.05rem] transition-opacity ${mounted ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" fill="none">
                {isDark ? (
                    <>
                        <circle cx="10" cy="10" r="3.6" stroke="currentColor" strokeWidth="1.6" />
                        <path d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </>
                ) : (
                    <path d="M16.5 12.3A6.8 6.8 0 0 1 7.7 3.5a6.8 6.8 0 1 0 8.8 8.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                )}
            </svg>
        </button>
    )
}
