'use client'

import React, { useState, useEffect, type ReactNode } from 'react'

export default function SmoothScroll({ children }: { children: ReactNode }) {
    const [LenisWrapper, setLenisWrapper] = useState<React.ComponentType<{ children: ReactNode }> | null>(null)

    useEffect(() => {
        const loadLenis = () => {
            import('@studio-freight/react-lenis').then((mod) => {
                setLenisWrapper(() => mod.ReactLenis as React.ComponentType<{ children: ReactNode }>)
            })
        }
        if (typeof window === 'undefined') return
        if (document.readyState === 'complete') {
            requestIdleCallback ? requestIdleCallback(loadLenis, { timeout: 500 }) : setTimeout(loadLenis, 0)
        } else {
            window.addEventListener('load', () => {
                requestIdleCallback ? requestIdleCallback(loadLenis, { timeout: 500 }) : setTimeout(loadLenis, 0)
            })
        }
    }, [])

    if (LenisWrapper) {
        return <LenisWrapper>{children}</LenisWrapper>
    }
    return <div style={{ scrollBehavior: 'smooth' }}>{children}</div>
}
