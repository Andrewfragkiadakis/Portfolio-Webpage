'use client'

import { useContent } from '@/hooks/useContent'
import { motion, useInView, useReducedMotion, animate } from 'motion/react'
import { useRef, useEffect, useState } from 'react'
import type { Skill, Education } from '@/data/content'
import Modal from '@/components/ui/Modal'
import LogoLoop from '@/components/ui/LogoLoop'
import type { LogoItem } from '@/components/ui/LogoLoop'
import { TOOLS, type Tool } from '@/data/tools'
import ToolBadge from '@/components/ui/ToolBadge'
import Panel from '@/components/ui/Panel'
import { useFitText } from '@/hooks/useFitText'
import SectionHeading, { SPLIT_TITLE } from '@/components/ui/SectionHeading'
import { FADE_UP, RISE_LINE, WIPE_FROM_RIGHT } from '@/utils/motion'

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

function CredentialStrip({ items, label }: { items: Education[]; label: string }) {
    if (items.length === 0) return null
    return (
        <div className="flex flex-wrap items-center gap-1.5">
            <span className="meta mr-2">{label}</span>
            {items.map((item) => {
                const tone = item.featured
                    ? 'bg-[var(--block)] text-[var(--on-block)] hover:bg-[var(--foreground)] hover:text-[var(--background)]'
                    : 'shadow-[inset_0_0_0_1.5px_currentColor] text-[var(--foreground)] hover:bg-[var(--block)] hover:text-[var(--on-block)] hover:shadow-none'
                const body = (
                    <>
                        {item.icon && <i className={`${item.icon} text-caption`} aria-hidden="true" />}
                        {item.badge}
                        {item.link && <i className="fas fa-arrow-up-right-from-square text-[0.5rem]" aria-hidden="true" />}
                    </>
                )
                const cls = `inline-flex items-center gap-1.5 px-2.5 py-1.5 eyebrow tabular transition-colors duration-300 ${tone}`
                return item.link ? (
                    <a key={item.badge} href={item.link} target="_blank" rel="noopener noreferrer" className={cls} aria-label={`${item.degree} — ${item.institution} (opens credential)`}>
                        {body}
                    </a>
                ) : (
                    <span key={item.badge} className={cls} title={`${item.degree} — ${item.institution}`}>
                        {body}
                    </span>
                )
            })}
        </div>
    )
}

const toLogos = (row: Tool['row']): LogoItem[] =>
    TOOLS.filter((tool) => tool.row === row).map((tool) => ({
        node: <ToolBadge tool={tool} />,
        title: tool.label,
    }))

const OPS_TOOLS = toLogos('ops')
const BUILD_TOOLS = toLogos('build')

/**
 * About — paper on the left for the story, a cobalt block on the right carrying one
 * giant number (the fleet) and a lab-specimen spec sheet underneath.
 */
