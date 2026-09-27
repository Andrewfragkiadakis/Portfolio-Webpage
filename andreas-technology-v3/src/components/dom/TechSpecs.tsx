'use client'

import { useContent } from '@/hooks/useContent'
import { TOOLS, TOOL_GROUPS } from '@/data/tools'
import { ToolLogo } from '@/components/ui/ToolBadge'
import { HEADER_GAP, Rise, SLIDE_CLASS, SlideHeader } from '@/components/ui/keynote'

/**
 * Slide 4 — "Tech specs", laid out like an apple.com specs page: a label column on the
 * left, hairline rows, and every tool in day-to-day use with its official logo.
 */
export default function TechSpecs() {
    const k = useContent().keynote

    return (
        <section id="specs" aria-labelledby="specs-title" className={SLIDE_CLASS}>
            <div className="mx-auto w-full max-w-[71rem]">
                <SlideHeader
                    id="specs-title"
                    eyebrow={k.specs.eyebrow}
                    headline={k.specs.headline}
                    aside={<p className="t-body text-[var(--muted)]">{k.specs.sub}</p>}
                />

                <Rise delay={0.2} className={HEADER_GAP}>
                    <dl className="border-b border-[var(--line)]">
                        {TOOL_GROUPS.map((group) => (
                            <div
                                key={group}
                                className="grid grid-cols-1 md:grid-cols-[minmax(12rem,16rem)_1fr] md:items-baseline gap-3 md:gap-8 py-6 md:py-[min(1.5rem,2.4vh)] border-t border-[var(--line)]"
                            >
                                <dt className="t-title text-[1.3125rem] md:text-[min(1.3125rem,2.3vh)] tracking-[0.011em]">
                                    {k.specs.groups[group]}
                                </dt>
                                <dd>
                                    <ul className="flex flex-wrap gap-x-8 gap-y-3 md:gap-y-[min(0.75rem,1.4vh)]">
                                        {TOOLS.filter((tool) => tool.group === group).map((tool) => (
                                            <li key={tool.label} className="flex items-center gap-2.5 t-body md:text-[min(1.0625rem,1.9vh)]">
                                                <ToolLogo tool={tool} />
                                                {tool.label}
                                            </li>
                                        ))}
                                    </ul>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </Rise>
            </div>
        </section>
    )
}
