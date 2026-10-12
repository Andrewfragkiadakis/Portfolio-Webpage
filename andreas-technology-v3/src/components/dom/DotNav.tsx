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
            className="hidden md:flex fixed bottom-5 left-1/2 -translate-x-1/2 z-40 items-center h-9 px-1.5 rounded-full bg-[var(--nav-bg)] backdrop-blur-[20px] backdrop-saturate-[1.8] reduced-transparency:backdrop-blur-none reduced-transparency:bg-[var(--background)] [contain:layout]"
        >
            {SECTION_IDS.map((id, i) => {
                const current = active === i
                return (
                    <button
                        key={id}
                        type="button"
                        onClick={() => void scrollToSection(i)}
                        aria-label={labels[id]}
                        aria-current={current ? 'true' : undefined}
                        // 40px tall targets overhang the 36px pill invisibly (WCAG 2.5.8).
                        className="group flex items-center justify-center h-10 w-7"
                    >
                        {/* A dot that grows into a bar: scale and opacity only, so it never re-lays out. */}
                        <span aria-hidden="true" className="relative block w-6 h-2">
                            <span className={`kn-dot absolute left-1/2 top-0 w-2 h-2 -ml-1 rounded-full bg-[var(--foreground)]/50 group-hover:bg-[var(--foreground)]/70 transition-opacity duration-[var(--motion-base)] ${current ? 'opacity-0' : ''}`} />
                            <span className={`kn-dot absolute inset-0 rounded-full bg-[var(--foreground)]/80 transition-[transform,opacity] duration-[var(--motion-base)] ease-apple ${current ? 'opacity-100' : 'scale-x-[0.34] opacity-0'}`} />
                        </span>
                    </button>
                )
            })}
        </nav>
    )
}
