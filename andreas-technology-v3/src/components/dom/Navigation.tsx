'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useContent } from '@/hooks/useContent'
import { useDesktopActions, useDesktopState } from '@/contexts/DesktopContext'
import { useState, useEffect, useRef, useCallback, type ReactNode, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { SECTION_IDS, type SectionId } from '@/data/sections'
import { WINDOW_IDS, appNameOf, windowTitle, type WindowId } from '@/data/apps'
import { RESUME_URL } from '@/data/content'
import { gmailComposeUrl } from '@/utils/links'
import { MENU_TRANSITION } from '@/utils/motion'
import LocalTime from '@/components/ui/LocalTime'
import ThemeToggle, { useToggleAppearance } from '@/components/ui/ThemeToggle'
import AppIcon, { Avatar } from '@/components/ui/AppIcon'
import Icon, { type SymbolName } from '@/components/ui/Icon'
import ControlCenter from '@/components/ui/ControlCenter'
import { SECTION_SYMBOL } from '@/components/ui/Finder'

/* ─── Menu model ─────────────────────────────────────────────────────── */

type MenuEntry =
    | {
        kind: 'item'
        label: string
        /** Receives the chosen item, e.g. as the origin of the theme reveal. */
        onSelect?: (el: HTMLElement) => void
        href?: string
        external?: boolean
        download?: boolean
        /** Radio-style check (✓) or the ◆ macOS shows for minimised windows. */
        mark?: 'check' | 'diamond'
        radio?: boolean
        disabled?: boolean
        icon?: SymbolName
        meta?: ReactNode
    }
    | { kind: 'sep' }

interface MenuDef {
    id: string
    label: ReactNode
    ariaLabel?: string
    className?: string
    entries: MenuEntry[]
}


/* ─── Menu bar ───────────────────────────────────────────────────────── */

function MenuBar({ menus, label }: { menus: MenuDef[]; label: string }) {
    const [open, setOpen] = useState<string | null>(null)
    const reduceMotion = useReducedMotion()
    const barRef = useRef<HTMLDivElement>(null)
    const triggers = useRef(new Map<string, HTMLButtonElement>())
    const focusFirst = useRef<'first' | 'last' | null>(null)

    const menuItems = (id: string) =>
        Array.from(barRef.current?.querySelectorAll<HTMLElement>(`[data-menu="${id}"] [role^="menuitem"]:not([aria-disabled="true"])`) ?? [])

    const openRef = useRef<string | null>(null)
    useEffect(() => {
        openRef.current = open
    }, [open])

    const close = useCallback((returnFocus = false) => {
        const current = openRef.current
        setOpen(null)
        if (returnFocus && current) triggers.current.get(current)?.focus()
    }, [])

    // Focus the first (or last) item once a menu opened from the keyboard has rendered.
    useEffect(() => {
        if (!open || !focusFirst.current) return
        const items = menuItems(open)
        const target = focusFirst.current === 'last' ? items[items.length - 1] : items[0]
        focusFirst.current = null
        target?.focus()
    }, [open])

    // Click outside or Escape anywhere closes the open menu.
    useEffect(() => {
        if (!open) return
        const onPointerDown = (e: PointerEvent) => {
            if (!barRef.current?.contains(e.target as Node)) close()
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close(true)
        }
        document.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('pointerdown', onPointerDown)
            document.removeEventListener('keydown', onKey)
        }
    }, [open, close])

    const neighbour = (id: string, step: number) => {
        const index = menus.findIndex((m) => m.id === id)
        return menus[(index + step + menus.length) % menus.length].id
    }

    const onTriggerKey = (e: ReactKeyboardEvent<HTMLButtonElement>, id: string) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            focusFirst.current = 'first'
            setOpen(id)
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            focusFirst.current = 'last'
            setOpen(id)
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault()
            const next = neighbour(id, e.key === 'ArrowRight' ? 1 : -1)
            triggers.current.get(next)?.focus()
            if (open) setOpen(next)
        }
    }

    const onMenuKey = (e: ReactKeyboardEvent<HTMLDivElement>, id: string) => {
        const items = menuItems(id)
        const index = items.indexOf(document.activeElement as HTMLElement)
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            const step = e.key === 'ArrowDown' ? 1 : -1
            items[(index + step + items.length) % items.length]?.focus()
        } else if (e.key === 'Home' || e.key === 'End') {
            e.preventDefault()
            items[e.key === 'Home' ? 0 : items.length - 1]?.focus()
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault()
            const next = neighbour(id, e.key === 'ArrowRight' ? 1 : -1)
            focusFirst.current = 'first'
            setOpen(next)
            triggers.current.get(next)?.focus()
        } else if (e.key === 'Tab') {
            close()
        }
    }

    return (
        <div ref={barRef} role="menubar" aria-label={label} className="flex items-center min-w-0">
            {menus.map((menu) => {
                const isOpen = open === menu.id
                return (
                    <div key={menu.id} className="relative">
                        <button
                            ref={(el) => {
                                if (el) triggers.current.set(menu.id, el)
                                else triggers.current.delete(menu.id)
                            }}
                            type="button"
                            role="menuitem"
                            aria-haspopup="menu"
                            aria-expanded={isOpen}
                            aria-label={menu.ariaLabel}
                            onClick={() => setOpen(isOpen ? null : menu.id)}
                            onPointerEnter={() => {
                                if (open && open !== menu.id) setOpen(menu.id)
                            }}
                            onKeyDown={(e) => onTriggerKey(e, menu.id)}
                            className={`os-menubar__item ${menu.className ?? ''}`}
                        >
                            {menu.label}
                        </button>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    role="menu"
                                    aria-label={typeof menu.label === 'string' ? menu.label : menu.ariaLabel}
                                    data-menu={menu.id}
                                    className="os-menu z-[60]"
                                    initial={reduceMotion ? false : { opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.1 } }}
                                    transition={reduceMotion ? { duration: 0 } : MENU_TRANSITION}
                                    onKeyDown={(e) => onMenuKey(e, menu.id)}
                                >
                                    {menu.entries.map((entry, i) =>
                                        entry.kind === 'sep' ? (
                                            <div key={`sep-${i}`} role="separator" className="os-menu-sep" />
                                        ) : (
                                            <MenuItem key={`${entry.label}-${i}`} entry={entry} onDone={(viaKeyboard) => close(viaKeyboard)} />
                                        )
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )
            })}
        </div>
    )
}

