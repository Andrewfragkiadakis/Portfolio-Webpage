'use client'

import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import AnimatedCounter from '@/components/ui/AnimatedCounter'

export interface Ring {
    /** Fraction of the ring to fill, 0–1. Only real, published figures. */
    value: number
    /** Gradient stops, start → end. */
    from: string
    to: string
}

const STROKE = 9
const RADII = [43, 31]

/**
 * Activity-ring gauge. Each ring fills to its real value the first time it is seen; the
 * centre holds a count. Rings without a real percentage are simply not drawn.
 */
export default function FleetRings({ rings, count, countSuffix = '+', unit, play = true, className = '' }: {
    rings: Ring[]
    count: number
    countSuffix?: string
    unit: string
    play?: boolean
    className?: string
}) {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, amount: 0.4 })
    const reduceMotion = useReducedMotion()
    const show = reduceMotion || (inView && play)

    return (
        <div ref={ref} className={`relative aspect-square ${className}`}>
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90" aria-hidden="true">
                <defs>
                    {rings.map((ring, i) => (
                        <linearGradient key={i} id={`ring-grad-${i}`} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={ring.from} />
                            <stop offset="100%" stopColor={ring.to} />
                        </linearGradient>
                    ))}
                </defs>
                {rings.map((ring, i) => (
                    <g key={i}>
                        <circle cx="50" cy="50" r={RADII[i]} fill="none" stroke={ring.from} strokeOpacity="0.2" strokeWidth={STROKE} />
                        <motion.circle
                            cx="50" cy="50" r={RADII[i]}
                            fill="none"
                            stroke={`url(#ring-grad-${i})`}
                            strokeWidth={STROKE}
                            strokeLinecap="round"
                            initial={{ pathLength: reduceMotion ? ring.value : 0 }}
                            animate={{ pathLength: show ? ring.value : 0 }}
                            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 + i * 0.18 }}
                        />
                    </g>
                ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="numeral text-[1.6rem] md:text-[min(2.1vw,3.6vh)]">
                    <AnimatedCounter value={count} suffix={countSuffix} play={play} />
                </span>
                <span className="text-[0.625rem] md:text-[min(0.75vw,1.3vh)] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">{unit}</span>
            </div>
        </div>
    )
}
