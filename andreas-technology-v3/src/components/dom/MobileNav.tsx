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
                // The id sits on the section's opening tile; measure the whole section.
                const anchor = document.getElementById(section)
                const element = anchor?.closest('section') ?? anchor
                if (!element) continue
                // Page-relative top: offsetTop would be relative to the positioned panel wrapper.
                const top = element.getBoundingClientRect().top + currentScrollY
                if (midpoint >= top && midpoint < top + element.offsetHeight) {
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
                className="mx-auto max-w-md rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface)]/85 backdrop-blur-xl backdrop-saturate-150 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.3)] p-1.5 flex items-center justify-around gap-1"
                aria-label="Mobile navigation"
            >
                {navItems.map((item) => {
                    const isActive = activeSection === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            aria-current={isActive ? 'true' : undefined}
                            className={`relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 min-h-13 min-w-0 py-2 px-2 rounded-[1.375rem] transition-colors duration-300 ease-out ${isActive
                                ? 'text-[var(--accent)] bg-[var(--fill)]'
                                : 'text-[var(--muted)] hover:text-[var(--foreground)] active:bg-[var(--fill)]'
                                }`}
                        >
                            <i className={`${item.icon} text-base`} aria-hidden="true" />
                            <span className="text-[0.625rem] font-semibold uppercase tracking-[0.06em] truncate w-full text-center">
                                {item.label}
                            </span>
                        </button>
                    )
                })}
            </nav>
        </div>
    )
}
