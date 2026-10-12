'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/contexts/LocaleContext'
import { LOCALES } from '@/data/locales'
import { writeStorage } from '@/utils/storage'
import { useTheme } from '@/contexts/ThemeContext'
import { useContent } from '@/hooks/useContent'
import { centreOf } from '@/utils/dom'
import { usePresence } from '@/hooks/usePresence'
import { focusSection, scrollToSection } from '@/utils/track'
import { SECTION_IDS, type SectionId } from '@/data/sections'
import { useActiveSlide } from '@/hooks/useActiveSlide'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { Mark } from '@/components/ui/Mark'
import { DESKTOP_MEDIA_QUERY } from '@/hooks/useIsDesktop'

/**
 * apple.com-style local nav: a 52px frosted bar with a hairline bottom edge. The mark and
 * name sit on the left like a product title; the slides, language, appearance and a
 * small blue pill sit on the right. On phones the links fold into a full-screen menu.
 */
export default function Navigation() {
    const locale = useLocale()
    const other = LOCALES.find((l) => l.code !== locale) ?? LOCALES[0]
    const { theme, setTheme } = useTheme()
    const k = useContent().keynote
    const labels = k.nav.sections
    const [menuOpen, setMenuOpen] = useState(false)
    const menu = usePresence(menuOpen, 260)
    const activeIndex = useActiveSlide()
    const firstLinkRef = useRef<HTMLAnchorElement>(null)
    const menuButtonRef = useRef<HTMLButtonElement>(null)
    // Whether the visitor has moved yet: until then the address bar keeps whatever hash
    // they arrived with. After a nav jump, focus goes to the section, not back to the menu.
    const moved = useRef(false)
    const restoreFocus = useRef(true)

    useEffect(() => {
        const mark = () => { moved.current = true }
        const options = { passive: true, once: true } as const
        window.addEventListener('wheel', mark, options)
        window.addEventListener('touchstart', mark, options)
        window.addEventListener('keydown', mark, { once: true })
        return () => {
            window.removeEventListener('wheel', mark)
            window.removeEventListener('touchstart', mark)
            window.removeEventListener('keydown', mark)
        }
    }, [])

    // Keep the address bar on the slide in view, so a link or a reload lands there.
    useEffect(() => {
        if (!moved.current) return
        const url = activeIndex === 0 ? location.pathname + location.search : `#${SECTION_IDS[activeIndex]}`
        window.history.replaceState(null, '', url)
    }, [activeIndex])

    // Menu: a modal sheet. Escape closes it, focus moves in on open and back to the button
    // on close, the page behind is inert and does not scroll, and growing the window to
    // the desktop layout (where the menu does not exist) closes it.
    useEffect(() => {
        if (!menuOpen) return
        firstLinkRef.current?.focus()
        const button = menuButtonRef.current
        const main = document.getElementById('main-content')
        const root = document.documentElement
        const previousOverflow = root.style.overflow
        main?.setAttribute('inert', '')
        root.style.overflow = 'hidden'

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMenuOpen(false)
        }
        const desktop = window.matchMedia(DESKTOP_MEDIA_QUERY)
        const onDesktop = () => {
            if (desktop.matches) setMenuOpen(false)
        }
        document.addEventListener('keydown', onKeyDown)
        desktop.addEventListener('change', onDesktop)
        return () => {
            document.removeEventListener('keydown', onKeyDown)
            desktop.removeEventListener('change', onDesktop)
            main?.removeAttribute('inert')
            root.style.overflow = previousOverflow
            if (restoreFocus.current) button?.focus({ preventScroll: true })
            restoreFocus.current = true
        }
    }, [menuOpen])

    const go = (id: SectionId, index: number) => {
        moved.current = true
        restoreFocus.current = false
        setMenuOpen(false)
        void scrollToSection(index).then(() => focusSection(id))
    }

    // Each language is its own page: switching is a navigation, remembered for next time,
    // that keeps the visitor on the same slide.
    const switchLanguage = (e: React.MouseEvent<HTMLAnchorElement>) => {
        writeStorage('language', other.code)
        e.preventDefault()
        window.location.assign(other.path + window.location.hash)
    }

    return (
        <>
            <header className="fixed top-0 inset-x-0 z-50">
                <nav
                    aria-label={k.nav.main}
                    className={`h-[var(--nav-h)] border-b border-[var(--nav-line)] text-[var(--foreground)] transition-colors ${menuOpen ? 'bg-[var(--background)]' : 'bg-[var(--nav-bg)] backdrop-blur-[20px] backdrop-saturate-[1.8] reduced-transparency:backdrop-blur-none reduced-transparency:bg-[var(--background)]'}`}
                >
                    <div className="h-full px-6 sm:px-10 md:px-[max(3rem,7vw)]">
                    <div className="mx-auto h-full max-w-[71rem] flex items-center justify-between gap-3 md:gap-6">
                        <button
                            type="button"
                            onClick={() => go('hero', 0)}
                            className="flex items-center gap-2.5 min-w-0 rounded-full"
                        >
                            <Mark size={30} className="-my-1" />
                            <span
                                aria-hidden="true"
                                className="md:hidden xl:inline font-[family-name:var(--font-display)] text-[1.0625rem] md:text-[1.3125rem] font-semibold leading-none tracking-[0.011em] whitespace-nowrap truncate"
                            >
                                {/* The narrowest phones show the first name only, so the bar never truncates. */}
                                <span className="min-[25rem]:hidden">{k.common.name.split(' ')[0]}</span>
                                <span className="hidden min-[25rem]:inline">{k.common.name}</span>
                            </span>
                        </button>

                        <div className="flex items-center">
                            <ul className="hidden md:flex items-center gap-[1.5rem] mr-5">
                                {SECTION_IDS.map((id, i) => (
                                    <li key={id}>
                                        <a
                                            href={`#${id}`}
                                            onClick={(e) => { e.preventDefault(); go(id, i) }}
                                            aria-current={activeIndex === i ? 'true' : undefined}
                                            className={`t-caption whitespace-nowrap transition-colors ${activeIndex === i ? 'text-[var(--foreground)]' : 'text-[var(--foreground)]/65 hover:text-[var(--foreground)]'}`}
                                        >
                                            {labels[id]}
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            <a
                                href={other.path}
                                hrefLang={other.code}
                                lang={other.code}
                                onClick={switchLanguage}
                                aria-label={`${other.short} — ${other.label}`}
                                className="inline-flex items-center justify-center size-11 md:size-auto md:h-8 md:min-w-8 md:px-1.5 rounded-full t-caption font-semibold text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition-colors"
                            >
                                {other.short}
                            </a>
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
                                className="md:hidden inline-flex items-center justify-center size-11 -mr-3 rounded-full"
                            >
                                {/* Two lines that meet in the middle and turn into a cross: transform only. */}
                                <span className="relative block w-[1.0625rem] h-3" aria-hidden="true">
                                    <span className={`absolute left-0 right-0 top-[5px] h-[1.2px] rounded-full bg-current transition-transform duration-[var(--motion-base)] ease-apple ${menuOpen ? 'rotate-45' : '-translate-y-[3px]'}`} />
                                    <span className={`absolute left-0 right-0 top-[5px] h-[1.2px] rounded-full bg-current transition-transform duration-[var(--motion-base)] ease-apple ${menuOpen ? '-rotate-45' : 'translate-y-[3px]'}`} />
                                </span>
                            </button>
                        </div>
                    </div>
                    </div>
                </nav>
            </header>

            {menu.mounted && (
                <div
                    id="mobile-menu"
                    data-closing={menu.closing ? '' : undefined}
                    className="kn-menu md:hidden fixed inset-x-0 top-[var(--nav-h)] bottom-0 z-[55] bg-[var(--background)] text-[var(--foreground)] overflow-y-auto"
                >
                    <nav aria-label={k.nav.menu} className="px-10 pt-6 pb-10 flex flex-col min-h-full">
                        <ul className="flex flex-col">
                            {SECTION_IDS.map((id, i) => (
                                <li key={id} className="kn-menu__item" style={{ '--i': i } as React.CSSProperties}>
                                    <a
                                        ref={i === 0 ? firstLinkRef : undefined}
                                        href={`#${id}`}
                                        onClick={(e) => { e.preventDefault(); go(id, i) }}
                                        aria-current={activeIndex === i ? 'true' : undefined}
                                        className="block w-full text-left py-1.5 font-[family-name:var(--font-display)] text-[1.75rem] font-semibold leading-[1.14] tracking-[0.007em]"
                                    >
                                        {labels[id]}
                                    </a>
                                </li>
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
                                <a
                                    href={other.path}
                                    hrefLang={other.code}
                                    lang={other.code}
                                    onClick={switchLanguage}
                                    className="kn-pill kn-pill--sm kn-pill--quiet w-full"
                                >
                                    {other.label}
                                </a>
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </>
    )
}
