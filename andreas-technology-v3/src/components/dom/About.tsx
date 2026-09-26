'use client'

import { useContent } from '@/hooks/useContent'
import { useState } from 'react'
import type { Skill } from '@/data/content'
import Modal from '@/components/ui/Modal'
import LogoLoop from '@/components/ui/LogoLoop'
import type { LogoItem } from '@/components/ui/LogoLoop'
import { TOOLS, type Tool } from '@/data/tools'
import ToolBadge from '@/components/ui/ToolBadge'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import { Bento, SectionTile, Tile, type Tone } from '@/components/ui/Bento'

const toLogos = (row: Tool['row']): LogoItem[] =>
    TOOLS.filter((tool) => tool.row === row).map((tool) => ({
        node: <ToolBadge tool={tool} />,
        title: tool.label,
    }))

const OPS_TOOLS = toLogos('ops')
const BUILD_TOOLS = toLogos('build')

/** Kardev-style counters in Indisea's zero-padded format. */
const STAT_TONES: Tone[] = ['plain', 'sky', 'mint', 'plain']

export default function About() {
    const t = useContent()
    const [activeSkill, setActiveSkill] = useState<Skill | null>(null)

    const certifications = t.education.filter((e) => e.kind === 'certification')
    const certBadges = certifications.map((e) => e.badge).filter(Boolean)
    const credentials = t.education.filter((e) => e.badge && e.kind && e.kind !== 'degree')

    // Order matches t.about.statsLabels:
    // years experience · endpoints managed · faster onboarding · certifications
    const stats = [
        { value: 7, suffix: '+', pad: 2 },
        { value: 550, suffix: '+', pad: 3 },
        { value: 70, suffix: '%', pad: 2 },
        { value: certifications.length, suffix: '', pad: 2 },
    ]

    return (
        <section aria-labelledby="about-title" className="w-full h-auto md:h-full px-4 md:px-6 pt-3 md:pb-6">
            <Bento className="max-w-[112rem] mx-auto">
                <SectionTile id="about" number={2} title={t.about.title} eyebrow={t.nav.about} index={0} className="col-span-2 md:col-[1/6] md:row-[1/2] min-h-[8rem] md:min-h-0" />

                {/* Story */}
                <Tile index={1} className="col-span-2 md:col-[1/6] md:row-[2/5] gap-4">
                    <h3 className="text-[1.25rem] md:text-[min(1.55vw,2.7vh)] font-semibold leading-snug tracking-[-0.015em]">
                        {t.about.tagline}
                    </h3>
                    <div className="space-y-3 short:space-y-2 text-[0.9375rem] md:text-[min(1vw,1.72vh)] leading-relaxed short:leading-snug text-[var(--muted)]">
                        {t.about.description.slice(0, 2).map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </Tile>

                {/* Current focus, written as the object it is. */}
                <Tile index={2} tone="terminal" className="col-span-2 md:col-[6/10] md:row-[1/3] gap-3">
                    <div className="flex items-center gap-3">
                        <span className="tile-icon" aria-hidden="true">
                            <i className="fas fa-code text-[#6cb8ff]" />
                        </span>
                        <div className="min-w-0">
                            <p className="eyebrow el-caps">{t.about.currentFocus}</p>
                            <p className="text-sm font-semibold truncate">{t.about.currentFocusDetail}</p>
                        </div>
                    </div>
                    <div className="font-mono text-[0.75rem] md:text-[min(0.84vw,1.45vh)] leading-[1.6] text-[#d1d1d6] overflow-hidden">
                        <p><span className="text-[#ff7ab2]">const</span> engineer = {'{'}</p>
                        <p className="pl-4">role: <span className="text-[#fc6a5d]">&quot;Apple Fleet &amp; IT Automation Lead&quot;</span>,</p>
                        <p className="pl-4">company: <span className="text-[#fc6a5d]">&quot;Omilia&quot;</span>,</p>
                        <p className="pl-4">fleet: <span className="text-[#fc6a5d]">&quot;550+ Macs&quot;</span>,</p>
                        <p className="pl-4">stack: [{['Jamf Pro', 'Python', 'Bash', 'Swift'].map((item, i, arr) => (
                            <span key={item}><span className="text-[#fc6a5d]">&quot;{item}&quot;</span>{i < arr.length - 1 ? ', ' : ''}</span>
                        ))}],</p>
                        <p className="pl-4">certs: [{certBadges.map((badge, i) => (
                            <span key={badge}><span className="text-[#fc6a5d]">&quot;{badge}&quot;</span>{i < certBadges.length - 1 ? ', ' : ''}</span>
                        ))}],</p>
                        <p className="pl-4">location: <span className="text-[#fc6a5d]">&quot;Athens, GR&quot;</span>,</p>
                        <p>{'};'}</p>
                    </div>
                </Tile>

                {/* Credentials */}
                <Tile index={3} className="col-span-2 md:col-[6/10] md:row-[3/5] gap-3">
                    <p className="eyebrow el-caps">{t.about.credentialsLabel}</p>
                    <ul className="flex-1 flex flex-col justify-between gap-2 short:gap-1">
                        {credentials.map((item) => {
                            const body = (
                                <>
                                    <span className={`tile-icon w-9 h-9 short:w-8 short:h-8 rounded-xl ${item.featured ? 'bg-[var(--lavender)] text-[var(--lavender-ink)]' : 'text-[var(--muted)]'}`} aria-hidden="true">
                                        <i className={`${item.icon ?? (item.kind === 'license' ? 'fas fa-id-card' : 'fas fa-award')} text-sm`} />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-sm font-bold tracking-tight">{item.badge}</span>
                                        <span className="block text-caption text-[var(--muted)] truncate">{item.institution}</span>
                                    </span>
                                    {item.link && (
                                        <i className="fas fa-arrow-right -rotate-45 text-caption text-[var(--accent)] transition-transform duration-300 group-hover:rotate-0" aria-hidden="true" />
                                    )}
                                </>
                            )
                            const cls = 'group flex items-center gap-3 rounded-2xl px-2 py-1.5 short:py-0.5 -mx-2 transition-colors duration-300'
                            return (
                                <li key={item.badge}>
                                    {item.link ? (
                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className={`${cls} hover:bg-[var(--fill)]`} aria-label={`${item.degree} — ${item.institution} (opens credential)`}>
                                            {body}
                                        </a>
                                    ) : (
                                        <div className={cls} title={`${item.degree} — ${item.institution}`}>{body}</div>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </Tile>

                {/* Stats, 2 × 2 */}
                <div className="col-span-2 md:col-[10/13] md:row-[1/5] grid grid-cols-2 md:grid-rows-2 gap-[var(--gap)] min-h-0">
                    {stats.map((stat, index) => (
                        <Tile key={index} index={3 + index} tone={STAT_TONES[index]} className="justify-between min-h-[9.5rem] md:min-h-0">
                            <span className="eyebrow tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                            <div>
                                <div className="numeral tile-mark text-[2.75rem] md:text-[min(3.3vw,6.2vh)]">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} pad={stat.pad} duration={1.5} />
                                </div>
                                <p className="mt-2 text-caption md:text-[min(0.9vw,1.6vh)] font-semibold leading-tight el-caps">{t.about.statsLabels[index]}</p>
                            </div>
                        </Tile>
                    ))}
                </div>

                {/* Core skills — each opens a dialog. */}
                {t.skills.slice(0, 4).map((skill: Skill, index: number) => (
                    <Tile
                        key={skill.label}
                        index={7 + index}
                        interactive
                        className={`col-span-2 sm:col-span-1 md:row-[5/6] ${['md:col-[1/4]', 'md:col-[4/7]', 'md:col-[7/10]', 'md:col-[10/13]'][index]} flex-row items-center gap-3`}
                    >
                        <button type="button" className="tile-stretch" onClick={() => setActiveSkill(skill)} aria-label={`${skill.label} — ${t.about.readMore}`} />
                        <span className="tile-icon tile-mark" aria-hidden="true">
                            <i className={`${skill.icon} text-base`} />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-sm md:text-[min(1vw,1.8vh)] font-semibold leading-tight">{skill.label}</span>
                            <span className="block text-caption text-[var(--muted)] mt-0.5">{t.about.readMore}</span>
                        </span>
                        <span className="tile-affordance" aria-hidden="true">
                            <i className="fas fa-plus" />
                        </span>
                    </Tile>
                ))}

                {/* Toolkit marquee */}
                <Tile index={11} className="col-span-2 md:col-[1/13] md:row-[6/7] !px-0 md:!py-[min(1.25rem,1.6vh)] justify-center gap-2 md:flex-row md:items-center md:gap-0">
                    <p className="eyebrow el-caps px-[var(--tile-pad)] md:w-44 md:shrink-0">{t.servicesLabels.toolkit}</p>
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                        <LogoLoop logos={OPS_TOOLS} speed={40} direction="left" logoHeight="1.75rem" gap="0.5rem" fadeOut pauseOnHover />
                        <LogoLoop logos={BUILD_TOOLS} speed={40} direction="right" logoHeight="1.75rem" gap="0.5rem" fadeOut pauseOnHover />
                    </div>
                </Tile>
            </Bento>

            <Modal
                open={Boolean(activeSkill)}
                onClose={() => setActiveSkill(null)}
                labelledBy="skill-modal-title"
                closeLabel={t.projectsSection.close}
                className="p-7 max-w-md w-full"
            >
                {activeSkill && (
                    <>
                        <span className="tile-icon text-[var(--accent)] mb-5" aria-hidden="true">
                            <i className={`${activeSkill.icon} text-lg`} />
                        </span>
                        <h4 id="skill-modal-title" className="text-2xl font-bold tracking-tight mb-3 pr-10">{activeSkill.label}</h4>
                        <p className="text-[0.95rem] text-[var(--muted)] leading-relaxed">{activeSkill.detail}</p>
                    </>
                )}
            </Modal>
        </section>
    )
}
