'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useContent } from '@/hooks/useContent'
import type { KeynoteCopy, Project } from '@/data/content'
import Modal from '@/components/ui/Modal'
import { ProjectShot } from '@/components/ui/Device'
import { ArrowOut, Chevron, Headline, Parallax, Rise, ScaleIn } from '@/components/ui/keynote'
import { EASE_OUT } from '@/utils/motion'

type ProjectLink = { href: string; label: string }

function linksFor(project: Project, k: KeynoteCopy['projects']): ProjectLink[] {
    return [
        project.liveSiteLink && { href: project.liveSiteLink, label: k.visit },
        project.githubLink && { href: project.githubLink, label: k.code },
        project.reportLink && { href: project.reportLink, label: k.report },
        project.publicationLink && { href: project.publicationLink, label: k.publication },
    ].filter(Boolean) as ProjectLink[]
}

/** "Learn more ›" plus the project's outbound links, in Apple link style. */
function ProjectLinks({ project, onOpen, k, newTab }: { project: Project; onOpen: () => void; k: KeynoteCopy['projects']; newTab: string }) {
    return (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[1.0625rem]">
            {project.detail && (
                <button type="button" onClick={onOpen} className="kn-link" aria-label={`${project.name} — ${k.learnMore}`}>
                    {k.learnMore}
                    <Chevron />
                </button>
            )}
            {linksFor(project, k).map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="kn-link" aria-label={`${project.name} — ${link.label} (${newTab})`}>
                    {link.label}
                    <ArrowOut />
                </a>
            ))}
        </div>
    )
}

/**
 * Slide 5 — a product shot. The selected project sits in a device frame on a stage
 * that scales up as the slide arrives; the full line-up sits beside it. On phones the
 * line-up becomes an accordion with the shot inline.
 */
