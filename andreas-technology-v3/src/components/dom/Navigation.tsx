'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useContent } from '@/hooks/useContent'
import { useTheme } from '@/contexts/ThemeContext'
import { centreOf } from '@/utils/dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { EASE_OUT } from '@/utils/motion'
import { scrollToSection as smoothScrollToSection } from '@/utils/smooth-scroll'
import { SECTION_IDS, SECTION_STEPS } from '@/data/sections'
import ThemeToggle from '@/components/ui/ThemeToggle'
import Image from 'next/image'

const pad = (n: number) => String(n).padStart(2, '0')

/** The owner's memoji (peeking over a MacBook) as the site mark, on a soft avatar disc. */
function Mark() {
    return (
        <span className="relative block w-9 h-9 rounded-full overflow-hidden shrink-0 bg-[linear-gradient(180deg,#e6eefb_0%,#c9d8f1_100%)] dark:bg-[linear-gradient(180deg,#30354a_0%,#1d2030_100%)] ring-1 ring-black/[0.06] dark:ring-white/10">
            <Image
                src="/favicons/android-chrome-512x512.png"
                alt="Andreas Fragkiadakis"
                width={36}
                height={36}
                priority
                className="w-full h-full object-cover scale-[1.14] translate-y-[7%]"
            />
        </span>
    )
}

