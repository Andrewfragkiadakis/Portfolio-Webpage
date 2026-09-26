'use client'

import { useContent } from '@/hooks/useContent'
import LocalTime from '@/components/ui/LocalTime'
import CopyButton from '@/components/ui/CopyButton'
import { ArrowOut, Chevron, Headline, Parallax, Rich, Rise } from '@/components/ui/keynote'

const CV_LINK = 'https://drive.google.com/uc?export=download&id=1b-GiyMU1D_6yxr70bmpufj_kIqKgW38A'

/**
 * Slide 6 — the closing slide. One big line, one sentence, two actions; the practical
 * details (email with copy, location, local time, profiles) sit in a quiet row below.
 */
export default function Contact() {
    const t = useContent()
    const k = t.keynote
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(t.email)}&su=${encodeURIComponent('Project Collaboration // Andreas Technology')}`

    return (
        <section
            id="contact"
            aria-labelledby="contact-title"
            className="relative w-full md:h-full flex flex-col items-center justify-center px-5 sm:px-10 md:px-[max(3rem,6vw)] pt-20 pb-36 md:py-0 overflow-hidden text-center"
        >
            <Parallax depth={-0.3} className="pointer-events-none absolute inset-0">
                <div className="kn-glow absolute inset-[-5%]" aria-hidden="true" />
            </Parallax>

            <Parallax depth={0.06} className="relative w-full max-w-[76rem] flex flex-col items-center">
                <Rise>
                    <p className="kn-eyebrow">{k.contact.eyebrow}</p>
                </Rise>
                <Headline
                    id="contact-title"
                    text={k.contact.headline}
                    className="mt-3 text-[clamp(2.5rem,11.5vw,4.75rem)] md:text-[min(8vw,12.5vh)]"
                />
                <Rise delay={0.35}>
                    <p className="kn-lede mt-6 md:mt-8 mx-auto max-w-[36rem] text-[1.125rem] md:text-[min(1.6vw,2.8vh)]">
                        <Rich text={k.contact.sub} />
                    </p>
                </Rise>
                <Rise delay={0.5} className="mt-8 md:mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
                    <a href={gmailComposeUrl} target="_blank" rel="noopener noreferrer" className="kn-pill kn-pill--fill" aria-label={`${k.contact.send} (${k.common.newTab})`}>
                        {k.contact.send}
                        <Chevron />
                    </a>
                    <a href={CV_LINK} download className="kn-pill kn-pill--line">
                        {k.contact.resume}
                        <Chevron />
                    </a>
                </Rise>
            </Parallax>

            <Parallax depth={0.1} className="relative w-full max-w-[76rem] mt-14 md:mt-[min(9vh,5rem)]">
                <Rise delay={0.65}>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr] border-t border-[var(--line)] text-left">
                        <div className="py-5 md:pr-6 border-b md:border-b-0 border-[var(--line)]">
                            <dt className="text-caption text-[var(--muted)]">{k.contact.email}</dt>
                            <dd className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                                <a href={`mailto:${t.email}`} className="text-body-sm font-semibold break-all hover:text-[var(--accent)] transition-colors">{t.email}</a>
                                <CopyButton value={t.email} label={k.contact.copy} copiedLabel={k.contact.copied} failedLabel={k.contact.copyFailed} />
                            </dd>
                        </div>
                        <div className="py-5 md:px-6 border-b md:border-b-0 md:border-l border-[var(--line)]">
                            <dt className="text-caption text-[var(--muted)]">{k.contact.location}</dt>
                            <dd className="mt-1.5 text-body-sm font-semibold">{t.location}</dd>
                        </div>
                        <div className="py-5 md:px-6 border-b md:border-b-0 md:border-l border-[var(--line)]">
                            <dt className="text-caption text-[var(--muted)]">{k.contact.time}</dt>
                            <dd className="mt-1.5 text-body-sm font-semibold">
                                <LocalTime className="tabular-nums" />
                            </dd>
                        </div>
                        <div className="py-5 md:pl-6 md:border-l border-[var(--line)]">
                            <dt className="text-caption text-[var(--muted)]">{k.contact.elsewhere}</dt>
                            <dd className="mt-1.5 flex gap-5 text-body-sm">
                                <a href={t.linkedin} target="_blank" rel="noopener noreferrer" className="kn-link" aria-label={`LinkedIn (${k.common.newTab})`}>
                                    LinkedIn
                                    <ArrowOut />
                                </a>
                                <a href={t.github} target="_blank" rel="noopener noreferrer" className="kn-link" aria-label={`GitHub (${k.common.newTab})`}>
                                    GitHub
                                    <ArrowOut />
                                </a>
                            </dd>
                        </div>
                    </dl>
                    <p className="mt-6 md:mt-8 text-caption text-[var(--muted)]">{t.copyright}</p>
                </Rise>
            </Parallax>
        </section>
    )
}