export default function Projects() {
    const t = useContent()
    const k = t.keynote
    const [activeIndex, setActiveIndex] = useState(0)
    const [dialog, setDialog] = useState<Project | null>(null)

    const project = t.projects[Math.min(activeIndex, t.projects.length - 1)]

    return (
        <section
            id="projects"
            aria-labelledby="projects-title"
            className="relative w-full md:h-full flex items-center px-5 sm:px-10 md:px-[max(3rem,6vw)] py-20 md:py-0"
        >
            <Parallax depth={-0.3} className="pointer-events-none absolute inset-0 hidden md:block">
                <div className="kn-glow absolute inset-x-[5%] inset-y-[15%]" aria-hidden="true" />
            </Parallax>

            <div className="relative mx-auto w-full max-w-[76rem]">
                <Parallax depth={-0.05} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <Rise>
                            <p className="kn-eyebrow">{k.projects.eyebrow}</p>
                        </Rise>
                        <Headline
                            id="projects-title"
                            text={k.projects.headline}
                            className="mt-3 text-[clamp(2.5rem,11vw,4.5rem)] md:text-[min(5.2vw,8.4vh)]"
                        />
                    </div>
                    <Rise delay={0.3} className="md:pb-2">
                        <a href={t.github} target="_blank" rel="noopener noreferrer" className="kn-link text-[1.0625rem]" aria-label={`${k.projects.github} (${k.common.newTab})`}>
                            {k.projects.github}
                            <ArrowOut />
                        </a>
                    </Rise>
                </Parallax>

                <div className="mt-8 md:mt-[min(4vh,2.5rem)] grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-x-[3vw]">
                    {/* Stage (desktop). */}
                    <div className="hidden md:flex md:col-span-7 flex-col" id="project-stage" aria-live="polite">
                        <ScaleIn className="relative h-[min(47vh,29rem)] flex items-end justify-center">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={project.name}
                                    initial={{ opacity: 0, y: 18, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.99 }}
                                    transition={{ duration: 0.5, ease: EASE_OUT }}
                                    className="relative w-[min(100%,74vh)] flex justify-center"
                                >
                                    <ProjectShot
                                        project={project}
                                        sizes="(min-width: 1024px) 46vw, 100vw"
                                        className={project.device === 'phone' ? '' : 'w-full'}
                                        phoneClassName="w-[min(13rem,21vh)]"
                                    />
                                    <span className="device-floor" aria-hidden="true" />
                                </motion.div>
                            </AnimatePresence>
                        </ScaleIn>

                        <Rise delay={0.2} className="mt-[min(4vh,2.25rem)]">
                            <div className="flex items-baseline gap-3">
                                <h3 className="kn-title text-[min(2vw,3.4vh)]">{project.name}</h3>
                                {project.year && <span className="text-body-sm text-[var(--muted)] tabular-nums">{project.year}</span>}
                            </div>
                            <p className="mt-2 text-[min(1.1vw,1.9vh)] leading-snug text-[var(--muted)] line-clamp-2 max-w-[42rem]">{project.description}</p>
                            <div className="mt-3">
                                <ProjectLinks project={project} onOpen={() => setDialog(project)} k={k.projects} newTab={k.common.newTab} />
                            </div>
                        </Rise>
                    </div>

                    {/* Line-up: a selector on desktop, an accordion on phones. */}
                    <Parallax depth={0.06} className="md:col-span-5">
                        <Rise delay={0.25}>
                            <h3 className="text-caption font-semibold text-[var(--muted)] pb-2 border-b border-[var(--line)]">{k.projects.lineup}</h3>
                            <ul>
                                {t.projects.map((item, index) => {
                                    const isActive = index === activeIndex
                                    return (
                                        <li key={item.name} className="border-b border-[var(--line)]">
                                            <button
                                                type="button"
                                                onClick={() => setActiveIndex(index)}
                                                aria-pressed={isActive}
                                                className={`group w-full flex items-center justify-between gap-4 text-left py-3 md:py-[min(1.05vh,0.62rem)] transition-colors duration-300 ${isActive ? 'text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
                                            >
                                                <span className="flex items-center gap-3 min-w-0">
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full shrink-0 transition-opacity duration-300 bg-[image:var(--grad)] ${isActive ? 'opacity-100' : 'opacity-0'}`}
                                                        aria-hidden="true"
                                                    />
                                                    <span className="text-[1rem] md:text-[min(1.12vw,1.95vh)] font-semibold tracking-[-0.01em] leading-snug">{item.name}</span>
                                                </span>
                                                <span className="text-caption tabular-nums shrink-0">{item.year}</span>
                                            </button>

                                            {/* Phones: the shot and links open inline under the active row. */}
                                            <AnimatePresence initial={false}>
                                                {isActive && (
                                                    <motion.div
                                                        className="md:hidden overflow-hidden"
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.45, ease: EASE_OUT }}
                                                    >
                                                        <div className="pt-3 pb-6">
                                                            <ProjectShot project={item} sizes="100vw" className="w-full" phoneClassName="w-[11rem]" />
                                                            <p className="mt-5 text-[0.9375rem] leading-snug text-[var(--muted)]">{item.description}</p>
                                                            <div className="mt-3">
                                                                <ProjectLinks project={item} onOpen={() => setDialog(item)} k={k.projects} newTab={k.common.newTab} />
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </li>
                                    )
                                })}
                            </ul>
                        </Rise>
                    </Parallax>
                </div>
            </div>

            <Modal
                open={Boolean(dialog)}
                onClose={() => setDialog(null)}
                labelledBy="project-modal-title"
                closeLabel={k.common.close}
                className="max-w-2xl w-full"
            >
                {dialog && (
                    <>
                        {dialog.image && (
                            <div className="bg-[var(--surface)] px-8 sm:px-14 pt-12 pb-10 flex justify-center">
                                <ProjectShot project={dialog} sizes="(max-width: 767px) 90vw, 560px" className={dialog.device === 'phone' ? '' : 'w-full'} phoneClassName="w-[10rem]" />
                            </div>
                        )}
                        <div className="p-7 sm:p-9">
                            <p className="text-caption text-[var(--muted)]">
                                {[dialog.year, dialog.role].filter(Boolean).join(' · ')}
                            </p>
                            <h3 id="project-modal-title" className="kn-title text-[1.625rem] sm:text-[2rem] mt-1 pr-10">{dialog.name}</h3>
                            <ul className="mt-4 flex flex-wrap gap-1.5">
                                {dialog.tags.map((tag) => (
                                    <li key={tag} className="px-2.5 py-1 rounded-full bg-[var(--surface)] text-caption">{tag}</li>
                                ))}
                            </ul>
                            <p className="mt-5 text-[1.0625rem] leading-relaxed text-[var(--muted)]">{dialog.detail}</p>
                            {dialog.highlights && dialog.highlights.length > 0 && (
                                <>
                                    <h4 className="mt-7 mb-3 text-body-sm font-semibold">{k.projects.highlights}</h4>
                                    <ul className="space-y-2.5">
                                        {dialog.highlights.map((item) => (
                                            <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-snug">
                                                <svg viewBox="0 0 16 16" className="w-4 h-4 mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden="true" fill="none">
                                                    <path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                            {linksFor(dialog, k.projects).length > 0 && (
                                <div className="mt-8 pt-6 border-t border-[var(--line)] flex flex-wrap gap-3">
                                    {linksFor(dialog, k.projects).map((link, i) => (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`kn-pill kn-pill--sm ${i === 0 ? 'kn-pill--fill' : 'kn-pill--line'}`}
                                        >
                                            {link.label}
                                            <ArrowOut />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </Modal>
        </section>
    )
}
