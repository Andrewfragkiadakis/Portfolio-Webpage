'use client'

import { useState } from 'react'
import { useContent } from '@/hooks/useContent'
import type { Skill } from '@/data/content/types'
import Modal from '@/components/ui/Modal'
import { Glyph } from '@/components/ui/Glyph'
import { ArrowOut, Chevron, CountUp, HEADLINE_SIZE, Headline, Rich, Rise, SLIDE_CLASS, type Step } from '@/components/ui/keynote'

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

    const credentials = t.education.filter((e) => e.badge && e.kind && e.kind !== 'degree')

    const [lead, ...rest] = k.about.stats

    return (
        <section id="about" aria-labelledby="about-title" className={SLIDE_CLASS}>
            <div className="mx-auto w-full max-w-[71rem] grid grid-cols-1 md:grid-cols-12 gap-14 md:gap-x-[5vw]">
                <div className="md:col-span-6">
                    <Rise step={0}>
                        <p className="t-eyebrow">{k.about.eyebrow}</p>
                    </Rise>
                    <Headline id="about-title" step={1} text={k.about.headline} className={`t-headline mt-1.5 md:mt-2 ${HEADLINE_SIZE}`} />
                    <Rise step={2}>
                        <p className="t-lede mt-5 md:mt-[min(1.75rem,3vh)] text-[1.0625rem] leading-[1.4] md:text-[clamp(1.0625rem,2.4vh,1.3125rem)] max-w-[33rem]">
                            <Rich text={k.about.bio} />
                        </p>
                        <button type="button" onClick={() => setBioOpen(true)} className="kn-link t-body mt-4 min-h-11 md:min-h-0">
                            {k.about.fullStory}
                            <Chevron />
                        </button>
                    </Rise>

                    <Rise step={3} className="mt-10 md:mt-[min(3rem,5.4vh)]">
                        <h3 className="t-small font-semibold text-[var(--foreground)] pb-3 border-b border-[var(--line)]">{k.about.focus}</h3>
                        <ul className="grid sm:grid-cols-2 gap-x-8">
                            {t.skills.map((skill) => (
                                <li key={skill.id} className="border-b border-[var(--line)]">
                                    <button
                                        type="button"
                                        onClick={() => setActiveSkill(skill)}
                                        className="group w-full flex items-center justify-between gap-3 py-3 md:py-[min(0.75rem,1.3vh)] text-left t-small md:text-[clamp(0.8125rem,1.7vh,0.9375rem)] hover:text-[var(--accent)] transition-colors"
                                    >
                                        <span className="flex items-center gap-2.5 min-w-0">
                                            <Glyph name={skill.icon} className="w-[1.125rem] h-[1.125rem] shrink-0 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" strokeWidth={1.5} />
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
                    {/* Each figure is a dt/dd pair directly inside its <dl> (the Rise wrappers are
                        divs, which a <dl> allows); flex-col-reverse puts the number on top. */}
                    <dl>
                        <Rise step={2} className="flex flex-col-reverse">
                            <dt className="mt-2 md:mt-3 t-lede text-[1.0625rem] md:text-[clamp(1.0625rem,2.4vh,1.3125rem)]">{lead.label}</dt>
                            <dd className="t-stat text-[5.5rem] md:text-[clamp(4.5rem,min(10vw,17vh),9rem)] -ml-[0.04em]">
                                <CountUp value={lead.value} suffix={lead.suffix} />
                            </dd>
                        </Rise>
                    </dl>
                    <dl className="mt-8 md:mt-[min(2.75rem,4.8vh)] pt-6 md:pt-[min(1.75rem,3vh)] border-t border-[var(--line)] grid grid-cols-3 gap-x-5 sm:gap-x-8">
                            {rest.map((stat, i) => (
                                <Rise key={stat.label} step={(3 + i) as Step} className="flex flex-col-reverse justify-end">
                                    <dt className="mt-2 t-small md:text-[clamp(0.8125rem,1.7vh,0.9375rem)] text-[var(--muted)]">{stat.label}</dt>
                                    <dd className="t-stat text-[2.25rem] md:text-[clamp(2rem,min(3.9vw,6.6vh),3.5rem)]">
                                        <CountUp value={stat.value} suffix={stat.suffix} />
                                        {stat.unit && <span className="ml-1 text-[0.42em] tracking-[0.004em]">{stat.unit}</span>}
                                    </dd>
                                </Rise>
                            ))}
                    </dl>

                    <Rise step={5} className="mt-9 md:mt-[min(2.75rem,4.8vh)]">
                        <h3 className="t-small font-semibold text-[var(--foreground)] mb-3">{k.about.credentials}</h3>
                        <ul className="flex flex-wrap gap-2">
                            {credentials.map((item) => {
                                const body = (
                                    <>
                                        {item.badge}
                                        {item.link && <ArrowOut className="text-[var(--muted)]" />}
                                    </>
                                )
                                const cls = 'inline-flex items-center gap-1 h-11 md:h-8 px-3.5 rounded-full bg-[var(--surface)] t-small text-[var(--foreground)] transition-colors'
                                return (
                                    <li key={item.id}>
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
                <h2 id="bio-modal-title" className="t-headline text-[2rem] sm:text-[2.5rem] mt-1 mb-7 pr-10">{k.about.dialogTitle}</h2>
                <div className="space-y-4 t-body text-[var(--foreground)]">
                    {t.about.description.slice(0, -1).map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                </div>
                {/* The last paragraph is a run of facts ("Jamf 200 · ITIL 4 · Athens · …"): a quiet list. */}
                <ul className="mt-7 border-t border-[var(--line)] t-small text-[var(--muted)]">
                    {(t.about.description.at(-1) ?? '').split(' · ').map((fact) => (
                        <li key={fact} className="py-2.5 border-b border-[var(--line)]">{fact}</li>
                    ))}
                </ul>
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
                        <h2 id="skill-modal-title" className="t-title text-[1.75rem] mb-3 pr-10">{activeSkill.label}</h2>
                        <p className="t-body text-[var(--muted)]">{activeSkill.detail}</p>
                    </>
                )}
            </Modal>
        </section>
    )
}
