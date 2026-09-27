'use client'

import { useEffect, useState } from 'react'
import { SECTION_IDS } from '@/data/sections'

/*
 * Mission Control geometry. Kept apart from the MissionControl component so the
 * journey can size its spaces without pulling the overview UI into the first load:
 * the component itself is loaded on desktop only, after hydration.
 */

/** Where each space sits in the overview grid (viewport px), and the thumbnail scale. */
export interface SpaceSlot { left: number; top: number; w: number; h: number; s: number; W: number }

export const COLS = 3
const LABEL_H = 30

/** A 3 × 2 grid of the six spaces between the menu bar and the Dock. */
export function overviewGeometry(W: number, H: number): SpaceSlot[] {
    const top = 24 + 60
    const bottom = H - 104
    const gapX = Math.max(24, W * 0.025)
    const gapY = 14
    const mx = Math.max(48, W * 0.05)
    const rows = Math.ceil(SECTION_IDS.length / COLS)
    const s = Math.min((W - 2 * mx - (COLS - 1) * gapX) / COLS / W, (bottom - top - (rows - 1) * gapY - rows * LABEL_H) / rows / H)
    const w = W * s
    const h = H * s
    const gridW = COLS * w + (COLS - 1) * gapX
    const gridH = rows * (h + LABEL_H) + (rows - 1) * gapY
    const left0 = (W - gridW) / 2
    const top0 = top + (bottom - top - gridH) / 2
    return SECTION_IDS.map((_, i) => ({
        left: left0 + (i % COLS) * (w + gapX),
        top: top0 + Math.floor(i / COLS) * (h + LABEL_H + gapY),
        w,
        h,
        s,
        W,
    }))
}

/** Tracks the overview grid for the current viewport (desktop only). */
export function useOverviewGeometry(enabled: boolean): SpaceSlot[] | null {
    const [geo, setGeo] = useState<SpaceSlot[] | null>(null)
    useEffect(() => {
        if (!enabled) {
            // Leaving the desktop layout: no overview geometry at all.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setGeo(null)
            return
        }
        const update = () => setGeo(overviewGeometry(window.innerWidth, window.innerHeight))
        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [enabled])
    return geo
}

