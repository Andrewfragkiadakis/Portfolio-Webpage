'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useContent } from '@/hooks/useContent'
import { SITE_ENTERED_EVENT, EASE_OUT, EASE_IN_OUT } from '@/utils/motion'

/** Time between the three status lines, then the enter control. */
const STEP_MS = 650

/**
 * First-visit intro, set as a typographic title card: the three status lines rise
 * one after another on hairlines, then the enter control appears. Returning
 * visitors never see it (a <head> script hides it before paint).
 */
export default function CinematicEntry() {
    const t = useContent()
    const reduce = useReducedMotion()
    const [hasVisited, setHasVisited] = useState(false)
    const [entered, setEntered] = useState(false)
    const [step, setStep] = useState(0)

    useEffect(() => {
        try {
            if (localStorage.getItem('cinematic-entered') === 'true') {
                // Browser-only value; unavailable during SSR so it must be read after mount.
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setHasVisited(true)
            }
        } catch {
            // localStorage unavailable
        }
    }, [])

    useEffect(() => {
        if (hasVisited || entered || step >= 4) return
        const id = setTimeout(() => setStep((s) => s + 1), reduce ? 0 : STEP_MS)
        return () => clearTimeout(id)
    }, [hasVisited, entered, step, reduce])

    useEffect(() => {
        if (!hasVisited && !entered) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [hasVisited, entered])

    const handleEnter = () => {
        setEntered(true)
        // Let the hero start its reveal while the overlay slides away.
        document.documentElement.dataset.revealed = 'true'
        window.dispatchEvent(new Event(SITE_ENTERED_EVENT))
        try {
            localStorage.setItem('cinematic-entered', 'true')
        } catch {
            // localStorage unavailable
        }
    }

    if (hasVisited) return null

    const lines = [t.cinematicEntry.initializing, t.cinematicEntry.loading, t.cinematicEntry.ready].map((line) => line.replace(/^>\s*/, ''))

    return (
        <AnimatePresence>
            {!entered && (
                <motion.div
                    data-cinematic="true"
                    initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                    exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.85, ease: EASE_IN_OUT } }}
                    className="field fixed inset-0 z-[99999] flex flex-col px-4 md:px-10 py-4 md:py-6"
                >
                    <div className="flex items-baseline justify-between rule-t-strong pt-2.5">
                        <span className="text-sm font-semibold tracking-[-0.01em]">
                            {t.editorial.firstName} {t.editorial.lastName}<span className="stop" aria-hidden="true" />
                        </span>
                        <button
                            type="button"
                            onClick={handleEnter}
                            className="text-caption font-medium uppercase tracking-[0.06em] text-[var(--muted)] hover:text-white transition-colors min-h-11 -my-3"
                        >
                            {t.cinematicEntry.skip} →
                        </button>
                    </div>

                    <div className="flex-1" />

                    <ol className="w-full md:w-1/2">
                        {lines.map((line, i) => (
                            <li key={line} className="rule-t overflow-hidden">
                                <motion.div
                                    className="grid grid-cols-[3rem_1fr] items-baseline py-2"
                                    initial={{ y: '100%', opacity: 0 }}
                                    animate={step > i ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
                                    transition={{ duration: 0.6, ease: EASE_OUT }}
                                >
                                    <span className="index text-sm tabular">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="display-heavy text-[clamp(1.75rem,4.4vw,4rem)] leading-[0.95]">{line}</span>
                                </motion.div>
                            </li>
                        ))}
                    </ol>

                    <div className="rule-t pt-4 mt-0 md:w-1/2 min-h-20">
                        {step >= 4 && (
                            <motion.button
                                type="button"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: EASE_OUT }}
                                onClick={handleEnter}
                                autoFocus
                                className="arrow-link inline-flex items-center gap-3 bg-white text-[var(--cobalt)] border border-white px-6 py-4 text-base font-semibold hover:bg-transparent hover:text-white transition-colors"
                            >
                                {t.cinematicEntry.enterSystem}
                                <span className="arrow" aria-hidden="true">→</span>
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
