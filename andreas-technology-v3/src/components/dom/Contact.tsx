'use client'

import { useContent } from '@/hooks/useContent'
import { motion } from 'motion/react'
import LocalTime from '@/components/ui/LocalTime'
import CopyButton from '@/components/ui/CopyButton'
import SectionHeading from '@/components/ui/SectionHeading'
import { scrollToSection } from '@/utils/smooth-scroll'
import { EASE_OUT } from '@/utils/motion'

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.8, ease: EASE_OUT, delay },
})

export default function Contact() {
    const t = useContent()
    const cvLink = "https://drive.google.com/uc?export=download&id=1b-GiyMU1D_6yxr70bmpufj_kIqKgW38A"
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(t.email)}&su=${encodeURIComponent('Project Collaboration // Andreas Technology')}`
    const [user, domain] = t.email.split('@')

    return (
        <section className="w-full md:h-full flex flex-col px-4 md:px-10 pt-16 pb-28 md:pt-5 md:pb-6">
            <SectionHeading id="contact" index={5} label={t.nav.contact} title={t.editorial.sections.contact} subtitle={t.contact.subtitle} sizeClass="text-[clamp(3rem,16vw,5.5rem)] md:text-[min(12vw,19vh)]" />

            <div className="flex-1 min-h-10 md:min-h-4" />

            {/* The address, set as display type. */}
            <motion.div {...fadeUp()}>
                <p className="meta mb-2">{t.contact.infoTitle} — {t.contact.emailLabel}</p>
                <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
                    <a
                        href={gmailComposeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Contact via email: ${t.email}`}
                        className="group display text-[9vw] md:text-[min(5.4vw,10vh)] leading-[0.95] tracking-[-0.045em] hover:text-[var(--accent-ink)] transition-colors duration-300"
                    >
                        <span className="link-underline">{user}</span>
                        <wbr />
                        <span className="link-underline">@{domain}</span>
                        <span className="inline-block ml-[0.12em] text-[0.7em] align-[0.25em] text-[var(--accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[0.08em] group-hover:-translate-y-[0.08em]" aria-hidden="true">↗</span>
                    </a>
                    <div className="md:mb-2">
                        <CopyButton value={t.email} label={t.contact.copyEmail} copiedLabel={t.contact.copied} failedLabel={t.contact.copyFailed} />
                    </div>
                </div>
            </motion.div>

            {/* Facts in columns */}
            <motion.dl {...fadeUp(0.1)} className="mt-8 md:mt-10 grid grid-cols-2 md:grid-cols-12 gap-x-4 md:gap-x-6 gap-y-6 rule-t pt-4 text-[0.9375rem]">
                <div className="md:col-span-3">
                    <dt className="meta mb-1.5">{t.contact.locationLabel}</dt>
                    <dd className="font-medium">{t.location}</dd>
                </div>
                <div className="md:col-span-3">
                    <dt className="meta mb-1.5">{t.contact.localTimeLabel}</dt>
                    <dd className="font-medium"><LocalTime className="tabular" /></dd>
                </div>
                <div className="md:col-span-2">
                    <dt className="meta mb-1.5">{t.contact.socialTitle}</dt>
                    <dd className="font-medium flex flex-col items-start gap-0.5">
                        <a href={t.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="link-rule">GitHub ↗</a>
                        <a href={t.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="link-rule">LinkedIn ↗</a>
                    </dd>
                </div>
                <div className="col-span-2 md:col-span-4">
                    <dt className="meta mb-1.5 flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                        {t.contact.opportunitiesTitle}
                    </dt>
                    <dd className="text-[var(--foreground)] leading-snug">{t.contact.opportunitiesDescription}</dd>
                </div>
            </motion.dl>

            <motion.div {...fadeUp(0.2)} className="mt-7 md:mt-9 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <a
                    href={gmailComposeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Contact via email"
                    className="arrow-link pill sm:min-w-[14rem]"
                >
                    {t.contact.sendMessage}
                    <span className="arrow" aria-hidden="true">→</span>
                </a>
                <a
                    href={cvLink}
                    download
                    className="arrow-link pill pill-outline sm:min-w-[14rem]"
                >
                    {t.contact.downloadResume}
                    <span className="arrow rotate-90" aria-hidden="true">→</span>
                </a>
            </motion.div>

            <div className="mt-10 md:mt-8 rule-t pt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 meta">
                <p>{t.copyright}</p>
                <button
                    type="button"
                    onClick={() => scrollToSection(0, 'hero')}
                    className="arrow-link inline-flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors"
                >
                    {t.editorial.backToTop}
                    <span className="arrow -rotate-90" aria-hidden="true">→</span>
                </button>
            </div>
        </section>
    )
}
