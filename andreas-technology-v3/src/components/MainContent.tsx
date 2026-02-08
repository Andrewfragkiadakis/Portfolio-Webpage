'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const HorizontalLayout = dynamic(() => import('@/components/HorizontalLayout'))

export default function MainContent() {
    useEffect(() => {
        window.scrollTo(0, 0)
        if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname)
        }
    }, [])

    return <HorizontalLayout />
}
