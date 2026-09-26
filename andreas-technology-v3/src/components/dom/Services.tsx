'use client'

import { useState } from 'react'
import { useContent } from '@/hooks/useContent'
import { scrollToSection } from '@/utils/smooth-scroll'
import { sectionIndex } from '@/data/sections'
import type { Service } from '@/data/content'
import { TOOLS, TOOL_BY_LABEL, TOOL_GROUPS, type Tool } from '@/data/tools'
import Modal from '@/components/ui/Modal'
import { ToolLogo, ToolTile } from '@/components/ui/ToolBadge'
import { Chevron, Headline, Parallax, Rise } from '@/components/ui/keynote'

const toolsFor = (service: Service): Tool[] =>
    service.tools.map((label) => TOOL_BY_LABEL.get(label)).filter((tool): tool is Tool => Boolean(tool))

/**
 * Slide 3 — a feature grid (icon, title, one line, "Learn more ›") over an Apple
 * "Tech specs" table of every tool in daily use, each with its official logo.
 */
export default function Services() {
    const t = useContent()
    const k = t.keynote
    const [active, setActive] = useState<Service | null>(null)

    return (
        <section
            id="services"
            aria-labelledby="services-title"
            className="relative w-full md:h-full flex items-center px-5 sm:px-10 md:px-[max(3rem,6vw)] py-20 md:py-0"
        >
            <div className="mx-auto w-full max-w-[76rem]">
                <Parallax depth={-0.05} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <Rise>
                            <p className="kn-eyebrow">{k.services.eyebrow}</p>
                        </Rise>
                        <Headline
                            id="services-title"
                            text={k.services.headline}
                            className="mt-2 text-[clamp(2.1rem,8.6vw,3.5rem)] md:text-[min(4vw,6vh)]"
                        />
                    </div>
                    <Rise delay={0.3} className="md:text-right md:pb-2">
                        <p className="text-body-sm text-[var(--muted)]">{k.services.ctaLead}</p>
                        <button
                            type="button"
                            onClick={() => scrollToSection(sectionIndex('contact'), 'contact')}
                            className="kn-link text-[1.0625rem] mt-1"
                        >
                            {k.services.ctaLink}
                            <Chevron />
                        </button>
                    </Rise>
                </Parallax>

                <Parallax depth={0.03}>
                    <ul className="mt-8 md:mt-[min(3.4vh,2rem)] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        {t.services.map((service, index) => (
                            <Rise as="li" key={service.title} delay={0.1 + index * 0.06} className="h-full">
                                    <button
                                        type="button"
                                        onClick={() => setActive(service)}
                                        aria-label={`${service.title} — ${k.services.learnMore}`}
                                        className="kn-card group w-full h-full text-left p-5 md:px-[min(1.6vw,2.6vh)] md:py-[min(1.4vw,2.2vh)] flex flex-col transition-transform duration-500 ease-[var(--ease-apple)] hover:scale-[1.015]"
                                    >
                                        <span className="flex items-center gap-3">
                                            <i className={`${service.icon} text-[1.375rem] w-7 text-center text-[var(--accent)]`} aria-hidden="true" />
                                            <span className="text-[1.0625rem] md:text-[min(1.25vw,2.05vh)] font-semibold tracking-[-0.015em] leading-tight">
                                                {service.title}
                                            </span>
                                        </span>
                                        <span className="mt-2 text-body-sm md:text-[min(1vw,1.7vh)] leading-snug text-[var(--muted)] flex-1">
                                            {service.oneLiner}
                                        </span>
                                        <span className="kn-link mt-2 text-body-sm md:text-[min(1vw,1.7vh)] short:hidden" aria-hidden="true">
                                            {k.services.learnMore}
                                            <Chevron className="kn-chevron--nudge" />
                                        </span>
                                    </button>
                            </Rise>
                        ))}
                    </ul>
                </Parallax>

                <Parallax depth={0.07}>
                    <Rise delay={0.35} className="mt-10 md:mt-[min(3.4vh,2rem)]">
                        <div className="flex items-baseline justify-between gap-4 pb-2 border-b border-[var(--foreground)]/80">
                            <h3 className="kn-title text-[1.375rem] md:text-[min(1.6vw,2.6vh)]">{k.services.specsTitle}</h3>
                            <span className="text-caption text-[var(--muted)]">{k.services.specsNote}</span>
                        </div>
                        <dl>
                            {TOOL_GROUPS.map((group) => (
                                <div key={group} className="grid grid-cols-1 md:grid-cols-[minmax(10rem,14rem)_1fr] gap-2 md:gap-6 py-3 md:py-[min(0.75vh,0.5rem)] border-b border-[var(--line)]">
                                    <dt className="text-body-sm font-semibold">{k.services.groups[group]}</dt>
                                    <dd>
                                        <ul className="flex flex-wrap gap-x-5 gap-y-2">
                                            {TOOLS.filter((tool) => tool.group === group).map((tool) => (
                                                <li key={tool.label} className="flex items-center gap-2 text-body-sm text-[var(--muted)]">
                                                    <ToolLogo tool={tool} className="text-[var(--foreground)]" />
                                                    {tool.label}
                                                </li>
                                            ))}
                                        </ul>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </Rise>
                </Parallax>
            </div>

            <Modal
                open={Boolean(active)}
                onClose={() => setActive(null)}
                labelledBy="service-modal-title"
                closeLabel={k.common.close}
                className="max-w-xl w-full p-7 sm:p-9"
            >
                {active && (
                    <>
                        <span className="w-12 h-12 rounded-2xl bg-[var(--surface)] flex items-center justify-center text-[var(--accent)] mb-5" aria-hidden="true">
                            <i className={`${active.icon} text-xl`} />
                        </span>
                        <h3 id="service-modal-title" className="kn-title text-[1.625rem] sm:text-[1.875rem] pr-10">
                            {active.title}
                        </h3>
                        <p className="mt-3 text-[1.0625rem] leading-relaxed text-[var(--muted)]">{active.detail}</p>

                        <h4 className="mt-7 mb-3 text-body-sm font-semibold">{k.services.highlights}</h4>
                        <ul className="space-y-2.5">
                            {active.highlights.map((item) => (
                                <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-snug">
                                    <svg viewBox="0 0 16 16" className="w-4 h-4 mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden="true" fill="none">
                                        <path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <h4 className="mt-7 mb-3 text-body-sm font-semibold">{k.services.toolkit}</h4>
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
