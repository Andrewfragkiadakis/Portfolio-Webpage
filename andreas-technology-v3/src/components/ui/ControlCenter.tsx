'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDesktopActions } from '@/contexts/DesktopContext'
import { useContent } from '@/hooks/useContent'
import { centreOf } from '@/utils/dom'
import Icon from '@/components/ui/Icon'
import { MENU_TRANSITION } from '@/utils/motion'

/** The Control Center glyph: two switches, as in the macOS menu bar. */
function SwitchesGlyph() {
    return (
        <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" className="sym" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3.5" y="4.5" width="17" height="6.5" rx="3.25" />
            <circle cx="16.75" cy="7.75" r="1.9" fill="currentColor" stroke="none" />
            <rect x="3.5" y="13" width="17" height="6.5" rx="3.25" />
            <circle cx="7.25" cy="16.25" r="1.9" fill="currentColor" stroke="none" />
        </svg>
    )
}

/**
 * Control Center as a menu-bar extra: Dark Mode and Language as round toggles, and the
 * owner's Focus ("Open to Opportunities") as a wide module that opens Mail. It replaces
 * the loose appearance button, so the menu bar carries one control instead of two.
 */
export default function ControlCenter() {
    const t = useContent()
    const { theme, setTheme } = useTheme()
    const { language, setLanguage } = useLanguage()
    const { launch } = useDesktopActions()
    const reduceMotion = useReducedMotion()
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    // Theme is only knowable after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMounted(true), [])
    const dark = mounted && theme === 'dark'
    const cc = t.os.controlCenter

    useEffect(() => {
        if (!open) return
        const onPointerDown = (e: PointerEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false)
                buttonRef.current?.focus()
            }
        }
        document.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('pointerdown', onPointerDown)
            document.removeEventListener('keydown', onKey)
        }
    }, [open])

    return (
        <div ref={rootRef} className="relative">
            <button
                ref={buttonRef}
                type="button"
                aria-label={cc.label}
                aria-expanded={open}
                aria-haspopup="dialog"
                onClick={() => setOpen((o) => !o)}
                className="os-menubar__item w-8 justify-center px-0 text-[0.9375rem]"
            >
                <SwitchesGlyph />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        role="dialog"
                        aria-label={cc.label}
                        className="os-cc"
                        initial={reduceMotion ? false : { opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.1 } }}
                        transition={reduceMotion ? { duration: 0 } : MENU_TRANSITION}
                    >
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                role="switch"
                                aria-checked={dark}
                                onClick={(e) => setTheme(dark ? 'light' : 'dark', centreOf(e.currentTarget))}
                                className="os-cc-module os-cc-toggle"
                            >
                                <span className={`os-cc-toggle__knob ${dark ? 'is-on' : ''}`}>
                                    <Icon name={dark ? 'moon' : 'sun.max'} />
                                </span>
                                <span className="min-w-0 text-left">
                                    <span className="block font-semibold leading-tight">{cc.darkMode}</span>
                                    <span className="block text-caption text-[var(--muted)] leading-tight">{dark ? cc.on : cc.off}</span>
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setLanguage(language === 'en' ? 'gr' : 'en')}
                                aria-label={`${cc.language}: ${cc.languageName}. ${t.os.aria.switchLanguage}`}
                                className="os-cc-module os-cc-toggle"
                            >
                                <span className="os-cc-toggle__knob is-on">
                                    <Icon name="globe" />
                                </span>
                                <span className="min-w-0 text-left">
                                    <span className="block font-semibold leading-tight truncate">{cc.language}</span>
                                    <span className="block text-caption text-[var(--muted)] leading-tight">{cc.languageName}</span>
                                </span>
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false)
                                launch('contact')
                            }}
                            className="os-cc-module os-cc-toggle mt-2 w-full"
                        >
                            <span className="os-cc-toggle__knob is-focus">
                                <Icon name="person.crop.circle" />
                            </span>
                            <span className="min-w-0 text-left">
                                <span className="block font-semibold leading-tight truncate">{cc.focus}</span>
                                <span className="block text-caption text-[var(--muted)] leading-tight truncate caps-gr">{t.contact.opportunitiesTitle}</span>
                            </span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
