'use client'

import { useContent } from '@/hooks/useContent'
import { motion, useInView, useReducedMotion, animate } from 'motion/react'
import { useRef, useEffect, useState } from 'react'
import type { Skill } from '@/data/content'
import Modal from '@/components/ui/Modal'
import LogoLoop from '@/components/ui/LogoLoop'
import type { LogoItem } from '@/components/ui/LogoLoop'
import { TOOLS, type Tool } from '@/data/tools'
import ToolBadge from '@/components/ui/ToolBadge'
import SectionHeading from '@/components/ui/SectionHeading'
import { EASE_OUT } from '@/utils/motion'
import Field from '@/components/ui/Field'

/** Counts up once in view. Writes straight to the DOM so it never re-renders React per frame. */
function AnimatedCounter({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true })
    const prefersReducedMotion = useReducedMotion()

    useEffect(() => {
        const el = ref.current
        if (!el || !isInView) return
        if (prefersReducedMotion) {
            el.textContent = `${value}${suffix}`
            return
        }
        const controls = animate(0, value, {
            duration,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (latest) => { el.textContent = `${Math.round(latest)}${suffix}` },
        })
        return () => controls.stop()
    }, [isInView, value, suffix, duration, prefersReducedMotion])

    // Server/initial render shows the final value so it is correct without JS.
    return <span ref={ref}>{value}{suffix}</span>
}

const toLogos = (row: Tool['row']): LogoItem[] =>
    TOOLS.filter((tool) => tool.row === row).map((tool) => ({
        node: <ToolBadge tool={tool} />,
        title: tool.label,
    }))

const OPS_TOOLS = toLogos('ops')
const BUILD_TOOLS = toLogos('build')

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8, ease: EASE_OUT, delay },
})

const GRID = 'grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6'

