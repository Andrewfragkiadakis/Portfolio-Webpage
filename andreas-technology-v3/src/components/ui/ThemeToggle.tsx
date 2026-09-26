'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { centreOf } from '@/utils/dom'
import { useEffect, useState } from 'react'

/**
 * Light/dark switch. `inline` sits in the desktop navigation bar; `floating` is the
 * round button pinned above the mobile tab bar.
 */
export default function ThemeToggle({ variant = 'floating' }: { variant?: 'floating' | 'inline' }) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Theme is only knowable after hydration; render nothing until then to avoid a flash.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMounted(true), [])

    if (!mounted) return <span className={variant === 'inline' ? 'w-9 h-9' : 'hidden'} aria-hidden="true" />

    const isDark = theme === 'dark'
    const placement = variant === 'inline'
        ? 'w-9 h-9 bg-[var(--fill)] hover:bg-[color-mix(in_srgb,var(--foreground),transparent_85%)]'
        : 'md:hidden fixed right-4 bottom-[7rem] z-50 w-12 h-12 bg-[var(--surface)]/85 backdrop-blur-xl border border-[var(--line)] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)]'

    return (
        <button
            type="button"
            onClick={(e) => setTheme(isDark ? 'light' : 'dark', centreOf(e.currentTarget))}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
            className={`${placement} rounded-full flex items-center justify-center text-[var(--foreground)] transition-colors duration-300`}
        >
            <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'} text-sm`} aria-hidden="true" />
        </button>
    )
}
