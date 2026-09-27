'use client'

import { useContent } from '@/hooks/useContent'
import { motion, useReducedMotion } from 'motion/react'
import TypeLoop from '@/components/ui/TypeLoop'
import { gmailComposeUrl } from '@/utils/links'
import { WINDOW_SPRING } from '@/utils/motion'
import { useSiteEntered } from '@/hooks/useSiteEntered'
import { useDesktopActions, useDesktopState } from '@/contexts/DesktopContext'
import LocalTime from '@/components/ui/LocalTime'
import Window from '@/components/ui/Window'
import AppIcon, { Avatar } from '@/components/ui/AppIcon'
import Icon from '@/components/ui/Icon'
import CredentialChips from '@/components/ui/CredentialChips'
import type { AppId } from '@/data/apps'
import { RESUME_URL } from '@/data/content'

/** A file or app on the desktop: icon plus a label that turns into the blue selection pill on focus. */
function DesktopIcon({ app, label, href, ariaLabel, download = false }: { app: AppId; label: string; href: string; ariaLabel: string; download?: boolean }) {
    return (
        <a
            href={href}
            {...(download ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' })}
            aria-label={ariaLabel}
            className="os-desk-icon group flex flex-col items-center gap-1 w-full md:w-[6.75rem] py-1 rounded-lg"
        >
            <span className="os-desk-tile">
                <AppIcon app={app} size={60} />
            </span>
            <span className="os-desk-label text-center [overflow-wrap:anywhere]">{label}</span>
        </a>
    )
}

const PROMPT = (
    <>
        <span className="text-[#7EE787]">andreas@af</span> <span className="text-[#79C0FF]">~</span> %
    </>
)

export default function HeroOverlay() {
    const t = useContent()
    const entered = useSiteEntered()
    const reduceMotion = useReducedMotion()
    const { launch } = useDesktopActions()
    // The typing loop only runs while its space is in front: off-screen it would keep
    // relaying out and repainting the translucent Terminal for nobody.
    const onDesktopSpace = useDesktopState((s) => s.active === 'hero')
    const phone = useDesktopState((s) => s.isDesktop === false)

    const [first, ...rest] = t.os.displayName.split(' ')
    const credentials = t.education.filter((e) => e.badge && e.kind && e.kind !== 'degree')
    const credly = t.education.find((e) => e.featured && e.link)?.link ?? t.linkedin
    const certCount = t.education.filter((e) => e.kind === 'certification').length

    const desktopIcons = (
        <>
            <DesktopIcon app="resume" label={t.os.desktop.resume} href={RESUME_URL} ariaLabel={t.os.aria.resume} download />
            <DesktopIcon app="credential" label={t.os.desktop.credential} href={credly} ariaLabel={`${t.os.aria.credential} (${t.os.aria.newTab})`} />
            <DesktopIcon app="github" label={t.os.desktop.github} href={t.github} ariaLabel={`GitHub profile (${t.os.aria.newTab})`} />
            <DesktopIcon app="linkedin" label={t.os.desktop.linkedin} href={t.linkedin} ariaLabel={`LinkedIn profile (${t.os.aria.newTab})`} />
        </>
    )

    return (
        <div className="w-full md:h-full md:max-w-[86rem] flex flex-col gap-4 md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_auto] md:items-center md:gap-9 lg:gap-12">
            {/* ── Welcome window ─────────────────────────────────────── */}
            <Window
                wid="hero"
                app="hero"
                as="section"
                anchor="hero"
                labelledBy="hero-title"
                title={t.os.windows.welcome}
                chrome="compact"
                play={entered}
                className="w-full md:max-w-[42rem] md:justify-self-end"
                footer={
                    <div className="flex items-center justify-between gap-3 px-4 min-h-7 py-1 text-caption text-[var(--muted)]">
                        <span className="inline-flex items-center gap-1.5 min-w-0">
                            <Icon name="mappin" className="text-[0.8125rem]" />
                            <span className="truncate">{t.location}</span>
                            <span aria-hidden="true">·</span>
                            <LocalTime className="tabular-nums" />
                        </span>
                        <span className="hidden md:inline-flex items-center gap-1.5 font-medium">
                            {t.hero.scroll}
                            <Icon name="arrow.right" />
                        </span>
                    </div>
                }
            >
                <div className="px-5 py-6 sm:p-8 lg:px-10 lg:py-9">
                    <div className="flex flex-wrap items-center gap-3 mb-5 md:mb-6">
                        <Avatar size={64} />
                        <span className="os-chip">
                            <span className="w-2 h-2 rounded-full bg-[var(--success)] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.15)]" aria-hidden="true" />
                            <span className="caps-gr">{t.contact.opportunitiesTitle}</span>
                        </span>
                    </div>

                    <p className="text-[0.9375rem] md:text-[1.0625rem] font-medium text-[var(--muted)]">{t.os.greeting}</p>
                    <h1 id="hero-title" className="os-large-title mt-0.5 text-[clamp(2.4rem,11vw,3rem)] md:text-[clamp(2.9rem,4.4vw,4.25rem)] leading-[1.02] tracking-[-0.03em]">
                        <span className="block">{first}</span>
                        <span className="block">{rest.join(' ')}</span>
                    </h1>
                    <p className="mt-4 text-[1.0625rem] md:text-[1.25rem] font-semibold tracking-[-0.015em]">{t.title}</p>
                    <p className="mt-1 text-sm md:text-[0.9375rem] text-[var(--muted)] max-w-[34rem] leading-relaxed">{t.about.tagline}</p>

                    <CredentialChips items={credentials} newTabLabel={t.os.aria.newTab} className="mt-5" />

                    <div className="mt-6 md:mt-7 flex flex-wrap items-center gap-2.5">
                        <button type="button" onClick={() => launch('projects')} className="os-btn os-btn--primary h-9 px-5 text-sm">
                            <span className="caps-gr">{t.hero.viewWork}</span>
                            <Icon name="arrow.right" />
                        </button>
                        <button type="button" onClick={() => launch('contact')} className="os-btn os-btn--secondary h-9 px-5 text-sm">
                            <span className="caps-gr">{t.hero.getInTouch}</span>
                        </button>
                        <span className="flex items-center gap-2 sm:ml-auto">
                            <a href={t.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="os-icon-btn">
                                <Icon name="linkedin" className="text-[0.9375rem]" />
                            </a>
                            <a href={t.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="os-icon-btn">
                                <Icon name="github" className="text-[0.9375rem]" />
                            </a>
                            <a href={gmailComposeUrl(t.email)} target="_blank" rel="noopener noreferrer" aria-label="Contact via email" className="os-icon-btn">
                                <Icon name="envelope" />
                            </a>
                        </span>
                    </div>
                </div>
            </Window>

            {/* Phones: the desktop icons as a home-screen row. */}
            <div className="md:hidden grid grid-cols-4 gap-1 px-1">{desktopIcons}</div>

            {/* ── Terminal and the "Now" widget ───────────────────────── */}
            <div className="relative flex flex-col gap-4 md:gap-6 md:self-center">
                <Window
                    wid="terminal"
                    app="terminal"
                    title={t.os.windows.terminal}
                    variant="terminal"
                    chrome="compact"
                    play={entered}
                    delay={0.12}
                    className="w-full md:max-w-[31rem]"
                >
                    <div className="px-4 py-3.5 md:px-5 md:py-4 font-mono text-[0.75rem] md:text-[0.8125rem] leading-[1.7]">
                        <p>{PROMPT} whoami</p>
                        <div className="text-[#FFD37A] min-h-[1.7em]" role="status" aria-live="polite">
                            <span className="sr-only">{t.hero.typewriter.join(' | ')}</span>
                            <span aria-hidden="true">
                                {entered && onDesktopSpace && (
                                    <TypeLoop strings={t.hero.typewriter} />
                                )}
                            </span>
                        </div>
                        <p className="mt-1.5">{PROMPT} fleet --summary</p>
                        <dl className="grid grid-cols-[7.5rem_1fr] text-[#C9C9D1]">
                            <dt className="text-[#9D9DA8]">endpoints</dt><dd>550+ macOS</dd>
                            <dt className="text-[#9D9DA8]">enrollment</dt><dd>zero-touch · ABM</dd>
                            <dt className="text-[#9D9DA8]">onboarding</dt><dd><span className="text-[#7EE787]">−70%</span> time</dd>
                        </dl>
                        <p className="mt-1.5">{PROMPT} cat credentials.txt</p>
                        <p className="text-[#C9C9D1]">{credentials.map((c) => c.badge).join(' · ')}</p>
                        <p className="mt-1.5">
                            {PROMPT}{' '}
                            <span className="term-cursor inline-block w-[0.55em] h-[1.1em] align-[-0.2em] bg-[#E6E6EA]" aria-hidden="true" />
                        </p>
                    </div>
                </Window>

                {/* "Now": a desktop widget with the current focus and three numbers. */}
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
                    animate={entered ? { opacity: 1, scale: 1 } : undefined}
                    transition={phone ? { duration: 0 } : { ...WINDOW_SPRING, delay: 0.24 }}
                    className="os-widget os-reveal w-full md:max-w-[22rem] md:ml-8 p-4 md:p-[1.125rem]"
                >
                    <div className="flex items-center gap-2 text-caption font-semibold text-[var(--muted)]">
                        <AppIcon app="about" size={18} />
                        {t.os.windows.widget}
                    </div>
                    <p className="mt-2.5 text-caption font-semibold text-[var(--accent)] caps-gr">{t.about.currentFocus}</p>
                    <p className="text-[0.9375rem] md:text-base font-bold tracking-[-0.01em] leading-snug">{t.about.currentFocusDetail}</p>
                    <dl className="mt-3 grid grid-cols-3 gap-2">
                        {[
                            { value: '550+', label: t.about.statsLabels[1] },
                            { value: '70%', label: t.about.statsLabels[2] },
                            { value: String(certCount), label: t.about.statsLabels[3] },
                        ].map((stat) => (
                            <div key={stat.label} className="flex flex-col-reverse justify-end rounded-xl bg-[var(--control)] px-2.5 py-2">
                                <dt className="mt-1 text-micro font-medium leading-tight text-[var(--muted)] caps-gr">{stat.label}</dt>
                                <dd className="text-lg font-bold tabular-nums leading-none tracking-[-0.01em]">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </motion.div>
            </div>

            {/* Desktop icons, top right like a real desktop. */}
            <motion.div
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={entered ? { opacity: 1 } : undefined}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="hidden md:flex flex-col gap-2 self-start pt-1"
            >
                {desktopIcons}
            </motion.div>
        </div>
    )
}
