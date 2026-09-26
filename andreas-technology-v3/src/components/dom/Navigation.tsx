'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useContent } from '@/hooks/useContent'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { scrollToSection as smoothScrollToSection } from '@/utils/smooth-scroll'
import { SECTION_IDS, sectionIndex, type SectionId } from '@/data/sections'
import { SECTION_APPS } from '@/data/apps'
import LocalTime from '@/components/ui/LocalTime'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { AppTile } from '@/components/ui/Window'

/**
 * Desktop: a menu bar — "AF" monogram, the front app's name, one menu per section,
 * then status items (language, theme, Athens clock).
 * Mobile: a status bar with the same status items and a launcher that opens an
 * app grid, like a phone home screen.
 */
export default function Navigation() {
    const { language, setLanguage } = useLanguage()
    const t = useContent()
    const active = useActiveSection()
    const [launcherOpen, setLauncherOpen] = useState(false)
    const closeRef = useRef<HTMLButtonElement>(null)
    const launcherButtonRef = useRef<HTMLButtonElement>(null)

    const go = (id: SectionId) => {
        smoothScrollToSection(sectionIndex(id), id)
        setLauncherOpen(false)
    }

    // Like a real menu bar, the bold item names the app that owns the front window:
    // "Contact — Mail" → "Mail", "About.app" → "About".
    const windowTitles: Record<SectionId, string> = {
        hero: t.os.windows.welcome,
        about: t.os.windows.about,
        services: t.os.windows.services,
        experience: t.os.windows.experience,
        projects: t.os.windows.projects,
        contact: t.os.windows.contact,
    }
    const title = windowTitles[active]
    const frontApp = title.includes(' — ') ? title.split(' — ').pop() : title.replace(/\.app$/, '')

    const toggleLanguage = () => setLanguage(language === 'en' ? 'gr' : 'en')

    // Escape closes the launcher; focus moves in on open and back out on close.
    useEffect(() => {
        if (!launcherOpen) return
        closeRef.current?.focus()
        const launcherButton = launcherButtonRef.current
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLauncherOpen(false)
        }
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('keydown', onKeyDown)
            launcherButton?.focus()
        }
    }, [launcherOpen])

    const languageButton = (className: string) => (
        <button
            type="button"
            onClick={toggleLanguage}
            aria-label={t.os.aria.switchLanguage}
            className={`inline-flex items-center justify-center rounded-md font-semibold tabular-nums transition-colors hover:bg-[var(--control-hover)] ${className}`}
        >
            {language === 'en' ? 'EN' : 'ΕΛ'}
        </button>
    )

    return (
        <>
            {/* ── Desktop menu bar ─────────────────────────────────────── */}
            <nav
                className="os-menubar hidden md:flex fixed top-0 inset-x-0 z-50 h-[var(--nav-h)] items-center justify-between px-3 text-body-sm text-[var(--foreground)]"
                aria-label="Main navigation"
            >
                <div className="flex items-center gap-0.5 min-w-0">
                    <button
                        type="button"
                        onClick={() => go('hero')}
                        aria-label={t.nav.home}
                        className="h-6 px-2 mr-1 rounded-md font-black tracking-tight text-[0.8125rem] hover:bg-[var(--control-hover)]"
                    >
                        AF
                    </button>
                    <span className="px-2 font-bold whitespace-nowrap" aria-hidden="true">{frontApp}</span>
                    {SECTION_IDS.map((id) => {
                        const isActive = active === id
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => go(id)}
                                aria-current={isActive ? 'true' : undefined}
                                className={`h-6 px-2.5 rounded-md whitespace-nowrap transition-colors ${isActive ? 'bg-[var(--accent-fill)] text-[var(--on-accent)]' : 'hover:bg-[var(--control-hover)]'}`}
                            >
                                {t.os.menus[id]}
                            </button>
                        )
                    })}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    {languageButton('h-6 px-2 text-xs')}
                    <ThemeToggle className="h-6 w-7 text-xs" />
                    <span className="h-6 px-2 inline-flex items-center gap-2 font-medium tabular-nums whitespace-nowrap">
                        <span className="text-[var(--muted)]">{t.location.split(',')[0]}</span>
                        <LocalTime showOffset={false} />
                    </span>
                </div>
            </nav>

            {/* ── Mobile status bar ────────────────────────────────────── */}
            <div className="md:hidden fixed top-0 inset-x-0 z-50 os-menubar h-[var(--nav-h)] flex items-center justify-between pl-4 pr-2 text-[var(--foreground)]">
                <button type="button" onClick={() => go('hero')} aria-label={t.nav.home} className="flex items-center gap-2.5 min-h-11 pr-2">
                    <span className="app-tile w-7 h-7 text-[0.6875rem] font-black" style={{ background: SECTION_APPS.hero.tile }} aria-hidden="true">AF</span>
                    <LocalTime showOffset={false} className="text-sm font-semibold tabular-nums" />
                </button>
                <div className="flex items-center gap-1">
                    {languageButton('min-w-11 h-11 text-sm')}
                    <ThemeToggle className="w-11 h-11 text-base" />
                    <button
                        ref={launcherButtonRef}
                        type="button"
                        onClick={() => setLauncherOpen((open) => !open)}
                        aria-label={t.os.aria.menu}
                        aria-expanded={launcherOpen}
                        className="w-11 h-11 inline-flex items-center justify-center rounded-md text-lg hover:bg-[var(--control-hover)]"
                    >
                        <i className="fas fa-grip" aria-hidden="true" />
                    </button>
                </div>
            </div>

            {/* ── Mobile launcher: the sections as a home-screen app grid ── */}
            <div
                className={`md:hidden fixed inset-0 z-[100] flex flex-col transition-[opacity,visibility] duration-300 ${launcherOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                aria-hidden={!launcherOpen}
                role="dialog"
                aria-modal="true"
                aria-label={t.os.aria.menu}
            >
                <div className="absolute inset-0 os-glass" onClick={() => setLauncherOpen(false)} />
                <div className="relative flex items-center justify-between px-4 h-[var(--nav-h)]">
                    <span className="text-sm font-semibold">{t.os.displayName}</span>
                    <button
                        ref={closeRef}
                        type="button"
                        onClick={() => setLauncherOpen(false)}
                        className="os-btn os-btn--secondary min-h-11 caps-gr"
                    >
                        {t.projectsSection.close}
                    </button>
                </div>

                <nav className="relative flex-1 px-6 pt-8" aria-label="Mobile menu">
                    <motion.ul
                        className="grid grid-cols-3 gap-x-4 gap-y-7"
                        initial={false}
                        animate={launcherOpen ? 'open' : 'closed'}
                        variants={{ open: { transition: { staggerChildren: 0.03 } }, closed: {} }}
                    >
                        {SECTION_IDS.map((id) => (
                            <motion.li
                                key={id}
                                variants={{ open: { opacity: 1, scale: 1 }, closed: { opacity: 0, scale: 0.85 } }}
                                transition={{ duration: 0.25 }}
                            >
                                <button
                                    type="button"
                                    onClick={() => go(id)}
                                    aria-current={active === id ? 'true' : undefined}
                                    tabIndex={launcherOpen ? 0 : -1}
                                    className="w-full flex flex-col items-center gap-2 rounded-2xl py-1"
                                >
                                    <AppTile app={SECTION_APPS[id]} size="xl" />
                                    <span className={`text-xs font-semibold text-center leading-tight ${active === id ? 'text-[var(--accent)]' : ''}`}>{t.os.menus[id]}</span>
                                </button>
                            </motion.li>
                        ))}
                    </motion.ul>
                </nav>

                <div className="relative mx-4 mb-8 os-card flex items-center justify-between gap-3 p-2">
                    <ThemeToggle showLabel className="h-11 px-3" />
                    <button
                        type="button"
                        onClick={toggleLanguage}
                        tabIndex={launcherOpen ? 0 : -1}
                        aria-label={t.os.aria.switchLanguage}
                        className="h-11 px-3 inline-flex items-center gap-2 rounded-md text-body-sm font-semibold hover:bg-[var(--control-hover)]"
                    >
                        <i className="fas fa-globe" aria-hidden="true" />
                        {t.nav.languageLabel}
                    </button>
                    <span className="px-3 text-body-sm text-[var(--muted)]">{t.location}</span>
                </div>
            </div>
        </>
    )
}
