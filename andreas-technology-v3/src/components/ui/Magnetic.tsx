'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'

interface MagneticProps {
    children: ReactNode
    /** Fraction of the pointer offset the element follows. */
    strength?: number
    className?: string
}

/**
 * Pulls its child slightly toward the pointer and springs back on leave.
 * Mouse-only by construction (pointer events with pointerType "mouse"), and inert
 * under reduced motion, so touch and accessibility users get the plain control.
 */
export default function Magnetic({ children, strength = 0.3, className = 'inline-block' }: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null)
    const prefersReducedMotion = useReducedMotion()
    const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 })
    const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 })

    const onMove = (e: React.PointerEvent) => {
        if (prefersReducedMotion || e.pointerType !== 'mouse' || !ref.current) return
        const rect = ref.current.getBoundingClientRect()
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
    }

    const reset = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div ref={ref} onPointerMove={onMove} onPointerLeave={reset} style={{ x, y }} className={className}>
            {children}
        </motion.div>
    )
}
