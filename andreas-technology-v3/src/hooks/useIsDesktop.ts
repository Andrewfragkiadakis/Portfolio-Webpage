import { useEffect, useState } from 'react'

/** Tailwind's `md` breakpoint — the point where the layout switches to the horizontal journey. */
export const DESKTOP_BREAKPOINT_PX = 768

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
        const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT_PX}px)`)
        const sync = () => setIsDesktop(mq.matches)
        sync()
        mq.addEventListener('change', sync)
        return () => mq.removeEventListener('change', sync)
    }, [])

    return isDesktop
}
