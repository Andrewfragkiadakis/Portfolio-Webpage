'use client'

import { useContent } from '@/hooks/useContent'
import { motion } from 'motion/react'
import { EASE_OUT } from '@/utils/motion'
import { scrollToSection } from '@/utils/smooth-scroll'
import { sectionIndex } from '@/data/sections'
import { useState } from 'react'
import type { Service } from '@/data/content'
import { TOOL_BY_LABEL, type Tool } from '@/data/tools'
import SpotlightCard from '@/components/ui/SpotlightCard'
import SectionHeading from '@/components/ui/SectionHeading'
import RollText from '@/components/ui/RollText'
import Modal from '@/components/ui/Modal'
import { ToolTile } from '@/components/ui/ToolBadge'

const toolsFor = (service: Service): Tool[] =>
    service.tools.map((label) => TOOL_BY_LABEL.get(label)).filter((tool): tool is Tool => Boolean(tool))

export default function Services() {
    const t = useContent()
    const [active, setActive] = useState<Service | null>(null)

    return (
        <section className="w-full h-auto md:h-full flex flex-col justify-center px-4 sm:px-12 md:px-24 py-4 md:py-0 overflow-visible md:overflow-x-hidden md:overflow-y-auto no-scrollbar">
            <div className="max-w-7xl mx-auto w-full">
                <SectionHeading id="services" title={t.servicesTitle} subtitle={t.servicesSubtitle} align="end" className="mb-5 sm:mb-6" />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                    {t.services.map((service: Service, index: number) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, ease: EASE_OUT, delay: index * 0.08 }}
                        >
                            <SpotlightCard
                                onClick={() => setActive(service)}
                                label={`${service.title} — ${t.servicesLabels.details}`}
                                cursor={t.cursor.open}
                                className="bg-[var(--background)] p-5 border border-[var(--foreground)]/50 hover:border-[var(--accent)] transition-all duration-300 hover:shadow-[0_0_20px_var(--accent)] group flex flex-col justify-between h-full"
                            >
                                <div className="relative z-10">
                                    {/* Icon sits beside the title rather than above it: six cards
                                        in two rows only fit a laptop viewport without the stacked height. */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-11 h-11 shrink-0 bg-[var(--foreground)]/10 rounded-full flex items-center justify-center text-xl text-[var(--accent)] group-hover:scale-110 transition-transform duration-300">
                                            <i className={service.icon} aria-hidden="true" />
                                        </div>
                                        <h3 className="text-base lg:text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors uppercase tracking-tight leading-tight">
                                            {service.title}
                                        </h3>
                                    </div>
                                    <p className="hidden md:block text-[var(--foreground)] opacity-80 leading-relaxed text-body-sm">
                                        {service.description}
                                    </p>
                                </div>

                                {/* Footer: a quiet hint of what's inside, and the "open" affordance. */}
                                <div className="relative z-10 mt-4 flex items-center justify-between gap-3">
                                    <span className="text-micro font-mono uppercase tracking-widest text-[var(--foreground)] opacity-60 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-[opacity,color] duration-300">
                                        {service.tools.length} {t.servicesLabels.tools}
                                    </span>
                                    <span
                                        className="w-9 h-9 shrink-0 rounded-full border border-[var(--accent)]/60 flex items-center justify-center text-[var(--accent)] transition-[transform,background-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-90 group-hover:bg-[var(--accent)] group-hover:text-[var(--background)] group-focus-visible:rotate-90"
                                        aria-hidden="true"
                                    >
                                        <i className="fas fa-plus text-sm" />
                                    </span>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-5 md:mt-6 text-center"
                >
                    <p className="text-base md:text-lg text-[var(--foreground)] opacity-90 mb-3">
                        {t.servicesCta}
                    </p>
                    <button
                        onClick={() => scrollToSection(sectionIndex('contact'), 'contact')}
                        className="inline-block px-8 py-3.5 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--background)] transition-all duration-300 ease-out font-bold uppercase tracking-widest hover:shadow-[0_0_20px_var(--accent)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    >
                        <RollText>{t.servicesCtaButton}</RollText>
                    </button>
                </motion.div>
            </div>

            <Modal
                open={Boolean(active)}
                onClose={() => setActive(null)}
                labelledBy="service-modal-title"
                closeLabel={t.projectsSection.close}
                className="max-w-xl w-full p-6 sm:p-8"
            >
                {active && (
                    <>
                        <div className="flex items-center gap-4 mb-5 pr-10">
                            <div className="w-12 h-12 shrink-0 border border-[var(--accent)] flex items-center justify-center text-xl text-[var(--accent)]">
                                <i className={active.icon} aria-hidden="true" />
                            </div>
                            <h3 id="service-modal-title" className="text-lg sm:text-xl font-black text-[var(--accent)] uppercase tracking-tight leading-tight">
                                {active.title}
                            </h3>
                        </div>

                        <p className="text-sm text-[var(--foreground)] opacity-85 leading-relaxed mb-6">
                            {active.detail}
                        </p>

                        <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
                            {t.servicesLabels.highlights}
                        </h4>
                        <ul className="space-y-2 mb-6">
                            {active.highlights.map((item) => (
                                <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--foreground)] opacity-85">
                                    <i className="fas fa-check text-[var(--accent)] text-caption mt-1 shrink-0" aria-hidden="true" />
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
                            {t.servicesLabels.toolkit}
                        </h4>
                        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                            {toolsFor(active).map((tool) => (
                                <li key={tool.label} className="flex items-center gap-2.5 min-w-0">
                                    <ToolTile tool={tool} />
                                    <span className="text-body-sm text-[var(--foreground)] leading-tight">{tool.label}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </Modal>
        </section>
    )
}
