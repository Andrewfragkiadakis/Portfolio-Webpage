'use client'

import { createContext, Fragment, useContext, useEffect, useRef, type ReactNode } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform, type MotionValue, type Variants } from 'motion/react'
import { SECTION_STEPS } from '@/data/sections'
import { EASE_OUT } from '@/utils/motion'

/* ─────────────────────────────────────────────────────────────────────────────
 * Track context: lets any slide read where it sits on the horizontal journey,
 * so layers can drift at different speeds (parallax) and product shots can
 * scale up as they arrive. Driven by scroll progress — never by the cursor.
 * ───────────────────────────────────────────────────────────────────────────── */

interface TrackValue {
    /** 0..1 progress along the desktop track. */
    progress: MotionValue<number>
    /** 1 on desktop with motion allowed, 0 otherwise — collapses every effect to rest. */
    gate: MotionValue<number>
}

export const TrackContext = createContext<TrackValue | null>(null)
export const SlideIndexContext = createContext<number>(0)

/**
 * Signed distance of this slide from the centre of the viewport, in slides:
 * 0 when centred, −1 while it is one slide to the right (arriving), +1 once it has left.
 * Always 0 on mobile or with reduced motion.
 */
export function useSlideOffset(): MotionValue<number> {
    const track = useContext(TrackContext)
    const index = useContext(SlideIndexContext)
    const zero = useMotionValue(0)
    const one = useMotionValue(0)
    return useTransform(
        [track?.progress ?? zero, track?.gate ?? one],
        ([progress, gate]: number[]) => (progress * SECTION_STEPS - index) * gate
    )
}

/**
 * A layer that drifts sideways as its slide travels. Positive depth moves faster than
 * the slide (foreground), negative depth lags behind it (background).
 */
export function Parallax({ depth, className = '', children }: { depth: number; className?: string; children?: ReactNode }) {
    const offset = useSlideOffset()
    const x = useTransform(offset, (o) => `${-o * depth * 100}vw`)
    return (
        <motion.div style={{ x }} className={className}>
            {children}
        </motion.div>
    )
}

/** Scales a product shot up from 0.86 as its slide arrives, and back down as it leaves. */
export function ScaleIn({ className = '', children }: { className?: string; children: ReactNode }) {
    const offset = useSlideOffset()
    const scale = useTransform(offset, (o) => 1 - Math.min(Math.abs(o), 1) * 0.14)
    const x = useTransform(offset, (o) => `${-o * 12}vw`)
    return (
        <motion.div style={{ scale, x }} className={className}>
            {children}
        </motion.div>
    )
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Type
 * ───────────────────────────────────────────────────────────────────────────── */

/** Apple's link chevron (›), drawn so it sits on the baseline in any font. */
export function Chevron({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 8 14" className={`kn-chevron ${className}`} aria-hidden="true" fill="none">
            <path d="M1.2 1.2 6.8 7l-5.6 5.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

/** North-east arrow for links that leave the site. */
export function ArrowOut({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 12 12" className={`inline-block w-[0.62em] h-[0.62em] shrink-0 ${className}`} aria-hidden="true" fill="none">
            <path d="M3 9 9 3M4 3h5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

/** Renders `**phrase**` as a highlighted phrase (see `.kn-lede strong`). */
export function Rich({ text }: { text: string }) {
    const parts = text.split('**')
    return (
        <>
            {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>))}
        </>
    )
}

type Segment = { text: string; grad: boolean }

/** `"Line one\n*Gradient* words"` → lines of segments. `*…*` marks the gradient phrase. */
function parseHeadline(text: string): Segment[][] {
    return text.split('\n').map((line) =>
        line.split('*').map((chunk, i) => ({ text: chunk, grad: i % 2 === 1 })).filter((s) => s.text.length > 0)
    )
}

const WORDS: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.075 } },
}

const WORD: Variants = {
    hidden: { y: '108%', opacity: 0 },
    visible: { y: '0%', opacity: 1, transition: { duration: 0.95, ease: EASE_OUT } },
}

interface HeadlineProps {
    text: string
    as?: 'h1' | 'h2' | 'h3' | 'p'
    id?: string
    className?: string
    /** Controlled reveal (the hero waits for the intro). Omit to reveal on first view. */
    play?: boolean
    /** Extra words to read before the visible headline, e.g. the name in the hero h1. */
    srPrefix?: string
}

/**
 * Keynote headline: each word rises out of its own mask, one after another. Screen
 * readers get the plain sentence once; the split words are presentational.
 */
export function Headline({ text, as = 'h2', id, className = '', play, srPrefix }: HeadlineProps) {
    const Tag = as
    const lines = parseHeadline(text)
    const plain = lines.map((line) => line.map((s) => s.text).join('')).join(' ')
    const control = play === undefined
        ? { initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.4 } }
        : { initial: 'hidden', animate: play ? 'visible' : 'hidden' }

    return (
        <Tag id={id} className={`kn-display ${className}`}>
            <span className="sr-only">{srPrefix ? `${srPrefix} ` : ''}{plain}</span>
            <motion.span aria-hidden="true" className="block" variants={WORDS} {...control}>
                {lines.map((line, li) => (
                    <span key={li} className="block">
                        {line.map((seg, si) =>
                            seg.text.split(/(\s+)/).map((word, wi) => {
                                if (word.length === 0) return null
                                if (/^\s+$/.test(word)) return <Fragment key={`${si}-${wi}`}> </Fragment>
                                return (
                                    <span key={`${si}-${wi}`} className="inline-block overflow-hidden align-bottom pt-[0.06em] -mt-[0.06em] pb-[0.12em] -mb-[0.12em] pr-[0.04em] -mr-[0.04em]">
                                        <motion.span variants={WORD} className={`inline-block will-change-transform ${seg.grad ? 'kn-grad' : ''}`}>
                                            {word}
                                        </motion.span>
                                    </span>
                                )
                            })
                        )}
                    </span>
                ))}
            </motion.span>
        </Tag>
    )
}

/** Small fade-and-rise used for everything that follows a headline. */
export function Rise({ children, delay = 0, className = '', play, as = 'div' }: { children: ReactNode; delay?: number; className?: string; play?: boolean; as?: 'div' | 'li' }) {
    const Component = as === 'li' ? motion.li : motion.div
    const control = play === undefined
        ? { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 } }
        : { initial: { opacity: 0, y: 18 }, animate: play ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 } }
    return (
        <Component {...control} transition={{ duration: 0.9, ease: EASE_OUT, delay }} className={className}>
            {children}
        </Component>
    )
}

/** Counts up once in view. Writes straight to the DOM so React never re-renders per frame. */
export function CountUp({ value, suffix = '', duration = 1.8 }: { value: number; suffix?: string; duration?: number }) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true, amount: 0.6 })
    const reduce = useReducedMotion()

    useEffect(() => {
        const el = ref.current
        if (!el || !isInView) return
        if (reduce) {
            el.textContent = `${value}${suffix}`
            return
        }
        const controls = animate(0, value, {
            duration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (latest) => { el.textContent = `${Math.round(latest)}${suffix}` },
        })
        return () => controls.stop()
    }, [isInView, value, suffix, duration, reduce])

    // The server render shows the final value, so it is correct without JavaScript.
    return <span ref={ref}>{value}{suffix}</span>
}
