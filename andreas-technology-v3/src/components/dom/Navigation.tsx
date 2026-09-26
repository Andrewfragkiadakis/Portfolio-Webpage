'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useContent } from '@/hooks/useContent'
import { useIsDesktop } from '@/hooks/useIsDesktop'
import { centreOf } from '@/utils/dom'
import { EASE_OUT } from '@/utils/motion'
import { scrollToSection } from '@/utils/smooth-scroll'
import { SECTION_IDS, SECTION_STEPS, type SectionId } from '@/data/sections'
import ThemeToggle from '@/components/ui/ThemeToggle'

/**
 * Apple-style global nav: a slim translucent bar with the name on the left, the six
 * slides in the middle, and language, appearance and a "Let's talk" pill on the right.
 * The bar takes on the tone of the slide beneath it, so it is black over black slides
 * and white over white ones.
 */
export default function Navigation() {
    const { language, setLanguage } = useLanguage()
    const { theme, setTheme } = useTheme()
    const t = useContent()
    const k = t.keynote
    const isDesktop = useIsDesktop()
    const [menuOpen, setMenuOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    const [toneIndex, setToneIndex] = useState(0)
    const firstLinkRef = useRef<HTMLButtonElement>(null)
    const menuButtonRef = useRef<HTMLButtonElement>(null)

    // Active slide (for the links) and the slide under the bar (for its tone).
    useEffect(() => {
        let ticking = false

        const indexAt = (y: number) => {
            let found = 0
            SECTION_IDS.forEach((id, i) => {
                const el = document.getElementById(id)
                if (el && el.getBoundingClientRect().top + window.scrollY <= y) found = i
            })
            return found
        }

        const update = () => {
            ticking = false
            if (window.matchMedia('(min-width: 64rem)').matches) {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight
                const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
                const index = Math.round(progress * SECTION_STEPS)
                setActiveIndex(index)
                setToneIndex(index)
                return
            }
            setActiveIndex(indexAt(window.scrollY + window.innerHeight / 2))
            // The slide showing through the bar's bottom edge decides its tone.
            const navBottom = document.querySelector('header nav')?.getBoundingClientRect().bottom ?? 48
            setToneIndex(indexAt(window.scrollY + navBottom))
        }

        const onScroll = () => {
            if (ticking) return
            ticking = true
            requestAnimationFrame(update)
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        update()
        return () => {
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
        }
    }, [isDesktop])

    // Menu: Escape closes it, focus moves in on open and back to the button on close.
    useEffect(() => {
        if (!menuOpen) return
        firstLinkRef.current?.focus()
        const button = menuButtonRef.current
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMenuOpen(false)
        }
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('keydown', onKeyDown)
            button?.focus()
        }
    }, [menuOpen])

    const labels: Record<SectionId, string> = {
        hero: k.nav.home,
        about: k.nav.about,
        services: k.nav.services,
        experience: k.nav.experience,
        projects: k.nav.projects,
        contact: k.nav.contact,
    }

    const go = (id: SectionId, index: number) => {
        setMenuOpen(false)
        scrollToSection(index, id)
    }

    const toggleLanguage = () => setLanguage(language === 'en' ? 'gr' : 'en')
    const tone = menuOpen ? undefined : toneIndex % 2 === 0 ? 'primary' : 'inverse'

    return (
        <>
            <header data-tone={tone} className="fixed top-0 inset-x-0 z-50">
                <nav
                    aria-label="Main navigation"
                    className="h-[var(--nav-h)] bg-[var(--background)]/80 backdrop-blur-xl backdrop-saturate-150 border-b border-[var(--line)] text-[var(--foreground)] transition-colors duration-500"
                >
                    <div className="mx-auto h-full max-w-[76rem] px-4 sm:px-8 md:px-[max(1.5rem,3vw)] xl:px-0 flex items-center justify-between gap-6">
                        <button
                            type="button"
                            onClick={() => go('hero', 0)}
                            className="text-[0.9375rem] font-semibold tracking-[-0.015em] whitespace-nowrap"
                        >
                            {k.common.name}
                        </button>

                        <ul className="hidden md:flex items-center gap-[min(2.2vw,2rem)]">
                            {SECTION_IDS.map((id, i) => (
                                <li key={id}>
                                    <button
                                        type="button"
                                        onClick={() => go(id, i)}
                                        aria-current={activeIndex === i ? 'true' : undefined}
                                        className={`text-caption tracking-[-0.005em] transition-colors duration-300 ${activeIndex === i ? 'text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
                                    >
                                        {labels[id]}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={toggleLanguage}
                                aria-label={k.nav.switchLanguage}
                                className="inline-flex items-center justify-center h-9 min-w-9 px-2 rounded-full text-caption font-semibold hover:bg-[var(--surface)] transition-colors duration-300"
                            >
                                {language === 'en' ? 'ΕΛ' : 'EN'}
                            </button>
                            <ThemeToggle />
                            <button
                                type="button"
                                onClick={() => go('contact', SECTION_IDS.length - 1)}
                                className="hidden md:inline-flex kn-pill kn-pill--fill !min-h-0 !py-1 !px-3.5 !text-caption ml-2"
                            >
                                {k.nav.cta}
                            </button>
                            <button
                                ref={menuButtonRef}
                                type="button"
                                onClick={() => setMenuOpen((open) => !open)}
                                aria-label={menuOpen ? k.nav.closeMenu : k.nav.openMenu}
                                aria-expanded={menuOpen}
                                aria-controls="mobile-menu"
                                className="md:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 rounded-full"
                            >
                                <span className="relative block w-[1.1rem] h-3" aria-hidden="true">
                                    <span className={`absolute left-0 right-0 h-[1.5px] rounded-full bg-current transition-transform duration-300 ${menuOpen ? 'top-[5px] rotate-45' : 'top-[1px]'}`} />
                                    <span className={`absolute left-0 right-0 h-[1.5px] rounded-full bg-current transition-transform duration-300 ${menuOpen ? 'top-[5px] -rotate-45' : 'top-[9px]'}`} />
                                </span>
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        id="mobile-menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="md:hidden fixed inset-x-0 top-[var(--nav-h)] bottom-0 z-[55] bg-[var(--background)] text-[var(--foreground)] overflow-y-auto"
                    >
                        <nav aria-label={k.nav.openMenu} className="px-8 pt-8 pb-10 flex flex-col min-h-full">
                            <ul className="flex flex-col gap-1">
                                {SECTION_IDS.map((id, i) => (
                                    <motion.li
                                        key={id}
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35, ease: EASE_OUT, delay: 0.03 * i }}
                                    >
                                        <button
                                            ref={i === 0 ? firstLinkRef : undefined}
                                            type="button"
                                            onClick={() => go(id, i)}
                                            aria-current={activeIndex === i ? 'true' : undefined}
                                            className="w-full text-left py-2 text-[1.75rem] font-semibold tracking-[-0.02em]"
                                        >
                                            {labels[id]}
                                        </button>
                                    </motion.li>
                                ))}
                            </ul>

                            <div className="mt-auto pt-10 grid grid-cols-2 gap-3 text-body-sm">
                                <div>
                                    <p className="text-caption text-[var(--muted)] mb-2">{k.nav.appearance}</p>
                                    <button
                                        type="button"
                                        onClick={(e) => setTheme(theme === 'dark' ? 'light' : 'dark', centreOf(e.currentTarget))}
                                        className="kn-pill kn-pill--sm bg-[var(--surface)] w-full"
                                    >
                                        {theme === 'dark' ? k.nav.light : k.nav.dark}
                                    </button>
                                </div>
                                <div>
                                    <p className="text-caption text-[var(--muted)] mb-2">{k.nav.language}</p>
                                    <button
                                        type="button"
                                        onClick={toggleLanguage}
                                        aria-label={k.nav.switchLanguage}
                                        className="kn-pill kn-pill--sm bg-[var(--surface)] w-full"
                                    >
                                        {language === 'en' ? 'Ελληνικά' : 'English'}
                                    </button>
                                </div>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
