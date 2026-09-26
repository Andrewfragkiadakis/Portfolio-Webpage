'use client'

import { useState } from 'react'
import { useContent } from '@/hooks/useContent'
import { scrollToSection } from '@/utils/smooth-scroll'
import { sectionIndex } from '@/data/sections'
import type { Service } from '@/data/content'
import { TOOL_BY_LABEL, type Tool } from '@/data/tools'
import Modal from '@/components/ui/Modal'
import { ToolTile } from '@/components/ui/ToolBadge'
import { Glyph } from '@/components/ui/Glyph'
import { Chevron, Headline, Rise } from '@/components/ui/keynote'

const toolsFor = (service: Service): Tool[] =>
    service.tools.map((label) => TOOL_BY_LABEL.get(label)).filter((tool): tool is Tool => Boolean(tool))

/** apple.com's tile disclosure: a round (+) in the tile's corner. */
function Plus() {
    return (
        <span className="kn-plus" aria-hidden="true">
            <Glyph name="plus" className="w-4 h-4" strokeWidth={2.2} />
        </span>
    )
}

/**
 * Slide 3 — six borderless feature tiles (symbol, title, one line and a (+) that opens
 * a sheet with highlights and toolkit), under the "Happens twice?" headline.
 */
export default function Services() {
    const t = useContent()
    const k = t.keynote
    const [active, setActive] = useState<Service | null>(null)

    return (
        <section
            id="services"
            aria-labelledby="services-title"
            className="relative w-full md:h-full flex items-center px-6 sm:px-10 md:px-[max(3rem,7vw)] py-24 md:py-0"
        >
            <div className="mx-auto w-full max-w-[71rem]">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
                    <div>
                        <Rise className="short:hidden">
                            <p className="t-eyebrow">{k.services.eyebrow}</p>
                        </Rise>
                        <Headline
                            id="services-title"
                            text={k.services.headline}
                            className="t-headline mt-2 text-[2.25rem] md:text-[min(4.4vw,7.2vh)]"
                        />
                    </div>
                    <Rise delay={0.15} className="md:text-right md:pb-1.5">
                        <p className="t-body text-[var(--muted)]">{k.services.ctaLead}</p>
                        <button
                            type="button"
                            onClick={() => scrollToSection(sectionIndex('contact'), 'contact')}
                            className="kn-link t-body"
                        >
                            {k.services.ctaLink}
                            <Chevron />
                        </button>
                    </Rise>
                </div>

                <ul className="mt-10 md:mt-[min(3rem,5vh)] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                    {t.services.map((service, index) => (
                        <Rise as="li" key={service.title} delay={0.1 + index * 0.05} className="h-full">
                            <button
                                type="button"
                                onClick={() => setActive(service)}
                                aria-label={`${service.title} — ${k.services.learnMore}`}
                                className="tile tile--lg group relative w-full h-full text-left p-7 pb-16 md:px-[min(2rem,2.3vw)] md:pt-[min(1.75rem,3vh)] md:pb-[min(4rem,7vh)] flex flex-col"
                            >
                                <Glyph name={service.icon} className="w-8 h-8 md:w-[min(2.25rem,4vh)] md:h-[min(2.25rem,4vh)] text-[var(--foreground)]" strokeWidth={1.4} />
                                <span className="t-title mt-4 md:mt-[min(1rem,1.8vh)] text-[1.3125rem] md:text-[min(1.5rem,2.6vh)] tracking-[0.009em] pr-2">
                                    {service.title}
                                </span>
                                <span className="mt-2 t-body md:text-[min(1.0625rem,1.85vh)] text-[var(--muted)] pr-10">
                                    {service.oneLiner}
                                </span>
                                <span className="absolute right-5 bottom-5 md:right-[min(1.5rem,1.8vw)] md:bottom-[min(1.5rem,2.6vh)]">
                                    <Plus />
                                </span>
                            </button>
                        </Rise>
                    ))}
                </ul>
            </div>

            <Modal
                open={Boolean(active)}
                onClose={() => setActive(null)}
                labelledBy="service-modal-title"
                closeLabel={k.common.close}
                className="max-w-[43rem] w-full px-7 py-10 sm:px-14 sm:py-14"
            >
                {active && (
                    <>
                        <Glyph name={active.icon} className="w-10 h-10 mb-5 text-[var(--foreground)]" strokeWidth={1.4} />
                        <h3 id="service-modal-title" className="t-headline text-[2rem] sm:text-[2.5rem] pr-10">
                            {active.title}
                        </h3>
                        <p className="mt-4 t-lede text-[1.1875rem] sm:text-[1.3125rem]">{active.detail}</p>

                        <h4 className="mt-9 pb-3 t-small font-semibold border-b border-[var(--line)]">{k.services.highlights}</h4>
                        <ul>
                            {active.highlights.map((item) => (
                                <li key={item} className="t-body py-3 border-b border-[var(--line)]">
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <h4 className="mt-9 mb-4 t-small font-semibold">{k.services.toolkit}</h4>
                        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                            {toolsFor(active).map((tool) => (
                                <li key={tool.label} className="flex items-center gap-2.5 min-w-0">
                                    <ToolTile tool={tool} />
                                    <span className="t-small">{tool.label}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </Modal>
        </section>
    )
}