function MenuItem({ entry, onDone }: { entry: Extract<MenuEntry, { kind: 'item' }>; onDone: (viaKeyboard: boolean) => void }) {
    const role = entry.radio ? 'menuitemradio' : 'menuitem'
    const content = (
        <>
            <span className="os-menu-item__check" aria-hidden="true">
                {entry.mark === 'check' && <Icon name="checkmark" weight={2} />}
                {entry.mark === 'diamond' && '◆'}
            </span>
            {entry.icon && <Icon name={entry.icon} className="os-menu-item__icon" />}
            <span className="truncate">{entry.label}</span>
            {entry.meta && <span className="os-menu-item__meta" aria-hidden="true">{entry.meta}</span>}
        </>
    )
    const common = {
        role,
        tabIndex: -1,
        'aria-checked': entry.radio ? entry.mark === 'check' : undefined,
        'aria-disabled': entry.disabled || undefined,
        className: 'os-menu-item',
    }

    if (entry.href && !entry.disabled) {
        return (
            <a
                {...common}
                href={entry.href}
                {...(entry.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                {...(entry.download ? { download: true } : {})}
                onClick={(e) => onDone(e.detail === 0)}
            >
                {content}
            </a>
        )
    }
    return (
        <button
            {...common}
            type="button"
            onClick={(e) => {
                if (entry.disabled) return
                entry.onSelect?.(e.currentTarget)
                onDone(e.detail === 0)
            }}
        >
            {content}
        </button>
    )
}

/* ─── Navigation ─────────────────────────────────────────────────────── */

/**
 * Desktop: a macOS menu bar — the AF menu, the front app's menu in bold, File, View, Go
 * and Window with real dropdowns, then status items (input language, appearance, clock).
 * Mobile: a status bar and a launcher that opens an app grid, like a phone home screen.
 */
export default function Navigation() {
    const { language, setLanguage } = useLanguage()
    const t = useContent()
    const { launch, minimize, close, toggleZoom, restoreAll, setProjectsView, setOverview } = useDesktopActions()
    const active = useDesktopState((s) => s.active)
    const keyId = useDesktopState((s) => s.keyId)
    const status = useDesktopState((s) => s.status)
    const projectsView = useDesktopState((s) => s.projectsView)
    const toggleAppearance = useToggleAppearance()
    const [launcherOpen, setLauncherOpen] = useState(false)
    const closeRef = useRef<HTMLButtonElement>(null)
    const launcherButtonRef = useRef<HTMLButtonElement>(null)

    const title = (id: WindowId) => windowTitle(t.os.windows, id)
    const frontApp = keyId ? appNameOf(title(keyId), keyId, t.os.apps.terminal) : t.os.apps.finder
    const toggleLanguage = () => setLanguage(language === 'en' ? 'gr' : 'en')
    const anyHidden = WINDOW_IDS.some((id) => status[id] !== 'open')

    const go = (id: SectionId) => {
        launch(id)
        setLauncherOpen(false)
    }

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

    const menus: MenuDef[] = [
        {
            id: 'af',
            // Where the Apple menu sits on a Mac: the owner's memoji, never a vendor logo.
            label: <Avatar crop="face" size={18} lazy />,
            ariaLabel: t.os.displayName,
            className: 'os-menubar__item--avatar',
            entries: [
                { kind: 'item', label: t.os.menu.aboutMe, onSelect: () => launch('about') },
                { kind: 'item', label: t.os.menu.resume, href: RESUME_URL, download: true },
                { kind: 'sep' },
                { kind: 'item', label: 'LinkedIn', href: t.linkedin, external: true, meta: <Icon name="arrow.up.right" /> },
                { kind: 'item', label: 'GitHub', href: t.github, external: true, meta: <Icon name="arrow.up.right" /> },
            ],
        },
        {
            id: 'app',
            label: <span className="font-bold">{frontApp}</span>,
            entries: [
                { kind: 'item', label: t.os.menu.aboutPortfolio, onSelect: () => launch('hero') },
                { kind: 'sep' },
                { kind: 'item', label: t.os.menu.hide.replace('{app}', frontApp), disabled: !keyId, onSelect: () => keyId && minimize(keyId) },
                { kind: 'item', label: t.os.menu.quit.replace('{app}', frontApp), disabled: !keyId, onSelect: () => keyId && close(keyId) },
            ],
        },
        {
            id: 'file',
            label: t.os.menu.file,
            entries: [
                { kind: 'item', label: t.os.menu.newMessage, href: gmailComposeUrl(t.email), external: true },
                { kind: 'item', label: t.os.menu.resume, href: RESUME_URL, download: true },
                { kind: 'sep' },
                { kind: 'item', label: t.os.menu.closeWindow, disabled: !keyId, onSelect: () => keyId && close(keyId) },
            ],
        },
        {
            id: 'view',
            label: t.os.menu.view,
            entries: [
                { kind: 'item', label: t.os.menu.asIcons, radio: true, mark: projectsView === 'icons' ? 'check' : undefined, icon: 'square.grid.2x2', onSelect: () => { setProjectsView('icons'); launch('projects') } },
                { kind: 'item', label: t.os.menu.asList, radio: true, mark: projectsView === 'list' ? 'check' : undefined, icon: 'list.bullet', onSelect: () => { setProjectsView('list'); launch('projects') } },
                { kind: 'sep' },
                { kind: 'item', label: t.os.menu.toggleAppearance, icon: 'moon', onSelect: (el) => toggleAppearance(el) },
                { kind: 'item', label: t.os.menu.switchLanguage, icon: 'globe', onSelect: toggleLanguage },
            ],
        },
        {
            id: 'go',
            label: t.os.menu.go,
            entries: SECTION_IDS.map((id) => ({
                kind: 'item' as const,
                label: t.os.menus[id],
                radio: true,
                mark: active === id ? ('check' as const) : undefined,
                icon: SECTION_SYMBOL[id],
                onSelect: () => launch(id),
            })),
        },
        {
            id: 'window',
            label: t.os.menu.window,
            entries: [
                { kind: 'item', label: t.os.menu.minimize, disabled: !keyId, onSelect: () => keyId && minimize(keyId) },
                { kind: 'item', label: t.os.menu.zoom, disabled: !keyId, onSelect: () => keyId && toggleZoom(keyId) },
                { kind: 'sep' },
                { kind: 'item', label: t.os.menu.restoreAll, disabled: !anyHidden, onSelect: restoreAll },
                { kind: 'item', label: t.os.menu.missionControl, onSelect: () => setOverview(true), meta: <kbd className="font-sans">⌃↑</kbd> },
                { kind: 'sep' },
                ...WINDOW_IDS.map((id) => ({
                    kind: 'item' as const,
                    label: title(id),
                    mark: status[id] === 'minimized' ? ('diamond' as const) : keyId === id ? ('check' as const) : undefined,
                    onSelect: () => launch(id),
                })),
            ],
        },
    ]

    return (
        <>
            {/* ── Desktop menu bar ─────────────────────────────────────── */}
            <nav
                data-menubar
                className="os-menubar hidden md:flex fixed top-0 inset-x-0 z-50 h-[var(--nav-h)] items-center justify-between px-2 text-body-sm text-[var(--foreground)]"
                aria-label={t.os.menu.bar}
            >
                <MenuBar menus={menus} label={t.os.menu.bar} />

                <div className="flex items-center gap-0.5 shrink-0">
                    <button
                        type="button"
                        onClick={toggleLanguage}
                        aria-label={t.os.aria.switchLanguage}
                        className="os-menubar__item px-2"
                    >
                        <span className="inline-flex items-center justify-center h-4 min-w-[1.375rem] px-1 rounded-[0.25rem] border border-current text-[0.625rem] font-bold leading-none">
                            {language === 'en' ? 'EN' : 'ΕΛ'}
                        </span>
                    </button>
                    <ControlCenter />
                    <span className="os-menubar__item hover:bg-transparent tabular-nums" title={`${t.os.clock} · ${t.location}`}>
                        <span className="sr-only">{t.os.clock}: </span>
                        <LocalTime showOffset={false} withDate locale={language === 'gr' ? 'el-GR' : 'en-GB'} />
                    </span>
                </div>
            </nav>

            {/* ── Mobile status bar ────────────────────────────────────── */}
            <div className="md:hidden fixed top-0 inset-x-0 z-50 os-menubar h-[var(--nav-h)] flex items-center justify-between pl-3 pr-1.5 text-[var(--foreground)]">
                <button type="button" onClick={() => go('hero')} aria-label={t.nav.home} className="flex items-center gap-2.5 min-h-11 pr-2">
                    <AppIcon app="hero" size={28} />
                    <LocalTime showOffset={false} className="text-[0.9375rem] font-semibold tabular-nums" />
                </button>
                <div className="flex items-center gap-0.5">
                    <button
                        type="button"
                        onClick={toggleLanguage}
                        aria-label={t.os.aria.switchLanguage}
                        className="min-w-11 h-11 inline-flex items-center justify-center rounded-lg text-sm font-semibold hover:bg-[var(--control-hover)]"
                    >
                        {language === 'en' ? 'EN' : 'ΕΛ'}
                    </button>
                    <ThemeToggle className="w-11 h-11 text-lg rounded-lg" />
                    <button
                        ref={launcherButtonRef}
                        type="button"
                        onClick={() => setLauncherOpen((o) => !o)}
                        aria-label={t.os.aria.menu}
                        aria-expanded={launcherOpen}
                        className="w-11 h-11 inline-flex items-center justify-center rounded-lg text-lg hover:bg-[var(--control-hover)]"
                    >
                        <Icon name="circle.grid" weight={1.25} />
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
                <div className="absolute inset-0 os-hud rounded-none" onClick={() => setLauncherOpen(false)} />
                <div className="relative flex items-center justify-between px-4 h-[var(--nav-h)]">
                    <span className="text-[0.9375rem] font-semibold">{t.os.displayName}</span>
                    <button
                        ref={closeRef}
                        type="button"
                        onClick={() => setLauncherOpen(false)}
                        tabIndex={launcherOpen ? 0 : -1}
                        className="os-btn os-btn--secondary h-9 min-h-9 px-4 caps-gr"
                    >
                        {t.projectsSection.close}
                    </button>
                </div>

                <nav className="relative flex-1 px-6 pt-8" aria-label={t.os.aria.menu}>
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
                                transition={{ type: 'spring', visualDuration: 0.3, bounce: 0.15 }}
                            >
                                <button
                                    type="button"
                                    onClick={() => go(id)}
                                    aria-current={active === id ? 'true' : undefined}
                                    tabIndex={launcherOpen ? 0 : -1}
                                    className="w-full flex flex-col items-center gap-2 rounded-2xl py-1"
                                >
                                    <AppIcon app={id} size={60} />
                                    <span className={`text-xs font-medium text-center leading-tight ${active === id ? 'text-[var(--accent)] font-semibold' : ''}`}>{t.os.menus[id]}</span>
                                </button>
                            </motion.li>
                        ))}
                    </motion.ul>
                </nav>

                <div className="relative mx-4 mb-8 os-card bg-[var(--window-bg)] flex items-center justify-between gap-3 p-2">
                    <ThemeToggle showLabel className="h-11 px-3" />
                    <button
                        type="button"
                        onClick={toggleLanguage}
                        tabIndex={launcherOpen ? 0 : -1}
                        aria-label={t.os.aria.switchLanguage}
                        className="h-11 px-3 inline-flex items-center gap-2 rounded-lg text-body-sm font-medium hover:bg-[var(--control-hover)]"
                    >
                        <Icon name="globe" className="text-base" />
                        {t.nav.languageLabel}
                    </button>
                    <span className="px-3 text-body-sm text-[var(--muted)]">{t.location}</span>
                </div>
            </div>
        </>
    )
}
