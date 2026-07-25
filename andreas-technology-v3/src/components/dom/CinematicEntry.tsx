'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Typewriter from 'typewriter-effect'
import { useContent } from '@/hooks/useContent'

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
                    exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)]"
                >
                    <button
                        onClick={handleEnter}
                        className="absolute top-6 right-6 text-xs font-mono uppercase tracking-[0.2em] text-[var(--foreground)] opacity-60 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300"
                    >
                        {t.cinematicEntry.skip} →
                    </button>

                    <div className="font-mono text-xl md:text-2xl tracking-widest text-[var(--accent)] mb-8">
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
                                cursor: '█'
                            }}
                        />
                    </div>

                    {showButton && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.1, textShadow: "0 0 8px var(--accent)" }}
                            onClick={handleEnter}
                            className="px-8 py-4 border border-[var(--accent)] text-[var(--accent)] font-bold uppercase tracking-[0.2em] hover:bg-[var(--accent)]/10 transition-all duration-300 ease-out"
                        >
                            {t.cinematicEntry.enterSystem}
                        </motion.button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
