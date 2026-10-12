'use client'

import { useEffect, useEffectEvent, useRef, useSyncExternalStore, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { usePresence } from '@/hooks/usePresence'

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

const noopSubscribe = () => () => {}
/** True on the client after hydration, false on the server: portals need a DOM target. */
const useIsClient = () => useSyncExternalStore(noopSubscribe, () => true, () => false)

/** Longest exit transition (--motion-base); the dialog stays mounted this long after closing. */
const EXIT_MS = 320

/** Drag distance or speed that dismisses a sheet. */
const DISMISS_PX = 120
const DISMISS_PX_PER_MS = 0.5

/** Header and main go inert while a dialog is open, so assistive tech and Tab stay inside it. */
function setBackgroundInert(inert: boolean) {
    for (const el of [document.querySelector('header'), document.getElementById('main-content')]) {
        if (!el) continue
        if (inert) el.setAttribute('inert', '')
        else el.removeAttribute('inert')
    }
}

interface ModalProps {
    open: boolean
    onClose: () => void
    /** Element id of the heading that names this dialog. */
    labelledBy: string
    closeLabel?: string
    children: ReactNode
    className?: string
}

/**
 * Accessible dialog: Escape closes it, focus is trapped inside while open, and focus
 * returns to whatever opened it. Where there is room it is a centred card; elsewhere a
 * bottom sheet (full width, rounded top, a grabber you can drag down to dismiss, no
 * backdrop blur to repaint). Its motion is CSS (.kn-modal in globals.css). Rendered
 * through a portal so it escapes the transformed horizontal track, which would otherwise
 * become its containing block.
 */
export default function Modal({
    open,
    onClose,
    labelledBy,
    closeLabel = 'Close',
    children,
    className = '',
}: ModalProps) {
    const panelRef = useRef<HTMLDivElement>(null)
    const closeRef = useRef<HTMLButtonElement>(null)
    const lastFocused = useRef<HTMLElement | null>(null)
    const isClient = useIsClient()
    // Callers pass inline handlers; reading the latest one through an effect event keeps
    // the effect below from re-running (and bouncing focus) whenever the parent re-renders.
    const requestClose = useEffectEvent(() => onClose())
    const { mounted, closing } = usePresence(open, EXIT_MS)
    const drag = useRef<{ startY: number; lastY: number; lastT: number; velocity: number } | null>(null)

    // Drag the sheet's grabber down to dismiss it, as on iOS.
    const onGrabStart = (e: ReactPointerEvent<HTMLDivElement>) => {
        const panel = panelRef.current
        if (!panel) return
        e.currentTarget.setPointerCapture(e.pointerId)
        drag.current = { startY: e.clientY, lastY: e.clientY, lastT: performance.now(), velocity: 0 }
        panel.style.transition = 'none'
    }
    const onGrabMove = (e: ReactPointerEvent<HTMLDivElement>) => {
        const panel = panelRef.current
        const d = drag.current
        if (!panel || !d) return
        const now = performance.now()
        d.velocity = (e.clientY - d.lastY) / Math.max(1, now - d.lastT)
        d.lastY = e.clientY
        d.lastT = now
        panel.style.transform = `translate3d(0, ${Math.max(0, e.clientY - d.startY)}px, 0)`
    }
    const onGrabEnd = () => {
        const panel = panelRef.current
        const d = drag.current
        drag.current = null
        if (!panel || !d) return
        const distance = d.lastY - d.startY
        panel.style.transition = ''
        if (distance > DISMISS_PX || d.velocity > DISMISS_PX_PER_MS) {
            // Leave from where the finger let go; the closing state keeps it off screen.
            panel.style.transform = 'translate3d(0, 100%, 0)'
            onClose()
        } else {
            panel.style.transform = ''
        }
    }

    useEffect(() => {
        if (!open) return

        lastFocused.current = document.activeElement as HTMLElement
        closeRef.current?.focus()

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                requestClose()
                return
            }
            if (e.key !== 'Tab') return

            const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
            if (!nodes || nodes.length === 0) return

            const first = nodes[0]
            const last = nodes[nodes.length - 1]
            const active = document.activeElement

            if (e.shiftKey && (active === first || !panelRef.current?.contains(active))) {
                e.preventDefault()
                last.focus()
            } else if (!e.shiftKey && active === last) {
                e.preventDefault()
                first.focus()
            }
        }

        const root = document.documentElement
        const previousOverflow = root.style.overflow
        root.style.overflow = 'hidden'
        setBackgroundInert(true)
        document.addEventListener('keydown', onKeyDown)

        return () => {
            document.removeEventListener('keydown', onKeyDown)
            root.style.overflow = previousOverflow
            setBackgroundInert(false)
            lastFocused.current?.focus({ preventScroll: true })
        }
    }, [open])

    if (!isClient || !mounted) return null

    return createPortal(
        <div className="kn-modal" data-closing={closing ? '' : undefined}>
            <div className="kn-modal__scrim" aria-hidden="true" onClick={onClose} />
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={labelledBy}
                className={`kn-modal__panel kn-sheet relative z-10 text-[var(--foreground)] rounded-t-[1.75rem] card:rounded-[1.75rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] max-h-[92svh] card:max-h-[88svh] overflow-y-auto overscroll-contain [scrollbar-width:thin] ${className}`}
            >
                {/* Sheets: drag the top edge down to dismiss; the bar is iOS's grabber. */}
                <div
                    aria-hidden="true"
                    className="kn-grabber"
                    onPointerDown={onGrabStart}
                    onPointerMove={onGrabMove}
                    onPointerUp={onGrabEnd}
                    onPointerCancel={onGrabEnd}
                >
                    <span className="absolute top-2 left-1/2 -translate-x-1/2 w-9 h-[5px] rounded-full bg-[var(--line)]" />
                </div>
                <button
                    ref={closeRef}
                    type="button"
                    onClick={onClose}
                    aria-label={closeLabel}
                    className="kn-icon-btn absolute top-4 right-4 card:top-5 card:right-5 z-20"
                >
                    <svg viewBox="0 0 12 12" className="w-3 h-3" aria-hidden="true" fill="none">
                        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                </button>
                {children}
            </div>
        </div>,
        document.body
    )
}
