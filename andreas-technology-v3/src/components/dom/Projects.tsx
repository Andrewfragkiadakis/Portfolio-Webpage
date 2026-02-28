'use client'

import { useContent } from '@/hooks/useContent'
import { useCardScroll } from '@/hooks/useCardScroll'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Project } from '@/data/content'

export default function Projects() {
    const t = useContent()
    const { scrollContainerRef, scroll: scrollProjects } = useCardScroll('[data-project-card]')

    return (
        <section className="w-full h-auto md:h-full flex flex-col justify-center px-4 sm:px-12 md:px-24 py-4 md:py-0 overflow-visible md:overflow-hidden">
            <div className="max-w-[1920px] mx-auto w-full md:max-h-none md:overflow-visible">
                <div id="projects" className="flex flex-col items-end gap-2 mb-6 sm:mb-8 w-full text-right">
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

                <div className="flex justify-end gap-2 mb-4">
                    <button
                        onClick={() => scrollProjects('left')}
                        className="w-11 h-11 md:w-12 md:h-12 border border-[var(--foreground)]/30 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 active:scale-95"
                        aria-label="Previous project"
                    >
                        <i className="fas fa-chevron-left text-sm md:text-base" aria-hidden="true" />
                    </button>
                    <button
                        onClick={() => scrollProjects('right')}
                        className="w-11 h-11 md:w-12 md:h-12 border border-[var(--foreground)]/30 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 active:scale-95"
                        aria-label="Next project"
                    >
                        <i className="fas fa-chevron-right text-sm md:text-base" aria-hidden="true" />
                    </button>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:-mx-0 md:px-0 scroll-smooth items-stretch"
                    style={{ scrollSnapType: 'x mandatory', overscrollBehaviorX: 'contain' }}
                >
                    {t.projects.map((project: Project, index: number) => (
                        <motion.div
                            key={index}
                            data-project-card
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="min-w-[280px] sm:min-w-[320px] md:min-w-[380px] lg:min-w-[400px] w-[280px] sm:w-[320px] md:w-[380px] lg:w-[400px] border border-[var(--foreground)]/40 bg-[var(--background)] flex-shrink-0 group overflow-hidden hover:border-[var(--accent)] transition-all duration-300 hover:shadow-[0_0_20px_var(--accent)] flex flex-col scroll-snap-align-start"
                        >
                            {/* Image — fixed pixel height so card height is content-driven, not circular */}
                            <div className="relative h-[160px] sm:h-[180px] md:h-[200px] flex-shrink-0 overflow-hidden bg-[var(--background)]">
                                {project.image && (
                                    <Image
                                        src={project.image}
                                        alt={project.name}
                                        fill
                                        sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 380px, 400px"
                                        className="object-cover opacity-100 md:opacity-70 md:group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale-0 md:grayscale-[20%] md:group-hover:grayscale-0"
                                    />
                                )}
                                <div className="absolute top-3 right-3 font-mono text-xl text-[var(--accent)] opacity-70 font-bold">
                                    {(index + 1).toString().padStart(2, '0')}
                                </div>
                            </div>

                            {/* Content — flex-col with mt-auto on buttons always pins them to the bottom */}
                            <div className="flex-1 flex flex-col p-4 sm:p-5 md:p-6">
                                <h3 className="text-lg md:text-xl font-black text-[var(--accent)] uppercase tracking-tight mb-2 line-clamp-2">
                                    {project.name}
                                </h3>
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {project.tags.slice(0, 3).map((tag, i) => (
                                        <span key={i} className="text-[10px] font-mono border border-[var(--foreground)] px-2 py-0.5 text-[var(--foreground)]">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs text-[var(--foreground)] opacity-70 leading-relaxed md:line-clamp-3 mb-3">
                                    {project.description}
                                </p>
                                <div className="flex gap-3 mt-auto pt-2 border-t border-[var(--foreground)]/10">
                                    {project.liveSiteLink && (
                                        <a href={project.liveSiteLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors">
                                            <i className="fas fa-external-link-alt" aria-hidden="true" /> {t.projectsSection.live}
                                        </a>
                                    )}
                                    {project.githubLink && (
                                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors">
                                            <i className="fab fa-github" aria-hidden="true" /> {t.projectsSection.code}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

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
                        <i className="fab fa-github text-xl" aria-hidden="true" />
                        {t.projectsSection.githubCta}
                    </a>
                </motion.div>
            </div>
        </section>
    )
}
