'use client'

import { useContent } from '@/hooks/useContent'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { useState } from 'react'
import type { Project } from '@/data/content'
import Modal from '@/components/ui/Modal'
import ProjectImage from '@/components/ui/ProjectImage'
import Window from '@/components/ui/Window'
import Icon, { type SymbolName } from '@/components/ui/Icon'
import { FinderSidebar, PathBar } from '@/components/ui/Finder'
import { useDesktop } from '@/contexts/DesktopContext'
import { EASE_OUT } from '@/utils/motion'

const ICON_POP: Variants = {
    hidden: { opacity: 0, y: 16, scale: 0.96 },
    visible: (index: number) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: 0.2 + Math.min(index, 11) * 0.04, duration: 0.5, ease: EASE_OUT } }),
}

/** Small LIVE / OSS / PAPER tags derived from which links a project has. */
function statusesOf(project: Project) {
    return [
        project.liveSiteLink && { label: 'LIVE', accent: true },
        project.githubLink && { label: 'OSS', accent: false },
        (project.reportLink || project.publicationLink) && { label: 'PAPER', accent: false },
    ].filter(Boolean) as { label: string; accent: boolean }[]
}

/** Every outbound link a project has, as compact icon links (list view) or buttons (Quick Look). */
function ProjectLinks({ project, variant }: { project: Project; variant: 'icons' | 'buttons' }) {
    const t = useContent()
    const links = [
        project.liveSiteLink && { href: project.liveSiteLink, icon: 'arrow.up.right', label: t.projectsSection.live, primary: true },
        project.githubLink && { href: project.githubLink, icon: 'github', label: t.projectsSection.code, primary: false },
        project.reportLink && { href: project.reportLink, icon: 'doc.text', label: t.projectsSection.report, primary: false },
        project.publicationLink && { href: project.publicationLink, icon: 'book', label: t.projectsSection.publication, primary: false },
    ].filter(Boolean) as { href: string; icon: SymbolName; label: string; primary: boolean }[]

    if (variant === 'icons') {
        return (
            <span className="flex items-center">
                {links.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.name} — ${link.label}`}
                        title={link.label}
                        className="os-tool text-[0.9375rem]"
                    >
                        <Icon name={link.icon} />
                    </a>
                ))}
            </span>
        )
    }

    return (
        <div className="flex flex-wrap gap-2">
            {links.map((link) => (
                <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`os-btn h-8 px-4 ${link.primary ? 'os-btn--primary' : 'os-btn--secondary'}`}
                >
                    <Icon name={link.icon} className="text-[0.875rem]" />
                    <span className="caps-gr">{link.label}</span>
                </a>
            ))}
        </div>
    )
}

export default function Projects() {
    const t = useContent()
    const reduceMotion = useReducedMotion()
    const [activeProject, setActiveProject] = useState<Project | null>(null)
    const { projectsView: view, setProjectsView: setView } = useDesktop()

    return (
        <Window
            wid="projects"
            app="projects"
            as="section"
            anchor="projects"
            labelledBy="projects-title"
            title={t.os.windows.projects}
            subtitle={`${t.projects.length} ${t.os.items}`}
            sidebar={<FinderSidebar current="projects" />}
            className="w-full md:max-w-[76rem] md:max-h-full"
            toolbar={
                <div className="os-segmented" role="group" aria-label={t.os.view.label}>
                    <button type="button" aria-pressed={view === 'icons'} onClick={() => setView('icons')}>
                        <Icon name="square.grid.2x2" />
                        {t.os.view.icons}
                    </button>
                    <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>
                        <Icon name="list.bullet" />
                        {t.os.view.list}
                    </button>
                </div>
            }
            footer={
                <PathBar
                    folder={t.os.menus.projects}
                    count={t.projects.length}
                    action={
                        <a
                            href="https://github.com/Andrewfragkiadakis"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub profile"
                            className="os-btn os-btn--secondary"
                        >
                            <Icon name="github" className="text-[0.875rem]" />
                            <span className="caps-gr">{t.projectsSection.githubCta}</span>
                        </a>
                    }
                />
            }
        >
            <div className="p-4 sm:p-5 md:px-6 md:py-5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4">
                    <h2 id="projects-title" className="os-eyebrow caps-gr">{t.projectsSection.title}</h2>
                    <p className="text-caption uppercase tracking-[0.04em] text-[var(--muted)]">{t.projectsSection.subtitle}</p>
                </div>

                {view === 'icons' ? (
                    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-3 gap-y-4">
                        {t.projects.map((project: Project, index: number) => (
                            <motion.li
                                key={project.name}
                                initial={reduceMotion ? false : 'hidden'}
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                                variants={ICON_POP}
                                custom={index}
                            >
                                <button
                                    type="button"
                                    onClick={() => setActiveProject(project)}
                                    aria-label={`${project.name} — ${t.projectsSection.details}`}
                                    className="group w-full flex flex-col items-center gap-1.5 p-1.5 rounded-lg text-center transition-colors hover:bg-[var(--control)] focus-visible:bg-[var(--control)]"
                                >
                                    <span className="relative block w-full aspect-[16/10] overflow-hidden rounded-md bg-[var(--control)] shadow-[0_0_0_0.5px_var(--hairline-strong),0_6px_14px_-8px_rgba(0,0,0,0.45)]">
                                        <ProjectImage
                                            project={project}
                                            sizes="(max-width: 639px) 45vw, (max-width: 1279px) 25vw, 180px"
                                            className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.05]"
                                        />
                                    </span>
                                    <span className="text-body-sm font-medium leading-tight line-clamp-2 min-h-[2.5em] px-1 rounded group-focus-visible:bg-[var(--accent-fill)] group-focus-visible:text-white">{project.name}</span>
                                    <span className="flex items-center justify-center gap-1 flex-wrap">
                                        {project.year && <span className="text-caption tabular-nums text-[var(--muted)]">{project.year}</span>}
                                        {statusesOf(project).map((st) => (
                                            <span key={st.label} className={`text-[0.5625rem] font-semibold tracking-[0.06em] px-1.5 py-px rounded-full ${st.accent ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'bg-[var(--control)] text-[var(--muted)]'}`}>
                                                {st.label}
                                            </span>
                                        ))}
                                    </span>
                                </button>
                            </motion.li>
                        ))}
                    </ul>
                ) : (
                    <div className="rounded-lg overflow-hidden shadow-[0_0_0_0.5px_var(--hairline-strong)]">
                        <table className="w-full text-left text-body-sm">
                            <thead className="text-caption text-[var(--muted)] bg-[var(--window-chrome)] border-b-[0.5px] border-[var(--hairline-strong)]">
                                <tr>
                                    <th scope="col" className="font-semibold py-2 pl-3 pr-2">{t.os.table.name}</th>
                                    <th scope="col" className="font-semibold py-2 px-2 hidden md:table-cell">{t.os.table.kind}</th>
                                    <th scope="col" className="font-semibold py-2 px-2 hidden sm:table-cell">{t.os.table.year}</th>
                                    <th scope="col" className="font-semibold py-2 pl-2 pr-3 text-right">{t.os.table.links}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {t.projects.map((project: Project) => (
                                    <tr key={project.name} className="even:bg-[var(--card)] hover:bg-[var(--accent-soft)]">
                                        <td className="py-1 pl-2 pr-2">
                                            <button
                                                type="button"
                                                onClick={() => setActiveProject(project)}
                                                aria-label={`${project.name} — ${t.projectsSection.details}`}
                                                className="flex items-center gap-2.5 text-left rounded-md py-1 pr-2 min-h-9"
                                            >
                                                <span className="relative block w-10 h-[1.5625rem] shrink-0 overflow-hidden rounded bg-[var(--control)] shadow-[0_0_0_1px_var(--hairline)]">
                                                    <ProjectImage project={project} sizes="40px" />
                                                </span>
                                                <span className="font-medium leading-tight">{project.name}</span>
                                            </button>
                                        </td>
                                        <td className="py-1 px-2 text-[var(--muted)] hidden md:table-cell whitespace-nowrap">{project.tags.slice(0, 2).join(', ')}</td>
                                        <td className="py-1 px-2 text-[var(--muted)] tabular-nums hidden sm:table-cell">{project.year}</td>
                                        <td className="py-1 pl-2 pr-2">
                                            <span className="flex justify-end"><ProjectLinks project={project} variant="icons" /></span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal
                open={Boolean(activeProject)}
                onClose={() => setActiveProject(null)}
                labelledBy="project-modal-title"
                closeLabel={t.projectsSection.close}
                title={activeProject ? `${t.os.windows.quickLook} — ${activeProject.name}` : t.os.windows.quickLook}
                className="max-w-2xl w-full"
            >
                {activeProject && (
                    <>
                        {activeProject.image && (
                            <div className="relative aspect-[16/10] max-h-[42vh] w-full overflow-hidden bg-[var(--control)] border-b border-[var(--hairline)]">
                                <ProjectImage project={activeProject} sizes="(max-width: 767px) 100vw, 672px" />
                            </div>
                        )}

                        <div className="p-6 sm:p-7">
                            <div className="flex items-baseline justify-between gap-4 mb-1">
                                <h3 id="project-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
                                    {activeProject.name}
                                </h3>
                                {activeProject.year && (
                                    <span className="text-sm tabular-nums text-[var(--muted)] shrink-0">{activeProject.year}</span>
                                )}
                            </div>

                            {activeProject.role && (
                                <p className="text-body-sm text-[var(--muted)] mb-4">
                                    <span className="font-semibold caps-gr">{t.projectsSection.roleLabel}:</span> {activeProject.role}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-1.5 mb-5">
                                {activeProject.tags.map((tag, i) => (
                                    <span key={i} className="os-chip h-6 px-2 text-caption font-medium">{tag}</span>
                                ))}
                            </div>

                            <p className="text-sm leading-relaxed mb-6">{activeProject.detail ?? activeProject.description}</p>

                            {activeProject.highlights && activeProject.highlights.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="os-eyebrow mb-2.5 caps-gr">{t.projectsSection.highlightsLabel}</h4>
                                    <ul className="space-y-2">
                                        {activeProject.highlights.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-sm">
                                                <Icon name="checkmark.circle" className="text-[var(--accent)] text-base mt-0.5" />
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="pt-4 border-t border-[var(--hairline)]">
                                <ProjectLinks project={activeProject} variant="buttons" />
                            </div>
                        </div>
                    </>
                )}
            </Modal>
        </Window>
    )
}
