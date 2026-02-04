'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Typewriter from 'typewriter-effect'

const MOBILE_MAX_WIDTH = 768

export default function CinematicEntry() {
    const [entered, setEntered] = useState(false)
    const [showButton, setShowButton] = useState(false)
    const [isMobile, setIsMobile] = useState(true)

    useEffect(() => {
        const check = () => window.innerWidth <= MOBILE_MAX_WIDTH
        setIsMobile(check())
        const listener = () => setIsMobile(check())
        window.addEventListener('resize', listener)
        return () => window.removeEventListener('resize', listener)
    }, [])

    useEffect(() => {
        if (isMobile) {
            setEntered(true)
            document.body.style.overflow = 'auto'
            return
        }
        if (!entered) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [entered, isMobile])

    return (
        <AnimatePresence>
            {!entered && !isMobile && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)]"
                >
                    <div className="font-mono text-xl md:text-2xl tracking-widest text-[var(--accent)] mb-8">
                        <Typewriter
                            onInit={(typewriter) => {
                                typewriter
                                    .typeString('> INITIALIZING SYSTEM...')
                                    .pauseFor(1000)
                                    .typeString('<br>> LOADING ASSETS...')
                                    .pauseFor(1000)
                                    .typeString('<br>> READY.')
                                    .callFunction(() => setShowButton(true))
                                    .start();
                            }}
                            options={{
                                delay: 50,
                                cursor: '█'
                            }}
                        />
                    </div>

                    {showButton && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.1, textShadow: "0 0 8px var(--accent)" }}
                            onClick={() => setEntered(true)}
                            className="px-8 py-4 border border-[var(--accent)] text-[var(--accent)] font-bold uppercase tracking-[0.2em] hover:bg-[var(--accent)]/10 transition-all duration-300 ease-out"
                        >
                            Enter System
                        </motion.button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
