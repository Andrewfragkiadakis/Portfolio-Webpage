'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

const TIME_ZONE = 'Europe/Athens'

/** Seconds since midnight in Athens. */
function athensSeconds(date: Date): number {
    const parts = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', timeZone: TIME_ZONE,
    }).formatToParts(date)
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0)
    return get('hour') * 3600 + get('minute') * 60 + get('second')
}

const TICKS = Array.from({ length: 60 }, (_, i) => i)

const hand = (deg: number): CSSProperties => ({
    transform: `rotate(${deg}deg)`,
    transformOrigin: '50px 50px',
    transformBox: 'view-box',
})

/**
 * Athens wall clock, Apple-style: hairline minute ticks, bold hour ticks and an orange
 * second hand that ticks with a small overshoot. It only ticks while on screen; with
 * reduced motion the second hand is hidden and the face updates once a minute.
 * Decorative — the digital time beside it carries the information.
 */
export default function AnalogClock({ className = '' }: { className?: string }) {
    const ref = useRef<SVGSVGElement>(null)
    const inView = useInView(ref, { amount: 0.2 })
    const reduceMotion = useReducedMotion()
    const [seconds, setSeconds] = useState<number | null>(null)

    useEffect(() => {
        if (!inView) return
        const tick = () => setSeconds(athensSeconds(new Date()))
        tick()
        const id = setInterval(tick, reduceMotion ? 15_000 : 1000)
        return () => clearInterval(id)
    }, [inView, reduceMotion])

    const s = seconds ?? 0
    const secDeg = (s % 60) * 6
    const minDeg = (s / 10) % 360
    const hourDeg = (s / 120) % 360

    return (
        <svg ref={ref} viewBox="0 0 100 100" className={className} aria-hidden="true">
            <circle cx="50" cy="50" r="49" fill="var(--clock-face)" stroke="var(--clock-rim)" strokeWidth="1" />
            {TICKS.map((i) => {
                const major = i % 5 === 0
                return (
                    <line
                        key={i}
                        x1="50" y1={major ? 5.5 : 5} x2="50" y2={major ? 12 : 8}
                        stroke={major ? 'var(--clock-ink)' : 'var(--clock-tick)'}
                        strokeWidth={major ? 1.8 : 0.7}
                        strokeLinecap="round"
                        transform={`rotate(${i * 6} 50 50)`}
                    />
                )
            })}
            {seconds !== null && (
                <>
                    <g style={{ ...hand(hourDeg), transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}>
                        <line x1="50" y1="50" x2="50" y2="28" stroke="var(--clock-ink)" strokeWidth="3.6" strokeLinecap="round" />
                    </g>
                    <g style={{ ...hand(minDeg), transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}>
                        <line x1="50" y1="50" x2="50" y2="14" stroke="var(--clock-ink)" strokeWidth="2.6" strokeLinecap="round" />
                    </g>
                    {!reduceMotion && (
                        <g style={{ ...hand(secDeg), transition: secDeg === 0 ? 'none' : 'transform 0.28s cubic-bezier(0.4, 2.2, 0.4, 1)' }}>
                            <line x1="50" y1="60" x2="50" y2="10" stroke="#ff9f0a" strokeWidth="1.1" strokeLinecap="round" />
                        </g>
                    )}
                </>
            )}
            <circle cx="50" cy="50" r="2.6" fill="#ff9f0a" />
            <circle cx="50" cy="50" r="1.1" fill="var(--clock-face)" />
        </svg>
    )
}
