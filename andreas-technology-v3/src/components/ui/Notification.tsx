'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useContent } from '@/hooks/useContent'
import { useSiteEntered } from '@/hooks/useSiteEntered'
import { useDesktopState } from '@/contexts/DesktopContext'
import AppIcon from '@/components/ui/AppIcon'

const SEEN_KEY = 'notified-jamf-200'
const SHOW_AFTER_MS = 2400
const DISMISS_AFTER_MS = 9000

/**
 * A single macOS-style notification banner, shown once per browser: "Jamf 200
 * certified", sliding in from the right edge under the menu bar. It links to the
 * credential on Credly, stays while the pointer rests on it, and can be dismissed with
 * the close button that appears on hover (or focus), as on macOS.
 */
export default function Notification() {
    const t = useContent()
    const entered = useSiteEntered()
    const isDesktop = useDesktopState((s) => s.isDesktop)
    const reduceMotion = useReducedMotion()
    const [show, setShow] = useState(false)
    const [held, setHeld] = useState(false)
    const credly = t.education.find((e) => e.featured && e.link)?.link ?? t.linkedin
    const n = t.os.notification

    useEffect(() => {
        if (!entered || !isDesktop) return
        let seen = false
        try {
            seen = localStorage.getItem(SEEN_KEY) === '1'
        } catch {
            // Storage unavailable: show it, once per page view.
        }
        if (seen) return
        const timer = setTimeout(() => {
            setShow(true)
            try {
                localStorage.setItem(SEEN_KEY, '1')
            } catch {
                // ignore
            }
        }, SHOW_AFTER_MS)
        return () => clearTimeout(timer)
    }, [entered, isDesktop])

    useEffect(() => {
        if (!show || held) return
        const timer = setTimeout(() => setShow(false), DISMISS_AFTER_MS)
        return () => clearTimeout(timer)
    }, [show, held])

    return (
        // The wrapper clips the slide-in so the banner never widens the page; it passes
        // pointer events through except on the banner itself.
        <div className="hidden md:block fixed right-0 top-[var(--nav-h)] z-[55] w-[23.5rem] overflow-hidden pointer-events-none pt-2.5 pl-2 pr-3 pb-8" role="status" aria-live="polite">
            <AnimatePresence>
                {show && (
                    <motion.div
                        className="os-notification group"
                        initial={reduceMotion ? { opacity: 0 } : { x: '112%' }}
                        animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
                        exit={reduceMotion ? { opacity: 0 } : { x: '112%', transition: { duration: 0.32, ease: [0.4, 0, 1, 1] } }}
                        transition={reduceMotion ? { duration: 0 } : { type: 'spring', visualDuration: 0.5, bounce: 0.1 }}
                        onPointerEnter={() => setHeld(true)}
                        onPointerLeave={() => setHeld(false)}
                        onFocus={() => setHeld(true)}
                        onBlur={() => setHeld(false)}
                    >
                        <a href={credly} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-3 pr-3.5 rounded-[inherit]">
                            <AppIcon app="credential" size={38} className="mt-0.5" />
                            <span className="min-w-0 flex-1">
                                <span className="flex items-baseline justify-between gap-2">
                                    <span className="font-semibold text-[0.8125rem] leading-snug truncate">{n.title}</span>
                                    <span className="text-caption text-[var(--muted)] shrink-0">{n.now}</span>
                                </span>
                                <span className="block text-[0.8125rem] leading-snug text-[var(--foreground)] opacity-90">
                                    {n.body}
                                    <span className="sr-only"> ({t.os.aria.newTab})</span>
                                </span>
                            </span>
                        </a>
                        <button type="button" onClick={() => setShow(false)} aria-label={n.close} className="os-notification__close">
                            <svg viewBox="0 0 12 12" width="8" height="8" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                                <path d="M3 3l6 6M9 3 3 9" />
                            </svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
