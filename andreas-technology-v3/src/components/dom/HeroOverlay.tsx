'use client'

import { useContent } from '@/hooks/useContent'
import { useEffect, useState } from 'react'
import { useFitWidth } from '@/hooks/useFitWidth'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { scrollToSection as smoothScrollToSection } from '@/utils/smooth-scroll'
import { EASE_OUT } from '@/utils/motion'
import { useSiteEntered } from '@/hooks/useSiteEntered'
import LocalTime from '@/components/ui/LocalTime'
import Field from '@/components/ui/Field'
import { sectionIndex, type SectionId } from '@/data/sections'

const ROLE_INTERVAL_MS = 2600

/**
 * Role ticker for the cobalt band: one title at a time rolls up from the bottom edge.
 * Lines are bottom-aligned, so a one-line role and a three-line role share a baseline.
 * Screen readers get the whole list once; reduced motion holds the first line.
 */
function RoleTicker({ roles, play }: { roles: string[]; play: boolean }) {
    const [index, setIndex] = useState(0)
    const reduce = useReducedMotion()

    useEffect(() => {
        if (!play || reduce || roles.length < 2) return
        const id = setInterval(() => setIndex((i) => (i + 1) % roles.length), ROLE_INTERVAL_MS)
        return () => clearInterval(id)
    }, [play, reduce, roles.length])

    const current = roles[index % roles.length]

    return (
        <span className="block">
            <span className="sr-only">{roles.join(', ')}</span>
            <span aria-hidden="true" className="relative block h-[3em] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                        key={current}
                        className="absolute inset-x-0 bottom-0 block text-balance"
                        initial={{ y: '110%' }}
                        animate={{ y: '0%' }}
                        exit={{ y: '-110%', opacity: 0 }}
                        transition={{ duration: 0.6, ease: EASE_OUT }}
                    >
                        {current}
                    </motion.span>
                </AnimatePresence>
            </span>
        </span>
    )
}

/** A name line that rises out of its own mask. */
function NameLine({ children, delay, play, last = false }: { children: React.ReactNode; delay: number; play: boolean; last?: boolean }) {
    // The mask is padded so descenders are never clipped; only the last line keeps
    // part of that padding as space, so the "g" clears the rule beneath it.
    return (
        <span className={`block overflow-hidden pb-[0.2em] ${last ? '-mb-[0.04em]' : '-mb-[0.2em]'}`}>
            <motion.span
                data-fit-line
                className="inline-block whitespace-nowrap will-change-transform"
                initial={{ y: '102%' }}
                animate={{ y: play ? '0%' : '102%' }}
                transition={{ duration: 1.1, ease: EASE_OUT, delay }}
            >
                {children}
            </motion.span>
        </span>
    )
}

