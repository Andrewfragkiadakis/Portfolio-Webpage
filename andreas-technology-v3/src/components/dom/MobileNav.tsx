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
                const rect = element.getBoundingClientRect()
                const top = rect.top + currentScrollY
                if (midpoint >= top && midpoint < top + rect.height) {
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

    const k = t.keynote
    const navItems = [
        { id: 'hero', icon: 'fas fa-house', label: k.nav.home },
        { id: 'about', icon: 'fas fa-user', label: k.nav.about },
        { id: 'projects', icon: 'fas fa-laptop', label: k.nav.projects },
        { id: 'contact', icon: 'fas fa-envelope', label: k.nav.contact },
    ]

    return (
        <div
            className={`md:hidden fixed left-4 right-4 z-50 transition-all duration-300 ease-out ${isVisible ? 'bottom-4 opacity-100 translate-y-0' : 'bottom-0 opacity-0 translate-y-4 pointer-events-none'}`}
        >
            {/* iOS-style floating tab bar; uses the page theme, not the slide tone. */}
            <nav
                className="mx-auto max-w-sm rounded-[1.75rem] border border-[var(--line)] bg-[var(--background)]/80 backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.35)] p-1.5 flex items-center justify-around gap-1"
                aria-label="Mobile navigation"
            >
                {navItems.map((item) => {
                    const isActive = activeSection === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            aria-current={isActive ? 'true' : undefined}
                            className={`relative flex flex-1 flex-col items-center justify-center gap-1 min-h-12 min-w-0 px-1 rounded-[1.25rem] transition-colors duration-300 ease-out ${isActive
                                ? 'text-[var(--accent)] bg-[var(--surface)]'
                                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                                }`}
                        >
                            <i className={`${item.icon} text-base`} aria-hidden="true" />
                            <span className="text-[0.625rem] font-medium truncate w-full text-center">
                                {item.label}
                            </span>
                        </button>
                    )
                })}
            </nav>
        </div>
    )
}
