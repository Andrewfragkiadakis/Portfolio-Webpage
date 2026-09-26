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

    return (
        <AnimatePresence>
            {!entered && (
                <motion.div
                    data-cinematic="true"
                    initial={{ opacity: 1 }}
                    exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center px-4 bg-[var(--background)] text-[var(--foreground)]"
                >
                    <button
                        onClick={handleEnter}
                        className="pill pill--quiet absolute top-5 right-5 !text-caption"
                    >
                        <span className="el-caps">{t.cinematicEntry.skip}</span>
                        <i className="fas fa-arrow-right text-[0.625rem]" aria-hidden="true" />
                    </button>

                    <div className="w-[min(34rem,calc(100vw-2rem))] rounded-[2rem] bg-[var(--terminal)] border border-[var(--terminal-line)] shadow-[0_40px_80px_-32px_rgba(0,0,0,0.5)] overflow-hidden">
                        <div className="flex items-center gap-1.5 px-5 pt-4" aria-hidden="true">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                        </div>
                        <div className="px-6 pt-6 pb-8 min-h-[9.5rem] font-mono text-base md:text-lg leading-relaxed text-[#f5f5f7] terminal-text">
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
                                    delay: 45,
                                    cursor: '▍'
                                }}
                            />
                        </div>
                    </div>

                    <div className="h-20 mt-8 flex items-start">
                        {showButton && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.94 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.04 }}
                                onClick={handleEnter}
                                className="pill pill--accent !min-h-12 !px-7 !text-base"
                            >
                                <span className="el-caps">{t.cinematicEntry.enterSystem}</span>
                                <i className="fas fa-arrow-right" aria-hidden="true" />
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
