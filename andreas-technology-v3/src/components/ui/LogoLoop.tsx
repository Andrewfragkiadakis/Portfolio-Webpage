'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type LogoItem = { node: React.ReactNode; title?: string } | { src: string; alt?: string; title?: string }

interface LogoLoopProps {
    logos: LogoItem[]
    speed?: number
    direction?: 'left' | 'right'
    /** CSS length, e.g. "1.75rem". Relative units keep the marquee in step with the type scale. */
    logoHeight?: string
    /** CSS length between items, e.g. "2rem". */
    gap?: string
    pauseOnHover?: boolean
    fadeOut?: boolean
    fadeOutColor?: string
    scaleOnHover?: boolean
    className?: string
}

const MIN_COPIES = 2
const COPY_HEADROOM = 2

export default function LogoLoop({
    logos,
    speed = 120,
    direction = 'left',
    logoHeight = '1.75rem',
    gap = '2rem',
    pauseOnHover = false,
    fadeOut = true,
    fadeOutColor,
    scaleOnHover = false,
    className = '',
}: LogoLoopProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const seqRef = useRef<HTMLDivElement>(null)
    const [seqWidth, setSeqWidth] = useState(0)
    const [copyCount, setCopyCount] = useState(MIN_COPIES)
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

    // Marquee geometry depends on measured DOM widths, which only exist after layout.
    /* eslint-disable react-hooks/set-state-in-effect */
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
    /* eslint-enable react-hooks/set-state-in-effect */

    // Round 5: the marquee is a CSS animation on the compositor, not a rAF loop writing
    // a transform from JavaScript every frame (which also repainted the masked pills on
    // phones). It pauses under the pointer and whenever it is off screen.
    const [onScreen, setOnScreen] = useState(false)
    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0 })
        observer.observe(container)
        return () => observer.disconnect()
    }, [])

    const rootClassName = ['logoloop', fadeOut && 'logoloop--fade', scaleOnHover && 'logoloop--scale-hover', pauseOnHover && 'logoloop--pause-hover', className].filter(Boolean).join(' ')
    const speedAbs = Math.abs(targetVelocity) || 1
    const trackStyle = seqWidth > 0
        ? ({
            '--loop-distance': `-${seqWidth}px`,
            '--loop-duration': `${seqWidth / speedAbs}s`,
            animationDirection: targetVelocity < 0 ? 'reverse' : 'normal',
            animationPlayState: onScreen ? 'running' : 'paused',
        } as React.CSSProperties)
        : undefined

    return (
        <div
            ref={containerRef}
            className={rootClassName}
            style={{ '--logoloop-gap': gap, '--logoloop-logoHeight': logoHeight, ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor }) } as React.CSSProperties}
            role="marquee"
            aria-label="Tech stack"
        >
            <div className={`logoloop__track ${seqWidth > 0 ? 'is-running' : ''}`} style={trackStyle}>
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
