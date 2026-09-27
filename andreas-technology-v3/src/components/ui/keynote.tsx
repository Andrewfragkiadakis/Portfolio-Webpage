'use client'

import { createContext, Fragment, useContext, useEffect, useRef, type ReactNode } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'motion/react'
import { SECTION_STEPS } from '@/data/sections'
import { EASE_APPLE } from '@/utils/motion'

/* ─────────────────────────────────────────────────────────────────────────────
 * Track context: lets a slide know where it sits on the horizontal journey, so the
 * product shot can scale up as its slide arrives. Driven by scroll — never the cursor.
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
    return useTransform(
        [track?.progress ?? zero, track?.gate ?? zero],
        ([progress, gate]: number[]) => (progress * SECTION_STEPS - index) * gate
    )
}

/** Scales a product shot up from 0.9 as its slide arrives, and back down as it leaves. */
export function ScaleIn({ className = '', children }: { className?: string; children: ReactNode }) {
    const offset = useSlideOffset()
    const scale = useTransform(offset, (o) => 1 - Math.min(Math.abs(o), 1) * 0.1)
    const opacity = useTransform(offset, (o) => 1 - Math.min(Math.abs(o), 1) * 0.6)
    return (
        <motion.div style={{ scale, opacity }} className={className}>
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
            <path d="M1.5 1.5 6.5 7l-5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

/** North-east arrow for links that leave the site. */
export function ArrowOut({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 12 12" className={`inline-block w-[0.6em] h-[0.6em] shrink-0 ml-[0.1em] ${className}`} aria-hidden="true" fill="none">
            <path d="M3 9 9 3M4 3h5v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

/**
 * Renders `**phrase**` as a highlighted phrase (see `.t-lede strong`). Short phrases
 * ("550+ Macs", "freelance projects") are kept on one line so a line break never splits
 * the emphasis; long ones may wrap so they can never overflow a phone.
 */
export function Rich({ text }: { text: string }) {
    const parts = text.split('**')
    return (
        <>
            {parts.map((part, i) =>
                i % 2 === 1
                    ? <strong key={i} className={part.length <= 22 ? 'whitespace-nowrap' : undefined}>{part}</strong>
                    : <Fragment key={i}>{part}</Fragment>
            )}
        </>
    )
}

type Segment = { text: string; accent: boolean }

/** `"Line one\n*Accent* words"` → lines of segments. `*…*` marks the accent phrase. */
function parseHeadline(text: string): Segment[][] {
    return text.split('\n').map((line) =>
        line.split('*').map((chunk, i) => ({ text: chunk, accent: i % 2 === 1 })).filter((s) => s.text.length > 0)
    )
}

/** Renders a headline string: `\n` breaks lines, `*…*` gets the site's single accent. */
export function HeadlineText({ text }: { text: string }) {
    return (
        <>
            {parseHeadline(text).map((line, li) => (
                <span key={li} className="block">
                    {line.map((seg, si) => (
                        <span key={si} className={seg.accent ? 't-accent' : undefined}>{seg.text}</span>
                    ))}
                </span>
            ))}
        </>
    )
}

const REVEAL = { opacity: 0, y: 24 }
const SHOWN = { opacity: 1, y: 0 }

interface HeadlineProps {
    text: string
    as?: 'h1' | 'h2' | 'h3' | 'p'
    id?: string
    className?: string
    /** Controlled reveal (the hero waits for the intro). Omit to reveal on first view. */
    play?: boolean
}

/** Section headline: the whole line fades and rises into place, as on apple.com. */
export function Headline({ text, as = 'h2', id, className = '', play }: HeadlineProps) {
    const Tag = motion[as]
    const control = play === undefined
        ? { initial: REVEAL, whileInView: SHOWN, viewport: { once: true, amount: 0.5 } }
        : { initial: REVEAL, animate: play ? SHOWN : REVEAL }

    return (
        <Tag id={id} className={className} {...control} transition={{ duration: 1, ease: EASE_APPLE }}>
            <HeadlineText text={text} />
        </Tag>
    )
}

/** Gentle fade-and-rise used for everything that follows a headline. */
export function Rise({ children, delay = 0, className = '', play, as = 'div' }: { children: ReactNode; delay?: number; className?: string; play?: boolean; as?: 'div' | 'li' }) {
    const Component = as === 'li' ? motion.li : motion.div
    const control = play === undefined
        ? { initial: REVEAL, whileInView: SHOWN, viewport: { once: true, amount: 0.2 } }
        : { initial: REVEAL, animate: play ? SHOWN : REVEAL }
    return (
        <Component {...control} transition={{ duration: 1, ease: EASE_APPLE, delay }} className={className}>
            {children}
        </Component>
    )
}

/** Counts up once in view. Writes straight to the DOM so React never re-renders per frame. */
export function CountUp({ value, suffix = '', duration = 1.6 }: { value: number; suffix?: string; duration?: number }) {
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

/* ─────────────────────────────────────────────────────────────────────────────
 * Slide header
 * ───────────────────────────────────────────────────────────────────────────── */

/**
 * The one header every content slide shares: eyebrow, headline and an optional aside
 * (a sub-line or link) aligned to the headline's baseline on desktop. Keeping it in one
 * place keeps the type sizes and the gap to the content identical from slide to slide.
 */
export function SlideHeader({ id, eyebrow, headline, aside }: { id: string; eyebrow: string; headline: string; aside?: ReactNode }) {
    return (
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-10">
            <div className="min-w-0">
                <Rise>
                    <p className="t-eyebrow">{eyebrow}</p>
                </Rise>
                <Headline id={id} text={headline} className={`t-headline mt-1.5 md:mt-2 ${HEADLINE_SIZE}`} />
            </div>
            {aside && (
                <Rise delay={0.15} className="md:pb-[0.35em] md:text-right md:max-w-[24rem] md:shrink-0">
                    {aside}
                </Rise>
            )}
        </div>
    )
}

/**
 * Section headline sizes: 40px on phones (a step smaller on the narrowest ones, so
 * two-line Greek headlines do not break into three), apple.com's 56–64px on desktop.
 */
export const HEADLINE_SIZE = 'text-[clamp(2rem,9.4vw,2.5rem)] md:text-[min(4.4vw,7.2vh)]'

/** Gap between a slide header and its content. */
export const HEADER_GAP = 'mt-9 md:mt-[min(2.5rem,4.4vh)]'

/** Content slides: top-aligned on desktop at the shared --slide-top, so headlines hold still between slides. */
export const SLIDE_CLASS = 'relative w-full md:h-full flex md:items-start px-6 sm:px-10 md:px-[max(3rem,7vw)] py-20 md:pb-0 md:pt-[var(--slide-top)]'
