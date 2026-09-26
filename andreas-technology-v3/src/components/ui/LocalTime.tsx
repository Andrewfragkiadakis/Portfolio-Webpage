'use client'

import { useEffect, useState } from 'react'

const TIME_ZONE = 'Europe/Athens'

function format(date: Date): { time: string; offset: string } {
    const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: TIME_ZONE }).format(date)
    const offset = new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, timeZoneName: 'shortOffset' })
        .formatToParts(date)
        .find((part) => part.type === 'timeZoneName')?.value.replace('GMT', 'UTC') ?? ''
    return { time, offset }
}

/** Live Athens clock. Renders nothing until mounted so server and client never disagree. */
export default function LocalTime({ className = '' }: { className?: string }) {
    const [now, setNow] = useState<Date | null>(null)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNow(new Date())
        // Tick on the minute boundary, then every minute.
        let interval: ReturnType<typeof setInterval>
        const timeout = setTimeout(() => {
            setNow(new Date())
            interval = setInterval(() => setNow(new Date()), 60_000)
        }, 60_000 - (Date.now() % 60_000))
        return () => {
            clearTimeout(timeout)
            clearInterval(interval)
        }
    }, [])

    if (!now) return <span className={className} aria-hidden="true">--:--</span>

    const { time, offset } = format(now)
    return (
        <time className={className} dateTime={now.toISOString()}>
            {time} <span className="font-normal">{offset}</span>
        </time>
    )
}
