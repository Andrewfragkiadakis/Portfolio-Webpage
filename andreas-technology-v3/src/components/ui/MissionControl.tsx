'use client'

import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useContent } from '@/hooks/useContent'
import { useDesktopActions, useDesktopState } from '@/contexts/DesktopContext'
import { SECTION_IDS, SECTION_STEPS } from '@/data/sections'
import { COLS, type SpaceSlot } from '@/components/ui/overview'

/** Jump the journey to a space without animation (the overview zoom is the transition). */
function jumpTo(index: number) {
    const max = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: (index / SECTION_STEPS) * max, behavior: 'instant' })
}

/**
 * Mission Control for the six spaces: the journey zooms out into a grid of desktop
 * thumbnails (the panels themselves, scaled, so every window is live). A click, Enter
 * or Space picks a space and it zooms back in; Escape or a click on the background
 * returns to the current one. Opens from Window ▸ Mission Control, F3 or ⌃↑.
 */
export default function MissionControl({ geo }: { geo: SpaceSlot[] | null }) {
    const t = useContent()
    const open = useDesktopState((s) => s.overview)
    const active = useDesktopState((s) => s.active)
    const isDesktop = useDesktopState((s) => s.isDesktop)
    const { setOverview, focus, getState } = useDesktopActions()
    const reduceMotion = useReducedMotion()
    const buttons = useRef<(HTMLButtonElement | null)[]>([])
    const returnFocus = useRef<HTMLElement | null>(null)

    // F3 or Control-↑ toggles it, as on a Mac (when the system does not take the key first).
    useEffect(() => {
        if (!isDesktop) return
        const onKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null
            if (target?.closest('input, textarea, [contenteditable="true"]')) return
            if (e.key === 'F3' || (e.ctrlKey && e.key === 'ArrowUp')) {
                // Not over an open dialog (Quick Look, a service sheet).
                if (!getState().overview && document.querySelector('[aria-modal="true"]:not([aria-hidden="true"])')) return
                e.preventDefault()
                setOverview(!getState().overview)
            } else if (e.key === 'Escape' && getState().overview) {
                setOverview(false)
            }
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [isDesktop, setOverview, getState])

    // Focus moves into the grid on open and back to where it was on close.
    useEffect(() => {
        if (open) {
            returnFocus.current = document.activeElement as HTMLElement | null
            const index = SECTION_IDS.indexOf(getState().active)
            requestAnimationFrame(() => buttons.current[Math.max(0, index)]?.focus({ preventScroll: true }))
            return
        }
        const el = returnFocus.current
        returnFocus.current = null
        if (el && el !== document.body && el.isConnected && !el.closest('[inert]')) el.focus({ preventScroll: true })
    }, [open, getState])

    // The page must not scroll underneath the overview.
    useEffect(() => {
        if (!open) return
        const stop = (e: Event) => e.preventDefault()
        window.addEventListener('wheel', stop, { passive: false })
        window.addEventListener('touchmove', stop, { passive: false })
        return () => {
            window.removeEventListener('wheel', stop)
            window.removeEventListener('touchmove', stop)
        }
    }, [open])

    const choose = (index: number) => {
        jumpTo(index)
        setOverview(false)
        focus(SECTION_IDS[index])
    }

    const onGridKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
        const index = buttons.current.indexOf(document.activeElement as HTMLButtonElement)
        if (index < 0) return
        const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowDown' ? COLS : e.key === 'ArrowUp' && !e.ctrlKey ? -COLS : 0
        if (!step) return
        e.preventDefault()
        const next = Math.min(SECTION_IDS.length - 1, Math.max(0, index + step))
        buttons.current[next]?.focus()
    }

    return (
        <AnimatePresence>
            {open && geo && (
                <motion.div
                    key="mission-control"
                    role="dialog"
                    aria-modal="true"
                    aria-label={t.os.missionControl.label}
                    className="fixed inset-0 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: reduceMotion ? 0 : 0.18, delay: reduceMotion ? 0 : 0.26 } }}
                    exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.1 } }}
                    onClick={(e) => { if (e.target === e.currentTarget) setOverview(false) }}
                    onKeyDown={onGridKey}
                >
                    <p className="os-mc-hint" style={{ top: Math.max(36, geo[0].top - 44) }}>{t.os.missionControl.hint}</p>
                    {SECTION_IDS.map((id, i) => {
                        const g = geo[i]
                        const current = id === active
                        return (
                            <div key={id} className="absolute" style={{ left: g.left, top: g.top, width: g.w }}>
                                <button
                                    ref={(el) => { buttons.current[i] = el }}
                                    type="button"
                                    onClick={() => choose(i)}
                                    aria-label={t.os.missionControl.goTo.replace('{space}', t.os.menus[id])}
                                    aria-current={current ? 'true' : undefined}
                                    className={`os-mc-space ${current ? 'is-current' : ''}`}
                                    style={{ height: g.h }}
                                />
                                <p className={`os-mc-label ${current ? 'is-current' : ''}`} aria-hidden="true">{t.os.menus[id]}</p>
                            </div>
                        )
                    })}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
