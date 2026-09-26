'use client'

import { useEffect, useRef } from 'react'

/**
 * Shrinks a display block only when a line would overflow its box (the Greek surname
 * is wider than the Latin one; the email address is long). Writes a scale factor to
 * `--fit` on the element, which its font-size multiplies by — so the base size stays
 * in CSS and the server render is already correct for the common case.
 *
 * Mark each line to measure with `data-fit-line` (an inline-block, nowrap element).
 */
export function useFitWidth<T extends HTMLElement>(watch: unknown) {
    const ref = useRef<T>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const fit = () => {
            const current = parseFloat(el.style.getPropertyValue('--fit')) || 1
            const lines = Array.from(el.querySelectorAll<HTMLElement>('[data-fit-line]'))
            const widest = Math.max(...lines.map((line) => line.scrollWidth / current))
            if (!widest) return
            const next = Math.min(1, (el.clientWidth * 0.995) / widest)
            el.style.setProperty('--fit', next.toFixed(4))
        }
        fit()
        const observer = new ResizeObserver(fit)
        observer.observe(el)
        document.fonts?.ready.then(fit).catch(() => {})
        return () => observer.disconnect()
    }, [watch])

    return ref
}
