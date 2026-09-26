import { useEffect, useState } from 'react'
import { SECTION_IDS, SECTION_STEPS, type SectionId } from '@/data/sections'
import { isDesktopViewport } from '@/hooks/useIsDesktop'

/**
 * The section currently in front. On desktop it is derived from progress along the
 * horizontal track; on the vertical stack it is whichever section owns the middle of
 * the viewport.
 */
export function readActiveSection(fallback: SectionId = SECTION_IDS[0]): SectionId {
    if (isDesktopViewport()) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
        return SECTION_IDS[Math.min(SECTION_STEPS, Math.max(0, Math.round(progress * SECTION_STEPS)))]
    }
    const midpoint = window.innerHeight / 2
    for (const id of SECTION_IDS) {
        const rect = document.getElementById(id)?.getBoundingClientRect()
        if (rect && rect.top <= midpoint && rect.bottom > midpoint) return id
    }
    return fallback
}

export function useActiveSection(): SectionId {
    const [active, setActive] = useState<SectionId>(SECTION_IDS[0])

    useEffect(() => {
        let ticking = false

        const update = () => {
            ticking = false
            setActive((current) => readActiveSection(current))
        }

        const onScroll = () => {
            if (ticking) return
            ticking = true
            requestAnimationFrame(update)
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        update()
        return () => {
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
        }
    }, [])

    return active
}
