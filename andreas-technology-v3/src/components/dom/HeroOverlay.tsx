'use client'

import { useContent } from '@/hooks/useContent'
import { motion, useReducedMotion } from 'motion/react'
import Typewriter from 'typewriter-effect'
import { scrollToSection } from '@/utils/smooth-scroll'
import { gmailComposeUrl } from '@/utils/links'
import { EASE_OUT } from '@/utils/motion'
import { useSiteEntered } from '@/hooks/useSiteEntered'
import LocalTime from '@/components/ui/LocalTime'
import Window, { AppTile } from '@/components/ui/Window'
import CredentialChips from '@/components/ui/CredentialChips'
import { sectionIndex, type SectionId } from '@/data/sections'
import { SECTION_APPS, LINK_APPS, type AppTile as AppTileData } from '@/data/apps'
import { RESUME_URL } from '@/data/content'

/** A file-style icon on the desktop: tile plus a label pill that reads on any wallpaper. */
function DesktopIcon({ app, label, href, ariaLabel, download = false }: { app: AppTileData; label: string; href: string; ariaLabel: string; download?: boolean }) {
    const external = !download
    return (
        <a
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : { download: true })}
            aria-label={ariaLabel}
            className="group flex flex-col items-center gap-1.5 w-full md:w-[6.5rem] p-1.5 rounded-xl transition-colors hover:bg-[var(--control)] focus-visible:bg-[var(--control)]"
        >
            <AppTile app={app} size="xl" className="transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5" />
            <span className="os-icon-label text-center [overflow-wrap:anywhere]">{label}</span>
        </a>
    )
}

