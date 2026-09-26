'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'motion/react'
import { wipe, type WipeFrom } from '@/utils/motion'

interface FieldProps {
    children: ReactNode
    /** Edge the wipe starts from. */
    from?: WipeFrom
    delay?: number
    /**
     * Drive the wipe from outside (the hero waits for the intro). When omitted the
     * field wipes in the first time a quarter of it is on screen.
     */
    play?: boolean
    className?: string
    /** Extra classes for the observed wrapper (layout: grid placement, sizing). */
    wrapperClassName?: string
}

/**
 * A full-bleed cobalt field that wipes in with a clip-path as its panel enters.
 *
 * The in-view observer sits on an unclipped wrapper: an element clipped to nothing is
 * not a dependable intersection target. Under reduced motion a CSS rule removes the
 * clip entirely (globals.css), so the field is simply there — no JS race, no flash.
 */
export default function Field({ children, from = 'left', delay = 0, play, className = '', wrapperClassName = '' }: FieldProps) {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, amount: 0.25 })
    const shown = play ?? inView

    return (
        <div ref={ref} className={wrapperClassName}>
            <motion.div
                data-field-wipe
                className={`field ${className}`}
                variants={wipe(from, delay)}
                initial="hidden"
                animate={shown ? 'visible' : 'hidden'}
            >
                {children}
            </motion.div>
        </div>
    )
}
