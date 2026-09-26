'use client'

import { useState } from 'react'
import { useMotionValueEvent, type MotionValue } from 'motion/react'
import { SECTION_IDS, SECTION_STEPS } from '@/data/sections'
import { useSectionLabels } from '@/hooks/useSectionLabels'
import { scrollToSection } from '@/utils/smooth-scroll'

/**
 * apple.com gallery paddle-nav dots, in a small frosted pill at the bottom of the
 * desktop track. The current slide's dot stretches into a short bar; every dot is a
 * button to its slide. Replaces the old gradient progress line.
 */
export default function DotNav({ progress }: { progress: MotionValue<number> }) {
    const labels = useSectionLabels()
    const [active, setActive] = useState(0)

    useMotionValueEvent(progress, 'change', (p) => {
        const next = Math.round(p * SECTION_STEPS)
        if (next !== active) setActive(next)
    })

    return (
        <nav
            aria-label="Slides"
            className="hidden md:flex fixed bottom-5 left-1/2 -translate-x-1/2 z-40 items-center gap-0.5 h-9 px-2.5 rounded-full bg-[var(--nav-bg)] backdrop-blur-[20px] backdrop-saturate-[1.8]"
        >
            {SECTION_IDS.map((id, i) => (
                <button
                    key={id}
                    type="button"
                    onClick={() => scrollToSection(i, id)}
                    aria-label={labels[id]}
                    aria-current={active === i ? 'true' : undefined}
                    className="group flex items-center justify-center h-6 px-[5px]"
                >
                    <span
                        aria-hidden="true"
                        className={`block h-2 rounded-full transition-[width,background-color] duration-500 ease-[var(--ease-apple)] ${active === i ? 'w-6 bg-[var(--foreground)]/80' : 'w-2 bg-[var(--foreground)]/50 group-hover:bg-[var(--foreground)]/70'}`}
                    />
                </button>
            ))}
        </nav>
    )
}
