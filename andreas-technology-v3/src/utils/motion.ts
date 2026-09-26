/**
 * Shared motion tokens so every reveal, hover and transition speaks the same language.
 * Enter with a long ease-out; leave faster with ease-in-out.
 */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const

/** Window open: a quick, barely-bouncing spring that settles in about 350ms. */
export const WINDOW_SPRING = { type: 'spring', visualDuration: 0.35, bounce: 0.14 } as const

/** Menus and popovers: a 120ms fade with a 4px slide. */
export const MENU_TRANSITION = { duration: 0.12, ease: [0.2, 0, 0, 1] } as const

/** Fired by the intro overlay the moment the visitor enters the site. */
export const SITE_ENTERED_EVENT = 'site:entered'
