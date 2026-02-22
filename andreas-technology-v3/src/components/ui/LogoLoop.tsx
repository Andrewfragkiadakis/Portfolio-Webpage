'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type LogoItem = { node: React.ReactNode; title?: string } | { src: string; alt?: string; title?: string }

interface LogoLoopProps {
    logos: LogoItem[]
    speed?: number
    direction?: 'left' | 'right'
    logoHeight?: number
    gap?: number
    pauseOnHover?: boolean
    fadeOut?: boolean
    fadeOutColor?: string
    scaleOnHover?: boolean
    className?: string
}

const SMOOTH_TAU = 0.25
const MIN_COPIES = 2
const COPY_HEADROOM = 2

export default function LogoLoop({
    logos,
    speed = 120,
    direction = 'left',
    logoHeight = 28,
    gap = 32,
    pauseOnHover = false,
    fadeOut = true,
    fadeOutColor,
    scaleOnHover = false,
    className = '',
}: LogoLoopProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const seqRef = useRef<HTMLDivElement>(null)
    const [seqWidth, setSeqWidth] = useState(0)
    const [copyCount, setCopyCount] = useState(MIN_COPIES)
    const [isHovered, setIsHovered] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const targetVelocity = useMemo(() => {
        const magnitude = Math.abs(speed)
        const dir = direction === 'left' ? 1 : -1
        const sign = speed < 0 ? -1 : 1
        return magnitude * dir * sign
    }, [speed, direction])

    const updateDimensions = useCallback(() => {
        const containerWidth = containerRef.current?.clientWidth ?? 0
        const sequenceWidth = seqRef.current?.getBoundingClientRect().width ?? 0
        if (sequenceWidth > 0) {
            setSeqWidth(Math.ceil(sequenceWidth))
            const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + COPY_HEADROOM
            setCopyCount(Math.max(MIN_COPIES, copiesNeeded))
        }
    }, [])

    useEffect(() => {
        if (!window.ResizeObserver) {
            window.addEventListener('resize', updateDimensions)
            updateDimensions()
            return () => window.removeEventListener('resize', updateDimensions)
        }
        const observers: ResizeObserver[] = []
        ;[containerRef, seqRef].forEach(ref => {
            if (ref.current) {
                const obs = new ResizeObserver(updateDimensions)
                obs.observe(ref.current)
                observers.push(obs)
            }
        })
        updateDimensions()
        return () => observers.forEach(o => o.disconnect())
    }, [updateDimensions, logos, gap, logoHeight])

    useEffect(() => {
        const images = seqRef.current?.querySelectorAll('img') ?? []
        if (images.length === 0) { updateDimensions(); return }
        let remaining = images.length
        const onLoad = () => { remaining -= 1; if (remaining === 0) updateDimensions() }
        images.forEach(img => {
            if ((img as HTMLImageElement).complete) onLoad()
            else {
                img.addEventListener('load', onLoad, { once: true })
                img.addEventListener('error', onLoad, { once: true })
            }
        })
        return () => images.forEach(img => { img.removeEventListener('load', onLoad); img.removeEventListener('error', onLoad) })
    }, [updateDimensions, logos, gap, logoHeight])

    useEffect(() => {
        const track = trackRef.current
        if (!track || seqWidth <= 0) return
        let rafId: number | null = null
        let lastTs: number | null = null
        let offset = 0
        let velocity = 0

        const animate = (ts: number) => {
            if (lastTs === null) lastTs = ts
            const dt = Math.max(0, ts - lastTs) / 1000
            lastTs = ts
            const target = isHovered && pauseOnHover ? 0 : targetVelocity
            velocity += (target - velocity) * (1 - Math.exp(-dt / SMOOTH_TAU))
            offset = ((offset + velocity * dt) % seqWidth + seqWidth) % seqWidth
            track.style.transform = `translate3d(${-offset}px, 0, 0)`
            rafId = requestAnimationFrame(animate)
        }
        rafId = requestAnimationFrame(animate)
        return () => { if (rafId !== null) cancelAnimationFrame(rafId) }
    }, [targetVelocity, seqWidth, isHovered, pauseOnHover])

    const rootClassName = ['logoloop', fadeOut && 'logoloop--fade', scaleOnHover && 'logoloop--scale-hover', className].filter(Boolean).join(' ')

    return (
        <div
            ref={containerRef}
            className={rootClassName}
            style={{ '--logoloop-gap': `${gap}px`, '--logoloop-logoHeight': `${logoHeight}px`, ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor }) } as React.CSSProperties}
            role="marquee"
            aria-label="Tech stack"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div ref={trackRef} className="logoloop__track">
                {Array.from({ length: copyCount }, (_, ci) => (
                    <div key={ci} className="logoloop__list" aria-hidden={ci > 0} ref={ci === 0 ? seqRef : undefined}>
                        {logos.map((item, ii) => (
                            <div
                                key={`${ci}-${ii}`}
                                className="logoloop__item"
                                onMouseEnter={() => scaleOnHover && setHoveredIndex(ii)}
                                onMouseLeave={() => scaleOnHover && setHoveredIndex(null)}
                                style={(scaleOnHover && hoveredIndex === ii) ? {
                                    transform: 'scale(1.15)',
                                    transformOrigin: 'center center',
                                } : undefined}
                            >
                                {'node' in item ? (
                                    <span className="logoloop__node">{item.node}</span>
                                ) : (
                                    <img src={item.src} alt={item.alt ?? item.title ?? ''} />
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
