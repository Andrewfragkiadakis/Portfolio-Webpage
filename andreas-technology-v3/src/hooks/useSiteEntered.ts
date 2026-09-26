'use client'

import { useEffect, useState } from 'react'
import { SITE_ENTERED_EVENT } from '@/utils/motion'

/**
 * True once the intro overlay is gone (or was never shown), so the hero can play its
 * reveal where the visitor can actually see it instead of underneath the overlay.
 */
export function useSiteEntered(): boolean {
    const [entered, setEntered] = useState(false)

    useEffect(() => {
        const root = document.documentElement
        // Returning visitors: the <head> script already marked the intro as seen.
        if (root.dataset.entered === 'true' || root.dataset.revealed === 'true') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setEntered(true)
            return
        }
        const onEnter = () => setEntered(true)
        window.addEventListener(SITE_ENTERED_EVENT, onEnter)
        return () => window.removeEventListener(SITE_ENTERED_EVENT, onEnter)
    }, [])

    return entered
}
