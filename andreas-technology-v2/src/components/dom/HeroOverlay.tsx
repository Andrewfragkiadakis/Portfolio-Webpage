'use client'

import { useContent } from '@/hooks/useContent'
import Typewriter from 'typewriter-effect'

export default function HeroOverlay() {
    const t = useContent()

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <div className="absolute top-0 left-0 w-full h-screen flex flex-col justify-center items-start p-6 sm:p-12 pointer-events-none z-10">
            {/* Floating Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 dark:from-white/5 dark:to-white/5 animate-pulse-slow pointer-events-none" />

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-black dark:text-white mb-4">
                {t.name.split(' ')[0]}
            </h1>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-black dark:text-white mb-4">
                {t.name.split(' ')[1]}
            </h1>
            <div className="text-lg sm:text-xl md:text-2xl font-light tracking-widest text-zinc-600 dark:text-zinc-400 uppercase h-12 flex items-center">
                <Typewriter
                    options={{
                        strings: [
                            t.title,
                            "IT Engineer",
                            "Network & Systems Engineer",
                            "Infrastructure & Support Engineer",
                            "Applied Computer Science Specialist",
                            "Creative Problem Solver",
                            "Technical Support Engineer",
                            "Conversational AI Engineer",
                            "Cloud & DevOps Enthusiast",
                            "System Design & Integration Engineer",
                            "AI & Automation Enthusiast",
                        ],
                        autoStart: true,
                        loop: true,
                        delay: 50,
                        deleteSpeed: 30,
                    }}

                />
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 mt-8 pointer-events-auto">
                <button
                    onClick={() => scrollToSection('projects')}
                    className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:scale-105 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                >
                    View Projects
                </button>



                <button
                    onClick={() => scrollToSection('contact')}
                    className="px-6 py-3 border-2 border-black dark:border-white text-black dark:text-white rounded-lg hover:scale-105 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 font-medium"
                >
                    Contact Me
                </button>
            </div>

            <div className="absolute bottom-6 sm:bottom-12 left-6 sm:left-12 text-xs sm:text-sm font-mono text-zinc-500 dark:text-zinc-400 animate-bounce">
                SCROLL TO EXPLORE ↓
            </div>
        </div>
    )
}
