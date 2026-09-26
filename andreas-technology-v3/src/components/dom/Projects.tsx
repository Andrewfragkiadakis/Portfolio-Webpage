'use client'

import { useContent } from '@/hooks/useContent'
import { useCardScroll } from '@/hooks/useCardScroll'
import Image from 'next/image'
import { motion, type Variants } from 'motion/react'
import { useState } from 'react'
import type { Project } from '@/data/content'
import Modal from '@/components/ui/Modal'
import RollText from '@/components/ui/RollText'
import ScrollRail from '@/components/ui/ScrollRail'
import { EASE_OUT } from '@/utils/motion'
import SectionHeading from '@/components/ui/SectionHeading'

/** Stagger only the first screenful; cards scrolled into view later reveal at once. */
const staggerDelay = (index: number) => Math.min(index, 3) * 0.08

const CARD_RISE: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (index: number) => ({ opacity: 1, y: 0, transition: { delay: staggerDelay(index), duration: 0.7, ease: EASE_OUT } }),
}

const IMAGE_WIPE: Variants = {
    hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
    visible: (index: number) => ({ clipPath: 'inset(0% 0% 0% 0%)', transition: { delay: 0.15 + staggerDelay(index), duration: 1.1, ease: EASE_OUT } }),
}

export default function Projects() {
    const t = useContent()
    const [activeProject, setActiveProject] = useState<Project | null>(null)
    const { scrollContainerRef, scroll: scrollProjects, canScrollLeft, canScrollRight, progress, ratio } = useCardScroll('[data-project-card]')
    const arrowClass = "w-11 h-11 md:w-12 md:h-12 border border-[var(--foreground)]/30 flex items-center justify-center text-[var(--foreground)] transition-all duration-300 cursor-pointer hover:bg-[var(--foreground)] hover:text-[var(--background)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[var(--foreground)] disabled:active:scale-100"

    return (
        <section className="w-full h-auto md:h-full flex flex-col justify-center px-4 sm:px-12 md:px-24 py-4 md:py-0 overflow-x-clip overflow-y-visible md:overflow-x-hidden md:overflow-y-auto no-scrollbar">
            <div className="max-w-[1920px] mx-auto w-full max-h-[calc(100vh-8rem)] md:max-h-none overflow-y-auto md:overflow-visible">
                <SectionHeading id="projects" title={t.projectsSection.title} subtitle={t.projectsSection.subtitle} align="end" className="mb-6 sm:mb-8" />

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
                    {t.projects.map((project: Project, index: number) => {
                        const openDetail = project.detail ? () => setActiveProject(project) : undefined
                        const statuses = [
                            project.liveSiteLink && { label: 'LIVE', accent: true },
                            project.githubLink && { label: 'OSS', accent: false },
                            (project.reportLink || project.publicationLink) && { label: 'PAPER', accent: false },
                        ].filter(Boolean) as { label: string; accent: boolean }[]

                        const media = (
                            <>
                                {project.image && (
                                    // Wipe the image in from the bottom as the card scrolls into view.
                                    // Driven by the card's in-view state: an element clipped to nothing
                                    // never registers as intersecting, so it can't trigger itself.
                                    <motion.span
                                        className="absolute inset-0 block"
                                        variants={IMAGE_WIPE}
                                        custom={index}
                                    >
                                        <Image
                                            src={project.image}
                                            alt={project.name}
                                            fill
                                            sizes="(max-width: 640px) 300px, (max-width: 1024px) 360px, 440px"
                                            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                                        />
                                    </motion.span>
                                )}
                                <span className="absolute top-3 left-3 z-10 font-mono text-[11px] font-bold px-2 py-1 bg-[var(--background)]/85 backdrop-blur text-[var(--foreground)] border border-[var(--foreground)]/15">
                                    {(index + 1).toString().padStart(2, '0')}
                                </span>
                                {/* Hover caption, Awwwards-style: rises from the bottom edge. Always shown on touch. */}
                                <span className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-4 pt-16 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
                                    <span className="min-w-0 text-left">
                                        <span className="block text-[10px] font-mono uppercase tracking-[0.2em] opacity-75">{t.projectsSection.caseStudy}</span>
                                        <span className="block text-sm font-semibold truncate">{project.name}</span>
                                    </span>
                                    <i className="fas fa-arrow-right text-sm shrink-0 -rotate-45 transition-transform duration-500 group-hover:rotate-0" aria-hidden="true" />
                                </span>
                            </>
                        )

                        return (
                            <motion.article
                                key={project.name}
                                data-project-card
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={CARD_RISE}
                                custom={index}
                                className="w-[300px] sm:w-[340px] md:w-[400px] lg:w-[440px] flex-shrink-0 group flex flex-col scroll-snap-align-start"
                            >
                                {openDetail ? (
                                    <button
                                        type="button"
                                        onClick={openDetail}
                                        aria-label={`${project.name} — ${t.projectsSection.details}`}
                                        data-cursor={t.cursor.view}
                                        className="relative block w-full aspect-[4/3] overflow-hidden bg-[var(--foreground)]/5 border border-[var(--foreground)]/15 transition-[border-color,box-shadow] duration-500 hover:border-[var(--accent)] hover:shadow-[0_20px_60px_-20px_var(--glow)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                                    >
                                        {media}
                                    </button>
                                ) : (
                                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-[var(--foreground)]/5 border border-[var(--foreground)]/15">
                                        {media}
                                    </div>
                                )}

                                <div className="flex items-start justify-between gap-3 pt-4">
                                    <h3 className="text-base md:text-lg font-bold text-[var(--foreground)] leading-tight line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                                        {project.name}
                                        {project.year && (
                                            <sup className="ml-1 text-[9px] font-mono font-bold tracking-wider opacity-60 align-super">{project.year}</sup>
                                        )}
                                    </h3>
                                    {statuses.length > 0 && (
                                        <div className="flex gap-1.5 shrink-0 pt-0.5">
                                            {statuses.map((st) => (
                                                <span
                                                    key={st.label}
                                                    className={`text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 border ${st.accent ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--foreground)]/30 text-[var(--foreground)] opacity-75'}`}
                                                >
                                                    {st.label}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <p className="text-xs text-[var(--foreground)] opacity-70 leading-relaxed line-clamp-2 mt-2">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                                    <span className="text-[10px] font-mono text-[var(--foreground)] opacity-60 truncate">
                                        {project.tags.slice(0, 3).join(' · ')}
                                    </span>
                                    <span className="ml-auto flex items-center gap-3">
                                        {project.liveSiteLink && (
                                            <a href={project.liveSiteLink} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} — ${t.projectsSection.live}`} className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors">
                                                <i className="fas fa-external-link-alt" aria-hidden="true" /> <span className="link-underline">{t.projectsSection.live}</span>
                                            </a>
                                        )}
                                        {project.githubLink && (
                                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} — ${t.projectsSection.code}`} className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors">
                                                <i className="fab fa-github" aria-hidden="true" /> <span className="link-underline">{t.projectsSection.code}</span>
                                            </a>
                                        )}
                                    </span>
                                </div>
                            </motion.article>
                        )
                    })}
                </div>
                <ScrollRail progress={progress} ratio={ratio} className="mt-1" />

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
                        <RollText>{t.projectsSection.githubCta}</RollText>
                    </a>
                </motion.div>
            </div>

            <Modal
                open={Boolean(activeProject)}
                onClose={() => setActiveProject(null)}
                labelledBy="project-modal-title"
                closeLabel={t.projectsSection.close}
                className="max-w-2xl w-full"
            >
                {activeProject && (
                    <>
                        {activeProject.image && (
                            <div className="relative h-[200px] sm:h-[240px] w-full overflow-hidden bg-[var(--background)]">
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
