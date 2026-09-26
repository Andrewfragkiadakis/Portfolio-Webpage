'use client'

import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { EASE_OUT } from '@/utils/motion'

interface AnimatedCounterProps {
    value: number
    suffix?: string
    /** Zero-pad to this many digits, Indisea-style ("07+", "03"). */
    pad?: number
    duration?: number
    /** Hold the count until this is true (the hero waits for the intro overlay). */
    play?: boolean
}

const format = (n: number, pad: number, suffix: string) => `${String(Math.round(n)).padStart(pad, '0')}${suffix}`

/**
 * Counts up once in view. Writes straight to the DOM so it never re-renders React per
 * frame. The server/initial render shows the final value, so it is correct without JS
 * and under reduced motion.
 */
export default function AnimatedCounter({ value, suffix = '', pad = 0, duration = 1.6, play = true }: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true })
    const prefersReducedMotion = useReducedMotion()

    useEffect(() => {
        const el = ref.current
        if (!el || !isInView || !play) return
        if (prefersReducedMotion) {
            el.textContent = format(value, pad, suffix)
            return
        }
        const controls = animate(0, value, {
            duration,
            ease: EASE_OUT,
            onUpdate: (latest) => { el.textContent = format(latest, pad, suffix) },
        })
        return () => controls.stop()
    }, [isInView, play, value, suffix, pad, duration, prefersReducedMotion])

    return <span ref={ref} className="tabular-nums">{format(value, pad, suffix)}</span>
}
