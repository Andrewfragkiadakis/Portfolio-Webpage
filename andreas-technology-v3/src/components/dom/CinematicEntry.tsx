'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Typewriter from 'typewriter-effect'
import { useContent } from '@/hooks/useContent'
import { SITE_ENTERED_EVENT } from '@/utils/motion'

export default function CinematicEntry() {
    const t = useContent()
    const [hasVisited, setHasVisited] = useState(false)
    const [entered, setEntered] = useState(false)
    const [showButton, setShowButton] = useState(false)

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

    // A boot screen: monogram, progress bar, typed boot log, then "Enter System".
    // Dark in both themes, as boot screens are.
    return (
        <AnimatePresence>
            {!entered && (
                <motion.div
                    data-cinematic="true"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0B0B0F] text-[#F5F5F7] px-6"
                >
                    <button
                        onClick={handleEnter}
                        className="absolute top-5 right-5 h-9 px-4 rounded-full text-xs font-semibold text-[#C7C7CC] hover:text-white hover:bg-white/10 transition-colors"
                    >
                        {t.cinematicEntry.skip} →
                    </button>

                    <span
                        className="app-tile w-20 h-20 text-3xl font-black tracking-tight mb-10"
                        style={{ background: 'linear-gradient(160deg, #5BC0FF 0%, #0A66FF 100%)' }}
                        aria-hidden="true"
                    >
                        AF
                    </span>

                    <div className="w-56 h-1 rounded-full bg-white/15 overflow-hidden mb-8" aria-hidden="true">
                        <motion.div
                            className="h-full bg-white rounded-full origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: showButton ? 1 : 0.85 }}
                            transition={{ duration: showButton ? 0.4 : 3.2, ease: 'easeOut' }}
                        />
                    </div>

                    <div className="font-mono text-sm md:text-base tracking-wide text-[#C7C7CC] min-h-[5.5em] text-left mb-8">
                        <Typewriter
                            onInit={(typewriter) => {
                                typewriter
                                    .typeString(t.cinematicEntry.initializing)
                                    .pauseFor(700)
                                    .typeString(`<br>${t.cinematicEntry.loading}`)
                                    .pauseFor(700)
                                    .typeString(`<br>${t.cinematicEntry.ready}`)
                                    .callFunction(() => setShowButton(true))
                                    .start()
                            }}
                            options={{
                                delay: 40,
                                cursor: '▍'
                            }}
                        />
                    </div>

                    <div className="h-11">
                        {showButton && (
                            <motion.button
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={handleEnter}
                                className="h-11 px-7 rounded-full bg-white text-[#0B0B0F] text-sm font-semibold hover:bg-[#E5E5EA] transition-colors caps-gr"
                            >
                                {t.cinematicEntry.enterSystem}
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
