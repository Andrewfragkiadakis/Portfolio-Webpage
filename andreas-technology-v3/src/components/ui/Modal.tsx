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
    /** Text in the window title bar, e.g. "Quick Look". */
    title?: string
    children: ReactNode
    className?: string
}

/**
 * A dialog drawn as a desktop window (Quick Look style): the red traffic light is the
 * real close button, and small screens also get a text button that is easier to hit.
 *
 * Accessible dialog: Escape closes it, focus is trapped inside while open, and focus
 * returns to whatever opened it. Rendered through a portal so it escapes the
 * transformed horizontal track, which would otherwise become its containing block.
 */
export default function Modal({
    open,
    onClose,
    labelledBy,
    closeLabel = 'Close',
    title = '',
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
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-black/45 backdrop-blur-[6px]" />
                    <motion.div
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={labelledBy}
                        initial={{ opacity: 0, scale: 0.9, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 12 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className={`os-window relative z-10 bg-[var(--window-solid)] max-h-[88vh] ${className}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="os-titlebar grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                            <span className="os-lights">
                                <button
                                    ref={closeRef}
                                    type="button"
                                    onClick={onClose}
                                    aria-label={closeLabel}
                                    className="group relative -m-1.5 p-1.5 rounded-full focus-visible:outline-offset-0"
                                >
                                    <span className="os-light os-light--close flex items-center justify-center text-[0.5rem] text-black/60">
                                        <i className="fas fa-xmark opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true" />
                                    </span>
                                </button>
                                <span className="os-light os-light--min" aria-hidden="true" />
                                <span className="os-light os-light--max" aria-hidden="true" />
                            </span>
                            <span className="os-title text-center">{title}</span>
                            <button
                                type="button"
                                onClick={onClose}
                                className="md:hidden justify-self-end text-body-sm font-semibold text-[var(--accent)] px-2 py-1.5 -my-1.5 rounded-md caps-gr"
                            >
                                {closeLabel}
                            </button>
                        </div>
                        <div className="min-h-0 overflow-y-auto overscroll-contain">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}
