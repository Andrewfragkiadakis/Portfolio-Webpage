'use client'

import { useContent } from '@/hooks/useContent'
import { useState, useEffect, useCallback, memo, useRef } from 'react'

function MobileNav() {
    const t = useContent()
    const [activeSection, setActiveSection] = useState('hero')
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const scrollThrottleRef = useRef<NodeJS.Timeout | null>(null)

    const scrollToSection = useCallback((id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
            setActiveSection(id)
        }
    }, [])

    // Handle scroll for active section and visibility - throttled
    useEffect(() => {
        const scroller = document.getElementById('scroller')

        const handleScroll = () => {
            // Throttle to every 100ms
            if (scrollThrottleRef.current) return
            
            scrollThrottleRef.current = setTimeout(() => {
                scrollThrottleRef.current = null
            }, 100)

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
            if (scrollThrottleRef.current) {
                clearTimeout(scrollThrottleRef.current)
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
            className={`md:hidden fixed left-4 right-4 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg z-50 px-4 py-3 flex justify-between items-center transition-all duration-300 ease-in-out ${isVisible ? 'bottom-4 opacity-100 translate-y-0' : '-bottom-20 opacity-0 translate-y-10'
                }`}
        >
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex flex-col items-center gap-1 transition-colors duration-300 ${activeSection === item.id
                        ? 'text-black dark:text-white'
                        : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'
                        }`}
                >
                    <i className={`${item.icon} text-xl`}></i>
                    <span className="text-[10px] font-medium uppercase tracking-wide">{item.label}</span>
                </button>
            ))}
        </div>
    )
}

export default memo(MobileNav)
