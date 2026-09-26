'use client'

import { useContent } from '@/hooks/useContent'
import { useState } from 'react'
import type { Experience as ExperienceType, Education as EducationType, EducationKind } from '@/data/content'
import Modal from '@/components/ui/Modal'
import { Bento, SectionTile, Tile, type Tone } from '@/components/ui/Bento'

const KIND_ICON: Record<EducationKind, string> = {
    degree: 'fas fa-graduation-cap',
    certification: 'fas fa-award',
    license: 'fas fa-id-card',
}

const iconFor = (edu: EducationType) => edu.icon ?? KIND_ICON[edu.kind ?? 'degree']
const pad = (n: number) => String(n).padStart(2, '0')

/** Placement of the six earlier roles: two columns, three rows. */
const ROLE_AREAS = [
    'md:col-[5/9] md:row-[1/2]', 'md:col-[9/13] md:row-[1/2]',
    'md:col-[5/9] md:row-[2/3]', 'md:col-[9/13] md:row-[2/3]',
    'md:col-[5/9] md:row-[3/4]', 'md:col-[9/13] md:row-[3/4]',
]
const DEGREE_AREAS = ['md:col-[5/9] md:row-[4/5]', 'md:col-[9/13] md:row-[4/5]']
const CERT_AREAS = ['md:col-[5/7] md:row-[5/7]', 'md:col-[7/9] md:row-[5/7]', 'md:col-[9/11] md:row-[5/7]', 'md:col-[11/13] md:row-[5/7]']

const THIS_YEAR = new Date().getFullYear()

/** Year span of a role, from its human-written duration ("May 2022 – November 2025", "April 2026 – Present"). */
function yearSpan(duration: string): [number, number] {
    const years = (duration.match(/\d{4}/g) ?? []).map(Number)
    const start = years[0] ?? THIS_YEAR
    const end = years[1] ?? Math.max(THIS_YEAR, start)
    return [start, end]
}

/** "2024 – 2026" from a written duration; the dialog keeps the months. */
function yearRange(duration: string): string {
    const [start, end] = yearSpan(duration)
    return start === end ? String(start) : `${start} – ${end}`
}