export default function Navigation() {
    const { language, setLanguage } = useLanguage()
    const { theme, setTheme } = useTheme()
    const t = useContent()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)

    const scrollToSection = (id: string, index: number) => {
        smoothScrollToSection(index, id)
        setMobileMenuOpen(false)
    }

    // Derive the active section from scroll progress along the track.
    useEffect(() => {
        let ticking = false

        const update = () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight
            const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
            setActiveIndex(Math.round(progress * SECTION_STEPS))
            ticking = false
        }

        const onScroll = () => {
            if (ticking) return
            ticking = true
            requestAnimationFrame(update)
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        update()
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Close the mobile menu with Escape.
    useEffect(() => {
        if (!mobileMenuOpen) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMobileMenuOpen(false)
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [mobileMenuOpen])

    const navLabels: Record<(typeof SECTION_IDS)[number], string> = {
        hero: t.nav.home,
        about: t.nav.about,
        services: t.nav.services,
        experience: t.nav.experience,
        projects: t.nav.projects,
        contact: t.nav.contact,
    }

    const navItems = SECTION_IDS.map((section, i) => ({ section, i, label: navLabels[section] }))
    const switchLanguage = () => setLanguage(language === 'en' ? 'gr' : 'en')

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-[var(--nav-h)]" aria-label="Main navigation">
            {/* Frosted bar on its own layer: a backdrop-filter on <nav> itself would become the
                containing block of the fixed mobile menu and trap it inside the bar. */}
            <div className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-xl backdrop-saturate-150 border-b border-[var(--line)]" aria-hidden="true" />
            <div className="relative h-full max-w-[112rem] mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
                {/* Memoji mark + section counter: the number rolls as the horizontal track moves. */}
                <button
                    type="button"
                    onClick={() => scrollToSection('hero', 0)}
                    className="flex items-center gap-3 rounded-xl"
                    aria-label={`${t.name} — ${t.nav.home}`}
                >
                    <Mark />
                    <span className="md:hidden text-caption font-bold uppercase tracking-[0.04em]">{t.name}</span>
                    <span className="hidden md:flex items-center gap-2 text-caption font-semibold tabular-nums" aria-hidden="true">
                        <span className="relative inline-flex h-[1.2em] overflow-hidden text-[var(--accent)]">
                            {/* Invisible sizer: the box always fits two digits. */}
                            <span className="invisible">00</span>
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.span
                                    key={activeIndex}
                                    className="absolute inset-0"
                                    initial={{ y: '100%' }}
                                    animate={{ y: '0%' }}
                                    exit={{ y: '-100%' }}
                                    transition={{ duration: 0.45, ease: EASE_OUT }}
                                >
                                    {pad(activeIndex + 1)}
                                </motion.span>
                            </AnimatePresence>
                        </span>
                        <span className="text-[var(--muted)]">/ {pad(SECTION_IDS.length)}</span>
                    </span>
                </button>

                {/* Segmented control */}
                <div className="hidden md:flex items-center gap-0.5 p-1 rounded-full bg-[var(--fill)]">
                    {navItems.map((item) => {
                        const isActive = activeIndex === item.i
                        return (
                            <button
                                key={item.section}
                                onClick={() => scrollToSection(item.section, item.i)}
                                aria-current={isActive ? 'true' : undefined}
                                className={`relative px-3.5 lg:px-4 py-1.5 rounded-full text-[0.6875rem] lg:text-caption font-semibold uppercase tracking-[0.06em] transition-colors duration-300 ${isActive ? 'text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="nav-active-pill"
                                        className="absolute inset-0 rounded-full bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
                                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                        aria-hidden="true"
                                    />
                                )}
                                <span className="relative">{item.label}</span>
                            </button>
                        )
                    })}
                </div>

                <div className="hidden md:flex items-center gap-2">
                    <button
                        onClick={switchLanguage}
                        aria-label={language === 'en' ? 'Switch to Greek' : 'Switch to English'}
                        className="h-9 min-w-9 px-3 rounded-full bg-[var(--fill)] hover:bg-[color-mix(in_srgb,var(--foreground),transparent_85%)] text-caption font-semibold transition-colors duration-300"
                    >
                        {language === 'en' ? 'GR' : 'EN'}
                    </button>
                    <ThemeToggle variant="inline" />
                </div>

                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden w-11 h-11 -mr-1.5 flex items-center justify-center rounded-full hover:bg-[var(--fill)] transition-colors duration-300"
                    aria-label="Toggle menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <motion.span
                        className="relative w-5 h-4 flex flex-col justify-center"
                        initial={false}
                        animate={mobileMenuOpen ? 'open' : 'closed'}
                    >
                        <motion.span
                            className="absolute left-0 right-0 h-0.5 bg-current rounded-full origin-center"
                            style={{ y: -4 }}
                            variants={{ closed: { rotate: 0, y: -4 }, open: { rotate: 45, y: 0 } }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                        />
                        <motion.span
                            className="absolute left-0 right-0 h-0.5 bg-current rounded-full origin-center"
                            style={{ y: 4 }}
                            variants={{ closed: { rotate: 0, y: 4 }, open: { rotate: -45, y: 0 } }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                        />
                    </motion.span>
                </button>
            </div>

            {/* Mobile menu: the sections as a small bento. */}
            <div
                className={`md:hidden fixed inset-0 top-[var(--nav-h)] z-[100] flex flex-col bg-[var(--background)] transition-[opacity,visibility] duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                aria-hidden={!mobileMenuOpen}
            >
                <nav className="flex-1 overflow-y-auto px-4 pt-4 pb-8" aria-label="Mobile menu">
                    <motion.div
                        className="grid grid-cols-2 gap-3"
                        initial="closed"
                        animate={mobileMenuOpen ? 'open' : 'closed'}
                        variants={{
                            open: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } },
                            closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
                        }}
                    >
                        {navItems.map((item, idx) => (
                            <motion.button
                                key={item.section}
                                onClick={() => scrollToSection(item.section, item.i)}
                                tabIndex={mobileMenuOpen ? 0 : -1}
                                className={`tile tile--interactive min-h-[7.5rem] justify-between ${idx === 0 ? 'col-span-2' : ''}`}
                                variants={{ open: { opacity: 1, scale: 1 }, closed: { opacity: 0, scale: 0.96 } }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                            >
                                <span className="eyebrow tabular-nums text-[var(--accent)]">{pad(idx + 1)}</span>
                                <span className="text-xl font-bold uppercase tracking-[-0.02em]">{item.label}</span>
                            </motion.button>
                        ))}
                        <motion.div
                            className="col-span-2 grid grid-cols-2 gap-3"
                            variants={{ open: { opacity: 1, scale: 1 }, closed: { opacity: 0, scale: 0.96 } }}
                        >
                            <button
                                onClick={(e) => setTheme(theme === 'dark' ? 'light' : 'dark', centreOf(e.currentTarget))}
                                tabIndex={mobileMenuOpen ? 0 : -1}
                                className="pill pill--quiet !min-h-12"
                                aria-label="Toggle theme"
                            >
                                <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} aria-hidden="true" />
                                <span suppressHydrationWarning>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                            </button>
                            <button
                                onClick={switchLanguage}
                                tabIndex={mobileMenuOpen ? 0 : -1}
                                aria-label={language === 'en' ? 'Switch to Greek' : 'Switch to English'}
                                className="pill pill--quiet !min-h-12"
                            >
                                <i className="fas fa-globe" aria-hidden="true" />
                                {language === 'en' ? 'Ελληνικά' : 'English'}
                            </button>
                        </motion.div>
                    </motion.div>
                </nav>

                <div className="px-6 py-5 border-t border-[var(--line)] flex justify-between items-center text-caption font-semibold text-[var(--muted)]">
                    <span>{t.nav.languageLabel}</span>
                    <span>{t.location}</span>
                </div>
            </div>
        </nav>
    )
}
