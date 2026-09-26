'use client'

import { useContent } from '@/hooks/useContent'
import { scrollToSection } from '@/utils/smooth-scroll'
import { useSiteEntered } from '@/hooks/useSiteEntered'
import LocalTime from '@/components/ui/LocalTime'
import { Chevron, Headline, Parallax, Rich, Rise } from '@/components/ui/keynote'
import { sectionIndex, type SectionId } from '@/data/sections'

/**
 * Slide 1 — the title slide. Eyebrow, a two-line keynote headline with one gradient
 * word, an Apple-style lede and two pill buttons. Nothing follows the cursor; the glow
 * and the copy drift at different speeds only as the track moves.
 */
export default function HeroOverlay() {
    const t = useContent()
    const k = t.keynote
    const entered = useSiteEntered()

    const go = (id: SectionId) => scrollToSection(sectionIndex(id), id)

    return (
        <section
            id="hero"
            aria-labelledby="hero-title"
            className="relative w-full min-h-[100svh] md:min-h-0 md:h-full flex flex-col items-center justify-center px-5 sm:px-10 pt-24 pb-24 md:py-0 overflow-hidden text-center"
        >
            <Parallax depth={-0.3} className="pointer-events-none absolute inset-0" >
                <div className="kn-glow absolute inset-[-10%]" aria-hidden="true" />
            </Parallax>

            <Parallax depth={0.08} className="relative z-10 flex flex-col items-center w-full">
                <Rise play={entered}>
                    <p className="kn-eyebrow">{k.hero.eyebrow}</p>
                </Rise>

                <Headline
                    as="h1"
                    id="hero-title"
                    text={k.hero.headline}
                    play={entered}
                    srPrefix={`${k.common.name} —`}
                    className="mt-3 md:mt-4 max-w-full text-[clamp(2rem,8.8vw,4.5rem)] md:text-[min(8.6vw,13.5vh)]"
                />

                <Rise play={entered} delay={0.5}>
                    <p className="kn-lede mt-6 md:mt-8 mx-auto max-w-[38rem] md:max-w-[min(46rem,52vw)] text-[1.125rem] md:text-[min(1.6vw,2.8vh)]">
                        <Rich text={k.hero.sub} />
                    </p>
                </Rise>

                <Rise play={entered} delay={0.65} className="mt-8 md:mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
                    <button type="button" onClick={() => go('projects')} className="kn-pill kn-pill--fill">
                        {k.hero.viewWork}
                        <Chevron />
                    </button>
                    <button type="button" onClick={() => go('contact')} className="kn-pill kn-pill--line">
                        {k.hero.contact}
                        <Chevron />
                    </button>
                </Rise>
            </Parallax>

            {/* Desktop footer of the slide: where and when, plus which way the show goes. */}
            <Rise play={entered} delay={0.9} className="hidden md:flex absolute bottom-8 inset-x-12 items-center justify-between text-caption text-[var(--muted)]">
                <span className="flex items-center gap-2">
                    <span>{t.location}</span>
                    <span aria-hidden="true">·</span>
                    <LocalTime className="tabular-nums" />
                </span>
                <span className="flex items-center gap-2" aria-hidden="true">
                    {k.hero.scroll}
                    <Chevron className="kn-chevron--nudge" />
                </span>
            </Rise>
        </section>
    )
}
