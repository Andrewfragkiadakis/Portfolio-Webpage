'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { TrafficLights } from '@/components/ui/Window'
import { WINDOW_SPRING } from '@/utils/motion'

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
    const reduceMotion = useReducedMotion()

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
                    transition={{ duration: reduceMotion ? 0 : 0.18 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    {/* A light scrim and no backdrop blur: Quick Look floats over the desktop, and a
                        full-screen blur would re-render the whole page on every frame of the fade. */}
                    <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
                    <motion.div
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={labelledBy}
                        initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.96, transition: { duration: 0.16, ease: 'easeOut' } }}
                        transition={reduceMotion ? { duration: 0 } : WINDOW_SPRING}
                        className={`os-window is-key relative z-10 max-h-[88vh] ${className}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="os-titlebar os-titlebar--compact !grid grid-cols-[1fr_auto_1fr] items-center !min-h-11 md:!min-h-7">
                            <TrafficLights labels={{ close: closeLabel, minimize: '', zoom: '' }} onClose={onClose} closeRef={closeRef} />
                            <span className="os-title os-title--compact text-center">{title}</span>
                            <button
                                type="button"
                                onClick={onClose}
                                className="md:hidden justify-self-end text-body-sm font-semibold text-[var(--accent)] px-2 py-1.5 -my-1.5 rounded-md caps-gr"
                            >
                                {closeLabel}
                            </button>
                        </div>
                        <div className="os-scroll min-h-0 overflow-y-auto overscroll-contain">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}
