'use client'

import { useContent } from '@/hooks/useContent'
import { scrollToSection } from '@/utils/smooth-scroll'
import { sectionIndex } from '@/data/sections'
import { useState } from 'react'
import type { Service } from '@/data/content'
import { TOOL_BY_LABEL, type Tool } from '@/data/tools'
import Modal from '@/components/ui/Modal'
import { ToolTile } from '@/components/ui/ToolBadge'
import { Bento, SectionTile, TileButton, type Tone } from '@/components/ui/Bento'

const toolsFor = (service: Service): Tool[] =>
    service.tools.map((label) => TOOL_BY_LABEL.get(label)).filter((tool): tool is Tool => Boolean(tool))

/**
 * Placement per service, in content order:
 * Endpoint Security · Apple Fleet (the large tile) · Automation · AI · ITSM · Networks.
 */
const LAYOUT: { area: string; tone: Tone; size: 'lg' | 'md' | 'sm' }[] = [
    { area: 'md:col-[9/13] md:row-[1/3]', tone: 'plain', size: 'md' },
    { area: 'md:col-[5/9] md:row-[1/5]', tone: 'plain', size: 'lg' },
    { area: 'md:col-[9/13] md:row-[3/5]', tone: 'plain', size: 'md' },
    { area: 'md:col-[1/5] md:row-[3/5]', tone: 'lavender', size: 'md' },
    { area: 'md:col-[1/4] md:row-[5/7]', tone: 'plain', size: 'sm' },
    { area: 'md:col-[4/9] md:row-[5/7]', tone: 'plain', size: 'md' },
]

function ServiceTile({ service, index, onOpen, detailsLabel, toolsLabel }: {
    service: Service
    index: number
    onOpen: () => void
    detailsLabel: string
    toolsLabel: string
}) {
    const { area, tone, size } = LAYOUT[index] ?? LAYOUT[0]
    const tools = toolsFor(service)
    const large = size === 'lg'

    return (
        <TileButton
            index={index + 1}
            tone={tone}
            onClick={onOpen}
            label={`${service.title} — ${detailsLabel}`}
            className={`col-span-2 ${area} gap-3 short:gap-2 ${large ? 'md:gap-4' : ''}`}
        >
            <span className="flex items-start justify-between gap-3">
                <span className={`tile-icon tile-mark ${large ? 'md:!w-14 md:!h-14 md:!rounded-[1.125rem]' : ''}`} aria-hidden="true">
                    <i className={`${service.icon} ${large ? 'text-xl md:text-2xl' : 'text-lg'}`} />
                </span>
                <span className="tile-affordance transition-transform group-hover:rotate-90" aria-hidden="true">
                    <i className="fas fa-plus" />
                </span>
            </span>

            <span className={`block ${large ? 'md:mt-auto' : 'mt-auto'}`}>
                <span className={`block font-semibold tracking-[-0.02em] leading-tight el-caps ${large ? 'text-xl sm:text-2xl md:text-[min(2.3vw,4.1vh)] break-words' : 'text-lg md:text-[min(1.3vw,2.3vh)]'}`}>
                    {service.title}
                </span>
                <span className={`block mt-1.5 short:mt-1 text-sm md:text-[min(0.95vw,1.65vh)] leading-snug text-[var(--muted)] ${large ? 'md:line-clamp-4' : 'line-clamp-2'}`}>
                    {service.description}
                </span>
            </span>

            {large && (
                <span className="hidden md:block space-y-1.5">
                    {service.highlights.map((item) => (
                        <span key={item} className="flex items-start gap-2 text-[min(0.95vw,1.65vh)] leading-snug">
                            <i className="fas fa-check tile-mark text-caption mt-[0.2em] shrink-0" aria-hidden="true" />
                            <span>{item}</span>
                        </span>
                    ))}
                </span>
            )}

            <span className="flex items-center justify-between gap-3 pt-1 short:pt-0">
                <span className="flex gap-1.5 min-w-0 overflow-hidden" aria-hidden="true">
                    {tools.map((tool) => (
                        <ToolTile key={tool.label} tool={tool} className="tool-tile--sm" />
                    ))}
                </span>
                <span className="shrink-0 eyebrow el-caps tabular-nums">
                    {String(service.tools.length).padStart(2, '0')} {toolsLabel}
                </span>
            </span>
        </TileButton>
    )
}

