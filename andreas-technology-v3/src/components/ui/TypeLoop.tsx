'use client'

import { useEffect, useRef } from 'react'

interface TypeLoopProps {
    strings: string[]
    /** ms per typed character. */
    delay?: number
    /** ms per deleted character. */
    deleteSpeed?: number
    /** ms a finished string stays on screen before it is deleted. */
    hold?: number
    className?: string
}

/**
 * Types each string, holds it, deletes it and moves on, forever: the Terminal's
 * `whoami` line. It replaces the `typewriter-effect` package (≈14 KB gzip on the
 * first load). Text is written straight to a text node on a timer, so typing never
 * re-renders React, and nothing runs while the component is unmounted.
 */
export default function TypeLoop({ strings, delay = 45, deleteSpeed = 25, hold = 1500, className = '' }: TypeLoopProps) {
    const textRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const el = textRef.current
        if (!el || strings.length === 0) return
        let i = 0
        let n = 0
        let deleting = false
        let timer: ReturnType<typeof setTimeout>

        const step = () => {
            const s = strings[i % strings.length]
            if (!deleting) {
                n += 1
                el.textContent = s.slice(0, n)
                if (n >= s.length) {
                    deleting = true
                    timer = setTimeout(step, hold)
                    return
                }
                timer = setTimeout(step, delay)
            } else {
                n -= 1
                el.textContent = s.slice(0, n)
                if (n <= 0) {
                    deleting = false
                    i += 1
                }
                timer = setTimeout(step, deleteSpeed)
            }
        }
        timer = setTimeout(step, delay)
        return () => clearTimeout(timer)
    }, [strings, delay, deleteSpeed, hold])

    return (
        <span className={className}>
            <span ref={textRef} />
            <span className="term-cursor">▍</span>
        </span>
    )
}
