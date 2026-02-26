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
                    role="dialog"
                    aria-modal="true"
                    aria-label="Site intro — press Skip or Enter System to continue"
                    initial={{ opacity: 1 }}
                    exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)]"
                >
                    {/* Skip button — always visible so keyboard/AT users can bypass the animation */}
                    <button
                        onClick={handleEnter}
                        className="absolute top-4 right-4 text-xs font-mono text-[var(--foreground)] opacity-50 hover:opacity-100 underline underline-offset-2 transition-opacity focus:outline-none focus:opacity-100"
                        aria-label="Skip intro animation"
                    >
                        {t.cinematicEntry.skip}
                    </button>

                    <div className="font-mono text-xl md:text-2xl tracking-widest text-[var(--accent)] mb-8" aria-live="polite" aria-atomic="true">
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
                            // eslint-disable-next-line jsx-a11y/no-autofocus
                            autoFocus
                            className="px-8 py-4 border border-[var(--accent)] text-[var(--accent)] font-bold uppercase tracking-[0.2em] hover:bg-[var(--accent)]/10 transition-all duration-300 ease-out focus:outline-none focus:bg-[var(--accent)]/10"
                        >
                            {t.cinematicEntry.enterSystem}
                        </motion.button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
