'use client'

import { useState, useEffect, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useContent } from '@/hooks/useContent'
import { SITE_ENTERED_EVENT } from '@/utils/motion'
import { Avatar } from '@/components/ui/AppIcon'

/** Boot log timing (ms): per typed character, the pause between lines, and the lead-in. */
const CHAR_MS = 28
const LINE_PAUSE_MS = 320
const LEAD_MS = 200

/**
 * Lays out the typed boot log on a timeline. The typing is pure CSS (a stepped
 * max-width in `ch` on a monospace line), so it starts with the first paint of the
 * server HTML instead of waiting for JavaScript to download and hydrate. On a slow
 * phone that is the difference between "Enter System" at ~4 s and at ~8 s.
 */
function timeline(lines: string[]) {
    let at = LEAD_MS
    const out = lines.map((text) => {
        const n = [...text].length
        const dur = n * CHAR_MS
        const row = { text, n, at, dur }
        at += dur + LINE_PAUSE_MS
        return row
    })
    return { rows: out, done: at - LINE_PAUSE_MS }
}

export default function CinematicEntry() {
    const t = useContent()
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

    const { rows, done } = timeline([t.cinematicEntry.initializing, t.cinematicEntry.loading, t.cinematicEntry.ready])

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
                    style={{ '--boot-done': `${done}ms` } as CSSProperties}
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
                        <div className="boot-progress h-full bg-white rounded-full origin-left" />
                    </div>

                    <div className="font-mono text-xs md:text-[0.8125rem] text-[#8E8E93] min-h-[5.5em] text-left mb-8" role="status">
                        {rows.map((row, i) => (
                            <span
                                key={i}
                                className="boot-row"
                                style={{ '--n': row.n, '--at': `${row.at}ms`, '--dur': `${row.dur}ms`, '--until': i < rows.length - 1 ? `${rows[i + 1].at}ms` : '999s' } as CSSProperties}
                            >
                                <span className="boot-text">{row.text}</span>
                                <span className="boot-cursor" aria-hidden="true">▍</span>
                            </span>
                        ))}
                    </div>

                    <div className="h-11">
                        <button
                            onClick={handleEnter}
                            className="boot-enter h-10 px-7 rounded-full bg-white text-[#0B0B0F] text-sm font-medium hover:bg-[#E5E5EA] transition-colors caps-gr"
                        >
                            {t.cinematicEntry.enterSystem}
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
