'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Project, Content } from '@/data/content'
import { useTilt } from '@/hooks/useTilt'
import { useHaptics } from '@/hooks/useHaptics'
import { startViewTransition } from '@/utils/view-transition'

/**
 * Which tiles run full-width. Derived from the index alone so the rhythm is identical on
 * every render and in both languages — a random or content-length-based pattern would
 * reshuffle the grid when the user switches to Greek.
 */
function isFeatureTile(index: number): boolean {
    return index === 0 || index % 5 === 3
}

interface TileProps {
    project: Project
    index: number
    expanded: boolean
    onToggle: () => void
    labels: Content['projectsSection']
}

function BentoTile({ project, index, expanded, onToggle, labels }: TileProps) {
    const feature = isFeatureTile(index)
    const { ref, onPointerMove, onPointerLeave } = useTilt<HTMLDivElement>(!expanded)
    const panelId = `bento-panel-${index}`

    return (
        <div
            ref={ref}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            /*
             * `scroll-mt-24` keeps a tile from settling underneath the fixed top nav when it
             * is scrolled into view — otherwise the first tap after an expand lands on the
             * nav bar instead of the tile.
             */
            className={`tilt-surface liquid-glass group relative flex flex-col overflow-hidden rounded-2xl scroll-mt-24 ${
                feature || expanded ? 'col-span-2' : 'col-span-1'
            }`}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={expanded}
                aria-controls={panelId}
                className="flex w-full flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-2xl"
            >
                {project.image && (
                    <div className={`relative w-full overflow-hidden ${feature || expanded ? 'h-40' : 'h-28'}`}>
                        <Image
                            src={project.image}
                            alt=""
                            fill
                            sizes="(max-width: 1024px) 50vw, 400px"
                            className="object-cover transition-transform duration-500 group-active:scale-105"
                        />
                        <span className="absolute top-2 right-2 font-mono text-xs font-bold text-[var(--accent)]">
                            {(index + 1).toString().padStart(2, '0')}
                        </span>
                    </div>
                )}

                <div className="flex flex-1 flex-col p-3.5">
                    <h3 className={`font-black uppercase tracking-tight text-[var(--accent)] ${feature ? 'text-base' : 'text-sm'} line-clamp-2`}>
                        {project.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-1">
                        {project.tags.slice(0, feature ? 3 : 2).map((tag, i) => (
                            <span key={i} className="border border-[var(--foreground)]/40 px-1.5 py-0.5 font-mono text-[9px] text-[var(--foreground)]">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* The affordance is permanently visible — hover does not exist here. */}
                    <span className="mt-3 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)] opacity-80">
                        {expanded ? labels.close : labels.details}
                        <i className={`fas fa-chevron-down text-[9px] transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </span>
                </div>
            </button>

            {/*
              Kept mounted and collapsed with grid-template-rows rather than unmounted, so the
              expansion animates and assistive tech can still reach the content when open.
            */}
            <div
                id={panelId}
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
                <div className="overflow-hidden">
                    <div className="border-t border-[var(--foreground)]/15 px-3.5 pb-4 pt-3">
                        <p className="text-xs leading-relaxed text-[var(--foreground)] opacity-85">
                            {project.detail ?? project.description}
                        </p>

                        {project.highlights && project.highlights.length > 0 && (
                            <ul className="mt-3 space-y-1.5">
                                {project.highlights.slice(0, 3).map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-[11px] leading-relaxed text-[var(--foreground)] opacity-85">
                                        <i className="fas fa-check mt-0.5 shrink-0 text-[9px] text-[var(--accent)]" aria-hidden="true" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                            {project.liveSiteLink && (
                                <a
                                    href={project.liveSiteLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex min-h-[44px] items-center gap-1.5 bg-[var(--accent)] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--background)]"
                                >
                                    <i className="fas fa-external-link-alt" aria-hidden="true" /> {labels.live}
                                </a>
                            )}
                            {project.githubLink && (
                                <a
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex min-h-[44px] items-center gap-1.5 border border-[var(--foreground)] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)]"
                                >
                                    <i className="fab fa-github" aria-hidden="true" /> {labels.code}
                                </a>
                            )}
                            {project.reportLink && (
                                <a
                                    href={project.reportLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex min-h-[44px] items-center gap-1.5 border border-[var(--foreground)] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)]"
                                >
                                    <i className="fas fa-file-lines" aria-hidden="true" /> {labels.report}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface ProjectsBentoProps {
    projects: Project[]
    labels: Content['projectsSection']
}

/**
 * Mobile projects view: a bento grid whose tiles expand in place.
 *
 * Replaces the horizontal rail below 1024px. The rail asks a phone user to discover a
 * sideways scroll inside a vertical page; the grid shows the whole body of work at once
 * and keeps the detail attached to the tile it belongs to.
 */
export default function ProjectsBento({ projects, labels }: ProjectsBentoProps) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
    const haptics = useHaptics()

    const toggle = (index: number) => {
        haptics.select()
        // The browser animates the reflow: tiles that change span slide into their new
        // position instead of teleporting.
        startViewTransition(() => {
            setExpandedIndex((current) => (current === index ? null : index))
        })
    }

    return (
        <div className="grid grid-cols-2 gap-3" data-swipe-ignore>
            {projects.map((project, index) => (
                <BentoTile
                    key={project.name}
                    project={project}
                    index={index}
                    expanded={expandedIndex === index}
                    onToggle={() => toggle(index)}
                    labels={labels}
                />
            ))}
        </div>
    )
}
