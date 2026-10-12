import { useEffect, useState } from 'react'

/**
 * When the page runs as the horizontal journey: a large enough window with a mouse or
 * trackpad. Tablets and touch screens stay on the vertical layout — scroll-jacking a touch
 * device through a horizontal track is worse than scrolling down — and so do short windows,
 * where a slide would not fit.
 *
 * Must stay in sync with the `md` custom variant in globals.css. It is a media query
 * string rather than a pixel number: rem in media queries follows the browser's font-size
 * setting, so JS and CSS agree even when a reader has enlarged their default text.
 */
export const DESKTOP_MEDIA_QUERY = '(min-width: 72rem) and (min-height: 45rem) and (hover: hover) and (pointer: fine)'

/** Non-reactive check for event handlers; use `useIsDesktop` in components. */
export function isDesktopViewport(): boolean {
    return typeof window !== 'undefined' && window.matchMedia(DESKTOP_MEDIA_QUERY).matches
}

/**
 * Tracks whether the viewport is in desktop (horizontal journey) mode.
 *
 * Returns `null` until mounted so callers can avoid committing to a layout during SSR,
 * where the viewport width is unknowable. Render nothing (or a neutral placeholder)
 * while null rather than guessing, otherwise both layouts end up in the DOM.
 */
export function useIsDesktop(): boolean | null {
    const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

    useEffect(() => {
        const mq = window.matchMedia(DESKTOP_MEDIA_QUERY)
        const sync = () => setIsDesktop(mq.matches)
        sync()
        mq.addEventListener('change', sync)
        return () => mq.removeEventListener('change', sync)
    }, [])

    return isDesktop
}