export default function About() {
    const t = useContent()
    const [activeSkill, setActiveSkill] = useState<Skill | null>(null)
    const fit = useFitText(1, { maxVh: 30, maxPx: 300 })

    const certifications = t.education.filter((e) => e.kind === 'certification')
    const certBadges = certifications.map((e) => e.badge).filter(Boolean) as string[]

    // Order matches t.about.statsLabels:
    // years experience · endpoints managed · faster onboarding · certifications
    const stats = [
        { value: 7, suffix: '+' },
        { value: 550, suffix: '+' },
        { value: 70, suffix: '%' },
        { value: certifications.length, suffix: '' },
    ]
    const minorStats = [0, 2, 3]

    const p = t.editorial.profile
    const spec: [string, string, string][] = [
        ['role', p.role, 'Apple Fleet & IT Automation Lead'],
        ['company', p.company, 'Omilia'],
        ['fleet', p.fleet, '550+ Macs'],
        ['stack', p.stack, ['Jamf Pro', 'Python', 'Bash', 'Swift'].join(' · ')],
        ['certs', p.certs, certBadges.join(' · ')],
        ['location', p.location, 'Athens, GR'],
    ]

    return (
        <Panel id="about" label={t.about.title} className="flex flex-col md:flex-row">
            {/* ── Paper: the story ─────────────────────────────── */}
            <div className="surface-page md:w-[56%] flex flex-col justify-between gap-8 px-4 md:px-[var(--gutter)] pt-12 pb-14 md:pt-5 md:pb-8">
                <SectionHeading id="about" anchor={false} compact heavy index={1} label={t.nav.about} title={t.editorial.sections.about} sizeClass={SPLIT_TITLE} />

                <div className="flex flex-col gap-5 short:gap-4">
                <motion.div variants={FADE_UP} custom={0.45} className="flex flex-col gap-4">
                    <h3 className="font-display font-extrabold tracking-[-0.025em] leading-[1.1] text-[clamp(1.25rem,1.7vw,1.625rem)] max-w-[32ch]">
                        {t.about.tagline}
                    </h3>
                    <div className="space-y-3 text-[0.9375rem] leading-relaxed text-[var(--muted)] max-w-[62ch]">
                        {t.about.description.slice(0, 2).map((paragraph, index) => (
                            // Short desktops keep the first paragraph; the second is in the dialogs and CV.
                            <p key={index} className={index > 0 ? 'short:hidden' : ''}>{paragraph}</p>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={FADE_UP} custom={0.55}>
                    <CredentialStrip
                        items={t.education.filter((e) => e.badge && e.kind && e.kind !== 'degree')}
                        label={t.about.credentialsLabel}
                    />
                </motion.div>

                {/* Four skills as a 2×2 of openable blocks; hover/focus inverts to cobalt. */}
                <motion.ul variants={FADE_UP} custom={0.65} className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-[var(--line)]">
                    {t.skills.slice(0, 4).map((skill: Skill, index: number) => (
                        <li key={skill.label} className="border-r border-b border-[var(--line)]">
                            <button
                                type="button"
                                onClick={() => setActiveSkill(skill)}
                                aria-label={`${skill.label} — ${t.about.readMore}`}
                                className="invert-block cell-page w-full h-full text-left flex items-center gap-3 px-3.5 py-3 focus-visible:outline-offset-[-6px]"
                            >
                                <span className="eyebrow opacity-70 w-5 shrink-0">{String(index + 1).padStart(2, '0')}</span>
                                <i className={`${skill.icon} text-base w-5 text-center shrink-0`} aria-hidden="true" />
                                <span className="font-bold text-sm leading-tight flex-1">{skill.label}</span>
                                <span className="eyebrow shrink-0" aria-hidden="true">↗</span>
                            </button>
                        </li>
                    ))}
                </motion.ul>

                <motion.div variants={FADE_UP} custom={0.75} className="flex flex-col gap-2 -mx-1">
                    <LogoLoop logos={OPS_TOOLS} speed={45} direction="left" logoHeight="1.6rem" gap="0.5rem" fadeOut pauseOnHover />
                    <div className="short:hidden">
                        <LogoLoop logos={BUILD_TOOLS} speed={45} direction="right" logoHeight="1.6rem" gap="0.5rem" fadeOut pauseOnHover />
                    </div>
                </motion.div>
                </div>
            </div>

            {/* ── Cobalt: the number and the spec sheet ─────────── */}
            <motion.div
                variants={WIPE_FROM_RIGHT}
                className="surface-block md:w-[44%] flex flex-col justify-between gap-8 px-4 md:px-[var(--gutter)] py-12 md:pt-5 md:pb-8"
            >
                <motion.div variants={FADE_UP} custom={0.6} className="rule-t-strong pt-2.5 flex items-start justify-between gap-6">
                    <div>
                        <div className="meta">{t.about.currentFocus}</div>
                        <div className="mt-1 font-display font-extrabold tracking-[-0.02em] leading-tight text-lg">{t.about.currentFocusDetail}</div>
                    </div>
                    <i className="fab fa-apple text-2xl" aria-hidden="true" />
                </motion.div>

                <div>
                    <div ref={fit.box(0)} className="w-full overflow-hidden">
                        <motion.span ref={fit.text(0)} variants={RISE_LINE} custom={0.55} className="font-display inline-block whitespace-nowrap text-[clamp(6rem,17vw,16rem)] pt-[0.04em] pr-[0.05em]">
                            {/* Static on purpose: the fitted size is measured from this exact string. */}
                            {`${stats[1].value}${stats[1].suffix}`}
                        </motion.span>
                    </div>
                    <motion.div variants={FADE_UP} custom={0.7} className="meta text-[var(--foreground)] mt-3 flex items-center gap-3">
                        <span className="h-[2px] w-8 bg-[var(--on-cobalt)]" aria-hidden="true" />
                        {t.about.statsLabels[1]}
                    </motion.div>
                </div>

                <motion.div variants={FADE_UP} custom={0.8} className="flex flex-col gap-6">
                    <dl className="grid grid-cols-3 border-t border-[var(--line)]">
                        {minorStats.map((i) => (
                            <div key={i} className="flex flex-col-reverse justify-end gap-2 pt-4 pr-3 border-r border-[var(--line)] last:border-r-0 [&:not(:first-child)]:pl-4">
                                <dt className="meta leading-tight max-sm:text-micro max-sm:tracking-[0.02em] hyphens-auto">{t.about.statsLabels[i]}</dt>
                                <dd className="font-display text-[clamp(2rem,3.4vw,3.25rem)] leading-none">
                                    <AnimatedCounter value={stats[i].value} suffix={stats[i].suffix} duration={1.4} />
                                </dd>
                            </div>
                        ))}
                    </dl>

                    {/* Specimen sheet: the old `const engineer = {…}` card, set as a data table. */}
                    <dl className="text-body-sm border-t border-[var(--line)]">
                        {spec.map(([key, label, value]) => (
                            <div key={key} className="grid grid-cols-[6.5rem_1fr] gap-3 py-1.5 border-b border-[var(--line)]">
                                <dt className="meta self-center">{label}</dt>
                                <dd className="font-medium">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </motion.div>
            </motion.div>

            <Modal
                open={Boolean(activeSkill)}
                onClose={() => setActiveSkill(null)}
                labelledBy="skill-modal-title"
                closeLabel={t.projectsSection.close}
                className="max-w-md w-full"
            >
                {activeSkill && (
                    <>
                        <div className="surface-block px-6 pt-6 pb-5 pr-16">
                            <i className={`${activeSkill.icon} text-2xl`} aria-hidden="true" />
                            <h4 id="skill-modal-title" className="mt-4 display-heavy text-[1.75rem] leading-[0.95]">{activeSkill.label}</h4>
                        </div>
                        <p className="p-6 text-[0.9375rem] leading-relaxed text-[var(--muted)]">{activeSkill.detail}</p>
                    </>
                )}
            </Modal>
        </Panel>
    )
}
