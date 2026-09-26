'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { useContent } from '@/hooks/useContent'
import { centreOf } from '@/utils/dom'
import { useEffect, useState } from 'react'

/**
 * Light/dark switch as a menu-bar status item. With `showLabel` it also names the
 * current theme (used in the mobile app launcher).
 */
export default function ThemeToggle({ className = '', showLabel = false }: { className?: string; showLabel?: boolean }) {
    const { theme, setTheme } = useTheme()
    const t = useContent()
    const [mounted, setMounted] = useState(false)

    // Theme is only knowable after hydration; render a placeholder until then to avoid a flash.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMounted(true), [])

    const isDark = mounted && theme === 'dark'

    return (
        <button
            type="button"
            onClick={(e) => setTheme(isDark ? 'light' : 'dark', centreOf(e.currentTarget))}
            aria-label={isDark ? t.os.aria.toLight : t.os.aria.toDark}
            className={`inline-flex items-center justify-center gap-2 rounded-md transition-colors hover:bg-[var(--control-hover)] ${className}`}
            suppressHydrationWarning
        >
            <i className={`fas ${isDark ? 'fa-moon' : 'fa-sun'}`} aria-hidden="true" />
            {showLabel && <span className="text-body-sm font-semibold">{isDark ? t.os.theme.dark : t.os.theme.light}</span>}
        </button>
    )
}
