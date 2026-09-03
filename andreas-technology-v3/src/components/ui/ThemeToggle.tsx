'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { useEffect, useState } from 'react'
import { startNamedViewTransition } from '@/utils/view-transition'
import { useHaptics } from '@/hooks/useHaptics'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme() // Assuming setTheme handles the switch or I need to update Context
    const [mounted, setMounted] = useState(false)
    const haptics = useHaptics()

    // Theme is only knowable after hydration; render nothing until then to avoid a flash.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    const isKernel = theme === 'dark'

    /**
     * Sweep the new theme in from the toggle itself. The origin is published as CSS custom
     * properties so the keyframe can centre its circle on the button the user just pressed,
     * which is the difference between "the page changed" and "I changed the page".
     */
    const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
        haptics.impact()

        const rect = event.currentTarget.getBoundingClientRect()
        const root = document.documentElement
        root.style.setProperty('--theme-origin-x', `${((rect.left + rect.width / 2) / window.innerWidth) * 100}%`)
        root.style.setProperty('--theme-origin-y', `${((rect.top + rect.height / 2) / window.innerHeight) * 100}%`)

        startNamedViewTransition('theme', () => setTheme(isKernel ? 'light' : 'dark'))
    }

    return (
        <button
            type="button"
            onClick={handleToggle}
            aria-label={isKernel ? 'Switch to light mode' : 'Switch to dark mode'}
            className="liquid-glass fixed right-4 md:right-8 z-50 flex items-center gap-3 px-4 py-2 rounded-full hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors bottom-[7rem] md:bottom-8"
        >
            <span className="text-xs font-mono uppercase tracking-widest hidden sm:block">
                {isKernel ? 'DARK_MODE' : 'LIGHT_MODE'}
            </span>
            <div className={`w-3 h-3 rounded-full bg-[var(--accent)]`} />
        </button>
    )
}
