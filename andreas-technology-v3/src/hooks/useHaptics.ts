'use client'

import { useCallback, useMemo } from 'react'

/**
 * Short vibration patterns, in milliseconds. Kept well under the threshold where a
 * buzz stops reading as "confirmation" and starts reading as "something is wrong".
 */
const PATTERN = {
    /** Passing over something — the lightest cue we have. */
    tick: 8,
    /** A choice was registered (nav tap, tile expand). */
    select: 12,
    /** A committed, consequential action (swipe navigation, theme flip). */
    impact: 18,
} as const

export type HapticIntensity = keyof typeof PATTERN

function canVibrate(): boolean {
    if (typeof navigator === 'undefined') return false
    if (typeof navigator.vibrate !== 'function') return false
    // Vibration is motion. Someone who asked for less of it did not mean "except in my hand".
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        return false
    }
    return true
}

/**
 * Real haptics via the Vibration API.
 *
 * iOS Safari does not implement `navigator.vibrate` at all, so on iPhone every call here
 * is a silent no-op — deliberately. Nothing in the UI may depend on a buzz having
 * happened; this is confirmation on top of a visual state change, never instead of one.
 */
export function useHaptics() {
    const fire = useCallback((intensity: HapticIntensity = 'select') => {
        if (!canVibrate()) return
        try {
            navigator.vibrate(PATTERN[intensity])
        } catch {
            // Some engines throw without prior user activation. A failed buzz is not an error.
        }
    }, [])

    return useMemo(
        () => ({
            tick: () => fire('tick'),
            select: () => fire('select'),
            impact: () => fire('impact'),
        }),
        [fire]
    )
}
