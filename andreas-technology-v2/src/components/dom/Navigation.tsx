'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import { useState, useCallback, memo } from 'react'

function Navigation() {
    const { language, setLanguage } = useLanguage()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const scrollToSection = useCallback((id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
        setMobileMenuOpen(false)
    }, [])

    const toggleLanguage = useCallback(() => {
        setLanguage(language === 'en' ? 'gr' : 'en')
    }, [language, setLanguage])

    const toggleLanguageAndCloseMenu = useCallback(() => {
        setLanguage(language === 'en' ? 'gr' : 'en')
        setMobileMenuOpen(false)
    }, [language, setLanguage])

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Image
                        src="/favicons/favicon-32x32.png"
                        alt="AF Logo"
                        width={24}
                        height={24}
                        className="rounded sm:w-8 sm:h-8 md:hidden"
                    />
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-6 lg:gap-8 items-center">
                    <button
                        onClick={() => scrollToSection('hero')}
                        className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors text-sm uppercase tracking-widest cursor-pointer"
                    >
                        {language === 'en' ? 'Home' : 'ΑΡΧΙΚΗ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('about')}
                        className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors text-sm uppercase tracking-widest cursor-pointer"
                    >
                        {language === 'en' ? 'About' : 'ΣΧΕΤΙΚΑ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('services')}
                        className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors text-sm uppercase tracking-widest cursor-pointer"
                    >
                        {language === 'en' ? 'Services' : 'ΥΠΗΡΕΣΙΕΣ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('experience')}
                        className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors text-sm uppercase tracking-widest cursor-pointer"
                    >
                        {language === 'en' ? 'Experience' : 'ΕΜΠΕΙΡΙΑ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('projects')}
                        className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors text-sm uppercase tracking-widest cursor-pointer"
                    >
                        {language === 'en' ? 'Projects' : 'ΕΡΓΑ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('contact')}
                        className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors text-sm uppercase tracking-widest cursor-pointer"
                    >
                        {language === 'en' ? 'Contact' : 'ΕΠΙΚΟΙΝΩΝΙΑ'}
                    </button>

                    {/* Language Toggle */}
                    <button
                        onClick={toggleLanguage}
                        className="ml-4 px-3 py-1 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-black dark:text-white rounded transition-all duration-200 text-sm font-medium cursor-pointer"
                    >
                        {language === 'en' ? 'GR' : 'EN'}
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden text-black dark:text-white p-2 transition-transform duration-200 hover:scale-110"
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
                className={`md:hidden bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="flex flex-col space-y-1 px-4 py-4">
                    <button
                        onClick={() => scrollToSection('hero')}
                        className="text-left py-3 px-4 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200 uppercase tracking-wide text-sm font-medium"
                    >
                        {language === 'en' ? 'Home' : 'ΑΡΧΙΚΗ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('about')}
                        className="text-left py-3 px-4 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200 uppercase tracking-wide text-sm font-medium"
                    >
                        {language === 'en' ? 'About' : 'ΣΧΕΤΙΚΑ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('services')}
                        className="text-left py-3 px-4 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200 uppercase tracking-wide text-sm font-medium"
                    >
                        {language === 'en' ? 'Services' : 'ΥΠΗΡΕΣΙΕΣ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('experience')}
                        className="text-left py-3 px-4 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200 uppercase tracking-wide text-sm font-medium"
                    >
                        {language === 'en' ? 'Experience' : 'ΕΜΠΕΙΡΙΑ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('projects')}
                        className="text-left py-3 px-4 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200 uppercase tracking-wide text-sm font-medium"
                    >
                        {language === 'en' ? 'Projects' : 'ΕΡΓΑ'}
                    </button>
                    <button
                        onClick={() => scrollToSection('contact')}
                        className="text-left py-3 px-4 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200 uppercase tracking-wide text-sm font-medium"
                    >
                        {language === 'en' ? 'Contact' : 'ΕΠΙΚΟΙΝΩΝΙΑ'}
                    </button>
                    <button
                        onClick={toggleLanguageAndCloseMenu}
                        className="text-left mt-2 py-3 px-4 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-black dark:text-white rounded-lg transition-all duration-200 font-medium text-sm"
                    >
                        {language === 'en' ? '🌐 Switch to Greek' : '🌐 Αλλαγή σε Αγγλικά'}
                    </button>
                </div>
            </div>
        </nav >
    )
}

export default memo(Navigation)
