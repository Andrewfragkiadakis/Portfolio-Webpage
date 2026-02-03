'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useContent } from '@/hooks/useContent'
import { useTheme } from '@/contexts/ThemeContext'
import { useState } from 'react'

export default function Navigation() {
    const { language, setLanguage } = useLanguage()
    const { theme, setTheme } = useTheme()
    const t = useContent()
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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)] border-b border-[var(--foreground)]/20 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-4 min-h-[56px] flex justify-center items-center relative">
                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-6 lg:gap-8 items-center">
                    <button
                        onClick={() => scrollToSection('hero', 0)}
                        className="text-[var(--foreground)] opacity-75 hover:opacity-100 hover:text-[var(--accent)] transition-all text-sm uppercase tracking-widest cursor-pointer"
                    >
                        {language === 'en' ? 'Home' : 'ΑΡΧΙΚΗ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('about', 1)}
                        className="text-[var(--foreground)] opacity-75 hover:opacity-100 hover:text-[var(--accent)] transition-all text-sm uppercase tracking-widest cursor-pointer"
                    >
                        {language === 'en' ? 'About' : 'ΣΧΕΤΙΚΑ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('services', 2)}
                        className="text-[var(--foreground)] opacity-75 hover:opacity-100 hover:text-[var(--accent)] transition-all text-sm uppercase tracking-widest cursor-pointer"
                    >
                        {language === 'en' ? 'Services' : 'ΥΠΗΡΕΣΙΕΣ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('experience', 3)}
                        className="text-[var(--foreground)] opacity-75 hover:opacity-100 hover:text-[var(--accent)] transition-all text-sm uppercase tracking-widest cursor-pointer"
                    >
                        {language === 'en' ? 'Experience' : 'ΕΜΠΕΙΡΙΑ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('projects', 4)}
                        className="text-[var(--foreground)] opacity-75 hover:opacity-100 hover:text-[var(--accent)] transition-all text-sm uppercase tracking-widest cursor-pointer"
                    >
                        {language === 'en' ? 'Projects' : 'ΕΡΓΑ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('contact', 5)}
                        className="text-[var(--foreground)] opacity-75 hover:opacity-100 hover:text-[var(--accent)] transition-all text-sm uppercase tracking-widest cursor-pointer"
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

                {/* Mobile Menu Button - Larger touch target, aligned to bar */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 text-[var(--foreground)] p-3 min-w-[44px] min-h-[44px] flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
                    aria-label="Toggle menu"
                >
                    <svg className="w-7 h-7 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu - Full-screen overlay (planoplus.gr style) */}
            <div
                className={`md:hidden fixed inset-0 z-[100] flex flex-col bg-[var(--background)] transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                    }`}
                aria-hidden={!mobileMenuOpen}
            >
                <div className="flex justify-between items-center px-6 pt-8 pb-4 border-b border-[var(--foreground)]/10">
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-5 py-3 border border-[var(--foreground)] text-[var(--foreground)] font-mono text-sm uppercase tracking-widest hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-200"
                        aria-label="Close menu"
                    >
                        {language === 'en' ? 'Close' : 'ΚΛΕΙΣΙΜΟ'}
                    </button>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="flex items-center gap-2 px-4 py-2 border border-[var(--foreground)] rounded-full hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors duration-200"
                            aria-label="Toggle theme"
                        >
                            <span className="text-xs font-mono uppercase tracking-widest">
                                {theme === 'dark' ? 'DARK_MODE' : 'LIGHT_MODE'}
                            </span>
                            <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
                        </button>
                        <button
                            onClick={() => {
                                setLanguage(language === 'en' ? 'gr' : 'en')
                            }}
                            className="px-4 py-2 text-[var(--foreground)] font-mono text-xs uppercase tracking-widest border border-[var(--foreground)]/30 hover:border-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition-all"
                        >
                            {language === 'en' ? 'GR' : 'EN'}
                        </button>
                    </div>
                </div>

                <nav className="flex-1 flex flex-col justify-center px-6 py-8">
                    <div className="flex flex-col gap-0">
                        <button
                            onClick={() => scrollToSection('hero', 0)}
                            className="text-left py-3.5 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-200 text-2xl sm:text-3xl font-bold uppercase tracking-tight"
                        >
                            {language === 'en' ? 'Home' : 'ΑΡΧΙΚΗ'}
                        </button>
                        <button
                            onClick={() => scrollToSection('about', 1)}
                            className="text-left py-3.5 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-200 text-2xl sm:text-3xl font-bold uppercase tracking-tight"
                        >
                            {t.nav.about}
                        </button>
                        <button
                            onClick={() => scrollToSection('services', 2)}
                            className="text-left py-3.5 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-200 text-2xl sm:text-3xl font-bold uppercase tracking-tight"
                        >
                            {t.nav.services}
                        </button>
                        <button
                            onClick={() => scrollToSection('experience', 3)}
                            className="text-left py-3.5 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-200 text-2xl sm:text-3xl font-bold uppercase tracking-tight"
                        >
                            {t.nav.experience}
                        </button>
                        <button
                            onClick={() => scrollToSection('projects', 4)}
                            className="text-left py-3.5 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-200 text-2xl sm:text-3xl font-bold uppercase tracking-tight"
                        >
                            {t.nav.projects}
                        </button>
                        <button
                            onClick={() => scrollToSection('contact', 5)}
                            className="text-left py-3.5 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-200 text-2xl sm:text-3xl font-bold uppercase tracking-tight"
                        >
                            {t.nav.contact}
                        </button>
                    </div>
                </nav>

                <div className="px-6 py-6 border-t border-[var(--foreground)]/10 flex justify-between items-center text-[var(--foreground)]/60 text-sm font-mono uppercase tracking-widest">
                    <span>{language === 'en' ? 'English' : 'Ελληνικά'}</span>
                    <span>{t.location}</span>
                </div>
            </div>
        </nav >
    )
}
