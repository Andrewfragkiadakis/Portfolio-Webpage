'use client'

import { useContent } from '@/hooks/useContent'
import { scrollToSection } from '@/utils/smooth-scroll'
import { sectionIndex } from '@/data/sections'
import { useState } from 'react'
import type { Service } from '@/data/content'
import { TOOL_BY_LABEL, type Tool } from '@/data/tools'
import Modal from '@/components/ui/Modal'
import { LogoCluster, ToolTile, brandInks } from '@/components/ui/ToolBadge'
import { Bento, SectionTile, TileButton, type Tone } from '@/components/ui/Bento'

/** Logos previewed on a tile; the dialog lists the whole toolkit by name. */
const CLUSTER_MAX = 4

const toolsFor = (service: Service): Tool[] =>
    service.tools.map((label) => TOOL_BY_LABEL.get(label)).filter((tool): tool is Tool => Boolean(tool))

/**
 * Placement per service, in content order:
 * Endpoint Security · Apple Fleet (the large tile) · Automation · AI · ITSM · Networks.
 */
const LAYOUT: { area: string; tone: Tone; size: 'lg' | 'md' | 'sm' }[] = [
    { area: 'md:col-[9/13] md:row-[1/3]', tone: 'security', size: 'md' },
    { area: 'md:col-[5/9] md:row-[1/5]', tone: 'fleet', size: 'lg' },
    { area: 'md:col-[9/13] md:row-[3/5]', tone: 'automation', size: 'md' },
    { area: 'md:col-[1/5] md:row-[3/5]', tone: 'ai', size: 'md' },
    { area: 'md:col-[1/4] md:row-[5/7]', tone: 'itsm', size: 'sm' },
    { area: 'md:col-[4/9] md:row-[5/7]', tone: 'graphite', size: 'md' },
]

function ServiceTile({ service, index, onOpen, detailsLabel }: {
    service: Service
    index: number
    onOpen: () => void
    detailsLabel: string
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
            {/* The flagship tile carries its icon again, large and faint, as a watermark. */}
            {large && (
                <i className={`${service.icon} absolute pointer-events-none opacity-[0.1] -right-[8%] top-[18%] text-[16rem] md:text-[min(21vw,36vh)]`} aria-hidden="true" />
            )}
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
                <span className={`mt-1.5 short:mt-1 text-sm md:text-[min(0.95vw,1.65vh)] leading-snug text-[var(--muted)] ${large ? 'line-clamp-3' : 'line-clamp-2'}`}>
                    {service.description}
                </span>
            </span>

            <LogoCluster tools={tools.slice(0, CLUSTER_MAX)} className="pt-1 short:pt-0" />
        </TileButton>
    )
}

export default function Services() {
    const t = useContent()
    const [active, setActive] = useState<Service | null>(null)
    const activeTone = active ? (LAYOUT[t.services.indexOf(active)] ?? LAYOUT[0]).tone : 'fleet'

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
                    />
                ))}

                {/* Call to action */}
                <TileButton
                    index={7}
                    onClick={() => scrollToSection(sectionIndex('contact'), 'contact')}
                    className="col-span-2 md:col-[9/13] md:row-[5/7] justify-between gap-6 min-h-[9rem] md:min-h-0"
                >
                    <span className="flex items-start justify-between gap-3">
                        <span className="fam-well tile--fleet" aria-hidden="true">
                            <i className="fas fa-comments text-lg" />
                        </span>
                        <span className="tile-affordance" aria-hidden="true">
                            <i className="fas fa-arrow-right" />
                        </span>
                    </span>
                    <span className="block">
                        <span className="block text-sm md:text-[min(1vw,1.8vh)] font-medium text-[var(--muted)] mb-1.5 el-caps">{t.servicesCta}</span>
                        <span className="flex items-center gap-2 text-2xl md:text-[min(2.4vw,4.3vh)] font-bold tracking-[-0.03em] leading-none text-[var(--accent)] el-caps">
                            {t.servicesCtaButton}
                            <i className="fas fa-arrow-right text-[0.6em] transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true" />
                        </span>
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
                            <span className={`fam-well tile--${activeTone === 'graphite' ? 'fleet' : activeTone} !w-12 !h-12`} aria-hidden="true">
                                <i className={`${active.icon} text-xl`} />
                            </span>
                            <h3 id="service-modal-title" className="text-2xl font-bold tracking-tight leading-tight el-caps">
                                {active.title}
                            </h3>
                        </div>

                        <p className="text-[0.95rem] font-medium leading-relaxed mb-3">
                            {active.description}
                        </p>
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
                                    <ToolTile tool={tool} colour={brandInks(tool).light} className="!bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]" />
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
