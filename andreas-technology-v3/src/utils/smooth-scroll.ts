const SECTION_SCROLL_DURATION_MS = 1200

function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3)
}

export function smoothScrollTo(targetY: number, durationMs: number = SECTION_SCROLL_DURATION_MS): void {
    if (typeof window === 'undefined') return
    const startY = window.scrollY
    const start = performance.now()

    function step(now: number): void {
        const elapsed = now - start
        const t = Math.min(elapsed / durationMs, 1)
        const eased = easeOutCubic(t)
        window.scrollTo({ top: startY + (targetY - startY) * eased, left: 0 })
        if (t < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
}

const FIXED_NAV_OFFSET_PX = 64

export function smoothScrollToElement(element: HTMLElement, durationMs: number = SECTION_SCROLL_DURATION_MS, offsetTop: number = FIXED_NAV_OFFSET_PX): void {
    if (typeof window === 'undefined') return
    const targetY = element.getBoundingClientRect().top + window.scrollY - offsetTop
    smoothScrollTo(targetY, durationMs)
}

export function scrollToSection(sectionIndex: number, sectionId: string, durationMs: number = SECTION_SCROLL_DURATION_MS): void {
    if (typeof window === 'undefined') return
    if (window.innerWidth >= 768) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const targetY = (sectionIndex / 5) * maxScroll
        smoothScrollTo(targetY, durationMs)
    } else {
        const element = document.getElementById(sectionId)
        if (element) smoothScrollToElement(element, durationMs)
    }
}