export default function HeroOverlay() {
    const t = useContent()
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(t.email)}&su=${encodeURIComponent('Project Collaboration // Andreas Technology')}`
    const entered = useSiteEntered()
    const nameRef = useFitWidth<HTMLHeadingElement>(t.editorial.lastName)
    const monogram = `${t.editorial.firstName.charAt(0)}${t.editorial.lastName.charAt(0)}`
    const monogramRef = useFitWidth<HTMLSpanElement>(monogram)

    /** Fade-and-rise for supporting elements, held until the intro has cleared. */
    const rise = (delay: number) => ({
        initial: { opacity: 0, y: 12 },
        animate: entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
        transition: { duration: 0.8, ease: EASE_OUT, delay },
    })

    const scrollToSection = (id: SectionId) => {
        smoothScrollToSection(sectionIndex(id), id)
    }

    const credentials = t.education.filter((e) => e.badge && (e.kind === 'certification' || e.kind === 'license'))

    return (
        <section
            id="hero"
            aria-label={`${t.editorial.firstName} ${t.editorial.lastName}`}
            className="relative w-full min-h-[100svh] md:min-h-0 md:h-full flex flex-col md:flex-row pt-[var(--nav-h)] md:pt-0"
        >
            {/* The cobalt band: monogram on top, the current role at the foot.
                Full-bleed on the right on desktop; a block under the bar on mobile. */}
            <Field
                play={entered}
                from="bottom"
                delay={0.05}
                wrapperClassName="md:order-last md:w-[25vw] md:h-full shrink-0"
                className="h-full flex flex-col px-4 pt-3 pb-4 md:px-6 md:pt-3 md:pb-6"
            >
                <div className="rule-t-strong pt-2.5 flex items-baseline justify-between meta">
                    <span className="tabular">(00)</span>
                    <span>Jamf 200 <span aria-hidden="true">·</span> 550+ Macs</span>
                </div>

                <div className="mt-4 flex md:flex-col md:flex-1 items-end md:items-stretch gap-x-5">
                    {/* Fixed-width box on phones so the fit never measures its own shrink-wrap. */}
                    <span
                        ref={monogramRef}
                        aria-hidden="true"
                        className="block shrink-0 w-[36vw] md:w-full display-heavy text-[calc(34vw*var(--fit,1))] md:text-[calc(min(19vw,32vh)*var(--fit,1))] leading-[0.8] tracking-[-0.035em]"
                    >
                        <span className="block overflow-hidden pb-[0.04em] -ml-[0.03em]">
                            <motion.span
                                data-fit-line
                                className="inline-block whitespace-nowrap"
                                initial={{ y: '105%' }}
                                animate={{ y: entered ? '0%' : '105%' }}
                                transition={{ duration: 1, ease: EASE_OUT, delay: 0.55 }}
                            >
                                {monogram}
                            </motion.span>
                        </span>
                    </span>

                    <div className="hidden md:block md:flex-1" />

                    <motion.div {...rise(0.8)} className="flex-1 md:flex-none min-w-0">
                        <p className="meta mb-2 tabular">({t.editorial.meta.now})</p>
                        <div className="display-heavy text-[1.125rem] md:text-[clamp(1.25rem,1.9vw,1.75rem)] leading-[1] tracking-[-0.03em]">
                            <RoleTicker roles={t.hero.typewriter} play={entered} />
                        </div>
                    </motion.div>
                </div>
            </Field>

            <div className="flex-1 min-w-0 flex flex-col px-4 md:pl-10 md:pr-6 pt-4 md:pt-3 pb-[4.75rem] md:pb-6">
                {/* Meta row: four columns of facts, like a colophon. */}
                <motion.dl
                    {...rise(0.5)}
                    className="rule-t-strong grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-5 pt-2.5 text-sm leading-snug"
                >
                    <div>
                        <dt className="meta mb-1.5">{t.editorial.meta.role}</dt>
                        <dd className="font-medium">{t.title}</dd>
                    </div>
                    <div>
                        <dt className="meta mb-1.5">{t.editorial.meta.basedIn}</dt>
                        <dd className="font-medium">
                            {t.location}
                            <br />
                            <LocalTime className="tabular text-[var(--muted)]" />
                        </dd>
                    </div>
                    <div>
                        <dt className="meta mb-1.5">{t.editorial.meta.credentials}</dt>
                        <dd className="font-medium flex flex-wrap gap-x-1.5">
                            {credentials.map((item, i) => (
                                <span key={item.badge} className="whitespace-nowrap">
                                    {item.link ? (
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`${item.degree} — ${item.institution} (opens credential)`}
                                            className="link-rule"
                                        >
                                            {item.badge}
                                        </a>
                                    ) : (
                                        <span title={`${item.degree} — ${item.institution}`}>{item.badge}</span>
                                    )}
                                    {i < credentials.length - 1 && <span className="text-[var(--muted)]" aria-hidden="true"> ·</span>}
                                </span>
                            ))}
                        </dd>
                    </div>
                    <div className="min-w-0">
                        <dt className="meta mb-1.5">{t.editorial.meta.contact}</dt>
                        <dd className="font-medium flex flex-col items-start min-w-0">
                            <a href={gmailComposeUrl} target="_blank" rel="noopener noreferrer" aria-label="Contact via email" className="link-rule max-w-full break-words">
                                {t.email.split('@')[0]}<wbr />@{t.email.split('@')[1]}
                            </a>
                            <span className="flex gap-3 mt-0.5">
                                <a href={t.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="link-rule">LinkedIn</a>
                                <a href={t.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="link-rule">GitHub</a>
                            </span>
                        </dd>
                    </div>
                </motion.dl>

                <div className="flex-1 min-h-8 md:min-h-6" />

                {/* Statement, set on the right of the text column. */}
                <div className="grid grid-cols-4 md:grid-cols-9 gap-x-4 md:gap-x-6">
                    <motion.div {...rise(0.7)} className="col-span-4 md:col-start-5 md:col-span-5">
                        <p className="text-[1.375rem] md:text-[clamp(1.5rem,2.1vw,2.125rem)] font-medium leading-[1.08] tracking-[-0.025em] text-balance">
                            {t.about.tagline}
                        </p>
                        <div className="mt-5 md:mt-6 flex flex-wrap gap-x-6 gap-y-2 text-base font-medium">
                            {([['projects', t.hero.viewWork], ['contact', t.hero.getInTouch]] as const).map(([id, label]) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => scrollToSection(id)}
                                    className="arrow-link group inline-flex items-center gap-2 border-b border-[var(--foreground)] pb-0.5 hover:text-[var(--accent-ink)] hover:border-[var(--accent-ink)] transition-colors"
                                >
                                    <span>{label}</span>
                                    <span className="arrow" aria-hidden="true">→</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* The name: solid, set tight, bottom-left. */}
                <h1
                    ref={nameRef}
                    className="display mt-8 md:mt-4 text-[calc(16.4vw*var(--fit,1))] md:text-[calc(min(14.2vw,25vh)*var(--fit,1))] leading-[0.86] tracking-[-0.055em] -ml-[0.04em]"
                >
                    <span className="sr-only">{`${t.editorial.firstName} ${t.editorial.lastName}`}</span>
                    <span aria-hidden="true">
                        <NameLine delay={0.1} play={entered}>{t.editorial.firstName}</NameLine>
                        <NameLine delay={0.2} play={entered} last>
                            {t.editorial.lastName}
                            <span className="stop" />
                        </NameLine>
                    </span>
                </h1>

                <motion.div
                    {...rise(0.9)}
                    className="rule-t mt-3 md:mt-4 pt-2 hidden md:grid grid-cols-9 gap-x-6 meta"
                >
                    <span className="col-span-3">Portfolio — 2026</span>
                    <span className="col-span-2">{t.nav.languageLabel}</span>
                    <span className="col-span-4 text-right flex items-center justify-end gap-3 text-[var(--foreground)]">
                        {t.hero.scroll}
                        <span className="relative block w-12 h-px bg-[var(--rule)] overflow-hidden" aria-hidden="true">
                            <motion.span
                                className="absolute inset-0 bg-[var(--accent-ink)] origin-left"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: entered ? 1 : 0 }}
                                transition={{ duration: 1.2, ease: EASE_OUT, delay: 1.4 }}
                            />
                        </span>
                        <span aria-hidden="true">→</span>
                    </span>
                </motion.div>
            </div>
        </section>
    )
}
