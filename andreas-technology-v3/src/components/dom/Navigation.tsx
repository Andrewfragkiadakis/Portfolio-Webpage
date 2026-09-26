'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useContent } from '@/hooks/useContent'
import { useSectionLabels } from '@/hooks/useSectionLabels'
import { centreOf } from '@/utils/dom'
import { EASE_APPLE } from '@/utils/motion'
import { scrollToSection } from '@/utils/smooth-scroll'
import { SECTION_IDS, SECTION_STEPS, type SectionId } from '@/data/sections'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { Mark } from '@/components/ui/Mark'

/**
 * apple.com-style local nav: a 52px frosted bar with a hairline bottom edge. The mark and
 * name sit on the left like a product title; the slides, language, appearance and a
 * small blue pill sit on the right. On phones the links fold into a full-screen menu.
 */
export default function Navigation() {
    const { language, setLanguage } = useLanguage()
    const { theme, setTheme } = useTheme()
    const k = useContent().keynote
    const labels = useSectionLabels()
    const [menuOpen, setMenuOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    const firstLinkRef = useRef<HTMLButtonElement>(null)
    const menuButtonRef = useRef<HTMLButtonElement>(null)

    // Active slide: the track position on desktop, the section in mid-screen on phones.
    useEffect(() => {
        let ticking = false

        const update = () => {
            ticking = false
            if (window.matchMedia('(min-width: 64rem)').matches) {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight
                const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
                setActiveIndex(Math.round(progress * SECTION_STEPS))
                return
            }
            const mid = window.scrollY + window.innerHeight / 2
            let found = 0
            SECTION_IDS.forEach((id, i) => {
                const el = document.getElementById(id)
                if (el && el.getBoundingClientRect().top + window.scrollY <= mid) found = i
            })
            setActiveIndex(found)
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
    }, [])

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

    const go = (id: SectionId, index: number) => {
        setMenuOpen(false)
        scrollToSection(index, id)
    }

    const toggleLanguage = () => setLanguage(language === 'en' ? 'gr' : 'en')

    return (
        <>
            <header className="fixed top-0 inset-x-0 z-50">
                <nav
                    aria-label="Main navigation"
                    className={`h-[var(--nav-h)] border-b border-[var(--nav-line)] text-[var(--foreground)] transition-colors duration-300 ${menuOpen ? 'bg-[var(--background)]' : 'bg-[var(--nav-bg)] backdrop-blur-[20px] backdrop-saturate-[1.8]'}`}
                >
                    <div className="h-full px-4 sm:px-10 md:px-[max(3rem,7vw)]">
                    <div className="mx-auto h-full max-w-[71rem] flex items-center justify-between gap-6">
                        <button
                            type="button"
                            onClick={() => go('hero', 0)}
                            className="flex items-center gap-2.5 min-w-0 rounded-full"
                        >
                            <Mark size={30} priority className="-my-1" />
                            <span
                                aria-hidden="true"
                                className="md:hidden xl:inline font-[family-name:var(--font-display)] text-[1.0625rem] md:text-[1.3125rem] font-semibold leading-none tracking-[0.011em] whitespace-nowrap truncate"
                            >
                                {k.common.name}
                            </span>
                        </button>

                        <div className="flex items-center">
                            <ul className="hidden md:flex items-center gap-[1.5rem] mr-5">
                                {SECTION_IDS.map((id, i) => (
                                    <li key={id}>
                                        <button
                                            type="button"
                                            onClick={() => go(id, i)}
                                            aria-current={activeIndex === i ? 'true' : undefined}
                                            className={`t-caption whitespace-nowrap transition-colors duration-300 ${activeIndex === i ? 'text-[var(--foreground)]' : 'text-[var(--foreground)]/65 hover:text-[var(--foreground)]'}`}
                                        >
                                            {labels[id]}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                onClick={toggleLanguage}
                                aria-label={k.nav.switchLanguage}
                                className="inline-flex items-center justify-center h-8 min-w-8 px-1.5 rounded-full t-caption font-semibold text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition-colors duration-300"
                            >
                                {language === 'en' ? 'ΕΛ' : 'EN'}
                            </button>
                            <ThemeToggle />
                            <button
                                type="button"
                                onClick={() => go('contact', SECTION_IDS.length - 1)}
                                className="hidden md:inline-flex kn-pill kn-pill--fill kn-pill--nav ml-3"
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
                                className="md:hidden inline-flex items-center justify-center w-10 h-10 -mr-2.5 rounded-full"
                            >
                                <span className="relative block w-[1.0625rem] h-3" aria-hidden="true">
                                    <span className={`absolute left-0 right-0 h-[1.2px] rounded-full bg-current transition-transform duration-300 ${menuOpen ? 'top-[5px] rotate-45' : 'top-[2px]'}`} />
                                    <span className={`absolute left-0 right-0 h-[1.2px] rounded-full bg-current transition-transform duration-300 ${menuOpen ? 'top-[5px] -rotate-45' : 'top-[8px]'}`} />
                                </span>
                            </button>
                        </div>
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
                        <nav aria-label={k.nav.openMenu} className="px-10 pt-6 pb-10 flex flex-col min-h-full">
                            <ul className="flex flex-col">
                                {SECTION_IDS.map((id, i) => (
                                    <motion.li
                                        key={id}
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, ease: EASE_APPLE, delay: 0.03 * i }}
                                    >
                                        <button
                                            ref={i === 0 ? firstLinkRef : undefined}
                                            type="button"
                                            onClick={() => go(id, i)}
                                            aria-current={activeIndex === i ? 'true' : undefined}
                                            className="w-full text-left py-1.5 font-[family-name:var(--font-display)] text-[1.75rem] font-semibold leading-[1.14] tracking-[0.007em]"
                                        >
                                            {labels[id]}
                                        </button>
                                    </motion.li>
                                ))}
                            </ul>

                            <div className="mt-auto pt-10 grid grid-cols-2 gap-3">
                                <div>
                                    <p className="t-caption text-[var(--muted)] mb-2">{k.nav.appearance}</p>
                                    <button
                                        type="button"
                                        onClick={(e) => setTheme(theme === 'dark' ? 'light' : 'dark', centreOf(e.currentTarget))}
                                        className="kn-pill kn-pill--sm kn-pill--quiet w-full"
                                    >
                                        {theme === 'dark' ? k.nav.light : k.nav.dark}
                                    </button>
                                </div>
                                <div>
                                    <p className="t-caption text-[var(--muted)] mb-2">{k.nav.language}</p>
                                    <button
                                        type="button"
                                        onClick={toggleLanguage}
                                        aria-label={k.nav.switchLanguage}
                                        className="kn-pill kn-pill--sm kn-pill--quiet w-full"
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
