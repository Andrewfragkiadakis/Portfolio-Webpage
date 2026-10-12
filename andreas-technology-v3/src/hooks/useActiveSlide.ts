'use client'

import { useSyncExternalStore } from 'react'
import { currentSectionIndex } from '@/utils/track'

/*
 * The slide (desktop) or section (stack) in view, shared by every consumer through one
 * rAF-throttled scroll listener. Consumers re-render only when the index changes.
 */
let active = 0
let frame = 0
const listeners = new Set<() => void>()

function measure() {
    frame = 0
    const next = currentSectionIndex()
    if (next === active) return
    active = next
    listeners.forEach((listener) => listener())
}

function schedule() {
    if (!frame) frame = requestAnimationFrame(measure)
}

function subscribe(listener: () => void) {
    if (listeners.size === 0) {
        window.addEventListener('scroll', schedule, { passive: true })
        window.addEventListener('resize', schedule)
        measure()
    }
    listeners.add(listener)
    return () => {
        listeners.delete(listener)
        if (listeners.size > 0) return
        window.removeEventListener('scroll', schedule)
        window.removeEventListener('resize', schedule)
        cancelAnimationFrame(frame)
        frame = 0
    }
}

export function useActiveSlide(): number {
    return useSyncExternalStore(subscribe, () => active, () => 0)
}
