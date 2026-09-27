'use client'

import { useContent } from '@/hooks/useContent'
import { motion } from 'motion/react'
import LocalTime from '@/components/ui/LocalTime'
import CopyButton from '@/components/ui/CopyButton'
import SectionHeading from '@/components/ui/SectionHeading'
import Field from '@/components/ui/Field'
import { useFitWidth } from '@/hooks/useFitWidth'
import { scrollToSection } from '@/utils/smooth-scroll'
import { EASE_OUT } from '@/utils/motion'

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.8, ease: EASE_OUT, delay },
})

/**
 * The last panel is one cobalt field: the heavy title, the address set as display
 * type across the full measure, then the facts and actions on white hairlines.
 */
export default function Contact() {
    const t = useContent()
    const cvLink = "https://drive.google.com/uc?export=download&id=1b-GiyMU1D_6yxr70bmpufj_kIqKgW38A"
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(t.email)}&su=${encodeURIComponent('Project Collaboration // Andreas Technology')}`
    const [user, domain] = t.email.split('@')
    const emailRef = useFitWidth<HTMLParagraphElement>(t.email)

    return (
        <section className="w-full md:h-full">
            <Field from="bottom" wrapperClassName="w-full h-full" className="w-full h-full flex flex-col px-4 md:px-10 pt-16 pb-28 md:pt-5 md:pb-6">
                <SectionHeading
                    id="contact"
                    index={5}
                    label={t.nav.contact}
                    title={t.editorial.sections.contact}
                    subtitle={t.contact.subtitle}
                    heavy
                    sizeClass="text-[clamp(3rem,15vw,5.5rem)] md:text-[min(11vw,18vh)]"
                />

                <div className="flex-1 min-h-12 md:min-h-4" />

                {/* The address, set as heavy display type across the full measure. */}
                <motion.div {...fadeUp()}>
                    <div className="flex items-center justify-between gap-4 mb-3 md:mb-4">
                        <p className="meta">{t.contact.infoTitle} — {t.contact.emailLabel}</p>
                        <CopyButton value={t.email} label={t.contact.copyEmail} copiedLabel={t.contact.copied} failedLabel={t.contact.copyFailed} />
                    </div>
                    <p
                        ref={emailRef}
                        className="display-heavy text-[calc(11vw*var(--fit,1))] md:text-[calc(min(7.2vw,12vh)*var(--fit,1))] leading-[0.95] tracking-[-0.05em]"
                    >
                        <a
                            href={gmailComposeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Contact via email: ${t.email}`}
                            className="group inline-block max-w-full"
                        >
                            {/* One line on desktop; on phones it breaks at the @ and each half is fitted. */}
                            <span data-fit-line className="inline-block whitespace-nowrap pb-[0.08em]">
                                <span className="link-underline">{user}</span>
                                <span className="max-md:hidden link-underline">@{domain}</span>
                            </span>
                            <span data-fit-line className="md:hidden inline-block whitespace-nowrap pb-[0.08em]">
                                <span className="link-underline">@{domain}</span>
                            </span>
                        </a>
                    </p>
                </motion.div>

                {/* Facts in columns */}
                <motion.dl {...fadeUp(0.1)} className="mt-8 md:mt-10 grid grid-cols-2 md:grid-cols-12 gap-x-4 md:gap-x-6 gap-y-6 rule-t pt-3 text-sm">
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
                            <span className="inline-block w-1.5 h-1.5 bg-[var(--on-cobalt)]" aria-hidden="true" />
                            {t.contact.opportunitiesTitle}
                        </dt>
                        <dd className="leading-snug">{t.contact.opportunitiesDescription}</dd>
                    </div>
                </motion.dl>

                <motion.div {...fadeUp(0.2)} className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-x-4 md:gap-x-6 gap-y-2">
                    <a
                        href={gmailComposeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Contact via email"
                        className="arrow-link md:col-span-3 flex items-center justify-between gap-3 bg-[var(--on-cobalt)] text-[var(--cobalt)] border border-[var(--on-cobalt)] px-5 py-3.5 text-sm font-semibold hover:bg-[var(--cobalt)] hover:text-[var(--on-cobalt)] transition-colors duration-300"
                    >
                        {t.contact.sendMessage}
                        <span className="arrow" aria-hidden="true">→</span>
                    </a>
                    <a
                        href={cvLink}
                        download
                        className="arrow-link md:col-span-3 flex items-center justify-between gap-3 border border-[var(--on-cobalt)] px-5 py-3.5 text-sm font-semibold hover:bg-[var(--on-cobalt)] hover:text-[var(--cobalt)] transition-colors duration-300"
                    >
                        {t.contact.downloadResume}
                        <span className="arrow rotate-90" aria-hidden="true">→</span>
                    </a>
                </motion.div>

                <div className="mt-10 md:mt-8 rule-t pt-2.5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 meta">
                    <p>{t.copyright}</p>
                    <button
                        type="button"
                        onClick={() => scrollToSection(0, 'hero')}
                        className="arrow-link inline-flex items-center gap-1.5 uppercase hover:text-[var(--on-cobalt)] transition-colors"
                    >
                        {t.editorial.backToTop}
                        <span className="arrow -rotate-90" aria-hidden="true">→</span>
                    </button>
                </div>
            </Field>
        </section>
    )
}
