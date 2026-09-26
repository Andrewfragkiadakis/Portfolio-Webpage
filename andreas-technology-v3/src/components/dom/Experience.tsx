'use client'

import { useContent } from '@/hooks/useContent'
import { useCardScroll } from '@/hooks/useCardScroll'
import ScrollRail from '@/components/ui/ScrollRail'
import Window from '@/components/ui/Window'
import { GlyphTile } from '@/components/ui/AppIcon'
import Icon, { symbolFor, type SymbolName } from '@/components/ui/Icon'
import { useEffect, useState } from 'react'
import type { Experience as ExperienceType, Education as EducationType, EducationKind } from '@/data/content'

const KIND_ICON: Record<EducationKind, SymbolName> = {
    degree: 'graduationcap',
    certification: 'checkmark.seal',
    license: 'person.text.rectangle',
}

const TINT_WORK = ['#FFC173', '#F0650F'] as const
const TINT_FEATURED = ['#7CC8FF', '#1F6BF0'] as const
const TINT_EDU = ['#C79BFF', '#7437E6'] as const

const CARD = 'w-[82vw] max-w-[21rem] md:w-[21.5rem] md:max-w-none shrink-0 snap-start flex flex-col'

/** One stop on the timeline: a dot on the rail, the date, then the card. */
function Stop({ date, accent, children, marker }: { date: string; accent?: boolean; children: React.ReactNode; marker?: string }) {
    return (
        <li data-card="true" data-marker={marker} className={CARD}>
            <div className="relative h-8 flex items-center">
                <span className={`relative z-10 w-2.5 h-2.5 rounded-full ring-4 ring-[var(--window-bg)] ${accent ? 'bg-[var(--accent-brand)]' : 'bg-[var(--muted)]'}`} aria-hidden="true" />
                <span className="ml-2 os-chip h-[1.375rem] px-2.5 text-caption tabular-nums bg-[var(--window-bg)] whitespace-nowrap">{date}</span>
            </div>
            <article className="os-card flex-1 mt-2 p-4 md:p-5 short:py-4 flex flex-col">{children}</article>
        </li>
    )
}

function ExperienceCard({ exp, current }: { exp: ExperienceType; current: boolean }) {
    return (
        <Stop date={exp.duration} accent={current}>
            <div className="flex items-start gap-3 mb-3">
                <GlyphTile symbol="briefcase" tint={TINT_WORK} size={34} />
                <div className="min-w-0">
                    <h3 className="text-[0.9375rem] font-semibold tracking-[-0.01em] leading-snug">{exp.role}</h3>
                    <p className="text-body-sm text-[var(--muted)] leading-snug">{exp.company}</p>
                </div>
            </div>
            <ul className="space-y-1.5">
                {exp.tasks.map((task, ti) => (
                    <li key={ti} className="flex items-start gap-2 text-[0.78rem] leading-snug">
                        <span className="mt-[0.45em] w-1 h-1 rounded-full bg-[var(--accent-brand)] shrink-0" aria-hidden="true" />
                        <span>{task}</span>
                    </li>
                ))}
            </ul>
        </Stop>
    )
}

