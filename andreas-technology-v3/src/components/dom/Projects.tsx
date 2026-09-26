'use client'

import { useContent } from '@/hooks/useContent'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useIsDesktop } from '@/hooks/useIsDesktop'
import type { Project } from '@/data/content'
import Modal from '@/components/ui/Modal'
import Panel from '@/components/ui/Panel'
import ProjectImage from '@/components/ui/ProjectImage'
import RollText from '@/components/ui/RollText'
import SectionHeading, { SPLIT_TITLE } from '@/components/ui/SectionHeading'
import { EASE_OUT, FADE_UP, WIPE_FROM_RIGHT } from '@/utils/motion'

const pad = (n: number) => String(n).padStart(2, '0')

/** Index-table columns: No. / Title / Tags (xl) / Year, then the links cell. */
const COLS_MAIN = 'md:grid-cols-[2.25rem_1fr_3rem] xl:grid-cols-[2.25rem_1fr_10rem_3rem]'
const COLS = 'grid-cols-[2.25rem_1fr_3rem_8.5rem] xl:grid-cols-[2.25rem_1fr_10rem_3rem_8.5rem]'

/** LIVE and CODE are spelled out by each row's links; only a paper has no link in the row. */
const statusesOf = (project: Project): string[] => (project.reportLink || project.publicationLink ? ['PAPER'] : [])

/** Resting angles for the collage: the current shot sits almost square, older ones fan out behind it. */
const TILT = [-1.5, 5, -7]

/**
 * Projects — "specimen rows" on paper (number, name, tags, status, year, links) beside a
 * cobalt block holding a tilted stack of screenshots, Gallery Play style. Hovering or
 * focusing a row brings its shot to the top; clicking opens the case study.
 */
