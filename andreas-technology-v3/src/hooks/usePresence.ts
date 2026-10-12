'use client'

import { useEffect, useState } from 'react'

/**
 * Keeps an element mounted while it animates out. Render it while `mounted`, and set
 * `data-closing` while `closing`: CSS runs the exit (and @starting-style the entrance),
 * so no animation library is involved.
 */
export function usePresence(open: boolean, exitMs: number): { mounted: boolean; closing: boolean } {
    const [mounted, setMounted] = useState(open)

    // Opening mounts in the same render (React's "adjust state while rendering" pattern).
    if (open && !mounted) setMounted(true)

    useEffect(() => {
        if (open || !mounted) return
        const timer = window.setTimeout(() => setMounted(false), exitMs)
        return () => window.clearTimeout(timer)
    }, [open, mounted, exitMs])

    return { mounted, closing: mounted && !open }
}
