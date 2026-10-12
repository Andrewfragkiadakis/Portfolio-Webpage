import type { Transition } from 'motion/react'

/*
 * One motion vocabulary for the whole site, mirrored in globals.css (--motion-*, --ease-*).
 *
 *   standard   — hovers, colour changes, opacity-only state
 *   apple      — anything entering or settling into place (apple.com's product-page curve)
 *   exit       — anything leaving
 *   emphasized — large user-initiated moves (theme circle, count-up)
 *   springs    — physical surfaces (sheets, dialogs), critically damped: no bounce anywhere
 *
 * Scroll-linked effects are always linear. Staggers stop after five steps. In Motion,
 * animate `transform` strings rather than x/y/scale so they run on the compositor.
 */

/** Seconds (Motion). CSS twins: --motion-fast / --motion-base / --motion-slow / --motion-reveal. */
export const DURATION = {
    fast: 0.2,
    base: 0.3,
    slow: 0.5,
    reveal: 0.7,
    count: 1.2,
} as const

export const STAGGER = 0.05

type Bezier = readonly [number, number, number, number]

export const EASE = {
    standard: [0.25, 0.1, 0.25, 1],
    apple: [0.28, 0.11, 0.32, 1],
    exit: [0.4, 0, 1, 1],
    emphasized: [0.16, 1, 0.3, 1],
} as const satisfies Record<string, Bezier>

export const SPRING = {
    sheet: { type: 'spring', visualDuration: 0.5, bounce: 0 },
    ui: { type: 'spring', visualDuration: 0.3, bounce: 0 },
} as const satisfies Record<string, Transition>

export const TRANSITION = {
    hover: { duration: DURATION.fast, ease: EASE.standard },
    fade: { duration: DURATION.fast, ease: EASE.standard },
    move: { duration: DURATION.base, ease: EASE.apple },
    container: { duration: DURATION.slow, ease: EASE.apple },
    reveal: { duration: DURATION.reveal, ease: EASE.apple },
    exit: { duration: DURATION.base, ease: EASE.exit },
    enter: SPRING.sheet,
} as const satisfies Record<string, Transition>

export const ms = (seconds: number) => Math.round(seconds * 1000)
export const cubicBezier = (e: Bezier) => `cubic-bezier(${e.join(', ')})`

/** Temporary alias while call sites migrate to EASE.apple. */
export const EASE_APPLE = EASE.apple
