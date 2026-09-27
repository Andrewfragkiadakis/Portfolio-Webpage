'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

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
    const [mounted, setMounted] = useState(false)

    // Portals need a DOM target, which only exists after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (!open) return

        lastFocused.current = document.activeElement as HTMLElement
        closeRef.current?.focus()

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
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

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', onKeyDown)

        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.body.style.overflow = previousOverflow
            lastFocused.current?.focus()
        }
    }, [open, onClose])

    if (!mounted) return null

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4"
                    onClick={onClose}
                >
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
                        className={`kn-sheet relative z-10 text-[var(--foreground)] rounded-t-[1.75rem] sm:rounded-[1.75rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] max-h-[92svh] sm:max-h-[88vh] overflow-y-auto overscroll-contain no-scrollbar pb-[env(safe-area-inset-bottom)] ${className}`}
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
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}
