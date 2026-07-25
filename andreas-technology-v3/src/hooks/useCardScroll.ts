import { useRef, useEffect, useState, useCallback } from 'react'

/** Ignore sub-pixel rounding when deciding whether we are at an edge. */
const EDGE_EPSILON_PX = 2

/**
 * Card-by-card horizontal scrolling for a snap container.
 *
 * Also reports whether either end has been reached so the arrows can be disabled
 * rather than silently doing nothing.
 */
export function useCardScroll(cardSelector: string) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const syncEdges = useCallback(() => {
        const container = scrollContainerRef.current
        if (!container) return
        const maxScroll = container.scrollWidth - container.clientWidth
        setCanScrollLeft(container.scrollLeft > EDGE_EPSILON_PX)
        setCanScrollRight(maxScroll > EDGE_EPSILON_PX && container.scrollLeft < maxScroll - EDGE_EPSILON_PX)
    }, [])

    useEffect(() => {
        const container = scrollContainerRef.current
        if (!container) return

        container.scrollLeft = 0
        syncEdges()

        container.addEventListener('scroll', syncEdges, { passive: true })
        const observer = new ResizeObserver(syncEdges)
        observer.observe(container)

        return () => {
            container.removeEventListener('scroll', syncEdges)
            observer.disconnect()
        }
    }, [syncEdges])

    const scroll = useCallback((direction: 'left' | 'right') => {
        const container = scrollContainerRef.current
        if (!container) return

        const maxScroll = container.scrollWidth - container.clientWidth
        if (direction === 'left' && container.scrollLeft <= EDGE_EPSILON_PX) return
        if (direction === 'right' && container.scrollLeft >= maxScroll - EDGE_EPSILON_PX) return

        const cards = Array.from(container.querySelectorAll(cardSelector)) as HTMLElement[]
        if (cards.length === 0) return

        const insetLeft = cards[0].offsetLeft

        let currentIndex = 0
        let minDelta = Infinity
        cards.forEach((card, index) => {
            const delta = Math.abs(container.scrollLeft - (card.offsetLeft - insetLeft))
            if (delta < minDelta) {
                minDelta = delta
                currentIndex = index
            }
        })

        const targetIndex = Math.max(
            0,
            Math.min(direction === 'right' ? currentIndex + 1 : currentIndex - 1, cards.length - 1)
        )
        if (targetIndex === currentIndex) return

        const targetCard = cards[targetIndex]
        if (!targetCard) return

        container.scrollTo({
            left: Math.max(0, Math.min(Math.round(targetCard.offsetLeft - insetLeft), maxScroll)),
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        })
    }, [cardSelector])

    return { scrollContainerRef, scroll, canScrollLeft, canScrollRight }
}
