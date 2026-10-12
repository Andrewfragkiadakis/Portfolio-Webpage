'use client'

import { useEffect, useState } from 'react'
import { getImageProps } from 'next/image'
import { useContent } from '@/hooks/useContent'
import { useIsDesktop } from '@/hooks/useIsDesktop'
import type { KeynoteCopy, Project } from '@/data/content/types'
import Modal from '@/components/ui/Modal'
import { ProjectShot } from '@/components/ui/Device'
import { ArrowOut, Chevron, HEADER_GAP, Rise, ScaleIn, SLIDE_CLASS, SlideHeader } from '@/components/ui/keynote'
import { splitName } from '@/utils/format'

type ProjectLink = { href: string; label: string }

/** The stage never exceeds ~640px (7 of 12 columns of a 71rem column). */
const STAGE_SIZES = '(min-width: 1024px) 640px, 100vw'

/**
 * Starts loading and decoding a project's stage image (on hover, focus or click), so a
 * switch shows the new shot at once instead of an empty device frame.
 */
const decoded = new Map<string, Promise<void>>()
function preloadShot(project: Project): Promise<void> {
    if (!project.image) return Promise.resolve()
    let pending = decoded.get(project.image)
    if (!pending) {
        const sizes = project.device === 'phone' ? '720px' : STAGE_SIZES
        const { props } = getImageProps({ src: project.image, alt: '', fill: true, sizes })
        const img = new window.Image()
        img.sizes = sizes
        if (props.srcSet) img.srcset = props.srcSet
        img.src = props.src
        pending = img.decode().catch(() => {})
        decoded.set(project.image, pending)
    }
    return pending
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

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
    const isDesktop = useIsDesktop()
    const [activeIndex, setActiveIndex] = useState(0)
    // While the next shot decodes, its row already shows as selected.
    const [pendingIndex, setPendingIndex] = useState<number | null>(null)
    // The shot that is fading out, layered under the new one.
    const [previousIndex, setPreviousIndex] = useState<number | null>(null)
    // Phone panels render their content once opened, so closed rows never load images.
    const [opened, setOpened] = useState<ReadonlySet<number>>(() => new Set([0]))
    const [dialog, setDialog] = useState<Project | null>(null)

    const project = t.projects[Math.min(activeIndex, t.projects.length - 1)]
    const previous = previousIndex === null ? null : t.projects[previousIndex]
    const stageName = splitName(project.name)
    const highlighted = pendingIndex ?? activeIndex

    useEffect(() => {
        if (previousIndex === null) return
        const timer = window.setTimeout(() => setPreviousIndex(null), 260)
        return () => window.clearTimeout(timer)
    }, [previousIndex])

    const select = (index: number, row: HTMLElement) => {
        if (index === activeIndex) return
        const show = () => {
            setPendingIndex(null)
            setPreviousIndex(activeIndex)
            setActiveIndex(index)
            setOpened((set) => new Set(set).add(index))
        }
        if (!isDesktop) {
            show()
            // Opening a row below closes the one above; keep the tapped row in view.
            requestAnimationFrame(() => requestAnimationFrame(() => row.scrollIntoView({ block: 'nearest', behavior: 'smooth' })))
            return
        }
        setPendingIndex(index)
        void Promise.race([preloadShot(t.projects[index]), wait(250)]).then(show)
    }

    const shot = (item: Project) => (
        <ProjectShot
            project={item}
            sizes={STAGE_SIZES}
            className={item.device === 'phone' ? '' : item.device === 'bare' ? 'w-[86%] mb-[3%]' : 'w-full'}
            phoneClassName="w-[min(13rem,21vh)]"
        />
    )

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
                    <div className="hidden md:flex md:col-span-7 flex-col" id="project-stage">
                        <p className="sr-only" aria-live="polite">{stageName.title}</p>
                        <ScaleIn className="relative h-[min(40vh,25rem)]">
                            {previous && (
                                <div key={previous.id} aria-hidden="true" className="kn-stage-out absolute inset-0 flex items-end justify-center">
                                    <div className="relative w-[min(100%,72vh)] flex justify-center">{shot(previous)}</div>
                                </div>
                            )}
                            <div key={project.id} className="kn-stage-in absolute inset-0 flex items-end justify-center">
                                <div className="relative w-[min(100%,72vh)] flex justify-center">{shot(project)}</div>
                            </div>
                        </ScaleIn>

                        {/* Fixed-height caption, so the shot and links never jump between projects. */}
                        <Rise step={3} className="mt-[min(1.75rem,3.2vh)]">
                            <h3 className="t-title text-[clamp(1.3125rem,3.1vh,1.75rem)] truncate">{stageName.title}</h3>
                            <p className="mt-1 t-small md:text-[clamp(0.8125rem,1.7vh,0.9375rem)] text-[var(--muted)] truncate">
                                {[stageName.subtitle, project.year].filter(Boolean).join(' · ')}
                            </p>
                            <p className="mt-3 t-body md:text-[clamp(0.875rem,1.9vh,1.0625rem)] text-[var(--muted)] line-clamp-2 min-h-[2.94em] max-w-[40rem]">{project.description}</p>
                            <div className="mt-3">
                                <ProjectLinks project={project} onOpen={() => setDialog(project)} k={k.projects} newTab={k.common.newTab} />
                            </div>
                        </Rise>
                    </div>

                    {/* Line-up: a selector on desktop, an accordion on phones. */}
                    <Rise step={3} className="md:col-span-5">
                        <h3 className="t-small font-semibold pb-3">{k.projects.lineup}</h3>
                        <ul className="border-t border-[var(--line)]">
                            {t.projects.map((item, index) => {
                                const isActive = index === highlighted
                                const isOpen = index === activeIndex
                                const name = splitName(item.name)
                                const panelId = `project-panel-${item.id}`
                                const state = isDesktop
                                    ? { 'aria-pressed': isActive }
                                    : { 'aria-expanded': isOpen, 'aria-controls': panelId }
                                return (
                                    <li key={item.id} className="border-b border-[var(--line)]">
                                        <button
                                            type="button"
                                            onClick={(e) => select(index, e.currentTarget.parentElement ?? e.currentTarget)}
                                            onPointerEnter={() => { if (isDesktop) void preloadShot(item) }}
                                            onFocus={() => { if (isDesktop) void preloadShot(item) }}
                                            {...state}
                                            className="group w-full flex items-center justify-between gap-4 text-left py-3.5 md:py-[min(0.6rem,1vh)]"
                                        >
                                            <span className="t-body md:text-[clamp(0.875rem,1.9vh,1.0625rem)] min-w-0 flex flex-col min-[25rem]:flex-row min-[25rem]:items-baseline min-[25rem]:gap-2">
                                                <span className={`truncate transition-colors ${isActive ? 'font-semibold text-[var(--foreground)]' : 'text-[var(--foreground)] group-hover:text-[var(--accent)]'}`}>{name.title}</span>
                                                {name.subtitle && <span className="text-[var(--muted)] font-normal truncate">{name.subtitle}</span>}
                                            </span>
                                            <span className="t-caption tabular-nums shrink-0 text-[var(--muted)]">{item.year}</span>
                                        </button>

                                        {/* Phones: the shot and links open inline under the active row. */}
                                        <div id={panelId} className="kn-disclosure md:hidden" data-open={isOpen ? '' : undefined} inert={!isOpen}>
                                            <div>
                                                {opened.has(index) && (
                                                    <div className="pt-4 pb-7">
                                                        <ProjectShot project={item} sizes="(max-width: 1023px) 92vw, 100vw" className={item.device === 'bare' ? 'w-[88%] mx-auto' : 'w-full'} phoneClassName="w-[11rem]" />
                                                        <p className="mt-6 t-body text-[var(--muted)]">{item.description}</p>
                                                        <div className="mt-3">
                                                            <ProjectLinks project={item} onOpen={() => setDialog(item)} k={k.projects} newTab={k.common.newTab} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
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
