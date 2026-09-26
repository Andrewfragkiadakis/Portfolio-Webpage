'use client'

import { motion } from 'motion/react'
import { useContent } from '@/hooks/useContent'
import { useSiteEntered } from '@/hooks/useSiteEntered'
import { useIsDesktop } from '@/hooks/useIsDesktop'
import { useFitText } from '@/hooks/useFitText'
import { scrollToSection as smoothScrollToSection } from '@/utils/smooth-scroll'
import { FADE_UP, RISE_LINE, WIPE_FROM_LEFT } from '@/utils/motion'
import { sectionIndex, type SectionId } from '@/data/sections'
import LocalTime from '@/components/ui/LocalTime'
import RollText from '@/components/ui/RollText'
import WordCycle from '@/components/ui/WordCycle'
import Panel from '@/components/ui/Panel'

/**
 * Hero — a 40/60 split. The name is set as one line of heavy type broken across the seam:
 * the first name white on the cobalt field, the surname cobalt on paper, both fitted to
 * the same size so they read as a single line. Under it, a single word crossfades
 * through what the work is about. Both halves open with a Swiss meta row on a strong
 * hairline, at the same height as every other panel's header.
 */
export default function HeroOverlay() {
    const t = useContent()
    const entered = useSiteEntered()
    const isDesktop = useIsDesktop()
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(t.email)}&su=${encodeURIComponent('Project Collaboration // Andreas Technology')}`

    // Desktop: one shared size across the seam. Mobile: each word fills its own row.
    const fit = useFitText(2, { maxVh: 17, maxPx: 240, shared: Boolean(isDesktop), watch: `${t.hero.firstName}${t.hero.lastName}${isDesktop}` })

    const scrollToSection = (id: SectionId) => smoothScrollToSection(sectionIndex(id), id)

    const nameClass = 'font-display uppercase inline-block whitespace-nowrap text-[clamp(3rem,7.2vw,8rem)] pt-[0.06em] pr-[0.06em]'

    return (
        <Panel id="hero" play={entered} label={`${t.editorial.firstName} ${t.editorial.lastName}`} className="flex flex-col md:flex-row min-h-[100svh] md:min-h-0">
            <h1 className="sr-only">{`${t.editorial.firstName} ${t.editorial.lastName} — ${t.title}`}</h1>

            {/* ── Cobalt field ───────────────────────────────────────── */}
            <motion.div
                variants={WIPE_FROM_LEFT}
                className="surface-block relative flex flex-col justify-between gap-10 md:w-[40%] px-4 md:px-[var(--gutter)] pt-20 pb-8 md:pt-5 md:pb-10"
            >
                <motion.div variants={FADE_UP} custom={0.7} className="rule-t-strong pt-2.5 flex items-baseline justify-between gap-4">
                    <span className="flex items-baseline gap-4">
                        <span className="meta index">(00)</span>
                        <span className="meta text-[var(--foreground)]">{t.nav.home}</span>
                    </span>
                    <span className="meta tabular">Portfolio © 2026</span>
                </motion.div>

                {/* Name row — absolutely placed on desktop so both halves share one baseline. */}
                <div className="md:absolute md:inset-x-[var(--gutter)] md:top-[35%]">
                    <div ref={fit.box(0)} className="w-full overflow-hidden md:text-right" aria-hidden="true">
                        <motion.span ref={fit.text(0)} variants={RISE_LINE} custom={0.55} className={nameClass}>
                            {t.hero.firstName}
                        </motion.span>
                    </div>
                    <motion.p variants={FADE_UP} custom={0.9} className="mt-5 md:mt-6 md:text-right font-display tracking-[-0.02em] leading-[1.05] text-[clamp(1.125rem,1.6vw,1.5rem)] font-extrabold max-w-[22ch] md:ml-auto">
                        {t.title}
                    </motion.p>
                </div>

                <motion.div variants={FADE_UP} custom={1.05} className="flex items-end justify-between gap-6">
                    <div className="flex gap-2">
                        <a href={t.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="btn btn-line btn-icon">
                            <i className="fab fa-linkedin-in" aria-hidden="true" />
                        </a>
                        <a href={t.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="btn btn-line btn-icon">
                            <i className="fab fa-github" aria-hidden="true" />
                        </a>
                        <a href={gmailComposeUrl} target="_blank" rel="noopener noreferrer" aria-label="Contact via email" className="btn btn-line btn-icon">
                            <i className="fas fa-envelope" aria-hidden="true" />
                        </a>
                    </div>
                    <span className="meta hidden sm:block text-right">
                        Jamf 200 · 550+ Macs
                    </span>
                </motion.div>
            </motion.div>

            {/* ── Paper field ────────────────────────────────────────── */}
            <div className="surface-page relative flex flex-col justify-between gap-10 md:w-[60%] px-4 md:px-[var(--gutter)] pt-8 pb-28 md:pt-5 md:pb-10">
                {/* Meta row: three facts on the grid, the live clock carrying the one red dot. */}
                <motion.dl variants={FADE_UP} custom={0.8} className="rule-t-strong pt-2.5 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                    <div>
                        <dt className="meta">{t.editorial.meta.basedIn}</dt>
                        <dd className="mt-1 text-sm font-medium">{t.location}</dd>
                    </div>
                    <div>
                        <dt className="meta">{t.contact.localTimeLabel}</dt>
                        <dd className="mt-1 text-sm font-medium flex items-center gap-2">
                            {/* The one signal-red detail on the site: the live clock. */}
                            <span className="w-1.5 h-1.5 bg-[var(--signal)] motion-safe:animate-pulse" aria-hidden="true" />
                            <LocalTime className="tabular" />
                        </dd>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <dt className="meta">{t.about.currentFocus}</dt>
                        <dd className="mt-1 text-sm font-medium">{t.about.currentFocusDetail}</dd>
                    </div>
                </motion.dl>

                <div className="md:absolute md:inset-x-[var(--gutter)] md:top-[35%]">
                    <div ref={fit.box(1)} className="w-full overflow-hidden" aria-hidden="true">
                        <motion.span ref={fit.text(1)} variants={RISE_LINE} custom={0.7} className={`${nameClass} text-[var(--display)]`}>
                            {t.hero.lastName}
                        </motion.span>
                    </div>

                    <motion.div variants={FADE_UP} custom={1.0} className="mt-5 md:mt-6">
                        <div className="display-heavy leading-[1] text-[clamp(2.5rem,6vw,6.25rem)] max-md:text-[clamp(2.25rem,11vw,3.5rem)]">
                            <WordCycle words={t.hero.words} play={entered} interval={2800} />
                        </div>
                        <div className="mt-4 meta flex items-center gap-3 min-h-[1.4em]">
                            <span className="h-[2px] w-8 bg-[var(--accent)] shrink-0" aria-hidden="true" />
                            <WordCycle words={t.hero.typewriter} letters={false} play={entered} interval={2800} className="min-w-0" />
                        </div>
                    </motion.div>
                </div>

                <motion.div variants={FADE_UP} custom={1.2} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button type="button" onClick={() => scrollToSection('projects')} className="btn btn-solid justify-between min-w-[11rem]">
                            <RollText>{t.hero.viewWork}</RollText>
                            <span aria-hidden="true">→</span>
                        </button>
                        <button type="button" onClick={() => scrollToSection('contact')} className="btn btn-line">
                            <RollText>{t.hero.getInTouch}</RollText>
                        </button>
                    </div>
                    <span className="hidden md:flex items-center gap-3 meta">
                        {t.hero.scroll}
                        <span className="text-[var(--accent)]" aria-hidden="true">→</span>
                    </span>
                </motion.div>
            </div>
        </Panel>
    )
}
