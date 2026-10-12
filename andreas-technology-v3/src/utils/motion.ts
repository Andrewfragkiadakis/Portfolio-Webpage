/*
 * One motion vocabulary for the whole site. Every animation is CSS (globals.css holds
 * the tokens as --motion-* and --ease-*); these are the same values for the few places
 * that animate from JavaScript (the count-up and the theme circle).
 *
 *   standard   — hovers, colour changes, opacity-only state
 *   apple      — anything entering or settling into place (apple.com's product-page curve)
 *   exit       — anything leaving
 *   emphasized — large user-initiated moves (theme circle, count-up)
 *
 * Only transform and opacity animate. Scroll-linked effects are linear. Staggers stop
 * after five steps. No bounce anywhere.
 */

/** Seconds. CSS twins: --motion-fast / --motion-base / --motion-slow / --motion-reveal. */
export const DURATION = {
    fast: 0.2,
    base: 0.3,
    slow: 0.5,
    reveal: 0.7,
    count: 1.2,
} as const

type Bezier = readonly [number, number, number, number]

export const EASE = {
    standard: [0.25, 0.1, 0.25, 1],
    apple: [0.28, 0.11, 0.32, 1],
    exit: [0.4, 0, 1, 1],
    emphasized: [0.16, 1, 0.3, 1],
} as const satisfies Record<string, Bezier>

export const ms = (seconds: number) => Math.round(seconds * 1000)
export const cubicBezier = (e: Bezier) => `cubic-bezier(${e.join(', ')})`
