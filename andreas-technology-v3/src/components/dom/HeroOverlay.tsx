'use client'

import { useContent } from '@/hooks/useContent'
import { useReducedMotion } from 'motion/react'
import Typewriter from 'typewriter-effect'
import { scrollToSection as smoothScrollToSection } from '@/utils/smooth-scroll'
import { useSiteEntered } from '@/hooks/useSiteEntered'
import LocalTime from '@/components/ui/LocalTime'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import Showcase from '@/components/ui/Showcase'
import { Bento, Figure, Tile, TileHead, TileLink } from '@/components/ui/Bento'
import InfoSpot from '@/components/ui/InfoSpot'
import { sectionIndex, type SectionId } from '@/data/sections'

/** Web screenshots that read well on a laptop display (product renders are left to the Projects grid). */
const SHOWCASE_IMAGES = [
    '/images/PlanoPlus/plano.png',
    '/images/signature-craft/signature-craft.png',
    '/images/portfolio-website/2026.png',
    '/images/schiller-project/schiller.png',
    '/images/NexusPartyApp/nexuspartyapp.png',
    '/images/research-llms-human-knowledge/llm-research.png',
    '/images/thesis-presentation/thesis-image.png',
]

const ICON_BUTTON = 'w-10 h-10 rounded-full flex items-center justify-center bg-[var(--fill)] text-[var(--foreground)] transition-colors duration-300 hover:bg-[var(--accent-fill)] hover:text-white'

/**
 * Hero, on a three-module grid (4 + 4 + 4 columns):
 *   row 1–4  name and actions (8 columns) · selected work (4 columns)
 *   row 5–6  three key figures, one per module: fleet, onboarding, Jamf 200
 */
