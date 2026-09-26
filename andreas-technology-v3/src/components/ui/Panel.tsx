'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

interface PanelProps {
    id: string
    children: ReactNode
    className?: string
    /** Accessible name for the region (usually the section title). */
    label?: string
    /** Drive the reveal from outside (the hero waits for the intro) instead of from view. */
    play?: boolean
}

/**
 * A full-screen section of the journey. Its in-view state drives every block wipe and
 * line rise inside it through variants, so one observer choreographs the whole panel.
 * Under reduced motion nothing is ever hidden: children start in their final state.
 */
export default function Panel({ id, children, className = '', label, play }: PanelProps) {
    const reduce = useReducedMotion()
    const controlled = play !== undefined

    return (
        <motion.section
            id={id}
            aria-label={label}
            initial={reduce ? false : 'hidden'}
            {...(controlled
                ? { animate: play || reduce ? 'visible' : 'hidden' }
                : { whileInView: 'visible', viewport: { once: true, amount: 0.1 } })}
            className={`relative w-full md:h-full ${className}`}
        >
            {children}
        </motion.section>
    )
}
