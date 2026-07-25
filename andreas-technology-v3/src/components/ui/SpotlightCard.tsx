'use client'

import React, { useRef } from 'react'

interface SpotlightCardProps extends React.PropsWithChildren {
    className?: string
    spotlightColor?: string
    onClick?: () => void
    /** Accessible name for the control. Required when `onClick` is set. */
    label?: string
}

export default function SpotlightCard({
    children,
    className = '',
    spotlightColor = 'rgba(165, 180, 252, 0.15)',
    onClick,
    label,
}: SpotlightCardProps) {
    const elementRef = useRef<HTMLElement>(null)

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const el = elementRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
        el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
        el.style.setProperty('--spotlight-color', spotlightColor)
    }

    // A clickable card is a real button, so it is reachable by keyboard and announced correctly.
    if (onClick) {
        return (
            <button
                ref={elementRef as React.RefObject<HTMLButtonElement | null>}
                type="button"
                onMouseMove={handleMouseMove}
                onClick={onClick}
                aria-label={label}
                className={`card-spotlight cursor-pointer text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] ${className}`}
            >
                {children}
            </button>
        )
    }

    return (
        <div
            ref={elementRef as React.RefObject<HTMLDivElement | null>}
            onMouseMove={handleMouseMove}
            className={`card-spotlight ${className}`}
        >
            {children}
        </div>
    )
}
