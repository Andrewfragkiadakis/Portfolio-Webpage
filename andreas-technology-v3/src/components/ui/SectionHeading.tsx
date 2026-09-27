'use client'

import { motion, type Variants } from 'motion/react'
import { EASE_OUT } from '@/utils/motion'

interface SectionHeadingProps {
    /** Anchor id used by navigation and smooth-scroll. */
    id: string
    /** Section number shown as "01". */
    index: number
    /** Short uppercase label beside the number, e.g. the nav label. */
    label: string
    /** Mixed-case display title. */
    title: string
    /** Kept for callers; no longer rendered (Round 5 removed the right-hand folio). */
    subtitle?: string
    /** Font-size utility for the title. */
    sizeClass?: string
    className?: string
}

export const WORD_STAGGER = 0.07

const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: WORD_STAGGER } },
}

const word: Variants = {
    hidden: { y: '105%' },
    visible: { y: '0%', transition: { duration: 0.9, ease: EASE_OUT } },
}

const formatIndex = (n: number) => String(n).padStart(2, '0')

/**
 * Editorial section head: a light hairline carrying "NN  LABEL", then the solid
 * display title with a masked word-by-word rise. The accessible
 * name is the plain title; the split words are presentational.
 */
export default function SectionHeading({
    id,
    index,
    label,
    title,
    sizeClass = 'text-[clamp(2.75rem,14vw,4.75rem)] md:text-[min(8.4vw,14vh)]',
    className = '',
}: SectionHeadingProps) {
    const words = title.split(' ')

    return (
        <header id={id} className={`w-full ${className}`}>
            <div className="rule-t grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6 pt-3">
                <span className="eyebrow index-accent tabular col-span-1">{formatIndex(index)}</span>
                <span className="eyebrow col-span-3 md:col-span-11 text-[var(--foreground)]">{label}</span>
            </div>
            {/* Keyed by title so a language switch remounts and replays the reveal
                instead of mounting new words under an already-finished parent. */}
            <motion.h2
                key={title}
                aria-label={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={container}
                className={`display ${sizeClass} mt-4 md:mt-5 flex flex-wrap gap-x-[0.24em] text-[var(--foreground)]`}
            >
                {words.map((w, wi) => (
                    <span key={`${w}-${wi}`} aria-hidden="true" className="inline-flex overflow-hidden pb-[0.08em] -mb-[0.08em]">
                        <motion.span variants={word} className="inline-block will-change-transform">
                            {w}
                        </motion.span>
                    </span>
                ))}
            </motion.h2>
        </header>
    )
}
