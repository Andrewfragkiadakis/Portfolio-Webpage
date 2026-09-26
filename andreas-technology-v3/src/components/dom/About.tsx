'use client'

import { useContent } from '@/hooks/useContent'
import { useState, type CSSProperties } from 'react'
import type { Skill } from '@/data/content'
import Modal from '@/components/ui/Modal'
import { TOOLS } from '@/data/tools'
import { ToolTile, brandInks } from '@/components/ui/ToolBadge'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import MacGrid from '@/components/ui/MacGrid'
import { Bento, SectionTile, Tile, type Family, type Tone } from '@/components/ui/Bento'
import InfoSpot from '@/components/ui/InfoSpot'

/**
 * The logo wall shows one row of headline tools; the rest (and every name) sit behind
 * the "+" at the end of the row.
 */
const HEADLINE_TOOLS = [
    'Jamf Pro', 'Apple Business Manager', 'Checkpoint Harmony EDR', 'Microsoft Sentinel', 'Microsoft Entra ID', '1Password', 'Cisco ISE',
    'Proxmox', 'Python', 'Swift', 'TypeScript', 'Claude Code', 'Jira Service Management', 'Slack',
]
const SHOWN_TOOLS = TOOLS.filter((tool) => HEADLINE_TOOLS.includes(tool.label))

/** The four core skills, each in its subject family's colours. */
const SKILL_FAMILIES: Family[] = ['fleet', 'security', 'automation', 'ai']

