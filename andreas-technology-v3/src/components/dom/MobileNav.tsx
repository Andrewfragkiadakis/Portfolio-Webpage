'use client'

import { useContent } from '@/hooks/useContent'
import { useDesktopState } from '@/contexts/DesktopContext'
import { useState, useEffect, useRef } from 'react'
import { smoothScrollToElement } from '@/utils/smooth-scroll'
import type { SectionId } from '@/data/sections'
import AppIcon from '@/components/ui/AppIcon'

/** Hide the dock only after a deliberate downward scroll, not on jitter. */
const HIDE_AFTER_SCROLL_PX = 50

const DOCK_APPS: SectionId[] = ['hero', 'about', 'projects', 'contact']

/** Phone-style dock: four apps in a frosted tray that tucks away while reading. */
export default function MobileNav() {
    const t = useContent()
    const active = useDesktopState((s) => s.active)
    const [isVisible, setIsVisible] = useState(true)
    const lastScrollY = useRef(0)

    const go = (id: SectionId) => {
        const element = document.getElementById(id)
        if (element) smoothScrollToElement(element)
    }

    useEffect(() => {
        let ticking = false
        const update = () => {
            const y = window.scrollY
            if (y > lastScrollY.current && y > HIDE_AFTER_SCROLL_PX) setIsVisible(false)
            else if (y < lastScrollY.current || y < HIDE_AFTER_SCROLL_PX) setIsVisible(true)
            lastScrollY.current = y
            ticking = false
        }
        const onScroll = () => {
            if (ticking) return
            ticking = true
            requestAnimationFrame(update)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <div
            className={`md:hidden fixed inset-x-3 z-50 transition-all duration-300 ease-out ${isVisible ? 'bottom-3 opacity-100 translate-y-0' : 'bottom-0 opacity-0 translate-y-4 pointer-events-none'}`}
        >
            <nav className="os-dock [--dock-bg:var(--hud)] mx-auto max-w-sm rounded-[1.75rem] px-3 py-2.5" aria-label="Mobile navigation">
                <ul className="grid grid-cols-4 gap-1">
                    {DOCK_APPS.map((id) => {
                        const isActive = active === id
                        return (
                            <li key={id}>
                                <button
                                    type="button"
                                    onClick={() => go(id)}
                                    aria-current={isActive ? 'true' : undefined}
                                    tabIndex={isVisible ? 0 : -1}
                                    className="w-full flex flex-col items-center gap-0.5 rounded-xl pt-0.5 min-h-11"
                                >
                                    <AppIcon app={id} size={44} />
                                    <span className="text-micro font-medium truncate max-w-full text-[var(--foreground)]">
                                        {t.os.menus[id]}
                                    </span>
                                    <span className={`w-1 h-1 rounded-full bg-[var(--foreground)] ${isActive ? 'opacity-80' : 'opacity-0'}`} aria-hidden="true" />
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </div>
    )
}
