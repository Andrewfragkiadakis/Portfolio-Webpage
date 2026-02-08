'use client'

import { useContent } from '@/hooks/useContent'
import { useState, useEffect } from 'react'
import { smoothScrollToElement } from '@/utils/smooth-scroll'

export default function MobileNav() {
    const t = useContent()
    const [activeSection, setActiveSection] = useState('hero')
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            smoothScrollToElement(element)
            setActiveSection(id)
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false)
            } else if (currentScrollY < lastScrollY || currentScrollY < 50) {
                setIsVisible(true)
            }
            setLastScrollY(currentScrollY)

            const sections = ['hero', 'about', 'services', 'projects', 'contact']
            const scrollPosition = currentScrollY + window.innerHeight / 2

            for (const section of sections) {
                const element = document.getElementById(section)
                if (element) {
                    const { offsetTop, offsetHeight } = element
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section)
                        break
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

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
                className="mx-auto max-w-md rounded-2xl border border-[var(--foreground)]/20 bg-[var(--background)]/95 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.12)] py-3 px-4 flex items-center justify-around gap-1"
                aria-label="Mobile navigation"
            >
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`relative flex flex-1 flex-col items-center justify-center gap-1.5 min-h-[52px] min-w-0 py-2 px-2 rounded-xl transition-colors duration-300 ease-out ${activeSection === item.id
                            ? 'text-[var(--accent)] bg-[var(--foreground)]/10'
                            : 'text-[var(--foreground)] opacity-85 hover:opacity-100 hover:bg-[var(--foreground)]/5 active:bg-[var(--foreground)]/10'
                            }`}
                    >
                        <i className={`${item.icon} text-lg`} aria-hidden="true" />
                        <span className="text-[10px] font-semibold uppercase tracking-widest truncate w-full text-center">
                            {item.label}
                        </span>
                        {activeSection === item.id && (
                            <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-0.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                        )}
                    </button>
                ))}
            </nav>
        </div>
    )
}
