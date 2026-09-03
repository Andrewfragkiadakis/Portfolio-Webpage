'use client'

/**
 * Ambient beams behind the hero.
 *
 * Deliberately not canvas and not WebGL: five blurred, rotated gradient bars animated
 * with `transform`/`opacity` keyframes run entirely on the compositor, cost no main-thread
 * frames, and cannot compete with the LetterGlitch canvas already running in the hero.
 *
 * Colours resolve from `--accent`/`--glow`, so light and dark are both correct with no
 * second definition. Under reduced motion the beams stay — they just stop moving.
 */
const BEAMS = [
    { left: '8%', width: '18rem', delay: '0s', duration: '19s', tilt: '-18deg', opacity: 0.55 },
    { left: '26%', width: '12rem', delay: '-4s', duration: '23s', tilt: '-12deg', opacity: 0.4 },
    { left: '48%', width: '22rem', delay: '-9s', duration: '17s', tilt: '-22deg', opacity: 0.5 },
    { left: '68%', width: '14rem', delay: '-2s', duration: '25s', tilt: '-15deg', opacity: 0.38 },
    { left: '85%', width: '20rem', delay: '-13s', duration: '21s', tilt: '-20deg', opacity: 0.45 },
] as const

export default function BeamsBackground() {
    return (
        <div className="beams" aria-hidden="true">
            {BEAMS.map((beam, index) => (
                <span
                    key={index}
                    className="beams__beam"
                    style={{
                        left: beam.left,
                        width: beam.width,
                        opacity: beam.opacity,
                        animationDelay: beam.delay,
                        animationDuration: beam.duration,
                        '--beam-tilt': beam.tilt,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    )
}
