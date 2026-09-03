'use client'

import { useCallback, useEffect, useRef } from 'react'

/** Maximum rotation in degrees. Past ~8° the card stops reading as paper and starts reading as a gimmick. */
const MAX_TILT_DEG = 8
/** Degrees of device rotation that map to full tilt. Roughly a comfortable wrist range. */
const DEVICE_RANGE_DEG = 24

type DeviceOrientationEventWithPermission = typeof DeviceOrientationEvent & {
    requestPermission?: () => Promise<'granted' | 'denied'>
}

function clamp(value: number, limit: number): number {
    return Math.max(-limit, Math.min(limit, value))
}

function reducedMotion(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Pointer-driven tilt on desktop, gyroscope-driven tilt on mobile.
 *
 * Writes `--tilt-x` / `--tilt-y` custom properties straight onto the element — the
 * transform itself is declared in CSS. Nothing here touches React state, so a stream of
 * `deviceorientation` events at 60Hz costs one style write per frame and zero renders.
 *
 * The device readings are normalised against the *first* reading rather than against
 * flat-on-a-table, so the neutral position is however the user is already holding the
 * phone. Absolute beta/gamma would mean a permanent lean for anyone reading at an angle.
 */
export function useTilt<T extends HTMLElement>(enabled = true) {
    const ref = useRef<T>(null)
    const origin = useRef<{ beta: number; gamma: number } | null>(null)

    const write = useCallback((x: number, y: number) => {
        const node = ref.current
        if (!node) return
        node.style.setProperty('--tilt-x', `${x.toFixed(2)}deg`)
        node.style.setProperty('--tilt-y', `${y.toFixed(2)}deg`)
    }, [])

    const reset = useCallback(() => write(0, 0), [write])

    // Pointer tilt — desktop only. `pointerType` keeps a touch drag from double-driving
    // the same element that the gyroscope is already moving.
    const handlePointerMove = useCallback(
        (event: React.PointerEvent<T>) => {
            if (!enabled || event.pointerType !== 'mouse' || reducedMotion()) return
            const node = ref.current
            if (!node) return

            const rect = node.getBoundingClientRect()
            const px = (event.clientX - rect.left) / rect.width - 0.5
            const py = (event.clientY - rect.top) / rect.height - 0.5

            // Y pointer movement rotates around X, and vice versa.
            write(clamp(-py * MAX_TILT_DEG * 2, MAX_TILT_DEG), clamp(px * MAX_TILT_DEG * 2, MAX_TILT_DEG))
        },
        [enabled, write]
    )

    // Gyroscope tilt. Listener is only attached once permission is known to be available:
    // on iOS 13+ `deviceorientation` silently delivers nothing until `requestPermission`
    // resolves, and that call must originate from a user gesture — so we never prompt here.
    useEffect(() => {
        if (!enabled || typeof window === 'undefined') return
        if (!('DeviceOrientationEvent' in window) || reducedMotion()) return

        const handleOrientation = (event: DeviceOrientationEvent) => {
            const { beta, gamma } = event
            if (beta === null || gamma === null) return

            if (!origin.current) {
                origin.current = { beta, gamma }
                return
            }

            const dBeta = beta - origin.current.beta
            const dGamma = gamma - origin.current.gamma

            write(
                clamp((-dBeta / DEVICE_RANGE_DEG) * MAX_TILT_DEG, MAX_TILT_DEG),
                clamp((dGamma / DEVICE_RANGE_DEG) * MAX_TILT_DEG, MAX_TILT_DEG)
            )
        }

        window.addEventListener('deviceorientation', handleOrientation, { passive: true })
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation)
            origin.current = null
        }
    }, [enabled, write])

    return { ref, onPointerMove: handlePointerMove, onPointerLeave: reset }
}

/**
 * Ask iOS for gyroscope access. Must be called from inside a user gesture handler.
 * Returns false anywhere the permission model does not exist (Android, desktop), where
 * the events simply flow without asking.
 */
export async function requestTiltPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) return false

    const api = window.DeviceOrientationEvent as DeviceOrientationEventWithPermission
    if (typeof api.requestPermission !== 'function') return false

    try {
        return (await api.requestPermission()) === 'granted'
    } catch {
        return false
    }
}
