'use client'
import { useContent } from '@/hooks/useContent'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef } from 'react'

// Magnetic Wrapper Component
function Magnetic({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const springConfig = { stiffness: 100, damping: 20, mass: 0.1 }
    const quickX = useSpring(x, springConfig)
    const quickY = useSpring(y, springConfig)

    const onMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return
        const { clientX, clientY } = e
        const { width, height, left, top } = ref.current.getBoundingClientRect()
        const mouseX = clientX - (left + width / 2)
        const mouseY = clientY - (top + height / 2)
        x.set(mouseX * 0.15)
        y.set(mouseY * 0.15)
    }

    const onMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ x: quickX, y: quickY }}
        >
            {children}
        </motion.div>
    )
}

export default function Contact() {
    const t = useContent()
    const cvLink = "https://drive.google.com/uc?export=download&id=1b-GiyMU1D_6yxr70bmpufj_kIqKgW38A"

    return (
        <section className="w-full h-auto md:h-full flex flex-col justify-center px-4 sm:px-12 md:px-24 py-12 md:py-0 overflow-visible md:overflow-hidden">
            <div className="max-w-6xl mx-auto w-full">
                {/* Header - Editorial Style */}
                <div className="flex flex-col items-start gap-2 mb-8 md:mb-12">
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

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {/* Left Column - Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6 border border-[var(--foreground)] p-8"
                    >
                        <h3 className="text-xl font-bold uppercase tracking-wider text-[var(--accent)] border-b border-[var(--foreground)]/20 pb-2">
                            {t.contact.infoTitle}
                        </h3>

                        {/* Email */}
                        <a href={`mailto:${t.email}`} className="flex items-start sm:items-center gap-3 sm:gap-4 group">
                            <Magnetic>
                                <div className="w-12 h-12 border border-[var(--foreground)] flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--background)] transition-all duration-300 flex-shrink-0">
                                    <i className="fas fa-envelope text-xl"></i>
                                </div>
                            </Magnetic>
                            <div className="flex-1 min-w-0">
                                <div className="text-[10px] font-mono text-[var(--foreground)] opacity-50 uppercase">Email</div>
                                <div className="text-sm sm:text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors break-all">{t.email}</div>
                            </div>
                        </a>

                        {/* Location */}
                        <div className="flex items-center gap-4">
                            <Magnetic>
                                <div className="w-12 h-12 border border-[var(--foreground)] flex items-center justify-center text-[var(--accent)]">
                                    <i className="fas fa-map-marker-alt text-xl"></i>
                                </div>
                            </Magnetic>
                            <div>
                                <div className="text-[10px] font-mono text-[var(--foreground)] opacity-50 uppercase">Location</div>
                                <div className="text-lg font-bold text-[var(--foreground)]">{t.location}</div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="pt-4">
                            <div className="text-[10px] font-mono text-[var(--foreground)] opacity-50 uppercase mb-4">{t.contact.socialTitle}</div>
                            <div className="flex gap-3">
                                <Magnetic>
                                    <a
                                        href={t.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 border border-[var(--foreground)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 hover:shadow-[0_0_20px_var(--accent)]"
                                    >
                                        <i className="fab fa-github text-xl"></i>
                                    </a>
                                </Magnetic>
                                <Magnetic>
                                    <a
                                        href={t.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 border border-[var(--foreground)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 hover:shadow-[0_0_20px_var(--accent)]"
                                    >
                                        <i className="fab fa-linkedin text-xl"></i>
                                    </a>
                                </Magnetic>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - Open to Opportunities */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="border border-[var(--accent)] p-8 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <i className="fas fa-star text-[var(--accent)] text-2xl"></i>
                                <h3 className="text-xl font-bold uppercase tracking-wider text-[var(--foreground)]">
                                    {t.contact.opportunitesTitle}
                                </h3>
                            </div>
                            <p className="text-[var(--foreground)] opacity-70 text-sm leading-relaxed mb-6">
                                {t.contact.opportunitesDescription}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Magnetic>
                                <a
                                    href={`mailto:${t.email}`}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[var(--accent)] text-[var(--background)] font-bold uppercase tracking-widest hover:shadow-[0_0_30px_var(--accent)] transition-all duration-300"
                                >
                                    <i className="fas fa-paper-plane"></i>
                                    {t.contact.sendMessage}
                                </a>
                            </Magnetic>

                            <Magnetic>
                                <a
                                    href={cvLink}
                                    download
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 border border-[var(--foreground)] text-[var(--foreground)] font-bold uppercase tracking-widest hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300"
                                >
                                    <i className="fas fa-download"></i>
                                    {t.contact.downloadResume}
                                </a>
                            </Magnetic>
                        </div>
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-xs font-mono text-[var(--foreground)] opacity-40">
                    <p>{t.copyright}</p>
                </div>
            </div>
        </section>
    )
}

