'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY })
            if (!isVisible) setIsVisible(true)
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
                setIsHovering(true)
            } else {
                setIsHovering(false)
            }
        }

        window.addEventListener('mousemove', updatePosition)
        window.addEventListener('mouseover', handleMouseOver)

        return () => {
            window.removeEventListener('mousemove', updatePosition)
            window.removeEventListener('mouseover', handleMouseOver)
        }
    }, [isVisible])

    if (!isVisible) return null

    const size = 40
    const scale = isHovering ? 1 : 16 / size
    const offset = (size * scale) / 2

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[100000] hidden md:block origin-center"
            style={{ width: size, height: size }}
            animate={{
                x: position.x - offset,
                y: position.y - offset,
                scale,
            }}
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 0.1
            }}
        >
            <div className={`w-full h-full bg-[var(--accent)] transition-all duration-300 ${isHovering ? 'rounded-full opacity-50' : 'rounded-none opacity-100'}`} />

            {/* Crosshair lines */}
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
