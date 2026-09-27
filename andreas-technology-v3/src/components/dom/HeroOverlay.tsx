'use client'

import { motion } from 'motion/react'
import { useContent } from '@/hooks/useContent'
import { useLanguage } from '@/contexts/LanguageContext'
import { scrollToSection } from '@/utils/smooth-scroll'
import { useSiteEntered } from '@/hooks/useSiteEntered'
import { EASE_APPLE } from '@/utils/motion'
import { HeadlineText, Rich, Rise } from '@/components/ui/keynote'
import { Mark } from '@/components/ui/Mark'
import { sectionIndex, type SectionId } from '@/data/sections'

/**
 * Slide 1 — the title slide, built like an apple.com product hero: the mark as the
 * "app icon", the name as the product eyebrow, one big headline (the site's only colour
 * moment is its second line), a short intro and two pill buttons.
 */
export default function HeroOverlay() {
    const t = useContent()
    const k = t.keynote
    const entered = useSiteEntered()
    // "Αυτοματοποιημένοι." is one long word: set it a step smaller on phones so it never touches the edges.
    const { language } = useLanguage()
    const phoneSize = language === 'gr' ? 'text-[clamp(2rem,8.6vw,4.5rem)]' : 'text-[clamp(2.75rem,12.4vw,4.5rem)]'

    const go = (id: SectionId) => scrollToSection(sectionIndex(id), id)

    return (
        <section
            id="hero"
            aria-labelledby="hero-title"
            className="relative w-full min-h-[100svh] md:min-h-0 md:h-full flex flex-col items-center justify-center px-6 sm:px-10 pt-24 pb-20 md:py-0 text-center"
        >
            <Rise play={entered}>
                <Mark size={112} alt="" priority className="mx-auto w-[5.5rem] h-[5.5rem] md:w-[min(7rem,13vh)] md:h-[min(7rem,13vh)]" />
            </Rise>

            <h1 id="hero-title" className="mt-4 md:mt-[min(1.5rem,2.6vh)] flex flex-col items-center">
                <motion.span
                    initial={{ opacity: 0, y: 24 }}
                    animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                    transition={{ duration: 1, ease: EASE_APPLE, delay: 0.1 }}
                    className="t-eyebrow block !text-[var(--foreground)]"
                >
                    {k.common.name}
                    <span className="sr-only"> — </span>
                </motion.span>
                <motion.span
                    initial={{ opacity: 0, y: 24 }}
                    animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                    transition={{ duration: 1, ease: EASE_APPLE, delay: 0.2 }}
                    className={`t-hero block mt-2 md:mt-3 ${phoneSize} md:text-[min(6.6vw,11vh)]`}
                >
                    <HeadlineText text={k.hero.headline} />
                </motion.span>
            </h1>

            <Rise play={entered} delay={0.4}>
                <p className="t-lede mt-5 md:mt-[min(1.75rem,3vh)] mx-auto max-w-[34rem] md:max-w-[40rem] text-[1.0625rem] leading-[1.4] md:text-[min(1.5rem,2.7vh)]">
                    <Rich text={k.hero.sub} />
                </p>
            </Rise>

            <Rise play={entered} delay={0.55} className="mt-8 md:mt-[min(2.5rem,4.4vh)] flex flex-wrap justify-center gap-3.5">
                <button type="button" onClick={() => go('projects')} className="kn-pill kn-pill--fill">
                    {k.hero.viewWork}
                </button>
                <button type="button" onClick={() => go('contact')} className="kn-pill kn-pill--line">
                    {k.hero.contact}
                </button>
            </Rise>

            {/* apple.com's quiet line under the hero buttons: the credential that anchors the headline. */}
            <Rise play={entered} delay={0.7}>
                <p className="mt-7 md:mt-[min(2rem,3.4vh)] t-small text-[var(--muted)]">{k.hero.note}</p>
            </Rise>
        </section>
    )
}
