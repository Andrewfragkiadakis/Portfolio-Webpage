'use client'

import { useContent } from '@/hooks/useContent'
import { useState, useEffect, useRef } from 'react'
import { smoothScrollToElement } from '@/utils/smooth-scroll'
import { SECTION_IDS } from '@/data/sections'
import { useHaptics } from '@/hooks/useHaptics'

/** Hide the bar only after a deliberate downward scroll, not on jitter. */
const HIDE_AFTER_SCROLL_PX = 50

export default function MobileNav() {
    const t = useContent()
    const [activeSection, setActiveSection] = useState<string>(SECTION_IDS[0])
    const [isVisible, setIsVisible] = useState(true)
    const lastScrollY = useRef(0)
    const haptics = useHaptics()

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            haptics.select()
            smoothScrollToElement(element)
            setActiveSection(id)
        }
    }

    // Active section comes from an IntersectionObserver rather than per-frame offset maths.
    // The observer fires only when a section actually crosses the middle band of the
    // viewport, so scrolling costs nothing until the answer changes.
    useEffect(() => {
        if (typeof IntersectionObserver === 'undefined') return

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) setActiveSection(entry.target.id)
                }
            },
            // A thin band across the vertical centre: whatever is in it, owns the viewport.
            { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
        )

        for (const id of SECTION_IDS) {
            const element = document.getElementById(id)
            if (element) observer.observe(element)
        }

        return () => observer.disconnect()
    }, [])

    // Show/hide is all this listener does now — a direction comparison, no layout reads.
    useEffect(() => {
        let ticking = false

        const update = () => {
            const currentScrollY = window.scrollY

            if (currentScrollY > lastScrollY.current && currentScrollY > HIDE_AFTER_SCROLL_PX) {
                setIsVisible(false)
            } else if (currentScrollY < lastScrollY.current || currentScrollY < HIDE_AFTER_SCROLL_PX) {
                setIsVisible(true)
            }
            lastScrollY.current = currentScrollY
            ticking = false
        }

        const handleScroll = () => {
            if (ticking) return
            ticking = true
            requestAnimationFrame(update)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navItems = [
        { id: 'hero', icon: 'fas fa-home', label: t.nav.home },
        { id: 'about', icon: 'fas fa-user', label: t.nav.about },
        { id: 'projects', icon: 'fas fa-code', label: t.nav.projects },
        { id: 'contact', icon: 'fas fa-envelope', label: t.nav.contact },
    ]

    return (
        <div
            className={`md:hidden fixed left-4 right-4 z-50 transition-all duration-300 ease-out ${isVisible ? 'bottom-5 opacity-100 translate-y-0' : 'bottom-0 opacity-0 translate-y-4 pointer-events-none'}`}
        >
            <nav
                className="liquid-glass relative mx-auto max-w-md rounded-2xl py-3 px-4 flex items-center justify-around gap-1"
                aria-label="Mobile navigation"
            >
                {navItems.map((item) => {
                    const isActive = activeSection === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            aria-current={isActive ? 'true' : undefined}
                            className={`relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 min-h-[52px] min-w-0 py-2 px-2 rounded-xl transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${isActive
                                ? 'text-[var(--accent)] bg-[var(--foreground)]/10'
                                : 'text-[var(--foreground)] opacity-85 hover:opacity-100 hover:bg-[var(--foreground)]/5 active:bg-[var(--foreground)]/10'
                                }`}
                        >
                            <i className={`${item.icon} text-lg`} aria-hidden="true" />
                            <span className="text-[10px] font-semibold uppercase tracking-widest truncate w-full text-center">
                                {item.label}
                            </span>
                            {isActive && (
                                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-0.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                            )}
                        </button>
                    )
                })}
            </nav>
        </div>
    )
}
