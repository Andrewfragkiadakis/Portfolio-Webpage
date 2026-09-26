'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useContent } from '@/hooks/useContent'
import { EASE_APPLE, SITE_ENTERED_EVENT } from '@/utils/motion'
import { Headline } from '@/components/ui/keynote'
import { Mark } from '@/components/ui/Mark'

/**
 * First-visit intro, in the current theme: the mark, a quiet "Hello." and an "Enter"
 * pill. It fades away to reveal the title slide. Shown once.
 */
export default function CinematicEntry() {
    const k = useContent().keynote
    const [hasVisited, setHasVisited] = useState(false)
    const [entered, setEntered] = useState(false)

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
        document.body.style.overflow = !hasVisited && !entered ? 'hidden' : 'auto'
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [hasVisited, entered])

    const handleEnter = () => {
        setEntered(true)
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
                    exit={{ opacity: 0, transition: { duration: 0.7, ease: EASE_APPLE } }}
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-6 text-center"
                >
                    <button
                        type="button"
                        onClick={handleEnter}
                        className="absolute top-4 right-5 t-caption text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                        {k.intro.skip}
                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: EASE_APPLE }}
                    >
                        <Mark size={128} priority alt="Andreas Fragkiadakis" className="w-28 h-28 md:w-32 md:h-32" />
                    </motion.div>

                    <Headline as="p" text={k.intro.headline} play className="t-hero mt-4 text-[clamp(3.5rem,14vw,7rem)]" />

                    <motion.button
                        type="button"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5, ease: EASE_APPLE }}
                        onClick={handleEnter}
                        className="mt-9 kn-pill kn-pill--fill"
                    >
                        {k.intro.enter}
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
