'use client'

import { useEffect, useEffectEvent, useRef, useSyncExternalStore, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useIsPresent } from 'motion/react'

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

const noopSubscribe = () => () => {}
/** True on the client after hydration, false on the server: portals need a DOM target. */
const useIsClient = () => useSyncExternalStore(noopSubscribe, () => true, () => false)

/** While the dialog animates out it is still mounted; let clicks pass through to the page. */
function Layer({ children, onClick }: { children: ReactNode; onClick: () => void }) {
    const isPresent = useIsPresent()
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4"
            style={{ pointerEvents: isPresent ? undefined : 'none' }}
            onClick={onClick}
        >
            {children}
        </motion.div>
    )
}

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
 * returns to whatever opened it. On phones it is a bottom sheet (full width, rounded top,
 * grabber, no backdrop blur to repaint); from `sm` up it is a centred card. Rendered through a portal so it escapes the
 * transformed horizontal track, which would otherwise become its containing block.
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

    if (!isClient) return null

    return createPortal(
        <AnimatePresence>
            {open && (
                <Layer key="modal" onClick={onClose}>
                    <div className="absolute inset-0 bg-black/40 sm:backdrop-blur-[20px]" />
                    <motion.div
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={labelledBy}
                        initial={{ opacity: 0, y: 48 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 32 }}
                        transition={{ duration: 0.45, ease: [0.28, 0.11, 0.32, 1] }}
                        className={`kn-sheet relative z-10 text-[var(--foreground)] rounded-t-[1.75rem] sm:rounded-[1.75rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] max-h-[92svh] sm:max-h-[88vh] overflow-y-auto overscroll-contain no-scrollbar ${className}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            ref={closeRef}
                            type="button"
                            onClick={onClose}
                            aria-label={closeLabel}
                            className="kn-icon-btn absolute top-4 right-4 sm:top-5 sm:right-5 z-20"
                        >
                            <svg viewBox="0 0 12 12" className="w-3 h-3" aria-hidden="true" fill="none">
                                <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                            </svg>
                        </button>
                        {/* Phones: the sheet rises from the bottom edge, with iOS's grabber. */}
                        <span aria-hidden="true" className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-9 h-[5px] rounded-full bg-[var(--line)] z-20" />
                        {children}
                    </motion.div>
                </Layer>
            )}
        </AnimatePresence>,
        document.body
    )
}
