'use client'

import { useContent } from '@/hooks/useContent'
import { useFitText } from '@/hooks/useFitText'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import type { Experience as ExperienceType, Education as EducationType } from '@/data/content'
import Panel from '@/components/ui/Panel'
import RollText from '@/components/ui/RollText'
import SectionHeading, { SPLIT_TITLE } from '@/components/ui/SectionHeading'
import { yearSpan } from '@/utils/period'
import { EASE_OUT, FADE_UP, WIPE_FROM_LEFT } from '@/utils/motion'

type Track = 'work' | 'education'

interface Entry {
    title: string
    org: string
    duration: string
    points: string[]
    badge?: string
    link?: string
    featured?: boolean
}

const fromWork = (e: ExperienceType): Entry => ({ title: e.role, org: e.company, duration: e.duration, points: e.tasks })
const fromEducation = (e: EducationType): Entry => ({
    title: e.degree,
    org: e.institution,
    duration: e.duration,
    points: e.details,
    badge: e.badge,
    link: e.link,
    featured: e.featured,
})

const pad = (n: number) => String(n).padStart(2, '0')

/** "September 2024 – May 2026" → "2024". The numeral is the start of the story. */
const startYear = (duration: string) => duration.match(/\d{4}/)?.[0] ?? duration

/** Details of one entry: the specimen card, used in the cobalt pane and in the mobile accordion. */
function EntryDetail({ entry, verifyLabel }: { entry: Entry; verifyLabel: string }) {
    return (
        <>
            <h3 className="font-display font-extrabold tracking-[-0.03em] leading-[1.02] text-[clamp(1.375rem,2vw,2rem)]">
                {entry.title}
            </h3>
            <p className="mt-2 meta flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{entry.org}</span>
                {entry.badge && <span className="px-1.5 py-0.5 shadow-[inset_0_0_0_1px_currentColor] font-semibold">{entry.badge}</span>}
            </p>
            <ul className="mt-5 border-t border-[var(--line)]">
                {entry.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 py-2 border-b border-[var(--line)] text-body-sm leading-snug">
                        <span className="w-1.5 h-1.5 mt-[0.45em] bg-current shrink-0" aria-hidden="true" />
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
            {entry.link && (
                <a href={entry.link} target="_blank" rel="noopener noreferrer" className="btn btn-paper mt-5 self-start">
                    <RollText>{verifyLabel}</RollText>
                    <span aria-hidden="true">↗</span>
                </a>
            )}
        </>
    )
}

/**
 * Experience — the selected entry in a cobalt block on the left, its start year set as a
 * huge numeral; on the paper side a Swiss index table (No. / Role — Company / Year) of
 * every role or credential. Work and education are two tabs of the same table. On mobile
 * the block folds into the table as an accordion.
 */
export default function Experience() {
    const t = useContent()
    const [track, setTrack] = useState<Track>('work')
    const [active, setActive] = useState(0)
    const fit = useFitText(1, { maxVh: 21, maxPx: 260 })

    const entries = track === 'work' ? t.experience.map(fromWork) : t.education.map(fromEducation)
    const current = entries[Math.max(0, active)] ?? entries[0]
    const tabs: [Track, string, number][] = [
        ['work', t.experienceSection.professional, t.experience.length],
        ['education', t.experienceSection.education, t.education.length],
    ]
    const head = t.editorial.table
    const nowLabel = t.editorial.meta.now

    const choose = (index: number) => {
        // Mobile accordion: tapping the open row closes it. Desktop always shows one.
        const isDesktop = window.matchMedia('(min-width: 64rem)').matches
        setActive(!isDesktop && index === active ? -1 : index)
    }

    return (
        <Panel id="experience" label={t.editorial.sections.experience} className="flex flex-col-reverse md:flex-row">
            {/* ── Cobalt: the selected entry (desktop) ───────────────── */}
            <motion.div
                variants={WIPE_FROM_LEFT}
                id="experience-detail"
                aria-live="polite"
                className="surface-block hidden md:flex md:w-[46%] flex-col px-[var(--gutter)] pt-5 pb-8 overflow-hidden"
            >
                <div className="rule-t-strong pt-2.5 flex items-baseline justify-between gap-4">
                    <span className="meta">{track === 'work' ? t.experienceSection.professional : t.experienceSection.education}</span>
                    <span className="meta tabular">{pad(active + 1)} / {pad(entries.length)}</span>
                </div>

                {/* The numeral box stays mounted (tabular digits, constant width) so it is
                    fitted once; only the digits inside roll when the selection changes. */}
                <div ref={fit.box(0)} className="w-full mt-4 overflow-hidden" aria-hidden="true">
                    <span ref={fit.text(0)} className="font-display tabular-nums inline-grid whitespace-nowrap text-[clamp(6rem,14vw,14rem)] pt-[0.04em] pr-[0.05em]">
                        <AnimatePresence initial={false}>
                            <motion.span
                                key={`${track}-${active}`}
                                className="col-start-1 row-start-1"
                                initial={{ y: '100%' }}
                                animate={{ y: '0%' }}
                                exit={{ y: '-100%' }}
                                transition={{ duration: 0.55, ease: EASE_OUT }}
                            >
                                {startYear(current.duration)}
                            </motion.span>
                        </AnimatePresence>
                    </span>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={`${track}-${active}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: EASE_OUT }}
                        className="flex flex-col flex-1 min-h-0"
                    >
                        <p className="meta text-[var(--foreground)] mt-3 mb-6 flex items-center gap-3">
                            <span className="h-[2px] w-8 bg-white" aria-hidden="true" />
                            {current.duration}
                        </p>
                        <EntryDetail entry={current} verifyLabel={t.experienceSection.verify} />
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* ── Paper: the index table ──────────────────────────────── */}
            <div className="surface-page md:w-[54%] flex flex-col justify-between gap-8 px-4 md:px-[var(--gutter)] pt-12 pb-14 md:pt-5 md:pb-8">
                <SectionHeading
                    id="experience"
                    anchor={false}
                    compact
                    heavy
                    index={3}
                    label={t.nav.experience}
                    title={t.editorial.sections.experience}
                    subtitle={t.experienceSection.subtitle}
                    sizeClass={SPLIT_TITLE}
                />

                <motion.div variants={FADE_UP} custom={0.45}>
                    <div role="tablist" aria-label={t.experienceSection.subtitle} className="flex gap-0 mb-5 shadow-[inset_0_0_0_1px_var(--foreground)] w-max">
                        {tabs.map(([id, label, count]) => {
                            const selected = track === id
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected}
                                    aria-controls="experience-list"
                                    onClick={() => { setTrack(id); setActive(0) }}
                                    className={`eyebrow px-4 h-9 flex items-center gap-2 transition-colors duration-300 ${selected ? 'bg-[var(--foreground)] text-[var(--background)] [--focus:var(--accent)]' : 'hover:bg-[var(--block)] hover:text-[var(--on-block)]'}`}
                                >
                                    {label}
                                    <span className="tabular opacity-70">{pad(count)}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Column heads on the same grid as the rows. */}
                    <div className="hidden md:grid grid-cols-[2.25rem_1fr_7.5rem] gap-4 pb-2 border-b border-[var(--rule-strong)]" aria-hidden="true">
                        <span className="meta">{head.no}</span>
                        <span className="meta">{track === 'work' ? `${head.role} — ${head.company}` : `${head.credential} — ${head.institution}`}</span>
                        <span className="meta text-right">{head.year}</span>
                    </div>

                    <ol id="experience-list" role="tabpanel" className="max-md:border-t max-md:border-[var(--rule-strong)]">
                        {entries.map((entry, index) => {
                            const isActive = index === active
                            return (
                                <li key={`${track}-${entry.title}`}>
                                    <button
                                        type="button"
                                        onClick={() => choose(index)}
                                        onMouseEnter={() => { if (window.matchMedia('(min-width: 64rem) and (hover: hover)').matches) setActive(index) }}
                                        data-active={isActive}
                                        aria-current={isActive ? 'true' : undefined}
                                        aria-expanded={isActive}
                                        aria-controls="experience-detail"
                                        className={`index-row w-full text-left grid grid-cols-[2rem_1fr_auto] md:grid-cols-[2.25rem_1fr_7.5rem] items-baseline gap-3 md:gap-4 py-2.5 short:py-2 border-b border-[var(--line)] focus-visible:outline-offset-[-4px]`}
                                    >
                                        <span className="meta index">{pad(index + 1)}</span>
                                        <span className="row-title min-w-0">
                                            <span className="flex items-center gap-2 min-w-0">
                                                <span className="font-semibold text-sm md:text-[0.9375rem] leading-tight truncate">{entry.title}</span>
                                                {entry.featured && <span className="eyebrow shrink-0 px-1.5 py-0.5 shadow-[inset_0_0_0_1px_currentColor]">{entry.badge}</span>}
                                            </span>
                                            <span className="block text-body-sm text-[var(--muted)] truncate mt-0.5">{entry.org}</span>
                                        </span>
                                        <span className="text-body-sm tabular text-right whitespace-nowrap">
                                            <span className="hidden md:inline">{yearSpan(entry.duration, nowLabel)}</span>
                                            <span className="md:hidden" aria-hidden="true"><i className={`fas ${isActive ? 'fa-minus' : 'fa-plus'} text-caption`} /></span>
                                        </span>
                                    </button>

                                    {/* Mobile accordion: the cobalt block opens under its row. */}
                                    {isActive && (
                                        <div className="md:hidden surface-block flex flex-col px-4 pt-2 pb-6">
                                            <p className="meta mb-4">{entry.duration}</p>
                                            <EntryDetail entry={entry} verifyLabel={t.experienceSection.verify} />
                                        </div>
                                    )}
                                </li>
                            )
                        })}
                    </ol>
                </motion.div>
            </div>
        </Panel>
    )
}
