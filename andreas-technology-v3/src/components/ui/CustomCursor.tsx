'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const SIZE = 40
const IDLE_SCALE = 16 / SIZE

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    // Only devices with a real pointer get a custom cursor; a width query would
    // wrongly enable it on large touch tablets.
    const [hasFinePointer, setHasFinePointer] = useState(false)

    // Motion values keep pointer tracking off the React render path entirely.
    const rawX = useMotionValue(0)
    const rawY = useMotionValue(0)
    const springConfig = { stiffness: 150, damping: 15, mass: 0.1 }
    const x = useSpring(rawX, springConfig)
    const y = useSpring(rawY, springConfig)

    useEffect(() => {
        const mq = window.matchMedia('(pointer: fine)')
        const sync = () => setHasFinePointer(mq.matches)
        sync()
        mq.addEventListener('change', sync)
        return () => mq.removeEventListener('change', sync)
    }, [])

    useEffect(() => {
        if (!hasFinePointer) return

        const scale = isHovering ? 1 : IDLE_SCALE
        const offset = (SIZE * scale) / 2

        const updatePosition = (e: MouseEvent) => {
            rawX.set(e.clientX - offset)
            rawY.set(e.clientY - offset)
            setIsVisible(true)
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null
            if (!target?.closest) return
            setIsHovering(Boolean(target.closest('button, a, [role="button"], input, textarea, select')))
        }

        const handleLeave = () => setIsVisible(false)

        window.addEventListener('mousemove', updatePosition, { passive: true })
        window.addEventListener('mouseover', handleMouseOver, { passive: true })
        document.addEventListener('mouseleave', handleLeave)

        return () => {
            window.removeEventListener('mousemove', updatePosition)
            window.removeEventListener('mouseover', handleMouseOver)
            document.removeEventListener('mouseleave', handleLeave)
        }
    }, [hasFinePointer, isHovering, rawX, rawY])

    if (!hasFinePointer || !isVisible) return null

    return (
        <motion.div
            aria-hidden="true"
            className="fixed top-0 left-0 pointer-events-none z-[100000] origin-center"
            style={{ width: SIZE, height: SIZE, x, y }}
            animate={{ scale: isHovering ? 1 : IDLE_SCALE }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
        >
            <div className={`w-full h-full bg-[var(--accent)] transition-all duration-300 ${isHovering ? 'rounded-full opacity-50' : 'rounded-none opacity-100'}`} />

            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[1px] bg-[var(--accent)]"
                animate={{ rotate: isHovering ? 45 : 0, opacity: isHovering ? 0 : 1 }}
            />
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[200%] w-[1px] bg-[var(--accent)]"
                animate={{ rotate: isHovering ? 45 : 0, opacity: isHovering ? 0 : 1 }}
            />
        </motion.div>
    )
}
