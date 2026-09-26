'use client'

import { useContent } from '@/hooks/useContent'
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import type { Experience as ExperienceType, Education as EducationType } from '@/data/content'
import SectionHeading from '@/components/ui/SectionHeading'
import Modal from '@/components/ui/Modal'
import { EASE_OUT } from '@/utils/motion'
import { yearSpan } from '@/utils/period'

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

/** Shared by both tables so their columns line up down the page. */
const COLS = 'grid-cols-[2.25rem_1fr] md:grid-cols-[2.25rem_minmax(0,1.55fr)_minmax(0,1fr)_6.25rem]'

function TableHead({ label, count, columns }: { label: string; count: number; columns: React.ReactNode }) {
    return (
        <div>
            <div className="flex items-baseline justify-between rule-t-strong pt-2.5 pb-2.5">
                <span className="text-base font-medium tracking-[-0.01em]">{label}</span>
                <span className="meta tabular">{pad(count)}</span>
            </div>
            <div className={`hidden md:grid ${COLS} gap-x-3 rule-b pb-1.5 meta`} aria-hidden="true">
                {columns}
            </div>
        </div>
    )
}

const sameEntry = (a: Entry | null, type: Entry['type'], index: number) => a?.type === type && a.index === index

export default function Experience() {
    const t = useContent()
    const [open, setOpen] = useState<Entry | null>(null)
    const [preview, setPreview] = useState<{ type: Entry['type']; index: number }>({ type: 'work', index: 0 })
    const tbl = t.editorial.table
    const now = t.editorial.meta.now

    const current: Entry =
        preview.type === 'work'
            ? { type: 'work', item: t.experience[preview.index] ?? t.experience[0], index: preview.index }
            : { type: 'edu', item: t.education[preview.index] ?? t.education[0], index: preview.index }

    const columns = (second: string, third: string) => (
        <>
            <span>{tbl.no}</span>
            <span>{second}</span>
            <span>{third}</span>
            <span className="text-right">{tbl.year}</span>
        </>
    )

    return (
        <section className="w-full md:h-full flex flex-col px-4 md:px-10 pt-16 pb-14 md:pt-5 md:pb-6">
            <SectionHeading id="experience" index={3} label={t.nav.experience} title={t.editorial.sections.experience} subtitle={t.experienceSection.subtitle} />

            <div className="flex-1 min-h-8 md:min-h-4" />

            <div className="grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6 gap-y-10">
                <div className="col-span-4 md:col-span-8 flex flex-col gap-y-10 md:gap-y-5">
                    {/* Professional */}
                    <div>
                        <TableHead label={t.experienceSection.professional} count={t.experience.length} columns={columns(tbl.role, tbl.company)} />
                        <ul>
                            {t.experience.map((exp, idx) => (
                                <motion.li
                                    key={`${exp.role}-${idx}`}
                                    {...rowReveal(idx)}
                                    className="rule-b"
                                    onMouseEnter={() => setPreview({ type: 'work', index: idx })}
                                    onFocus={() => setPreview({ type: 'work', index: idx })}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpen({ type: 'work', item: exp, index: idx })}
                                        aria-label={`${exp.role} — ${exp.company}, ${exp.duration}`}
                                        data-active={sameEntry(current, 'work', idx) ? 'true' : undefined}
                                        className={`index-row w-full text-left grid ${COLS} gap-x-3 items-baseline py-2 md:py-[0.45rem]`}
                                    >
                                        <span className="index text-body-sm tabular">{pad(idx + 1)}</span>
                                        <span className="row-title min-w-0 text-[0.9375rem] md:text-sm font-medium leading-snug md:truncate">
                                            {exp.role}
                                        </span>
                                        <span className="col-start-2 md:col-start-auto min-w-0 text-body-sm text-[var(--muted)] leading-snug md:truncate">{exp.company}</span>
                                        <span className="col-start-2 md:col-start-auto text-body-sm text-[var(--muted)] tabular md:text-right leading-snug whitespace-nowrap">{yearSpan(exp.duration, now)}</span>
                                    </button>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    {/* Education & credentials */}
                    <div>
                        <TableHead label={t.experienceSection.education} count={t.education.length} columns={columns(tbl.credential, tbl.institution)} />
                        <ul>
                            {t.education.map((edu, idx) => (
                                <motion.li
                                    key={`${edu.degree}-${idx}`}
                                    {...rowReveal(idx)}
                                    className="rule-b"
                                    onMouseEnter={() => setPreview({ type: 'edu', index: idx })}
                                    onFocus={() => setPreview({ type: 'edu', index: idx })}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpen({ type: 'edu', item: edu, index: idx })}
                                        aria-label={`${edu.degree} — ${edu.institution}, ${edu.duration}`}
                                        data-active={sameEntry(current, 'edu', idx) ? 'true' : undefined}
                                        className={`index-row w-full text-left grid ${COLS} gap-x-3 items-baseline py-2 md:py-[0.45rem]`}
                                    >
                                        <span className="index text-body-sm tabular">{pad(idx + 1)}</span>
                                        <span className="row-title min-w-0 text-[0.9375rem] md:text-sm font-medium leading-snug md:truncate">
                                            {edu.badge && (
                                                <span className={`inline-block mr-1.5 px-1 py-px text-micro font-semibold uppercase tracking-[0.05em] align-[0.1em] border ${edu.featured ? 'border-[var(--accent-ink)] text-[var(--accent-ink)]' : 'border-[var(--rule)]'}`}>
                                                    {edu.badge}
                                                </span>
                                            )}
                                            {edu.degree}
                                        </span>
                                        <span className="col-start-2 md:col-start-auto min-w-0 text-body-sm text-[var(--muted)] leading-snug md:truncate">{edu.institution}</span>
                                        <span className="col-start-2 md:col-start-auto text-body-sm text-[var(--muted)] tabular md:text-right leading-snug whitespace-nowrap">{yearSpan(edu.duration, now)}</span>
                                    </button>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Preview column (desktop): the full entry behind the highlighted row. */}
                <aside className="hidden md:flex md:col-span-4 flex-col" aria-label={t.editorial.hoverHint}>
                    <div className="flex items-baseline justify-between rule-t-strong pt-2.5 pb-2.5">
                        <span className="meta">{current.type === 'work' ? t.experienceSection.professional : t.experienceSection.education}</span>
                        <span className="meta tabular index">({pad(current.index + 1)})</span>
                    </div>
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={`${current.type}-${current.index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, transition: { duration: 0.12 } }}
                            transition={{ duration: 0.4, ease: EASE_OUT }}
                            className="rule-t pt-3"
                        >
                            <p className="display tabular text-[clamp(2.25rem,3.6vw,3.5rem)] leading-[0.9] text-[var(--accent-ink)]">
                                {yearSpan(current.item.duration, now)}
                            </p>
                            {current.item.duration !== yearSpan(current.item.duration, now) && (
                                <p className="mt-1.5 text-body-sm text-[var(--muted)] tabular">{current.item.duration}</p>
                            )}
                            <p className="mt-4 text-lg font-medium leading-tight tracking-[-0.015em] text-balance">
                                {current.type === 'work' ? current.item.role : current.item.degree}
                            </p>
                            <p className="mt-1 text-body-sm text-[var(--muted)]">
                                {current.type === 'work' ? current.item.company : current.item.institution}
                            </p>
                            {(() => {
                                const lines = current.type === 'work' ? current.item.tasks : current.item.details
                                if (lines.length === 0) return null
                                return (
                                    <ol className="mt-4 text-body-sm">
                                        {lines.slice(0, 3).map((line, i) => (
                                            <li key={i} className="rule-t grid grid-cols-[1.75rem_1fr] py-1.5">
                                                <span className="index tabular">{pad(i + 1)}</span>
                                                <span className="leading-snug line-clamp-2">{line}</span>
                                            </li>
                                        ))}
                                    </ol>
                                )
                            })()}
                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 items-center">
                                <button
                                    type="button"
                                    onClick={() => setOpen(current)}
                                    className="arrow-link inline-flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.05em] hover:text-[var(--accent-ink)] transition-colors"
                                >
                                    <span className="link-underline">{t.projectsSection.details}</span>
                                    <span aria-hidden="true">+</span>
                                </button>
                                {current.type === 'edu' && current.item.link && (
                                    <a
                                        href={current.item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`${t.experienceSection.verify}: ${current.item.degree}`}
                                        className="arrow-link inline-flex items-center gap-1 text-caption font-semibold uppercase tracking-[0.05em] text-[var(--accent-ink)]"
                                    >
                                        <span className="link-underline">{t.experienceSection.verify}</span>
                                        <span className="arrow arrow-ne" aria-hidden="true">↗</span>
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </aside>
            </div>

            <Modal
                open={Boolean(open)}
                onClose={() => setOpen(null)}
                labelledBy="career-modal-title"
                closeLabel={t.projectsSection.close}
                className="max-w-xl w-full p-6 md:p-8"
            >
                {open?.type === 'work' && (
                    <>
                        <p className="meta mb-3">
                            <span className="index">({pad(open.index + 1)})</span> {t.experienceSection.professional}
                        </p>
                        <h3 id="career-modal-title" className="display text-3xl md:text-[2.25rem] pr-16 mb-3">{open.item.role}</h3>
                        <p className="text-sm text-[var(--muted)] mb-5">
                            {open.item.company} <span aria-hidden="true">·</span> <span className="tabular">{open.item.duration}</span>
                        </p>
                        <ol className="text-sm">
                            {open.item.tasks.map((task, i) => (
                                <li key={i} className="rule-t grid grid-cols-[2rem_1fr] py-2">
                                    <span className="index tabular">{pad(i + 1)}</span>
                                    <span className="leading-relaxed">{task}</span>
                                </li>
                            ))}
                        </ol>
                    </>
                )}
                {open?.type === 'edu' && (
                    <>
                        <p className="meta mb-3">
                            <span className="index">({pad(open.index + 1)})</span> {t.experienceSection.education}
                            {open.item.badge && <> · {open.item.badge}</>}
                        </p>
                        <h3 id="career-modal-title" className="display text-3xl md:text-[2.25rem] pr-16 mb-3">{open.item.degree}</h3>
                        <p className="text-sm text-[var(--muted)] mb-5">
                            {open.item.institution} <span aria-hidden="true">·</span> <span className="tabular">{open.item.duration}</span>
                        </p>
                        {open.item.details.length > 0 && (
                            <ol className="text-sm mb-6">
                                {open.item.details.map((detail, i) => (
                                    <li key={i} className="rule-t grid grid-cols-[2rem_1fr] py-2">
                                        <span className="index tabular">{pad(i + 1)}</span>
                                        <span className="leading-relaxed">{detail}</span>
                                    </li>
                                ))}
                            </ol>
                        )}
                        {open.item.link && (
                            <a
                                href={open.item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="arrow-link inline-flex items-center gap-3 bg-[var(--cobalt)] text-white px-5 py-3 text-sm font-medium hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
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
