'use client'

import { useContent } from '@/hooks/useContent'
import { useCardScroll } from '@/hooks/useCardScroll'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import type { Experience as ExperienceType, Education as EducationType } from '@/data/content'

const ONE_CARD_SCROLL_MOBILE = 296

function ScrollButton({ onClick, direction, label }: { onClick: () => void; direction: 'left' | 'right'; label: string }) {
    return (
        <button
            onClick={onClick}
            className="w-11 h-11 md:w-12 md:h-12 border border-[var(--foreground)]/30 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 active:scale-95"
            aria-label={label}
        >
            <i className={`fas fa-chevron-${direction} text-sm md:text-base`} aria-hidden="true" />
        </button>
    )
}

function ExperienceCard({ exp, index }: { exp: ExperienceType; index: number }) {
    return (
        <motion.div
            data-card="true"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] md:min-w-[380px] md:w-[380px] lg:min-w-[400px] lg:w-[400px] aspect-square bg-[var(--background)] border border-[var(--foreground)]/40 flex-shrink-0 p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col justify-between hover:border-[var(--accent)] transition-all duration-300 md:hover:shadow-[0_0_20px_var(--accent)] group scroll-snap-align-start relative"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl font-black text-[var(--foreground)] z-0">
                {(index + 1).toString().padStart(2, '0')}
            </div>
            <div className="z-10 relative flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <span className="w-12 h-12 flex items-center justify-center border border-[var(--accent)]/30 text-[var(--accent)] rounded-lg md:group-hover:bg-[var(--accent)] md:group-hover:text-[var(--background)] transition-colors">
                        <i className="fas fa-briefcase text-lg" aria-hidden="true" />
                    </span>
                    <span className="text-[10px] font-mono text-[var(--foreground)] opacity-80 uppercase tracking-widest">
                        {exp.duration}
                    </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[var(--foreground)] uppercase leading-tight mb-2 md:group-hover:text-[var(--accent)] transition-colors">
                    {exp.role}
                </h3>
                <p className="text-xs font-mono text-[var(--foreground)] opacity-85 mb-4">
                    @ {exp.company}
                </p>
                <ul className="space-y-2 flex-1 overflow-y-auto">
                    {exp.tasks.map((task, ti) => (
                        <li key={ti} className="text-xs text-[var(--foreground)] opacity-80 flex items-start gap-2">
                            <span className="text-[var(--accent)] mt-1 text-[6px] shrink-0">
                                <i className="fas fa-square" aria-hidden="true" />
                            </span>
                            <span className="leading-tight">{task}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    )
}

function EducationCard({ edu, index, verifyLabel }: { edu: EducationType; index: number; verifyLabel: string }) {
    return (
        <motion.div
            data-card="true"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] md:min-w-[380px] md:w-[380px] lg:min-w-[400px] lg:w-[400px] aspect-square bg-[var(--background)] border border-[var(--foreground)]/20 flex-shrink-0 p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col justify-between hover:border-[var(--accent)] transition-all duration-300 group scroll-snap-align-start"
        >
            <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <span className="w-12 h-12 flex items-center justify-center border border-[var(--foreground)]/30 text-[var(--foreground)] rounded-lg md:group-hover:bg-[var(--accent)] md:group-hover:text-[var(--background)] md:group-hover:border-[var(--accent)] transition-colors">
                        <i className="fas fa-graduation-cap text-lg" aria-hidden="true" />
                    </span>
                    <span className="text-[10px] font-mono text-[var(--foreground)] opacity-80 uppercase tracking-widest">
                        {edu.duration}
                    </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[var(--foreground)] uppercase leading-tight mb-2 md:group-hover:text-[var(--accent)] transition-colors">
                    {edu.degree}
                </h3>
                <p className="text-xs font-mono text-[var(--foreground)] opacity-85 mb-4">
                    {edu.institution}
                </p>
                {edu.details && (
                    <div className="space-y-2 mb-4 flex-1 overflow-y-auto">
                        {edu.details.map((detail, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-[var(--foreground)] opacity-80">
                                <i className="fas fa-check text-[var(--accent)] text-[10px] mt-0.5" aria-hidden="true" />
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
                    <i className="fas fa-certificate" aria-hidden="true" />
                    {verifyLabel}
                </a>
            )}
        </motion.div>
    )
}

export default function Experience() {
    const t = useContent()
    const { scrollContainerRef, scroll } = useCardScroll('[data-card="true"]')
    const expMobileRef = useRef<HTMLDivElement>(null)
    const eduMobileRef = useRef<HTMLDivElement>(null)

    const scrollMobileRow = (containerRef: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
        const el = containerRef.current
        if (!el) return
        const maxScroll = el.scrollWidth - el.clientWidth
        if (maxScroll <= 0) return
        if (direction === 'right' && el.scrollLeft >= maxScroll - 1) return
        if (direction === 'left' && el.scrollLeft <= 1) return
        const amount = direction === 'right' ? ONE_CARD_SCROLL_MOBILE : -ONE_CARD_SCROLL_MOBILE
        el.scrollTo({ left: Math.max(0, Math.min(el.scrollLeft + amount, maxScroll)), behavior: 'smooth' })
    }

    return (
        <section className="w-full h-auto md:h-screen md:max-h-[1080px] flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-24 py-4 md:py-0 overflow-x-clip overflow-y-visible md:overflow-hidden relative">
            <div className="max-w-[1920px] mx-auto w-full h-full flex flex-col justify-center">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-8 md:mb-12 gap-4 md:gap-6">
                    <div id="experience" className="flex flex-col items-start gap-2">
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
                    <div className="hidden md:flex gap-2">
                        <ScrollButton onClick={() => scroll('left')} direction="left" label="Scroll left" />
                        <ScrollButton onClick={() => scroll('right')} direction="right" label="Scroll right" />
                    </div>
                </div>

                <div className="flex flex-col gap-8 md:hidden">
                    <div>
                        <div className="flex items-center justify-between gap-2 mb-3 pl-1">
                            <span className="text-[10px] font-mono text-[var(--foreground)] opacity-80 uppercase tracking-widest">
                                {t.experienceSection.professional}
                            </span>
                            <div className="flex gap-2">
                                <ScrollButton onClick={() => scrollMobileRow(expMobileRef, 'left')} direction="left" label="Previous experience" />
                                <ScrollButton onClick={() => scrollMobileRow(expMobileRef, 'right')} direction="right" label="Next experience" />
                            </div>
                        </div>
                        <div
                            ref={expMobileRef}
                            className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 scroll-smooth items-stretch"
                            style={{ scrollSnapType: 'x mandatory', overscrollBehaviorX: 'contain' }}
                        >
                            {t.experience.map((exp, idx) => (
                                <ExperienceCard key={`exp-m-${idx}`} exp={exp} index={idx} />
                            ))}
                            <div className="w-4 flex-shrink-0" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between gap-2 mb-3 pl-1">
                            <span className="text-[10px] font-mono text-[var(--foreground)] opacity-80 uppercase tracking-widest">
                                {t.experienceSection.education}
                            </span>
                            <div className="flex gap-2">
                                <ScrollButton onClick={() => scrollMobileRow(eduMobileRef, 'left')} direction="left" label="Previous education" />
                                <ScrollButton onClick={() => scrollMobileRow(eduMobileRef, 'right')} direction="right" label="Next education" />
                            </div>
                        </div>
                        <div
                            ref={eduMobileRef}
                            className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 scroll-smooth items-stretch"
                            style={{ scrollSnapType: 'x mandatory', overscrollBehaviorX: 'contain' }}
                        >
                            {t.education.map((edu, idx) => (
                                <EducationCard key={`edu-m-${idx}`} edu={edu} index={idx} verifyLabel={t.experienceSection.verify} />
                            ))}
                            <div className="w-4 flex-shrink-0" />
                        </div>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="hidden md:flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-4 md:pb-8 -mx-4 px-4 scroll-smooth items-stretch"
                    style={{ scrollSnapType: 'x mandatory', overscrollBehaviorX: 'contain' }}
                    onScroll={(e) => e.stopPropagation()}
                >
                    <div className="hidden md:flex flex-shrink-0 items-center justify-center w-[50px] border-r border-[var(--foreground)]/10 mr-2 md:mr-4">
                        <span className="text-[var(--foreground)] opacity-50 [writing-mode:vertical-rl] rotate-180 uppercase tracking-[0.3em] font-black text-xs md:text-sm">
                            {t.experienceSection.professional}
                        </span>
                    </div>
                    {t.experience.map((exp, idx) => (
                        <ExperienceCard key={`exp-${idx}`} exp={exp} index={idx} />
                    ))}
                    <div className="hidden md:block w-[1px] bg-[var(--foreground)]/20 mx-2 md:mx-4 flex-shrink-0" />
                    <div className="hidden md:flex flex-shrink-0 items-center justify-center w-[50px] border-r border-[var(--foreground)]/10 mr-2 md:mr-4">
                        <span className="text-[var(--foreground)] opacity-50 [writing-mode:vertical-rl] rotate-180 uppercase tracking-[0.3em] font-black text-xs md:text-sm">
                            {t.experienceSection.education}
                        </span>
                    </div>
                    {t.education.map((edu, idx) => (
                        <EducationCard key={`edu-${idx}`} edu={edu} index={idx} verifyLabel={t.experienceSection.verify} />
                    ))}
                    <div className="w-4 md:w-12 flex-shrink-0" />
                </div>
            </div>
        </section>
    )
}
