'use client'

import { useEffect, useRef, useState } from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*/<>'
const DURATION_MS = 450

/**
 * Decodes its text left-to-right from random glyphs whenever the parent control is
 * hovered or focused, like a terminal readout. The real text keeps its place in the
 * layout (so nothing shifts) and is what assistive tech reads; the scramble is a
 * visual overlay. Skipped entirely under reduced motion.
 */
export default function ScrambleText({ text }: { text: string }) {
    const ref = useRef<HTMLSpanElement>(null)
    const [display, setDisplay] = useState(text)

    // Keep in sync when the language changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setDisplay(text), [text])

    useEffect(() => {
        const trigger = ref.current?.parentElement
        if (!trigger) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        let frame = 0
        const run = () => {
            cancelAnimationFrame(frame)
            const start = performance.now()
            const tick = (now: number) => {
                const progress = Math.min((now - start) / DURATION_MS, 1)
                const resolved = Math.floor(progress * text.length)
                setDisplay(
                    Array.from(text)
                        .map((char, i) => (i < resolved || char === ' ' ? char : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
                        .join('')
                )
                if (progress < 1) frame = requestAnimationFrame(tick)
            }
            frame = requestAnimationFrame(tick)
        }

        trigger.addEventListener('pointerenter', run)
        trigger.addEventListener('focus', run)
        return () => {
            cancelAnimationFrame(frame)
            trigger.removeEventListener('pointerenter', run)
            trigger.removeEventListener('focus', run)
        }
    }, [text])

    return (
        <span ref={ref} className="relative inline-block whitespace-nowrap">
            <span className="invisible">{text}</span>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true" className="absolute inset-0">{display}</span>
        </span>
    )
}
