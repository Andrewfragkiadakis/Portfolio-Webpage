'use client'

import { useContent } from '@/hooks/useContent'
import { useCardScroll } from '@/hooks/useCardScroll'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import type { Project } from '@/data/content'
import { flushSync } from 'react-dom'
import Modal from '@/components/ui/Modal'
import ProjectsBento from '@/components/dom/ProjectsBento'
import ScrambleText from '@/components/ui/ScrambleText'
import { useIsDesktop } from '@/hooks/useIsDesktop'
import { startViewTransition } from '@/utils/view-transition'

export default function Projects() {
    const t = useContent()
    const [activeProject, setActiveProject] = useState<Project | null>(null)
    const isDesktop = useIsDesktop()
    const { scrollContainerRef, scroll: scrollProjects, canScrollLeft, canScrollRight } = useCardScroll('[data-project-card]')

    /**
     * The tapped card's media and the dialog's media share `view-transition-name`, so the
     * browser morphs one into the other instead of cross-fading two unrelated rectangles.
     *
     * Two things make this correct rather than merely pretty:
     * - `flushSync` forces React to commit inside the transition callback. Without it the
     *   DOM is still the old one when the browser takes its "after" snapshot.
     * - The name is removed from the card in the same commit. A duplicate name in a single
     *   frame makes the browser skip the whole transition.
     */
    const openProject = (project: Project, trigger: HTMLElement) => {
        const media = trigger.closest('[data-project-card]')?.querySelector<HTMLElement>('[data-project-media]')
        media?.style.setProperty('view-transition-name', 'project-media')

        startViewTransition(() => {
            media?.style.removeProperty('view-transition-name')
            flushSync(() => setActiveProject(project))
        })
    }

    const closeProject = () => {
        startViewTransition(() => {
            flushSync(() => setActiveProject(null))
        })
    }
    const arrowClass = "w-11 h-11 md:w-12 md:h-12 border border-[var(--foreground)]/30 flex items-center justify-center text-[var(--foreground)] transition-all duration-300 cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[var(--foreground)] disabled:active:scale-100"

    return (
        <section className="w-full h-auto md:h-full flex flex-col justify-center px-4 sm:px-12 md:px-24 py-4 md:py-0 overflow-x-clip overflow-y-visible md:overflow-x-hidden md:overflow-y-auto no-scrollbar">
            <div className="max-w-[1920px] mx-auto w-full max-h-[calc(100vh-8rem)] md:max-h-none overflow-y-auto md:overflow-visible">
                <div id="projects" className="flex flex-col items-end gap-2 mb-6 sm:mb-8 w-full text-right">
                    <motion.h2
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-[12vw] md:text-[min(8vw,9vh)] leading-[0.8] font-black tracking-tighter text-transparent select-none"
                        style={{ WebkitTextStroke: '2px var(--foreground)' }}
                    >
                        <ScrambleText text={t.projectsSection.title} />
                    </motion.h2>
                    <span className="text-sm font-mono tracking-widest uppercase text-[var(--foreground)] pr-2">
                        {`// ${t.projectsSection.subtitle}`}
                    </span>
                </div>

                {/*
                  One layout tree at a time. `isDesktop` is null until mounted, so neither
                  branch renders during SSR and the two never coexist in the DOM.
                */}
                {isDesktop === false && (
                    <ProjectsBento projects={t.projects} labels={t.projectsSection} />
                )}

                {isDesktop === true && (
                <>
                <div className="flex justify-end gap-2 mb-4">
                    <button
                        onClick={() => scrollProjects('left')}
                        disabled={!canScrollLeft}
                        className={arrowClass}
                        aria-label="Previous project"
                    >
                        <i className="fas fa-chevron-left text-sm md:text-base" aria-hidden="true" />
                    </button>
                    <button
                        onClick={() => scrollProjects('right')}
                        disabled={!canScrollRight}
                        className={arrowClass}
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
                            <div data-project-media className="relative h-[160px] sm:h-[180px] md:h-[200px] flex-shrink-0 overflow-hidden bg-[var(--background)]">
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
                                <div className="flex flex-wrap items-center gap-3 mt-auto pt-2 border-t border-[var(--foreground)]/10">
                                    {project.liveSiteLink && (
                                        <a href={project.liveSiteLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                                            <i className="fas fa-external-link-alt" aria-hidden="true" /> {t.projectsSection.live}
                                        </a>
                                    )}
                                    {project.githubLink && (
                                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                                            <i className="fab fa-github" aria-hidden="true" /> {t.projectsSection.code}
                                        </a>
                                    )}
                                    {project.detail && (
                                        <button
                                            type="button"
                                            onClick={(event) => openProject(project, event.currentTarget)}
                                            aria-label={`${project.name} — ${t.projectsSection.details}`}
                                            className="ml-auto text-xs font-bold uppercase tracking-wider text-[var(--accent)] hover:text-[var(--foreground)] flex items-center gap-1 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                                        >
                                            {t.projectsSection.details} <i className="fas fa-arrow-right" aria-hidden="true" />
                                        </button>
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
                </>
                )}
            </div>

            <Modal
                open={Boolean(activeProject)}
                onClose={closeProject}
                labelledBy="project-modal-title"
                closeLabel={t.projectsSection.close}
                className="max-w-2xl w-full"
            >
                {activeProject && (
                    <>
                        {activeProject.image && (
                            <div
                                className="relative h-[200px] sm:h-[240px] w-full overflow-hidden bg-[var(--background)]"
                                style={{ viewTransitionName: 'project-media' } as React.CSSProperties}
                            >
                                <Image
                                    src={activeProject.image}
                                    alt=""
                                    fill
                                    sizes="(max-width: 768px) 100vw, 672px"
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div className="p-6 sm:p-8">
                            <div className="flex items-baseline justify-between gap-4 mb-3">
                                <h3 id="project-modal-title" className="text-xl sm:text-2xl font-black text-[var(--accent)] uppercase tracking-tight">
                                    {activeProject.name}
                                </h3>
                                {activeProject.year && (
                                    <span className="font-mono text-sm text-[var(--foreground)] opacity-60 shrink-0">
                                        {activeProject.year}
                                    </span>
                                )}
                            </div>

                            {activeProject.role && (
                                <p className="text-xs font-mono uppercase tracking-widest text-[var(--foreground)] opacity-70 mb-5">
                                    {t.projectsSection.roleLabel}: {activeProject.role}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-1.5 mb-5">
                                {activeProject.tags.map((tag, i) => (
                                    <span key={i} className="text-[10px] font-mono border border-[var(--foreground)]/40 px-2 py-0.5 text-[var(--foreground)]">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <p className="text-sm text-[var(--foreground)] opacity-85 leading-relaxed mb-6">
                                {activeProject.detail}
                            </p>

                            {activeProject.highlights && activeProject.highlights.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
                                        {t.projectsSection.highlightsLabel}
                                    </h4>
                                    <ul className="space-y-2">
                                        {activeProject.highlights.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--foreground)] opacity-85">
                                                <i className="fas fa-check text-[var(--accent)] text-[11px] mt-1 shrink-0" aria-hidden="true" />
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--foreground)]/15">
                                {activeProject.liveSiteLink && (
                                    <a href={activeProject.liveSiteLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-[var(--background)] text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_20px_var(--glow)] transition-all">
                                        <i className="fas fa-external-link-alt" aria-hidden="true" /> {t.projectsSection.live}
                                    </a>
                                )}
                                {activeProject.githubLink && (
                                    <a href={activeProject.githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 border border-[var(--foreground)] text-[var(--foreground)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all">
                                        <i className="fab fa-github" aria-hidden="true" /> {t.projectsSection.code}
                                    </a>
                                )}
                                {activeProject.reportLink && (
                                    <a href={activeProject.reportLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 border border-[var(--foreground)] text-[var(--foreground)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all">
                                        <i className="fas fa-file-lines" aria-hidden="true" /> {t.projectsSection.report}
                                    </a>
                                )}
                                {activeProject.publicationLink && (
                                    <a href={activeProject.publicationLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 border border-[var(--foreground)] text-[var(--foreground)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all">
                                        <i className="fas fa-book-open" aria-hidden="true" /> {t.projectsSection.publication}
                                    </a>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </Modal>
        </section>
    )
}
