'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Typewriter from 'typewriter-effect'
import { useContent } from '@/hooks/useContent'
import { SITE_ENTERED_EVENT } from '@/utils/motion'
import { Avatar } from '@/components/ui/AppIcon'

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

    // A boot screen: user picture, progress bar, typed boot log, then "Enter System".
    // Dark in both themes, as boot screens are.
    return (
        <AnimatePresence>
            {!entered && (
                <motion.div
                    data-cinematic="true"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black text-[#F5F5F7] px-6"
                >
                    <button
                        onClick={handleEnter}
                        className="absolute top-5 right-5 h-9 px-4 rounded-full text-xs font-semibold text-[#C7C7CC] hover:text-white hover:bg-white/10 transition-colors"
                    >
                        {t.cinematicEntry.skip} →
                    </button>

                    {/* Like the login window: the owner's picture and name, never a vendor logo. */}
                    <div className="flex flex-col items-center gap-3 mb-10 select-none">
                        <Avatar size={96} className="os-avatar--boot" />
                        <p className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-white">{t.os.displayName}</p>
                    </div>

                    <div className="w-48 h-[5px] rounded-full bg-white/20 overflow-hidden mb-10" aria-hidden="true">
                        <motion.div
                            className="h-full bg-white rounded-full origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: showButton ? 1 : 0.85 }}
                            transition={{ duration: showButton ? 0.4 : 3.2, ease: 'easeOut' }}
                        />
                    </div>

                    <div className="font-mono text-xs md:text-[0.8125rem] text-[#8E8E93] min-h-[5.5em] text-left mb-8">
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
                                className="h-10 px-7 rounded-full bg-white text-[#0B0B0F] text-sm font-medium hover:bg-[#E5E5EA] transition-colors caps-gr"
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
