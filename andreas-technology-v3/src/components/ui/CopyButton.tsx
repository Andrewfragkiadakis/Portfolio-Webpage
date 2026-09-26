'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE_OUT } from '@/utils/motion'

type CopyState = 'idle' | 'copied' | 'failed'

const CLIPBOARD_TIMEOUT_MS = 1000

/** Fallback for contexts where the async Clipboard API is blocked (embedded views, strict permissions). */
function legacyCopy(value: string): boolean {
    const field = document.createElement('textarea')
    field.value = value
    field.setAttribute('readonly', '')
    field.style.position = 'fixed'
    field.style.opacity = '0'
    document.body.appendChild(field)
    field.select()
    let ok = false
    try {
        ok = document.execCommand('copy')
    } catch {
        ok = false
    }
    field.remove()
    return ok
}

interface CopyButtonProps {
    value: string
    label: string
    copiedLabel: string
    failedLabel: string
}

/** Copies `value` and confirms inline; the result is announced politely. */
export default function CopyButton({ value, label, copiedLabel, failedLabel }: CopyButtonProps) {
    const [state, setState] = useState<CopyState>('idle')

    useEffect(() => {
        if (state === 'idle') return
        const timer = setTimeout(() => setState('idle'), 2000)
        return () => clearTimeout(timer)
    }, [state])

    const copy = async () => {
        // Some embedded browsers leave the Clipboard API promise pending behind a
        // permission prompt that never appears, so give it a deadline.
        const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), CLIPBOARD_TIMEOUT_MS))
        let ok = false
        try {
            await Promise.race([navigator.clipboard.writeText(value), timeout])
            ok = true
        } catch {
            ok = legacyCopy(value)
        }
        setState(ok ? 'copied' : 'failed')
    }

    const icon = state === 'copied' ? 'fa-check text-[var(--accent)]' : state === 'failed' ? 'fa-xmark' : 'fa-copy'
    const text = state === 'copied' ? copiedLabel : state === 'failed' ? failedLabel : label

    return (
        <button
            type="button"
            onClick={copy}
            aria-label={`${label}: ${value}`}
            className="relative shrink-0 inline-flex items-center gap-2 h-9 px-3 border border-[var(--foreground)]/30 text-[10px] font-mono uppercase tracking-widest text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-300"
        >
            <i className={`fas ${icon}`} aria-hidden="true" />
            <span aria-live="polite" className="relative inline-flex overflow-hidden h-[1.2em]">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                        key={state}
                        initial={{ y: '100%' }}
                        animate={{ y: '0%' }}
                        exit={{ y: '-100%' }}
                        transition={{ duration: 0.3, ease: EASE_OUT }}
                    >
                        {text}
                    </motion.span>
                </AnimatePresence>
            </span>
        </button>
    )
}
