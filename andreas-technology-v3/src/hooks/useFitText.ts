'use client'

import { useCallback, useLayoutEffect, useRef } from 'react'

interface FitOptions {
    /** Upper bound in px. */
    maxPx?: number
    /** Upper bound as a share of the viewport height, so giant words never push a panel past 100vh. */
    maxVh?: number
    minPx?: number
    /** Give every word the smallest fitted size, so a split name reads as one line of type. */
    shared?: boolean
    /** Re-fit when this changes (e.g. the language). */
    watch?: unknown
}

/**
 * Sizes single-line display words so each exactly fills the width of its box.
 *
 * Giant type is the whole point of the Cobalt Block style, and fixed vw sizes either
 * overflow on long words (Greek names, the email address) or leave dead space on short
 * ones. This measures the rendered word once per resize, scales its font-size by
 * boxWidth / textWidth (width is linear in font-size, letter-spacing is in em), and caps
 * it by px and vh. CSS sets a sensible clamp() first, so the server render is close.
 *
 * Usage: attach `box(i)` to a full-width block and `text(i)` to an inline-block,
 * nowrap span inside it.
 */
export function useFitText(count: number, { maxPx = 560, maxVh, minPx = 14, shared = false, watch }: FitOptions = {}) {
    const boxes = useRef<(HTMLElement | null)[]>([])
    const texts = useRef<(HTMLElement | null)[]>([])

    useLayoutEffect(() => {
        let frame = 0

        const fit = () => {
            const cap = Math.min(maxPx, maxVh ? (window.innerHeight * maxVh) / 100 : Infinity)
            const sizes: number[] = []

            for (let i = 0; i < count; i++) {
                const box = boxes.current[i]
                const text = texts.current[i]
                if (!box || !text) continue
                const boxStyle = getComputedStyle(box)
                const available = box.clientWidth - parseFloat(boxStyle.paddingLeft) - parseFloat(boxStyle.paddingRight)
                const current = parseFloat(getComputedStyle(text).fontSize)
                const width = text.offsetWidth
                if (!available || !width || !current) continue
                // 0.985 leaves room for glyph overhang at 900 weight.
                sizes[i] = Math.max(minPx, Math.min(cap, (current * available * 0.985) / width))
            }

            const smallest = Math.min(...sizes.filter(Boolean))
            for (let i = 0; i < count; i++) {
                const text = texts.current[i]
                const size = shared ? smallest : sizes[i]
                if (text && size && Number.isFinite(size)) text.style.fontSize = `${size.toFixed(2)}px`
            }
        }

        const schedule = () => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(fit)
        }

        fit()
        const observer = new ResizeObserver(schedule)
        boxes.current.forEach((box) => box && observer.observe(box))
        document.fonts?.ready.then(schedule).catch(() => {})

        return () => {
            cancelAnimationFrame(frame)
            observer.disconnect()
        }
    }, [count, maxPx, maxVh, minPx, shared, watch])

    const box = useCallback((i: number) => (el: HTMLElement | null) => { boxes.current[i] = el }, [])
    const text = useCallback((i: number) => (el: HTMLElement | null) => { texts.current[i] = el }, [])

    return { box, text }
}