export default function About() {
    const t = useContent()
    const [activeSkill, setActiveSkill] = useState<Skill | null>(null)

    const certifications = t.education.filter((e) => e.kind === 'certification')
    const certBadges = certifications.map((e) => e.badge).filter(Boolean)
    const credentials = t.education.filter((e) => e.badge && e.kind && e.kind !== 'degree')

    // Order matches t.about.statsLabels:
    // years experience · endpoints managed · faster onboarding · certifications
    const stats = [
        { value: 7, suffix: '+' },
        { value: 550, suffix: '+' },
        { value: 70, suffix: '%' },
        { value: certifications.length, suffix: '' },
    ]

    const profile: [string, string][] = [
        [t.editorial.profile.role, 'Apple Fleet & IT Automation Lead'],
        [t.editorial.profile.company, 'Omilia'],
        [t.editorial.profile.fleet, '550+ Macs'],
        [t.editorial.profile.stack, 'Jamf Pro, Python, Bash, Swift'],
        [t.editorial.profile.certs, certBadges.join(', ')],
        [t.editorial.profile.location, 'Athens, GR'],
    ]

    return (
        <section className="w-full md:h-full flex flex-col px-4 md:px-10 pt-16 pb-14 md:pt-5 md:pb-6">
            <SectionHeading id="about" index={1} label={t.nav.about} title={t.editorial.sections.about} subtitle={t.about.subtitle} />

            <div className="flex-1 min-h-8 md:min-h-4" />

            {/* The figures strip: a full-bleed cobalt field that wipes in from the left. */}
            <Field from="left" wrapperClassName="-mx-4 md:-mx-10" className="px-4 md:px-10 pt-3 pb-5 md:pt-3 md:pb-6">
                <div className={`${GRID} gap-y-6 rule-t-strong pt-2.5`}>
                    <div className="col-span-4 md:col-span-4 flex flex-col">
                        <p className="meta">{t.about.currentFocus} — {t.about.currentFocusDetail}</p>
                        <p className="mt-3 md:mt-auto text-[1.375rem] md:text-[clamp(1.375rem,2vw,2rem)] font-medium leading-[1.08] tracking-[-0.025em] text-balance max-w-[26ch]">
                            {t.about.tagline}
                        </p>
                    </div>
                    <dl className="col-span-4 md:col-span-8 grid grid-cols-2 md:grid-cols-4">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className={`flex flex-col-reverse justify-end pt-1 pb-3 md:pb-0 pl-3 md:pl-4 rule-l ${index >= 2 ? 'max-md:pt-4 max-md:rule-t' : ''}`}
                            >
                                <dt className="meta mt-2.5 leading-tight max-w-[16ch]">{t.about.statsLabels[index]}</dt>
                                <dd className="display-heavy tabular text-[3.5rem] md:text-[min(4.9vw,10vh)] leading-[0.84]">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={1.4} />
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </Field>

            {/* Body, credentials, core skills, profile — four text columns. */}
            <div className={`${GRID} gap-y-8 mt-8 md:mt-6`}>
                <motion.div {...fadeUp()} className="col-span-4 md:col-span-3 text-[0.9375rem] md:text-sm leading-relaxed">
                    <p className="meta mb-2">{t.about.title}</p>
                    <p>{t.about.description[0]}</p>
                </motion.div>

                <motion.div {...fadeUp(0.05)} className="col-span-4 md:col-span-3 text-[0.9375rem] md:text-sm leading-relaxed">
                    <p className="text-[var(--muted)] md:pt-[1.35rem]">{t.about.description[1]}</p>
                    <div className="mt-5">
                        <p className="meta mb-2">{t.about.credentialsLabel}</p>
                        <ul className="flex flex-wrap gap-1.5">
                            {credentials.map((item) => {
                                const cls = `inline-flex items-center gap-1.5 px-2 py-1 border text-caption font-semibold uppercase tracking-[0.05em] transition-colors duration-300 ${item.featured ? 'border-[var(--cobalt)] bg-[var(--cobalt)] text-white hover:bg-transparent hover:text-[var(--accent-ink)] hover:border-[var(--accent-ink)]' : 'border-[var(--rule)] hover:border-[var(--foreground)]'}`
                                return (
                                    <li key={item.badge}>
                                        {item.link ? (
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className={cls} aria-label={`${item.degree} — ${item.institution} (opens credential)`}>
                                                {item.badge}
                                                <span aria-hidden="true">↗</span>
                                            </a>
                                        ) : (
                                            <span className={cls} title={`${item.degree} — ${item.institution}`}>{item.badge}</span>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </motion.div>

                {/* Skills: numbered, each opens a short note. */}
                <motion.div {...fadeUp(0.1)} className="col-span-4 md:col-span-3">
                    <p className="meta mb-2">{t.editorial.skillsLabel}</p>
                    <ul className="rule-t">
                        {t.skills.slice(0, 4).map((skill: Skill, index: number) => (
                            <li key={skill.label} className="rule-b">
                                <button
                                    type="button"
                                    onClick={() => setActiveSkill(skill)}
                                    aria-label={`${skill.label} — ${t.about.readMore}`}
                                    className="index-row group w-full text-left py-2 grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-2"
                                >
                                    <span className="index text-body-sm tabular">{String(index + 1).padStart(2, '0')}</span>
                                    <span className="row-title min-w-0">
                                        <span className="block font-medium text-[0.9375rem] md:text-sm leading-tight tracking-[-0.01em]">{skill.label}</span>
                                        <span className="block text-body-sm text-[var(--muted)] leading-snug mt-0.5 truncate">{skill.detail}</span>
                                    </span>
                                    <span className="text-sm pr-1" aria-hidden="true">+</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div {...fadeUp(0.15)} className="col-span-4 md:col-span-3">
                    <p className="meta mb-2">{t.editorial.profile.title}</p>
                    <dl className="text-sm">
                        {profile.map(([key, value]) => (
                            <div key={key} className="rule-t grid grid-cols-[5.5rem_1fr] gap-x-3 py-1.5">
                                <dt className="text-[var(--muted)]">{key}</dt>
                                <dd className="font-medium">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </motion.div>
            </div>

            {/* Toolkit marquee */}
            <motion.div {...fadeUp(0.2)} className="mt-6 md:mt-5 -mx-4 md:mx-0">
                <p className="meta mb-2 px-4 md:px-0">{t.editorial.toolsLabel}</p>
                <div className="flex flex-col gap-1.5">
                    <LogoLoop logos={OPS_TOOLS} speed={40} direction="left" logoHeight="1.75rem" gap="0.375rem" fadeOut pauseOnHover />
                    <LogoLoop logos={BUILD_TOOLS} speed={40} direction="right" logoHeight="1.75rem" gap="0.375rem" fadeOut pauseOnHover />
                </div>
            </motion.div>

            <Modal
                open={Boolean(activeSkill)}
                onClose={() => setActiveSkill(null)}
                labelledBy="skill-modal-title"
                closeLabel={t.projectsSection.close}
                className="p-6 md:p-8 max-w-md w-full"
            >
                {activeSkill && (
                    <>
                        <p className="meta mb-3">{t.editorial.skillsLabel}</p>
                        <h4 id="skill-modal-title" className="display text-3xl mb-4 pr-16">{activeSkill.label}</h4>
                        <p className="text-sm leading-relaxed rule-t pt-4">{activeSkill.detail}</p>
                    </>
                )}
            </Modal>
        </section>
    )
}
