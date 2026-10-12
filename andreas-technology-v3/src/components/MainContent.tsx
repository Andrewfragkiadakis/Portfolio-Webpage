'use client'

import { useEffect } from 'react'
import HorizontalLayout from '@/components/HorizontalLayout'

export default function MainContent() {
    useEffect(() => {
        window.scrollTo(0, 0)
        if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname)
        }
    }, [])

    return <HorizontalLayout />
}
