'use client'

import { motion, type Variants } from 'motion/react'
import { EASE_OUT, LETTER_STAGGER } from '@/utils/motion'

interface SectionHeadingProps {
    /** Anchor id used by navigation and smooth-scroll. */
    id: string
    title: string
    subtitle: string
    align?: 'start' | 'end'
    /** Font-size utility for the outlined title. */
    sizeClass?: string
    className?: string
}

const EASE = EASE_OUT

const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: LETTER_STAGGER } },
}

const letter: Variants = {
    hidden: { y: '110%' },
    visible: { y: '0%', transition: { duration: 0.8, ease: EASE } },
}

/**
 * Outlined display heading with a masked, per-letter rise — the same reveal every
 * section uses, so the rhythm stays consistent and each section only passes copy.
 * The accessible name is the plain title; the split letters are presentational.
 */
export default function SectionHeading({
    id,
    title,
    subtitle,
    align = 'start',
    sizeClass = 'text-[12vw] md:text-[min(8vw,9vh)]',
    className = '',
}: SectionHeadingProps) {
    const alignClass = align === 'end' ? 'items-end text-right' : 'items-start'
    const words = title.split(' ')

    return (
        <div id={id} className={`flex flex-col gap-2 w-full ${alignClass} ${className}`}>
            <motion.h2
                aria-label={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={container}
                className={`${sizeClass} leading-[0.85] font-black tracking-tighter text-transparent select-none uppercase flex flex-wrap gap-x-[0.25em] ${align === 'end' ? 'justify-end' : ''}`}
                style={{ WebkitTextStroke: '2px var(--foreground)' }}
            >
                {words.map((word, wi) => (
                    <span key={wi} aria-hidden="true" className="inline-flex overflow-hidden pb-[0.06em] px-[0.05em] -mx-[0.05em]">
                        {Array.from(word).map((char, ci) => (
                            <motion.span key={ci} variants={letter} className="inline-block will-change-transform">
                                {char}
                            </motion.span>
                        ))}
                    </span>
                ))}
            </motion.h2>
            <motion.span
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
                className={`text-sm font-mono tracking-widest uppercase text-[var(--foreground)] ${align === 'end' ? 'pr-2' : 'pl-2'} flex items-center gap-3`}
            >
                <span className="h-px w-8 bg-[var(--accent)]" aria-hidden="true" />
                {subtitle.replace(/^\/\/\s*/, '')}
            </motion.span>
        </div>
    )
}