export default function Services() {
    const t = useContent()
    const [active, setActive] = useState<Service | null>(null)

    return (
        <section aria-labelledby="services-title" className="w-full h-auto md:h-full px-4 md:px-6 pt-3 md:pb-6">
            <Bento className="max-w-[112rem] mx-auto">
                <SectionTile
                    id="services"
                    number={3}
                    title={t.servicesTitle}
                    eyebrow={t.servicesSubtitle}
                    index={0}
                    className="col-span-2 md:col-[1/5] md:row-[1/3] min-h-[9rem] md:min-h-0"
                />

                {t.services.map((service: Service, index: number) => (
                    <ServiceTile
                        key={service.title}
                        service={service}
                        index={index}
                        onOpen={() => setActive(service)}
                        detailsLabel={t.servicesLabels.details}
                        toolsLabel={t.servicesLabels.tools}
                    />
                ))}

                {/* Call to action */}
                <TileButton
                    index={7}
                    tone="accent"
                    onClick={() => scrollToSection(sectionIndex('contact'), 'contact')}
                    className="col-span-2 md:col-[9/13] md:row-[5/7] justify-between gap-6 min-h-[9rem] md:min-h-0"
                >
                    <span className="flex items-start justify-between gap-3">
                        <span className="tile-icon" aria-hidden="true">
                            <i className="fas fa-comments text-lg" />
                        </span>
                        <span className="tile-affordance" aria-hidden="true">
                            <i className="fas fa-arrow-right" />
                        </span>
                    </span>
                    <span className="block">
                        <span className="block text-sm md:text-[min(1vw,1.8vh)] font-medium mb-1 el-caps">{t.servicesCta}</span>
                        <span className="block text-2xl md:text-[min(2.2vw,4vh)] font-bold tracking-[-0.03em] leading-none el-caps">{t.servicesCtaButton}</span>
                    </span>
                </TileButton>
            </Bento>

            <Modal
                open={Boolean(active)}
                onClose={() => setActive(null)}
                labelledBy="service-modal-title"
                closeLabel={t.projectsSection.close}
                className="max-w-xl w-full p-7 sm:p-9"
            >
                {active && (
                    <>
                        <div className="flex items-center gap-4 mb-5 pr-10">
                            <span className="tile-icon !w-12 !h-12 text-[var(--accent)]" aria-hidden="true">
                                <i className={`${active.icon} text-xl`} />
                            </span>
                            <h3 id="service-modal-title" className="text-2xl font-bold tracking-tight leading-tight el-caps">
                                {active.title}
                            </h3>
                        </div>

                        <p className="text-[0.95rem] text-[var(--muted)] leading-relaxed mb-6">
                            {active.detail}
                        </p>

                        <h4 className="eyebrow el-caps mb-3">{t.servicesLabels.highlights}</h4>
                        <ul className="space-y-2 mb-6">
                            {active.highlights.map((item) => (
                                <li key={item} className="flex items-start gap-2.5 text-[0.95rem]">
                                    <i className="fas fa-check text-[var(--accent)] text-caption mt-1.5 shrink-0" aria-hidden="true" />
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <h4 className="eyebrow el-caps mb-3">{t.servicesLabels.toolkit}</h4>
                        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {toolsFor(active).map((tool) => (
                                <li key={tool.label} className="flex items-center gap-2.5 min-w-0 rounded-2xl bg-[var(--surface-2)] p-2">
                                    <ToolTile tool={tool} />
                                    <span className="text-body-sm font-medium leading-tight">{tool.label}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </Modal>
        </section>
    )
}
