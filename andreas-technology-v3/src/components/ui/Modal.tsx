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
                    <div className="absolute inset-0 bg-black/45 dark:bg-black/70 backdrop-blur-md" />
                    <motion.div
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={labelledBy}
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 16 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className={`relative z-10 bg-[var(--surface)] text-[var(--foreground)] rounded-[2rem] border border-[var(--line)] shadow-[0_40px_80px_-24px_rgba(0,0,0,0.45)] max-h-[85vh] overflow-y-auto no-scrollbar ${className}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            ref={closeRef}
                            type="button"
                            onClick={onClose}
                            aria-label={closeLabel}
                            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-[var(--surface-2)]/90 backdrop-blur text-[var(--foreground)] hover:bg-[var(--accent-fill)] hover:text-white transition-colors"
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