export default function HeroOverlay() {
    const t = useContent()
    const entered = useSiteEntered()
    const reduceMotion = useReducedMotion()

    const [first, ...rest] = t.os.displayName.split(' ')
    const credentials = t.education.filter((e) => e.badge && e.kind && e.kind !== 'degree')
    const credly = t.education.find((e) => e.featured && e.link)?.link ?? t.linkedin
    const certCount = t.education.filter((e) => e.kind === 'certification').length

    const go = (id: SectionId) => scrollToSection(sectionIndex(id), id)

    /** Stickers and the widget drop in after the windows. */
    const pop = (delay: number, rotate: number) =>
        reduceMotion
            ? { initial: false as const, style: { rotate } }
            : {
                initial: { opacity: 0, scale: 0.6, rotate: rotate - 12 },
                animate: entered ? { opacity: 1, scale: 1, rotate } : { opacity: 0, scale: 0.6, rotate: rotate - 12 },
                transition: { type: 'spring' as const, stiffness: 260, damping: 18, delay },
            }

    const desktopIcons = (
        <>
            <DesktopIcon app={LINK_APPS.resume} label={t.os.desktop.resume} href={RESUME_URL} ariaLabel={t.os.aria.resume} download />
            <DesktopIcon app={LINK_APPS.credential} label={t.os.desktop.credential} href={credly} ariaLabel={`${t.os.aria.credential} (${t.os.aria.newTab})`} />
            <DesktopIcon app={LINK_APPS.github} label={t.os.desktop.github} href={t.github} ariaLabel={`GitHub profile (${t.os.aria.newTab})`} />
            <DesktopIcon app={LINK_APPS.linkedin} label={t.os.desktop.linkedin} href={t.linkedin} ariaLabel={`LinkedIn profile (${t.os.aria.newTab})`} />
        </>
    )

    return (
        <div className="relative w-full md:h-full md:max-w-[88rem] flex flex-col gap-4 md:grid md:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)_auto] md:items-center md:gap-8 lg:gap-10">
            {/* ── Welcome window ─────────────────────────────────────── */}
            <Window
                as="section"
                id="hero"
                labelledBy="hero-title"
                title={t.os.windows.welcome}
                app={SECTION_APPS.hero}
                play={entered}
                className="w-full md:max-w-[44rem] md:justify-self-end"
                footer={
                    <div className="flex items-center justify-between gap-3 px-4 min-h-8 py-1.5 text-caption text-[var(--muted)]">
                        <span className="inline-flex items-center gap-1.5 min-w-0">
                            <i className="fas fa-location-dot" aria-hidden="true" />
                            <span className="truncate">{t.location}</span>
                            <span aria-hidden="true">·</span>
                            <LocalTime className="tabular-nums" />
                        </span>
                        <span className="hidden md:inline-flex items-center gap-2 font-semibold uppercase tracking-[0.08em]">
                            {t.hero.scroll}
                            <i className="fas fa-arrow-right" aria-hidden="true" />
                        </span>
                    </div>
                }
            >
                <div className="p-5 sm:p-8 lg:p-10">
                    <div className="flex flex-wrap items-center gap-3 mb-5 md:mb-7">
                        <span className="app-tile w-12 h-12 md:w-14 md:h-14 text-lg md:text-xl font-black tracking-tight" style={{ background: SECTION_APPS.hero.tile }} aria-hidden="true">
                            AF
                        </span>
                        <span className="os-chip">
                            <span className="relative flex w-2 h-2" aria-hidden="true">
                                <span className="absolute inset-0 rounded-full bg-[var(--success)] motion-safe:animate-ping opacity-60" />
                                <span className="relative w-2 h-2 rounded-full bg-[var(--success)]" />
                            </span>
                            <span className="caps-gr">{t.contact.opportunitiesTitle}</span>
                        </span>
                    </div>

                    <p className="text-base md:text-lg font-medium text-[var(--muted)]">{t.os.greeting}</p>
                    <h1 id="hero-title" className="mt-1 text-[clamp(2.4rem,11vw,3rem)] md:text-[clamp(3rem,4.6vw,4.5rem)] font-bold tracking-[-0.035em] leading-[1.02] text-[var(--foreground)]">
                        <span className="block">{first}</span>
                        <span className="block">{rest.join(' ')}</span>
                    </h1>
                    <p className="mt-4 text-lg md:text-xl font-semibold tracking-tight">{t.title}</p>
                    <p className="mt-1 text-sm md:text-base text-[var(--muted)] max-w-[34rem]">{t.about.tagline}</p>

                    <CredentialChips items={credentials} newTabLabel={t.os.aria.newTab} className="mt-5" />

                    <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-2.5">
                        <button type="button" onClick={() => go('projects')} className="os-btn os-btn--primary h-10 px-5">
                            <span className="caps-gr">{t.hero.viewWork}</span>
                            <i className="fas fa-arrow-right text-xs" aria-hidden="true" />
                        </button>
                        <button type="button" onClick={() => go('contact')} className="os-btn os-btn--secondary h-10 px-5">
                            <span className="caps-gr">{t.hero.getInTouch}</span>
                        </button>
                        <span className="flex items-center gap-1.5 sm:ml-auto">
                            <a href={t.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="os-icon-btn w-10 h-10">
                                <i className="fab fa-linkedin-in" aria-hidden="true" />
                            </a>
                            <a href={t.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="os-icon-btn w-10 h-10">
                                <i className="fab fa-github" aria-hidden="true" />
                            </a>
                            <a href={gmailComposeUrl(t.email)} target="_blank" rel="noopener noreferrer" aria-label="Contact via email" className="os-icon-btn w-10 h-10">
                                <i className="fas fa-envelope" aria-hidden="true" />
                            </a>
                        </span>
                    </div>
                </div>
            </Window>

            {/* Mobile: desktop icons as a home-screen row. */}
            <div className="md:hidden grid grid-cols-4 gap-1 px-1">{desktopIcons}</div>

            {/* ── Terminal, "Now" widget and stickers ────────────────── */}
            <div className="relative flex flex-col gap-4 md:gap-5 md:self-center">
                <Window
                    title={t.os.windows.terminal}
                    variant="terminal"
                    play={entered}
                    delay={0.15}
                    className="w-full md:max-w-[32rem] md:rotate-[1.2deg]"
                >
                    <div className="px-4 py-3.5 md:px-5 md:py-4 font-mono text-[0.75rem] md:text-[0.8125rem] leading-[1.7]">
                        <p>
                            <span className="text-[#7EE787]">andreas@af</span> <span className="text-[#79C0FF]">~</span> % whoami
                        </p>
                        <div className="text-[#FFD37A] min-h-[1.7em]" role="status" aria-live="polite">
                            <span className="sr-only">{t.hero.typewriter.join(' | ')}</span>
                            <span aria-hidden="true">
                                {entered && (
                                    <Typewriter
                                        options={{ strings: t.hero.typewriter, autoStart: true, loop: true, delay: 45, deleteSpeed: 25, cursor: '▍' }}
                                    />
                                )}
                            </span>
                        </div>
                        <p className="mt-1.5">
                            <span className="text-[#7EE787]">andreas@af</span> <span className="text-[#79C0FF]">~</span> % fleet --summary
                        </p>
                        <dl className="grid grid-cols-[7.5rem_1fr] text-[#C9C9D1]">
                            <dt className="text-[#8B8B96]">endpoints</dt><dd>550+ macOS</dd>
                            <dt className="text-[#8B8B96]">enrollment</dt><dd>zero-touch · ABM</dd>
                            <dt className="text-[#8B8B96]">onboarding</dt><dd><span className="text-[#7EE787]">−70%</span> time</dd>
                        </dl>
                        <p className="mt-1.5">
                            <span className="text-[#7EE787]">andreas@af</span> <span className="text-[#79C0FF]">~</span> % cat credentials.txt
                        </p>
                        <p className="text-[#C9C9D1]">{credentials.map((c) => c.badge).join(' · ')}</p>
                        <p className="mt-1.5">
                            <span className="text-[#7EE787]">andreas@af</span> <span className="text-[#79C0FF]">~</span> %{' '}
                            <span className="inline-block w-[0.55em] h-[1.1em] align-[-0.2em] bg-[#E6E6EA] motion-safe:animate-pulse" aria-hidden="true" />
                        </p>
                    </div>
                </Window>

                {/* "Now" widget: current focus plus three numbers. */}
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                    animate={entered ? { opacity: 1, y: 0 } : undefined}
                    transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.3 }}
                    className="os-glass os-window w-full md:max-w-[26rem] md:ml-6 md:-rotate-[1.5deg] rounded-[1.25rem] p-4 md:p-5"
                >
                    <div className="flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                        <AppTile app={SECTION_APPS.about} size="xs" />
                        {t.os.windows.widget}
                    </div>
                    <p className="mt-2.5 text-caption font-semibold text-[var(--accent)] caps-gr">{t.about.currentFocus}</p>
                    <p className="text-base md:text-lg font-bold tracking-tight leading-snug">{t.about.currentFocusDetail}</p>
                    <dl className="mt-3 grid grid-cols-3 gap-2">
                        {[
                            { value: '550+', label: t.about.statsLabels[1] },
                            { value: '70%', label: t.about.statsLabels[2] },
                            { value: String(certCount), label: t.about.statsLabels[3] },
                        ].map((stat) => (
                            <div key={stat.label} className="flex flex-col-reverse justify-end rounded-xl bg-[var(--control)] px-2.5 py-2">
                                <dt className="mt-1 text-micro font-medium leading-tight text-[var(--muted)] caps-gr">{stat.label}</dt>
                                <dd className="text-lg font-bold tabular-nums leading-none">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </motion.div>

                {/* Stickers slapped on the desktop. */}
                <div className="flex flex-wrap justify-center gap-3 md:block" aria-hidden="true">
                    <motion.span {...pop(0.55, -7)} className="os-sticker os-sticker--accent md:absolute md:-top-5 md:right-2 z-10">
                        <i className="fas fa-circle-check" /> JAMF 200
                    </motion.span>
                    <motion.span {...pop(0.65, 6)} className="os-sticker md:absolute md:bottom-1 md:right-0">
                        <i className="fas fa-laptop" /> 550+ Macs
                    </motion.span>
                    <motion.span {...pop(0.75, -3)} className="os-sticker md:absolute md:-bottom-12 md:left-10">
                        <i className="fas fa-terminal" /> bash · python · swift
                    </motion.span>
                </div>
            </div>

            {/* Desktop icons, top right like a real desktop. */}
            <motion.div
                initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                animate={entered ? { opacity: 1, x: 0 } : undefined}
                transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.4 }}
                className="hidden md:flex flex-col gap-3 self-start pt-2"
            >
                {desktopIcons}
            </motion.div>
        </div>
    )
}
