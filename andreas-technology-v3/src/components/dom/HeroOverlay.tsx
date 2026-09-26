'use client'

import { useContent } from '@/hooks/useContent'
import { useReducedMotion } from 'motion/react'
import Typewriter from 'typewriter-effect'
import { scrollToSection as smoothScrollToSection } from '@/utils/smooth-scroll'
import { useSiteEntered } from '@/hooks/useSiteEntered'
import LocalTime from '@/components/ui/LocalTime'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import { Bento, Tile, TileButton, TileLink } from '@/components/ui/Bento'
import { sectionIndex, type SectionId } from '@/data/sections'

const SOCIAL_BTN = 'w-11 h-11 rounded-full bg-[var(--fill)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--accent-fill)] hover:text-white transition-colors duration-300'

export default function HeroOverlay() {
    const t = useContent()
    const entered = useSiteEntered()
    const reduceMotion = useReducedMotion()
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(t.email)}&su=${encodeURIComponent('Project Collaboration // Andreas Technology')}`
    const jamf = t.education.find((e) => e.featured && e.link)

    const scrollToSection = (id: SectionId) => {
        smoothScrollToSection(sectionIndex(id), id)
    }

    return (
        <section aria-label={t.nav.home} className="w-full h-auto md:h-full px-4 md:px-6 pt-3 md:pb-6">
            <Bento play={entered} className="max-w-[112rem] mx-auto">
                {/* Name — the flagship tile, in the README infographic's pastel gradient. */}
                <Tile
                    id="hero"
                    index={0}
                    className="col-span-2 md:col-[1/8] md:row-[1/5] justify-between gap-8 min-h-[22rem] md:min-h-0 bg-[linear-gradient(135deg,#d6e8ff_0%,#e6dcff_52%,#ffdcec_100%)] dark:bg-[linear-gradient(135deg,#0c2340_0%,#221c3a_55%,#3a1a2c_100%)] border-transparent"
                >
                    <div className="flex items-center gap-2.5 text-sm font-semibold">
                        <span className="live-dot" aria-hidden="true" />
                        <span>{t.title}</span>
                    </div>

                    <div>
                        <h1 className="display uppercase text-[10vw] md:text-[min(6.3vw,11vh)] leading-[0.88]">
                            <span className="sr-only">{`${t.hero.firstName} ${t.hero.lastName}`}</span>
                            <span aria-hidden="true" className="block">{t.hero.firstName}</span>
                            <span aria-hidden="true" className="block">{t.hero.lastName}</span>
                        </h1>
                        <div className="mt-5 md:mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <p className="text-[0.95rem] md:text-[min(1.2vw,2.1vh)] leading-snug text-[var(--muted)] max-w-[30rem] font-medium">
                                {t.about.tagline}
                            </p>
                            <p className="hidden md:flex items-center gap-2 eyebrow shrink-0">
                                {t.hero.scroll}
                                <i className="fas fa-arrow-right text-[var(--accent)]" aria-hidden="true" />
                            </p>
                        </div>
                    </div>
                </Tile>

                {/* Role — a terminal typing out each title. */}
                <Tile index={1} tone="terminal" className="col-span-2 md:col-[8/13] md:row-[1/3] min-h-[11rem] md:min-h-0 gap-4">
                    <div className="flex items-center gap-3" aria-hidden="true">
                        <span className="flex gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                        </span>
                        <span className="font-mono text-caption text-[var(--muted)]">~ zsh</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-end font-mono">
                        <p className="text-caption text-[var(--muted)] mb-2" aria-hidden="true">
                            <span className="text-[#28c840]">➜</span> whoami
                        </p>
                        <div role="status" aria-live="polite" className="terminal-text text-[1.05rem] md:text-[min(1.65vw,3vh)] font-semibold leading-tight min-h-[2.5em] md:min-h-[2.6em]">
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
                </Tile>

                {/* 550+ Macs */}
                <Tile index={2} tone="sky" className="col-span-1 md:col-[8/11] md:row-[3/5] justify-between min-h-[11rem] md:min-h-0">
                    <span className="tile-icon tile-mark" aria-hidden="true">
                        <i className="fab fa-apple text-lg" />
                    </span>
                    <div>
                        <div className="numeral tile-mark text-[clamp(2.75rem,13vw,4rem)] md:text-[min(5.4vw,9.5vh)]">
                            <AnimatedCounter value={550} suffix="+" play={entered} />
                        </div>
                        <p className="mt-2 text-sm font-semibold el-caps">{t.about.statsLabels[1]}</p>
                    </div>
                </Tile>

                {/* Jamf 200 — verifiable on Credly. */}
                {jamf?.link && (
                    <TileLink
                        index={3}
                        tone="lavender"
                        href={jamf.link}
                        label={`${jamf.degree} — ${jamf.institution} (opens credential)`}
                        className="col-span-1 md:col-[11/13] md:row-[3/5] justify-between min-h-[11rem] md:min-h-0"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <span className="tile-icon tile-mark" aria-hidden="true">
                                <i className="fas fa-award text-lg" />
                            </span>
                            <span className="tile-affordance" aria-hidden="true">
                                <i className="fas fa-arrow-right -rotate-45" />
                            </span>
                        </div>
                        <div>
                            <p className="display tile-mark text-[1.375rem] min-[400px]:text-[1.75rem] md:text-[min(2.2vw,4vh)] whitespace-nowrap">{jamf.badge}</p>
                            <p className="mt-2 text-caption font-medium text-[var(--muted)] leading-snug line-clamp-2">{jamf.degree}</p>
                        </div>
                    </TileLink>
                )}

                {/* 70% faster onboarding */}
                <Tile index={4} tone="mint" className="col-span-1 md:col-[1/4] md:row-[5/7] justify-between min-h-[11rem] md:min-h-0">
                    <span className="tile-icon tile-mark" aria-hidden="true">
                        <i className="fas fa-gauge-high text-lg" />
                    </span>
                    <div>
                        <div className="numeral tile-mark text-[clamp(2.75rem,13vw,4rem)] md:text-[min(5.4vw,9.5vh)]">
                            <AnimatedCounter value={70} suffix="%" play={entered} />
                        </div>
                        <p className="mt-2 text-sm font-semibold el-caps">{t.about.statsLabels[2]}</p>
                    </div>
                </Tile>

                {/* Where and when */}
                <Tile index={5} className="col-span-1 md:col-[4/7] md:row-[5/7] justify-between min-h-[11rem] md:min-h-0">
                    <p className="eyebrow el-caps">{t.contact.localTimeLabel}</p>
                    <div>
                        <LocalTime className="numeral block text-[clamp(2.25rem,10vw,3.25rem)] md:text-[min(4.2vw,7.5vh)] [&_span]:text-[0.32em] [&_span]:tracking-normal [&_span]:font-semibold" />
                        <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                            <i className="fas fa-location-dot text-[var(--accent)]" aria-hidden="true" />
                            {t.location}
                        </p>
                    </div>
                </Tile>

                {/* Socials */}
                <Tile index={6} className="col-span-2 md:col-[7/9] md:row-[5/7] justify-between gap-4">
                    <p className="eyebrow el-caps">{t.contact.socialTitle}</p>
                    <div className="flex gap-2">
                        <a href={t.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className={SOCIAL_BTN}>
                            <i className="fab fa-linkedin-in text-lg" aria-hidden="true" />
                        </a>
                        <a href={t.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className={SOCIAL_BTN}>
                            <i className="fab fa-github text-lg" aria-hidden="true" />
                        </a>
                        <a href={gmailComposeUrl} target="_blank" rel="noopener noreferrer" aria-label="Contact via email" className={SOCIAL_BTN}>
                            <i className="fas fa-envelope text-lg" aria-hidden="true" />
                        </a>
                    </div>
                </Tile>

                {/* Calls to action */}
                <TileButton index={7} tone="accent" onClick={() => scrollToSection('projects')} className="col-span-1 md:col-[9/11] md:row-[5/7] justify-between min-h-[8.5rem] md:min-h-0">
                    <span className="tile-affordance self-end" aria-hidden="true">
                        <i className="fas fa-arrow-right" />
                    </span>
                    <span className="text-lg md:text-[min(1.45vw,2.6vh)] font-semibold leading-tight el-caps">{t.hero.viewWork}</span>
                </TileButton>
                <TileButton index={8} tone="ink" onClick={() => scrollToSection('contact')} className="col-span-1 md:col-[11/13] md:row-[5/7] justify-between min-h-[8.5rem] md:min-h-0">
                    <span className="tile-affordance self-end" aria-hidden="true">
                        <i className="fas fa-arrow-right" />
                    </span>
                    <span className="text-lg md:text-[min(1.45vw,2.6vh)] font-semibold leading-tight el-caps">{t.hero.getInTouch}</span>
                </TileButton>
            </Bento>
        </section>
    )
}
