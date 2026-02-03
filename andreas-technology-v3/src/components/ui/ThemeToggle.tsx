'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme() // Assuming setTheme handles the switch or I need to update Context
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    const isKernel = theme === 'dark'

    return (
        <button
            type="button"
            onClick={() => setTheme(isKernel ? 'light' : 'dark')}
            aria-label={isKernel ? 'Switch to light mode' : 'Switch to dark mode'}
            className="fixed right-4 md:right-8 z-50 flex items-center gap-3 px-4 py-2 bg-[var(--background)]/80 backdrop-blur border border-[var(--foreground)] rounded-full hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors bottom-[5.5rem] md:bottom-8"
        >
            <span className="text-xs font-mono uppercase tracking-widest hidden sm:block">
                {isKernel ? 'DARK_MODE' : 'LIGHT_MODE'}
            </span>
            <div className={`w-3 h-3 rounded-full bg-[var(--accent)]`} />
        </button>
    )
}
