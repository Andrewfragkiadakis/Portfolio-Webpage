'use client'

import { useContent } from '@/hooks/useContent'
import { useState, type CSSProperties } from 'react'
import type { Skill } from '@/data/content'
import Modal from '@/components/ui/Modal'
import { TOOLS } from '@/data/tools'
import { ToolTile, brandInks } from '@/components/ui/ToolBadge'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import { Bento, Figure, SectionTile, Tile, TileHead } from '@/components/ui/Bento'
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

/**
 * About, on a four-module grid (3 + 3 + 3 + 3 columns):
 *   row 1–4  heading and story (left half) · four key figures, 2 × 2 (right half)
 *   row 5    the four core skills, one per module
 *   row 6    the toolkit
 */
export default function About() {
    const t = useContent()
    const [activeSkill, setActiveSkill] = useState<Skill | null>(null)

    const certifications = t.education.filter((e) => e.kind === 'certification')
    const credentials = t.education.filter((e) => e.kind && e.kind !== 'degree')

    // Only published figures. Labels come from content in both languages.
    const stats: { value: number; suffix: string; pad: number; label: string; spot?: 'credentials' | 'sla' }[] = [
        { value: 550, suffix: '+', pad: 0, label: t.about.statsLabels[1] },
        { value: 7, suffix: '+', pad: 2, label: t.about.statsLabels[0] },
        { value: certifications.length, suffix: '', pad: 2, label: t.about.statsLabels[3], spot: 'credentials' },
        { value: 95, suffix: '%+', pad: 2, label: t.bento.slaLabel },
    ]
    const STAT_AREAS = ['md:col-[7/10] md:row-[1/3]', 'md:col-[10/13] md:row-[1/3]', 'md:col-[7/10] md:row-[3/5]', 'md:col-[10/13] md:row-[3/5]']

    return (
        <section aria-labelledby="about-title" className="w-full h-auto md:h-full px-4 md:px-6 pt-3 md:pb-6">
            <Bento className="max-w-[112rem] mx-auto">
                <SectionTile id="about" number={2} title={t.about.title} eyebrow={t.nav.about} index={0} className="col-span-2 md:col-[1/7] md:row-[1/2] min-h-[8rem] md:min-h-0" />

                {/* Story: the headline, then the opening paragraph; the rest and the current focus sit behind the "i". */}
                <Tile index={1} className="col-span-2 md:col-[1/7] md:row-[2/5] gap-4 short:gap-2">
                    <TileHead label={t.bento.tile.story}>
                        <InfoSpot label={t.bento.spot.story} title={t.bento.spot.story} width={24}>
                            <div className="space-y-3">
                                {t.about.description.slice(1, 2).map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                                <p className="flex items-center gap-3 rounded-xl bg-[var(--fill)] p-2">
                                    <span className="icon-well !w-8 !h-8 !rounded-lg" aria-hidden="true">
                                        <i className="fas fa-code text-xs" />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block t-label el-caps">{t.about.currentFocus}</span>
                                        <span className="block text-sm font-semibold">{t.about.currentFocusDetail}</span>
                                    </span>
                                </p>
                            </div>
                        </InfoSpot>
                    </TileHead>
                    <div className="md:mt-auto">
                        <h3 className="text-[1.25rem] md:text-[min(1.6vw,2.8vh)] font-semibold leading-snug tracking-[-0.02em] max-w-[36rem]">
                            {t.about.tagline}
                        </h3>
                        <p className="mt-3 short:mt-2 text-[0.9375rem] md:text-[min(1.1vw,1.95vh)] leading-relaxed md:leading-[1.55] short:leading-snug text-[var(--muted)] md:lang-el:text-[min(1.02vw,1.8vh)] max-w-[40rem]">
                            {t.about.description[0]}
                        </p>
                    </div>
                </Tile>

                {/* Four key figures, 2 × 2, same anatomy: label → figure. */}
                {stats.map((stat, index) => (
                    <Tile key={stat.label} index={2 + index} className={`col-span-1 ${STAT_AREAS[index]} gap-3 min-h-[9rem] md:min-h-0`}>
                        <TileHead label={stat.label}>
                            {stat.spot === 'credentials' && (
                                <InfoSpot label={t.about.credentialsLabel} title={t.about.credentialsLabel} width={20}>
                                    <ul className="space-y-2">
                                        {credentials.map((item) => (
                                            <li key={item.degree} className="flex items-start justify-between gap-3">
                                                <span className="min-w-0">
                                                    <span className="block font-semibold leading-tight">{item.badge ?? item.degree}</span>
                                                    <span className="block text-xs muted">{item.institution}</span>
                                                </span>
                                                {item.link && (
                                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="shrink-0 text-xs font-semibold text-[var(--accent)] hover:underline" aria-label={`${t.cursor.verify}: ${item.degree}`}>
                                                        <span className="el-caps">{t.cursor.verify}</span> <i className="fas fa-arrow-right -rotate-45 text-[0.6rem]" aria-hidden="true" />
                                                    </a>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </InfoSpot>
                            )}
                        </TileHead>
                        <Figure value={<AnimatedCounter value={stat.value} suffix={stat.suffix} pad={stat.pad} duration={1.5} />} />
                    </Tile>
                ))}

                {/* Core skills — each opens a dialog. */}
                {t.skills.slice(0, 4).map((skill: Skill, index: number) => (
                    <Tile
                        key={skill.label}
                        index={6 + index}
                        interactive
                        className={`row-tile col-span-2 sm:col-span-1 md:row-[5/6] ${['md:col-[1/4]', 'md:col-[4/7]', 'md:col-[7/10]', 'md:col-[10/13]'][index]}`}
                    >
                        <button type="button" className="tile-stretch" onClick={() => setActiveSkill(skill)} aria-label={`${skill.label} — ${t.about.readMore}`} />
                        <span className="icon-well" aria-hidden="true">
                            <i className={`${skill.icon} text-base`} />
                        </span>
                        <span className="min-w-0 flex-1 t-title">{skill.label}</span>
                        <span className="tile-affordance" aria-hidden="true">
                            <i className="fas fa-plus" />
                        </span>
                    </Tile>
                ))}

                {/* Toolkit — one row of headline logos; all 29, with names, behind the "+". */}
                <Tile index={10} className="col-span-2 md:col-[1/13] md:row-[6/7] gap-3 md:flex-row md:items-center md:gap-6 md:!py-[min(1.1rem,1.5vh)]">
                    <div className="flex items-center justify-between gap-3 md:block md:w-40 md:shrink-0">
                        <p className="t-label el-caps">{t.servicesLabels.toolkit}</p>
                        <p className="md:mt-1 t-caption"><span className="tabular-nums">{TOOLS.length}</span> {t.bento.toolsInUse}</p>
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
                        <span className="icon-well !w-12 !h-12 mb-5" aria-hidden="true">
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
