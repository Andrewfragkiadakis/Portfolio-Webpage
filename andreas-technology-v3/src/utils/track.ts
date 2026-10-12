import { SECTION_IDS, SECTION_STEPS, type SectionId } from '@/data/sections'
import { isDesktopViewport } from '@/hooks/useIsDesktop'

/**
 * Position maths for the journey, in one place.
 *
 * Desktop: the page scrolls through a runway one viewport tall per slide, and CSS scroll
 * snap rests it on the snap markers inside the runway (`[data-snap]`). Phones and tablets:
 * the sections are an ordinary vertical stack. Everything scrolls natively, so wheel, touch
 * and keyboard input always take over from a programmatic scroll immediately.
 */

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Desktop: the slide's snap marker. Stack: the section itself (scroll-margin clears the nav). */
function anchorOf(index: number): HTMLElement | null {
    return isDesktopViewport()
        ? document.querySelector<HTMLElement>(`[data-snap="${index}"]`)
        : document.getElementById(SECTION_IDS[index])
}

/** Resolves once scrolling has settled: on `scrollend` where supported, after a timeout otherwise. */
export function scrollSettled(timeoutMs = 1000): Promise<void> {
    return new Promise((resolve) => {
        let timer = 0
        const done = () => {
            window.clearTimeout(timer)
            window.removeEventListener('scrollend', done)
            resolve()
        }
        timer = window.setTimeout(done, timeoutMs)
        window.addEventListener('scrollend', done, { once: true })
    })
}

/** Scroll to a slide (desktop) or section (stack). Native, snap-aware and interruptible. */
export function scrollToSection(index: number, { instant = false }: { instant?: boolean } = {}): Promise<void> {
    const anchor = anchorOf(Math.max(0, Math.min(SECTION_STEPS, index)))
    if (!anchor) return Promise.resolve()
    const behavior: ScrollBehavior = instant || prefersReducedMotion() ? 'instant' : 'smooth'
    anchor.scrollIntoView({ behavior, block: 'start' })
    return behavior === 'instant' ? Promise.resolve() : scrollSettled()
}

/** Index of the slide (desktop) or section (stack) currently in view. */
export function currentSectionIndex(): number {
    if (isDesktopViewport()) {
        const runway = document.querySelector<HTMLElement>('[data-runway]')
        if (!runway) return 0
        const travel = runway.offsetHeight - window.innerHeight
        const progress = travel > 0 ? (window.scrollY - runway.offsetTop) / travel : 0
        return Math.max(0, Math.min(SECTION_STEPS, Math.round(progress * SECTION_STEPS)))
    }
    const line = window.innerHeight / 3
    let index = 0
    SECTION_IDS.forEach((id, i) => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) index = i
    })
    return index
}

export function stepSection(direction: 1 | -1): Promise<void> {
    return scrollToSection(currentSectionIndex() + direction)
}

/** Move keyboard and screen-reader focus to a section's heading after navigating to it. */
export function focusSection(id: SectionId): void {
    const heading = document.getElementById(`${id}-title`)
    if (!heading) return
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
    heading.focus({ preventScroll: true })
}
