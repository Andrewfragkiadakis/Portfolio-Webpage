'use client'

import { useContent } from '@/hooks/useContent'
import { motion } from 'framer-motion'

export default function Services() {
    const t = useContent()

    return (
        <section className="w-full h-auto md:h-full flex flex-col justify-center px-4 sm:px-12 md:px-24 py-12 md:py-0 overflow-visible md:overflow-hidden">
            <div className="max-w-7xl mx-auto w-full">
                <div className="flex flex-col items-end gap-2 mb-8 sm:mb-12 w-full text-right">
                    <motion.h2
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-[12vw] md:text-[8vw] leading-[0.8] font-black tracking-tighter text-transparent select-none"
                        style={{ WebkitTextStroke: '2px var(--foreground)' }}
                    >
                        EXPERTISE
                    </motion.h2>
                    <span className="text-sm font-mono tracking-widest uppercase text-[var(--foreground)] pr-2">
                        // WHAT I DO
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {t.services.map((service: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-[var(--background)] p-6 border border-[var(--foreground)]/50 hover:border-[var(--accent)] transition-all duration-300 hover:shadow-[0_0_20px_var(--accent)] group flex flex-col justify-between h-full"
                        >
                            <div>
                                <div className="w-16 h-16 mb-6 bg-[var(--foreground)]/10 rounded-full flex items-center justify-center text-3xl text-[var(--accent)] group-hover:scale-110 transition-transform duration-300">
                                    <i className={service.icon}></i>
                                </div>

                                <h3 className="text-xl font-bold mb-3 text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors uppercase tracking-tight">
                                    {service.title}
                                </h3>

                                <p className="text-[var(--foreground)] opacity-80 leading-relaxed text-sm">
                                    {service.description}
                                </p>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <i className="fas fa-plus text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <p className="text-lg text-[var(--foreground)] opacity-90 mb-4">
                        Have a unique project in mind?
                    </p>
                    <button
                        onClick={() => {
                            if (typeof window !== 'undefined') {
                                if (window.innerWidth >= 768) {
                                    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
                                    const targetY = (5 / 5) * maxScroll
                                    window.scrollTo({ top: targetY, behavior: 'smooth' })
                                } else {
                                    const element = document.getElementById('contact')
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' })
                                    }
                                }
                            }
                        }}
                        className="inline-block px-8 py-4 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--background)] transition-all duration-300 font-bold uppercase tracking-widest hover:shadow-[0_0_20px_var(--accent)] cursor-pointer"
                    >
                        Let&apos;s Talk
                    </button>
                </motion.div>
            </div>
        </section>
    )
}
