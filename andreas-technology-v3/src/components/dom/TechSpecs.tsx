'use client'

import { useContent } from '@/hooks/useContent'
import { TOOLS, TOOL_GROUPS } from '@/data/tools'
import { ToolLogo } from '@/components/ui/ToolBadge'
import { Headline, Rise } from '@/components/ui/keynote'

/**
 * Slide 4 — "Tech specs", laid out like an apple.com specs page: a label column on the
 * left, hairline rows, and every tool in day-to-day use with its official logo.
 */
export default function TechSpecs() {
    const k = useContent().keynote

    return (
        <section
            id="specs"
            aria-labelledby="specs-title"
            className="relative w-full md:h-full flex items-center px-6 sm:px-10 md:px-[max(3rem,7vw)] py-24 md:py-0"
        >
            <div className="mx-auto w-full max-w-[71rem]">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                    <div>
                        <Rise>
                            <p className="t-eyebrow">{k.specs.eyebrow}</p>
                        </Rise>
                        <Headline
                            id="specs-title"
                            text={k.specs.headline}
                            className="t-headline mt-2 text-[2.5rem] md:text-[min(4.4vw,7.2vh)]"
                        />
                    </div>
                    <Rise delay={0.15} className="md:pb-1.5">
                        <p className="t-body text-[var(--muted)]">{k.specs.sub}</p>
                    </Rise>
                </div>

                <Rise delay={0.2} className="mt-10 md:mt-[min(3.5rem,6vh)]">
                    <dl className="border-b border-[var(--line)]">
                        {TOOL_GROUPS.map((group) => (
                            <div
                                key={group}
                                className="grid grid-cols-1 md:grid-cols-[minmax(12rem,16rem)_1fr] gap-3 md:gap-8 py-6 md:py-[min(1.5rem,2.6vh)] border-t border-[var(--line)]"
                            >
                                <dt className="t-title text-[1.3125rem] md:text-[min(1.3125rem,2.3vh)] tracking-[0.011em]">
                                    {k.specs.groups[group]}
                                </dt>
                                <dd>
                                    <ul className="flex flex-wrap gap-x-7 gap-y-3">
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
