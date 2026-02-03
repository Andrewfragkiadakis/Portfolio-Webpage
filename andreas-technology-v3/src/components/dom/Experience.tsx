'use client'
import { useContent } from '@/hooks/useContent'
import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'

const CARD_WIDTH_MOBILE = 280
const GAP_MOBILE = 16
const ONE_CARD_SCROLL_MOBILE = CARD_WIDTH_MOBILE + GAP_MOBILE

export default function Experience() {
    const t = useContent()
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const expMobileRef = useRef<HTMLDivElement>(null)
    const eduMobileRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollContainerRef.current) scrollContainerRef.current.scrollLeft = 0
    }, [])

    const scrollMobileRow = (containerRef: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
        const el = containerRef.current
        if (!el) return
        const amount = direction === 'right' ? ONE_CARD_SCROLL_MOBILE : -ONE_CARD_SCROLL_MOBILE
        const maxScroll = el.scrollWidth - el.clientWidth
        const target = Math.max(0, Math.min(el.scrollLeft + amount, maxScroll))
        el.scrollTo({ left: target, behavior: 'smooth' })
    }

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return

        const container = scrollContainerRef.current
        
        // Check if we're at the boundaries first
        const scrollLeft = container.scrollLeft
        const scrollWidth = container.scrollWidth
        const clientWidth = container.clientWidth
        const maxScroll = scrollWidth - clientWidth
        const isAtStart = scrollLeft <= 1 // Small threshold for rounding
        const isAtEnd = scrollLeft >= maxScroll - 1 // Small threshold for rounding

        // Prevent scrolling if at boundaries
        if (direction === 'left' && isAtStart) {
            return // Already at start, don't scroll
        }
        if (direction === 'right' && isAtEnd) {
            return // Already at end, don't scroll
        }

        const containerRect = container.getBoundingClientRect()
        const containerCenter = containerRect.left + containerRect.width / 2

        // Get all scrollable cards (experience + education cards)
        const cards = Array.from(container.querySelectorAll('[data-card="true"]')) as HTMLElement[]

        if (cards.length === 0) return

        // Find the currently visible card (closest to center)
        let currentIndex = -1
        let minDistance = Infinity

        cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect()
            const cardCenter = cardRect.left + cardRect.width / 2
            const distance = Math.abs(cardCenter - containerCenter)
            
            // Check if card is at least partially visible
            if (distance < minDistance && cardRect.left < containerRect.right && cardRect.right > containerRect.left) {
                minDistance = distance
                currentIndex = index
            }
        })

        // If no card found, determine based on scroll position
        if (currentIndex === -1) {
            if (direction === 'right') {
                // Find first card that's not fully visible to the right
                for (let i = 0; i < cards.length; i++) {
                    const cardRect = cards[i].getBoundingClientRect()
                    if (cardRect.right > containerRect.right) {
                        currentIndex = Math.max(0, i - 1)
                        break
                    }
                }
                if (currentIndex === -1) currentIndex = cards.length - 1
            } else {
                // Find last card that's not fully visible to the left
                for (let i = cards.length - 1; i >= 0; i--) {
                    const cardRect = cards[i].getBoundingClientRect()
                    if (cardRect.left < containerRect.left) {
                        currentIndex = Math.min(cards.length - 1, i + 1)
                        break
                    }
                }
                if (currentIndex === -1) currentIndex = 0
            }
        }

        // Determine target index
        let targetIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1

        // Clamp to valid range
        targetIndex = Math.max(0, Math.min(targetIndex, cards.length - 1))

        // Only scroll if target is different from current
        if (targetIndex === currentIndex) return

        // Scroll to target card using container scroll, not page scroll
        const targetCard = cards[targetIndex]
        if (targetCard) {
            const cardRect = targetCard.getBoundingClientRect()
            const containerRect = container.getBoundingClientRect()
            const scrollOffset = cardRect.left - containerRect.left - (containerRect.width / 2) + (cardRect.width / 2)
            const newScrollLeft = Math.max(0, Math.min(container.scrollLeft + scrollOffset, maxScroll))
            
            container.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            })
        }
    }

    return (
        <section className="w-full h-auto md:h-screen md:max-h-[1080px] flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-24 py-4 md:py-0 overflow-visible md:overflow-hidden relative">
            <div className="max-w-[1920px] mx-auto w-full h-full flex flex-col justify-center">

                {/* --- HEADER & CONTROLS --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-8 md:mb-12 gap-4 md:gap-6">
                    <div className="flex flex-col items-start gap-2">
                        <motion.h2
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-[12vw] md:text-[8vw] lg:text-[6vw] leading-[0.8] font-black tracking-tighter text-transparent select-none uppercase"
                            style={{ WebkitTextStroke: '2px var(--foreground)' }}
                        >
                            {t.experienceSection.title}
                        </motion.h2>
                        <span className="text-sm font-mono tracking-widest uppercase text-[var(--foreground)] pl-2">
                            // {t.experienceSection.subtitle}
                        </span>
                    </div>

                    {/* Navigation Buttons (desktop only; mobile uses two separate swipe rows) */}
                    <div className="hidden md:flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="w-10 h-10 md:w-12 md:h-12 border border-[var(--foreground)]/30 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 active:scale-95"
                            aria-label="Scroll left"
                        >
                            <i className="fas fa-chevron-left text-sm md:text-base"></i>
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-10 h-10 md:w-12 md:h-12 border border-[var(--foreground)]/30 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 active:scale-95"
                            aria-label="Scroll right"
                        >
                            <i className="fas fa-chevron-right text-sm md:text-base"></i>
                        </button>
                    </div>
                </div>

                {/* --- MOBILE: Two rows (Experience | Education) --- */}
                <div className="flex flex-col gap-8 md:hidden">
                    <div>
                        <div className="flex items-center justify-between gap-2 mb-3 pl-1">
                            <span className="text-[10px] font-mono text-[var(--foreground)] opacity-65 uppercase tracking-widest">
                                {t.experienceSection.professional}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => scrollMobileRow(expMobileRef, 'left')}
                                    className="w-9 h-9 border border-[var(--foreground)]/30 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 active:scale-95"
                                    aria-label="Previous"
                                >
                                    <i className="fas fa-chevron-left text-sm"></i>
                                </button>
                                <button
                                    onClick={() => scrollMobileRow(expMobileRef, 'right')}
                                    className="w-9 h-9 border border-[var(--foreground)]/30 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 active:scale-95"
                                    aria-label="Next"
                                >
                                    <i className="fas fa-chevron-right text-sm"></i>
                                </button>
                            </div>
                        </div>
                        <div
                            ref={expMobileRef}
                            className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 scroll-smooth items-stretch"
                            style={{ scrollSnapType: 'x mandatory', overscrollBehaviorX: 'contain' }}
                        >
                            {t.experience.map((exp: any, idx: number) => (
                                <motion.div
                                    key={`exp-m-${idx}`}
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="min-w-[280px] w-[280px] aspect-square bg-[var(--background)] border border-[var(--foreground)]/40 flex-shrink-0 p-4 flex flex-col justify-between hover:border-[var(--accent)] transition-all duration-300 group scroll-snap-align-start relative"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl font-black text-[var(--foreground)] z-0">
                                        {(idx + 1).toString().padStart(2, '0')}
                                    </div>
                                    <div className="z-10 relative flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="w-12 h-12 flex items-center justify-center border border-[var(--accent)]/30 text-[var(--accent)] rounded-lg">
                                                <i className="fas fa-briefcase text-lg"></i>
                                            </span>
                                            <span className="text-[10px] font-mono text-[var(--foreground)] opacity-65 uppercase tracking-widest">
                                                {exp.duration}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-[var(--foreground)] uppercase leading-tight mb-2">
                                            {exp.role}
                                        </h3>
                                        <p className="text-xs font-mono text-[var(--foreground)] opacity-75 mb-4">
                                            @ {exp.company}
                                        </p>
                                        <ul className="space-y-2 flex-1 overflow-y-auto">
                                            {exp.tasks.map((task: string, ti: number) => (
                                                <li key={ti} className="text-xs text-[var(--foreground)] opacity-80 flex items-start gap-2">
                                                    <span className="text-[var(--accent)] mt-1 text-[6px] shrink-0"><i className="fas fa-square"></i></span>
                                                    <span className="leading-tight">{task}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ))}
                            <div className="w-4 flex-shrink-0" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between gap-2 mb-3 pl-1">
                            <span className="text-[10px] font-mono text-[var(--foreground)] opacity-65 uppercase tracking-widest">
                                {t.experienceSection.education}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => scrollMobileRow(eduMobileRef, 'left')}
                                    className="w-9 h-9 border border-[var(--foreground)]/30 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 active:scale-95"
                                    aria-label="Previous"
                                >
                                    <i className="fas fa-chevron-left text-sm"></i>
                                </button>
                                <button
                                    onClick={() => scrollMobileRow(eduMobileRef, 'right')}
                                    className="w-9 h-9 border border-[var(--foreground)]/30 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 active:scale-95"
                                    aria-label="Next"
                                >
                                    <i className="fas fa-chevron-right text-sm"></i>
                                </button>
                            </div>
                        </div>
                        <div
                            ref={eduMobileRef}
                            className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 scroll-smooth items-stretch"
                            style={{ scrollSnapType: 'x mandatory', overscrollBehaviorX: 'contain' }}
                        >
                            {t.education.map((edu: any, idx: number) => (
                                <motion.div
                                    key={`edu-m-${idx}`}
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="min-w-[280px] w-[280px] aspect-square bg-[var(--background)] border border-[var(--foreground)]/20 flex-shrink-0 p-4 flex flex-col justify-between hover:border-[var(--accent)] transition-all duration-300 group scroll-snap-align-start"
                                >
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="w-12 h-12 flex items-center justify-center border border-[var(--foreground)]/30 text-[var(--foreground)] rounded-lg">
                                                <i className="fas fa-graduation-cap text-lg"></i>
                                            </span>
                                            <span className="text-[10px] font-mono text-[var(--foreground)] opacity-65 uppercase tracking-widest">
                                                {edu.duration}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-[var(--foreground)] uppercase leading-tight mb-2">
                                            {edu.degree}
                                        </h3>
                                        <p className="text-xs font-mono text-[var(--foreground)] opacity-75 mb-4">
                                            {edu.institution}
                                        </p>
                                        {edu.details && (
                                            <div className="space-y-2 mb-4 flex-1 overflow-y-auto">
                                                {edu.details.map((detail: string, i: number) => (
                                                    <div key={i} className="flex items-start gap-2 text-xs text-[var(--foreground)] opacity-80">
                                                        <i className="fas fa-check text-[var(--accent)] text-[10px] mt-0.5"></i>
                                                        <span>{detail}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {edu.link && (
                                        <a
                                            href={edu.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-[var(--foreground)] px-4 py-3 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all justify-center w-full mt-auto"
                                        >
                                            <i className="fas fa-certificate"></i>
                                            {t.experienceSection.verify}
                                        </a>
                                    )}
                                </motion.div>
                            ))}
                            <div className="w-4 flex-shrink-0" />
                        </div>
                    </div>
                </div>

                {/* --- DESKTOP: Single horizontal scroll rail --- */}
                <div
                    ref={scrollContainerRef}
                    className="hidden md:flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-4 md:pb-8 -mx-4 px-4 scroll-smooth items-stretch"
                    style={{ scrollSnapType: 'x mandatory', overscrollBehaviorX: 'contain' }}
                    onScroll={(e) => {
                        e.stopPropagation()
                    }}
                >
                    {/* 1. PROFESSIONAL CARDS */}
                    <div className="hidden md:flex flex-shrink-0 items-center justify-center w-[50px] border-r border-[var(--foreground)]/10 mr-2 md:mr-4">
                        <span className="text-[var(--foreground)] opacity-20 [writing-mode:vertical-rl] rotate-180 uppercase tracking-[0.3em] font-black text-xs md:text-sm">
                            {t.experienceSection.professional}
                        </span>
                    </div>

                    {t.experience.map((exp: any, idx: number) => (
                        <motion.div
                            key={`exp-${idx}`}
                            data-card="true"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="min-w-[280px] sm:min-w-[320px] md:min-w-[380px] lg:min-w-[400px] w-[280px] sm:w-[320px] md:w-[380px] lg:w-[400px] aspect-square bg-[var(--background)] border border-[var(--foreground)]/40 flex-shrink-0 p-4 sm:p-6 md:p-8 flex flex-col justify-between hover:border-[var(--accent)] transition-all duration-300 hover:shadow-[0_0_20px_var(--accent)] group scroll-snap-align-start relative"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl font-black text-[var(--foreground)] z-0">
                                {(idx + 1).toString().padStart(2, '0')}
                            </div>

                            <div className="z-10 relative flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="w-12 h-12 flex items-center justify-center border border-[var(--accent)]/30 text-[var(--accent)] rounded-lg group-hover:bg-[var(--accent)] group-hover:text-[var(--background)] transition-colors">
                                        <i className="fas fa-briefcase text-lg"></i>
                                    </span>
                                    <span className="text-[10px] font-mono text-[var(--foreground)] opacity-65 uppercase tracking-widest">
                                        {exp.duration}
                                    </span>
                                </div>

                                <h3 className="text-lg md:text-xl font-bold text-[var(--foreground)] uppercase leading-tight mb-2 group-hover:text-[var(--accent)] transition-colors">
                                    {exp.role}
                                </h3>
                                <p className="text-xs font-mono text-[var(--foreground)] opacity-75 mb-4">
                                    @ {exp.company}
                                </p>

                                <ul className="space-y-2 flex-1 overflow-y-auto">
                                    {exp.tasks.map((task: string, ti: number) => (
                                        <li key={ti} className="text-xs text-[var(--foreground)] opacity-80 flex items-start gap-2">
                                            <span className="text-[var(--accent)] mt-1 text-[6px] shrink-0">
                                                <i className="fas fa-square"></i>
                                            </span>
                                            <span className="leading-tight">{task}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}

                    {/* DIVIDER */}
                    <div className="hidden md:block w-[1px] bg-[var(--foreground)]/20 mx-2 md:mx-4 flex-shrink-0" />

                    {/* 2. ACADEMIC CARDS */}
                    <div className="hidden md:flex flex-shrink-0 items-center justify-center w-[50px] border-r border-[var(--foreground)]/10 mr-2 md:mr-4">
                        <span className="text-[var(--foreground)] opacity-20 [writing-mode:vertical-rl] rotate-180 uppercase tracking-[0.3em] font-black text-xs md:text-sm">
                            {t.experienceSection.education}
                        </span>
                    </div>

                    {t.education.map((edu: any, idx: number) => (
                        <motion.div
                            key={`edu-${idx}`}
                            data-card="true"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="min-w-[280px] sm:min-w-[320px] md:min-w-[380px] lg:min-w-[400px] w-[280px] sm:w-[320px] md:w-[380px] lg:w-[400px] aspect-square bg-[var(--background)] border border-[var(--foreground)]/20 flex-shrink-0 p-4 sm:p-6 md:p-8 flex flex-col justify-between hover:border-[var(--accent)] transition-all duration-300 group scroll-snap-align-start"
                        >
                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="w-12 h-12 flex items-center justify-center border border-[var(--foreground)]/30 text-[var(--foreground)] rounded-lg group-hover:bg-[var(--accent)] group-hover:text-[var(--background)] group-hover:border-[var(--accent)] transition-colors">
                                        <i className="fas fa-graduation-cap text-lg"></i>
                                    </span>
                                    <span className="text-[10px] font-mono text-[var(--foreground)] opacity-65 uppercase tracking-widest">
                                        {edu.duration}
                                    </span>
                                </div>

                                <h3 className="text-lg md:text-xl font-bold text-[var(--foreground)] uppercase leading-tight mb-2 group-hover:text-[var(--accent)] transition-colors">
                                    {edu.degree}
                                </h3>
                                <p className="text-xs font-mono text-[var(--foreground)] opacity-75 mb-4">
                                    {edu.institution}
                                </p>

                                {edu.details && (
                                    <div className="space-y-2 mb-4 flex-1 overflow-y-auto">
                                        {edu.details.map((detail: string, i: number) => (
                                            <div key={i} className="flex items-start gap-2 text-xs text-[var(--foreground)] opacity-80">
                                                <i className="fas fa-check text-[var(--accent)] text-[10px] mt-0.5"></i>
                                                <span>{detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {edu.link && (
                                <a
                                    href={edu.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-[var(--foreground)] px-4 py-3 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all justify-center w-full mt-auto"
                                >
                                    <i className="fas fa-certificate"></i>
                                    {t.experienceSection.verify}
                                </a>
                            )}
                        </motion.div>
                    ))}

                    {/* Padding for end of scroll */}
                    <div className="w-4 md:w-12 flex-shrink-0" />
                </div>
            </div>
        </section>
    )
}