export default function Projects() {
    const t = useContent()
    const [activeProject, setActiveProject] = useState<Project | null>(null)
    const [preview, setPreview] = useState(0)
    const isDesktop = useIsDesktop()
    const projects = t.projects

    // The last three previewed shots, newest first, for the fanned stack.
    const [history, setHistory] = useState<number[]>([0, 1, 2])
    const show = (index: number) => {
        setPreview(index)
        setHistory((h) => [index, ...h.filter((i) => i !== index)].slice(0, 3))
    }

    const current = projects[preview] ?? projects[0]
    const head = t.editorial.table
    // Row links sit on paper at rest and on the cobalt bar when the row is active.
    const linkClass = 'eyebrow relative z-10 flex items-center gap-1 px-2 h-8 transition-colors duration-300 hover:bg-[var(--foreground)] hover:text-[var(--background)] max-md:hover:bg-[var(--block)] max-md:hover:text-[var(--on-block)]'

    return (
        <Panel id="projects" label={t.projectsSection.title} className="flex flex-col md:flex-row">
            {/* ── Paper: the index table ────────────────────────────── */}
            <div className="surface-page md:w-[56%] flex flex-col justify-between gap-8 px-4 md:px-[var(--gutter)] pt-12 pb-14 md:pt-5 md:pb-8">
                <SectionHeading
                    id="projects"
                    anchor={false}
                    compact
                    heavy
                    index={4}
                    label={t.nav.projects}
                    title={t.editorial.sections.projects}
                    sizeClass={SPLIT_TITLE}
                    right={
                        <a
                            href="https://github.com/Andrewfragkiadakis"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${t.projectsSection.githubCta} (GitHub profile)`}
                            className="arrow-link meta text-[var(--foreground)] hidden sm:inline-flex items-center gap-2 hover:text-[var(--accent-ink)] transition-colors"
                        >
                            <span className="link-underline">{t.projectsSection.githubCta}</span>
                            <span className="arrow arrow-ne" aria-hidden="true">↗</span>
                        </a>
                    }
                />

                <motion.div variants={FADE_UP} custom={0.45}>
                    {/* Column heads on the same grid as the rows. */}
                    <div className={`hidden md:grid ${COLS} gap-4 pb-2 border-b border-[var(--rule-strong)]`} aria-hidden="true">
                        <span className="meta">{head.no}</span>
                        <span className="meta">{head.title}</span>
                        <span className="meta hidden xl:block">{head.tags}</span>
                        <span className="meta">{head.year}</span>
                        <span className="meta text-right">{head.links}</span>
                    </div>

                    <ol className="max-md:border-t max-md:border-[var(--rule-strong)]">
                        {projects.map((project, index) => {
                            const statuses = statusesOf(project)
                            const isPreview = index === preview
                            return (
                                <li
                                    key={project.name}
                                    data-active={isPreview && isDesktop}
                                    className={`index-row group grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto] items-center border-b border-[var(--line)]`}
                                    onMouseEnter={() => show(index)}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setActiveProject(project)}
                                        onFocus={() => show(index)}
                                        aria-label={`${project.name} — ${t.projectsSection.details}`}
                                        className={`min-w-0 text-left grid grid-cols-[auto_1fr] ${COLS_MAIN} items-center gap-3 md:gap-4 py-2.5 md:py-[0.55rem] short:py-[0.4rem] focus-visible:outline-offset-[-4px]`}
                                    >
                                        {/* Touch: a thumbnail per row, since there is no hover preview. */}
                                        <span className="md:hidden relative w-20 aspect-[16/10] overflow-hidden bg-[var(--block)]">
                                            <ProjectImage project={project} sizes="80px" />
                                        </span>
                                        <span className="hidden md:block meta index">{pad(index + 1)}</span>
                                        <span className="row-title min-w-0">
                                            <span className="block font-semibold text-sm md:text-[0.9375rem] leading-tight md:truncate">
                                                <span className="md:hidden meta index mr-2">{pad(index + 1)}</span>
                                                {project.name}
                                            </span>
                                            <span className="md:hidden block text-body-sm text-[var(--muted)] truncate mt-0.5">
                                                {project.year} · {project.tags.slice(0, 3).join(' · ')}
                                            </span>
                                        </span>
                                        <span className="hidden xl:block text-body-sm text-[var(--muted)] truncate">{project.tags.slice(0, 2).join(', ')}</span>
                                        <span className="hidden md:block text-body-sm tabular">{project.year}</span>
                                    </button>

                                    <span className="flex items-center justify-end gap-0.5 md:w-[8.5rem]">
                                        {statuses.map((label) => (
                                            <span key={label} className="hidden md:inline-block text-micro font-semibold tracking-[0.06em] px-1.5 py-0.5 mr-1 shadow-[inset_0_0_0_1px_currentColor]">
                                                {label}
                                            </span>
                                        ))}
                                        {project.liveSiteLink && (
                                            <a href={project.liveSiteLink} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} — ${t.projectsSection.live}`} className={linkClass}>
                                                <span className="hidden md:inline">{t.projectsSection.live}</span>
                                                <span aria-hidden="true">↗</span>
                                            </a>
                                        )}
                                        {project.githubLink && (
                                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} — ${t.projectsSection.code}`} className={linkClass}>
                                                <i className="fab fa-github md:hidden" aria-hidden="true" />
                                                <span className="hidden md:inline">{t.projectsSection.code}</span>
                                                <span className="hidden md:inline" aria-hidden="true">↗</span>
                                            </a>
                                        )}
                                    </span>
                                </li>
                            )
                        })}
                    </ol>

                    <a
                        href="https://github.com/Andrewfragkiadakis"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub profile"
                        className="btn btn-line w-full justify-between mt-6 sm:hidden"
                    >
                        <RollText>{t.projectsSection.githubCta}</RollText>
                        <span aria-hidden="true">↗</span>
                    </a>
                </motion.div>
            </div>

            {/* ── Cobalt: the tilted stack (desktop) ─────────────────── */}
            <motion.div
                variants={WIPE_FROM_RIGHT}
                className="surface-block hidden md:flex md:w-[44%] flex-col justify-between px-[var(--gutter)] pt-5 pb-8 overflow-hidden"
                aria-hidden="true"
            >
                <div className="rule-t-strong pt-2.5 meta flex items-baseline justify-between gap-4">
                    <span>{t.projectsSection.caseStudy}</span>
                    <span className="tabular">{pad(preview + 1)} / {pad(projects.length)}</span>
                </div>

                <div className="relative w-full aspect-[16/11] my-6">
                    {[...history].reverse().map((index) => {
                        const project = projects[index]
                        const depth = history.indexOf(index)
                        if (!project) return null
                        return (
                            <motion.div
                                key={index}
                                className="absolute inset-[6%] bg-white p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]"
                                initial={{ opacity: 0, y: 40, rotate: 8 }}
                                animate={{ opacity: depth === 2 ? 0.9 : 1, y: depth * -10, x: depth * (depth === 1 ? 26 : -30), rotate: TILT[depth], scale: 1 - depth * 0.05 }}
                                transition={{ duration: 0.7, ease: EASE_OUT }}
                                style={{ zIndex: 3 - depth }}
                            >
                                <div className="relative w-full h-full overflow-hidden bg-[var(--ink)]">
                                    <ProjectImage project={project} sizes="(max-width: 1439px) 520px, 600px" />
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                <div className="flex items-end justify-between gap-6">
                    <div className="min-w-0">
                        <div className="overflow-hidden">
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.div
                                    key={preview}
                                    className="font-display text-[clamp(4.5rem,9vw,9rem)] tabular-nums"
                                    initial={{ y: '100%' }}
                                    animate={{ y: '0%' }}
                                    exit={{ y: '-100%' }}
                                    transition={{ duration: 0.5, ease: EASE_OUT }}
                                >
                                    {pad(preview + 1)}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <p className="mt-3 font-display font-extrabold tracking-[-0.02em] leading-tight text-lg truncate">{current.name}</p>
                        <p className="meta mt-1 truncate">{current.role ?? current.tags.slice(0, 3).join(' · ')}</p>
                    </div>
                    <span className="meta tabular shrink-0 pb-1">{current.year}</span>
                </div>
            </motion.div>

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
                            <div className="surface-block p-3 sm:p-4">
                                <div className="relative aspect-[16/10] max-h-[40vh] w-full overflow-hidden bg-[var(--ink)]">
                                    <ProjectImage project={activeProject} sizes="(max-width: 767px) 100vw, 672px" />
                                </div>
                            </div>
                        )}

                        <div className="p-6 sm:p-8">
                            <div className="flex items-baseline justify-between gap-4 mb-3">
                                <h3 id="project-modal-title" className="display-heavy text-[clamp(1.75rem,4vw,2.5rem)] leading-[0.92]">
                                    {activeProject.name}
                                </h3>
                                {activeProject.year && (
                                    <span className="font-display tabular text-2xl text-[var(--accent)] shrink-0">
                                        {activeProject.year}
                                    </span>
                                )}
                            </div>

                            {activeProject.role && (
                                <p className="meta mb-5">
                                    {t.projectsSection.roleLabel}: {activeProject.role}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-1.5 mb-5">
                                {activeProject.tags.map((tag) => (
                                    <span key={tag} className="eyebrow px-2 py-1 shadow-[inset_0_0_0_1px_var(--line)]">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <p className="text-[0.9375rem] text-[var(--muted)] leading-relaxed mb-6">
                                {activeProject.detail}
                            </p>

                            {activeProject.highlights && activeProject.highlights.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="eyebrow text-[var(--accent)] mb-3">
                                        {t.projectsSection.highlightsLabel}
                                    </h4>
                                    <ul className="border-t border-[var(--line)]">
                                        {activeProject.highlights.map((item) => (
                                            <li key={item} className="flex items-start gap-3 py-2.5 border-b border-[var(--line)] text-sm">
                                                <span className="w-2 h-2 mt-1.5 bg-[var(--block)] shrink-0" aria-hidden="true" />
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                                {activeProject.liveSiteLink && (
                                    <a href={activeProject.liveSiteLink} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
                                        <i className="fas fa-arrow-up-right-from-square" aria-hidden="true" /> {t.projectsSection.live}
                                    </a>
                                )}
                                {activeProject.githubLink && (
                                    <a href={activeProject.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                                        <i className="fab fa-github" aria-hidden="true" /> {t.projectsSection.code}
                                    </a>
                                )}
                                {activeProject.reportLink && (
                                    <a href={activeProject.reportLink} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                                        <i className="fas fa-file-lines" aria-hidden="true" /> {t.projectsSection.report}
                                    </a>
                                )}
                                {activeProject.publicationLink && (
                                    <a href={activeProject.publicationLink} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                                        <i className="fas fa-book-open" aria-hidden="true" /> {t.projectsSection.publication}
                                    </a>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </Modal>
        </Panel>
    )
}
