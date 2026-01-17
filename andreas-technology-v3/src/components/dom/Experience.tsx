'use client'
import { useContent } from '@/hooks/useContent'
import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'

export default function Experience() {
    const t = useContent()
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Reset scroll on mount
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 0
        }
    }, [])

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400 // Approx card width
            scrollContainerRef.current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    return (
        <section className="w-full h-screen max-h-[1080px] flex flex-col justify-center px-4 sm:px-12 md:px-24 overflow-hidden relative">
            <div className="max-w-[1920px] mx-auto w-full h-full flex flex-col justify-center">

                {/* --- HEADER & CONTROLS --- */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-6">
                    <div className="flex flex-col items-start gap-2">
                        <motion.h2
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-[12vw] md:text-[8vw] lg:text-[6vw] leading-[0.8] font-black tracking-tighter text-transparent select-none uppercase"
                            style={{ WebkitTextStroke: '1px var(--foreground)' }}
                        >
                            {t.experienceSection.title}
                        </motion.h2>
                        <span className="text-xs font-mono tracking-widest uppercase text-[var(--foreground)] opacity-60 pl-2">
                            // {t.experienceSection.subtitle}
                        </span>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="w-12 h-12 border border-[var(--foreground)]/30 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 active:scale-95"
                            aria-label="Scroll left"
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-12 h-12 border border-[var(--foreground)]/30 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 active:scale-95"
                            aria-label="Scroll right"
                        >
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>

                {/* --- HORIZONTAL SCROLL RAIL --- */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto no-scrollbar pb-8 px-1 scroll-smooth items-stretch"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {/* 1. PROFESSIONAL CARDS */}
                    <div className="flex-shrink-0 flex items-center justify-center w-[50px] border-r border-[var(--foreground)]/10 mr-4">
                        <span className="text-[var(--foreground)] opacity-20 [writing-mode:vertical-rl] rotate-180 uppercase tracking-[0.3em] font-black text-xs md:text-sm">
                            {t.experienceSection.professional}
                        </span>
                    </div>

                    {t.experience.map((exp: any, idx: number) => (
                        <motion.div
                            key={`exp-${idx}`}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="min-w-[320px] md:min-w-[400px] lg:min-w-[450px] bg-[var(--background)] border border-[var(--foreground)]/40 flex-shrink-0 p-6 md:p-8 flex flex-col justify-between hover:border-[var(--accent)] transition-all duration-300 hover:shadow-[0_0_20px_var(--accent)] group scroll-snap-align-start relative"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl font-black text-[var(--foreground)] z-0">
                                {(idx + 1).toString().padStart(2, '0')}
                            </div>

                            <div className="z-10 relative">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="w-10 h-10 flex items-center justify-center border border-[var(--accent)]/30 text-[var(--accent)] rounded-sm group-hover:bg-[var(--accent)] group-hover:text-[var(--background)] transition-colors">
                                        <i className="fas fa-briefcase"></i>
                                    </span>
                                    <span className="text-xs font-mono text-[var(--accent)] uppercase tracking-widest border border-[var(--accent)]/30 px-2 py-1">
                                        {exp.duration}
                                    </span>
                                </div>

                                <h3 className="text-xl md:text-2xl font-bold text-[var(--foreground)] uppercase leading-tight mb-2 group-hover:text-[var(--accent)] transition-colors">
                                    {exp.role}
                                </h3>
                                <p className="text-sm font-mono text-[var(--foreground)] opacity-60 mb-6">
                                    @ {exp.company}
                                </p>

                                <ul className="space-y-3">
                                    {exp.tasks.map((task: string, ti: number) => (
                                        <li key={ti} className="text-sm text-[var(--foreground)] opacity-80 flex items-start gap-3">
                                            <span className="text-[var(--accent)] mt-1.5 text-[8px] shrink-0">
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
                    <div className="w-[1px] bg-[var(--foreground)]/20 mx-4 flex-shrink-0" />

                    {/* 2. ACADEMIC CARDS */}
                    <div className="flex-shrink-0 flex items-center justify-center w-[50px] border-r border-[var(--foreground)]/10 mr-4">
                        <span className="text-[var(--foreground)] opacity-20 [writing-mode:vertical-rl] rotate-180 uppercase tracking-[0.3em] font-black text-xs md:text-sm">
                            {t.experienceSection.education}
                        </span>
                    </div>

                    {t.education.map((edu: any, idx: number) => (
                        <motion.div
                            key={`edu-${idx}`}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="min-w-[320px] md:min-w-[380px] bg-[var(--background)] border border-[var(--foreground)]/20 flex-shrink-0 p-6 md:p-8 flex flex-col justify-between hover:border-[var(--accent)] transition-all duration-300 group scroll-snap-align-start"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <span className="w-10 h-10 flex items-center justify-center border border-[var(--foreground)]/30 text-[var(--foreground)] rounded-sm group-hover:bg-[var(--accent)] group-hover:text-[var(--background)] group-hover:border-[var(--accent)] transition-colors">
                                        <i className="fas fa-graduation-cap"></i>
                                    </span>
                                    <span className="text-[10px] font-mono text-[var(--foreground)] opacity-50 uppercase tracking-widest">
                                        {edu.duration}
                                    </span>
                                </div>

                                <h3 className="text-lg md:text-xl font-bold text-[var(--foreground)] uppercase leading-tight mb-1 group-hover:text-[var(--accent)] transition-colors">
                                    {edu.degree}
                                </h3>
                                <p className="text-xs font-mono text-[var(--foreground)] opacity-60 mb-6">
                                    {edu.institution}
                                </p>

                                {edu.details && (
                                    <div className="space-y-2 mb-6">
                                        {edu.details.map((detail: string, i: number) => (
                                            <div key={i} className="flex items-start gap-2 text-xs text-[var(--foreground)] opacity-70">
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
                                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-[var(--foreground)] px-4 py-3 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all justify-center w-full"
                                >
                                    <i className="fas fa-certificate"></i>
                                    {t.experienceSection.verify}
                                </a>
                            )}
                        </motion.div>
                    ))}

                    {/* Padding for end of scroll */}
                    <div className="w-12 flex-shrink-0" />
                </div>
            </div>
        </section>
    )
}