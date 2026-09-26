'use client'

import { useInView } from 'motion/react'
import { useRef, type CSSProperties } from 'react'

const CELL_W = 26
const CELL_H = 21

/**
 * The fleet drawn to scale: one laptop glyph per ten Macs. Glyphs light up in a
 * diagonal wave the first time the grid is seen (instantly with reduced motion).
 * Decorative — the tile's numeral and label carry the figure.
 */
export default function MacGrid({ count = 55, cols = 11, className = '' }: { count?: number; cols?: number; className?: string }) {
    const ref = useRef<SVGSVGElement>(null)
    const lit = useInView(ref, { once: true, amount: 0.5 })
    const rows = Math.ceil(count / cols)

    return (
        <svg
            ref={ref}
            data-lit={lit}
            viewBox={`0 0 ${cols * CELL_W - 4} ${rows * CELL_H - 5}`}
            preserveAspectRatio="xMinYMax meet"
            className={className}
            aria-hidden="true"
        >
            <defs>
                <symbol id="mac-glyph" viewBox="0 0 22 16">
                    {/* Lid with a darker display inset, then the base with its thumb notch. */}
                    <rect x="2" y="0" width="18" height="12.2" rx="1.8" fill="currentColor" />
                    <rect x="3.4" y="1.4" width="15.2" height="9.4" rx="0.8" fill="var(--glyph-screen, rgba(28, 32, 110, 0.5))" />
                    <path d="M0 13.1h22v0.9a1.6 1.6 0 0 1-1.6 1.6H1.6A1.6 1.6 0 0 1 0 14z" fill="currentColor" />
                </symbol>
            </defs>
            {Array.from({ length: count }, (_, i) => {
                const col = i % cols
                const row = Math.floor(i / cols)
                return (
                    <use
                        key={i}
                        href="#mac-glyph"
                        x={col * CELL_W}
                        y={row * CELL_H}
                        width="22"
                        height="16"
                        className="mac-glyph"
                        style={{ '--d': `${(col + row) * 0.045}s` } as CSSProperties}
                    />
                )
            })}
        </svg>
    )
}
