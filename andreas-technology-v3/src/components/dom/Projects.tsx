'use client'

import { useContent } from '@/hooks/useContent'
import { useState } from 'react'
import type { Project } from '@/data/content'
import Modal from '@/components/ui/Modal'
import ProjectImage from '@/components/ui/ProjectImage'
import { Bento, SectionTile, Tile, TileHead, TileLink } from '@/components/ui/Bento'

/**
 * The other ten projects: a 4 × 3 block of equal tiles on the right two-thirds of the
 * panel, each with the same anatomy (framed screenshot → name → year and links). The
 * last two slots of the bottom row hold the GitHub tile instead.
 */
const FRAME = 'relative m-1.5 overflow-hidden rounded-[calc(var(--radius-tile)-0.375rem)] bg-[var(--surface-2)]'
const SMALL_AREAS = [
    'md:col-[5/7] md:row-[1/3]', 'md:col-[7/9] md:row-[1/3]', 'md:col-[9/11] md:row-[1/3]', 'md:col-[11/13] md:row-[1/3]',
    'md:col-[5/7] md:row-[3/5]', 'md:col-[7/9] md:row-[3/5]', 'md:col-[9/11] md:row-[3/5]', 'md:col-[11/13] md:row-[3/5]',
    'md:col-[5/7] md:row-[5/7]', 'md:col-[7/9] md:row-[5/7]',
]

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

                {/* Featured project: the same anatomy as the others, larger. */}
                {featured && (
                    <Tile as="article" index={1} interactive className="col-span-2 md:col-[1/5] md:row-[2/7] !p-0">
                        {openButton(featured)}
                        <div className={`${FRAME} aspect-[16/10] shrink-0`}>
                            <ProjectImage project={featured} sizes="(max-width: 1023px) 100vw, 34vw" plain />
                        </div>
                        <div className="flex-1 min-h-0 px-[var(--tile-pad)] pb-[var(--tile-pad)] pt-2 flex flex-col gap-2">
                            <TileHead label={t.projectsSection.caseStudy}>
                                {featured.year && <span className="t-label tabular-nums">{featured.year}</span>}
                            </TileHead>
                            <h3 className="text-xl md:text-[min(1.6vw,2.9vh)] font-bold tracking-[-0.025em] leading-tight el-caps">
                                {featured.name}
                            </h3>
                            <p className="t-caption line-clamp-4 short:line-clamp-2">{featured.description}</p>
                            <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
                                <ProjectLinks project={featured} live={t.projectsSection.live} code={t.projectsSection.code} />
                            </div>
                        </div>
                    </Tile>
                )}

                {/* Everything else */}
                {rest.map((project, i) => (
                    <Tile key={project.name} as="article" index={2 + i} interactive className={`col-span-1 ${SMALL_AREAS[i] ?? ''} !p-0 min-h-[14rem] md:min-h-0`}>
                        {openButton(project)}
                        <div className={`${FRAME} flex-1 min-h-0`}>
                            {project.image && (
                                <ProjectImage project={project} sizes="(max-width: 1023px) 50vw, 240px" plain containBox="inset-2" />
                            )}
                        </div>
                        <div className="px-3.5 md:px-[calc(var(--tile-pad)*0.8)] pb-2.5 short:pb-1.5 pt-1 flex flex-col">
                            <h3 className="t-title !text-[0.875rem] md:!text-[min(0.95vw,1.7vh)] truncate el-caps" title={project.name}>
                                {project.name}
                            </h3>
                            <div className="flex items-center justify-between gap-2 min-h-8 mt-0.5">
                                <span className="t-caption tabular-nums">{project.year}</span>
                                <ProjectLinks project={project} live={t.projectsSection.live} code={t.projectsSection.code} small />
                            </div>
                        </div>
                    </Tile>
                ))}
                <TileLink
                    index={3 + rest.length}
                    href="https://github.com/Andrewfragkiadakis"
                    label={`${t.projectsSection.githubCta} (GitHub profile)`}
                    className="col-span-2 md:col-[9/13] md:row-[5/7] gap-4 min-h-[9rem] md:min-h-0"
                >
                    <span className="tile-head">
                        <span className="icon-well !text-[var(--foreground)]" aria-hidden="true"><i className="fab fa-github text-lg" /></span>
                        <span className="tile-affordance" aria-hidden="true"><i className="fas fa-arrow-right -rotate-45" /></span>
                    </span>
                    <span className="block mt-auto">
                        <span className="block t-caption mb-1">github.com/Andrewfragkiadakis</span>
                        <span className="block t-title !text-xl md:!text-[min(1.6vw,2.9vh)] !font-bold el-caps">{t.projectsSection.githubCta}</span>
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
