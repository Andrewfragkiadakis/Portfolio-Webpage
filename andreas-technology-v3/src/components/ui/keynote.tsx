'use client'

import { createContext, Fragment, useContext, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { SECTION_STEPS } from '@/data/sections'
import { DURATION } from '@/utils/motion'

/* ─────────────────────────────────────────────────────────────────────────────
 * Track: each slide knows its index on the horizontal journey, so the product shot
 * can scale up as its slide arrives. Driven by scroll — never the cursor.
 * ───────────────────────────────────────────────────────────────────────────── */

export const SlideIndexContext = createContext<number>(0)

const percent = (step: number) => `${+((Math.min(SECTION_STEPS, Math.max(0, step)) / SECTION_STEPS) * 100).toFixed(3)}%`

/** Keyframes on the page's scroll timeline: at rest (scale 1) while its slide is centred. */
function scaleInKeyframes(index: number) {
    const away = 'transform: scale(0.9); opacity: 0.4;'
    const here = 'transform: none; opacity: 1;'
    const frames = [`${percent(index)} { ${here} }`]
    if (index > 0) frames.unshift(`0%, ${percent(index - 1)} { ${away} }`)
    if (index < SECTION_STEPS) frames.push(`${percent(index + 1)}, 100% { ${away} }`)
    return `@keyframes kn-scalein-${index} { ${frames.join(' ')} }`
}

/**
 * Scales a product shot up from 0.9 as its slide arrives, and back down as it leaves:
 * a scroll-driven CSS animation (compositor), with HorizontalLayout's fallback writing
 * the same values where scroll timelines are unsupported. Off on phones and with
 * reduced motion.
 */
export function ScaleIn({ className = '', children }: { className?: string; children: ReactNode }) {
    const index = useContext(SlideIndexContext)
    return (
        <div data-scalein={index} className={`kn-scalein ${className}`} style={{ '--scalein': `kn-scalein-${index}` } as CSSProperties}>
            <style href={`kn-scalein-${index}`} precedence="default">{scaleInKeyframes(index)}</style>
            {children}
        </div>
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

/** Reveal order within a slide: each step waits one --motion-stagger (50 ms); five at most. */
export type Step = 0 | 1 | 2 | 3 | 4 | 5

const stepStyle = (step: number) => ({ '--i': step }) as CSSProperties

interface HeadlineProps {
    text: string
    as?: 'h1' | 'h2' | 'h3' | 'p'
    id?: string
    className?: string
    step?: Step
}

/**
 * Section headline: the whole line fades and rises into place when its slide arrives, as
 * on apple.com. Pure CSS (.kn-reveal): it runs on the compositor and never waits for React.
 */
export function Headline({ text, as: Tag = 'h2', id, className = '', step = 1 }: HeadlineProps) {
    return (
        <Tag id={id} className={`kn-reveal ${className}`} style={stepStyle(step)}>
            <HeadlineText text={text} />
        </Tag>
    )
}

/** Gentle fade-and-rise for everything that follows a headline, ordered by `step`. */
export function Rise({ children, step = 0, className = '', as: Tag = 'div' }: { children: ReactNode; step?: Step; className?: string; as?: 'div' | 'li' }) {
    return (
        <Tag className={`kn-reveal ${className}`} style={stepStyle(step)}>
            {children}
        </Tag>
    )
}

/**
 * Counts up from zero once the number is on screen. The server renders the final value,
 * so it is right without JavaScript; the reset to zero happens while the number's reveal
 * still hides it. Writes straight to the DOM, so React never re-renders per frame.
 */
export function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        if (el.closest('.slide')?.hasAttribute('data-revealed')) return // already on screen: leave it
        el.textContent = `0${suffix}`
        let frame = 0
        const io = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return
            io.disconnect()
            const start = performance.now()
            const duration = DURATION.count * 1000
            const tick = (now: number) => {
                const t = Math.min(1, (now - start) / duration)
                el.textContent = `${Math.round((1 - Math.pow(1 - t, 4)) * value)}${suffix}`
                if (t < 1) frame = requestAnimationFrame(tick)
            }
            frame = requestAnimationFrame(tick)
        }, { threshold: 0.3 })
        io.observe(el)
        return () => {
            io.disconnect()
            cancelAnimationFrame(frame)
            el.textContent = `${value}${suffix}`
        }
    }, [value, suffix])

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
                <Rise step={0}>
                    <p className="t-eyebrow">{eyebrow}</p>
                </Rise>
                <Headline id={id} step={1} text={headline} className={`t-headline mt-1.5 md:mt-2 ${HEADLINE_SIZE}`} />
            </div>
            {aside && (
                <Rise step={2} className="md:pb-[0.35em] md:text-right md:max-w-[24rem] md:shrink-0">
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