export default function About() {
    const t = useContent()
    const [activeSkill, setActiveSkill] = useState<Skill | null>(null)

    const certifications = t.education.filter((e) => e.kind === 'certification')
    const credentials = t.education.filter((e) => e.badge && e.kind && e.kind !== 'degree')

    // Only published figures. Labels come from content in both languages.
    const stats: { value: number; suffix: string; pad: number; label: string; tone: Tone }[] = [
        { value: 7, suffix: '+', pad: 2, label: t.about.statsLabels[0], tone: 'graphite' },
        { value: 70, suffix: '%', pad: 2, label: t.about.statsLabels[2], tone: 'automation' },
        { value: certifications.length, suffix: '', pad: 2, label: t.about.statsLabels[3], tone: 'ai' },
        { value: 95, suffix: '%+', pad: 2, label: t.bento.slaLabel, tone: 'security' },
    ]

    return (
        <section aria-labelledby="about-title" className="w-full h-auto md:h-full px-4 md:px-6 pt-3 md:pb-6">
            <Bento className="max-w-[112rem] mx-auto">
                <SectionTile id="about" number={2} title={t.about.title} eyebrow={t.nav.about} index={0} className="col-span-2 md:col-[1/6] md:row-[1/2] min-h-[8rem] md:min-h-0" />

                {/* Story: the opening paragraph; the rest and the current focus sit behind the "i". */}
                <Tile index={1} className="col-span-2 md:col-[1/6] md:row-[2/5] gap-4 short:gap-2">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[1.25rem] md:text-[min(1.55vw,2.7vh)] font-semibold leading-snug tracking-[-0.015em]">
                            {t.about.tagline}
                        </h3>
                        <InfoSpot label={t.bento.spot.story} title={t.bento.spot.story} width={24}>
                            <div className="space-y-3">
                                {t.about.description.slice(1, 2).map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                                <p className="flex items-center gap-3 rounded-xl bg-[var(--fill)] p-2">
                                    <span className="fam-well tile--ai !w-8 !h-8 !rounded-lg" aria-hidden="true">
                                        <i className="fas fa-code text-xs" />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block eyebrow el-caps">{t.about.currentFocus}</span>
                                        <span className="block text-sm font-semibold">{t.about.currentFocusDetail}</span>
                                    </span>
                                </p>
                            </div>
                        </InfoSpot>
                    </div>
                    <p className="md:mt-auto text-[0.9375rem] md:text-[min(1.2vw,2.1vh)] leading-relaxed md:leading-[1.55] short:leading-snug text-[var(--muted)] md:lang-el:text-[min(1.08vw,1.9vh)]">
                        {t.about.description[0]}
                    </p>
                </Tile>

                {/* 550+ Macs, drawn to scale. */}
                <Tile index={2} tone="fleet" className="col-span-2 md:col-[6/10] md:row-[1/3] gap-3 short:gap-2 min-h-[14rem] md:min-h-0">
                    <div className="flex-1 min-h-0 flex">
                        <MacGrid className="w-full h-full max-h-[9rem] md:max-h-none text-white" />
                    </div>
                    <div className="flex items-end justify-between gap-3">
                        <div className="flex items-end gap-3 min-w-0">
                            <div className="numeral text-[2.75rem] md:text-[min(3.6vw,6.2vh)]">
                                <AnimatedCounter value={550} suffix="+" />
                            </div>
                            <p className="min-w-0 pb-1 text-sm md:text-[min(0.95vw,1.7vh)] font-semibold leading-tight el-caps">{t.about.statsLabels[1]}</p>
                        </div>
                        <InfoSpot label={t.bento.spot.macs} title={t.about.statsLabels[1]} tone="onColor" width={16}>
                            <p className="flex items-center gap-2.5">
                                <i className="fab fa-apple text-base" aria-hidden="true" />
                                <span>{t.bento.glyphLegend}</span>
                            </p>
                        </InfoSpot>
                    </div>
                </Tile>

                {/* Credentials */}
                <Tile index={3} className="col-span-2 md:col-[6/10] md:row-[3/5] gap-3">
                    <p className="eyebrow el-caps">{t.about.credentialsLabel}</p>
                    <ul className="flex-1 flex flex-col justify-between gap-2 short:gap-1">
                        {credentials.map((item) => {
                            const body = (
                                <>
                                    <span className={`${item.featured ? 'fam-well tile--fleet' : 'tile-icon text-[var(--muted)]'} !w-9 !h-9 short:!w-8 short:!h-8 !rounded-xl`} aria-hidden="true">
                                        {item.featured ? (
                                            <span className="block w-6 aspect-[2.875] bg-white [mask:url(/logos/jamf.svg)_no-repeat_center/contain] [-webkit-mask:url(/logos/jamf.svg)_no-repeat_center/contain]" />
                                        ) : (
                                            <i className={`${item.icon ?? (item.kind === 'license' ? 'fas fa-id-card' : 'fas fa-award')} text-sm`} />
                                        )}
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

                {/* Stats, 2 × 2, each in its family's colour. */}
                <div className="col-span-2 md:col-[10/13] md:row-[1/5] grid grid-cols-2 md:grid-rows-2 gap-[var(--gap)] min-h-0">
                    {stats.map((stat, index) => (
                        <Tile key={index} index={4 + index} tone={stat.tone} className="min-h-[8.5rem] md:min-h-0">
                            <div className="mt-auto">
                                <div className="numeral text-[2.5rem] md:text-[min(3.1vw,5.8vh)]">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} pad={stat.pad} duration={1.5} />
                                </div>
                                <p className="mt-2 text-caption md:text-[min(0.9vw,1.6vh)] font-semibold leading-tight el-caps">{stat.label}</p>
                            </div>
                        </Tile>
                    ))}
                </div>

                {/* Core skills — each opens a dialog. */}
                {t.skills.slice(0, 4).map((skill: Skill, index: number) => (
                    <Tile
                        key={skill.label}
                        index={8 + index}
                        interactive
                        className={`col-span-2 sm:col-span-1 md:row-[5/6] ${['md:col-[1/4]', 'md:col-[4/7]', 'md:col-[7/10]', 'md:col-[10/13]'][index]} flex-row items-center gap-3`}
                    >
                        <button type="button" className="tile-stretch" onClick={() => setActiveSkill(skill)} aria-label={`${skill.label} — ${t.about.readMore}`} />
                        <span className={`fam-well tile--${SKILL_FAMILIES[index]}`} aria-hidden="true">
                            <i className={`${skill.icon} text-base`} />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-sm md:text-[min(1vw,1.8vh)] font-semibold leading-tight">{skill.label}</span>
                        </span>
                        <span className="tile-affordance" aria-hidden="true">
                            <i className="fas fa-plus" />
                        </span>
                    </Tile>
                ))}

                {/* Toolkit — one row of headline logos; all 29, with names, behind the "+". */}
                <Tile index={12} className="col-span-2 md:col-[1/13] md:row-[6/7] gap-3 md:flex-row md:items-center md:gap-6 md:!py-[min(1.1rem,1.5vh)]">
                    <div className="flex items-center justify-between gap-3 md:block md:w-40 md:shrink-0">
                        <p className="eyebrow el-caps">{t.servicesLabels.toolkit}</p>
                        <p className="md:mt-1 text-sm md:text-[min(0.95vw,1.7vh)] font-semibold"><span className="tabular-nums">{TOOLS.length}</span> {t.bento.toolsInUse}</p>
                    </div>
                    <ul
                        aria-label={t.servicesLabels.toolkit}
                        className="logo-wall grid grid-cols-7 gap-2 md:flex-1 md:self-stretch md:min-h-0 md:grid-cols-[repeat(14,minmax(0,1fr))] md:gap-x-3"
                    >
                        {SHOWN_TOOLS.map((tool) => {
                            const inks = brandInks(tool)
                            return (
                                <li key={tool.label} className="flex items-center justify-center min-h-0">
                                    <ToolTile
                                        tool={tool}
                                        className="w-full md:!w-auto md:!h-full md:max-h-[3.25rem]"
                                        style={{ '--ink-l': inks.light, '--ink-d': inks.dark } as CSSProperties}
                                    />
                                    <span className="sr-only">{tool.label}</span>
                                </li>
                            )
                        })}
                    </ul>
                    <InfoSpot
                        label={`${t.bento.spot.toolkit} (${TOOLS.length})`}
                        title={`${TOOLS.length} ${t.bento.toolsInUse}`}
                        icon="plus"
                        text={`${TOOLS.length - SHOWN_TOOLS.length}`}
                        width={30}
                        className="max-md:self-end"
                    >
                        <ul className="logo-wall grid grid-cols-1 min-[420px]:grid-cols-2 gap-x-4 gap-y-1">
                            {TOOLS.map((tool) => {
                                const inks = brandInks(tool)
                                return (
                                    <li key={tool.label} className="flex items-center gap-2.5 min-w-0">
                                        <ToolTile tool={tool} className="!w-6 !h-6 !rounded-md shrink-0" style={{ '--ink-l': inks.light, '--ink-d': inks.dark } as CSSProperties} />
                                        <span className="text-[0.8125rem] font-medium leading-tight truncate">{tool.label}</span>
                                    </li>
                                )
                            })}
                        </ul>
                    </InfoSpot>
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
                        <span className={`fam-well tile--${SKILL_FAMILIES[Math.max(0, t.skills.indexOf(activeSkill))] ?? 'fleet'} !w-12 !h-12 mb-5`} aria-hidden="true">
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
