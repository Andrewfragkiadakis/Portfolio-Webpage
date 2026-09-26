'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore, type FocusEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '@/utils/motion'

/** Only one hotspot is open at a time: opening one tells the others to close. */
const OPEN_EVENT = 'infospot:open'
const GAP = 8
const EDGE = 12

const noop = () => () => {}

interface InfoSpotProps {
    /** Accessible name of the button and the popover, e.g. "More about the fleet rings". */
    label: string
    /** Optional heading shown at the top of the popover. */
    title?: ReactNode
    children: ReactNode
    /** `info` for "there is more to read", `plus` for "there is more of this list". */
    icon?: 'info' | 'plus'
    /** `onColor` for gradient / graphite tiles, where the quiet grey well would vanish. */
    tone?: 'default' | 'onColor'
    /** Position of the button inside its tile (it is `position: relative` by default). */
    className?: string
    /** Optional visible text next to the glyph, e.g. "+14". */
    text?: string
    /** Popover width in rem. */
    width?: number
}

/**
 * A quiet "i" (or "+") hotspot. Detail that used to sit on a tile lives one click deeper:
 * a real <button> with aria-expanded opens a small popover, Escape or a click / tap
 * outside closes it, and focus returns to the button. The popover is portalled to <body>
 * so tiles (overflow: hidden) and the transformed horizontal track cannot clip it; it is
 * positioned against the button and follows it while the page scrolls.
 */
export default function InfoSpot({ label, title, children, icon = 'info', tone = 'default', className = '', text, width = 20 }: InfoSpotProps) {
    const id = useId()
    const panelId = `${id}-panel`
    const [open, setOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const reduceMotion = useReducedMotion()
    // Portals need <body>, which only exists on the client.
    const mounted = useSyncExternalStore(noop, () => true, () => false)

    const close = useCallback((restoreFocus = false) => {
        setOpen(false)
        if (restoreFocus) buttonRef.current?.focus()
    }, [])

    /**
     * Place the popover against the button, writing straight to its style (no React
     * state, so following a scroll costs no re-render). Returns false when the button
     * has left the screen, e.g. the horizontal track moved on.
     */
    const position = useCallback((): boolean => {
        const button = buttonRef.current
        const panel = panelRef.current
        if (!button || !panel) return true
        const b = button.getBoundingClientRect()
        if (b.bottom < 0 || b.top > window.innerHeight || b.right < 0 || b.left > window.innerWidth) return false
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
        const w = Math.min(width * rem, window.innerWidth - EDGE * 2)
        panel.style.width = `${w}px`
        const h = panel.offsetHeight
        // Align to the button's right edge when there is room, else its left edge; clamp to the viewport.
        let left = b.right - w
        if (left < EDGE) left = b.left
        left = Math.max(EDGE, Math.min(left, window.innerWidth - EDGE - w))
        const below = b.bottom + GAP
        const fitsBelow = below + h <= window.innerHeight - EDGE
        const top = fitsBelow || b.top - GAP - h < EDGE ? Math.min(below, Math.max(EDGE, window.innerHeight - EDGE - h)) : b.top - GAP - h
        panel.style.left = `${left}px`
        panel.style.top = `${top}px`
        panel.style.transformOrigin = `${fitsBelow ? 'top' : 'bottom'} ${left + w / 2 < b.left + b.width / 2 ? 'right' : 'left'}`
        return true
    }, [width])

    // Position before the first paint of the popover.
    useLayoutEffect(() => {
        if (open) position()
    }, [open, position])

    useEffect(() => {
        if (!open) return
        panelRef.current?.focus({ preventScroll: true })
        window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: id }))

        let raf = 0
        const follow = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(() => {
                if (!position()) setOpen(false)
            })
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.stopPropagation()
                close(true)
            }
        }
        const onPointer = (e: PointerEvent) => {
            const target = e.target as Node
            if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return
            close()
        }
        const onOther = (e: Event) => {
            if ((e as CustomEvent).detail !== id) close()
        }
        window.addEventListener('scroll', follow, { passive: true, capture: true })
        window.addEventListener('resize', follow)
        document.addEventListener('keydown', onKey)
        document.addEventListener('pointerdown', onPointer)
        window.addEventListener(OPEN_EVENT, onOther)
        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('scroll', follow, { capture: true })
            window.removeEventListener('resize', follow)
            document.removeEventListener('keydown', onKey)
            document.removeEventListener('pointerdown', onPointer)
            window.removeEventListener(OPEN_EVENT, onOther)
        }
    }, [open, id, position, close])

    // Tabbing out of the popover (and not back to its button) closes it.
    const onBlur = (e: FocusEvent) => {
        const next = e.relatedTarget as Node | null
        if (!next) return
        if (panelRef.current?.contains(next) || buttonRef.current?.contains(next)) return
        close()
    }

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                aria-expanded={open}
                aria-controls={open ? panelId : undefined}
                aria-label={label}
                onClick={() => setOpen((v) => !v)}
                className={`spot tile-above ${tone === 'onColor' ? 'spot--on-color' : ''} ${text ? 'spot--text' : ''} ${className}`}
            >
                {text && <span aria-hidden="true" className="tabular-nums">{text}</span>}
                <i className={`fas ${open ? 'fa-xmark' : icon === 'plus' ? 'fa-plus' : 'fa-info'} spot-glyph`} aria-hidden="true" />
            </button>
            {mounted && createPortal(
                <AnimatePresence>
                    {open && (
                        <motion.div
                            ref={panelRef}
                            id={panelId}
                            role="dialog"
                            aria-label={label}
                            tabIndex={-1}
                            onBlur={onBlur}
                            className="spot-pop"
                            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
                            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, transition: { duration: 0.14 } }}
                            transition={{ duration: 0.22, ease: EASE_OUT }}
                        >
                            {title && <p className="spot-title">{title}</p>}
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body,
            )}
        </>
    )
}

/** A label / value row for popovers ("SLA · 95%+ across 350+ tickets"). */
export function SpotRow({ children, lead }: { children: ReactNode; lead?: ReactNode }) {
    return (
        <li className="flex items-start gap-2.5 leading-snug">
            {lead && <span className="shrink-0 mt-[0.2em]" aria-hidden="true">{lead}</span>}
            <span className="min-w-0">{children}</span>
        </li>
    )
}
