'use client'

import { useEffect } from 'react'
import HorizontalLayout from '@/components/HorizontalLayout'
import { SECTION_IDS } from '@/data/sections'
import { scrollToSection } from '@/utils/track'

export default function MainContent() {
    // Deep links: /#projects opens on that slide or section, and a reload stays where the
    // address bar says (the nav keeps the hash in sync). Anything else starts at the top.
    useEffect(() => {
        const indexOfHash = () => (SECTION_IDS as readonly string[]).indexOf(location.hash.slice(1))
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
        const index = indexOfHash()
        if (index > 0) requestAnimationFrame(() => { void scrollToSection(index, { instant: true }) })
        else if (!location.hash) window.scrollTo(0, 0)

        // In-page links and edits to the hash: the browser cannot scroll to a slide on the
        // horizontal track by itself.
        const onHashChange = () => {
            const next = indexOfHash()
            if (next >= 0) void scrollToSection(next)
        }
        window.addEventListener('hashchange', onHashChange)
        // The page is hydrated and has taken its starting position (used by the e2e tests).
        document.documentElement.setAttribute('data-ready', '')
        return () => window.removeEventListener('hashchange', onHashChange)
    }, [])

    return <HorizontalLayout />
}
