'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useContent } from '@/hooks/useContent'
import type { KeynoteCopy, Project } from '@/data/content'
import Modal from '@/components/ui/Modal'
import { ProjectShot } from '@/components/ui/Device'
import { ArrowOut, Chevron, HEADER_GAP, Rise, ScaleIn, SLIDE_CLASS, SlideHeader } from '@/components/ui/keynote'
import { splitName } from '@/utils/format'
import { EASE_APPLE } from '@/utils/motion'

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
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 t-body">
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
 * Slide 6 — a product shot. The selected project sits in a device frame on a stage
 * that scales up as the slide arrives; the full line-up sits beside it. On phones the
 * line-up becomes an accordion with the shot inline.
 */
export default function Projects() {
    const t = useContent()
    const k = t.keynote
    const [activeIndex, setActiveIndex] = useState(0)
    const [dialog, setDialog] = useState<Project | null>(null)

    const project = t.projects[Math.min(activeIndex, t.projects.length - 1)]
    const stageName = splitName(project.name)

    return (
        <section id="projects" aria-labelledby="projects-title" className={SLIDE_CLASS}>
            <div className="relative mx-auto w-full max-w-[71rem]">
                <SlideHeader
                    id="projects-title"
                    eyebrow={k.projects.eyebrow}
                    headline={k.projects.headline}
                    aside={
                        <a href={t.github} target="_blank" rel="noopener noreferrer" className="kn-link t-body" aria-label={`${k.projects.github} (${k.common.newTab})`}>
                            {k.projects.github}
                            <ArrowOut />
                        </a>
                    }
                />

                <div className={`${HEADER_GAP} grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-x-[4vw]`}>
                    {/* Stage (desktop): the selected project as a product shot. */}
                    <div className="hidden md:flex md:col-span-7 flex-col" id="project-stage" aria-live="polite">
                        <ScaleIn className="relative h-[min(40vh,25rem)] flex items-end justify-center">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={project.name}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.5, ease: EASE_APPLE }}
                                    className="relative w-[min(100%,72vh)] flex justify-center"
                                >
                                    <ProjectShot
                                        project={project}
                                        sizes="(min-width: 1024px) 46vw, 100vw"
                                        className={project.device === 'phone' ? '' : project.device === 'bare' ? 'w-[86%] mb-[3%]' : 'w-full'}
                                        phoneClassName="w-[min(13rem,21vh)]"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </ScaleIn>

                        {/* Fixed-height caption, so the shot and links never jump between projects. */}
                        <Rise delay={0.2} className="mt-[min(1.75rem,3.2vh)]">
                            <h3 className="t-title text-[min(1.75rem,3.1vh)] truncate">{stageName.title}</h3>
                            <p className="mt-1 t-small md:text-[min(0.9375rem,1.7vh)] text-[var(--muted)] truncate">
                                {[stageName.subtitle, project.year].filter(Boolean).join(' · ')}
                            </p>
                            <p className="mt-3 t-body md:text-[min(1.0625rem,1.9vh)] text-[var(--muted)] line-clamp-2 min-h-[2.94em] max-w-[40rem]">{project.description}</p>
                            <div className="mt-3">
                                <ProjectLinks project={project} onOpen={() => setDialog(project)} k={k.projects} newTab={k.common.newTab} />
                            </div>
                        </Rise>
                    </div>

                    {/* Line-up: a selector on desktop, an accordion on phones. */}
                    <Rise delay={0.2} className="md:col-span-5">
                        <h3 className="t-small font-semibold pb-3">{k.projects.lineup}</h3>
                        <ul className="border-t border-[var(--line)]">
                            {t.projects.map((item, index) => {
                                const isActive = index === activeIndex
                                const name = splitName(item.name)
                                return (
                                    <li key={item.name} className="border-b border-[var(--line)]">
                                        <button
                                            type="button"
                                            onClick={() => setActiveIndex(index)}
                                            aria-pressed={isActive}
                                            className={`group w-full flex items-center justify-between gap-4 text-left py-3.5 md:py-[min(0.7rem,1.2vh)] transition-colors duration-300 ${isActive ? 'text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
                                        >
                                            <span className="t-body md:text-[min(1.0625rem,1.9vh)] min-w-0 truncate">
                                                <span className={isActive ? 'font-semibold' : ''}>{name.title}</span>
                                                {name.subtitle && <span className="ms-2 text-[var(--muted)] font-normal">{name.subtitle}</span>}
                                            </span>
                                            <span className="t-caption tabular-nums shrink-0 text-[var(--muted)]">{item.year}</span>
                                        </button>

                                        {/* Phones: the shot and links open inline under the active row. */}
                                        <AnimatePresence initial={false}>
                                            {isActive && (
                                                <motion.div
                                                    className="md:hidden overflow-hidden"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.45, ease: EASE_APPLE }}
                                                >
                                                    <div className="pt-4 pb-7">
                                                        <ProjectShot project={item} sizes="(max-width: 1023px) 92vw, 100vw" className={item.device === 'bare' ? 'w-[88%] mx-auto' : 'w-full'} phoneClassName="w-[11rem]" />
                                                        <p className="mt-6 t-body text-[var(--muted)]">{item.description}</p>
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
                </div>
            </div>

            <Modal
                open={Boolean(dialog)}
                onClose={() => setDialog(null)}
                labelledBy="project-modal-title"
                closeLabel={k.common.close}
                className="max-w-[43rem] w-full"
            >
                {dialog && (
                    <>
                        {dialog.image && (
                            <div className="bg-[var(--surface)] px-8 sm:px-16 pt-14 pb-12 flex justify-center">
                                <ProjectShot project={dialog} sizes="(max-width: 767px) 90vw, 560px" className={dialog.device === 'phone' ? '' : 'w-full'} phoneClassName="w-[10rem]" />
                            </div>
                        )}
                        <div className="px-7 py-9 sm:px-14 sm:py-12">
                            <p className="t-small text-[var(--muted)]">
                                {[dialog.year, dialog.role].filter(Boolean).join(' · ')}
                            </p>
                            <h3 id="project-modal-title" className="t-headline text-[2rem] sm:text-[2.5rem] mt-1 pr-10">{splitName(dialog.name).title}</h3>
                            {splitName(dialog.name).subtitle && <p className="mt-1 t-lede text-[1.1875rem] sm:text-[1.3125rem]">{splitName(dialog.name).subtitle}</p>}
                            <ul className="mt-4 flex flex-wrap gap-1.5">
                                {dialog.tags.map((tag) => (
                                    <li key={tag} className="px-2.5 py-1 rounded-full bg-[var(--surface)] t-caption">{tag}</li>
                                ))}
                            </ul>
                            <p className="mt-5 t-body text-[var(--muted)]">{dialog.detail}</p>
                            {dialog.highlights && dialog.highlights.length > 0 && (
                                <>
                                    <h4 className="mt-9 pb-3 t-small font-semibold border-b border-[var(--line)]">{k.projects.highlights}</h4>
                                    <ul>
                                        {dialog.highlights.map((item) => (
                                            <li key={item} className="t-body py-3 border-b border-[var(--line)]">{item}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                            {linksFor(dialog, k.projects).length > 0 && (
                                <div className="mt-9 flex flex-wrap gap-3">
                                    {linksFor(dialog, k.projects).map((link, i) => (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`kn-pill ${i === 0 ? 'kn-pill--fill' : 'kn-pill--line'}`}
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
