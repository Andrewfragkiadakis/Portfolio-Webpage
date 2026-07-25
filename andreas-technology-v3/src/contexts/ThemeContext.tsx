'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const SUNRISE_HOUR = 7
const SUNSET_HOUR = 20

function getThemeByTime(): Theme {
    const hour = new Date().getHours()
    return hour >= SUNRISE_HOUR && hour < SUNSET_HOUR ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark')

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

    const setTheme = (newTheme: Theme) => {
        document.documentElement.classList.add('theme-transition')
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(newTheme)
        localStorage.setItem('theme', newTheme)
        setThemeState(newTheme)

        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition')
        }, 350)
    }

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(theme)
        localStorage.setItem('theme', theme)
    }, [theme])

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
