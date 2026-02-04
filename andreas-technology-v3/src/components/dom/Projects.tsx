'use client'
import { useContent } from '@/hooks/useContent'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'

export default function Projects() {
    const t = useContent()
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Reset scroll position on mount
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 0
        }
    }, [])

    const scrollProjects = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current
        if (!container) return

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

        // Get all project cards
        const cards = Array.from(container.querySelectorAll('[data-project-card]')) as HTMLElement[]

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

        // Scroll to target card, centering it
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
        <section className="w-full h-auto md:h-full flex flex-col justify-center px-4 sm:px-12 md:px-24 py-4 md:py-0 overflow-visible md:overflow-hidden">
            <div className="max-w-[1920px] mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col items-end gap-2 mb-6 sm:mb-8 w-full text-right">
                    <motion.h2
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-[12vw] md:text-[8vw] leading-[0.8] font-black tracking-tighter text-transparent select-none"
                        style={{ WebkitTextStroke: '2px var(--foreground)' }}
                    >
                        {t.projectsSection.title}
                    </motion.h2>
                    <span className="text-sm font-mono tracking-widest uppercase text-[var(--foreground)] pr-2">
                        // {t.projectsSection.subtitle}
                    </span>
                </div>

                {/* Navigation Arrows (Desktop only) */}
                <div className="hidden md:flex justify-end gap-2 mb-4">
                    <button
                        onClick={() => scrollProjects('left')}
                        className="w-10 h-10 md:w-12 md:h-12 border border-[var(--foreground)]/30 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 active:scale-95"
                        aria-label="Previous project"
                    >
                        <i className="fas fa-chevron-left text-sm md:text-base"></i>
                    </button>
                    <button
                        onClick={() => scrollProjects('right')}
                        className="w-10 h-10 md:w-12 md:h-12 border border-[var(--foreground)]/30 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 active:scale-95"
                        aria-label="Next project"
                    >
                        <i className="fas fa-chevron-right text-sm md:text-base"></i>
                    </button>
                </div>

                {/* Horizontal Scrollable Project Cards - same sizing as Experience (career) cards */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:-mx-0 md:px-0 scroll-smooth items-stretch"
                    style={{ scrollSnapType: 'x mandatory', overscrollBehaviorX: 'contain' }}
                >
                    {t.projects.map((project: any, index: number) => (
                        <motion.div
                            key={index}
                            data-project-card
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="min-w-[280px] sm:min-w-[320px] md:min-w-[380px] lg:min-w-[400px] w-[280px] sm:w-[320px] md:w-[380px] lg:w-[400px] aspect-square border border-[var(--foreground)]/40 bg-[var(--background)] flex-shrink-0 group overflow-hidden hover:border-[var(--accent)] transition-all duration-300 hover:shadow-[0_0_20px_var(--accent)] flex flex-col scroll-snap-align-start"
                        >
                            <div className="relative flex-[0_0_42%] min-h-0 overflow-hidden bg-[var(--background)]">
                                {project.image && (
                                    <Image
                                        src={project.image}
                                        alt={project.name}
                                        fill
                                        className="object-cover opacity-100 md:opacity-70 md:group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale-0 md:grayscale-[20%] md:group-hover:grayscale-0"
                                        unoptimized
                                    />
                                )}
                                <div className="absolute top-3 right-3 font-mono text-xl text-[var(--accent)] opacity-70 font-bold">
                                    {(index + 1).toString().padStart(2, '0')}
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 md:p-6 min-h-0">
                                <div>
                                    <h3 className="text-lg md:text-xl font-black text-[var(--accent)] uppercase tracking-tight mb-2 line-clamp-2">
                                        {project.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {project.tags.slice(0, 3).map((tag: string, i: number) => (
                                            <span key={i} className="text-[10px] font-mono border border-[var(--foreground)] px-2 py-0.5 text-[var(--foreground)]">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-3 flex-shrink-0">
                                    {project.liveSiteLink && (
                                        <a href={project.liveSiteLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors">
                                            <i className="fas fa-external-link-alt"></i> {t.projectsSection.live}
                                        </a>
                                    )}
                                    {project.githubLink && (
                                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors">
                                            <i className="fab fa-github"></i> {t.projectsSection.code}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View Full Portfolio Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-8 text-center"
                >
                    <a
                        href="https://github.com/Andrewfragkiadakis"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub profile"
                        className="inline-flex items-center gap-3 px-8 py-4 border border-[var(--foreground)] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 ease-out font-bold uppercase tracking-widest hover:shadow-[0_0_20px_var(--accent)]"
                    >
                        <i className="fab fa-github text-xl" aria-hidden></i>
                        {t.projectsSection.githubCta}
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
