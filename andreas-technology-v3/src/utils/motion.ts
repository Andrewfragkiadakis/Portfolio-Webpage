import type { Variants } from 'motion/react'

/**
 * Shared motion tokens so every reveal, hover and transition speaks the same language.
 * Enter with a long ease-out; leave faster with ease-in-out.
 */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const
/** Round 5: a gentler in-out (easeInOutCubic) than the original quint-like curve, so blocks glide rather than snap. */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

/** Fired by the intro overlay the moment the visitor enters the site. */
export const SITE_ENTERED_EVENT = 'site:entered'

export type WipeFrom = 'left' | 'right' | 'top' | 'bottom'

const CLOSED: Record<WipeFrom, string> = {
    left: 'inset(0% 100% 0% 0%)',
    right: 'inset(0% 0% 0% 100%)',
    top: 'inset(0% 0% 100% 0%)',
    bottom: 'inset(100% 0% 0% 0%)',
}

/**
 * Block wipes. A flat cobalt field is uncovered edge to edge by a clip-path as its panel
 * enters. Driven by a parent's in-view state (Panel, Field), because an element clipped
 * to nothing is not a reliable intersection target on its own.
 */
export const wipe = (from: WipeFrom, delay = 0): Variants => ({
    hidden: { clipPath: CLOSED[from] },
    visible: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.15, ease: EASE_IN_OUT, delay } },
})

export const WIPE_FROM_LEFT = wipe('left')
export const WIPE_FROM_RIGHT = wipe('right')
export const WIPE_FROM_BOTTOM = wipe('bottom')
export const WIPE_FROM_TOP = wipe('top')

/** A display line rising out of its own mask, after the block behind it has landed. */
export const RISE_LINE: Variants = {
    hidden: { y: '108%' },
    visible: (delay: number = 0.35) => ({ y: '0%', transition: { duration: 0.95, ease: EASE_OUT, delay } }),
}

/** Supporting copy: a short fade-and-lift once the blocks are in place. */
export const FADE_UP: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: (delay: number = 0.5) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT, delay } }),
}
