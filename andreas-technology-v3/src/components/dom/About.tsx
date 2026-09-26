'use client'

import { useContent } from '@/hooks/useContent'
import { motion, useInView, useReducedMotion, animate } from 'motion/react'
import { useRef, useEffect, useState } from 'react'
import type { Skill, Education } from '@/data/content'
import SpotlightCard from '@/components/ui/SpotlightCard'
import Modal from '@/components/ui/Modal'
import LogoLoop from '@/components/ui/LogoLoop'
import type { LogoItem } from '@/components/ui/LogoLoop'
import { TOOLS, type Tool } from '@/data/tools'
import SectionHeading from '@/components/ui/SectionHeading'

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

function CredentialStrip({ items, label, cursorLabel }: { items: Education[]; label: string; cursorLabel: string }) {
    if (items.length === 0) return null
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-wrap items-center gap-2 mb-4"
        >
            <span className="text-micro font-mono uppercase tracking-[0.2em] text-[var(--foreground)] opacity-70 mr-1">
                {label}
            </span>
            {items.map((item) => {
                const pill = item.featured
                    ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10 hover:bg-[var(--accent)] hover:text-[var(--background)]'
                    : 'border-[var(--foreground)]/35 text-[var(--foreground)] hover:border-[var(--foreground)]'
                const body = (
                    <>
                        {item.icon && <i className={`${item.icon} text-caption`} aria-hidden="true" />}
                        {item.badge}
                        {item.link && <i className="fas fa-arrow-up-right-from-square text-[0.5rem] opacity-70" aria-hidden="true" />}
                    </>
                )
                const cls = `inline-flex items-center gap-1.5 px-2.5 py-1 border text-caption font-mono font-bold uppercase tracking-wider transition-colors duration-300 ${pill}`
                return item.link ? (
                    <a key={item.badge} href={item.link} target="_blank" rel="noopener noreferrer" data-cursor={cursorLabel} className={cls} aria-label={`${item.degree} — ${item.institution} (opens credential)`}>
                        {body}
                    </a>
                ) : (
                    <span key={item.badge} className={cls} title={`${item.degree} — ${item.institution}`}>
                        {body}
                    </span>
                )
            })}
        </motion.div>
    )
}

/** Near-black brand colours vanish on the dark theme, so those hover to the foreground instead. */
function hoverColour(hex: string): string {
    const n = parseInt(hex.slice(1), 16)
    const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
        const v = c / 255
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.06 ? 'var(--foreground)' : hex
}

const toLogos = (row: Tool['row']): LogoItem[] =>
    TOOLS.filter((tool) => tool.row === row).map((tool) => ({
        node: (
            <span className="tool-pill" style={{ '--brand': hoverColour(tool.brand) } as React.CSSProperties}>
                <span
                    className="tool-logo"
                    aria-hidden="true"
                    style={{ aspectRatio: tool.ratio ?? 1, maskImage: `url(/logos/${tool.logo}.svg)`, WebkitMaskImage: `url(/logos/${tool.logo}.svg)` }}
                />
                {tool.label}
            </span>
        ),
        title: tool.label,
    }))

