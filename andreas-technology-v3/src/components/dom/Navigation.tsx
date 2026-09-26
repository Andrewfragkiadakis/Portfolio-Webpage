'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useContent } from '@/hooks/useContent'
import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { scrollToSection as smoothScrollToSection } from '@/utils/smooth-scroll'
import { SECTION_IDS, SECTION_STEPS } from '@/data/sections'
import ThemeToggle from '@/components/ui/ThemeToggle'

const pad = (n: number) => String(n).padStart(2, '0')

function LanguageSwitch({ className = '' }: { className?: string }) {
    const { language, setLanguage } = useLanguage()
    return (
        <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'gr' : 'en')}
            aria-label={language === 'en' ? 'Switch to Greek' : 'Switch to English'}
            className={`inline-flex items-center gap-1 text-caption font-medium uppercase tracking-[0.06em] ${className}`}
        >
            <span className={language === 'en' ? 'text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}>EN</span>
            <span className="text-[var(--muted)]" aria-hidden="true">/</span>
            <span className={language === 'gr' ? 'text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}>GR</span>
        </button>
    )
}

export default function Navigation() {
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
        <nav className="fixed top-0 left-0 right-0 z-[60] bg-[var(--background)] rule-b md:border-b-0" aria-label="Main navigation">
            <div className="h-[var(--nav-h)] px-4 md:px-10 grid grid-cols-[1fr_auto_auto] md:grid-cols-12 gap-x-5 md:gap-x-6 items-center">
                <button
                    type="button"
                    onClick={() => scrollToSection('hero', 0)}
                    aria-label={`${t.editorial.firstName} ${t.editorial.lastName} — ${t.nav.home}`}
                    className="md:col-span-3 justify-self-start text-sm font-semibold tracking-[-0.01em] hover:text-[var(--accent-ink)] transition-colors"
                >
                    {t.editorial.firstName} {t.editorial.lastName}
                    <span className="text-[var(--accent)]" aria-hidden="true">.</span>
                </button>

                {/* Desktop index */}
                <ul className="hidden md:flex md:col-span-7 items-center gap-x-6 lg:gap-x-7">
                    {navItems.slice(1).map((item) => {
                        const isActive = activeIndex === item.i
                        return (
                            <li key={item.section}>
                                <button
                                    type="button"
                                    onClick={() => scrollToSection(item.section, item.i)}
                                    aria-current={isActive ? 'true' : undefined}
                                    className={`group relative inline-flex items-baseline gap-1.5 py-1 text-caption font-medium uppercase tracking-[0.06em] transition-colors duration-300 ${isActive ? 'text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
                                >
                                    <span className={`tabular transition-colors ${isActive ? 'text-[var(--accent-ink)]' : ''}`}>{pad(item.i)}</span>
                                    <span className="whitespace-nowrap">{item.label}</span>
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-active-rule"
                                            className="absolute -bottom-[0.9rem] left-0 right-0 h-[2px] bg-[var(--accent)]"
                                            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                                            aria-hidden="true"
                                        />
                                    )}
                                </button>
                            </li>
                        )
                    })}
                </ul>

                <div className="hidden md:flex md:col-span-2 items-center justify-end gap-5">
                    <LanguageSwitch />
                    <ThemeToggle />
                </div>

                {/* Mobile */}
                <ThemeToggle className="md:hidden" />
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden -mr-2 px-2 min-h-11 inline-flex items-center gap-2 text-caption font-medium uppercase tracking-[0.06em]"
                    aria-label="Toggle menu"
                    aria-expanded={mobileMenuOpen}
                >
                    {mobileMenuOpen ? t.nav.close : t.editorial.menu}
                    <span className="relative w-4 h-2.5" aria-hidden="true">
                        <span className={`absolute left-0 right-0 h-px bg-current transition-transform duration-300 ${mobileMenuOpen ? 'top-1/2 rotate-45' : 'top-0'}`} />
                        <span className={`absolute left-0 right-0 h-px bg-current transition-transform duration-300 ${mobileMenuOpen ? 'top-1/2 -rotate-45' : 'bottom-0'}`} />
                    </span>
                </button>
            </div>

            <div
                className={`md:hidden fixed inset-x-0 top-[var(--nav-h)] bottom-0 z-[100] flex flex-col bg-[var(--background)] transition-[opacity,visibility] duration-300 ease-out ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                aria-hidden={!mobileMenuOpen}
            >
                <nav className="flex-1 overflow-y-auto px-4 pt-4" aria-label="Mobile menu">
                    <motion.ul
                        initial="closed"
                        animate={mobileMenuOpen ? 'open' : 'closed'}
                        variants={{
                            open: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
                            closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
                        }}
                    >
                        {navItems.map((item) => (
                            <motion.li
                                key={item.section}
                                className="rule-b first:rule-t-strong"
                                variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: 8 } }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                            >
                                <button
                                    type="button"
                                    onClick={() => scrollToSection(item.section, item.i)}
                                    tabIndex={mobileMenuOpen ? 0 : -1}
                                    className="w-full grid grid-cols-[2.5rem_1fr] items-baseline py-3 text-left hover:text-[var(--accent-ink)] transition-colors"
                                >
                                    <span className="index text-sm tabular">{pad(item.i)}</span>
                                    <span className="display text-[2.5rem] leading-none">{t.editorial.sections[item.section === 'hero' ? 'home' : item.section]}</span>
                                </button>
                            </motion.li>
                        ))}
                    </motion.ul>
                </nav>

                <div className="px-4 py-5 rule-t flex justify-between items-center">
                    <LanguageSwitch className="min-h-11" />
                    <span className="meta">{t.location}</span>
                </div>
            </div>
        </nav>
    )
}
