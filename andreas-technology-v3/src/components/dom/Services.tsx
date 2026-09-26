'use client'

import { useContent } from '@/hooks/useContent'
import { motion } from 'motion/react'
import { FADE_UP, WIPE_FROM_BOTTOM } from '@/utils/motion'
import { scrollToSection } from '@/utils/smooth-scroll'
import { sectionIndex } from '@/data/sections'
import { useState } from 'react'
import type { Service } from '@/data/content'
import { TOOL_BY_LABEL, type Tool } from '@/data/tools'
import RollText from '@/components/ui/RollText'
import Modal from '@/components/ui/Modal'
import Panel from '@/components/ui/Panel'
import { ToolTile } from '@/components/ui/ToolBadge'
import SectionHeading from '@/components/ui/SectionHeading'

const toolsFor = (service: Service): Tool[] =>
    service.tools.map((label) => TOOL_BY_LABEL.get(label)).filter((tool): tool is Tool => Boolean(tool))

/**
 * Services — a narrow paper column for the heading, then the six services as a 3×2
 * checkerboard of flat blocks. Every block is a button; hover/focus wipes the opposite
 * colour up through it (see `.svc-grid` in globals.css).
 */
export default function Services() {
    const t = useContent()
    const [active, setActive] = useState<Service | null>(null)

    return (
        <Panel id="services" label={t.servicesTitle} className="flex flex-col md:flex-row">
            <div className="surface-page md:w-[30%] flex flex-col justify-between gap-10 px-4 md:px-[var(--gutter)] pt-12 pb-12 md:pt-5 md:pb-10">
                <SectionHeading
                    id="services"
                    anchor={false}
                    compact
                    heavy
                    index={2}
                    label={t.nav.services}
                    title={t.editorial.sections.services}
                    sizeClass="text-[clamp(2.75rem,13vw,4.5rem)] md:text-[min(4.6vw,10vh)]"
                />

                <motion.div variants={FADE_UP} custom={0.5} className="flex flex-col gap-5">
                    <p className="font-display font-extrabold tracking-[-0.02em] leading-[1.1] text-[clamp(1.25rem,1.8vw,1.75rem)] max-w-[16ch]">
                        {t.servicesCta}
                    </p>
                    <button
                        type="button"
                        onClick={() => scrollToSection(sectionIndex('contact'), 'contact')}
                        className="btn btn-solid self-start"
                    >
                        <RollText>{t.servicesCtaButton}</RollText>
                        <span aria-hidden="true">→</span>
                    </button>
                </motion.div>
            </div>

            <ul className="svc-grid md:w-[70%] grid grid-cols-1 md:grid-cols-3 md:grid-rows-2">
                {t.services.map((service: Service, index: number) => (
                    <motion.li
                        key={service.title}
                        variants={WIPE_FROM_BOTTOM}
                        className={`invert-block ${index % 2 === 0 ? 'is-block' : ''}`}
                    >
                        <button
                            type="button"
                            onClick={() => setActive(service)}
                            aria-label={`${service.title} — ${t.servicesLabels.details}`}
                            className="w-full h-full text-left flex flex-col justify-between gap-6 short:gap-3 p-6 lg:p-7 xl:p-8 short:p-5 min-h-[18rem] md:min-h-0 focus-visible:outline-offset-[-8px]"
                        >
                            <span className="flex items-start justify-between gap-4 w-full">
                                <span className="eyebrow">{String(index + 1).padStart(2, '0')}</span>
                                <i className={`${service.icon} text-2xl`} aria-hidden="true" />
                            </span>

                            <span className="flex flex-col gap-3">
                                <span className="font-display font-extrabold tracking-[-0.03em] leading-[1.02] text-[clamp(1.5rem,1.9vw,2rem)] short:text-[1.375rem]">
                                    {service.title}
                                </span>
                                <span className="text-body-sm leading-relaxed opacity-85 line-clamp-6 short:line-clamp-3">
                                    {service.description}
                                </span>
                            </span>

                            <span className="flex items-center justify-between gap-3 w-full">
                                <span className="eyebrow opacity-85">
                                    {service.tools.length} {t.servicesLabels.tools}
                                </span>
                                <span className="w-9 h-9 shrink-0 flex items-center justify-center shadow-[inset_0_0_0_1.5px_currentColor]" aria-hidden="true">
                                    <i className="fas fa-plus text-sm" />
                                </span>
                            </span>
                        </button>
                    </motion.li>
                ))}
            </ul>

            <Modal
                open={Boolean(active)}
                onClose={() => setActive(null)}
                labelledBy="service-modal-title"
                closeLabel={t.projectsSection.close}
                className="max-w-xl w-full"
            >
                {active && (
                    <>
                        <div className="surface-block px-6 sm:px-8 pt-6 sm:pt-8 pb-6 pr-16">
                            <i className={`${active.icon} text-2xl`} aria-hidden="true" />
                            <h3 id="service-modal-title" className="mt-4 display-heavy text-[clamp(1.75rem,4vw,2.5rem)] leading-[0.92]">
                                {active.title}
                            </h3>
                        </div>

                        <div className="p-6 sm:p-8">
                            <p className="text-[0.9375rem] text-[var(--muted)] leading-relaxed mb-6">
                                {active.detail}
                            </p>

                            <h4 className="eyebrow text-[var(--accent-ink)] mb-3">
                                {t.servicesLabels.highlights}
                            </h4>
                            <ul className="border-t border-[var(--line)] mb-6">
                                {active.highlights.map((item) => (
                                    <li key={item} className="flex items-start gap-3 py-2.5 border-b border-[var(--line)] text-sm">
                                        <span className="w-2 h-2 mt-1.5 bg-[var(--block)] shrink-0" aria-hidden="true" />
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <h4 className="eyebrow text-[var(--accent-ink)] mb-3">
                                {t.servicesLabels.toolkit}
                            </h4>
                            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                                {toolsFor(active).map((tool) => (
                                    <li key={tool.label} className="flex items-center gap-2.5 min-w-0">
                                        <ToolTile tool={tool} />
                                        <span className="text-body-sm leading-tight">{tool.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </Modal>
        </Panel>
    )
}
