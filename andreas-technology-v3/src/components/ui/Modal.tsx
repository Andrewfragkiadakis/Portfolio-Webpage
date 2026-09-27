'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { EASE_IN_OUT } from '@/utils/motion'

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
 * returns to whatever opened it. Rendered through a portal so it escapes the
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
    const reduce = useReducedMotion()
    // The panel wipes open like a block. The clip is inset negatively once open so the
    // offset cobalt shadow (the panel's "second block") is not cut off.
    const OPEN = 'inset(-4px -16px -16px -4px)'

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
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-[var(--scrim)]" />
                    <motion.div
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={labelledBy}
                        initial={reduce ? { opacity: 0 } : { opacity: 1, clipPath: 'inset(100% -16px -16px -4px)' }}
                        animate={reduce ? { opacity: 1 } : { opacity: 1, clipPath: OPEN }}
                        exit={reduce ? { opacity: 0 } : { opacity: 1, clipPath: 'inset(-4px -16px 100% -4px)' }}
                        transition={{ duration: reduce ? 0 : 0.55, ease: EASE_IN_OUT }}
                        className={`relative z-10 bg-[var(--background)] text-[var(--foreground)] shadow-[inset_0_0_0_2px_var(--foreground),12px_12px_0_0_var(--block)] max-h-[85vh] overflow-y-auto ${className}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            ref={closeRef}
                            type="button"
                            onClick={onClose}
                            aria-label={closeLabel}
                            className="absolute top-3 right-3 z-20 w-11 h-11 flex items-center justify-center cursor-pointer bg-[var(--paper)] text-[var(--cobalt)] shadow-[inset_0_0_0_1.5px_var(--ink)] hover:bg-[var(--cobalt-deep)] hover:text-[var(--on-cobalt)] transition-colors duration-300 focus-visible:outline-offset-[-6px] focus-visible:outline-[var(--cobalt)]"
                        >
                            <i className="fas fa-times" aria-hidden="true" />
                        </button>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}
