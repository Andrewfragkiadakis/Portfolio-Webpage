'use client'

import { useContent } from '@/hooks/useContent'
import { useReducedMotion } from 'motion/react'
import Typewriter from 'typewriter-effect'
import { scrollToSection as smoothScrollToSection } from '@/utils/smooth-scroll'
import { useSiteEntered } from '@/hooks/useSiteEntered'
import LocalTime from '@/components/ui/LocalTime'
import AnalogClock from '@/components/ui/AnalogClock'
import FleetRings from '@/components/ui/FleetRings'
import Showcase from '@/components/ui/Showcase'
import { Bento, GlowRing, Tile, TileButton, TileLink } from '@/components/ui/Bento'
import InfoSpot from '@/components/ui/InfoSpot'
import { sectionIndex, type SectionId } from '@/data/sections'

const SOCIAL_ROW = 'group flex items-center gap-2.5 rounded-xl px-2 py-1.5 short:py-1 -mx-2 transition-colors duration-300 hover:bg-[var(--fill)]'

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

/** Activity-ring colours: emerald for SLA, orange → pink for onboarding (their tile families). */
const SLA_RING = { value: 0.95, from: '#2bd66f', to: '#b7f54a' }
const ONBOARDING_RING = { value: 0.7, from: '#ff375f', to: '#ff9f0a' }

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
                {/* Name — the featured tile: a drifting aurora and a light travelling round its edge. */}
                <Tile
                    id="hero"
                    index={0}
                    tone="aurora"
                    className="col-span-2 md:col-[1/8] md:row-[1/5] justify-between gap-6 min-h-[24rem] md:min-h-0"
                >
                    <span className="aurora" aria-hidden="true">
                        <span /><span /><span /><span />
                    </span>
                    <GlowRing />

                    <div className="flex items-center gap-2.5 text-sm font-semibold">
                        <span className="live-dot" aria-hidden="true" />
                        <span>{t.title}</span>
                    </div>

                    <div>
                        <h1 className="display uppercase text-[10vw] md:text-[min(6.3vw,11vh)] leading-[0.88]">
                            <span className="sr-only">{`${t.hero.firstName} ${t.hero.lastName}`}</span>
                            <span aria-hidden="true" className="block">{t.hero.firstName}</span>
                            <span aria-hidden="true" className="block bg-[linear-gradient(90deg,#0850c0_0%,#4a2cb4_45%,#a01f45_100%)] dark:bg-[linear-gradient(90deg,#6cb8ff_0%,#b4a6ff_50%,#ff8fb1_100%)] bg-clip-text text-transparent pb-[0.04em]">{t.hero.lastName}</span>
                        </h1>

                        {/* The roles, typed out one after another. The tagline that used to follow
                            opens the About story word for word, so it lives there only. */}
                        <div className="mt-4 md:mt-[min(2vw,2.6vh)] flex items-baseline justify-between gap-4">
                            <div className="flex items-baseline gap-2.5 min-w-0 font-mono text-[0.8125rem] md:text-[min(1.05vw,1.85vh)]">
                                <span className="text-[#1f9d55] dark:text-[#30d158] shrink-0" aria-hidden="true">➜ whoami</span>
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
                            <p className="hidden md:flex items-center gap-2 eyebrow shrink-0">
                                {t.hero.scroll}
                                <i className="fas fa-arrow-right text-[var(--accent)]" aria-hidden="true" />
                            </p>
                        </div>
                    </div>
                </Tile>

                {/* Showcase — project screenshots cross-fading on a laptop. Opens Projects. */}
                <Tile index={1} tone="studio" interactive className="col-span-2 md:col-[8/13] md:row-[1/4] min-h-[19rem] md:min-h-0">
                    <button type="button" className="tile-stretch" onClick={() => scrollToSection('projects')} aria-label={t.hero.viewWork} />
                    <span className="tile-affordance absolute top-[var(--tile-pad)] right-[var(--tile-pad)] z-[2]" aria-hidden="true">
                        <i className="fas fa-arrow-right" />
                    </span>
                    <Showcase projects={showcase} label={t.bento.selectedWork} play={entered} />
                </Tile>

                {/* Fleet at a glance — activity rings, only for figures that are real percentages. */}
                <Tile index={2} tone="night" className="col-span-2 md:col-[8/11] md:row-[4/7] gap-3 short:gap-2 min-h-[13rem] md:min-h-0 max-md:flex-row max-md:items-start">
                    <div className="max-md:order-2 max-md:flex-1 flex items-start justify-between gap-2">
                        <p className="eyebrow el-caps">{t.bento.fleetTitle}</p>
                        <InfoSpot label={t.bento.spot.rings} title={t.bento.fleetTitle} tone="onColor">
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2.5">
                                    <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-[linear-gradient(135deg,#2bd66f,#b7f54a)]" aria-hidden="true" />
                                    <span><span className="font-bold tabular-nums">95%+</span> <span className="muted">{t.bento.slaLabel}</span></span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-[linear-gradient(135deg,#ff375f,#ff9f0a)]" aria-hidden="true" />
                                    <span><span className="font-bold tabular-nums">70%</span> <span className="muted">{t.about.statsLabels[2]}</span></span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <span className="w-2.5 h-2.5 rounded-full shrink-0 border-2 border-current opacity-60" aria-hidden="true" />
                                    <span><span className="font-bold tabular-nums">550+</span> <span className="muted">{t.about.statsLabels[1]}</span></span>
                                </li>
                            </ul>
                        </InfoSpot>
                    </div>
                    <div className="max-md:order-1 max-md:w-[42%] md:order-2 md:flex-1 min-h-0 flex items-center justify-center md:[container-type:size]">
                        <FleetRings
                            rings={[SLA_RING, ONBOARDING_RING]}
                            count={550}
                            unit={t.bento.macs}
                            play={entered}
                            className="w-full md:w-[min(100cqw,100cqh)]"
                        />
                    </div>
                </Tile>

                {/* Jamf 200 — verifiable on Credly. */}
                {jamf?.link && (
                    <TileLink
                        index={3}
                        tone="fleet"
                        href={jamf.link}
                        label={`${jamf.degree} — ${jamf.institution} (opens credential)`}
                        className="col-span-1 md:col-[11/13] md:row-[4/7] justify-between gap-3 min-h-[12rem] md:min-h-0"
                    >
                        <span className="flex items-start justify-between gap-2">
                            <span
                                className="block h-5 md:h-[min(1.9vw,3.2vh)] aspect-[2.875] bg-white [mask:url(/logos/jamf.svg)_no-repeat_left/contain] [-webkit-mask:url(/logos/jamf.svg)_no-repeat_left/contain]"
                                aria-hidden="true"
                            />
                            <span className="tile-affordance" aria-hidden="true">
                                <i className="fas fa-arrow-right -rotate-45" />
                            </span>
                        </span>
                        <span className="block">
                            <span className="block eyebrow el-caps mb-1.5">{t.cursor.verify}</span>
                            <span className="block display text-[1.5rem] min-[400px]:text-[1.75rem] md:text-[min(2.3vw,4vh)] whitespace-nowrap">{jamf.badge}</span>
                            <span className="block mt-2 text-caption font-medium text-[var(--muted)] leading-snug line-clamp-3">{jamf.degree}</span>
                        </span>
                    </TileLink>
                )}

                {/* Athens, live: an analog face and the digital time. */}
                <Tile index={4} className="clock col-span-1 md:col-[1/4] md:row-[5/7] gap-3 min-h-[12rem] md:min-h-0 md:flex-row md:items-center">
                    <AnalogClock className="w-[5.5rem] md:w-auto md:h-full md:max-h-[min(11vw,19vh)] aspect-square shrink-0" />
                    <div className="min-w-0 flex flex-col justify-center gap-1">
                        <p className="eyebrow el-caps">{t.bento.city}</p>
                        <LocalTime className="numeral block text-[2rem] md:text-[min(2.6vw,4.6vh)] [&_span]:hidden" />
                    </div>
                </Tile>

                {/* Socials, each with its own colour. */}
                <Tile index={5} className="col-span-2 md:col-[4/6] md:row-[5/7] justify-between gap-3 short:gap-2">
                    <p className="eyebrow el-caps">{t.contact.socialTitle}</p>
                    <ul className="flex flex-col gap-1 short:gap-0.5">
                        {[
                            { href: t.linkedin, label: 'LinkedIn', aria: 'LinkedIn profile', icon: 'fab fa-linkedin-in', well: 'bg-[#0a66c2] text-white' },
                            { href: t.github, label: 'GitHub', aria: 'GitHub profile', icon: 'fab fa-github', well: 'bg-[#1d1d1f] text-white dark:bg-[#f5f5f7] dark:text-[#1d1d1f]' },
                            { href: gmailComposeUrl, label: 'Email', aria: 'Contact via email', icon: 'fas fa-envelope', well: 'bg-[linear-gradient(135deg,#0a7cf0,#0061c9)] text-white' },
                        ].map((link) => (
                            <li key={link.label}>
                                <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.aria} className={SOCIAL_ROW}>
                                    <span className={`w-8 h-8 short:w-7 short:h-7 rounded-[0.625rem] flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] ${link.well}`} aria-hidden="true">
                                        <i className={`${link.icon} text-sm`} />
                                    </span>
                                    <span className="flex-1 text-sm md:text-[min(1vw,1.75vh)] font-semibold">{link.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </Tile>

                {/* Calls to action */}
                <TileButton index={6} tone="accent" onClick={() => scrollToSection('projects')} className="col-span-1 md:col-[6/8] md:row-[5/6] justify-end gap-3 min-h-[8.5rem] md:min-h-0">
                    <span className="block text-[0.9375rem] lang-el:text-sm md:text-[min(1.25vw,2.2vh)] md:lang-el:text-[min(1.08vw,1.9vh)] font-semibold leading-tight el-caps">{t.hero.viewWork}</span>
                    <span className="tile-affordance absolute top-[var(--tile-pad)] right-[var(--tile-pad)] short:!w-7 short:!h-7" aria-hidden="true">
                        <i className="fas fa-arrow-right" />
                    </span>
                </TileButton>
                <TileButton index={7} tone="graphite" onClick={() => scrollToSection('contact')} className="col-span-1 md:col-[6/8] md:row-[6/7] justify-end gap-3 min-h-[8.5rem] md:min-h-0">
                    <span className="block text-[0.9375rem] lang-el:text-sm md:text-[min(1.25vw,2.2vh)] md:lang-el:text-[min(1.08vw,1.9vh)] font-semibold leading-tight el-caps">{t.hero.getInTouch}</span>
                    <span className="tile-affordance absolute top-[var(--tile-pad)] right-[var(--tile-pad)] short:!w-7 short:!h-7" aria-hidden="true">
                        <i className="fas fa-arrow-right" />
                    </span>
                </TileButton>
            </Bento>
        </section>
    )
}
