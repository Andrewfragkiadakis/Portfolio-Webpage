'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { readStorage, writeStorage } from '@/utils/storage'

export type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    /**
     * Switch theme. Pass the click point to reveal the new theme as a circle growing
     * from it (View Transitions API); unsupported browsers and reduced motion swap instantly.
     */
    setTheme: (theme: Theme, origin?: { x: number; y: number }) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// The <head> script paints the first theme before React loads. After that the <html>
// class is the single source of truth and paint() is its only writer, so hydration
// never repaints the page in a different theme.
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
        listeners.delete(listener)
    }
}

const getSnapshot = (): Theme => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
const getServerSnapshot = (): Theme => 'light'

function paint(theme: Theme) {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
        meta.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff')
    })
    listeners.forEach((listener) => listener())
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

    // Follow the system appearance until the visitor picks a theme themselves.
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const follow = (e: MediaQueryListEvent) => {
            if (!readStorage('theme')) paint(e.matches ? 'dark' : 'light')
        }
        mq.addEventListener('change', follow)
        return () => mq.removeEventListener('change', follow)
    }, [])

    const setTheme = useCallback((next: Theme, origin?: { x: number; y: number }) => {
        const commit = () => {
            writeStorage('theme', next)
            paint(next)
        }
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (!origin || reduceMotion || typeof document.startViewTransition !== 'function') {
            commit()
            return
        }
        const { x, y } = origin
        const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
        document.startViewTransition(() => flushSync(commit)).ready.then(() => {
            document.documentElement.animate(
                { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
                { duration: 500, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
            )
        }).catch(() => { /* transition skipped — the theme is already applied */ })
    }, [])

    const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
