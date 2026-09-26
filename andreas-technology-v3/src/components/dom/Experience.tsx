'use client'

import { useContent } from '@/hooks/useContent'
import { motion } from 'motion/react'
import { useState } from 'react'
import type { Experience as ExperienceType, Education as EducationType } from '@/data/content'
import SectionHeading from '@/components/ui/SectionHeading'
import Modal from '@/components/ui/Modal'
import { EASE_OUT } from '@/utils/motion'
import { shortPeriod } from '@/utils/period'

type Entry =
    | { type: 'work'; item: ExperienceType; index: number }
    | { type: 'edu'; item: EducationType; index: number }

const pad = (n: number) => String(n).padStart(2, '0')

const rowReveal = (index: number) => ({
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.6, ease: EASE_OUT, delay: Math.min(index, 6) * 0.04 },
})

const WORK_COLS = 'grid-cols-[2.25rem_1fr] md:grid-cols-[2.5rem_minmax(0,1.3fr)_minmax(0,1fr)_8.5rem]'
const EDU_COLS = 'grid-cols-[2.25rem_1fr_auto] md:grid-cols-[2.5rem_minmax(0,1fr)_8.5rem]'

function TableHead({ label, count, cols, columns }: { label: string; count: number; cols: string; columns: React.ReactNode }) {
    return (
        <div>
            <div className="flex items-baseline justify-between rule-t-strong pt-2.5 pb-3">
                <span className="text-base font-medium tracking-[-0.01em]">{label}</span>
                <span className="meta tabular">{pad(count)}</span>
            </div>
            <div className={`hidden md:grid ${cols} gap-x-3 rule-b pb-1.5 meta`} aria-hidden="true">
                {columns}
            </div>
        </div>
    )
}

