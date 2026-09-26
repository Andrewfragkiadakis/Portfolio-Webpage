'use client'

import { useState } from 'react'
import { useContent } from '@/hooks/useContent'
import type { Skill } from '@/data/content'
import Modal from '@/components/ui/Modal'
import { Glyph } from '@/components/ui/Glyph'
import { ArrowOut, Chevron, CountUp, Headline, Rich, Rise } from '@/components/ui/keynote'

/**
 * Slide 2 — "Meet Andreas." A short bio on the left; on the right, four big plain stats
 * that count up once. Credentials are quiet pills, focus areas are "›" links, and the
 * full bio and each focus area open as sheets.
 */
export default function About() {
    const t = useContent()
    const k = t.keynote
    const [activeSkill, setActiveSkill] = useState<Skill | null>(null)
    const [bioOpen, setBioOpen] = useState(false)

    const certifications = t.education.filter((e) => e.kind === 'certification')
    const credentials = t.education.filter((e) => e.badge && e.kind && e.kind !== 'degree')

    const stats = [
        { value: 550, suffix: '+', unit: '' },
        { value: 70, suffix: '%', unit: '' },
        { value: 7, suffix: '+', unit: k.about.yearsUnit },
        { value: certifications.length, suffix: '', unit: '' },
    ]

    return (
        <section
            id="about"
            aria-labelledby="about-title"
            className="relative w-full md:h-full flex items-center px-6 sm:px-10 md:px-[max(3rem,7vw)] py-24 md:py-0"
        >
            <div className="mx-auto w-full max-w-[71rem] grid grid-cols-1 md:grid-cols-12 gap-14 md:gap-x-[5vw] items-center">
                <div className="md:col-span-6">
                    <Rise>
                        <p className="t-eyebrow">{k.about.eyebrow}</p>
                    </Rise>
                    <Headline
                        id="about-title"
                        text={k.about.headline}
                        className="t-headline mt-2 text-[2.5rem] md:text-[min(4.4vw,7.2vh)]"
                    />
                    <Rise delay={0.15}>
                        <p className="t-lede mt-5 md:mt-6 text-[1.0625rem] leading-[1.4] md:text-[min(1.3125rem,2.4vh)] max-w-[33rem]">
                            <Rich text={k.about.bio} />
                        </p>
                        <button type="button" onClick={() => setBioOpen(true)} className="kn-link t-body mt-4">
                            {k.about.fullStory}
                            <Chevron />
                        </button>
                    </Rise>

                    <Rise delay={0.3} className="mt-9 md:mt-[min(3rem,5vh)] grid gap-8 sm:grid-cols-2">
                        <div>
                            <h3 className="t-small font-semibold text-[var(--foreground)] mb-3">{k.about.credentials}</h3>
                            <ul className="flex flex-wrap gap-2">
                                {credentials.map((item) => {
                                    const body = (
                                        <>
                                            {item.badge}
                                            {item.link && <ArrowOut className="text-[var(--muted)]" />}
                                        </>
                                    )
                                    const cls = 'inline-flex items-center gap-1 h-8 px-3.5 rounded-full bg-[var(--surface)] t-small text-[var(--foreground)] transition-colors duration-300'
                                    return (
                                        <li key={item.badge}>
                                            {item.link ? (
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className={`${cls} hover:bg-[var(--surface-2)]`} aria-label={`${item.degree} — ${item.institution} (${k.common.newTab})`}>
                                                    {body}
                                                </a>
                                            ) : (
                                                <span className={cls} title={`${item.degree} — ${item.institution}`}>{body}</span>
                                            )}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <div>
                            <h3 className="t-small font-semibold text-[var(--foreground)] mb-2.5">{k.about.focus}</h3>
                            <ul className="flex flex-col gap-1.5">
                                {t.skills.map((skill) => (
                                    <li key={skill.label}>
                                        <button type="button" onClick={() => setActiveSkill(skill)} className="kn-link t-small text-left">
                                            {skill.label}
                                            <Chevron />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Rise>
                </div>

                <dl className="md:col-span-6 grid grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-10 md:gap-y-[min(3.5rem,6vh)]">
                    {stats.map((stat, i) => (
                        <Rise key={i} delay={0.1 + i * 0.08} className="flex flex-col-reverse justify-end">
                            {/* dt precedes dd in the DOM (valid <dl>); flex-col-reverse puts the number on top. */}
                            <dt className="mt-2 md:mt-3 t-body md:text-[min(1.0625rem,1.9vh)] text-[var(--muted)] max-w-[15rem]">
                                {k.about.stats[i]}
                            </dt>
                            <dd className="t-stat text-[3.25rem] md:text-[min(5.5vw,9.4vh)]">
                                <CountUp value={stat.value} suffix={stat.suffix} />
                                {stat.unit && (
                                    <span className="ml-1.5 text-[0.4em] tracking-[0.004em]">{stat.unit}</span>
                                )}
                            </dd>
                        </Rise>
                    ))}
                </dl>
            </div>

            <Modal open={bioOpen} onClose={() => setBioOpen(false)} labelledBy="bio-modal-title" closeLabel={k.common.close} className="max-w-[43rem] w-full px-7 py-10 sm:px-14 sm:py-14">
                <p className="t-eyebrow">{k.about.eyebrow}</p>
                <h3 id="bio-modal-title" className="t-headline text-[2rem] sm:text-[2.5rem] mt-1 mb-7 pr-10">{k.about.dialogTitle}</h3>
                <div className="space-y-4 t-body text-[var(--foreground)]">
                    {t.about.description.map((paragraph, i) => (
                        <p key={i} className={i === t.about.description.length - 1 ? 't-small text-[var(--muted)] pt-4 border-t border-[var(--line)]' : undefined}>
                            {paragraph}
                        </p>
                    ))}
                </div>
            </Modal>

            <Modal
                open={Boolean(activeSkill)}
                onClose={() => setActiveSkill(null)}
                labelledBy="skill-modal-title"
                closeLabel={k.common.close}
                className="max-w-md w-full px-7 py-10 sm:px-10"
            >
                {activeSkill && (
                    <>
                        <Glyph name={activeSkill.icon} className="w-9 h-9 mb-5 text-[var(--foreground)]" strokeWidth={1.4} />
                        <h3 id="skill-modal-title" className="t-title text-[1.75rem] mb-3 pr-10">{activeSkill.label}</h3>
                        <p className="t-body text-[var(--muted)]">{activeSkill.detail}</p>
                    </>
                )}
            </Modal>
        </section>
    )
}
