'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark')

    useEffect(() => {
        const stored = localStorage.getItem('theme') as Theme | null
        if (stored === 'light' || stored === 'dark') {
            setThemeState(stored)
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setThemeState(prefersDark ? 'dark' : 'light')
        }

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
