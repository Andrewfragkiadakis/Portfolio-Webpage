'use client'

import { ReactLenis } from '@studio-freight/react-lenis'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ scrollBehavior: 'smooth' }}>
            {children}
        </div>
    )
}