const OPS_TOOLS = toLogos('ops')
const BUILD_TOOLS = toLogos('build')

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
        <section className="w-full h-auto md:h-full flex flex-col justify-center px-4 sm:px-12 md:px-24 py-4 md:py-0 overflow-visible md:overflow-x-hidden md:overflow-y-auto no-scrollbar">
            <div className="max-w-7xl mx-auto w-full">
                <SectionHeading id="about" title={t.about.title} subtitle={t.about.subtitle} sizeClass="text-[12vw] md:text-[min(7vw,9vh)]" className="mb-6 md:mb-8" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <SpotlightCard className="border border-[var(--foreground)]/30 bg-[var(--background)] p-5 relative h-full overflow-hidden">
                            <div className="absolute top-0 left-0 w-16 h-16 border-b border-r border-[var(--accent)]/30 rounded-br-3xl z-10" />
                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <div className="w-10 h-10 border border-[var(--accent)] flex items-center justify-center text-[var(--accent)]">
                                    <i className="fas fa-code text-lg" aria-hidden="true" />
                                </div>
                                <div>
                                    <div className="text-micro font-mono text-[var(--foreground)] opacity-80 uppercase">{t.about.currentFocus}</div>
                                    <div className="text-base font-bold text-[var(--foreground)]">{t.about.currentFocusDetail}</div>
                                </div>
                            </div>
                            <div className="font-mono text-body-sm space-y-1 text-[var(--foreground)] opacity-85 relative z-10">
                                <p><span className="text-[var(--accent)]">const</span> engineer = {'{'}</p>
                                <p className="pl-4">role: <span className="text-[var(--accent)]">&quot;Apple Fleet &amp; IT Automation Lead&quot;</span>,</p>
                                <p className="pl-4">company: <span className="text-[var(--accent)]">&quot;Omilia&quot;</span>,</p>
                                <p className="pl-4">fleet: <span className="text-[var(--accent)]">&quot;550+ Macs&quot;</span>,</p>
                                <p className="pl-4">stack: [{['Jamf Pro', 'Python', 'Bash', 'Swift'].map((item, i, arr) => (
                                    <span key={item}><span className="text-[var(--accent)]">&quot;{item}&quot;</span>{i < arr.length - 1 ? ', ' : ''}</span>
                                ))}],</p>
                                <p className="pl-4">certs: [{certBadges.map((badge, i) => (
                                    <span key={badge}><span className="text-[var(--accent)]">&quot;{badge}&quot;</span>{i < certBadges.length - 1 ? ', ' : ''}</span>
                                ))}],</p>
                                <p className="pl-4">location: <span className="text-[var(--accent)]">&quot;Athens, GR&quot;</span>,</p>
                                <p>{'};'}</p>
                            </div>
                        </SpotlightCard>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col justify-center"
                    >
                        <CredentialStrip
                            items={t.education.filter((e) => e.badge && e.kind && e.kind !== 'degree')}
                            label={t.about.credentialsLabel}
                            cursorLabel={t.cursor.verify}
                        />
                        <h3 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-3">
                            {t.about.tagline}
                        </h3>
                        <div className="space-y-3 text-sm text-[var(--foreground)] opacity-80 leading-relaxed">
                            {t.about.description.slice(0, 2).map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                        <div className="grid grid-cols-4 gap-3 mt-5 pt-5 border-t border-[var(--foreground)]/20">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-xl md:text-2xl font-black gradient-text">
                                        <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={1.5} />
                                    </div>
                                    <div className="text-caption font-mono text-[var(--foreground)] opacity-80 uppercase leading-tight">
                                        {t.about.statsLabels[index]}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {t.skills.slice(0, 4).map((skill: Skill, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                        >
                            <SpotlightCard
                                className="border border-[var(--foreground)]/30 p-3 hover:border-[var(--accent)] transition-all duration-300 group h-full"
                                onClick={() => setActiveSkill(skill)}
                                label={`${skill.label} — read more`}
                                cursor={t.cursor.open}
                            >
                                <div className="relative z-10">
                                    <div className="w-9 h-9 border border-[var(--foreground)]/50 flex items-center justify-center text-[var(--foreground)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition-colors mb-2">
                                        <i className={`${skill.icon} text-base`} aria-hidden="true" />
                                    </div>
                                    <h4 className="font-bold text-sm text-[var(--foreground)] mb-1">{skill.label}</h4>
                                    <p className="text-micro text-[var(--foreground)] opacity-80 leading-relaxed line-clamp-2">
                                        {skill.detail || 'Building innovative solutions'}
                                    </p>
                                    {/* Always visible: touch devices have no hover to reveal this. */}
                                    <span className="text-micro font-mono text-[var(--accent)] opacity-60 md:opacity-40 md:group-hover:opacity-80 transition-opacity mt-1 block">
                                        {t.about.readMore} ↗
                                    </span>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>

                <Modal
                    open={Boolean(activeSkill)}
                    onClose={() => setActiveSkill(null)}
                    labelledBy="skill-modal-title"
                    className="p-6 max-w-sm w-full"
                >
                    {activeSkill && (
                        <>
                            <div className="w-10 h-10 border border-[var(--accent)] flex items-center justify-center text-[var(--accent)] mb-4">
                                <i className={`${activeSkill.icon} text-base`} aria-hidden="true" />
                            </div>
                            <h4 id="skill-modal-title" className="font-black text-base text-[var(--accent)] uppercase tracking-tight mb-3 pr-8">{activeSkill.label}</h4>
                            <p className="text-sm text-[var(--foreground)] opacity-80 leading-relaxed">{activeSkill.detail}</p>
                        </>
                    )}
                </Modal>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="flex flex-col gap-2">
                        <LogoLoop logos={OPS_TOOLS} speed={55} direction="left" logoHeight="1.75rem" gap="0.75rem" fadeOut scaleOnHover pauseOnHover />
                        <LogoLoop logos={BUILD_TOOLS} speed={55} direction="right" logoHeight="1.75rem" gap="0.75rem" fadeOut scaleOnHover pauseOnHover />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
