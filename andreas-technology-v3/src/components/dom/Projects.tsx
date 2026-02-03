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
        if (scrollContainerRef.current) {
            const scrollAmount = 420 // Card width + gap
            scrollContainerRef.current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    return (
        <section className="w-full h-auto md:h-full flex flex-col justify-center px-4 sm:px-12 md:px-24 py-7 md:py-0 overflow-visible md:overflow-hidden">
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

                {/* Navigation Arrows */}
                <div className="flex justify-end gap-2 mb-4">
                    <button
                        onClick={() => scrollProjects('left')}
                        className="w-10 h-10 border border-[var(--foreground)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300"
                        aria-label="Previous project"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <button
                        onClick={() => scrollProjects('right')}
                        className="w-10 h-10 border border-[var(--foreground)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300"
                        aria-label="Next project"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>

                {/* Horizontal Scrollable Project Cards */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 scroll-smooth"
                >
                    {t.projects.map((project: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="min-w-[320px] md:min-w-[400px] border border-[var(--foreground)] bg-[var(--background)] flex-shrink-0 group overflow-hidden hover:border-[var(--accent)] transition-colors"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                {project.image && (
                                    <Image
                                        src={project.image}
                                        alt={project.name}
                                        fill
                                        className="object-cover opacity-100 md:opacity-70 md:group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale-0 md:grayscale-[20%] md:group-hover:grayscale-0"
                                        unoptimized
                                    />
                                )}
                                <div className="absolute top-4 right-4 font-mono text-2xl text-[var(--accent)] opacity-50 font-bold">
                                    {(index + 1).toString().padStart(2, '0')}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-black text-[var(--accent)] uppercase tracking-tight mb-2">
                                    {project.name}
                                </h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tags.slice(0, 3).map((tag: string, i: number) => (
                                        <span key={i} className="text-[10px] font-mono border border-[var(--foreground)] px-2 py-1 text-[var(--foreground)]">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-4">
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
                        className="inline-flex items-center gap-3 px-8 py-4 border border-[var(--foreground)] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 font-bold uppercase tracking-widest hover:shadow-[0_0_20px_var(--accent)]"
                    >
                        <i className="fab fa-github text-xl"></i>
                        {t.projectsSection.githubCta}
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
