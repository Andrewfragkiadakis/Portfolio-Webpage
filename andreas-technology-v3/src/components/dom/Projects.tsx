'use client'

import { useContent } from '@/hooks/useContent'
import { useState } from 'react'
import type { Project } from '@/data/content'
import Modal from '@/components/ui/Modal'
import ProjectImage from '@/components/ui/ProjectImage'
import { Bento, SectionTile, Tile, TileLink } from '@/components/ui/Bento'

/**
 * The other ten projects: a 4 × 3 block of 2 × 2 tiles on the right two-thirds of the
 * panel. The last two slots of the bottom row hold the GitHub tile instead.
 */
const SMALL_AREAS = [
    'md:col-[5/7] md:row-[1/3]', 'md:col-[7/9] md:row-[1/3]', 'md:col-[9/11] md:row-[1/3]', 'md:col-[11/13] md:row-[1/3]',
    'md:col-[5/7] md:row-[3/5]', 'md:col-[7/9] md:row-[3/5]', 'md:col-[9/11] md:row-[3/5]', 'md:col-[11/13] md:row-[3/5]',
    'md:col-[5/7] md:row-[5/7]', 'md:col-[7/9] md:row-[5/7]',
]

const pad = (n: number) => String(n).padStart(2, '0')

function statusesOf(project: Project) {
    return [
        project.liveSiteLink && { label: 'LIVE', accent: true },
        project.githubLink && { label: 'OSS', accent: false },
        (project.reportLink || project.publicationLink) && { label: 'PAPER', accent: false },
    ].filter(Boolean) as { label: string; accent: boolean }[]
}

function ProjectLinks({ project, live, code, small = false }: { project: Project; live: string; code: string; small?: boolean }) {
    const cls = small
        ? 'w-8 h-8 rounded-full bg-[var(--fill)] flex items-center justify-center text-caption hover:bg-[var(--accent-fill)] hover:text-white transition-colors duration-300'
        : 'pill pill--quiet !min-h-9 !text-body-sm'
    return (
        <span className="tile-above flex items-center gap-1.5">
            {project.liveSiteLink && (
                <a href={project.liveSiteLink} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} — ${live}`} className={cls}>
                    <i className="fas fa-arrow-up-right-from-square" aria-hidden="true" />
                    {!small && <span>{live}</span>}
                </a>
            )}
            {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} — ${code}`} className={cls}>
                    <i className="fab fa-github" aria-hidden="true" />
                    {!small && <span>{code}</span>}
                </a>
            )}
        </span>
    )
}

