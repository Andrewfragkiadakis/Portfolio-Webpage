'use client'

import { useContent } from '@/hooks/useContent'
import { motion } from 'motion/react'
import { EASE_OUT } from '@/utils/motion'
import { scrollToSection } from '@/utils/smooth-scroll'
import { sectionIndex } from '@/data/sections'
import { useState } from 'react'
import type { Service } from '@/data/content'
import { TOOL_BY_LABEL, type Tool } from '@/data/tools'
import SectionHeading from '@/components/ui/SectionHeading'
import Modal from '@/components/ui/Modal'
import { ToolTile } from '@/components/ui/ToolBadge'

const toolsFor = (service: Service): Tool[] =>
    service.tools.map((label) => TOOL_BY_LABEL.get(label)).filter((tool): tool is Tool => Boolean(tool))

export default function Services() {
    const t = useContent()
    const [active, setActive] = useState<Service | null>(null)
    const activeIndex = active ? t.services.indexOf(active) : -1

    return (
        <section className="w-full md:h-full flex flex-col px-4 md:px-10 pt-16 pb-14 md:pt-5 md:pb-6">
            <SectionHeading id="services" index={2} label={t.nav.services} title={t.editorial.sections.services} subtitle={t.servicesSubtitle} />

            <div className="flex-1 min-h-8 md:min-h-4" />

            {/* 3 × 2 text blocks. The 1px gap over a rule-coloured ground draws the hairlines. */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-[var(--rule)] border-y border-[var(--rule)]">
                {t.services.map((service: Service, index: number) => (
                    <motion.li
                        key={service.title}
                        className="bg-[var(--background)]"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, ease: EASE_OUT, delay: index * 0.06 }}
                    >
                        <button
                            type="button"
                            onClick={() => setActive(service)}
                            aria-label={`${service.title} — ${t.servicesLabels.details}`}
                            data-cursor={t.cursor.open}
                            className="index-row group w-full h-full text-left flex flex-col px-0 sm:px-5 md:px-6 py-5 md:py-5"
                        >
                            <span className="flex items-baseline justify-between gap-3">
                                <span className="index text-sm font-medium">{String(index + 1).padStart(2, '0')}</span>
                                <span className="meta">{service.tools.length} {t.servicesLabels.tools}</span>
                            </span>
                            <span className="row-title block mt-5 md:mt-6 text-[1.375rem] md:text-[clamp(1.25rem,1.65vw,1.625rem)] font-medium leading-[1.08] tracking-[-0.03em] text-balance">
                                {service.title}
                            </span>
                            <span className="block mt-2.5 text-sm text-[var(--muted)] leading-snug line-clamp-3">
                                {service.description}
                            </span>
                            <span className="mt-auto pt-4 flex items-center gap-2 text-caption font-medium uppercase tracking-[0.06em]">
                                <span className="link-underline">{t.servicesLabels.details}</span>
                                <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-90 group-focus-visible:rotate-90" aria-hidden="true">+</span>
                            </span>
                        </button>
                    </motion.li>
                ))}
            </ul>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-5 md:mt-4 grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6 gap-y-3 items-baseline"
            >
                <p className="col-span-4 md:col-span-6 text-lg md:text-xl font-medium tracking-[-0.02em]">
                    {t.servicesCta}
                </p>
                <div className="col-span-4 md:col-span-6 md:text-right">
                    <button
                        type="button"
                        onClick={() => scrollToSection(sectionIndex('contact'), 'contact')}
                        className="arrow-link inline-flex items-center gap-3 bg-[var(--foreground)] text-[var(--background)] px-5 py-3 text-sm font-medium hover:bg-[var(--accent-ink)] transition-colors duration-300"
                    >
                        {t.servicesCtaButton}
                        <span className="arrow" aria-hidden="true">→</span>
                    </button>
                </div>
            </motion.div>

            <Modal
                open={Boolean(active)}
                onClose={() => setActive(null)}
                labelledBy="service-modal-title"
                closeLabel={t.projectsSection.close}
                className="max-w-xl w-full p-6 md:p-8"
            >
                {active && (
                    <>
                        <p className="meta mb-3">
                            <span className="index">({String(activeIndex + 1).padStart(2, '0')})</span> {t.nav.services}
                        </p>
                        <h3 id="service-modal-title" className="display text-3xl md:text-4xl pr-16 mb-5">
                            {active.title}
                        </h3>

                        <p className="text-sm leading-relaxed rule-t pt-4 mb-6">
                            {active.detail}
                        </p>

                        <h4 className="meta mb-2">{t.servicesLabels.highlights}</h4>
                        <ol className="mb-6 text-sm">
                            {active.highlights.map((item, i) => (
                                <li key={item} className="rule-t grid grid-cols-[2rem_1fr] py-2">
                                    <span className="index tabular">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ol>

                        <h4 className="meta mb-3">{t.servicesLabels.toolkit}</h4>
                        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                            {toolsFor(active).map((tool) => (
                                <li key={tool.label} className="flex items-center gap-2.5 min-w-0">
                                    <ToolTile tool={tool} />
                                    <span className="text-body-sm leading-tight">{tool.label}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </Modal>
        </section>
    )
}
