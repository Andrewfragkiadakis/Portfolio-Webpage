'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { useContent } from '@/hooks/useContent'
import { centreOf } from '@/utils/dom'
import { useEffect, useState } from 'react'

/** Theme switch, set inline in the navigation bar (desktop and mobile). */
export default function ThemeToggle({ className = '' }: { className?: string }) {
    const { theme, setTheme } = useTheme()
    const t = useContent()
    const [mounted, setMounted] = useState(false)

    // Theme is only knowable after hydration; render nothing until then to avoid a flash.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMounted(true), [])

    // Same footprint as the real button, so the bar does not shift on hydration.
    if (!mounted) return <span className={`inline-block h-11 w-11 md:h-9 sm:w-[5.5rem] ${className}`} aria-hidden="true" />

    const isDark = theme === 'dark'

    return (
        <button
            type="button"
            onClick={(e) => setTheme(isDark ? 'light' : 'dark', centreOf(e.currentTarget))}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`btn btn-line btn-bar h-11 min-w-11 md:h-9 md:min-w-0 ${className}`}
        >
            {/* Half-filled square: the two themes as two blocks. */}
            <span className="relative w-3 h-3 shadow-[inset_0_0_0_1.5px_currentColor] overflow-hidden" aria-hidden="true">
                <span className={`absolute inset-y-0 left-0 w-1/2 bg-current transition-transform duration-500 ${isDark ? 'translate-x-full' : ''}`} />
            </span>
            <span className="hidden sm:block">{isDark ? t.editorial.dark : t.editorial.light}</span>
        </button>
    )
}
