'use client'

import { useContent } from '@/hooks/useContent'
import { scrollToSection } from '@/utils/smooth-scroll'
import { sectionIndex } from '@/data/sections'
import { useState } from 'react'
import type { Service } from '@/data/content'
import { TOOL_BY_LABEL, type Tool } from '@/data/tools'
import Modal from '@/components/ui/Modal'
import { LogoCluster, ToolTile, brandInks } from '@/components/ui/ToolBadge'
import { Bento, SectionTile, TileButton } from '@/components/ui/Bento'

/** Logos previewed on a tile; the dialog lists the whole toolkit by name. */
const CLUSTER_MAX = 4

const toolsFor = (service: Service): Tool[] =>
    service.tools.map((label) => TOOL_BY_LABEL.get(label)).filter((tool): tool is Tool => Boolean(tool))

/**
 * Round 5: eight equal tiles on a four-module grid (3 columns × 3 rows each):
 *   row 1–3  heading · Apple fleet · endpoint security · automation
 *   row 4–6  AI · service management · networks · let's talk
 * Apple fleet leads because it is the flagship, not because it is bigger.
 */
const AREAS = [
    'md:col-[4/7] md:row-[1/4]', 'md:col-[7/10] md:row-[1/4]', 'md:col-[10/13] md:row-[1/4]',
    'md:col-[1/4] md:row-[4/7]', 'md:col-[4/7] md:row-[4/7]', 'md:col-[7/10] md:row-[4/7]',
]
/** Content order is Endpoint Security, Apple Fleet, …; show Apple Fleet first. */
const ORDER = [1, 0, 2, 3, 4, 5]

function ServiceTile({ service, index, onOpen, detailsLabel }: {
    service: Service
    index: number
    onOpen: () => void
    detailsLabel: string
}) {
    const tools = toolsFor(service)

    return (
        <TileButton
            index={index + 1}
            onClick={onOpen}
            label={`${service.title} — ${detailsLabel}`}
            className={`col-span-2 ${AREAS[index] ?? ''} gap-4 short:gap-2 min-h-[13rem] md:min-h-0`}
        >
            <span className="tile-head">
                <span className="icon-well" aria-hidden="true">
                    <i className={`${service.icon} text-base`} />
                </span>
                <span className="tile-affordance transition-transform group-hover:rotate-90" aria-hidden="true">
                    <i className="fas fa-plus" />
                </span>
            </span>

            <span className="block mt-auto">
                <span className="block t-title el-caps">{service.title}</span>
                <span className="mt-1.5 short:mt-1 t-caption line-clamp-3 short:line-clamp-2">{service.description}</span>
            </span>

            <LogoCluster tools={tools.slice(0, CLUSTER_MAX)} className="pt-3 border-t border-[var(--line)]" />
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
                    className="col-span-2 md:col-[1/4] md:row-[1/4] min-h-[9rem] md:min-h-0"
                />

                {ORDER.map((i) => t.services[i]).filter(Boolean).map((service: Service, index: number) => (
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
                    className="col-span-2 md:col-[10/13] md:row-[4/7] gap-4 min-h-[10rem] md:min-h-0"
                >
                    <span className="tile-head">
                        <span className="icon-well" aria-hidden="true">
                            <i className="fas fa-comments text-base" />
                        </span>
                        <span className="tile-affordance" aria-hidden="true">
                            <i className="fas fa-arrow-right" />
                        </span>
                    </span>
                    <span className="block mt-auto">
                        <span className="block t-caption mb-2 el-caps">{t.servicesCta}</span>
                        <span className="flex items-center gap-2 t-value el-caps lang-el:!text-[1.875rem] md:lang-el:!text-[min(2.3vw,4vh)]">
                            {t.servicesCtaButton}
                            <i className="fas fa-arrow-right text-[0.5em] transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true" />
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
                            <span className="icon-well !w-12 !h-12" aria-hidden="true">
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
