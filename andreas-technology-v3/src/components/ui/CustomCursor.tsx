'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react'
import { EASE_OUT } from '@/utils/motion'

const SIZE = 40
const IDLE_SCALE = 16 / SIZE
const INTERACTIVE = 'button, a, [role="button"], input, textarea, select'

type CursorMode = 'idle' | 'hover' | 'label'

/**
 * Crosshair that follows the pointer, opens into a ring over controls, and grows into
 * a labelled bubble over anything carrying `data-cursor="Label"` (project images,
 * credentials). Fine pointers only; listeners are attached once.
 */
export default function CustomCursor() {
    const [mode, setMode] = useState<CursorMode>('idle')
    const [label, setLabel] = useState('')
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

        const updatePosition = (e: MouseEvent) => {
            rawX.set(e.clientX)
            rawY.set(e.clientY)
            setIsVisible(true)
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null
            if (!target?.closest) return
            const labelled = target.closest<HTMLElement>('[data-cursor]')
            if (labelled?.dataset.cursor) {
                setLabel(labelled.dataset.cursor)
                setMode('label')
                return
            }
            setMode(target.closest(INTERACTIVE) ? 'hover' : 'idle')
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
    }, [hasFinePointer, rawX, rawY])

    if (!hasFinePointer || !isVisible) return null

    const scale = mode === 'label' ? 2.2 : mode === 'hover' ? 1 : IDLE_SCALE
    const isIdle = mode === 'idle'

    return (
        <motion.div
            aria-hidden="true"
            className="fixed top-0 left-0 pointer-events-none z-[100000]"
            style={{ x, y }}
        >
            <motion.div
                className="absolute -translate-x-1/2 -translate-y-1/2 origin-center"
                style={{ width: SIZE, height: SIZE }}
                animate={{ scale }}
                transition={{ type: 'spring', stiffness: 260, damping: 22, mass: 0.2 }}
            >
                <div
                    className={`w-full h-full bg-[var(--accent)] transition-[border-radius,opacity] duration-300 ${
                        isIdle ? 'rounded-none opacity-100' : mode === 'label' ? 'rounded-full opacity-95' : 'rounded-full opacity-50'
                    }`}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[1px] bg-[var(--accent)]"
                    animate={{ rotate: isIdle ? 0 : 45, opacity: isIdle ? 1 : 0 }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[200%] w-[1px] bg-[var(--accent)]"
                    animate={{ rotate: isIdle ? 0 : 45, opacity: isIdle ? 1 : 0 }}
                />
            </motion.div>

            {/* The label sits outside the scaled circle so its type stays crisp. */}
            <AnimatePresence>
                {mode === 'label' && (
                    <motion.span
                        key={label}
                        className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[var(--background)] whitespace-nowrap"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.12 } }}
                        transition={{ duration: 0.3, ease: EASE_OUT }}
                    >
                        {label}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
