'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '@/utils/motion'

interface WordCycleProps {
    words: string[]
    /** Milliseconds each word holds. */
    interval?: number
    /** Split into letters that crossfade with a stagger (display words) or fade whole (mono lines). */
    letters?: boolean
    className?: string
    /** Start cycling only once this is true (e.g. after the intro overlay). */
    play?: boolean
}

/**
 * One word at a time, crossfading in place — the outgoing and incoming words share a grid
 * cell so they overlap for a beat, like Wama's looping headline. Screen readers get the
 * full list once; the cycling copy is presentational. Reduced motion: the first word
 * stays put.
 */
export default function WordCycle({ words, interval = 2600, letters = true, className = '', play = true }: WordCycleProps) {
    const reduce = useReducedMotion()
    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (reduce || !play || words.length < 2) return
        const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval)
        return () => clearInterval(id)
    }, [reduce, play, words.length, interval])

    const word = words[index % words.length] ?? ''

    return (
        <span className={`inline-grid ${className}`}>
            <span className="sr-only">{words.join(', ')}</span>
            {/* Display words overlap as they crossfade; mono lines swap in sequence so they stay legible. */}
            <AnimatePresence initial={false} mode={letters ? 'sync' : 'wait'}>
                <motion.span
                    key={`${index}-${word}`}
                    aria-hidden="true"
                    className="col-start-1 row-start-1 whitespace-nowrap"
                    initial={letters ? undefined : { opacity: 0 }}
                    animate={letters ? undefined : { opacity: 1, transition: { duration: 0.4 } }}
                    exit={letters ? undefined : { opacity: 0, transition: { duration: 0.25 } }}
                >
                    {letters
                        ? Array.from(word).map((char, i) => (
                              <motion.span
                                  key={i}
                                  className="inline-block"
                                  initial={{ opacity: 0, y: '0.3em', filter: 'blur(5px)' }}
                                  animate={{ opacity: 1, y: '0em', filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE_OUT, delay: 0.12 + i * 0.035 } }}
                                  exit={{ opacity: 0, y: '-0.18em', filter: 'blur(5px)', transition: { duration: 0.4, ease: EASE_OUT, delay: i * 0.025 } }}
                              >
                                  {char === ' ' ? ' ' : char}
                              </motion.span>
                          ))
                        : word}
                </motion.span>
            </AnimatePresence>
        </span>
    )
}
