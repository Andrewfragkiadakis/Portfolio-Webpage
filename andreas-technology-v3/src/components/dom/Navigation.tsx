'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useContent } from '@/hooks/useContent'
import { useTheme } from '@/contexts/ThemeContext'
import { centreOf } from '@/utils/dom'
import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { EASE_OUT } from '@/utils/motion'
import Memoji from '@/components/ui/Memoji'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { scrollToSection as smoothScrollToSection } from '@/utils/smooth-scroll'
import { SECTION_IDS, SECTION_STEPS } from '@/data/sections'

const pad = (n: number) => String(n).padStart(2, '0')

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

    return (
        <nav className="fixed top-0 left-0 right-0 z-[60] bg-[var(--background)] border-b border-[var(--line)]" aria-label="Main navigation">
            <div className="px-4 md:px-[var(--gutter)] h-14 md:h-[var(--nav-h)] flex justify-between items-center gap-6 relative">
                {/* Logo: the memoji on a cobalt square, then the name. Back to the start of the journey. */}
                <button
                    type="button"
                    onClick={() => scrollToSection('hero', 0)}
                    className="group flex items-center gap-3 shrink-0"
                    aria-label={`${t.editorial.firstName} ${t.editorial.lastName} — ${t.nav.home}`}
                >
                    <Memoji size={2.25} decorative />
                    <span className="font-display font-extrabold tracking-[-0.03em] text-[0.95rem] leading-none uppercase hidden sm:inline md:hidden xl:inline" aria-hidden="true">
                        {t.hero.firstName} {t.hero.lastName}
                    </span>
                </button>

                {/* Numbered index: the active section is a cobalt block that slides between items. */}
                <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
                    {navItems.slice(1).map((item) => {
                        const isActive = activeIndex === item.i
                        return (
                            <button
                                key={item.section}
                                onClick={() => scrollToSection(item.section, item.i)}
                                aria-current={isActive ? 'true' : undefined}
                                className={`relative h-9 px-2.5 lg:px-3 eyebrow transition-colors duration-300 ${isActive ? 'text-[var(--on-block)] [--focus:var(--foreground)]' : 'text-[var(--foreground)] hover:text-[var(--accent)]'}`}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="nav-active-block"
                                        className="absolute inset-0 bg-[var(--block)]"
                                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                                        aria-hidden="true"
                                    />
                                )}
                                <span className="relative inline-flex items-baseline gap-1.5 whitespace-nowrap">
                                    <span className={`tabular ${isActive ? '' : 'text-[var(--muted)]'}`}>{pad(item.i)}</span>
                                    {item.label}
                                </span>
                            </button>
                        )
                    })}
                </div>

                <div className="hidden md:flex items-center gap-2 shrink-0">
                    <ThemeToggle />
                    <button
                        onClick={() => setLanguage(language === 'en' ? 'gr' : 'en')}
                        aria-label={language === 'en' ? 'Switch to Greek' : 'Switch to English'}
                        className="btn btn-solid btn-bar"
                    >
                        {language === 'en' ? 'GR' : 'EN'}
                    </button>
                </div>

                <ThemeToggle className="md:hidden ml-auto" />

                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden btn btn-line btn-icon min-h-0 w-11 h-11 ml-2"
                    aria-label="Toggle menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <motion.span
                        className="relative w-5 h-4 flex flex-col justify-center"
                        initial={false}
                        animate={mobileMenuOpen ? 'open' : 'closed'}
                    >
                        <motion.span
                            className="absolute left-0 right-0 h-0.5 bg-current origin-center"
                            style={{ y: -5 }}
                            variants={{ closed: { rotate: 0, y: -5 }, open: { rotate: 45, y: 0 } }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                        />
                        <motion.span
                            className="absolute left-0 right-0 h-0.5 bg-current origin-center"
                            style={{ y: 5 }}
                            variants={{ closed: { rotate: 0, y: 5 }, open: { rotate: -45, y: 0 } }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                        />
                    </motion.span>
                </button>
            </div>

            <div
                className={`md:hidden fixed inset-0 z-[100] flex flex-col surface-block transition-[clip-path,visibility] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${mobileMenuOpen ? 'visible [clip-path:inset(0_0_0_0)]' : 'invisible pointer-events-none [clip-path:inset(0_0_100%_0)]'}`}
                aria-hidden={!mobileMenuOpen}
            >
                <div className="flex justify-between items-center gap-3 px-4 h-16 border-b border-[var(--line)]">
                    <Memoji size={2.25} tone="paper" />
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="btn btn-line btn-bar h-11"
                            aria-label="Close menu"
                        >
                            <i className="fas fa-xmark" aria-hidden="true" />
                            {t.nav.close}
                        </button>
                        <button
                            onClick={(e) => setTheme(theme === 'dark' ? 'light' : 'dark', centreOf(e.currentTarget))}
                            className="btn btn-line btn-bar h-11"
                            aria-label="Toggle theme"
                        >
                            <span className="w-3 h-3 shadow-[inset_0_0_0_1.5px_currentColor] relative overflow-hidden" aria-hidden="true">
                                <span className={`absolute inset-y-0 left-0 w-1/2 bg-current ${theme === 'dark' ? '' : 'hidden'}`} />
                            </span>
                            <span suppressHydrationWarning>{theme === 'dark' ? t.editorial.dark : t.editorial.light}</span>
                        </button>
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'gr' : 'en')}
                            aria-label={language === 'en' ? 'Switch to Greek' : 'Switch to English'}
                            className="btn btn-paper btn-bar h-11 px-4"
                        >
                            {language === 'en' ? 'GR' : 'EN'}
                        </button>
                    </div>
                </div>

                <nav className="flex-1 flex flex-col justify-center px-4 overflow-y-auto" aria-label="Mobile menu">
                    <motion.ol
                        className="flex flex-col"
                        initial="closed"
                        animate={mobileMenuOpen ? 'open' : 'closed'}
                        variants={{
                            open: { transition: { staggerChildren: 0.045, delayChildren: 0.15 } },
                            closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
                        }}
                    >
                        {navItems.map((item, idx) => (
                            <motion.li
                                key={item.section}
                                className="border-b border-[var(--line)] overflow-hidden"
                                variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: 24 } }}
                                transition={{ duration: 0.35, ease: EASE_OUT }}
                            >
                                <button
                                    onClick={() => scrollToSection(item.section, item.i)}
                                    tabIndex={mobileMenuOpen ? 0 : -1}
                                    className="w-full flex items-baseline gap-4 py-3 text-left"
                                >
                                    <span className="meta tabular w-6">{pad(idx)}</span>
                                    <span className="display-heavy text-[clamp(2.25rem,11vw,3.5rem)] leading-[1]">{t.editorial.sections[item.section === 'hero' ? 'home' : item.section]}</span>
                                </button>
                            </motion.li>
                        ))}
                    </motion.ol>
                </nav>

                <div className="px-4 py-5 border-t border-[var(--line)] flex justify-between items-center meta">
                    <span>{t.nav.languageLabel}</span>
                    <span>{t.location}</span>
                </div>
            </div>
        </nav>
    )
}
