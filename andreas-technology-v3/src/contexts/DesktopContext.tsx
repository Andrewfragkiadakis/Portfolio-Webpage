'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { WINDOW_IDS, sectionOf, type AppId, type WindowId } from '@/data/apps'
import { sectionIndex, type SectionId } from '@/data/sections'
import { useIsDesktop } from '@/hooks/useIsDesktop'
import { readActiveSection, useActiveSection } from '@/hooks/useActiveSection'
import { scrollToSection } from '@/utils/smooth-scroll'

/**
 * The window manager. It owns the z-order stack, which window is key (focused), and
 * whether each window is open, minimised to the Dock or closed. Windows register their
 * own handlers so that menu items and Dock clicks run the same animated code paths as
 * the traffic lights. Nothing is ever lost: every hidden window can be restored from
 * its Dock icon, from Window ▸ Restore All, or from the hint left in its place.
 */

export type WindowStatus = 'open' | 'minimized' | 'closed'
export type ProjectsView = 'icons' | 'list'

export interface WindowHandlers {
    minimize: () => void
    close: () => void
    restore: () => void
    toggleZoom: () => void
}

interface DesktopValue {
    isDesktop: boolean | null
    /** The section (space) currently in front. */
    active: SectionId
    /** Back to front. */
    stack: WindowId[]
    keyId: WindowId | null
    status: Record<WindowId, WindowStatus>
    /** Increments on every status change of a window, so a window can tell fresh transitions apart. */
    statusCount: Record<WindowId, number>
    zoomed: Record<WindowId, boolean>
    /** Increments when the viewport is resized: windows snap back to their home positions. */
    layoutEpoch: number
    bounce: { app: AppId; n: number } | null
    projectsView: ProjectsView
    setProjectsView: (view: ProjectsView) => void
    focus: (id: WindowId | null) => void
    setStatus: (id: WindowId, status: WindowStatus) => void
    setZoomed: (id: WindowId, zoomed: boolean) => void
    register: (id: WindowId, handlers: WindowHandlers) => () => void
    minimize: (id: WindowId) => void
    close: (id: WindowId) => void
    toggleZoom: (id: WindowId) => void
    restoreAll: () => void
    /** Bring a window forward the way a Dock click does: restore, travel to its space, bounce, focus. */
    launch: (id: WindowId) => void
    bounceApp: (app: AppId) => void
}

const DesktopContext = createContext<DesktopValue | undefined>(undefined)

const allOpen = () => Object.fromEntries(WINDOW_IDS.map((id) => [id, 'open'])) as Record<WindowId, WindowStatus>
const allZero = () => Object.fromEntries(WINDOW_IDS.map((id) => [id, 0])) as Record<WindowId, number>
const noneZoomed = () => Object.fromEntries(WINDOW_IDS.map((id) => [id, false])) as Record<WindowId, boolean>

/** Time for the horizontal journey to arrive before a restored window flies out of the Dock. */
const RESTORE_AFTER_TRAVEL_MS = 620

