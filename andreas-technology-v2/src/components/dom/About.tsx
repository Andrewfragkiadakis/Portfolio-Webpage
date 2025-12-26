'use client'
import { useContent } from '@/hooks/useContent'
import { motion } from 'framer-motion'
import { memo } from 'react'

function About() {
    const t = useContent()

    return (
        <section id="about" className="min-h-screen snap-start bg-white dark:bg-zinc-950 text-black dark:text-white py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 md:mb-12"
                >
                    {t.about.title}
                </motion.h2>

                <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-4xl">
                    {t.about.description.map((paragraph: string, index: number) => (
                        <motion.p
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            {paragraph}
                        </motion.p>
                    ))}
                </div>

                {/* Skills Grid */}
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl sm:text-3xl font-bold mt-12 sm:mt-16 md:mt-24 mb-8 sm:mb-12"
                >
                    {t.skillsTitle}
                </motion.h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {t.skills.map((skill: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.05, duration: 0.4 }}
                            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                            className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 p-6 rounded-lg hover:border-black dark:hover:border-white transition-all duration-300 shadow-sm hover:shadow-xl group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-4xl text-zinc-800 dark:text-white group-hover:scale-110 transition-transform duration-300">
                                    <i className={skill.icon}></i>
                                </div>
                                <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">
                                    {['Advanced', 'Expert', 'Intermediate'][index % 3]}
                                </div>
                            </div>

                            <h4 className="text-xl font-semibold mb-3 group-hover:text-black dark:group-hover:text-white transition-colors">{skill.label}</h4>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4">{skill.detail}</p>

                            {/* Animated Progress Bar */}
                            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-black dark:bg-white"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${[90, 85, 95, 80, 85, 90][index % 6]}%` }}
                                    transition={{ duration: 1, delay: 0.3 + (index * 0.05), ease: "easeOut" }}
                                    viewport={{ once: true }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default memo(About)
