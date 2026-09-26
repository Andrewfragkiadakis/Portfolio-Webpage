'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useContent } from '@/hooks/useContent'
import { useDesktop } from '@/contexts/DesktopContext'
import { SECTION_IDS } from '@/data/sections'
import type { AppId, WindowId } from '@/data/apps'
import { RESUME_URL } from '@/data/content'
import AppIcon from '@/components/ui/AppIcon'

/** Icon size at rest, at the pointer, and how far (px) the magnification reaches either side. */
const BASE = 48
const PEAK = 66
const REACH = 140

interface DockItemProps {
    app: AppId
    label: string
    mouseX: MotionValue<number>
    running?: boolean
    children: (icon: ReactNode) => ReactNode
}

/**
 * One Dock icon. It grows with the pointer's distance, only while the pointer is over
 * the Dock (the platform behaviour, kept subtle), and bounces when its app is launched.
 */
function DockItem({ app, label, mouseX, running, children }: DockItemProps) {
    const ref = useRef<HTMLDivElement>(null)
    const reduceMotion = useReducedMotion()
    const { bounce } = useDesktop()
    const lift = useMotionValue(0)

    const distance = useTransform(mouseX, (x) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r || !Number.isFinite(x)) return REACH * 2
        return x - (r.left + r.width / 2)
    })
    const target = useTransform(distance, [-REACH, 0, REACH], [BASE, PEAK, BASE])
    const spring = useSpring(target, { mass: 0.1, stiffness: 180, damping: 15 })
    const size = reduceMotion ? BASE : spring

    useEffect(() => {
        if (!bounce || bounce.app !== app || reduceMotion) return
        const controls = animate(lift, [0, -20, 0, -9, 0], {
            duration: 0.9,
            times: [0, 0.25, 0.5, 0.72, 1],
            ease: ['easeOut', 'easeIn', 'easeOut', 'easeIn'],
        })
        return () => controls.stop()
    }, [bounce, app, lift, reduceMotion])

    const icon = (
        <>
            <motion.div ref={ref} data-dock-app={app} className="os-dock-icon relative" style={{ width: size, height: size, y: lift }}>
                <AppIcon app={app} size="100%" />
            </motion.div>
            <span className="os-dock-label" aria-hidden="true">{label}</span>
        </>
    )

    return (
        <li className="relative flex flex-col items-center justify-end h-full">
            {children(icon)}
            <span
                className={`absolute -bottom-[0.3125rem] w-1 h-1 rounded-full bg-[var(--foreground)] transition-opacity duration-200 ${running ? 'opacity-70' : 'opacity-0'}`}
                aria-hidden="true"
            />
        </li>
    )
}

const ITEM = 'os-dock-item relative flex items-end justify-center'

/** Desktop Dock: the six section apps and Terminal, then GitHub, LinkedIn and the résumé. */
export default function Dock() {
    const t = useContent()
    const { active, status, launch } = useDesktop()
    const mouseX = useMotionValue(Infinity)

    const appButton = (id: WindowId, label: string) => (
        <DockItem key={id} app={id} label={label} mouseX={mouseX} running={status[id] !== 'closed'}>
            {(icon) => (
                <button
                    type="button"
                    onClick={() => launch(id)}
                    aria-label={label}
                    aria-current={id === active ? 'true' : undefined}
                    className={ITEM}
                >
                    {icon}
                </button>
            )}
        </DockItem>
    )

    return (
        <nav aria-label="Dock" className="hidden md:block fixed bottom-2 left-1/2 -translate-x-1/2 z-50">
            <ul
                data-dock
                className="os-dock flex items-end gap-1 h-[3.875rem] px-1.5 pb-[0.4375rem] rounded-[1.25rem]"
                onMouseMove={(e) => mouseX.set(e.clientX)}
                onMouseLeave={() => mouseX.set(Infinity)}
            >
                {SECTION_IDS.map((id) => appButton(id, t.os.menus[id]))}
                {appButton('terminal', t.os.apps.terminal)}

                <li className="self-center w-px h-10 mx-1 bg-[var(--hairline-strong)]" aria-hidden="true" />

                <DockItem app="github" label={t.os.desktop.github} mouseX={mouseX}>
                    {(icon) => (
                        <a href={t.github} target="_blank" rel="noopener noreferrer" aria-label={`GitHub profile (${t.os.aria.newTab})`} className={ITEM}>
                            {icon}
                        </a>
                    )}
                </DockItem>
                <DockItem app="linkedin" label={t.os.desktop.linkedin} mouseX={mouseX}>
                    {(icon) => (
                        <a href={t.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn profile (${t.os.aria.newTab})`} className={ITEM}>
                            {icon}
                        </a>
                    )}
                </DockItem>
                <DockItem app="resume" label={t.os.desktop.resume} mouseX={mouseX}>
                    {(icon) => (
                        <a href={RESUME_URL} download aria-label={t.os.aria.resume} className={ITEM}>
                            {icon}
                        </a>
                    )}
                </DockItem>
            </ul>
        </nav>
    )
}