export default function Experience() {
    const t = useContent()
    const [active, setActive] = useState<Entry | null>(null)
    const tbl = t.editorial.table

    return (
        <section className="w-full md:h-full flex flex-col px-4 md:px-10 pt-16 pb-14 md:pt-5 md:pb-6">
            <SectionHeading id="experience" index={3} label={t.nav.experience} title={t.editorial.sections.experience} subtitle={t.experienceSection.subtitle} />

            <div className="flex-1 min-h-8 md:min-h-4" />

            <div className="grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6 gap-y-12">
                {/* Professional */}
                <div className="col-span-4 md:col-span-7">
                    <TableHead
                        label={t.experienceSection.professional}
                        count={t.experience.length}
                        cols={WORK_COLS}
                        columns={
                            <>
                                <span>{tbl.no}</span>
                                <span>{tbl.role}</span>
                                <span>{tbl.company}</span>
                                <span className="text-right">{tbl.period}</span>
                            </>
                        }
                    />
                    <ul>
                        {t.experience.map((exp, idx) => (
                            <motion.li key={`${exp.role}-${idx}`} {...rowReveal(idx)} className="rule-b">
                                <button
                                    type="button"
                                    onClick={() => setActive({ type: 'work', item: exp, index: idx })}
                                    aria-label={`${exp.role} — ${exp.company}, ${exp.duration}`}
                                    data-cursor={t.cursor.open}
                                    className={`index-row w-full text-left grid ${WORK_COLS} gap-x-3 items-start py-2 md:py-[0.55rem]`}
                                >
                                    <span className="index text-body-sm">{pad(idx + 1)}</span>
                                    <span className="row-title text-[0.9375rem] md:text-sm font-medium leading-snug">
                                        {exp.role}
                                        <span className="row-arrow ml-1.5 text-[var(--accent-ink)]" aria-hidden="true">→</span>
                                    </span>
                                    <span className="col-start-2 md:col-start-auto text-body-sm text-[var(--muted)] leading-snug">{exp.company}</span>
                                    <span className="col-start-2 md:col-start-auto text-body-sm text-[var(--muted)] tabular md:text-right leading-snug">{shortPeriod(exp.duration)}</span>
                                </button>
                            </motion.li>
                        ))}
                    </ul>
                </div>

                {/* Education & credentials */}
                <div className="col-span-4 md:col-span-5">
                    <TableHead
                        label={t.experienceSection.education}
                        count={t.education.length}
                        cols={EDU_COLS}
                        columns={
                            <>
                                <span>{tbl.no}</span>
                                <span>{tbl.credential}</span>
                                <span className="text-right">{tbl.period}</span>
                            </>
                        }
                    />
                    <ul>
                        {t.education.map((edu, idx) => (
                            <motion.li key={`${edu.degree}-${idx}`} {...rowReveal(idx)} className="rule-b index-row">
                                <div className={`grid ${EDU_COLS} gap-x-3 items-start py-2 md:py-[0.55rem]`}>
                                    <span className="index text-body-sm">{pad(idx + 1)}</span>
                                    <span className="row-title min-w-0">
                                        <button
                                            type="button"
                                            onClick={() => setActive({ type: 'edu', item: edu, index: idx })}
                                            aria-label={`${edu.degree} — ${edu.institution}, ${edu.duration}`}
                                            data-cursor={t.cursor.open}
                                            className="row-cover text-left text-[0.9375rem] md:text-sm font-medium leading-snug"
                                        >
                                            {edu.badge && (
                                                <span className={`inline-block mr-1.5 px-1 py-px text-micro font-semibold uppercase tracking-[0.05em] align-[0.1em] ${edu.featured ? 'bg-[var(--accent)] text-[#111111]' : 'border border-[var(--rule)]'}`}>
                                                    {edu.badge}
                                                </span>
                                            )}
                                            {edu.degree}
                                        </button>
                                        <span className="block text-body-sm text-[var(--muted)] leading-snug">
                                            {edu.institution}
                                        </span>
                                    </span>
                                    <span className="relative z-10 flex flex-col items-end gap-0.5 text-right">
                                        <span className="text-body-sm text-[var(--muted)] tabular leading-snug whitespace-nowrap">{shortPeriod(edu.duration)}</span>
                                        {edu.link && (
                                            <a
                                                href={edu.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                data-cursor={t.cursor.verify}
                                                aria-label={`${t.experienceSection.verify}: ${edu.degree}`}
                                                className="arrow-link text-caption font-semibold uppercase tracking-[0.05em] hover:text-[var(--accent-ink)] transition-colors whitespace-nowrap"
                                            >
                                                <span className="link-underline">{t.experienceSection.verify}</span>{' '}
                                                <span className="arrow arrow-ne" aria-hidden="true">↗</span>
                                            </a>
                                        )}
                                    </span>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </div>

            <Modal
                open={Boolean(active)}
                onClose={() => setActive(null)}
                labelledBy="career-modal-title"
                closeLabel={t.projectsSection.close}
                className="max-w-xl w-full p-6 md:p-8"
            >
                {active?.type === 'work' && (
                    <>
                        <p className="meta mb-3">
                            <span className="index">({pad(active.index + 1)})</span> {t.experienceSection.professional}
                        </p>
                        <h3 id="career-modal-title" className="display text-3xl md:text-[2.25rem] pr-16 mb-3">{active.item.role}</h3>
                        <p className="text-sm text-[var(--muted)] mb-5">
                            {active.item.company} <span aria-hidden="true">·</span> <span className="tabular">{active.item.duration}</span>
                        </p>
                        <ol className="text-sm">
                            {active.item.tasks.map((task, i) => (
                                <li key={i} className="rule-t grid grid-cols-[2rem_1fr] py-2">
                                    <span className="index tabular">{pad(i + 1)}</span>
                                    <span className="leading-relaxed">{task}</span>
                                </li>
                            ))}
                        </ol>
                    </>
                )}
                {active?.type === 'edu' && (
                    <>
                        <p className="meta mb-3">
                            <span className="index">({pad(active.index + 1)})</span> {t.experienceSection.education}
                            {active.item.badge && <> · {active.item.badge}</>}
                        </p>
                        <h3 id="career-modal-title" className="display text-3xl md:text-[2.25rem] pr-16 mb-3">{active.item.degree}</h3>
                        <p className="text-sm text-[var(--muted)] mb-5">
                            {active.item.institution} <span aria-hidden="true">·</span> <span className="tabular">{active.item.duration}</span>
                        </p>
                        {active.item.details.length > 0 && (
                            <ol className="text-sm mb-6">
                                {active.item.details.map((detail, i) => (
                                    <li key={i} className="rule-t grid grid-cols-[2rem_1fr] py-2">
                                        <span className="index tabular">{pad(i + 1)}</span>
                                        <span className="leading-relaxed">{detail}</span>
                                    </li>
                                ))}
                            </ol>
                        )}
                        {active.item.link && (
                            <a
                                href={active.item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-cursor={t.cursor.verify}
                                className="arrow-link inline-flex items-center gap-3 bg-[var(--foreground)] text-[var(--background)] px-5 py-3 text-sm font-medium hover:bg-[var(--accent-ink)] transition-colors"
                            >
                                {t.experienceSection.verify}
                                <span className="arrow arrow-ne" aria-hidden="true">↗</span>
                            </a>
                        )}
                    </>
                )}
            </Modal>
        </section>
    )
}
