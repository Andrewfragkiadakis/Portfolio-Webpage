'use client'

import { useEffect, useRef } from 'react'
import { SECTION_IDS } from '@/data/sections'
import { smoothScrollToElement } from '@/utils/smooth-scroll'

/** A swipe must be this much more horizontal than vertical before we treat it as a pager gesture. */
const HORIZONTAL_BIAS = 1.5
/** Distance alone is enough to commit, for slow deliberate drags. */
const DISTANCE_THRESHOLD_PX = 60
/** Velocity alone is enough to commit, for quick flicks that never travel far. */
const VELOCITY_THRESHOLD_PX_PER_MS = 0.45
/** Ignore anything that took longer than this — that is a drag, not a swipe. */
const MAX_DURATION_MS = 600

/** Elements a swipe may legitimately belong to instead of the page. */
const INTERACTIVE_ANCESTORS = '[data-swipe-ignore], [role="dialog"], input, textarea, select'

function reducedMotion(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * True when the gesture started inside something that scrolls sideways on its own —
 * the project rail, most obviously. Stealing those swipes would break the component the
 * user is actually touching.
 */
function startedInsideHorizontalScroller(target: EventTarget | null): boolean {
    let node = target instanceof Element ? target : null

    while (node && node !== document.body) {
        if (node.matches(INTERACTIVE_ANCESTORS)) return true
        if (node.scrollWidth > node.clientWidth + 1) {
            const overflowX = getComputedStyle(node).overflowX
            if (overflowX === 'auto' || overflowX === 'scroll') return true
        }
        node = node.parentElement
    }

    return false
}

/**
 * Swipe left/right to move between sections on the mobile vertical stack.
 *
 * This is strictly additive. Vertical touchmove is never intercepted and `preventDefault`
 * is never called, so ordinary scrolling — including momentum and overscroll — behaves
 * exactly as it did before. The gesture only ever *adds* a way to jump a section.
 */
export function useSwipeNavigation(enabled: boolean, onCommit?: () => void) {
    const start = useRef<{ x: number; y: number; t: number } | null>(null)
    // Held in a ref so the listeners never need re-subscribing when the callback identity
    // changes. Written in an effect rather than during render — a ref mutation during
    // render is not safe under concurrent rendering.
    const commitRef = useRef(onCommit)

    useEffect(() => {
        commitRef.current = onCommit
    }, [onCommit])

    useEffect(() => {
        if (!enabled || typeof window === 'undefined' || reducedMotion()) return

        const handleTouchStart = (event: TouchEvent) => {
            if (event.touches.length !== 1) {
                start.current = null
                return
            }
            if (startedInsideHorizontalScroller(event.target)) {
                start.current = null
                return
            }
            const touch = event.touches[0]
            start.current = { x: touch.clientX, y: touch.clientY, t: performance.now() }
        }

        const handleTouchEnd = (event: TouchEvent) => {
            const origin = start.current
            start.current = null
            if (!origin) return

            const touch = event.changedTouches[0]
            if (!touch) return

            const dx = touch.clientX - origin.x
            const dy = touch.clientY - origin.y
            const dt = performance.now() - origin.t

            if (dt > MAX_DURATION_MS) return
            if (Math.abs(dx) < Math.abs(dy) * HORIZONTAL_BIAS) return

            const velocity = Math.abs(dx) / Math.max(dt, 1)
            if (Math.abs(dx) < DISTANCE_THRESHOLD_PX && velocity < VELOCITY_THRESHOLD_PX_PER_MS) return

            // Which section owns the middle of the viewport right now.
            const midpoint = window.scrollY + window.innerHeight / 2
            let current = 0
            for (let i = 0; i < SECTION_IDS.length; i += 1) {
                const element = document.getElementById(SECTION_IDS[i])
                if (!element) continue
                const top = element.getBoundingClientRect().top + window.scrollY
                if (midpoint >= top) current = i
            }

            // Swipe left travels forward, matching the desktop track's direction of travel.
            const next = dx < 0 ? current + 1 : current - 1
            if (next < 0 || next >= SECTION_IDS.length) return

            const target = document.getElementById(SECTION_IDS[next])
            if (!target) return

            smoothScrollToElement(target)
            commitRef.current?.()
        }

        const handleTouchCancel = () => { start.current = null }

        // Passive: we never call preventDefault, and saying so lets the browser keep
        // scrolling on the compositor instead of waiting to see if we will.
        window.addEventListener('touchstart', handleTouchStart, { passive: true })
        window.addEventListener('touchend', handleTouchEnd, { passive: true })
        window.addEventListener('touchcancel', handleTouchCancel, { passive: true })

        return () => {
            window.removeEventListener('touchstart', handleTouchStart)
            window.removeEventListener('touchend', handleTouchEnd)
            window.removeEventListener('touchcancel', handleTouchCancel)
        }
    }, [enabled])
}
