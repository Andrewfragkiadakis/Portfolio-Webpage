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
            // Measured from the viewport: offsetTop would be relative to the track wrapper.
            const midpoint = window.innerHeight / 2
            for (const section of SECTION_IDS) {
                const element = document.getElementById(section)
                if (!element) continue
                const { top, bottom } = element.getBoundingClientRect()
                if (midpoint >= top && midpoint < bottom) {
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
            className={`md:hidden fixed left-3 right-3 z-50 transition-all duration-300 ease-out ${isVisible ? 'bottom-3 opacity-100 translate-y-0' : 'bottom-0 opacity-0 translate-y-4 pointer-events-none'}`}
        >
            <nav
                className="mx-auto max-w-md bg-[var(--background)] shadow-[inset_0_0_0_2px_var(--foreground),6px_6px_0_0_var(--block)] p-1 flex items-stretch gap-1"
                aria-label="Mobile navigation"
            >
                {navItems.map((item) => {
                    const isActive = activeSection === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            aria-current={isActive ? 'true' : undefined}
                            className={`flex flex-1 min-w-0 flex-col items-center justify-center gap-1 min-h-13 px-1 transition-colors duration-300 ease-out focus-visible:outline-offset-[-5px] ${isActive
                                ? 'bg-[var(--block)] text-[var(--on-block)] [--focus:#fff]'
                                : 'text-[var(--foreground)] hover:bg-[var(--foreground)]/10'
                                }`}
                        >
                            <i className={`${item.icon} text-base`} aria-hidden="true" />
                            <span className="text-micro font-semibold uppercase tracking-[0.06em] truncate w-full text-center">
                                {item.label}
                            </span>
                        </button>
                    )
                })}
            </nav>
        </div>
    )
}
