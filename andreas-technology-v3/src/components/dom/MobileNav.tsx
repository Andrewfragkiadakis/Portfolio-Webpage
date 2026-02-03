'use client'

import { useContent } from '@/hooks/useContent'
import { useState, useEffect } from 'react'

export default function MobileNav() {
    const t = useContent()
    const [activeSection, setActiveSection] = useState('hero')
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
            setActiveSection(id)
        }
    }

    // Handle scroll for active section and visibility
    useEffect(() => {
        const scroller = document.getElementById('scroller')

        const handleScroll = () => {
            const currentScrollY = scroller ? scroller.scrollTop : window.scrollY

            // Determine visibility based on scroll direction
            // We use a small threshold (10) to prevent jitter at the very top
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                // Scrolling down & past top threshold -> Hide
                setIsVisible(false)
            } else if (currentScrollY < lastScrollY || currentScrollY < 50) {
                // Scrolling up or near top -> Show
                setIsVisible(true)
            }
            setLastScrollY(currentScrollY)

            // Update active section
            const sections = ['hero', 'about', 'services', 'projects', 'contact']
            // Adjust scroll position calculation for the scrolling container
            const scrollPosition = currentScrollY + window.innerHeight / 2

            for (const section of sections) {
                const element = document.getElementById(section)
                if (element) {
                    // For the scroller container, we need to check position relative to the container
                    // Since sections are inside the scroller, strict offsetTop works well
                    const { offsetTop, offsetHeight } = element
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section)
                        break
                    }
                }
            }
        }

        if (scroller) {
            scroller.addEventListener('scroll', handleScroll)
        } else {
            window.addEventListener('scroll', handleScroll)
        }

        return () => {
            if (scroller) {
                scroller.removeEventListener('scroll', handleScroll)
            } else {
                window.removeEventListener('scroll', handleScroll)
            }
        }
    }, [lastScrollY])

    const navItems = [
        { id: 'hero', icon: 'fas fa-home', label: 'Home' },
        { id: 'about', icon: 'fas fa-user', label: 'About' },
        { id: 'projects', icon: 'fas fa-code', label: 'Projects' },
        { id: 'contact', icon: 'fas fa-envelope', label: 'Contact' },
    ]

    return (
        <div
            className={`md:hidden fixed left-0 right-0 bottom-0 !bg-[var(--background)] !border-t !border-[var(--foreground)] rounded-none shadow-lg z-50 px-4 py-3 flex justify-between items-center transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
        >
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex flex-col items-center gap-1 transition-colors duration-300 ${activeSection === item.id
                        ? 'text-[var(--accent)]'
                        : 'text-[var(--foreground)] opacity-65 hover:opacity-100 hover:text-[var(--foreground)]'
                        }`}
                >
                    <i className={`${item.icon} text-xl`}></i>
                    <span className="text-[10px] font-medium uppercase tracking-wide">{item.label}</span>
                </button>
            ))}
        </div>
    )
}