export default function HeroOverlay() {
    const t = useContent()
    const entered = useSiteEntered()
    const reduceMotion = useReducedMotion()
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(t.email)}&su=${encodeURIComponent('Project Collaboration // Andreas Technology')}`
    const jamf = t.education.find((e) => e.featured && e.link)
    const showcase = SHOWCASE_IMAGES
        .map((src) => t.projects.find((p) => p.image === src))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))

    const scrollToSection = (id: SectionId) => {
        smoothScrollToSection(sectionIndex(id), id)
    }

    return (
        <section aria-label={t.nav.home} className="w-full h-auto md:h-full px-4 md:px-6 pt-3 md:pb-6">
            <Bento play={entered} className="max-w-[112rem] mx-auto">
                {/* Name: title → who → what to do next. */}
                <Tile id="hero" index={0} className="col-span-2 md:col-[1/9] md:row-[1/5] justify-between gap-6 min-h-[22rem] md:min-h-0">
                    <TileHead label={<span className="flex items-center gap-2.5"><span className="live-dot" aria-hidden="true" />{t.title}</span>}>
                        <p className="hidden md:flex t-label items-baseline gap-2 shrink-0">
                            <span className="el-caps">{t.bento.city}</span>
                            <LocalTime className="tabular-nums text-[var(--foreground)] [&_span]:hidden" />
                        </p>
                    </TileHead>

                    <div>
                        <h1 className="display uppercase text-[10vw] md:text-[min(6vw,10.5vh)] leading-[0.9]">
                            <span className="sr-only">{`${t.hero.firstName} ${t.hero.lastName}`}</span>
                            <span aria-hidden="true" className="block">{t.hero.firstName}</span>
                            <span aria-hidden="true" className="block text-[var(--muted)]">{t.hero.lastName}</span>
                        </h1>

                        {/* The roles, typed out one after another. */}
                        <div className="mt-4 md:mt-[min(1.6vw,2.4vh)] flex items-baseline gap-2.5 min-w-0 font-mono text-[0.8125rem] md:text-[min(1.05vw,1.85vh)]">
                            <span className="text-[var(--muted)] shrink-0" aria-hidden="true">$ whoami</span>
                            <div role="status" aria-live="polite" className="terminal-text font-semibold min-w-0 min-h-[1.3em]">
                                <span className="sr-only">{t.hero.typewriter.join(' | ')}</span>
                                <span aria-hidden="true">
                                    {reduceMotion ? (
                                        t.hero.typewriter[0]
                                    ) : entered && (
                                        <Typewriter
                                            options={{
                                                strings: t.hero.typewriter,
                                                autoStart: true,
                                                loop: true,
                                                delay: 45,
                                                deleteSpeed: 25,
                                            }}
                                        />
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Actions: one accent call to action, one secondary, three quiet profile links. */}
                        <div className="mt-6 md:mt-[min(2.2vw,3.4vh)] pt-5 md:pt-[min(1.6vw,2.6vh)] border-t border-[var(--line)] flex flex-wrap items-center gap-2.5">
                            <button type="button" onClick={() => scrollToSection('projects')} className="pill pill--accent !min-h-10">
                                <span className="el-caps">{t.hero.viewWork}</span>
                                <i className="fas fa-arrow-right text-xs" aria-hidden="true" />
                            </button>
                            <button type="button" onClick={() => scrollToSection('contact')} className="pill pill--line !min-h-10">
                                <span className="el-caps">{t.hero.getInTouch}</span>
                            </button>
                            <span className="flex items-center gap-2 max-sm:w-full sm:ml-1">
                                <a href={t.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className={ICON_BUTTON}>
                                    <i className="fab fa-linkedin-in text-sm" aria-hidden="true" />
                                </a>
                                <a href={t.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className={ICON_BUTTON}>
                                    <i className="fab fa-github text-sm" aria-hidden="true" />
                                </a>
                                <a href={gmailComposeUrl} target="_blank" rel="noopener noreferrer" aria-label="Contact via email" className={ICON_BUTTON}>
                                    <i className="fas fa-envelope text-sm" aria-hidden="true" />
                                </a>
                            </span>
                            <p className="hidden md:flex items-center gap-2 t-label ml-auto">
                                {t.hero.scroll}
                                <i className="fas fa-arrow-right text-[var(--accent)]" aria-hidden="true" />
                            </p>
                        </div>
                    </div>
                </Tile>

                {/* Selected work: project screenshots cross-fading on a laptop. Opens Projects. */}
                <Tile index={1} tone="studio" interactive className="col-span-2 md:col-[9/13] md:row-[1/5] gap-3 min-h-[21rem] md:min-h-0">
                    <button type="button" className="tile-stretch" onClick={() => scrollToSection('projects')} aria-label={t.hero.viewWork} />
                    <TileHead label={t.bento.selectedWork}>
                        <span className="tile-affordance" aria-hidden="true">
                            <i className="fas fa-arrow-right" />
                        </span>
                    </TileHead>
                    <Showcase projects={showcase} play={entered} />
                </Tile>

                {/* Three key figures, one tile each, same anatomy: label → figure → caption. */}
                <Tile index={2} className="col-span-1 md:col-[1/5] md:row-[5/7] gap-3 min-h-[10rem] md:min-h-0">
                    <TileHead label={t.bento.tile.fleet}>
                        <InfoSpot label={t.bento.spot.rings} title={t.bento.fleetTitle}>
                            <dl className="grid grid-cols-[auto_1fr] items-baseline gap-x-3 gap-y-1.5">
                                <dt className="font-bold tabular-nums text-[var(--accent)]">550+</dt>
                                <dd className="muted el-caps">{t.about.statsLabels[1]}</dd>
                                <dt className="font-bold tabular-nums text-[var(--accent)]">95%+</dt>
                                <dd className="muted">{t.bento.slaLabel}</dd>
                                <dt className="font-bold tabular-nums text-[var(--accent)]">70%</dt>
                                <dd className="muted el-caps">{t.about.statsLabels[2]}</dd>
                            </dl>
                        </InfoSpot>
                    </TileHead>
                    <Figure value={<AnimatedCounter value={550} suffix="+" play={entered} />} caption={<span className="el-caps">{t.about.statsLabels[1]}</span>} />
                </Tile>

                <Tile index={3} className="col-span-1 md:col-[5/9] md:row-[5/7] gap-3 min-h-[10rem] md:min-h-0">
                    <TileHead label={t.bento.tile.automation} />
                    <Figure value={<AnimatedCounter value={70} suffix="%" play={entered} />} caption={<span className="el-caps">{t.about.statsLabels[2]}</span>} />
                </Tile>

                {/* Jamf 200, verifiable on Credly. */}
                {jamf?.link && (
                    <TileLink
                        index={4}
                        href={jamf.link}
                        label={`${jamf.degree} — ${jamf.institution} (opens credential)`}
                        className="col-span-2 md:col-[9/13] md:row-[5/7] gap-3 min-h-[10rem] md:min-h-0"
                    >
                        <TileHead label={t.bento.tile.certified}>
                            <span className="tile-affordance" aria-hidden="true">
                                <i className="fas fa-arrow-right -rotate-45" />
                            </span>
                        </TileHead>
                        <Figure
                            value={jamf.badge}
                            caption={<span className="line-clamp-2">{jamf.degree}</span>}
                        />
                    </TileLink>
                )}
            </Bento>
        </section>
    )
}
