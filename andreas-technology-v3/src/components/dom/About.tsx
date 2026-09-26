'use client'

import { useState } from 'react'
import { useContent } from '@/hooks/useContent'
import type { Skill } from '@/data/content'
import Modal from '@/components/ui/Modal'
import { ArrowOut, Chevron, CountUp, Headline, Parallax, Rich, Rise } from '@/components/ui/keynote'

/**
 * Slide 2 — "Meet Andreas." A short bio on the left; on the right, four huge stat
 * callouts that count up, with the gradient reserved for the headline number.
 * The full bio and the four focus areas open as dialogs.
 */
export default function About() {
    const t = useContent()
    const k = t.keynote
    const [activeSkill, setActiveSkill] = useState<Skill | null>(null)
    const [bioOpen, setBioOpen] = useState(false)

    const certifications = t.education.filter((e) => e.kind === 'certification')
    const credentials = t.education.filter((e) => e.badge && e.kind && e.kind !== 'degree')

    const stats = [
        { value: 550, suffix: '+', unit: '', grad: true },
        { value: 70, suffix: '%', unit: '', grad: false },
        { value: 7, suffix: '+', unit: k.about.yearsUnit, grad: false },
        { value: certifications.length, suffix: '', unit: '', grad: false },
    ]

    return (
        <section
            id="about"
            aria-labelledby="about-title"
            className="relative w-full md:h-full flex items-center px-5 sm:px-10 md:px-[max(3rem,6vw)] py-20 md:py-0"
        >
            <div className="mx-auto w-full max-w-[76rem] grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-x-[4vw] items-center">
                <Parallax depth={-0.05} className="md:col-span-6">
                    <Rise>
                        <p className="kn-eyebrow">{k.about.eyebrow}</p>
                    </Rise>
                    <Headline
                        id="about-title"
                        text={k.about.headline}
                        className="mt-3 text-[clamp(2.5rem,11vw,4.5rem)] md:text-[min(6.2vw,10vh)]"
                    />
                    <Rise delay={0.3}>
                        <p className="kn-lede mt-6 text-[1.125rem] md:text-[min(1.45vw,2.6vh)] max-w-[34rem]">
                            <Rich text={k.about.bio} />
                        </p>
                        <button type="button" onClick={() => setBioOpen(true)} className="kn-link mt-4 text-[1.0625rem]">
                            {k.about.fullStory}
                            <Chevron />
                        </button>
                    </Rise>

                    <Rise delay={0.45} className="mt-8 md:mt-[min(4.5vh,2.5rem)] grid gap-6 sm:grid-cols-2">
                        <div>
                            <h3 className="text-caption font-semibold text-[var(--muted)] mb-3">{k.about.credentials}</h3>
                            <ul className="flex flex-wrap gap-2">
                                {credentials.map((item) => {
                                    const body = (
                                        <>
                                            {item.badge}
                                            {item.link && <ArrowOut className="opacity-70" />}
                                        </>
                                    )
                                    const cls = `inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-body-sm font-medium transition-colors duration-300 ${item.featured
                                        ? 'bg-[var(--accent-fill)] text-white hover:bg-[var(--accent-fill-hover)]'
                                        : 'bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-2)]'}`
                                    return (
                                        <li key={item.badge}>
                                            {item.link ? (
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className={cls} aria-label={`${item.degree} — ${item.institution} (${k.common.newTab})`}>
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
                            <h3 className="text-caption font-semibold text-[var(--muted)] mb-3">{k.about.focus}</h3>
                            <ul className="flex flex-col gap-1.5">
                                {t.skills.map((skill) => (
                                    <li key={skill.label}>
                                        <button type="button" onClick={() => setActiveSkill(skill)} className="kn-link text-body-sm text-left">
                                            {skill.label}
                                            <Chevron />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Rise>
                </Parallax>

                <Parallax depth={0.07} className="md:col-span-6">
                    <dl className="grid grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-10 md:gap-y-[min(6vh,3.5rem)]">
                        {stats.map((stat, i) => (
                            <Rise key={i} delay={0.15 + i * 0.1} className="border-t border-[var(--line)] pt-5 flex flex-col-reverse justify-end">
                                {/* dt precedes dd in the DOM (valid <dl>); flex-col-reverse puts the number on top. */}
                                <dt className="mt-3 text-body-sm md:text-[min(1.15vw,2vh)] font-semibold leading-snug text-[var(--foreground)] max-w-[15rem]">
                                    {k.about.stats[i]}
                                </dt>
                                <dd className="kn-numeral text-[clamp(3rem,15vw,5rem)] md:text-[min(7.2vw,12vh)]">
                                    <span className={stat.grad ? 'kn-grad' : undefined}>
                                        <CountUp value={stat.value} suffix={stat.suffix} />
                                    </span>
                                    {stat.unit && (
                                        <span className="ml-1.5 text-[0.36em] font-semibold tracking-[-0.01em] text-[var(--muted)]">{stat.unit}</span>
                                    )}
                                </dd>
                            </Rise>
                        ))}
                    </dl>
                </Parallax>
            </div>

            <Modal open={bioOpen} onClose={() => setBioOpen(false)} labelledBy="bio-modal-title" closeLabel={k.common.close} className="max-w-2xl w-full p-7 sm:p-10">
                <p className="kn-eyebrow text-body-sm">{k.about.eyebrow}</p>
                <h3 id="bio-modal-title" className="kn-title text-[1.75rem] sm:text-[2rem] mt-1 mb-6 pr-10">{k.about.dialogTitle}</h3>
                <div className="space-y-4 text-[1.0625rem] leading-relaxed text-[var(--foreground)]">
                    {t.about.description.map((paragraph, i) => (
                        <p key={i} className={i === t.about.description.length - 1 ? 'text-body-sm text-[var(--muted)] pt-2 border-t border-[var(--line)]' : undefined}>
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
                className="p-7 sm:p-9 max-w-md w-full"
            >
                {activeSkill && (
                    <>
                        <span className="w-12 h-12 rounded-2xl bg-[var(--surface)] flex items-center justify-center text-[var(--accent)] mb-5" aria-hidden="true">
                            <i className={`${activeSkill.icon} text-xl`} />
                        </span>
                        <h3 id="skill-modal-title" className="kn-title text-[1.5rem] mb-3 pr-10">{activeSkill.label}</h3>
                        <p className="text-[1.0625rem] leading-relaxed text-[var(--muted)]">{activeSkill.detail}</p>
                    </>
                )}
            </Modal>
        </section>
    )
}