/** Gantt of every role, year-granular: the whole career at a glance. Decorative — the tiles carry the words. */
function CareerChart({ roles, label }: { roles: ExperienceType[]; label: string }) {
    const spans = roles.map((r) => yearSpan(r.duration))
    const first = Math.min(...spans.map(([s]) => s))
    const last = Math.max(...spans.map(([, e]) => e)) + 1
    const range = last - first
    const ticks = Array.from({ length: range }, (_, i) => first + i)

    return (
        <>
            <div className="flex items-baseline justify-between gap-3">
                <p className="eyebrow el-caps">{label}</p>
                <p className="eyebrow tabular-nums">{first} — {last - 1}</p>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-[min(0.55vh,0.35rem)] min-h-0 py-2" aria-hidden="true">
                {spans.map(([s, e], i) => (
                    <div key={i} className="flex items-center" title={`${roles[i].role} · ${roles[i].duration}`}>
                        <div className="relative flex-1 h-[min(1.1vh,0.625rem)] min-h-1.5 rounded-full bg-[var(--fill)]">
                            <div
                                className={`absolute inset-y-0 rounded-full ${i === 0 ? 'bg-[linear-gradient(90deg,#0a5cd6,#5835c6)] dark:bg-[linear-gradient(90deg,#2f7bff,#9d7bff)] shadow-[0_0_12px_rgba(58,68,212,0.45)]' : 'bg-[var(--foreground)] opacity-30'}`}
                                style={{ left: `${((s - first) / range) * 100}%`, width: `${((e + 1 - s) / range) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex text-[0.625rem] font-semibold tabular-nums text-[var(--muted)]" aria-hidden="true">
                {ticks.map((year) => (
                    <span key={year} className="flex-1">{`’${String(year).slice(2)}`}</span>
                ))}
            </div>
        </>
    )
}

type Active = { type: 'role'; item: ExperienceType; index: number } | { type: 'edu'; item: EducationType }

export default function Experience() {
    const t = useContent()
    const [active, setActive] = useState<Active | null>(null)
    const [current, ...earlier] = t.experience
    const degrees = t.education.filter((e) => (e.kind ?? 'degree') === 'degree')
    const credentials = t.education.filter((e) => (e.kind ?? 'degree') !== 'degree')

    return (
        <section aria-labelledby="experience-title" className="w-full h-auto md:h-full px-4 md:px-6 pt-3 md:pb-6">
            <Bento className="max-w-[112rem] mx-auto">
                <SectionTile
                    id="experience"
                    number={4}
                    title={t.experienceSection.title}
                    eyebrow={t.experienceSection.subtitle}
                    index={0}
                    className="col-span-2 md:col-[1/5] md:row-[1/2] min-h-[8rem] md:min-h-0"
                />

                {/* The current role: title and its first line; the full list opens from the tile. */}
                {current && (
                    <Tile as="article" index={1} tone="fleet" interactive className="col-span-2 md:col-[1/5] md:row-[2/5] gap-3 short:gap-2">
                        <button
                            type="button"
                            className="tile-stretch"
                            onClick={() => setActive({ type: 'role', item: current, index: 1 })}
                            aria-label={`${current.role} — ${current.company} — ${t.bento.spot.role}`}
                        />
                        <div className="flex items-center justify-between gap-3">
                            <span className="chip bg-white/15">
                                <span className="live-dot" aria-hidden="true" />
                                <span className="el-caps">{current.duration}</span>
                            </span>
                            <span className="tile-affordance" aria-hidden="true">
                                <i className="fas fa-plus" />
                            </span>
                        </div>
                        <div className="mt-auto">
                            <h3 className="text-xl md:text-[min(1.75vw,3.1vh)] font-bold tracking-[-0.025em] leading-tight">{current.role}</h3>
                            <p className="mt-1 text-sm font-medium text-[var(--muted)]">{current.company}</p>
                            {current.tasks[0] && (
                                <p className="mt-4 short:mt-2 text-[0.875rem] md:text-[min(0.95vw,1.7vh)] leading-snug line-clamp-3">{current.tasks[0]}</p>
                            )}
                        </div>
                    </Tile>
                )}

                <Tile index={2} className="col-span-2 md:col-[1/5] md:row-[5/7] min-h-[13rem] md:min-h-0">
                    <CareerChart roles={t.experience} label={t.experienceSection.professional} />
                </Tile>

                {/* Earlier roles — each opens its full list of responsibilities. */}
                {earlier.map((exp, i) => (
                    <Tile key={`${exp.role}-${i}`} as="article" index={3 + i} interactive className={`col-span-2 ${ROLE_AREAS[i] ?? ''} justify-center gap-1`}>
                        <button
                            type="button"
                            className="tile-stretch"
                            onClick={() => setActive({ type: 'role', item: exp, index: i + 2 })}
                            aria-label={`${exp.role} — ${exp.company} — ${t.projectsSection.details}`}
                        />
                        <p className="text-caption font-semibold tabular-nums text-[var(--muted)]">{yearRange(exp.duration)}</p>
                        <div className="flex items-end justify-between gap-3">
                            <div className="min-w-0">
                                <h3 className="text-[0.9375rem] md:text-[min(1.02vw,1.8vh)] font-semibold leading-tight tracking-[-0.01em] line-clamp-2 short:line-clamp-1" title={exp.role}>{exp.role}</h3>
                                <p className="text-caption text-[var(--muted)] truncate mt-0.5">{exp.company}</p>
                            </div>
                            <span className="tile-affordance !w-7 !h-7" aria-hidden="true">
                                <i className="fas fa-plus text-[0.625rem]" />
                            </span>
                        </div>
                    </Tile>
                ))}

                {/* Degrees */}
                {degrees.map((edu, i) => (
                    <Tile key={edu.degree} as="article" index={9 + i} interactive className={`col-span-2 ${DEGREE_AREAS[i] ?? ''} flex-row items-center gap-3`}>
                        <button
                            type="button"
                            className="tile-stretch"
                            onClick={() => setActive({ type: 'edu', item: edu })}
                            aria-label={`${edu.degree} — ${edu.institution} — ${t.projectsSection.details}`}
                        />
                        <span className="tile-icon tile-mark" aria-hidden="true">
                            <i className={`${iconFor(edu)} text-base`} />
                        </span>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-[0.875rem] md:text-[min(0.95vw,1.7vh)] font-semibold leading-tight line-clamp-2">{edu.degree}</h3>
                            <p className="text-caption text-[var(--muted)] tabular-nums mt-0.5">{yearRange(edu.duration)}</p>
                        </div>
                    </Tile>
                ))}

                {/* Certifications and licence */}
                {credentials.map((edu, i) => {
                    const tone: Tone = edu.featured ? 'fleet' : 'plain'
                    return (
                        <Tile key={edu.degree} as="article" index={11 + i} tone={tone} interactive className={`col-span-1 ${CERT_AREAS[i] ?? ''} gap-2 min-h-[12rem] md:min-h-0`}>
                            <button
                                type="button"
                                className="tile-stretch"
                                onClick={() => setActive({ type: 'edu', item: edu })}
                                aria-label={`${edu.degree} — ${edu.institution} — ${t.projectsSection.details}`}
                            />
                            <div className="flex items-center justify-between gap-2">
                                <span className="tile-icon tile-mark !w-9 !h-9 !rounded-xl" aria-hidden="true">
                                    {edu.featured ? (
                                        <span className="block w-6 aspect-[2.875] bg-current [mask:url(/logos/jamf.svg)_no-repeat_center/contain] [-webkit-mask:url(/logos/jamf.svg)_no-repeat_center/contain]" />
                                    ) : (
                                        <i className={`${iconFor(edu)} text-sm`} />
                                    )}
                                </span>
                                <span className="text-caption font-semibold tabular-nums text-[var(--muted)]">{edu.duration}</span>
                            </div>
                            <div className="min-w-0 mt-auto">
                                {edu.badge ? (
                                    <h3 className="text-[0.9375rem] md:text-[min(1.05vw,1.85vh)] font-bold tracking-tight tile-mark leading-tight">
                                        {edu.badge}<span className="sr-only"> — {edu.degree}</span>
                                    </h3>
                                ) : (
                                    <h3 className="text-[0.875rem] md:text-[min(0.95vw,1.7vh)] font-semibold leading-tight line-clamp-3">{edu.degree}</h3>
                                )}
                            </div>
                            {edu.link && (
                                <div className="tile-above self-start">
                                    <a
                                        href={edu.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`${t.experienceSection.verify}: ${edu.degree} (opens credential)`}
                                        className={`pill !min-h-8 !px-3 !text-caption ${edu.featured ? 'pill--white' : 'pill--quiet'}`}
                                    >
                                        <i className="fas fa-certificate" aria-hidden="true" />
                                        <span className="el-caps">{t.cursor.verify}</span>
                                    </a>
                                </div>
                            )}
                        </Tile>
                    )
                })}
            </Bento>

            <Modal
                open={Boolean(active)}
                onClose={() => setActive(null)}
                labelledBy="experience-modal-title"
                closeLabel={t.projectsSection.close}
                className="max-w-lg w-full p-7 sm:p-9"
            >
                {active?.type === 'role' && (
                    <>
                        <p className="eyebrow mb-3 tabular-nums">{pad(active.index)} · <span className="el-caps">{active.item.duration}</span></p>
                        <h3 id="experience-modal-title" className="text-2xl font-bold tracking-tight leading-tight pr-10">{active.item.role}</h3>
                        <p className="mt-1 mb-6 text-sm font-medium text-[var(--muted)]">{active.item.company}</p>
                        <ul className="space-y-2.5">
                            {active.item.tasks.map((task, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-[0.95rem]">
                                    <i className="fas fa-check text-[var(--accent)] text-caption mt-1.5 shrink-0" aria-hidden="true" />
                                    <span className="leading-relaxed">{task}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {active?.type === 'edu' && (
                    <>
                        <div className="flex items-center gap-3 mb-5 pr-10">
                            <span className="tile-icon !w-12 !h-12 text-[var(--accent)]" aria-hidden="true">
                                <i className={`${iconFor(active.item)} text-lg`} />
                            </span>
                            {active.item.badge && <span className="chip text-[var(--accent)]">{active.item.badge}</span>}
                        </div>
                        <h3 id="experience-modal-title" className="text-2xl font-bold tracking-tight leading-tight">{active.item.degree}</h3>
                        <p className="mt-1 mb-6 text-sm font-medium text-[var(--muted)]">{active.item.institution} · {active.item.duration}</p>
                        <ul className="space-y-2.5">
                            {active.item.details.map((detail, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-[0.95rem]">
                                    <i className="fas fa-check text-[var(--accent)] text-caption mt-1.5 shrink-0" aria-hidden="true" />
                                    <span className="leading-relaxed">{detail}</span>
                                </li>
                            ))}
                        </ul>
                        {active.item.link && (
                            <a href={active.item.link} target="_blank" rel="noopener noreferrer" className="pill pill--accent mt-7">
                                <i className="fas fa-certificate" aria-hidden="true" />
                                <span className="el-caps">{t.experienceSection.verify}</span>
                            </a>
                        )}
                    </>
                )}
            </Modal>
        </section>
    )
}
