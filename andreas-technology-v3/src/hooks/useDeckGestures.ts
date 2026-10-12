'use client'

import { useEffect } from 'react'
import { DESKTOP_MEDIA_QUERY } from '@/hooks/useIsDesktop'
import { stepSection } from '@/utils/track'

/** Leave keys and swipes alone inside dialogs, form fields and the phone gallery. */
const blocked = (target: EventTarget | null) =>
    !!document.querySelector('[role="dialog"][aria-modal="true"]') ||
    (target instanceof Element && !!target.closest('input, textarea, select, [contenteditable="true"], .kn-gallery'))

/**
 * On the desktop track, ← and → move one slide, and so does a sideways two-finger swipe
 * (one slide per gesture, momentum included). Vertical wheel, PageUp/PageDown, Space,
 * Home and End are native scrolling, which CSS scroll snap rests on a slide.
 */
export function useDeckGestures(): void {
    useEffect(() => {
        const desktop = window.matchMedia(DESKTOP_MEDIA_QUERY)

        const onKey = (e: KeyboardEvent) => {
            if (!desktop.matches || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || blocked(e.target)) return
            if (e.key === 'ArrowRight') {
                e.preventDefault()
                void stepSection(1)
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault()
                void stepSection(-1)
            }
        }

        let accumulated = 0
        let locked = false
        let idle = 0
        const onWheel = (e: WheelEvent) => {
            if (!desktop.matches || Math.abs(e.deltaX) <= Math.abs(e.deltaY) || blocked(e.target)) return
            window.clearTimeout(idle)
            idle = window.setTimeout(() => {
                accumulated = 0
                locked = false
            }, 180)
            if (locked) return
            // Firefox reports wheel deltas in lines (or pages) rather than pixels.
            accumulated += e.deltaX * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerWidth : 1)
            if (Math.abs(accumulated) >= 40) {
                locked = true
                void stepSection(accumulated > 0 ? 1 : -1)
            }
        }

        window.addEventListener('keydown', onKey)
        window.addEventListener('wheel', onWheel, { passive: true })
        return () => {
            window.removeEventListener('keydown', onKey)
            window.removeEventListener('wheel', onWheel)
            window.clearTimeout(idle)
        }
    }, [])
}
