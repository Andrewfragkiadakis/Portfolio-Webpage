import { SECTION_STEPS } from '@/data/sections'
import { DESKTOP_BREAKPOINT_PX } from '@/hooks/useIsDesktop'

const SECTION_SCROLL_DURATION_MS = 1200
const FIXED_NAV_OFFSET_PX = 64

function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3)
}

function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function smoothScrollTo(targetY: number, durationMs: number = SECTION_SCROLL_DURATION_MS): void {
    if (typeof window === 'undefined') return

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const clampedTarget = Math.max(0, Math.min(targetY, maxScroll))

    if (prefersReducedMotion()) {
        window.scrollTo({ top: clampedTarget })
        return
    }

    const startY = window.scrollY
    const start = performance.now()

    function step(now: number): void {
        const elapsed = now - start
        const t = Math.min(elapsed / durationMs, 1)
        window.scrollTo({ top: startY + (clampedTarget - startY) * easeOutCubic(t), left: 0 })
        if (t < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
}

export function smoothScrollToElement(
    element: HTMLElement,
    durationMs: number = SECTION_SCROLL_DURATION_MS,
    offsetTop: number = FIXED_NAV_OFFSET_PX
): void {
    if (typeof window === 'undefined') return
    const targetY = element.getBoundingClientRect().top + window.scrollY - offsetTop
    smoothScrollTo(targetY, durationMs)
}

/**
 * Navigate to a section.
 *
 * On desktop the sections live on a horizontal track, so the only way to reach one is to
 * scroll the page to the matching fraction of the track. On mobile they are ordinary
 * stacked elements, so we scroll to the element itself.
 */
export function scrollToSection(
    sectionIndex: number,
    sectionId: string,
    durationMs: number = SECTION_SCROLL_DURATION_MS
): void {
    if (typeof window === 'undefined') return

    if (window.innerWidth >= DESKTOP_BREAKPOINT_PX) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        smoothScrollTo((sectionIndex / SECTION_STEPS) * maxScroll, durationMs)
        return
    }

    const element = document.getElementById(sectionId)
    if (element) smoothScrollToElement(element, durationMs)
}
