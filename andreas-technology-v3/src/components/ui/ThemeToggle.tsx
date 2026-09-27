'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { useContent } from '@/hooks/useContent'
import { centreOf } from '@/utils/dom'
import { useEffect, useState } from 'react'

/**
 * Light/dark switch as a text control: a half-filled square plus the name of the
 * current theme. Lives in the top bar on every screen size.
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
    const { theme, setTheme } = useTheme()
    const t = useContent()
    const [mounted, setMounted] = useState(false)

    // Theme is only knowable after hydration; render nothing until then to avoid a flash.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    const isDark = theme === 'dark'

    return (
        <button
            type="button"
            onClick={(e) => setTheme(isDark ? 'light' : 'dark', centreOf(e.currentTarget))}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`group inline-flex items-center gap-2 text-caption font-medium uppercase tracking-[0.06em] hover:text-[var(--accent-ink)] transition-colors min-h-11 min-w-11 md:min-w-0 justify-center md:min-h-8 ${className}`}
        >
            <span
                className="relative block w-3 h-3 rounded-full border border-current overflow-hidden transition-transform duration-500 group-hover:rotate-180"
                aria-hidden="true"
            >
                <span className="absolute inset-y-0 left-0 w-1/2 bg-current" />
            </span>
            <span className="hidden md:inline" suppressHydrationWarning>{isDark ? t.editorial.dark : t.editorial.light}</span>
        </button>
    )
}
