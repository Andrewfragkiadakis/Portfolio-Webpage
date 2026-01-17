'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import { useState } from 'react'

export default function Navigation() {
    const { language, setLanguage } = useLanguage()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const scrollToSection = (id: string, index: number) => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth >= 768) {
                // Desktop: Horizontal Scroll assumes height mapping (100vh per section)
                // Sections: Hero(0), About(1), Services(2), Experience(3), Projects(4), Contact(5)
                // However, HorizontalLayout uses a transform. The track is sticky.
                // We scroll the BODY down to drive the transform.
                // Each 'section' of horizontal movement corresponds to 1 window height of vertical scroll?
                // In HorizontalLayout: x maps [0, 1] to [0%, -500vw].
                // Total height is 600vh.
                // Scroll 0 -> Hero.
                // Scroll 100vh -> About? No.
                // 600vh total. 6 sections. 
                // Scroll range is 0 to (600vh - 100vh) = 500vh? 
                // Actually usually `h-[600vh]` means we can scroll 500vh distance.
                // So index * (document.body.scrollHeight - window.innerHeight) / 5 ?
                // Let's use precise proportion.
                // x = scrollProgress * -500vw.
                // We want x to be 0vw, -100vw, -200vw...
                // scrollProgress = 0, 0.2, 0.4, 0.6, 0.8, 1.0
                // So scroll position should be index/5 * maxScroll.
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight
                const targetY = (index / 5) * maxScroll
                window.scrollTo({ top: targetY, behavior: 'smooth' })
            } else {
                // Mobile: Normal vertical scroll
                const element = document.getElementById(id)
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                }
            }
        }
        setMobileMenuOpen(false)
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--foreground)]/20 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex justify-center items-center relative">
                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-6 lg:gap-8 items-center">
                    <button
                        onClick={() => scrollToSection('hero', 0)}
                        className="text-[var(--foreground)] opacity-60 hover:opacity-100 hover:text-[var(--accent)] transition-all text-sm uppercase tracking-widest cursor-pointer"
                    >
                        {language === 'en' ? 'Home' : 'ΑΡΧΙΚΗ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('about', 1)}
                        className="text-[var(--foreground)] opacity-60 hover:opacity-100 hover:text-[var(--accent)] transition-all text-sm uppercase tracking-widest cursor-pointer"
                    >
                        {language === 'en' ? 'About' : 'ΣΧΕΤΙΚΑ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('services', 2)}
                        className="text-[var(--foreground)] opacity-60 hover:opacity-100 hover:text-[var(--accent)] transition-all text-sm uppercase tracking-widest cursor-pointer"
                    >
                        {language === 'en' ? 'Services' : 'ΥΠΗΡΕΣΙΕΣ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('experience', 3)}
                        className="text-[var(--foreground)] opacity-60 hover:opacity-100 hover:text-[var(--accent)] transition-all text-sm uppercase tracking-widest cursor-pointer"
                    >
                        {language === 'en' ? 'Experience' : 'ΕΜΠΕΙΡΙΑ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('projects', 4)}
                        className="text-[var(--foreground)] opacity-60 hover:opacity-100 hover:text-[var(--accent)] transition-all text-sm uppercase tracking-widest cursor-pointer"
                    >
                        {language === 'en' ? 'Projects' : 'ΕΡΓΑ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('contact', 5)}
                        className="text-[var(--foreground)] opacity-60 hover:opacity-100 hover:text-[var(--accent)] transition-all text-sm uppercase tracking-widest cursor-pointer"
                    >
                        {language === 'en' ? 'Contact' : 'ΕΠΙΚΟΙΝΩΝΙΑ'}
                    </button>

                    {/* Language Toggle */}
                    <button
                        onClick={() => setLanguage(language === 'en' ? 'gr' : 'en')}
                        className="ml-4 px-3 py-1 bg-[var(--foreground)]/10 hover:bg-[var(--foreground)]/20 text-[var(--foreground)] rounded transition-all duration-200 text-sm font-medium cursor-pointer"
                    >
                        {language === 'en' ? 'GR' : 'EN'}
                    </button>
                </div>

                {/* Mobile Menu Button - Absolute positioned on right for centering header context */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden absolute right-4 text-[var(--foreground)] p-2 transition-transform duration-200 hover:scale-110"
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu with animation */}
            <div
                className={`md:hidden bg-[var(--background)] border-t border-[var(--foreground)]/20 overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="flex flex-col space-y-1 px-4 py-4">
                    <button
                        onClick={() => scrollToSection('hero', 0)}
                        className="text-left py-3 px-4 text-[var(--foreground)] hover:bg-[var(--foreground)]/5 rounded-lg transition-all duration-200 uppercase tracking-wide text-sm font-medium"
                    >
                        {language === 'en' ? 'Home' : 'ΑΡΧΙΚΗ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('about', 1)}
                        className="text-left py-3 px-4 text-[var(--foreground)] hover:bg-[var(--foreground)]/5 rounded-lg transition-all duration-200 uppercase tracking-wide text-sm font-medium"
                    >
                        {language === 'en' ? 'About' : 'ΣΧΕΤΙΚΑ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('services', 2)}
                        className="text-left py-3 px-4 text-[var(--foreground)] hover:bg-[var(--foreground)]/5 rounded-lg transition-all duration-200 uppercase tracking-wide text-sm font-medium"
                    >
                        {language === 'en' ? 'Services' : 'ΥΠΗΡΕΣΙΕΣ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('experience', 3)}
                        className="text-left py-3 px-4 text-[var(--foreground)] hover:bg-[var(--foreground)]/5 rounded-lg transition-all duration-200 uppercase tracking-wide text-sm font-medium"
                    >
                        {language === 'en' ? 'Experience' : 'ΕΜΠΕΙΡΙΑ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('projects', 4)}
                        className="text-left py-3 px-4 text-[var(--foreground)] hover:bg-[var(--foreground)]/5 rounded-lg transition-all duration-200 uppercase tracking-wide text-sm font-medium"
                    >
                        {language === 'en' ? 'Projects' : 'ΕΡΓΑ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('contact', 5)}
                        className="text-left py-3 px-4 text-[var(--foreground)] hover:bg-[var(--foreground)]/5 rounded-lg transition-all duration-200 uppercase tracking-wide text-sm font-medium"
                    >
                        {language === 'en' ? 'Contact' : 'ΕΠΙΚΟΙΝΩΝΙΑ'}
                    </button>
                    <button
                        onClick={() => {
                            setLanguage(language === 'en' ? 'gr' : 'en')
                            setMobileMenuOpen(false)
                        }}
                        className="text-left mt-2 py-3 px-4 bg-[var(--foreground)]/10 hover:bg-[var(--foreground)]/20 text-[var(--foreground)] rounded-lg transition-all duration-200 font-medium text-sm"
                    >
                        {language === 'en' ? '🌐 Switch to Greek' : '🌐 Αλλαγή σε Αγγλικά'}
                    </button>
                </div>
            </div>
        </nav >
    )
}
