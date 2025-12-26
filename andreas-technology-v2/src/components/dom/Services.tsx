'use client'

import { useContent } from '@/hooks/useContent'
import { motion } from 'framer-motion'
import { memo } from 'react'

function Services() {
    const t = useContent()

    return (
        <section id="services" className="min-h-screen snap-start bg-zinc-50 dark:bg-zinc-900 text-black dark:text-white py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 flex items-center">
            <div className="max-w-7xl mx-auto w-full">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 sm:mb-24 text-center"
                >
                    {t.servicesTitle}
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                    {t.services.map((service: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -10, transition: { duration: 0.2 } }}
                            className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-zinc-100 dark:border-zinc-800 group text-center"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-4xl text-black dark:text-white group-hover:scale-110 transition-transform duration-300">
                                <i className={service.icon}></i>
                            </div>

                            <h3 className="text-2xl font-bold mb-4 group-hover:text-black dark:group-hover:text-white transition-colors">
                                {service.title}
                            </h3>

                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default memo(Services)