export default function Projects() {
    const t = useContent()
    const [activeProject, setActiveProject] = useState<Project | null>(null)
    const [featured, ...rest] = t.projects

    const openButton = (project: Project) =>
        project.detail ? (
            <button
                type="button"
                className="tile-stretch"
                onClick={() => setActiveProject(project)}
                aria-label={`${project.name} — ${t.projectsSection.details}`}
            />
        ) : null

    return (
        <section aria-labelledby="projects-title" className="w-full h-auto md:h-full px-4 md:px-6 pt-3 md:pb-6">
            <Bento className="max-w-[112rem] mx-auto">
                <SectionTile
                    id="projects"
                    number={5}
                    title={t.projectsSection.title}
                    eyebrow={t.projectsSection.subtitle}
                    index={0}
                    className="col-span-2 md:col-[1/5] md:row-[1/2] min-h-[8rem] md:min-h-0"
                />

                {/* Featured project */}
                {featured && (
                    <Tile as="article" index={1} interactive className="col-span-2 md:col-[1/5] md:row-[2/7] !p-0">
                        {openButton(featured)}
                        <div className="relative w-full aspect-[16/10] shrink-0 overflow-hidden bg-[var(--surface-2)]">
                            <ProjectImage
                                project={featured}
                                sizes="(max-width: 1023px) 100vw, 34vw"
                                className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                            />
                            <span className="absolute top-4 left-4 chip bg-[var(--surface)]/85 backdrop-blur">
                                {t.projectsSection.caseStudy} · {pad(1)}
                            </span>
                        </div>
                        <div className="flex-1 min-h-0 p-[var(--tile-pad)] flex flex-col gap-2">
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="text-xl md:text-[min(1.75vw,3.1vh)] font-bold tracking-[-0.025em] leading-tight el-caps">
                                    {featured.name}
                                </h3>
                                {featured.year && <span className="text-sm font-semibold tabular-nums text-[var(--muted)] pt-1">{featured.year}</span>}
                            </div>
                            <p className="text-sm md:text-[min(0.95vw,1.7vh)] leading-snug text-[var(--muted)] line-clamp-3 short:line-clamp-2">{featured.description}</p>
                            {featured.highlights && (
                                <ul className="hidden md:block short:hidden space-y-1 mt-1">
                                    {featured.highlights.slice(0, 3).map((item) => (
                                        <li key={item} className="flex items-start gap-2 text-[min(0.9vw,1.6vh)] leading-snug">
                                            <i className="fas fa-check text-[var(--accent)] text-[0.625rem] mt-[0.35em] shrink-0" aria-hidden="true" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div className="flex flex-wrap items-center justify-between gap-3 mt-auto pt-1">
                                <span className="flex flex-wrap gap-1.5">
                                    {featured.tags.slice(0, 3).map((tag) => (
                                        <span key={tag} className="chip normal-case tracking-normal font-medium">{tag}</span>
                                    ))}
                                </span>
                                <ProjectLinks project={featured} live={t.projectsSection.live} code={t.projectsSection.code} />
                            </div>
                        </div>
                    </Tile>
                )}

                {/* Everything else */}
                {rest.map((project, i) => {
                    const statuses = statusesOf(project)
                    return (
                        <Tile key={project.name} as="article" index={2 + i} interactive className={`col-span-1 ${SMALL_AREAS[i] ?? ''} !p-0`}>
                            {openButton(project)}
                            <div className="relative w-full aspect-[16/10] md:aspect-auto md:flex-1 min-h-0 overflow-hidden bg-[var(--surface-2)]">
                                {project.image && (
                                    <ProjectImage
                                        project={project}
                                        sizes="(max-width: 1023px) 50vw, 240px"
                                        className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                                    />
                                )}
                                <span className="absolute top-2.5 left-2.5 chip !px-2 bg-[var(--surface)]/85 backdrop-blur tabular-nums">{pad(i + 2)}</span>
                            </div>
                            <div className="px-3.5 pt-2.5 pb-3 flex flex-col gap-1.5">
                                <h3 className="text-[0.8125rem] md:text-[min(0.9vw,1.6vh)] font-semibold leading-tight line-clamp-2 el-caps min-h-[2.5em]">
                                    {project.name}
                                </h3>
                                <div className="flex items-center justify-between gap-2 min-h-8">
                                    <span className="flex flex-wrap items-center gap-x-1 min-w-0 text-[0.625rem] font-semibold tracking-wide text-[var(--muted)] tabular-nums">
                                        {project.year}
                                        {statuses.map((st) => (
                                            <span key={st.label} className={st.accent ? 'text-[var(--accent)]' : ''}>· {st.label}</span>
                                        ))}
                                    </span>
                                    <ProjectLinks project={project} live={t.projectsSection.live} code={t.projectsSection.code} small />
                                </div>
                            </div>
                        </Tile>
                    )
                })}
                <TileLink
                    index={3 + rest.length}
                    tone="ink"
                    href="https://github.com/Andrewfragkiadakis"
                    label={`${t.projectsSection.githubCta} (GitHub profile)`}
                    className="col-span-2 md:col-[9/13] md:row-[5/7] justify-between gap-4 min-h-[9rem] md:min-h-0"
                >
                    <span className="flex items-start justify-between gap-3">
                        <i className="fab fa-github text-4xl md:text-[min(3.2vw,5.6vh)]" aria-hidden="true" />
                        <span className="tile-affordance" aria-hidden="true"><i className="fas fa-arrow-right -rotate-45" /></span>
                    </span>
                    <span className="block">
                        <span className="block eyebrow normal-case tracking-normal mb-1">github.com/Andrewfragkiadakis</span>
                        <span className="block text-xl md:text-[min(1.7vw,3vh)] font-bold tracking-[-0.025em] leading-tight el-caps">{t.projectsSection.githubCta}</span>
                    </span>
                </TileLink>
            </Bento>

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
                            <div className="relative aspect-[16/10] max-h-[45vh] w-full overflow-hidden bg-[var(--surface-2)]">
                                <ProjectImage project={activeProject} sizes="(max-width: 767px) 100vw, 672px" />
                            </div>
                        )}

                        <div className="p-7 sm:p-9">
                            <div className="flex items-baseline justify-between gap-4 mb-2">
                                <h3 id="project-modal-title" className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight el-caps">
                                    {activeProject.name}
                                </h3>
                                {activeProject.year && (
                                    <span className="text-sm font-semibold tabular-nums text-[var(--muted)] shrink-0">
                                        {activeProject.year}
                                    </span>
                                )}
                            </div>

                            {activeProject.role && (
                                <p className="text-sm font-medium text-[var(--muted)] mb-5">
                                    {t.projectsSection.roleLabel}: {activeProject.role}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-1.5 mb-5">
                                {activeProject.tags.map((tag, i) => (
                                    <span key={i} className="chip normal-case tracking-normal font-medium">{tag}</span>
                                ))}
                            </div>

                            <p className="text-[0.95rem] leading-relaxed mb-6">
                                {activeProject.detail}
                            </p>

                            {activeProject.highlights && activeProject.highlights.length > 0 && (
                                <div className="mb-7">
                                    <h4 className="eyebrow el-caps mb-3">{t.projectsSection.highlightsLabel}</h4>
                                    <ul className="space-y-2">
                                        {activeProject.highlights.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-[0.95rem]">
                                                <i className="fas fa-check text-[var(--accent)] text-caption mt-1.5 shrink-0" aria-hidden="true" />
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 pt-5 border-t border-[var(--line)]">
                                {activeProject.liveSiteLink && (
                                    <a href={activeProject.liveSiteLink} target="_blank" rel="noopener noreferrer" className="pill pill--accent">
                                        <i className="fas fa-arrow-up-right-from-square" aria-hidden="true" /> {t.projectsSection.live}
                                    </a>
                                )}
                                {activeProject.githubLink && (
                                    <a href={activeProject.githubLink} target="_blank" rel="noopener noreferrer" className="pill pill--quiet">
                                        <i className="fab fa-github" aria-hidden="true" /> {t.projectsSection.code}
                                    </a>
                                )}
                                {activeProject.reportLink && (
                                    <a href={activeProject.reportLink} target="_blank" rel="noopener noreferrer" className="pill pill--quiet">
                                        <i className="fas fa-file-lines" aria-hidden="true" /> {t.projectsSection.report}
                                    </a>
                                )}
                                {activeProject.publicationLink && (
                                    <a href={activeProject.publicationLink} target="_blank" rel="noopener noreferrer" className="pill pill--quiet">
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