function EducationCard({ edu, verifyLabel, newTab, marker }: { edu: EducationType; verifyLabel: string; newTab: string; marker?: string }) {
    const featured = Boolean(edu.featured)
    const icon = featured ? 'checkmark.seal' : edu.icon ? symbolFor(edu.icon) : KIND_ICON[edu.kind ?? 'degree']
    return (
        <Stop date={edu.duration} accent={featured} marker={marker}>
            <div className="flex items-start gap-3 mb-3">
                <GlyphTile symbol={icon} tint={featured ? TINT_FEATURED : TINT_EDU} size={34} />
                <div className="min-w-0">
                    {edu.badge && <span className={`os-chip h-5 px-2 text-micro font-semibold mb-1 ${featured ? 'os-chip--accent' : ''}`}>{edu.badge}</span>}
                    <h3 className="text-[0.9375rem] font-semibold tracking-[-0.01em] leading-snug">{edu.degree}</h3>
                    <p className="text-body-sm text-[var(--muted)] leading-snug">{edu.institution}</p>
                </div>
            </div>
            <ul className="space-y-1.5 mb-4">
                {edu.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-[0.78rem] leading-snug">
                        <Icon name="checkmark" weight={2} className="text-[var(--accent)] text-[0.75rem] mt-[0.2em]" />
                        <span>{detail}</span>
                    </li>
                ))}
            </ul>
            {edu.link && (
                <a
                    href={edu.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${verifyLabel}: ${edu.degree} (${newTab})`}
                    className={`os-btn mt-auto w-full h-8 ${featured ? 'os-btn--primary' : 'os-btn--secondary'}`}
                >
                    <Icon name="checkmark.seal" className="text-[0.9375rem]" />
                    <span className="caps-gr">{verifyLabel}</span>
                </a>
            )}
        </Stop>
    )
}

export default function Experience() {
    const t = useContent()
    const { scrollContainerRef, scroll, canScrollLeft, canScrollRight, progress, ratio } = useCardScroll<HTMLOListElement>('[data-card="true"]')
    const [inEducation, setInEducation] = useState(false)

    const educationStart = () => scrollContainerRef.current?.querySelector<HTMLElement>('[data-marker="education"]')

    // Which half of the timeline is showing drives the segmented control.
    useEffect(() => {
        const container = scrollContainerRef.current
        if (!container) return
        const sync = () => {
            const start = container.querySelector<HTMLElement>('[data-marker="education"]')
            if (!start) return
            setInEducation(container.scrollLeft + container.clientWidth / 2 >= start.offsetLeft)
        }
        sync()
        container.addEventListener('scroll', sync, { passive: true })
        return () => container.removeEventListener('scroll', sync)
    }, [scrollContainerRef])

    const jump = (to: 'work' | 'education') => {
        const container = scrollContainerRef.current
        if (!container) return
        const first = container.querySelector<HTMLElement>('[data-card="true"]')
        const target = to === 'education' ? educationStart() : first
        if (!target || !first) return
        container.scrollTo({
            left: target.offsetLeft - first.offsetLeft,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        })
    }

    return (
        <Window
            wid="experience"
            app="experience"
            as="section"
            anchor="experience"
            labelledBy="experience-title"
            title={t.os.windows.experience}
            subtitle={`${t.experience.length + t.education.length} ${t.os.items}`}
            className="w-full md:max-w-[76rem] md:max-h-full"
            toolbar={
                <>
                    <div className="os-segmented" role="group" aria-label={t.experienceSection.subtitle}>
                        <button type="button" aria-pressed={!inEducation} onClick={() => jump('work')}>
                            <Icon name="briefcase" />
                            <span className="caps-gr">{t.experienceSection.professional}</span>
                        </button>
                        <button type="button" aria-pressed={inEducation} onClick={() => jump('education')}>
                            <Icon name="graduationcap" />
                            <span className="caps-gr">{t.experienceSection.education}</span>
                        </button>
                    </div>
                    <span className="hidden sm:flex items-center">
                        <button type="button" onClick={() => scroll('left')} disabled={!canScrollLeft} aria-label={t.os.aria.prev} className="os-tool">
                            <Icon name="chevron.left" />
                        </button>
                        <button type="button" onClick={() => scroll('right')} disabled={!canScrollRight} aria-label={t.os.aria.next} className="os-tool">
                            <Icon name="chevron.right" />
                        </button>
                    </span>
                </>
            }
        >
            <div className="pt-4 md:pt-5 pb-4 short:pt-3 short:pb-3">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 md:px-6">
                    <h2 id="experience-title" className="os-eyebrow caps-gr">{t.experienceSection.title}</h2>
                    <p className="text-caption uppercase tracking-[0.04em] text-[var(--muted)]">{t.experienceSection.subtitle}</p>
                </div>

                <div className="relative mt-2">
                    {/* The rail the stops sit on. */}
                    <span className="absolute left-0 right-0 top-4 h-px bg-[var(--hairline-strong)]" aria-hidden="true" />
                    <ol
                        ref={scrollContainerRef}
                        className="relative flex gap-4 overflow-x-auto no-scrollbar px-4 md:px-6 scroll-px-4 md:scroll-px-6 pb-2 items-stretch"
                        style={{ scrollSnapType: 'x mandatory', overscrollBehaviorX: 'contain' }}
                    >
                        {t.experience.map((exp, idx) => (
                            <ExperienceCard key={`exp-${idx}`} exp={exp} current={idx === 0} />
                        ))}
                        {t.education.map((edu, idx) => (
                            <EducationCard
                                key={`edu-${idx}`}
                                edu={edu}
                                verifyLabel={t.experienceSection.verify}
                                newTab={t.os.aria.newTab}
                                marker={idx === 0 ? 'education' : undefined}
                            />
                        ))}
                        <li className="w-px shrink-0" aria-hidden="true" />
                    </ol>
                </div>
                <div className="px-4 md:px-6 mt-2">
                    <ScrollRail progress={progress} ratio={ratio} />
                </div>
            </div>
        </Window>
    )
}
