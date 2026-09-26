'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { useContent } from '@/hooks/useContent'
import { centreOf } from '@/utils/dom'
import { useEffect, useState } from 'react'
import Icon from '@/components/ui/Icon'

/** Flip light/dark, revealing the new theme from `origin` (an element's centre). */
export function useToggleAppearance() {
    const { theme, setTheme } = useTheme()
    return (origin?: Element | null) => setTheme(theme === 'dark' ? 'light' : 'dark', origin ? centreOf(origin) : undefined)
}

/**
 * Light/dark switch as a menu-bar status item. With `showLabel` it also names the
 * current theme (used in the phone launcher).
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
            className={`inline-flex items-center justify-center gap-2 rounded-[0.3125rem] transition-colors hover:bg-[var(--control-hover)] ${className}`}
            suppressHydrationWarning
        >
            <Icon name={isDark ? 'moon' : 'sun.max'} />
            {showLabel && <span className="text-body-sm font-medium">{isDark ? t.os.theme.dark : t.os.theme.light}</span>}
        </button>
    )
}
