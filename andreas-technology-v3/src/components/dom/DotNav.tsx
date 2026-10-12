'use client'

import { SECTION_IDS } from '@/data/sections'
import { useContent } from '@/hooks/useContent'
import { useActiveSlide } from '@/hooks/useActiveSlide'
import { scrollToSection } from '@/utils/track'

/**
 * apple.com gallery paddle-nav dots, in a small frosted pill at the bottom of the
 * desktop track. The current slide's dot stretches into a short bar; every dot is a
 * button to its slide. Focus stays on the dot, as in a carousel.
 */
export default function DotNav() {
    const nav = useContent().keynote.nav
    const labels = nav.sections
    const active = useActiveSlide()

    return (
        <nav
            data-dotnav
            aria-label={nav.slides}
            className="hidden md:flex fixed bottom-5 left-1/2 -translate-x-1/2 z-40 items-center gap-0.5 h-9 px-2.5 rounded-full bg-[var(--nav-bg)] backdrop-blur-[20px] backdrop-saturate-[1.8]"
        >
            {SECTION_IDS.map((id, i) => (
                <button
                    key={id}
                    type="button"
                    onClick={() => void scrollToSection(i)}
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
