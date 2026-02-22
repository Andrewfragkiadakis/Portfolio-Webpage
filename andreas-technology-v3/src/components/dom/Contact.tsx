'use client'

import { useContent } from '@/hooks/useContent'
import { motion } from 'framer-motion'

export default function Contact() {
    const t = useContent()
    const cvLink = "https://drive.google.com/uc?export=download&id=1b-GiyMU1D_6yxr70bmpufj_kIqKgW38A"
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(t.email)}&su=${encodeURIComponent('Project Collaboration // Andreas Technology')}`

    return (
        <section className="w-full h-auto md:h-full flex flex-col justify-center px-4 sm:px-12 md:px-24 py-4 md:py-0 overflow-visible md:overflow-hidden">
            <div className="max-w-6xl mx-auto w-full">
                <div id="contact" className="flex flex-col items-start gap-2 mb-8 md:mb-12">
                    <motion.h2
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-[12vw] md:text-[8vw] leading-[0.8] font-black tracking-tighter text-transparent select-none"
                        style={{ WebkitTextStroke: '2px var(--foreground)' }}
                    >
                        {t.contact.title}
                    </motion.h2>
                    <span className="text-sm font-mono tracking-widest uppercase text-[var(--foreground)] pl-2">
                        // {t.contact.subtitle}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6 border border-[var(--foreground)] p-8"
                    >
                        <h3 className="text-xl font-bold uppercase tracking-wider text-[var(--accent)] border-b border-[var(--foreground)]/20 pb-2">
                            {t.contact.infoTitle}
                        </h3>

                        <a href={gmailComposeUrl} className="flex items-start sm:items-center gap-3 sm:gap-4 group" aria-label="Contact via email">
                            <div className="w-12 h-12 border border-[var(--foreground)] flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--background)] transition-all duration-300 ease-out flex-shrink-0">
                                <i className="fas fa-envelope text-xl" aria-hidden="true" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[10px] font-mono text-[var(--foreground)] opacity-80 uppercase">{t.contact.emailLabel}</div>
                                <div className="text-sm sm:text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors break-all">{t.email}</div>
                            </div>
                        </a>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 border border-[var(--foreground)] flex items-center justify-center text-[var(--accent)]">
                                <i className="fas fa-map-marker-alt text-xl" aria-hidden="true" />
                            </div>
                            <div>
                                <div className="text-[10px] font-mono text-[var(--foreground)] opacity-80 uppercase">{t.contact.locationLabel}</div>
                                <div className="text-sm sm:text-lg font-bold text-[var(--foreground)]">{t.location}</div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="text-[10px] font-mono text-[var(--foreground)] opacity-80 uppercase mb-4">{t.contact.socialTitle}</div>
                            <div className="flex gap-3">
                                <a
                                    href={t.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub profile"
                                    className="w-12 h-12 border border-[var(--foreground)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 ease-out hover:shadow-[0_0_20px_var(--accent)]"
                                >
                                    <i className="fab fa-github text-xl" aria-hidden="true" />
                                </a>
                                <a
                                    href={t.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn profile"
                                    className="w-12 h-12 border border-[var(--foreground)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 ease-out hover:shadow-[0_0_20px_var(--accent)]"
                                >
                                    <i className="fab fa-linkedin text-xl" aria-hidden="true" />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="border border-[var(--accent)] p-8 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <i className="fas fa-star text-[var(--accent)] text-2xl" aria-hidden="true" />
                                <h3 className="text-xl font-bold uppercase tracking-wider text-[var(--foreground)]">
                                    {t.contact.opportunitiesTitle}
                                </h3>
                            </div>
                            <p className="text-[var(--foreground)] opacity-80 text-sm leading-relaxed mb-6">
                                {t.contact.opportunitiesDescription}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <a
                                href={gmailComposeUrl}
                                aria-label="Contact via email"
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[var(--accent)] text-[var(--background)] font-bold uppercase tracking-widest hover:shadow-[0_0_30px_var(--accent)] transition-all duration-300 ease-out"
                            >
                                <i className="fas fa-paper-plane" aria-hidden="true" />
                                {t.contact.sendMessage}
                            </a>

                            <a
                                href={cvLink}
                                download
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 border border-[var(--foreground)] text-[var(--foreground)] font-bold uppercase tracking-widest hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 ease-out"
                            >
                                <i className="fas fa-download" aria-hidden="true" />
                                {t.contact.downloadResume}
                            </a>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-6 pb-[7rem] md:pb-0 text-center text-xs font-mono text-[var(--foreground)] opacity-75">
                    <p>{t.copyright}</p>
                </div>
            </div>
        </section>
    )
}
