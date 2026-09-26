import type { Variants } from 'motion/react'

/**
 * Shared motion tokens so every reveal, hover and transition speaks the same language.
 * Enter with a long ease-out; leave faster with ease-in-out.
 */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const

/** Fired by the intro overlay the moment the visitor enters the site. */
export const SITE_ENTERED_EVENT = 'site:entered'

export type WipeFrom = 'left' | 'right' | 'top' | 'bottom'

const CLOSED: Record<WipeFrom, string> = {
    left: 'inset(0% 100% 0% 0%)',
    right: 'inset(0% 0% 0% 100%)',
    top: 'inset(0% 0% 100% 0%)',
    bottom: 'inset(100% 0% 0% 0%)',
}

/** A cobalt field uncovered edge to edge by a clip-path. */
export const wipe = (from: WipeFrom, delay = 0): Variants => ({
    hidden: { clipPath: CLOSED[from] },
    visible: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1, ease: EASE_IN_OUT, delay } },
})
