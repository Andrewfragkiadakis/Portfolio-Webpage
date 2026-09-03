'use client'

import { useEffect, useRef, useState, type ElementType } from 'react'

/** Glyph pool for the noise pass — same family as the hero LetterGlitch, so it reads as one motif. */
const GLYPHS = '!<>-_\\/[]{}—=+*^?#________'
/** Frames each character spends scrambling before it locks in. Higher = slower decode. */
const FRAMES_PER_CHAR = 2.4

function randomGlyph(): string {
    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

interface ScrambleTextProps {
    text: string
    className?: string
    /** Rendered element. Headings should pass their real level rather than nesting one. */
    as?: ElementType
    style?: React.CSSProperties
}

/**
 * Decodes text out of noise when it scrolls into view — the hero's LetterGlitch motif,
 * reused as a section-heading signature.
 *
 * Accessibility: the real string is always in the DOM inside a visually-hidden span, and
 * the animated layer is `aria-hidden`. A screen reader never hears the noise, and the
 * accessible name never changes mid-animation.
 *
 * Reduced motion, no IntersectionObserver, or a failed run all resolve to the final text.
 */
export default function ScrambleText({ text, className = '', as: Tag = 'span', style }: ScrambleTextProps) {
    const containerRef = useRef<HTMLElement>(null)
    const frameRef = useRef<number | undefined>(undefined)
    const [display, setDisplay] = useState(text)
    const [renderedText, setRenderedText] = useState(text)

    // A language switch replaces `text` mid-life. Resetting during render (rather than in an
    // effect) means the new string is painted immediately, with no frame of stale glyphs.
    if (text !== renderedText) {
        setRenderedText(text)
        setDisplay(text)
    }

    useEffect(() => {
        const node = containerRef.current
        if (!node || typeof window === 'undefined') return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        if (typeof IntersectionObserver === 'undefined') return

        let cancelled = false

        const run = () => {
            const chars = Array.from(text)
            // Each character gets its own start/end frame, so the string resolves left to right.
            const schedule = chars.map((_, index) => ({
                start: index * FRAMES_PER_CHAR,
                end: index * FRAMES_PER_CHAR + FRAMES_PER_CHAR * 3,
            }))
            const totalFrames = schedule[schedule.length - 1]?.end ?? 0
            let frame = 0

            const step = () => {
                if (cancelled) return

                const output = chars.map((char, index) => {
                    if (char === ' ') return ' '
                    const { start, end } = schedule[index]
                    if (frame >= end) return char
                    // A space, not an empty string: the character count — and therefore the
                    // line's width — stays constant from the first frame to the last.
                    if (frame < start) return ' '
                    return randomGlyph()
                })

                setDisplay(output.join(''))

                if (frame >= totalFrames) {
                    setDisplay(text)
                    return
                }

                frame += 1
                frameRef.current = requestAnimationFrame(step)
            }

            step()
        }

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue
                    observer.disconnect()
                    run()
                }
            },
            { threshold: 0.35 }
        )

        observer.observe(node)

        return () => {
            cancelled = true
            observer.disconnect()
            if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current)
        }
    }, [text])

    return (
        <Tag ref={containerRef} className={className} style={style}>
            <span className="sr-only">{text}</span>
            {/*
              One painted span, laid out normally. An absolutely-positioned overlay sized to
              a spacer underneath looks tempting for width stability, but `inset-0` pins the
              text to the spacer's inline box and clips glyphs that overflow it — which is
              exactly what large, tightly-tracked display type does.

              Width stays stable anyway because every frame emits the same number of
              characters as the final string; only the glyphs differ.
            */}
            <span aria-hidden="true" className="whitespace-pre">{display}</span>
        </Tag>
    )
}
