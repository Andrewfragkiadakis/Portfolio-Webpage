'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark')

    useEffect(() => {
        // Check system preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
            // Only auto-set if user hasn't manually set? 
            // For now let's just respect system initially then allow override.
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light')
            }
        }

        // Set initial theme
        const stored = localStorage.getItem('theme') as Theme
        if (stored) {
            setTheme(stored)
        } else {
            updateTheme(mediaQuery)
        }

        // Listen for changes
        mediaQuery.addEventListener('change', updateTheme)

        return () => mediaQuery.removeEventListener('change', updateTheme)
    }, [])

    // Apply theme class to document
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
