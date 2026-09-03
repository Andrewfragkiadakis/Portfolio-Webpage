'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useIsDesktop } from '@/hooks/useIsDesktop'
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation'
import { useHaptics } from '@/hooks/useHaptics'

const HorizontalLayout = dynamic(() => import('@/components/HorizontalLayout'))

export default function MainContent() {
    const isDesktop = useIsDesktop()
    const haptics = useHaptics()

    useEffect(() => {
        window.scrollTo(0, 0)
        if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname)
        }
    }, [])

    // Mobile only: the desktop track already maps horizontal travel to vertical scroll,
    // so a sideways swipe there would fight the thing it is supposed to be driving.
    useSwipeNavigation(isDesktop === false, haptics.impact)

    return <HorizontalLayout />
}
