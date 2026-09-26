'use client'

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useContent } from '@/hooks/useContent'
import { useDesktopActions, useDesktopState } from '@/contexts/DesktopContext'
import { SECTION_IDS, SECTION_STEPS } from '@/data/sections'

/** Where each space sits in the overview grid (viewport px), and the thumbnail scale. */
export interface SpaceSlot { left: number; top: number; w: number; h: number; s: number; W: number }

const COLS = 3
const LABEL_H = 30

/** A 3 × 2 grid of the six spaces between the menu bar and the Dock. */
export function overviewGeometry(W: number, H: number): SpaceSlot[] {
    const top = 24 + 60
    const bottom = H - 104
    const gapX = Math.max(24, W * 0.025)
    const gapY = 14
    const mx = Math.max(48, W * 0.05)
    const rows = Math.ceil(SECTION_IDS.length / COLS)
    const s = Math.min((W - 2 * mx - (COLS - 1) * gapX) / COLS / W, (bottom - top - (rows - 1) * gapY - rows * LABEL_H) / rows / H)
    const w = W * s
    const h = H * s
    const gridW = COLS * w + (COLS - 1) * gapX
    const gridH = rows * (h + LABEL_H) + (rows - 1) * gapY
    const left0 = (W - gridW) / 2
    const top0 = top + (bottom - top - gridH) / 2
    return SECTION_IDS.map((_, i) => ({
        left: left0 + (i % COLS) * (w + gapX),
        top: top0 + Math.floor(i / COLS) * (h + LABEL_H + gapY),
        w,
        h,
        s,
        W,
    }))
}

/** Tracks the overview grid for the current viewport (desktop only). */
export function useOverviewGeometry(enabled: boolean): SpaceSlot[] | null {
    const [geo, setGeo] = useState<SpaceSlot[] | null>(null)
    useEffect(() => {
        if (!enabled) {
            // Leaving the desktop layout: no overview geometry at all.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setGeo(null)
            return
        }
        const update = () => setGeo(overviewGeometry(window.innerWidth, window.innerHeight))
        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [enabled])
    return geo
}

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
