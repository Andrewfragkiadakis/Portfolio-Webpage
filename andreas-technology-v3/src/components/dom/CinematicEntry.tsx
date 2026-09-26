'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import Typewriter from 'typewriter-effect'
import { useContent } from '@/hooks/useContent'
import { SITE_ENTERED_EVENT } from '@/utils/motion'
import Memoji from '@/components/ui/Memoji'

export default function CinematicEntry() {
    const t = useContent()
    const [hasVisited, setHasVisited] = useState(false)
    const [entered, setEntered] = useState(false)
    const [showButton, setShowButton] = useState(false)
    const reduce = useReducedMotion()

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

    return (
        <AnimatePresence>
            {!entered && (
                <motion.div
                    data-cinematic="true"
                    initial={{ opacity: 1 }}
                    exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: reduce ? 0 : 0.9, ease: [0.76, 0, 0.24, 1] } }}
                    style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                    className="surface-block fixed inset-0 z-[99999] flex flex-col items-start justify-end px-6 sm:px-12 pb-16 sm:pb-20"
                >
                    <span className="absolute top-4 left-6 sm:left-12 flex items-center gap-3" aria-hidden="true">
                        <Memoji size={2.5} tone="paper" decorative />
                        <span className="meta">andreas.technology</span>
                    </span>
                    <button
                        onClick={handleEnter}
                        className="absolute top-4 right-4 sm:right-10 btn btn-line btn-bar h-10 px-4"
                    >
                        {t.cinematicEntry.skip} →
                    </button>

                    <div className="display-heavy leading-[1.02] text-[clamp(2rem,6vw,5rem)] mb-10 min-h-[3.2em]">
                        <Typewriter
                            onInit={(typewriter) => {
                                typewriter
                                    .typeString(t.cinematicEntry.initializing)
                                    .pauseFor(1000)
                                    .typeString(`<br>${t.cinematicEntry.loading}`)
                                    .pauseFor(1000)
                                    .typeString(`<br>${t.cinematicEntry.ready}`)
                                    .callFunction(() => setShowButton(true))
                                    .start()
                            }}
                            options={{
                                delay: 50,
                                cursor: '■'
                            }}
                        />
                    </div>

                    {showButton && (
                        <motion.button
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={handleEnter}
                            className="btn btn-paper h-14 px-6 min-w-[14rem] justify-between"
                        >
                            {t.cinematicEntry.enterSystem}
                            <span aria-hidden="true">→</span>
                        </motion.button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
