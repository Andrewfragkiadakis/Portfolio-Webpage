'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { flushSync } from 'react-dom'

type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    /**
     * Switch theme. Pass the click point to reveal the new theme as a circle growing
     * from it (View Transitions API); unsupported browsers and reduced motion get a fade.
     */
    setTheme: (theme: Theme, origin?: { x: number; y: number }) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const SUNRISE_HOUR = 7
const SUNSET_HOUR = 20

function getThemeByTime(): Theme {
    const hour = new Date().getHours()
    return hour >= SUNRISE_HOUR && hour < SUNSET_HOUR ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    // null until mounted: the <head> script has already put the right class on <html>,
    // and the effect below must not touch it before the stored theme is known. (It used
    // to apply the 'dark' default first, so every light-theme load flipped <html> to
    // dark and back during hydration: two full-page style recalcs, ~70 ms on a phone.)
    const [resolved, setThemeState] = useState<Theme | null>(null)
    const theme: Theme = resolved ?? 'dark'

    useEffect(() => {
        // localStorage and matchMedia are browser-only, so the real theme can only be
        // resolved after hydration. An inline script in <head> paints the correct theme
        // first so this never causes a visible flash.
        /* eslint-disable react-hooks/set-state-in-effect */
        const stored = localStorage.getItem('theme') as Theme | null
        if (stored === 'light' || stored === 'dark') {
            setThemeState(stored)
        } else {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            if (mediaQuery.media !== 'not all' && mediaQuery.matches !== undefined) {
                const hasExplicitPreference =
                    window.matchMedia('(prefers-color-scheme: dark)').matches ||
                    window.matchMedia('(prefers-color-scheme: light)').matches
                if (hasExplicitPreference) {
                    setThemeState(mediaQuery.matches ? 'dark' : 'light')
                } else {
                    setThemeState(getThemeByTime())
                }
            } else {
                setThemeState(getThemeByTime())
            }
        }
        /* eslint-enable react-hooks/set-state-in-effect */

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const updateTheme = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('theme')) {
                setThemeState(e.matches ? 'dark' : 'light')
            }
        }
        mediaQuery.addEventListener('change', updateTheme)
        return () => mediaQuery.removeEventListener('change', updateTheme)
    }, [])

    const applyTheme = (newTheme: Theme) => {
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(newTheme)
        localStorage.setItem('theme', newTheme)
        setThemeState(newTheme)
    }

    const setTheme = (newTheme: Theme, origin?: { x: number; y: number }) => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (origin && !reduceMotion && typeof document.startViewTransition === 'function') {
            const { x, y } = origin
            const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
            const transition = document.startViewTransition(() => {
                flushSync(() => applyTheme(newTheme))
            })
            transition.ready.then(() => {
                document.documentElement.animate(
                    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
                    { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
                )
            }).catch(() => { /* transition skipped — theme is already applied */ })
            return
        }

        document.documentElement.classList.add('theme-transition')
        applyTheme(newTheme)
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition')
        }, 350)
    }

    useEffect(() => {
        if (!resolved) return
        const root = document.documentElement
        if (!root.classList.contains(resolved)) {
            root.classList.remove('light', 'dark')
            root.classList.add(resolved)
        }
        localStorage.setItem('theme', resolved)
    }, [resolved])

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
