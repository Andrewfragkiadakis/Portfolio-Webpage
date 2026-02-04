'use client'

import { type ReactNode } from 'react'

export default function SmoothScroll({ children }: { children: ReactNode }) {
    return <div style={{ scrollBehavior: 'smooth' }}>{children}</div>
}
