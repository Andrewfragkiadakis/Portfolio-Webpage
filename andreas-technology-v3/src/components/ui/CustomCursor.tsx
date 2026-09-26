'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react'
import { EASE_OUT } from '@/utils/motion'

const INTERACTIVE = 'button, a, [role="button"], input, textarea, select'

type CursorMode = 'idle' | 'hover' | 'label'

/**
 * A small signal-orange dot that trails the pointer. Over a control it opens into a
 * hairline ring; over anything carrying `data-cursor="Label"` it becomes a small
 * ink tag with that label. The system cursor stays visible — this only annotates.
 * Fine pointers only; skipped under reduced motion.
 */
export default function CustomCursor() {
    const [mode, setMode] = useState<CursorMode>('idle')
    const [label, setLabel] = useState('')
    const [isVisible, setIsVisible] = useState(false)
    const [enabled, setEnabled] = useState(false)

    const rawX = useMotionValue(0)
    const rawY = useMotionValue(0)
    const springConfig = { stiffness: 500, damping: 40, mass: 0.2 }
    const x = useSpring(rawX, springConfig)
    const y = useSpring(rawY, springConfig)

    useEffect(() => {
        const fine = window.matchMedia('(pointer: fine)')
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
        const sync = () => setEnabled(fine.matches && !reduce.matches)
        sync()
        fine.addEventListener('change', sync)
        reduce.addEventListener('change', sync)
        return () => {
            fine.removeEventListener('change', sync)
            reduce.removeEventListener('change', sync)
        }
    }, [])

    useEffect(() => {
        if (!enabled) return

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
    }, [enabled, rawX, rawY])

    if (!enabled || !isVisible) return null

    return (
        <motion.div aria-hidden="true" className="fixed top-0 left-0 pointer-events-none z-[100000]" style={{ x, y }}>
            <motion.div
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                animate={{
                    width: mode === 'hover' ? 32 : mode === 'label' ? 0 : 8,
                    height: mode === 'hover' ? 32 : mode === 'label' ? 0 : 8,
                    backgroundColor: mode === 'hover' ? 'rgba(0,0,0,0)' : 'var(--accent)',
                    borderWidth: mode === 'hover' ? 1 : 0,
                }}
                style={{ borderStyle: 'solid', borderColor: 'var(--accent)' }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
            />
            <AnimatePresence>
                {mode === 'label' && (
                    <motion.span
                        key={label}
                        className="absolute left-3 top-3 px-2 py-1 bg-[var(--foreground)] text-[var(--background)] text-caption font-medium uppercase tracking-[0.06em] whitespace-nowrap"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.12 } }}
                        transition={{ duration: 0.25, ease: EASE_OUT }}
                    >
                        {label} ↗
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
