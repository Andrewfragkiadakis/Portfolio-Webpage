'use client'

import { motion, useTransform, type MotionValue } from 'motion/react'

/**
 * Thin progress rail for a horizontal carousel: the thumb's width is the visible
 * fraction and its position tracks scroll, so visitors can see how much is left.
 */
export default function ScrollRail({ progress, ratio, className = '' }: { progress: MotionValue<number>; ratio: MotionValue<number>; className?: string }) {
    const width = useTransform(ratio, (r) => `${Math.max(r, 0.08) * 100}%`)
    // translateX in % is relative to the thumb's own width.
    const x = useTransform([progress, ratio], ([p, r]: number[]) => {
        const w = Math.max(r, 0.08)
        return `${p * ((1 - w) / w) * 100}%`
    })
    const hidden = useTransform(ratio, (r) => (r >= 0.999 ? 0 : 1))

    return (
        <motion.div className={`relative h-px w-full bg-[var(--foreground)]/15 ${className}`} style={{ opacity: hidden }} aria-hidden="true">
            <motion.div className="absolute inset-y-0 left-0 -top-px h-[3px] bg-[var(--accent-brand)]" style={{ width, x }} />
        </motion.div>
    )
}
