'use client'

import { useContent } from '@/hooks/useContent'
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import type { Project } from '@/data/content'
import Modal from '@/components/ui/Modal'
import ProjectImage from '@/components/ui/ProjectImage'
import SectionHeading from '@/components/ui/SectionHeading'
import { EASE_OUT } from '@/utils/motion'

const pad = (n: number) => String(n).padStart(2, '0')

const COLS = 'grid-cols-[4.75rem_1fr] md:grid-cols-[2.5rem_minmax(0,1.35fr)_minmax(0,1fr)_3rem_6.5rem]'

const LINK = 'arrow-link inline-flex items-center gap-1 text-caption font-semibold uppercase tracking-[0.05em] hover:text-[var(--accent-ink)] transition-colors'

function RowLinks({ project, t }: { project: Project; t: ReturnType<typeof useContent> }) {
    return (
        <>
            {project.liveSiteLink && (
                <a href={project.liveSiteLink} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} — ${t.projectsSection.live}`} className={LINK}>
                    <span className="link-underline">{t.projectsSection.live}</span>
                    <span className="arrow arrow-ne" aria-hidden="true">↗</span>
                </a>
            )}
            {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} — ${t.projectsSection.code}`} className={LINK}>
                    <span className="link-underline">{t.projectsSection.code}</span>
                    <span className="arrow arrow-ne" aria-hidden="true">↗</span>
                </a>
            )}
        </>
    )
}

