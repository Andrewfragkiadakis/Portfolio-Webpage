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
import { MonogramIcon, GlyphTile } from '@/components/ui/AppIcon'
import Icon, { symbolFor } from '@/components/ui/Icon'
import { SERVICE_TINTS } from '@/data/apps'

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

    const sidebar = (
        <div className="px-4 pt-4 md:pt-1 pb-4 md:pb-5 flex flex-col gap-4 md:h-[calc(100%-3.25rem)]">
            <div className="flex items-center gap-3">
                <MonogramIcon size={52} />
                <div className="min-w-0">
                    <p className="text-[0.9375rem] font-bold tracking-[-0.01em] leading-tight">{t.os.displayName}</p>
                    <p className="text-caption text-[var(--muted)] leading-snug mt-0.5">{t.title}</p>
                </div>
            </div>

            <div>
                <p className="os-source-heading px-0 caps-gr">{t.about.currentFocus}</p>
                <p className="text-body-sm font-semibold leading-snug">{t.about.currentFocusDetail}</p>
            </div>

            {/* "Get Info"-style key/value rows. */}
            <dl className="grid grid-cols-2 md:grid-cols-1 gap-x-4 rounded-[0.625rem] bg-[var(--window-bg)]/60 dark:bg-white/5 px-3 py-1 shadow-[inset_0_0_0_0.5px_var(--hairline-strong)]">
                {stats.map((stat, index) => (
                    <div key={index} className="flex items-baseline justify-between gap-3 py-[0.4375rem] md:border-b-[0.5px] md:border-[var(--hairline-strong)] md:last:border-b-0">
                        <dt className="text-body-sm text-[var(--muted)] leading-tight caps-gr">{t.about.statsLabels[index]}</dt>
                        <dd className="text-body-sm font-semibold tabular-nums">
                            <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={1.5} />
                        </dd>
                    </div>
                ))}
            </dl>

            <pre className="about-code shrink-0 rounded-[0.625rem] bg-[var(--window-bg)]/60 dark:bg-black/25 shadow-[inset_0_0_0_0.5px_var(--hairline-strong)] px-3 py-2.5 font-mono text-[0.6875rem] leading-[1.6] text-[var(--foreground)] overflow-hidden whitespace-pre-wrap">
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
        </div>
    )

    return (
        <Window
            wid="about"
            app="about"
            as="section"
            anchor="about"
            labelledBy="about-title"
            title={t.os.windows.about}
            sidebar={sidebar}
            sidebarWidth="17.5rem"
            className="w-full md:max-w-[76rem] md:max-h-full"
            bodyClassName="flex flex-col"
            footer={
                <div className="flex flex-col gap-1.5 py-2">
                    <LogoLoop logos={OPS_TOOLS} speed={40} direction="left" logoHeight="1.75rem" gap="0.5rem" fadeOut pauseOnHover />
                    <LogoLoop logos={BUILD_TOOLS} speed={40} direction="right" logoHeight="1.75rem" gap="0.5rem" fadeOut pauseOnHover />
                </div>
            }
        >
            <div className="flex-1 min-w-0 px-5 py-5 md:px-8 md:py-6 short:py-4 flex flex-col">
                <h2 id="about-title" className="os-eyebrow caps-gr">{t.about.title}</h2>
                <p className="os-large-title mt-1.5 text-[1.5rem] md:text-[1.75rem] max-w-[40rem]">
                    {t.about.tagline}
                </p>
                <div className="mt-3 space-y-2.5 text-sm text-[var(--muted)] leading-relaxed max-w-[46rem]">
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
                            className="group os-card text-left p-3 flex flex-col gap-2 transition-[background-color,box-shadow] duration-200 hover:bg-[var(--control-hover)]"
                        >
                            <GlyphTile symbol={symbolFor(skill.icon)} tint={SERVICE_TINTS[index]} size={30} />
                            <span className="text-body-sm font-semibold leading-tight">{skill.label}</span>
                            <span className="hidden md:line-clamp-3 short:line-clamp-2 text-caption text-[var(--muted)] leading-snug">{skill.detail}</span>
                            <span className="mt-auto inline-flex items-center gap-1 text-caption font-medium text-[var(--accent)]">
                                {t.about.readMore}
                                <Icon name="chevron.right" className="text-[0.625rem] transition-transform motion-safe:group-hover:translate-x-0.5" />
                            </span>
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
                        <GlyphTile symbol={symbolFor(activeSkill.icon)} tint={SERVICE_TINTS[Math.max(0, t.skills.indexOf(activeSkill)) % SERVICE_TINTS.length]} size={48} className="mb-4" />
                        <h3 id="skill-modal-title" className="text-lg font-bold tracking-[-0.01em] mb-2">{activeSkill.label}</h3>
                        <p className="text-sm text-[var(--muted)] leading-relaxed">{activeSkill.detail}</p>
                    </div>
                )}
            </Modal>
        </Window>
    )
}
