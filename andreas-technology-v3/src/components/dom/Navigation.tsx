'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useContent } from '@/hooks/useContent'
import { useTheme } from '@/contexts/ThemeContext'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { scrollToSection as smoothScrollToSection } from '@/utils/smooth-scroll'

export default function Navigation() {
    const { language, setLanguage } = useLanguage()
    const { theme, setTheme } = useTheme()
    const t = useContent()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const scrollToSection = (id: string, index: number) => {
        smoothScrollToSection(index, id)
        setMobileMenuOpen(false)
    }

    const navItems = [
        { label: t.nav.home, section: 'hero', i: 0 },
        { label: t.nav.about, section: 'about', i: 1 },
        { label: t.nav.services, section: 'services', i: 2 },
        { label: t.nav.experience, section: 'experience', i: 3 },
        { label: t.nav.projects, section: 'projects', i: 4 },
        { label: t.nav.contact, section: 'contact', i: 5 },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)] border-b border-[var(--foreground)]/20 transition-all duration-300" aria-label="Main navigation">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-4 min-h-[56px] flex justify-center items-center relative">
                <div className="hidden md:flex gap-6 lg:gap-8 items-center">
                    {navItems.map((item) => (
                        <button
                            key={item.section}
                            onClick={() => scrollToSection(item.section, item.i)}
                            className="text-[var(--foreground)] opacity-90 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300 ease-out text-sm uppercase tracking-widest cursor-pointer"
                        >
                            {item.label}
                        </button>
                    ))}
                    <button
                        onClick={() => setLanguage(language === 'en' ? 'gr' : 'en')}
                        className="ml-4 px-3 py-1 bg-[var(--foreground)]/10 hover:bg-[var(--foreground)]/20 text-[var(--foreground)] rounded transition-all duration-300 ease-out text-sm font-medium cursor-pointer"
                    >
                        {language === 'en' ? 'GR' : 'EN'}
                    </button>
                </div>

                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 text-[var(--foreground)] p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-[var(--foreground)]/10 active:bg-[var(--foreground)]/15 transition-colors duration-300 ease-out"
                    aria-label="Toggle menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <motion.span
                        className="relative w-7 h-5 flex flex-col justify-center"
                        initial={false}
                        animate={mobileMenuOpen ? 'open' : 'closed'}
                    >
                        <motion.span
                            className="absolute left-0 right-0 h-0.5 bg-current rounded-full origin-center"
                            style={{ y: -6 }}
                            variants={{ closed: { rotate: 0, y: -6 }, open: { rotate: 45, y: 0 } }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                        />
                        <motion.span
                            className="absolute left-0 right-0 h-0.5 bg-current rounded-full"
                            variants={{ closed: { opacity: 1, scaleX: 1 }, open: { opacity: 0, scaleX: 0 } }}
                            transition={{ duration: 0.15 }}
                        />
                        <motion.span
                            className="absolute left-0 right-0 h-0.5 bg-current rounded-full origin-center"
                            style={{ y: 6 }}
                            variants={{ closed: { rotate: 0, y: 6 }, open: { rotate: -45, y: 0 } }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                        />
                    </motion.span>
                </button>
            </div>

            <div
                className={`md:hidden fixed inset-0 z-[100] flex flex-col bg-[var(--background)] transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                aria-hidden={!mobileMenuOpen}
            >
                <div className="flex justify-between items-center px-6 pt-8 pb-4 border-b border-[var(--foreground)]/10">
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-5 py-3 border border-[var(--foreground)] text-[var(--foreground)] font-mono text-sm uppercase tracking-widest hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 ease-out"
                        aria-label="Close menu"
                    >
                        {t.nav.close}
                    </button>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="flex items-center gap-2 px-4 py-2 border border-[var(--foreground)] rounded-full hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors duration-300 ease-out"
                            aria-label="Toggle theme"
                        >
                            <span className="text-xs font-mono uppercase tracking-widest" suppressHydrationWarning>
                                {theme === 'dark' ? 'DARK_MODE' : 'LIGHT_MODE'}
                            </span>
                            <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
                        </button>
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'gr' : 'en')}
                            className="px-4 py-2 text-[var(--foreground)] font-mono text-xs uppercase tracking-widest border border-[var(--foreground)]/30 hover:border-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition-all duration-300 ease-out"
                        >
                            {language === 'en' ? 'GR' : 'EN'}
                        </button>
                    </div>
                </div>

                <nav className="flex-1 flex flex-col justify-start pt-6 pb-8 overflow-y-auto px-6" aria-label="Mobile navigation">
                    <motion.div
                        className="flex flex-col gap-0"
                        initial="closed"
                        animate={mobileMenuOpen ? 'open' : 'closed'}
                        variants={{
                            open: { transition: { staggerChildren: 0.04, delayChildren: 0.06 } },
                            closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
                        }}
                    >
                        {navItems.map((item, idx) => (
                            <motion.div
                                key={item.section}
                                className="flex items-center gap-4 py-3 px-4 border-b border-[var(--foreground)]/15"
                                variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: -12 } }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                            >
                                <span className="text-[10px] font-mono text-[var(--foreground)] opacity-75 uppercase tracking-[0.2em]">
                                    {(idx + 1).toString().padStart(2, '0')}
                                </span>
                                <button
                                    onClick={() => scrollToSection(item.section, item.i)}
                                    className="flex-1 text-left py-2 px-2 min-h-[48px] flex items-center text-[var(--foreground)] hover:text-[var(--accent)] hover:bg-[var(--foreground)]/5 active:bg-[var(--foreground)]/10 transition-colors duration-300 ease-out text-xl sm:text-2xl font-bold uppercase tracking-tight rounded border border-transparent hover:border-[var(--foreground)]/20"
                                >
                                    {item.label}
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                </nav>

                <div className="px-6 py-6 border-t border-[var(--foreground)]/10 flex justify-between items-center text-[var(--foreground)] opacity-80 text-sm font-mono uppercase tracking-widest">
                    <span>{t.nav.languageLabel}</span>
                    <span>{t.location}</span>
                </div>
            </div>
        </nav>
    )
}
