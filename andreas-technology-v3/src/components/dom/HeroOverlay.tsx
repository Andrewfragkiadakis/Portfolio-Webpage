'use client'

import type { CSSProperties } from 'react'
import { useContent } from '@/hooks/useContent'
import { useLanguage } from '@/contexts/LanguageContext'
import { focusSection, scrollToSection } from '@/utils/track'
import { HeadlineText, Rich } from '@/components/ui/keynote'
import { Mark } from '@/components/ui/Mark'
import { sectionIndex, type SectionId } from '@/data/sections'

const step = (i: number) => ({ '--i': i }) as CSSProperties

/**
 * Slide 1 — the title slide, built like an apple.com product hero: the mark as the
 * "app icon", the name as the product eyebrow, one big headline (the site's only colour
 * moment is its second line), a short intro and two pill buttons.
 *
 * Its entrance is pure CSS and starts at first paint (.kn-enter / .kn-enter-text in
 * globals.css). The text only settles into place, never fading in from invisible, so the
 * page's largest paint is not held back by JavaScript or by the animation.
 */
export default function HeroOverlay() {
    const t = useContent()
    const k = t.keynote
    // "Αυτοματοποιημένοι." is one long word: set it a step smaller on phones so it never touches the edges.
    const { language } = useLanguage()
    const phoneSize = language === 'gr' ? 'text-[clamp(2rem,8.6vw,4.5rem)]' : 'text-[clamp(2.75rem,12.4vw,4.5rem)]'

    const go = (id: SectionId) => {
        void scrollToSection(sectionIndex(id)).then(() => focusSection(id))
    }

    return (
        <section
            id="hero"
            aria-labelledby="hero-title"
            className="relative w-full min-h-[100svh] md:min-h-0 md:h-full flex flex-col items-center justify-center px-6 sm:px-10 pt-24 pb-20 md:py-0 text-center"
        >
            <div className="kn-enter" style={step(0)}>
                <Mark size={112} alt="" priority className="mx-auto w-[5.5rem] h-[5.5rem] md:w-[min(7rem,13vh)] md:h-[min(7rem,13vh)]" />
            </div>

            <h1 id="hero-title" className="mt-4 md:mt-[min(1.5rem,2.6vh)] flex flex-col items-center">
                <span className="kn-enter-text t-eyebrow block !text-[var(--foreground)]" style={step(1)}>
                    {k.common.name}
                    <span className="sr-only"> — </span>
                </span>
                <span className={`kn-enter-text t-hero block mt-2 md:mt-3 ${phoneSize} md:text-[min(6.6vw,11vh)]`} style={step(2)}>
                    <HeadlineText text={k.hero.headline} />
                </span>
            </h1>

            <p
                className="kn-enter-text t-lede mt-5 md:mt-[min(1.75rem,3vh)] mx-auto max-w-[34rem] md:max-w-[40rem] text-[1.0625rem] leading-[1.4] md:text-[min(1.5rem,2.7vh)]"
                style={step(3)}
            >
                <Rich text={k.hero.sub} />
            </p>

            <div className="kn-enter mt-8 md:mt-[min(2.5rem,4.4vh)] flex flex-wrap justify-center gap-3.5" style={step(4)}>
                <button type="button" onClick={() => go('projects')} className="kn-pill kn-pill--fill">
                    {k.hero.viewWork}
                </button>
                <button type="button" onClick={() => go('contact')} className="kn-pill kn-pill--line">
                    {k.hero.contact}
                </button>
            </div>

            {/* apple.com's quiet line under the hero buttons: the credential that anchors the headline. */}
            <p className="kn-enter mt-7 md:mt-[min(2rem,3.4vh)] t-small text-[var(--muted)]" style={step(5)}>
                {k.hero.note}
            </p>
        </section>
    )
}