export default function Projects() {
    const t = useContent()
    const [activeProject, setActiveProject] = useState<Project | null>(null)
    const [previewIndex, setPreviewIndex] = useState(0)
    const preview = t.projects[previewIndex] ?? t.projects[0]
    const tbl = t.editorial.table

    return (
        <section className="w-full md:h-full flex flex-col px-4 md:px-10 pt-16 pb-14 md:pt-5 md:pb-6">
            <SectionHeading id="projects" index={4} label={t.nav.projects} title={t.editorial.sections.projects} subtitle={t.projectsSection.subtitle} />

            <div className="flex-1 min-h-8 md:min-h-4" />

            <div className="grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6">
                {/* Index table */}
                <div className="col-span-4 md:col-span-8">
                    <div className="flex items-baseline justify-between rule-t-strong pt-2.5 pb-3">
                        <span className="text-base font-medium tracking-[-0.01em]">{t.projectsTitle.charAt(0) + t.projectsTitle.slice(1).toLowerCase()}</span>
                        <span className="meta tabular">{pad(t.projects.length)}</span>
                    </div>
                    <div className={`hidden md:grid ${COLS} gap-x-3 rule-b pb-1.5 meta`} aria-hidden="true">
                        <span>{tbl.no}</span>
                        <span>{tbl.title}</span>
                        <span>{tbl.tags}</span>
                        <span className="text-right">{tbl.year}</span>
                        <span className="text-right">{tbl.links}</span>
                    </div>

                    <ul>
                        {t.projects.map((project: Project, index: number) => {
                            const isPreview = index === previewIndex
                            return (
                                <motion.li
                                    key={project.name}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true, amount: 0.4 }}
                                    transition={{ duration: 0.6, ease: EASE_OUT, delay: Math.min(index, 8) * 0.035 }}
                                    onMouseEnter={() => setPreviewIndex(index)}
                                    onFocus={() => setPreviewIndex(index)}
                                    data-active={isPreview ? 'true' : undefined}
                                    className="index-row rule-b"
                                >
                                    <div className={`grid ${COLS} gap-x-3 items-center md:items-baseline py-2.5 md:py-[0.5rem]`}>
                                        <span className="hidden md:block text-body-sm tabular index">{pad(index + 1)}</span>

                                        {/* Touch: a small thumbnail stands in for the hover preview. */}
                                        <span className="md:hidden relative block w-full aspect-[16/10] overflow-hidden bg-[var(--rule)] self-start">
                                            <ProjectImage project={project} sizes="96px" />
                                        </span>

                                        <span className="row-title min-w-0">
                                            {project.detail ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveProject(project)}
                                                    aria-label={`${project.name} — ${t.projectsSection.details}`}
                                                   
                                                    className="row-cover text-left text-[0.9375rem] md:text-sm font-medium leading-snug"
                                                >
                                                    {project.name}
                                                    <span className="row-arrow ml-1.5 text-[var(--accent-ink)]" aria-hidden="true">→</span>
                                                </button>
                                            ) : (
                                                <span className="text-[0.9375rem] md:text-sm font-medium leading-snug">{project.name}</span>
                                            )}
                                            <span className="md:hidden block mt-0.5 text-body-sm text-[var(--muted)] leading-snug truncate">
                                                <span className="tabular">{pad(index + 1)}</span>
                                                {project.year && <> · <span className="tabular">{project.year}</span></>}
                                                {' · '}{project.tags.slice(0, 2).join(', ')}
                                            </span>
                                            <span className="md:hidden relative z-10 mt-1 flex gap-4">
                                                <RowLinks project={project} t={t} />
                                            </span>
                                        </span>

                                        <span className="hidden md:block text-body-sm text-[var(--muted)] truncate">{project.tags.slice(0, 3).join(', ')}</span>
                                        <span className="hidden md:block text-body-sm text-[var(--muted)] tabular text-right">{project.year}</span>
                                        <span className="hidden md:flex relative z-10 justify-end gap-3">
                                            <RowLinks project={project} t={t} />
                                        </span>
                                    </div>
                                </motion.li>
                            )
                        })}
                    </ul>

                    <div className="mt-4 md:mt-3">
                        <a
                            href="https://github.com/Andrewfragkiadakis"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub profile"
                            className="arrow-link inline-flex items-center gap-2 text-sm font-medium border-b border-[var(--foreground)] pb-0.5 hover:text-[var(--accent-ink)] hover:border-[var(--accent-ink)] transition-colors"
                        >
                            {t.projectsSection.githubCta}
                            <span className="arrow arrow-ne" aria-hidden="true">↗</span>
                        </a>
                    </div>
                </div>

                {/* Fixed preview column (desktop): follows the hovered or focused row. */}
                <aside className="hidden md:block md:col-span-4" aria-hidden="true">
                    <div className="flex items-baseline justify-between rule-t-strong pt-2.5 pb-3">
                        <span className="meta">{t.editorial.hoverHint}</span>
                        <span className="meta tabular index">({pad(previewIndex + 1)})</span>
                    </div>
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-[var(--rule)]">
                        <AnimatePresence initial={false}>
                            <motion.div
                                key={preview.name}
                                className="absolute inset-0"
                                initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
                                animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                                exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.3 } }}
                                transition={{ duration: 0.55, ease: EASE_OUT }}
                            >
                                <ProjectImage project={preview} sizes="(max-width: 1439px) 30vw, 440px" />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <div className="mt-3">
                        <p className="text-base font-medium leading-tight tracking-[-0.01em]">{preview.name}</p>
                        {preview.role && <p className="meta mt-1.5">{preview.role}</p>}
                        <p className="mt-2 text-body-sm text-[var(--muted)] leading-snug line-clamp-4">{preview.description}</p>
                    </div>
                </aside>
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
                            <div className="relative aspect-[16/10] max-h-[45vh] w-full overflow-hidden bg-[var(--rule)]">
                                <ProjectImage project={activeProject} sizes="(max-width: 767px) 100vw, 672px" />
                            </div>
                        )}

                        <div className="p-6 md:p-8">
                            <p className="meta mb-3">
                                <span className="index">({pad(t.projects.indexOf(activeProject) + 1)})</span> {t.projectsSection.caseStudy}
                                {activeProject.year && <> · <span className="tabular">{activeProject.year}</span></>}
                            </p>
                            <h3 id="project-modal-title" className="display text-3xl md:text-[2.5rem] mb-3">
                                {activeProject.name}
                            </h3>

                            {activeProject.role && (
                                <p className="text-sm text-[var(--muted)] mb-4">
                                    {t.projectsSection.roleLabel}: {activeProject.role}
                                </p>
                            )}

                            <p className="text-sm text-[var(--muted)] mb-5">
                                {activeProject.tags.join(' · ')}
                            </p>

                            <p className="text-sm leading-relaxed rule-t pt-4 mb-6">
                                {activeProject.detail}
                            </p>

                            {activeProject.highlights && activeProject.highlights.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="meta mb-2">{t.projectsSection.highlightsLabel}</h4>
                                    <ol className="text-sm">
                                        {activeProject.highlights.map((item, i) => (
                                            <li key={i} className="rule-t grid grid-cols-[2rem_1fr] py-2">
                                                <span className="index tabular">{pad(i + 1)}</span>
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 pt-4 rule-t">
                                {activeProject.liveSiteLink && (
                                    <a href={activeProject.liveSiteLink} target="_blank" rel="noopener noreferrer" className="arrow-link inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--cobalt)] text-white text-sm font-medium hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors">
                                        {t.projectsSection.live} <span className="arrow arrow-ne" aria-hidden="true">↗</span>
                                    </a>
                                )}
                                {activeProject.githubLink && (
                                    <a href={activeProject.githubLink} target="_blank" rel="noopener noreferrer" className="arrow-link inline-flex items-center gap-2 px-4 py-2.5 border border-[var(--foreground)] text-sm font-medium hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors">
                                        {t.projectsSection.code} <span className="arrow arrow-ne" aria-hidden="true">↗</span>
                                    </a>
                                )}
                                {activeProject.reportLink && (
                                    <a href={activeProject.reportLink} target="_blank" rel="noopener noreferrer" className="arrow-link inline-flex items-center gap-2 px-4 py-2.5 border border-[var(--foreground)] text-sm font-medium hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors">
                                        {t.projectsSection.report} <span className="arrow arrow-ne" aria-hidden="true">↗</span>
                                    </a>
                                )}
                                {activeProject.publicationLink && (
                                    <a href={activeProject.publicationLink} target="_blank" rel="noopener noreferrer" className="arrow-link inline-flex items-center gap-2 px-4 py-2.5 border border-[var(--foreground)] text-sm font-medium hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors">
                                        {t.projectsSection.publication} <span className="arrow arrow-ne" aria-hidden="true">↗</span>
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
