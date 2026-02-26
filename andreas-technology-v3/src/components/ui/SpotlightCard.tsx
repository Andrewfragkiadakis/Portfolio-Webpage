'use client'

import React, { useRef } from 'react'

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
    spotlightColor?: string
}

export default function SpotlightCard({
    children,
    className = '',
    spotlightColor = 'rgba(165, 180, 252, 0.15)',
    ...rest
}: SpotlightCardProps) {
    const divRef = useRef<HTMLDivElement>(null)

    const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
        if (!divRef.current) return
        const rect = divRef.current.getBoundingClientRect()
        divRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
        divRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
        divRef.current.style.setProperty('--spotlight-color', spotlightColor)
    }

    return (
        <div ref={divRef} onMouseMove={handleMouseMove} className={`card-spotlight ${className}`} {...rest}>
            {children}
        </div>
    )
}
