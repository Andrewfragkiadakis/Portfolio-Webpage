'use client'

import { useContent } from '@/hooks/useContent'
import LocalTime from '@/components/ui/LocalTime'
import CopyButton from '@/components/ui/CopyButton'
import { ArrowOut, Headline, Rich, Rise } from '@/components/ui/keynote'
import { Mark } from '@/components/ui/Mark'
import { CV } from '@/data/site'

/**
 * Slide 7 — the closing slide. The memoji (as on the title slide), one big line, one
 * sentence, two actions; the practical details (email with copy, location, local time,
 * profiles) sit in a quiet row below.
 */
export default function Contact() {
    const t = useContent()
    const k = t.keynote
    // mailto works with whatever mail app the visitor uses (Mail, Outlook, Gmail…).
    const mailto = `mailto:${t.email}?subject=${encodeURIComponent(k.contact.subject)}`

    return (
        <section
            id="contact"
            aria-labelledby="contact-title"
            className="relative w-full md:h-full flex flex-col items-center justify-center-safe px-6 sm:px-10 md:px-[max(3rem,7vw)] pt-20 pb-16 md:py-0 text-center"
        >
            <div className="relative w-full max-w-[71rem] flex flex-col items-center">
                {/* The mark again, bookending the title slide. */}
                <Rise step={0}>
                    <Mark size={96} alt="" className="mx-auto mb-4 w-16 h-16 md:w-[min(4.5rem,7vh)] md:h-[min(4.5rem,7vh)]" />
                    <p className="t-eyebrow">{k.contact.eyebrow}</p>
                </Rise>
                <Headline
                    id="contact-title"
                    step={1}
                    text={k.contact.headline}
                    className="t-hero mt-2 text-[2.75rem] md:text-[clamp(2.75rem,min(5.6vw,8.8vh),5rem)]"
                />
                <Rise step={2}>
                    <p className="t-lede mt-5 md:mt-6 mx-auto max-w-[34rem] text-[1.0625rem] leading-[1.4] md:text-[clamp(1.0625rem,2.7vh,1.5rem)]">
                        <Rich text={k.contact.sub} />
                    </p>
                </Rise>
                <Rise step={3} className="mt-8 md:mt-[min(2.5rem,4.4vh)] flex flex-wrap justify-center gap-3.5">
                    <a href={mailto} className="kn-pill kn-pill--fill flex-auto max-w-[16rem] md:flex-none">
                        {k.contact.send}
                    </a>
                    {/* Self-hosted, so it downloads in place; hidden until an up-to-date PDF exists (data/site.ts). */}
                    {CV && (
                        <a href={CV.path} download="Andreas-Fragkiadakis-CV.pdf" className="kn-pill kn-pill--line flex-auto max-w-[16rem] md:flex-none">
                            {k.contact.resume}
                            <span className="sr-only"> (PDF, {CV.sizeLabel})</span>
                        </a>
                    )}
                </Rise>
            </div>

            <Rise step={4} className="relative w-full max-w-[71rem] mt-16 md:mt-[min(4.5rem,6vh)]">
                <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr] border-t border-[var(--line)] text-left">
                    <div className="py-5 md:pr-6 border-b md:border-b-0 border-[var(--line)]">
                        <dt className="t-caption text-[var(--muted)]">{k.contact.email}</dt>
                        <dd className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                            <a href={`mailto:${t.email}`} className="t-body break-all hover:text-[var(--accent)] transition-colors">{t.email}</a>
                            <CopyButton value={t.email} label={k.contact.copy} copiedLabel={k.contact.copied} failedLabel={k.contact.copyFailed} />
                        </dd>
                    </div>
                    <div className="py-5 md:px-6 border-b md:border-b-0 md:border-l border-[var(--line)]">
                        <dt className="t-caption text-[var(--muted)]">{k.contact.location}</dt>
                        <dd className="mt-1.5 t-body">{t.location}</dd>
                    </div>
                    <div className="py-5 md:px-6 border-b md:border-b-0 md:border-l border-[var(--line)]">
                        <dt className="t-caption text-[var(--muted)]">{k.contact.time}</dt>
                        <dd className="mt-1.5 t-body">
                            <LocalTime className="tabular-nums" />
                        </dd>
                    </div>
                    <div className="py-5 md:pl-6 md:border-l border-[var(--line)]">
                        <dt className="t-caption text-[var(--muted)]">{k.contact.elsewhere}</dt>
                        <dd className="mt-1.5 flex gap-5 t-body">
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
                <p className="mt-6 md:mt-[min(2rem,3vh)] t-caption text-[var(--muted)]">{t.copyright}</p>
            </Rise>
        </section>
    )
}
