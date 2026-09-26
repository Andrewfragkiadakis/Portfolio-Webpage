'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useContent } from '@/hooks/useContent'
import { SITE_ENTERED_EVENT } from '@/utils/motion'
import { Chevron, Headline } from '@/components/ui/keynote'

/**
 * First-visit intro: the house lights go down. A black stage, one gradient word and
 * an "Enter" pill; the stage lifts away to reveal the title slide. Shown once.
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
                    exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
                    className="tone-dark fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)]"
                >
                    <button
                        type="button"
                        onClick={handleEnter}
                        className="absolute top-5 right-6 text-caption text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                        {k.intro.skip}
                    </button>

                    <div className="kn-glow absolute inset-[15%] pointer-events-none" aria-hidden="true" />

                    <Headline as="p" text={`*${k.intro.headline}*`} play className="relative text-[clamp(3.5rem,16vw,11rem)]" />

                    <motion.button
                        type="button"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        onClick={handleEnter}
                        className="relative mt-10 kn-pill kn-pill--fill"
                    >
                        {k.intro.enter}
                        <Chevron />
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
