'use client'

import { useContent } from '@/hooks/useContent'
import { useInView, useReducedMotion, animate } from 'motion/react'
import { useRef, useEffect, useState } from 'react'
import type { Skill } from '@/data/content'
import Modal from '@/components/ui/Modal'
import LogoLoop from '@/components/ui/LogoLoop'
import type { LogoItem } from '@/components/ui/LogoLoop'
import { TOOLS, type Tool } from '@/data/tools'
import ToolBadge from '@/components/ui/ToolBadge'
import Window from '@/components/ui/Window'
import CredentialChips from '@/components/ui/CredentialChips'
import { SECTION_APPS, SERVICE_TILES, uiIcon } from '@/data/apps'

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

/** Syntax colours for the little code pane, tuned per theme for AA contrast. */
const KEY = 'text-[#8A3FD1] dark:text-[#C99BFF]'
const STR = 'text-[#B3261E] dark:text-[#FF9F8F]'

export default function About() {
    const t = useContent()
    const [activeSkill, setActiveSkill] = useState<Skill | null>(null)

    const certifications = t.education.filter((e) => e.kind === 'certification')
    const certBadges = certifications.map((e) => e.badge).filter(Boolean)

    // Order matches t.about.statsLabels:
    // years experience · endpoints managed · faster onboarding · certifications
    const stats = [
        { value: 7, suffix: '+' },
        { value: 550, suffix: '+' },
        { value: 70, suffix: '%' },
        { value: certifications.length, suffix: '' },
    ]

    return (
        <Window
            as="section"
            id="about"
            labelledBy="about-title"
            title={t.os.windows.about}
            app={SECTION_APPS.about}
            className="w-full md:max-w-[76rem] md:max-h-full"
            bodyClassName="flex flex-col md:flex-row"
            footer={
                <div className="flex flex-col gap-1.5 py-2.5">
                    <LogoLoop logos={OPS_TOOLS} speed={40} direction="left" logoHeight="1.75rem" gap="0.5rem" fadeOut pauseOnHover />
                    <LogoLoop logos={BUILD_TOOLS} speed={40} direction="right" logoHeight="1.75rem" gap="0.5rem" fadeOut pauseOnHover />
                </div>
            }
        >
            {/* Sidebar: identity card, specs, and a small code pane. */}
            <aside className="os-sidebar md:w-[18.5rem] shrink-0 border-b md:border-b-0 md:border-r border-[var(--hairline)] p-5 md:p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3.5">
                    <span className="app-tile w-14 h-14 text-xl font-black tracking-tight" style={{ background: SECTION_APPS.about.tile }} aria-hidden="true">
                        AF
                    </span>
                    <div className="min-w-0">
                        <p className="text-base md:text-lg font-bold tracking-tight leading-tight">{t.os.displayName}</p>
                        <p className="text-body-sm text-[var(--muted)] leading-snug">{t.title}</p>
                    </div>
                </div>

                <div className="border-t border-[var(--hairline)] pt-3.5">
                    <p className="text-caption font-semibold text-[var(--muted)] caps-gr">{t.about.currentFocus}</p>
                    <p className="text-sm font-semibold leading-snug">{t.about.currentFocusDetail}</p>
                </div>

                <dl className="border-t border-[var(--hairline)] pt-2 grid grid-cols-2 md:grid-cols-1 gap-x-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-baseline justify-between gap-3 py-1.5 md:border-b md:border-[var(--hairline)] md:last:border-b-0">
                            <dt className="text-body-sm text-[var(--muted)] leading-tight caps-gr">{t.about.statsLabels[index]}</dt>
                            <dd className="text-sm font-bold tabular-nums">
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={1.5} />
                            </dd>
                        </div>
                    ))}
                </dl>

                <pre className="about-code shrink-0 os-card px-3.5 py-3 font-mono text-[0.6875rem] leading-[1.65] text-[var(--foreground)] overflow-hidden whitespace-pre-wrap">
                    <span className={KEY}>const</span> engineer = {'{'}{'\n'}
                    {'  '}role: <span className={STR}>&quot;Apple Fleet &amp; IT Automation Lead&quot;</span>,{'\n'}
                    {'  '}company: <span className={STR}>&quot;Omilia&quot;</span>,{'\n'}
                    {'  '}fleet: <span className={STR}>&quot;550+ Macs&quot;</span>,{'\n'}
                    {'  '}stack: [{['Jamf Pro', 'Python', 'Bash', 'Swift'].map((item, i, arr) => (
                        <span key={item}><span className={STR}>&quot;{item}&quot;</span>{i < arr.length - 1 ? ', ' : ''}</span>
                    ))}],{'\n'}
                    {'  '}certs: [{certBadges.map((badge, i) => (
                        <span key={badge}><span className={STR}>&quot;{badge}&quot;</span>{i < certBadges.length - 1 ? ', ' : ''}</span>
                    ))}],{'\n'}
                    {'  '}location: <span className={STR}>&quot;Athens, GR&quot;</span>,{'\n'}
                    {'};'}
                </pre>
            </aside>

            {/* Main pane */}
            <div className="flex-1 min-w-0 p-5 md:p-7 lg:p-8 flex flex-col">
                <h2 id="about-title" className="os-eyebrow">{t.about.title}</h2>
                <p className="mt-2 text-[1.375rem] md:text-[1.75rem] font-bold tracking-[-0.02em] leading-[1.15] max-w-[40rem]">
                    {t.about.tagline}
                </p>
                <div className="mt-3.5 space-y-2.5 text-sm text-[var(--muted)] leading-relaxed max-w-[46rem]">
                    {t.about.description.slice(0, 2).map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>

                <CredentialChips
                    items={t.education.filter((e) => e.badge && e.kind && e.kind !== 'degree')}
                    label={t.about.credentialsLabel}
                    newTabLabel={t.os.aria.newTab}
                    className="mt-4"
                />

                <div className="mt-5 md:mt-auto md:pt-5 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {t.skills.slice(0, 4).map((skill: Skill, index: number) => (
                        <button
                            key={skill.label}
                            type="button"
                            onClick={() => setActiveSkill(skill)}
                            aria-label={`${skill.label} — ${t.about.readMore}`}
                            className="group os-card text-left p-3 flex flex-col gap-2 transition-[background-color,box-shadow] duration-200 hover:bg-[var(--accent-soft)] hover:shadow-[0_0_0_1px_var(--accent-brand)]"
                        >
                            <span className="app-tile w-8 h-8 text-sm" style={{ background: SERVICE_TILES[index] }} aria-hidden="true">
                                <i className={uiIcon(skill.icon)} />
                            </span>
                            <span className="text-body-sm font-semibold leading-tight">{skill.label}</span>
                            <span className="hidden md:block text-caption text-[var(--muted)] leading-snug line-clamp-2">{skill.detail}</span>
                            <span className="mt-auto text-caption font-semibold text-[var(--accent)]">{t.about.readMore} ↗</span>
                        </button>
                    ))}
                </div>
            </div>

            <Modal
                open={Boolean(activeSkill)}
                onClose={() => setActiveSkill(null)}
                labelledBy="skill-modal-title"
                closeLabel={t.projectsSection.close}
                title={t.os.windows.about}
                className="max-w-md w-full"
            >
                {activeSkill && (
                    <div className="p-6">
                        <span className="app-tile w-12 h-12 text-xl mb-4" style={{ background: SERVICE_TILES[Math.max(0, t.skills.indexOf(activeSkill))] }} aria-hidden="true">
                            <i className={uiIcon(activeSkill.icon)} />
                        </span>
                        <h3 id="skill-modal-title" className="text-lg font-bold tracking-tight mb-2">{activeSkill.label}</h3>
                        <p className="text-sm text-[var(--muted)] leading-relaxed">{activeSkill.detail}</p>
                    </div>
                )}
            </Modal>
        </Window>
    )
}