export function DesktopProvider({ children }: { children: ReactNode }) {
    const isDesktop = useIsDesktop()
    const active = useActiveSection()
    const [stack, setStack] = useState<WindowId[]>(['terminal', 'about', 'services', 'experience', 'projects', 'contact', 'hero'])
    const [keyId, setKeyId] = useState<WindowId | null>('hero')
    const [status, setStatusMap] = useState(allOpen)
    const [statusCount, setStatusCount] = useState(allZero)
    const [zoomed, setZoomedMap] = useState(noneZoomed)
    const [layoutEpoch, setLayoutEpoch] = useState(0)
    const [bounce, setBounce] = useState<{ app: AppId; n: number } | null>(null)
    const [projectsView, setProjectsView] = useState<ProjectsView>('icons')
    const handlers = useRef(new Map<WindowId, WindowHandlers>())
    const statusRef = useRef(status)
    useEffect(() => {
        statusRef.current = status
    }, [status])

    const focus = useCallback((id: WindowId | null) => {
        setKeyId(id)
        if (id) setStack((s) => (s[s.length - 1] === id ? s : [...s.filter((w) => w !== id), id]))
    }, [])

    const setStatus = useCallback((id: WindowId, next: WindowStatus) => {
        setStatusMap((s) => (s[id] === next ? s : { ...s, [id]: next }))
        setStatusCount((c) => ({ ...c, [id]: c[id] + 1 }))
        if (next !== 'open') {
            // The next open window on the same space becomes key, like macOS.
            setKeyId((k) => (k === id ? null : k))
        }
    }, [])

    const setZoomed = useCallback((id: WindowId, value: boolean) => {
        setZoomedMap((z) => (z[id] === value ? z : { ...z, [id]: value }))
    }, [])

    const register = useCallback((id: WindowId, h: WindowHandlers) => {
        handlers.current.set(id, h)
        return () => {
            if (handlers.current.get(id) === h) handlers.current.delete(id)
        }
    }, [])

    const bounceApp = useCallback((app: AppId) => setBounce((b) => ({ app, n: (b?.n ?? 0) + 1 })), [])

    const minimize = useCallback((id: WindowId) => {
        const h = handlers.current.get(id)
        if (h) h.minimize()
        else setStatus(id, 'minimized')
    }, [setStatus])

    const close = useCallback((id: WindowId) => {
        const h = handlers.current.get(id)
        if (h) h.close()
        else setStatus(id, 'closed')
    }, [setStatus])

    const toggleZoom = useCallback((id: WindowId) => handlers.current.get(id)?.toggleZoom(), [])

    const restore = useCallback((id: WindowId) => {
        const h = handlers.current.get(id)
        if (h) h.restore()
        else setStatus(id, 'open')
    }, [setStatus])

    const restoreAll = useCallback(() => {
        const current = readActiveSection()
        for (const id of WINDOW_IDS) {
            if (statusRef.current[id] === 'open') continue
            // Windows on the visible space animate out of the Dock; the rest simply reopen.
            if (sectionOf(id) === current) restore(id)
            else setStatus(id, 'open')
        }
    }, [restore, setStatus])

    const launch = useCallback((id: WindowId) => {
        const section = sectionOf(id)
        const current = readActiveSection()
        const travel = section !== current
        const hidden = statusRef.current[id] !== 'open'
        if (travel || hidden) bounceApp(id)
        if (travel) scrollToSection(sectionIndex(section), section)
        if (hidden) {
            if (travel) window.setTimeout(() => restore(id), RESTORE_AFTER_TRAVEL_MS)
            else restore(id)
        }
        focus(id)
    }, [bounceApp, focus, restore])

    // The window on the space in front becomes key when the visitor travels there.
    useEffect(() => {
        // Derived from scroll position, which only exists in the browser.
        setKeyId((k) => {
            if (k && sectionOf(k) === active && statusRef.current[k] === 'open') return k
            return statusRef.current[active] === 'open' ? active : null
        })
    }, [active])

    // Resizing resets positions (and zoom); leaving the desktop layout reopens everything,
    // because phones have no Dock to restore from.
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>
        const onResize = () => {
            clearTimeout(timer)
            timer = setTimeout(() => setLayoutEpoch((e) => e + 1), 150)
        }
        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
            clearTimeout(timer)
        }
    }, [])

    useEffect(() => {
        if (isDesktop !== false) return
        // Phones have no Dock, so nothing may stay hidden there.
        /* eslint-disable react-hooks/set-state-in-effect */
        setStatusMap(allOpen())
        setZoomedMap(noneZoomed())
        /* eslint-enable react-hooks/set-state-in-effect */
    }, [isDesktop])

    const value = useMemo<DesktopValue>(() => ({
        isDesktop,
        active,
        stack,
        keyId,
        status,
        statusCount,
        zoomed,
        layoutEpoch,
        bounce,
        projectsView,
        setProjectsView,
        focus,
        setStatus,
        setZoomed,
        register,
        minimize,
        close,
        toggleZoom,
        restoreAll,
        launch,
        bounceApp,
    }), [isDesktop, active, stack, keyId, status, statusCount, zoomed, layoutEpoch, bounce, projectsView, focus, setStatus, setZoomed, register, minimize, close, toggleZoom, restoreAll, launch, bounceApp])

    return <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>
}

export function useDesktop(): DesktopValue {
    const ctx = useContext(DesktopContext)
    if (!ctx) throw new Error('useDesktop must be used within a DesktopProvider')
    return ctx
}
