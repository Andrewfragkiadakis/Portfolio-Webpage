import { useRef, useEffect } from 'react'

export function useCardScroll(cardSelector: string) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 0
        }
    }, [])

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current
        if (!container) return

        const maxScroll = container.scrollWidth - container.clientWidth
        if (direction === 'left' && container.scrollLeft <= 1) return
        if (direction === 'right' && container.scrollLeft >= maxScroll - 1) return

        const cards = Array.from(container.querySelectorAll(cardSelector)) as HTMLElement[]
        if (cards.length === 0) return

        const insetLeft = cards[0].offsetLeft

        let currentIndex = 0
        let minDelta = Infinity

        cards.forEach((card, index) => {
            const cardStart = card.offsetLeft - insetLeft
            const delta = Math.abs(container.scrollLeft - cardStart)
            if (delta < minDelta) {
                minDelta = delta
                currentIndex = index
            }
        })

        let targetIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1
        targetIndex = Math.max(0, Math.min(targetIndex, cards.length - 1))
        if (targetIndex === currentIndex) return

        const targetCard = cards[targetIndex]
        if (targetCard) {
            const targetScroll = targetCard.offsetLeft - insetLeft
            container.scrollTo({
                left: Math.max(0, Math.min(Math.round(targetScroll), maxScroll)),
                behavior: 'smooth',
            })
        }
    }

    return { scrollContainerRef, scroll }
}
