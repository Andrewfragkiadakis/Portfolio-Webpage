/**
 * Shared motion tokens so every reveal, hover and transition speaks the same language.
 * Enter with a long ease-out; leave faster with ease-in-out.
 */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const

/** Fired by the intro overlay the moment the visitor enters the site. */
export const SITE_ENTERED_EVENT = 'site:entered'
