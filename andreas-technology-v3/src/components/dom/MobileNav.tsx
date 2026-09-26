'use client'

import { useContent } from '@/hooks/useContent'
import { useState, useEffect, useRef } from 'react'
import { smoothScrollToElement } from '@/utils/smooth-scroll'
import { SECTION_IDS } from '@/data/sections'

/** Hide the bar only after a deliberate downward scroll, not on jitter. */
const HIDE_AFTER_SCROLL_PX = 50

export default function MobileNav() {
    const t = useContent()
    const [activeSection, setActiveSection] = useState<string>(SECTION_IDS[0])
    const [isVisible, setIsVisible] = useState(true)
    const lastScrollY = useRef(0)

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            smoothScrollToElement(element)
            setActiveSection(id)
        }
    }

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

            // Whichever section owns the middle of the viewport is the active one.
            const midpoint = currentScrollY + window.innerHeight / 2
            for (const section of SECTION_IDS) {
                const element = document.getElementById(section)
                if (!element) continue
                const top = element.getBoundingClientRect().top + currentScrollY
                const host = element.closest('[data-panel]') as HTMLElement | null
                const height = host?.offsetHeight ?? element.offsetHeight
                if (midpoint >= top && midpoint < top + height) {
                    setActiveSection(section)
                    break
                }
            }
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
        { id: 'hero', label: t.nav.home },
        { id: 'about', label: t.nav.about },
        { id: 'projects', label: t.nav.projects },
        { id: 'contact', label: t.nav.contact },
    ]

    return (
        <div
            className={`md:hidden fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-out ${isVisible ? 'translate-y-0' : 'translate-y-full pointer-events-none'}`}
        >
            <nav
                className="grid grid-cols-4 bg-[var(--background)] rule-t pb-[env(safe-area-inset-bottom)]"
                aria-label="Mobile navigation"
            >
                {navItems.map((item, i) => {
                    const isActive = activeSection === item.id
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => scrollToSection(item.id)}
                            aria-current={isActive ? 'true' : undefined}
                            className={`relative min-h-14 min-w-0 px-2 flex flex-col items-start justify-center gap-0.5 text-left transition-colors duration-300 ${i > 0 ? 'rule-l' : ''} ${isActive ? 'text-[var(--foreground)]' : 'text-[var(--muted)]'}`}
                        >
                            <span className={`text-micro tabular font-medium ${isActive ? 'text-[var(--accent-ink)]' : ''}`}>{String(i + 1).padStart(2, '0')}</span>
                            <span className="text-caption font-medium uppercase tracking-[0.05em] truncate w-full">{item.label}</span>
                            {isActive && <span className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--accent)]" aria-hidden="true" />}
                        </button>
                    )
                })}
            </nav>
        </div>
    )
}
