'use client'

import { useState } from 'react'
import { useContent } from '@/hooks/useContent'
import type { Skill } from '@/data/content'
import Modal from '@/components/ui/Modal'
import { Glyph } from '@/components/ui/Glyph'
import { ArrowOut, Chevron, CountUp, HEADLINE_SIZE, Headline, Rich, Rise, SLIDE_CLASS } from '@/components/ui/keynote'

/**
 * Slide 2 — "Meet Andreas." A short bio and the focus areas (hairline rows that open
 * sheets) on the left. On the right, apple.com's "by the numbers": one very large figure
 * (550+ Macs), three supporting figures under a hairline, and the credentials as quiet pills.
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

    const [lead, ...rest] = stats

    return (
        <section id="about" aria-labelledby="about-title" className={SLIDE_CLASS}>
            <div className="mx-auto w-full max-w-[71rem] grid grid-cols-1 md:grid-cols-12 gap-14 md:gap-x-[5vw]">
                <div className="md:col-span-6">
                    <Rise>
                        <p className="t-eyebrow">{k.about.eyebrow}</p>
                    </Rise>
                    <Headline id="about-title" text={k.about.headline} className={`t-headline mt-1.5 md:mt-2 ${HEADLINE_SIZE}`} />
                    <Rise delay={0.15}>
                        <p className="t-lede mt-5 md:mt-[min(1.75rem,3vh)] text-[1.0625rem] leading-[1.4] md:text-[min(1.3125rem,2.4vh)] max-w-[33rem]">
                            <Rich text={k.about.bio} />
                        </p>
                        <button type="button" onClick={() => setBioOpen(true)} className="kn-link t-body mt-4">
                            {k.about.fullStory}
                            <Chevron />
                        </button>
                    </Rise>

                    <Rise delay={0.3} className="mt-10 md:mt-[min(3rem,5.4vh)]">
                        <h3 className="t-small font-semibold text-[var(--foreground)] pb-3 border-b border-[var(--line)]">{k.about.focus}</h3>
                        <ul className="grid sm:grid-cols-2 gap-x-8">
                            {t.skills.map((skill) => (
                                <li key={skill.label} className="border-b border-[var(--line)]">
                                    <button
                                        type="button"
                                        onClick={() => setActiveSkill(skill)}
                                        className="group w-full flex items-center justify-between gap-3 py-3 md:py-[min(0.75rem,1.3vh)] text-left t-small md:text-[min(0.9375rem,1.7vh)] hover:text-[var(--accent)] transition-colors duration-300"
                                    >
                                        <span className="flex items-center gap-2.5 min-w-0">
                                            <Glyph name={skill.icon} className="w-[1.125rem] h-[1.125rem] shrink-0 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors duration-300" strokeWidth={1.5} />
                                            {skill.label}
                                        </span>
                                        <Chevron className="kn-chevron--nudge text-[var(--muted)] group-hover:text-[var(--accent)]" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </Rise>
                </div>

                {/* By the numbers: one big figure, three supporting ones, then the credentials behind them. */}
                <div className="md:col-span-6 md:pt-[min(2.4rem,4.2vh)]">
                    <dl>
                        <Rise className="flex flex-col-reverse">
                            {/* dt precedes dd in the DOM (valid <dl>); flex-col-reverse puts the number on top. */}
                            <dt className="mt-2 md:mt-3 t-lede text-[1.0625rem] md:text-[min(1.3125rem,2.4vh)]">{k.about.stats[0]}</dt>
                            <dd className="t-stat text-[5.5rem] md:text-[min(10vw,17vh)] -ml-[0.04em]">
                                <CountUp value={lead.value} suffix={lead.suffix} />
                            </dd>
                        </Rise>
                        <div className="mt-8 md:mt-[min(2.75rem,4.8vh)] pt-6 md:pt-[min(1.75rem,3vh)] border-t border-[var(--line)] grid grid-cols-3 gap-x-5 sm:gap-x-8">
                            {rest.map((stat, i) => (
                                <Rise key={i} delay={0.1 + i * 0.08} className="flex flex-col-reverse justify-end">
                                    <dt className="mt-2 t-small md:text-[min(0.9375rem,1.7vh)] text-[var(--muted)]">{k.about.stats[i + 1]}</dt>
                                    <dd className="t-stat text-[2.25rem] md:text-[min(3.9vw,6.6vh)]">
                                        <CountUp value={stat.value} suffix={stat.suffix} />
                                        {stat.unit && <span className="ml-1 text-[0.42em] tracking-[0.004em]">{stat.unit}</span>}
                                    </dd>
                                </Rise>
                            ))}
                        </div>
                    </dl>

                    <Rise delay={0.35} className="mt-9 md:mt-[min(2.75rem,4.8vh)]">
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
                    </Rise>
                </div>
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
